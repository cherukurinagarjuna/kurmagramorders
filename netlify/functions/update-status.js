'use strict';

const ordersDb                      = require('./lib/orders-db');
const { json, requireAuth, waLink } = require('./lib/helpers');

const ALLOWED_STATUSES = ['received', 'processing', 'shipped', 'delivered', 'placed', 'out_for_delivery', 'cancelled'];

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/update-status
// Updates an order status (admin only).
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  // ── Auth guard ────────────────────────────────────────────────
  if (!requireAuth(event)) {
    return json(401, { ok: false, error: 'Unauthorized' });
  }

  // ── Parse body ────────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Request body must be valid JSON' });
  }

  const { order_id, status, lr_number, transporter } = body;

  const orderId = parseInt(order_id, 10);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return json(400, { ok: false, error: 'order_id must be a positive integer' });
  }

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return json(400, {
      ok: false,
      error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
    });
  }

  try {
    const updated = await ordersDb.updateStatus({
      order_id: orderId,
      status,
      lr_number,
      transporter
    });

    if (!updated) {
      return json(404, { ok: false, error: 'Order not found' });
    }

    let customerWaLink = null;
    if (status === 'shipped' || status === 'delivered') {
      const msg = status === 'shipped'
        ? `హరే కృష్ణ! మీ కూర్మగ్రామ ఆర్డర్ (${updated.order_no}) రవాణా చేయబడింది. Navata LR: ${updated.lr_number || 'త్వరలో లభిస్తుంది'}. వివరాలు: https://kurmagramorders.netlify.app/track.html?code=${updated.order_no}`
        : `హరే కృష్ణ! మీ కూర్మగ్రామ ఆర్డర్ (${updated.order_no}) డెలివరీ చేయబడింది. ధన్యవాదాలు! 🙏`;
      customerWaLink = waLink(updated.customer_phone, msg);
    }

    return json(200, {
      ok: true,
      order: updated,
      customer_wa_link: customerWaLink
    });
  } catch (err) {
    console.error('[update-status] Error:', err.message);
    return json(500, { ok: false, error: 'Could not update status' });
  }
};
