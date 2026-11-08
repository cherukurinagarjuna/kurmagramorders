'use strict';

/**
 * Offline unit tests for admin-login, list-orders, mark-shipped.
 * Uses require.cache stubs — no real DB or network needed.
 */

const path = require('path');

// ── Stub lib/db ───────────────────────────────────────────────
const dbPath = path.resolve(__dirname, '../netlify/functions/lib/db.js');

// We'll swap the mock per-test-suite below
let mockQueryFn = async () => { throw new Error('mockQueryFn not set'); };
let mockRowCount = 0;

require.cache[dbPath] = {
  id: dbPath, filename: dbPath, loaded: true,
  exports: {
    getPool: () => ({
      connect: async () => ({
        query:   async (sql, vals) => mockQueryFn(sql, vals),
        release: () => {},
      }),
    }),
  },
};

// ── Env ───────────────────────────────────────────────────────
process.env.SECRET         = 'test-secret-32-chars-long-xxxxxxxx';
process.env.ADMIN_PASSWORD = 'correcthorsebatterystaple';
process.env.BUSINESS_NAME  = 'Test Rice Co';
process.env.SITE_URL       = 'https://example.netlify.app';
process.env.NODE_ENV       = 'development'; // skip Secure flag in tests

const { signCookie } = require('../netlify/functions/lib/helpers');

// ── Load handlers (after cache stubs) ────────────────────────
const { handler: loginHandler   } = require('../netlify/functions/admin-login');
const { handler: listHandler    } = require('../netlify/functions/list-orders');
const { handler: shipHandler    } = require('../netlify/functions/mark-shipped');

let pass = 0, fail = 0;

async function assert(label, fn, check) {
  try {
    const result = await fn();
    const ok = check(result);
    console.log((ok ? '  ✅' : '  ❌') + '  ' + label);
    if (!ok) console.log('       got:', JSON.stringify(result));
    ok ? pass++ : fail++;
  } catch (e) {
    console.log('  ❌  ' + label, '(threw)', e.message);
    fail++;
  }
}

function post(handler, body, cookieHeader = '') {
  return handler({
    httpMethod: 'POST',
    headers: { cookie: cookieHeader },
    body: JSON.stringify(body),
  });
}

function get(handler, qs = '', cookieHeader = '') {
  return handler({
    httpMethod: 'GET',
    headers: { cookie: cookieHeader },
    queryStringParameters: Object.fromEntries(new URLSearchParams(qs)),
  });
}

// Build a valid admin cookie
const validCookie = `admin=${encodeURIComponent(signCookie('admin-' + Date.now()))}`;
const badCookie   = 'admin=tampered.invalidsig';

