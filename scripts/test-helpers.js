'use strict';

process.env.SECRET = 'test-secret-for-smoke-test';

const {
  json,
  normalizeIndianPhone,
  maskPhone,
  waLink,
  signCookie,
  verifyCookie,
  requireAuth,
} = require('../netlify/functions/lib/helpers');

let pass = 0, fail = 0;

function assert(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log((ok ? '  ✅' : '  ❌') + '  ' + label);
  if (!ok) console.log('       got:', actual, '\n  expected:', expected);
  ok ? pass++ : fail++;
}

// ── 1. json ───────────────────────────────────────────────────
const r = json(200, { ok: true });
assert('json statusCode',              r.statusCode,                     200);
assert('json Content-Type',            r.headers['Content-Type'],        'application/json');
assert('json body',                    r.body,                           '{"ok":true}');

// ── 2. normalizeIndianPhone ───────────────────────────────────
assert('10-digit plain',               normalizeIndianPhone('9876543210'),      '+919876543210');
assert('+91 prefix',                   normalizeIndianPhone('+919876543210'),   '+919876543210');
assert('91 prefix (no +)',             normalizeIndianPhone('919876543210'),    '+919876543210');
assert('0 prefix',                     normalizeIndianPhone('09876543210'),     '+919876543210');
assert('spaces ignored',               normalizeIndianPhone('98765 43210'),     '+919876543210');
assert('starts with 6',               normalizeIndianPhone('6000000000'),      '+916000000000');
assert('invalid — starts with 5',     normalizeIndianPhone('5000000000'),      null);
assert('invalid — too short',         normalizeIndianPhone('12345'),           null);
assert('null input',                   normalizeIndianPhone(null),              null);

// ── 3. maskPhone ──────────────────────────────────────────────
assert('mask +919876543210',          maskPhone('+919876543210'),   '+9198XXXXX210');
assert('mask short string',           maskPhone('+9112'),           '+9112');
assert('mask empty',                  maskPhone(''),                '***');

// ── 4. waLink ─────────────────────────────────────────────────
assert('waLink basic',
  waLink('+919876543210', 'Hello World'),
  'https://wa.me/919876543210?text=Hello%20World'
);
assert('waLink strips non-digits',
  waLink('+91 98765 43210', 'Hi'),
  'https://wa.me/919876543210?text=Hi'
);

// ── 5 & 6. signCookie / verifyCookie ─────────────────────────
const token = signCookie('admin');
assert('signCookie format (has dot)',  token.includes('.'),          true);
assert('verifyCookie valid',           verifyCookie(token),          true);
assert('verifyCookie tampered value',  verifyCookie('evil.' + token.split('.')[1]), false);
assert('verifyCookie tampered sig',    verifyCookie(token.split('.')[0] + '.badhex'), false);
assert('verifyCookie empty string',    verifyCookie(''),             false);
assert('verifyCookie null',            verifyCookie(null),           false);

// ── 7. requireAuth ────────────────────────────────────────────
const goodToken  = encodeURIComponent(signCookie('admin'));
const badToken   = encodeURIComponent('admin.invalidsig');

assert('requireAuth valid cookie',
  requireAuth({ headers: { cookie: `admin=${goodToken}; Path=/` } }),
  true
);
assert('requireAuth bad sig',
  requireAuth({ headers: { cookie: `admin=${badToken}` } }),
  false
);
assert('requireAuth missing cookie',
  requireAuth({ headers: {} }),
  false
);
assert('requireAuth no headers',
  requireAuth({}),
  false
);

// ── Summary ───────────────────────────────────────────────────
console.log(`\n${pass + fail} tests: ${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
