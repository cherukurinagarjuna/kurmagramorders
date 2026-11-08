'use strict';

/**
 * Offline unit test for create-order validation logic.
 * Mocks the DB pool so no real connection is needed.
 */

const path = require('path');

// ── Stub lib/db before create-order.js loads it ───────────────
const dbPath = path.resolve(__dirname, '../netlify/functions/lib/db.js');
require.cache[dbPath] = {
  id:       dbPath,
  filename: dbPath,
  loaded:   true,
  exports:  {
    getPool: () => {
      // Return a fake pool whose connect() throws so the transaction
      // fails fast (simulating a DB being unreachable in test).
      return {
        connect: async () => {
          throw new Error('mock DB — not connected');
        },
      };
    },
  },
};

process.env.SECRET        = 'test-secret';
process.env.BUSINESS_NAME = 'Test Rice Co';

const { handler } = require('../netlify/functions/create-order');

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

function makeEvent(overrides = {}) {
  return {
    httpMethod: 'POST',
    headers: {},
    body: JSON.stringify({
      name:            'Ramesh Kumar',
      phone:           '9876543210',
      address:         '123 Main Street, Hyderabad, Telangana 500001',
      product_details: 'Sona Masoori 25kg',
      amount:          1250,
      ...overrides,
    }),
  };
}

(async () => {
  // ── Method guard ──────────────────────────────────────────────
  await assert('GET → 405',
    () => handler({ httpMethod: 'GET', headers: {} }),
    r => r.statusCode === 405);

  // ── Bad JSON ──────────────────────────────────────────────────
  await assert('Malformed JSON → 400',
    () => handler({ httpMethod: 'POST', headers: {}, body: '{bad json' }),
    r => r.statusCode === 400 && r.body.includes('JSON'));

  // ── name ──────────────────────────────────────────────────────
  await assert('name = "A" (1 char) → 400',
    () => handler(makeEvent({ name: 'A' })),
    r => r.statusCode === 400 && r.body.includes('name'));

  await assert('name = 101 chars → 400',
    () => handler(makeEvent({ name: 'A'.repeat(101) })),
    r => r.statusCode === 400 && r.body.includes('name'));

  await assert('name = "  " (spaces only) → 400',
    () => handler(makeEvent({ name: '   ' })),
    r => r.statusCode === 400 && r.body.includes('name'));

  await assert('name = 2 chars → passes validation (hits mock DB → 500)',
    () => handler(makeEvent({ name: 'AB' })),
    r => r.statusCode === 500);

  // ── phone ─────────────────────────────────────────────────────
  await assert('phone starts with 5 → 400',
    () => handler(makeEvent({ phone: '5000000000' })),
    r => r.statusCode === 400 && r.body.includes('phone'));

  await assert('phone too short → 400',
    () => handler(makeEvent({ phone: '12345' })),
    r => r.statusCode === 400 && r.body.includes('phone'));

  await assert('phone with +91 prefix → passes validation (mock DB → 500)',
    () => handler(makeEvent({ phone: '+919876543210' })),
    r => r.statusCode === 500);

  await assert('phone with 91 prefix → passes validation (mock DB → 500)',
    () => handler(makeEvent({ phone: '919876543210' })),
    r => r.statusCode === 500);

  await assert('phone with 0 prefix → passes validation (mock DB → 500)',
    () => handler(makeEvent({ phone: '09876543210' })),
    r => r.statusCode === 500);

  // ── address ───────────────────────────────────────────────────
  await assert('address too short (< 10 chars) → 400',
    () => handler(makeEvent({ address: 'Short' })),
    r => r.statusCode === 400 && r.body.includes('address'));

  await assert('address 501 chars → 400',
    () => handler(makeEvent({ address: 'A'.repeat(501) })),
    r => r.statusCode === 400 && r.body.includes('address'));

  // ── product_details ───────────────────────────────────────────
  await assert('product_details = "AB" (2 chars) → 400',
    () => handler(makeEvent({ product_details: 'AB' })),
    r => r.statusCode === 400 && r.body.includes('product_details'));

  await assert('product_details = 301 chars → 400',
    () => handler(makeEvent({ product_details: 'X'.repeat(301) })),
    r => r.statusCode === 400 && r.body.includes('product_details'));

  // ── amount ────────────────────────────────────────────────────
  await assert('amount = 0 → 400',
    () => handler(makeEvent({ amount: 0 })),
    r => r.statusCode === 400 && r.body.includes('amount'));

  await assert('amount = -100 → 400',
    () => handler(makeEvent({ amount: -100 })),
    r => r.statusCode === 400 && r.body.includes('amount'));

  await assert('amount = "abc" → 400',
    () => handler(makeEvent({ amount: 'abc' })),
    r => r.statusCode === 400 && r.body.includes('amount'));

  await assert('amount = Infinity → 400',
    () => handler(makeEvent({ amount: Infinity })),
    r => r.statusCode === 400 && r.body.includes('amount'));

  await assert('amount = "1250" (numeric string) → passes validation (mock DB → 500)',
    () => handler(makeEvent({ amount: '1250' })),
    r => r.statusCode === 500);

  await assert('all valid → passes validation (mock DB → 500)',
    () => handler(makeEvent()),
    r => r.statusCode === 500);

  // ── Summary ───────────────────────────────────────────────────
  console.log(`\n${pass + fail} tests: ${pass} passed, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
})();
