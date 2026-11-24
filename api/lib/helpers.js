'use strict';

const crypto = require('crypto');

// ─────────────────────────────────────────────────────────────────────────────
// 1. json — Build a Netlify Function response object
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {number} statusCode
 * @param {object} body
 * @returns {{ statusCode: number, headers: object, body: string }}
 */
function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. normalizeIndianPhone
// Accepts:  "9876543210"  |  "+919876543210"  |  "919876543210"  |  "09876543210"
// Returns:  "+91XXXXXXXXXX" if the 10-digit part starts with 6-9, else null.
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} input
 * @returns {string|null}
 */
function normalizeIndianPhone(input) {
  if (!input) return null;

  // Strip everything except digits
  let digits = String(input).replace(/\D/g, '');

  // Drop leading 0  → "09876543210" becomes "9876543210"
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // Drop leading 91 → "919876543210" becomes "9876543210"
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }

  // Must now be exactly 10 digits
  if (digits.length !== 10) return null;

  // Indian mobile numbers start with 6, 7, 8, or 9
  if (!/^[6-9]/.test(digits)) return null;

  return '+91' + digits;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. maskPhone
// "+919876543210" → "+9198XXXXX210"
// Keeps first 5 chars (+9198…) and last 3 chars (…210), masks the middle.
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} phone  Normalised phone e.g. '+919876543210'
 * @returns {string}
 */
function maskPhone(phone) {
  if (!phone) return '***';
  const s = String(phone);
  if (s.length <= 8) return s; // too short to mask meaningfully
  const head = s.slice(0, 5);            // "+9198"
  const tail = s.slice(-3);             // "210"
  const maskLen = s.length - 8;         // characters to hide
  return head + 'X'.repeat(maskLen) + tail;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. waLink — Build a wa.me click-to-chat URL
// Strips non-digits from phone, URI-encodes the message.
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} phone    e.g. '+919876543210' or '919876543210'
 * @param {string} message  Pre-filled WhatsApp message text
 * @returns {string}
 */
function waLink(phone, message) {
  const digits = String(phone || '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message || '')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. signCookie — HMAC-SHA256 sign a value
// Token format: "<value>.<hex-hmac>"
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} value
 * @returns {string}  "<value>.<hmac-hex>"
 */
function signCookie(value) {
  const secret = process.env.SECRET || '';
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(String(value))
    .digest('hex');
  return `${value}.${hmac}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. verifyCookie — Verify a signed cookie token
// Splits on the LAST '.' so the value itself may contain dots.
// Uses crypto.timingSafeEqual to prevent timing attacks.
// Returns true if valid, false otherwise.
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} raw  The full signed token "<value>.<hmac-hex>"
 * @returns {boolean}
 */
function verifyCookie(raw) {
  if (!raw || typeof raw !== 'string') return false;

  const secret = process.env.SECRET;
  if (!secret) {
    console.error('[helpers] SECRET env var is not set — refusing all cookie verifications');
    return false;
  }

  const lastDot = raw.lastIndexOf('.');
  if (lastDot === -1) return false;

  const value        = raw.slice(0, lastDot);
  const receivedHmac = raw.slice(lastDot + 1);

  if (!value || !receivedHmac) return false;

  const expectedHmac = crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('hex');

  // Both buffers must be the same length for timingSafeEqual
  const a = Buffer.from(receivedHmac, 'hex');
  const b = Buffer.from(expectedHmac, 'hex');

  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. requireAuth — Cookie-based auth guard for admin functions
// Reads the 'admin' cookie from the request, verifies the HMAC signature.
// Returns true if the request is authenticated, false otherwise.
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {object} event  Netlify Function event object
 * @returns {boolean}
 */
function requireAuth(event) {
  const cookieHeader = (event.headers && event.headers.cookie) || '';
  if (!cookieHeader) return false;

  // Parse all cookies into a key→value map
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((pair) => {
      const eqIdx = pair.indexOf('=');
      if (eqIdx === -1) return [pair.trim(), ''];
      return [pair.slice(0, eqIdx).trim(), pair.slice(eqIdx + 1).trim()];
    })
  );

  const adminToken = cookies['admin'];
  if (!adminToken) return false;

  return verifyCookie(decodeURIComponent(adminToken));
}

module.exports = {
  json,
  normalizeIndianPhone,
  maskPhone,
  waLink,
  signCookie,
  verifyCookie,
  requireAuth,
};
