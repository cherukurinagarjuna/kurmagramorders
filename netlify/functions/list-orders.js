'use strict';

const ordersDb              = require('./lib/orders-db');
const { json, requireAuth } = require('./lib/helpers');

const PAGE_SIZE = 50;

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/list-orders
// Returns a paginated list of orders for the admin dashboard.
// Query params:
//   status  — filter by order status (received|processing|shipped|delivered|cancelled)
//   q       — search string matched against order_code, customer_name, customer_phone
//   page    — page number, 1-based (default 1)
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  // ── Auth guard ────────────────────────────────────────────────
  if (!requireAuth(event)) {
    return json(401, { ok: false, error: 'Unauthorized' });
  }

  // ── Parse query params ────────────────────────────────────────
  const params = event.queryStringParameters || {};
  const status = params.status || null;
  const q      = (params.q || '').trim() || null;
  const page   = Math.max(1, parseInt(params.page, 10) || 1);

  try {
    const result = await ordersDb.listOrders({
      status,
      q,
      page,
      limit: PAGE_SIZE
    });

    return json(200, {
      ok:     true,
      orders: result.orders,
      total:  result.total,
      page:   result.page,
      limit:  result.limit,
    });
  } catch (err) {
    console.error('[list-orders] Error:', err.message);
    return json(500, { ok: false, error: 'Could not fetch orders: ' + err.message });
  }
};
