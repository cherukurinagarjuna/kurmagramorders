'use strict';

const { json, requireAuth } = require('./lib/helpers');

/**
 * GET /api/list-orders
 * Returns all orders for the admin dashboard.
 * Business logic will be implemented in Phase 2.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  const authError = requireAuth(event);
  if (authError) return authError;

  // TODO: query DB for all orders (with pagination), return list
  return json(200, { ok: true, orders: [] });
};
