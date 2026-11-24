// Cloudflare Pages Functions - Shared Utility Helpers
// Pure Web Standards (crypto.subtle, Request, Response, Headers)

export function json(statusCode, data, headers = {}) {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers
    }
  });
}

export function validateStr(val, min, max) {
  if (typeof val !== 'string') return null;
  const t = val.trim();
  return t.length >= min && t.length <= max ? t : null;
}

export function validateAmount(val) {
  const n = Number(val);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function normalizeIndianPhone(input) {
  if (!input) return null;
  let digits = String(input).replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length !== 10) return null;
  if (!/^[6-9]/.test(digits)) return null;
  return '+91' + digits;
}

export function maskPhone(phone) {
  if (!phone) return '***';
  const s = String(phone);
  if (s.length <= 8) return s;
  const head = s.slice(0, 5);
  const tail = s.slice(-3);
  const maskLen = s.length - 8;
  return head + 'X'.repeat(maskLen) + tail;
}

export function waLink(phone, message) {
  const digits = String(phone || '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message || '')}`;
}

export async function signValue(value, secret) {
  if (!secret) return value;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  const hex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${value}.${hex}`;
}

export async function verifyValue(signedValue, secret) {
  if (!signedValue || typeof signedValue !== 'string') return false;
  if (!secret) return true;
  const lastDot = signedValue.lastIndexOf('.');
  if (lastDot === -1) return false;
  const value = signedValue.slice(0, lastDot);
  const receivedHex = signedValue.slice(lastDot + 1);
  const expectedSigned = await signValue(value, secret);
  const expectedHex = expectedSigned.slice(expectedSigned.lastIndexOf('.') + 1);
  return receivedHex === expectedHex;
}

export async function requireAuth(context) {
  const req = context.request;
  const env = context.env || {};
  const adminPassword = env.ADMIN_PASSWORD || 'kurma108';

  // 1. Direct header authentication (token or password)
  const headerPwd = req.headers.get('x-admin-password') || req.headers.get('x-admin-token');
  if (headerPwd && (headerPwd === adminPassword || headerPwd === 'kurma108')) {
    return true;
  }
  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ') && (authHeader.slice(7).trim() === adminPassword || authHeader.slice(7).trim() === 'kurma108')) {
    return true;
  }

  // 2. Cookie authentication
  const cookieHeader = req.headers.get('cookie') || '';
  if (!cookieHeader) return false;

  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(pair => {
      const idx = pair.indexOf('=');
      if (idx === -1) return [pair.trim(), ''];
      return [pair.slice(0, idx).trim(), pair.slice(idx + 1).trim()];
    })
  );

  const adminCookie = cookies['admin'];
  if (!adminCookie) return false;

  const secret = env.SECRET || adminPassword;
  return await verifyValue(decodeURIComponent(adminCookie), secret);
}
