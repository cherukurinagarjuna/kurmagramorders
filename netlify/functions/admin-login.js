'use strict';

const { json, signCookie } = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin-login
// Validates admin password and sets a signed HttpOnly session cookie.
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  // ── Parse body ────────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Request body must be valid JSON' });
  }

  const { password } = body;

  // ── Validate password ─────────────────────────────────────────
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('[admin-login] ADMIN_PASSWORD env var is not set');
    return json(500, { ok: false, error: 'Server misconfiguration' });
  }

  if (!password || password !== adminPassword) {
    return json(401, { ok: false, error: 'Wrong password' });
  }

  // ── Build signed cookie ───────────────────────────────────────
  // Value includes a timestamp so each login produces a unique token.
  const cookieValue = signCookie(`admin-${Date.now()}`);

  const cookie = [
    `admin=${encodeURIComponent(cookieValue)}`,
    'HttpOnly',
    'Path=/',
    'Max-Age=604800',   // 7 days
    'SameSite=Lax',
    // Add Secure in production (Netlify serves over HTTPS automatically)
    ...(process.env.NODE_ENV !== 'development' ? ['Secure'] : []),
  ].join('; ');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie':   cookie,
    },
    body: JSON.stringify({ ok: true }),
  };
};
