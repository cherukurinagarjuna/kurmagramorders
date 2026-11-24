// POST & DELETE /api/delete-order
// Cloudflare Pages Function (Admin authenticated)
import { json, requireAuth } from './_helpers.js';

export async function onRequest(context) {
  const method = context.request.method;
  if (method !== 'POST' && method !== 'DELETE') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  try {
    const isAuthed = await requireAuth(context);
    if (!isAuthed) {
      return json(401, { ok: false, error: 'Unauthorized' });
    }

    let orderId = null;
    let orderNo = null;

    if (method === 'DELETE') {
      const url = new URL(context.request.url);
      orderId = url.searchParams.get('id');
      orderNo = url.searchParams.get('order_no');
    }

    if (!orderId && !orderNo) {
      try {
        const body = await context.request.json();
        orderId = body.order_id || body.id;
        orderNo = body.order_no || body.order_code;
      } catch {
        // ignore JSON parse error if body is empty
      }
    }

    const cleanId = orderId ? parseInt(orderId, 10) : null;
    const cleanNo = orderNo ? String(orderNo).trim() : null;

    if (!cleanId && !cleanNo) {
      return json(400, { ok: false, error: 'Provide order_id or order_no to delete' });
    }

    if (context.env && context.env.DB) {
      let query = 'DELETE FROM orders WHERE ';
      let params = [];

      if (cleanId && cleanNo) {
        query += 'id = ? OR order_no = ? OR order_code = ?';
        params.push(cleanId, cleanNo, cleanNo);
      } else if (cleanId) {
        query += 'id = ?';
        params.push(cleanId);
      } else {
        query += 'order_no = ? OR order_code = ?';
        params.push(cleanNo, cleanNo);
      }

      await context.env.DB.prepare(query).bind(...params).run();

      return json(200, {
        ok: true,
        message: 'Order deleted successfully from D1 database'
      });
    }

    return json(200, { ok: true, message: 'Order deleted' });
  } catch (err) {
    console.error('[delete-order error]', err);
    return json(500, { ok: false, error: 'Could not delete order: ' + err.message });
  }
}
