// GET /api/track-order
// Cloudflare Pages Function
import { json, maskPhone, normalizeIndianPhone } from './_helpers.js';

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const code = (url.searchParams.get('code') || '').trim();
    const phone = (url.searchParams.get('phone') || '').trim();

    if (!code && !phone) {
      return json(400, { ok: false, error: 'Provide either code or phone as a query parameter' });
    }

    if (context.env && context.env.DB) {
      let query = 'SELECT * FROM orders WHERE ';
      let params = [];
      if (code) {
        query += '(order_no = ? OR order_code = ?)';
        params.push(code, code);
      } else {
        const normPhone = normalizeIndianPhone(phone);
        query += '(customer_phone = ? OR customer_phone = ?)';
        params.push(phone, normPhone || phone);
      }
      query += ' ORDER BY created_at DESC LIMIT 10';

      const result = await context.env.DB.prepare(query).bind(...params).all();
      const rows = result.results || [];
      if (rows.length === 0) {
        return json(404, { ok: false, error: 'Order not found' });
      }

      const orders = rows.map(r => ({
        ...r,
        customer_phone: maskPhone(r.customer_phone),
        items: typeof r.items === 'string' ? JSON.parse(r.items || '[]') : (r.items || [])
      }));

      return json(200, { ok: true, orders });
    }

    return json(404, { ok: false, error: 'Order not found. Please verify with WhatsApp support at +91 7732075607.' });
  } catch (err) {
    return json(500, { ok: false, error: 'Could not track order: ' + err.message });
  }
}
