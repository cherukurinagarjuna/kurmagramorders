// POST /api/mark-shipped
// Cloudflare Pages Function (Admin authenticated)
import { json, requireAuth, waLink } from './_helpers.js';

export async function onRequestPost(context) {
  try {
    const isAuthed = await requireAuth(context);
    if (!isAuthed) {
      return json(401, { ok: false, error: 'Unauthorized' });
    }

    let body = {};
    try {
      body = await context.request.json();
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

    const cleanTransporter = (typeof transporter === 'string' && transporter.trim())
      ? transporter.trim()
      : 'నవత రోడ్ ట్రాన్స్‌పోర్ట్ (Navata Road Transport)';

    if (context.env && context.env.DB) {
      await context.env.DB.prepare(`
        UPDATE orders 
        SET status = 'shipped', lr_number = ?, transporter = ?, updated_at = datetime('now')
        WHERE id = ?
      `).bind(cleanLR, cleanTransporter, orderId).run();

      const updated = await context.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first();
      if (!updated) {
        return json(404, { ok: false, error: 'Order not found' });
      }

      const msg = `హరే కృష్ణ! మీ కూర్మగ్రామ వేదిక్ విలేజ్ ఆర్డర్ (${updated.order_no}) రవాణా చేయబడింది.\n` +
        `🚚 ట్రాన్స్‌పోర్ట్: ${cleanTransporter}\n` +
        `📦 బిల్టీ/LR నంబర్: ${cleanLR}\n` +
        `ట్రాకింగ్ వివరాలు: https://kurmagram.pages.dev/track?code=${updated.order_no}\n` +
        `నవత ట్రాన్స్‌పోర్ట్ ఫ్రైట్ ఛార్జీలు గమ్యస్థానంలో చెల్లించగలరు (To-Pay).\n` +
        `ధన్యవాదాలు! (Thank you!) 🙏`;

      const customerWaLink = waLink(updated.customer_phone, msg);

      return json(200, {
        ok: true,
        order: updated,
        customer_wa_link: customerWaLink
      });
    }

    return json(200, { ok: true });
  } catch (err) {
    return json(500, { ok: false, error: 'Could not mark order as shipped: ' + err.message });
  }
}
