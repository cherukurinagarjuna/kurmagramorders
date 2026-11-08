'use strict';

const { json } = require('./lib/helpers');

/**
 * POST /api/admin-login
 * Validates the admin password and sets a signed session cookie.
 * Business logic will be implemented in Phase 2.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  // TODO: parse body.password, compare to process.env.ADMIN_PASSWORD,
  //       call signCookie, set Set-Cookie header with HttpOnly; Secure; SameSite=Strict
  return json(200, { ok: true });
};
