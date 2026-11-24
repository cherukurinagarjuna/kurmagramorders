// POST /api/update-status
// Cloudflare Pages Function (Admin authenticated)
import { json, requireAuth, waLink } from './_helpers.js';

const ALLOWED_STATUSES = ['received', 'processing', 'shipped', 'delivered', 'placed', 'out_for_delivery', 'cancelled'];

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

    if (context.env && context.env.DB) {
      let updateSql = 'UPDATE orders SET status = ?, updated_at = datetime("now")';
      let updateParams = [status];

      if (lr_number !== undefined) {
        updateSql += ', lr_number = ?';
        updateParams.push(lr_number);
      }
      if (transporter !== undefined) {
        updateSql += ', transporter = ?';
        updateParams.push(transporter);
      }

      updateSql += ' WHERE id = ?';
      updateParams.push(orderId);

      await context.env.DB.prepare(updateSql).bind(...updateParams).run();

      const updated = await context.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first();
      if (!updated) {
        return json(404, { ok: false, error: 'Order not found' });
      }

      let customerWaLink = null;
      if (status === 'shipped' || status === 'delivered') {
        const msg = status === 'shipped'
          ? `హరే కృష్ణ! మీ కూర్మగ్రామ ఆర్డర్ (${updated.order_no}) రవాణా చేయబడింది. Navata LR: ${updated.lr_number || 'త్వరలో లభిస్తుంది'}. వివరాలు: https://kurmagram.pages.dev/track?code=${updated.order_no}`
          : `హరే కృష్ణ! మీ కూర్మగ్రామ ఆర్డర్ (${updated.order_no}) డెలివరీ చేయబడింది. ధన్యవాదాలు! 🙏`;
        customerWaLink = waLink(updated.customer_phone, msg);
      }

      return json(200, {
        ok: true,
        order: updated,
        customer_wa_link: customerWaLink
      });
    }

    return json(200, { ok: true });
  } catch (err) {
    return json(500, { ok: false, error: 'Could not update status: ' + err.message });
  }
}
