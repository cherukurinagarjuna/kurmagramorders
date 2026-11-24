'use strict';

const { json, normalizeIndianPhone } = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/razorpay-create-order (Local development / Netlify)
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Request body must be valid JSON' });
  }

  const { name, phone, address, amount, items, product_details, order_code } = body;
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return json(500, {
      ok: false,
      error: 'Razorpay keys not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env'
    });
  }

  const cleanAmount = Number(amount) || 0;
  const amountInPaise = Math.round(cleanAmount * 100);
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const finalOrderCode = order_code || `KG-${dateStr}-${randSuffix}`;

  const authHeader = 'Basic ' + Buffer.from(`${keyId.trim()}:${keySecret.trim()}`).toString('base64');

  try {
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: finalOrderCode,
        notes: {
          order_code: finalOrderCode,
          customer_name: name,
          customer_phone: phone
        }
      })
    });

    const rzpData = await rzpRes.json();
    if (!rzpRes.ok) {
      return json(rzpRes.status || 500, {
        ok: false,
        error: rzpData.error?.description || 'Could not initiate Razorpay order'
      });
    }

    return json(200, {
      ok: true,
      razorpay_order_id: rzpData.id,
      key_id: keyId.trim(),
      amount: amountInPaise,
      currency: 'INR',
      order_code: finalOrderCode,
      name,
      phone,
      address
    });
  } catch (err) {
    return json(500, { ok: false, error: 'Server error: ' + err.message });
  }
};
