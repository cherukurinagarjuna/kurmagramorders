'use strict';

const { json } = require('./lib/helpers');

/**
 * GET /api/track-order?token=<token>
 * Returns public-safe order status for the customer tracking page.
 * Business logic will be implemented in Phase 2.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  const { token } = event.queryStringParameters || {};
  if (!token) {
    return json(400, { ok: false, error: 'token is required' });
  }

  // TODO: look up order by token, return masked phone, status, timestamps
  return json(200, { ok: true, order: null });
};
