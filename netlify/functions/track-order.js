'use strict';

const ordersDb = require('./lib/orders-db');
const { json }  = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// Handler
// GET /api/track-order?code=KG-20261123-7454
// GET /api/track-order?phone=9876543210
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  const params = event.queryStringParameters || {};
  const code   = (params.code  || '').trim();
  const phone  = (params.phone || '').trim();

  // ── Require at least one param ────────────────────────────────
  if (!code && !phone) {
    return json(400, { ok: false, error: 'Provide either code or phone as a query parameter' });
  }

  try {
    const orders = await ordersDb.trackOrder({ code, phone });

    if (!orders || orders.length === 0) {
      return json(404, { ok: false, error: 'Order not found' });
    }

    return json(200, {
      ok:     true,
      orders,
    });
  } catch (err) {
    console.error('[track-order] Error:', err.message);
    return json(500, { ok: false, error: 'Could not track order' });
  }
};
