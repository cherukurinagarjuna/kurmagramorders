// POST /api/razorpay-create-order
// Cloudflare Pages Function - Creates an official order on Razorpay
import { json, normalizeIndianPhone, validateStr, validateAmount } from './_helpers.js';

export async function onRequestPost(context) {
  try {
    let body = {};
    try {
      body = await context.request.json();
    } catch {
      return json(400, { ok: false, error: 'Request body must be valid JSON' });
    }

    const { name, phone, address, amount, items, product_details, order_code } = body;

    const cleanName = validateStr(name, 2, 100);
    const cleanPhone = normalizeIndianPhone(phone);
    const cleanAddress = validateStr(address, 10, 500);
    const cleanAmount = validateAmount(amount);

    if (!cleanName) return json(400, { ok: false, error: 'Name must be between 2 and 100 characters' });
    if (!cleanPhone) return json(400, { ok: false, error: 'Phone must be a valid 10-digit Indian mobile number' });
    if (!cleanAddress) return json(400, { ok: false, error: 'Delivery address must be between 10 and 500 characters' });
    if (!cleanAmount) return json(400, { ok: false, error: 'Amount must be a positive number' });

    const keyId = context.env?.RAZORPAY_KEY_ID;
    const keySecret = context.env?.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return json(500, {
        ok: false,
        error: 'Razorpay keys not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Cloudflare Pages settings.'
      });
    }

    const amountInPaise = Math.round(cleanAmount * 100);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const finalOrderCode = order_code || `KG-${dateStr}-${randSuffix}`;

    // Basic Auth header for Razorpay API
    const authHeader = 'Basic ' + btoa(`${keyId.trim()}:${keySecret.trim()}`);

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
          customer_name: cleanName,
          customer_phone: cleanPhone,
          customer_address: cleanAddress
        }
      })
    });

    const rzpData = await rzpRes.json();
    if (!rzpRes.ok) {
      console.error('[Razorpay Order Creation Error]', rzpData);
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
      name: cleanName,
      phone: cleanPhone,
      address: cleanAddress
    });
  } catch (err) {
    console.error('[razorpay-create-order error]', err);
    return json(500, { ok: false, error: 'Server error: ' + err.message });
  }
}
