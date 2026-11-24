'use strict';

const ordersDb              = require('./lib/orders-db');
const { json, requireAuth } = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/get-order?id=ORDER_ID or ?code=ORDER_CODE
// Returns full details for a single order (admin only).
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  // ── Auth guard ────────────────────────────────────────────────
  if (!requireAuth(event)) {
    return json(401, { ok: false, error: 'Unauthorized' });
  }

  const { id, code } = event.queryStringParameters || {};
  if (!id && !code) {
    return json(400, { ok: false, error: 'Provide either id or code as query parameter' });
  }

  try {
    const order = await ordersDb.getOrder({ id, code });

    if (!order) {
      return json(404, { ok: false, error: 'Order not found' });
    }

    return json(200, {
      ok:    true,
      order: order,
    });
  } catch (err) {
    console.error('[get-order] Error:', err.message);
    return json(500, { ok: false, error: 'Could not fetch order' });
  }
};
