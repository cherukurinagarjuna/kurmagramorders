// GET /api/list-orders
// Cloudflare Pages Function (Admin authenticated)
import { json, requireAuth } from './_helpers.js';

export async function onRequestGet(context) {
  try {
    const isAuthed = await requireAuth(context);
    if (!isAuthed) {
      return json(401, { ok: false, error: 'Unauthorized' });
    }

    const url = new URL(context.request.url);
    const status = url.searchParams.get('status') || null;
    const q = (url.searchParams.get('q') || '').trim() || null;
    const page = Math.max(1, parseInt(url.searchParams.get('page'), 10) || 1);
    const limit = 50;
    const offset = (page - 1) * limit;

    if (context.env && context.env.DB) {
      let conditions = [];
      let params = [];

      if (status) {
        conditions.push('status = ?');
        params.push(status);
      }
      if (q) {
        conditions.push('(order_no LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)');
        const wild = `%${q}%`;
        params.push(wild, wild, wild);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countRes = await context.env.DB.prepare(`SELECT COUNT(*) as count FROM orders ${whereClause}`).bind(...params).first();
      const total = countRes ? countRes.count : 0;

      const query = `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      const rowsRes = await context.env.DB.prepare(query).bind(...params, limit, offset).all();
      const orders = (rowsRes.results || []).map(r => ({
        ...r,
        items: typeof r.items === 'string' ? JSON.parse(r.items || '[]') : (r.items || [])
      }));

      return json(200, {
        ok: true,
        orders,
        total,
        page,
        limit
      });
    }

    return json(200, {
      ok: true,
      orders: [],
      total: 0,
      page: 1,
      limit: 50,
      note: 'D1 Database not yet attached'
    });
  } catch (err) {
    return json(500, { ok: false, error: 'Could not fetch orders: ' + err.message });
  }
}
