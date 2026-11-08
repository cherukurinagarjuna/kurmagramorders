'use strict';

/**
 * Offline unit tests for track-order.js.
 * Stubs lib/db — no real connection needed.
 */

const path = require('path');

// ── Stub lib/db ───────────────────────────────────────────────
let mockRows = [];

const dbPath = path.resolve(__dirname, '../netlify/functions/lib/db.js');
require.cache[dbPath] = {
  id: dbPath, filename: dbPath, loaded: true,
  exports: {
    getPool: () => ({
      connect: async () => ({
        query:   async () => ({ rows: mockRows }),
        release: () => {},
      }),
    }),
  },
};

process.env.SECRET = 'test-secret-32-chars-long-xxxxxxxx';

const { handler } = require('../netlify/functions/track-order');

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

function get(qs) {
  return handler({
    httpMethod: 'GET',
    headers: {},
    queryStringParameters: Object.fromEntries(new URLSearchParams(qs)),
  });
}

// A realistic fake DB row
const fakeRow = {
  order_code:      'RICE-2026-0001',
  status:          'shipped',
  product_details: 'Sona Masoori 25kg',
  amount:          '1250.00',
  lr_number:       'LR987654',
  transporter:     'Navata',
  created_at:      '2026-11-08T10:00:00.000Z',
  shipped_at:      '2026-11-08T18:00:00.000Z',
  customer_phone:  '+919876543210',
  customer_name:   'Ramesh Kumar',
  // These fields must NOT appear in publicView output:
  delivery_address: '123 Main Street, Hyderabad',
  id:               1,
};

(async () => {

  // ── Method guard ──────────────────────────────────────────────
  await assert('POST → 405',
    () => handler({ httpMethod: 'POST', headers: {}, queryStringParameters: {} }),
    r => r.statusCode === 405);

  // ── Missing params ────────────────────────────────────────────
  await assert('No params → 400',
    () => get(''),
    r => r.statusCode === 400 && r.body.includes('code or phone'));

  // ── Lookup by code ────────────────────────────────────────────
  mockRows = [];
  await assert('code not found → 404',
    () => get('code=RICE-2026-9999'),
    r => r.statusCode === 404 && r.body.includes('not found'));

  mockRows = [fakeRow];
  await assert('code found → 200 with public fields',
    () => get('code=rice-2026-0001'),  // lowercase — must be uppercased
    r => {
      const b = JSON.parse(r.body);
      return r.statusCode === 200
        && b.ok
        && b.orders.length === 1
        && b.orders[0].order_code === 'RICE-2026-0001'
        && b.orders[0].status    === 'shipped';
    });

  await assert('publicView: phone is masked',
    () => get('code=RICE-2026-0001'),
    r => {
      const o = JSON.parse(r.body).orders[0];
      return o.customer_phone === '+9198XXXXX210';
    });

  await assert('publicView: name is first word only',
    () => get('code=RICE-2026-0001'),
    r => JSON.parse(r.body).orders[0].customer_name === 'Ramesh');

  await assert('publicView: no delivery_address in response',
    () => get('code=RICE-2026-0001'),
    r => !('delivery_address' in JSON.parse(r.body).orders[0]));

  await assert('publicView: no id in response',
    () => get('code=RICE-2026-0001'),
    r => !('id' in JSON.parse(r.body).orders[0]));

  await assert('publicView: lr_number and transporter present',
    () => get('code=RICE-2026-0001'),
    r => {
      const o = JSON.parse(r.body).orders[0];
      return o.lr_number === 'LR987654' && o.transporter === 'Navata';
    });

  await assert('publicView: null lr_number for unshipped order',
    () => {
      mockRows = [{ ...fakeRow, lr_number: null, shipped_at: null, status: 'placed' }];
      return get('code=RICE-2026-0001');
    },
    r => {
      const o = JSON.parse(r.body).orders[0];
      return o.lr_number === null && o.shipped_at === null;
    });

  // ── Lookup by phone ───────────────────────────────────────────
  await assert('invalid phone → 400',
    () => get('phone=5000000000'),
    r => r.statusCode === 400 && r.body.includes('Invalid phone'));

  await assert('gibberish phone → 400',
    () => get('phone=abc'),
    r => r.statusCode === 400 && r.body.includes('Invalid phone'));

  mockRows = [];
  await assert('valid phone, no orders → 404',
    () => get('phone=9876543210'),
    r => r.statusCode === 404 && r.body.includes('No orders'));

  mockRows = [fakeRow, { ...fakeRow, order_code: 'RICE-2026-0002', status: 'placed' }];
  await assert('valid phone, 2 orders → 200',
    () => get('phone=9876543210'),
    r => {
      const b = JSON.parse(r.body);
      return r.statusCode === 200 && b.ok && b.orders.length === 2;
    });

  await assert('+91 prefix phone accepted',
    () => get('phone=%2B919876543210'),  // URL-encoded +91...
    r => r.statusCode === 200);

  await assert('code takes priority over phone when both provided',
    () => {
      mockRows = [fakeRow];
      return get('code=RICE-2026-0001&phone=9876543210');
    },
    r => {
      const b = JSON.parse(r.body);
      return r.statusCode === 200 && b.orders[0].order_code === 'RICE-2026-0001';
    });

  // ── Summary ───────────────────────────────────────────────────
  console.log(`\n${pass + fail} tests: ${pass} passed, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
})();
