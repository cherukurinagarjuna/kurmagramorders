'use strict';

const ordersDb                      = require('./lib/orders-db');
const { json, requireAuth, waLink } = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/mark-shipped
// Marks an order as shipped and returns a wa.me click-to-chat link
// for the admin to send the customer a manual WhatsApp notification.
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

  const { order_id, lr_number, transporter } = body;

  const orderId = parseInt(order_id, 10);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return json(400, { ok: false, error: 'order_id must be a positive integer' });
  }

  const cleanLR = typeof lr_number === 'string' ? lr_number.trim() : '';
  if (!cleanLR) {
    return json(400, { ok: false, error: 'lr_number is required' });
  }

  const cleanTransporter = (
    typeof transporter === 'string' && transporter.trim()
  ) ? transporter.trim() : 'నవత రోడ్ ట్రాన్స్‌పోర్ట్ (Navata Road Transport)';

  try {
    const updated = await ordersDb.updateStatus({
      order_id: orderId,
      status: 'shipped',
      lr_number: cleanLR,
      transporter: cleanTransporter
    });

    if (!updated) {
      return json(404, { ok: false, error: 'Order not found' });
    }

    const msg = `హరే కృష్ణ! మీ కూర్మగ్రామ వేదిక్ విలేజ్ ఆర్డర్ (${updated.order_no}) రవాణా చేయబడింది.\n` +
      `🚚 ట్రాన్స్‌పోర్ట్: ${cleanTransporter}\n` +
      `📦 బిల్టీ/LR నంబర్: ${cleanLR}\n` +
      `ట్రాకింగ్ వివరాలు: https://kurmagramorders.netlify.app/track.html?code=${updated.order_no}\n` +
      `ధన్యవాదాలు! 🙏`;

    const customerWaLink = waLink(updated.customer_phone, msg);

    return json(200, {
      ok: true,
      order: updated,
      wa_link: customerWaLink
    });
  } catch (err) {
    console.error('[mark-shipped] Error:', err.message);
    return json(500, { ok: false, error: 'Could not mark order shipped' });
  }
};
