'use strict';

const crypto = require('crypto');
const ordersDb = require('./lib/orders-db');
const { json, normalizeIndianPhone } = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/razorpay-verify-payment (Local development / Netlify)
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

  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    order_code,
    name,
    phone,
    address,
    amount,
    items,
    product_details
  } = body;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return json(500, { ok: false, error: 'RAZORPAY_KEY_SECRET is not configured' });
  }

  // Cryptographic signature check
  const text = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSig = crypto
    .createHmac('sha256', keySecret.trim())
    .update(text)
    .digest('hex');

  if (expectedSig !== razorpay_signature) {
    return json(400, { ok: false, error: 'Invalid Razorpay payment signature.' });
  }

  const cleanAmount = Number(amount) || 0;
  const cleanPhone = normalizeIndianPhone(phone) || phone;
  const finalOrderCode = order_code || `KG-${Date.now()}`;

  let formattedProductDetails = '';
  if (Array.isArray(items) && items.length > 0) {
    formattedProductDetails = items
      .map(i => `${i.name} x ${i.quantity}${i.unit ? ' ' + i.unit : ''} (₹${i.subtotal || (i.price * i.quantity)})`)
      .join(', ');
  } else if (product_details) {
    formattedProductDetails = String(product_details).trim();
  }

  try {
    const createdOrder = await ordersDb.createOrder({
      order_code: finalOrderCode,
      order_no: finalOrderCode,
      name,
      phone: cleanPhone,
      address,
      amount: cleanAmount,
      items: Array.isArray(items) && items.length > 0 ? items : [{ name: formattedProductDetails, quantity: 1, price: cleanAmount, subtotal: cleanAmount }],
      product_details: formattedProductDetails,
      payment_ref: razorpay_payment_id,
      payment_method: 'Razorpay',
      status: 'received'
    });

    const businessPhone = (process.env.BUSINESS_WHATSAPP || '917732075607').replace(/\D/g, '');
    const waConfirmationMsg =
      `హరే కృష్ణ! 🙏\n` +
      `ధన్యవాదాలు (Thank you) — నేను కూర్మగ్రామ వేదిక్ విలేజ్ సహజ ఉత్పత్తుల కోసం Razorpay ద్వారా సురక్షిత చెల్లింపు పూర్తి చేశాను.\n\n` +
      `✅ *చెల్లింపు ధ్రువీకరించబడింది (Payment Verified)*\n` +
      `📦 *Order No:* ${finalOrderCode}\n` +
      `💳 *Razorpay Payment ID:* ${razorpay_payment_id}\n` +
      `👤 *Name:* ${name}\n` +
      `📱 *Phone:* ${cleanPhone}\n` +
      `🌾 *Items:* ${formattedProductDetails}\n` +
      `💰 *Amount Paid:* ₹${cleanAmount}\n` +
      `📍 *Delivery Address:* ${address}\n` +
      `🚚 *Shipping Notice:* నవత రోడ్ ట్రాన్స్‌పోర్ట్ (రవాణా ఛార్జీలు అదనం - https://www.navata.com/freight-cal)\n\n` +
      `దయచేసి ధ్రువీకరించి సరుకును నవత రోడ్ ట్రాన్స్‌పోర్ట్ ద్వారా పంపగలరు.\n` +
      `ధన్యవాదాలు! (Thank you!) 🙏`;

    const customerWaLink = `https://wa.me/${businessPhone}?text=${encodeURIComponent(waConfirmationMsg)}`;

    return json(200, {
      ok: true,
      verified: true,
      order_no: finalOrderCode,
      payment_id: razorpay_payment_id,
      customer_wa_link: customerWaLink
    });
  } catch (err) {
    return json(500, { ok: false, error: err.message });
  }
};
