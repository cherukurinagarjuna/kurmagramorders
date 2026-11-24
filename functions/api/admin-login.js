// POST /api/admin-login
// Cloudflare Pages Function
import { json, signValue } from './_helpers.js';

export async function onRequestPost(context) {
  try {
    let body = {};
    try {
      body = await context.request.json();
    } catch {
      return json(400, { ok: false, error: 'Request body must be valid JSON' });
    }

    const { password } = body;
    const adminPassword = context.env.ADMIN_PASSWORD || 'kurma108';

    if (!password || password !== adminPassword) {
      return json(401, { ok: false, error: 'Wrong password' });
    }

    const secret = context.env.SECRET || adminPassword;
    const cookieValue = await signValue(`admin-${Date.now()}`, secret);

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.append('Set-Cookie', `admin=${encodeURIComponent(cookieValue)}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure`);

    return new Response(JSON.stringify({ ok: true, token: cookieValue }), {
      status: 200,
      headers
    });
  } catch (err) {
    return json(500, { ok: false, error: 'Server error: ' + err.message });
  }
}
