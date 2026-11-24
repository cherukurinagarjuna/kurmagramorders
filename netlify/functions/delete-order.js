'use strict';

const ordersDb              = require('./lib/orders-db');
const { json, requireAuth } = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// POST or DELETE /api/delete-order
// Deletes an order (admin only).
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'DELETE') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  if (!requireAuth(event)) {
    return json(401, { ok: false, error: 'Unauthorized' });
  }

  let orderId = null;
  let orderNo = null;

  if (event.httpMethod === 'DELETE') {
    const params = event.queryStringParameters || {};
    orderId = params.id;
    orderNo = params.order_no;
  }

  if (!orderId && !orderNo) {
    try {
      const body = JSON.parse(event.body || '{}');
      orderId = body.order_id || body.id;
      orderNo = body.order_no || body.order_code;
    } catch {
      // ignore
    }
  }

  if (!orderId && !orderNo) {
    return json(400, { ok: false, error: 'Provide order_id or order_no to delete' });
  }

  try {
    const deleted = await ordersDb.deleteOrder({ id: orderId, order_no: orderNo });
    if (!deleted) {
      return json(404, { ok: false, error: 'Order not found' });
    }

    return json(200, { ok: true, message: 'Order deleted successfully' });
  } catch (err) {
    console.error('[delete-order error]', err);
    return json(500, { ok: false, error: 'Could not delete order: ' + err.message });
  }
};