(async () => {

  // ════════════════════════════════════════════════════════════
  console.log('\n── admin-login ──────────────────────────────────────');
  // ════════════════════════════════════════════════════════════

  await assert('GET → 405',
    () => loginHandler({ httpMethod: 'GET', headers: {} }),
    r => r.statusCode === 405);

  await assert('Bad JSON → 400',
    () => loginHandler({ httpMethod: 'POST', headers: {}, body: '{bad' }),
    r => r.statusCode === 400);

  await assert('Wrong password → 401',
    () => post(loginHandler, { password: 'wrongpassword' }),
    r => r.statusCode === 401 && r.body.includes('Wrong password'));

  await assert('Empty password → 401',
    () => post(loginHandler, { password: '' }),
    r => r.statusCode === 401);

  await assert('Correct password → 200 + Set-Cookie',
    () => post(loginHandler, { password: 'correcthorsebatterystaple' }),
    r => {
      const body = JSON.parse(r.body);
      return r.statusCode === 200
        && body.ok === true
        && typeof r.headers['Set-Cookie'] === 'string'
        && r.headers['Set-Cookie'].includes('admin=')
        && r.headers['Set-Cookie'].includes('HttpOnly')
        && r.headers['Set-Cookie'].includes('SameSite=Lax');
    });

  // ════════════════════════════════════════════════════════════
  console.log('\n── list-orders ──────────────────────────────────────');
  // ════════════════════════════════════════════════════════════

  await assert('POST → 405',
    () => listHandler({ httpMethod: 'POST', headers: {} }),
    r => r.statusCode === 405);

  await assert('No cookie → 401',
    () => get(listHandler, '', ''),
    r => r.statusCode === 401);

  await assert('Bad cookie → 401',
    () => get(listHandler, '', badCookie),
    r => r.statusCode === 401);

  // DB returns empty list
  mockQueryFn = async (sql) => {
    if (sql.includes('COUNT')) return { rows: [{ total: '0' }] };
    return { rows: [] };
  };

  await assert('Valid auth + empty DB → 200 { orders:[], total:0 }',
    () => get(listHandler, '', validCookie),
    r => {
      const b = JSON.parse(r.body);
      return r.statusCode === 200 && b.ok && b.total === 0 && Array.isArray(b.orders);
    });

  // DB returns 2 rows
  const fakeOrders = [
    { id: 2, order_code: 'RICE-2026-0002', customer_name: 'Priya', status: 'placed' },
    { id: 1, order_code: 'RICE-2026-0001', customer_name: 'Ramesh', status: 'shipped' },
  ];
  mockQueryFn = async (sql) => {
    if (sql.includes('COUNT')) return { rows: [{ total: '2' }] };
    return { rows: fakeOrders };
  };

  await assert('Valid auth + 2 rows → 200 with orders array',
    () => get(listHandler, '', validCookie),
    r => {
      const b = JSON.parse(r.body);
      return r.statusCode === 200 && b.total === 2 && b.orders.length === 2 && b.limit === 20;
    });

  await assert('page=2 → page echoed back',
    () => get(listHandler, 'page=2', validCookie),
    r => JSON.parse(r.body).page === 2);

  // ════════════════════════════════════════════════════════════
  console.log('\n── mark-shipped ─────────────────────────────────────');
  // ════════════════════════════════════════════════════════════

  await assert('GET → 405',
    () => shipHandler({ httpMethod: 'GET', headers: {} }),
    r => r.statusCode === 405);

  await assert('No cookie → 401',
    () => post(shipHandler, { order_id: 1, lr_number: 'LR123' }, ''),
    r => r.statusCode === 401);

  await assert('Bad cookie → 401',
    () => post(shipHandler, { order_id: 1, lr_number: 'LR123' }, badCookie),
    r => r.statusCode === 401);

  await assert('Missing order_id → 400',
    () => post(shipHandler, { lr_number: 'LR123' }, validCookie),
    r => r.statusCode === 400 && r.body.includes('order_id'));

  await assert('order_id = 0 → 400',
    () => post(shipHandler, { order_id: 0, lr_number: 'LR123' }, validCookie),
    r => r.statusCode === 400 && r.body.includes('order_id'));

  await assert('Missing lr_number → 400',
    () => post(shipHandler, { order_id: 1 }, validCookie),
    r => r.statusCode === 400 && r.body.includes('lr_number'));

  await assert('Empty lr_number → 400',
    () => post(shipHandler, { order_id: 1, lr_number: '  ' }, validCookie),
    r => r.statusCode === 400 && r.body.includes('lr_number'));

  // DB: order not found (rowCount === 0)
  mockQueryFn = async (sql) => {
    if (sql.trim().startsWith('BEGIN') || sql.trim().startsWith('ROLLBACK')) return {};
    if (sql.includes('UPDATE')) return { rowCount: 0, rows: [] };
    return { rows: [] };
  };

  await assert('Order not found → 404',
    () => post(shipHandler, { order_id: 999, lr_number: 'LR999' }, validCookie),
    r => r.statusCode === 404 && r.body.includes('not found'));

  // DB: success
  mockQueryFn = async (sql) => {
    if (sql.trim().startsWith('BEGIN') || sql.trim().startsWith('COMMIT')) return {};
    if (sql.includes('UPDATE')) return {
      rowCount: 1,
      rows: [{ order_code: 'RICE-2026-0001', customer_name: 'Ramesh', customer_phone: '+919876543210' }],
    };
    if (sql.includes('INSERT INTO notification_log')) return { rows: [] };
    return { rows: [] };
  };

  await assert('Valid ship → 200 + wa_link',
    () => post(shipHandler, { order_id: 1, lr_number: 'LR001', transporter: 'DTDC' }, validCookie),
    r => {
      const b = JSON.parse(r.body);
      return r.statusCode === 200
        && b.ok === true
        && typeof b.wa_link === 'string'
        && b.wa_link.startsWith('https://wa.me/')
        && b.wa_link.includes('RICE-2026-0001')
        && b.wa_link.includes('DTDC')
        && b.wa_link.includes('LR001');
    });

  await assert('Default transporter = Navata when omitted',
    () => post(shipHandler, { order_id: 1, lr_number: 'LR001' }, validCookie),
    r => {
      const b = JSON.parse(r.body);
      return b.ok && decodeURIComponent(b.wa_link).includes('Navata');
    });

  // ════════════════════════════════════════════════════════════
  console.log(`\n${pass + fail} tests: ${pass} passed, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
})();
