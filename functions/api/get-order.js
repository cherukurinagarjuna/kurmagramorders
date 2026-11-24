// GET /api/get-order
// Cloudflare Pages Function (Admin authenticated)
import { json, requireAuth } from './_helpers.js';

export async function onRequestGet(context) {
  try {
    const isAuthed = await requireAuth(context);
    if (!isAuthed) {
      return json(401, { ok: false, error: 'Unauthorized' });
    }

    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const code = url.searchParams.get('code');

    if (!id && !code) {
      return json(400, { ok: false, error: 'Provide either id or code as query parameter' });
    }

    if (context.env && context.env.DB) {
      let query = 'SELECT * FROM orders WHERE ';
      let params = [];
      if (id) {
        query += 'id = ?';
        params.push(id);
      } else {
        query += '(order_no = ? OR order_code = ?)';
        params.push(code, code);
      }

      const row = await context.env.DB.prepare(query).bind(...params).first();
      if (!row) {
        return json(404, { ok: false, error: 'Order not found' });
      }

      row.items = typeof row.items === 'string' ? JSON.parse(row.items || '[]') : (row.items || []);
      return json(200, { ok: true, order: row });
    }

    return json(404, { ok: false, error: 'Order not found' });
  } catch (err) {
    return json(500, { ok: false, error: 'Could not fetch order: ' + err.message });
  }
}
