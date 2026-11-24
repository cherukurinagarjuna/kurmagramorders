'use strict';

const ordersDb                                = require('./lib/orders-db');
const { json, normalizeIndianPhone, waLink } = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// Validation helpers
// ─────────────────────────────────────────────────────────────────────────────

function validateStr(val, min, max) {
  if (typeof val !== 'string') return null;
  const t = val.trim();
  return t.length >= min && t.length <= max ? t : null;
}

function validateAmount(val) {
  const n = Number(val);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler
// Accepts:
// {
//   order_code?: string,
//   order_no?: string,
//   name: string,
//   phone: string,
//   address: string,
//   amount: number,
//   payment_ref: string,  // UTR / Transaction reference or confirmation
//   items?: Array<{ name: string, quantity: number, price: number, unit?: string, subtotal: number }>
// }
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Request body must be valid JSON' });
  }

  const { name, phone, address, amount, items, product_details, payment_ref, order_code, order_no } = body;

  const cleanName    = validateStr(name, 2, 100);
  const cleanAddress = validateStr(address, 10, 500);
  const cleanPhone   = normalizeIndianPhone(phone);
  const cleanAmount  = validateAmount(amount);
  const cleanRef     = payment_ref ? validateStr(payment_ref, 2, 100) : 'Screenshot on WhatsApp';

  if (!cleanName) {
    return json(400, { ok: false, error: 'Name must be between 2 and 100 characters' });
  }
  if (!cleanPhone) {
    return json(400, { ok: false, error: 'Phone must be a valid 10-digit Indian mobile number (starting with 6-9)' });
  }
  if (!cleanAddress) {
    return json(400, { ok: false, error: 'Delivery address must be between 10 and 500 characters' });
  }
  if (!cleanAmount) {
    return json(400, { ok: false, error: 'Amount must be a positive number' });
  }

  // Format product_details
  let formattedProductDetails = '';
  if (Array.isArray(items) && items.length > 0) {
    formattedProductDetails = items
      .map((item) => `${item.name} x ${item.quantity}${item.unit ? ' ' + item.unit : ''} (₹${item.subtotal || (item.price * item.quantity)})`)
      .join(', ');
  } else if (product_details) {
    formattedProductDetails = String(product_details).trim();
  }

  const cleanProduct = validateStr(formattedProductDetails, 3, 500);
  if (!cleanProduct) {
    return json(400, { ok: false, error: 'Product details or items are required' });
  }

  try {
    const createdOrder = await ordersDb.createOrder({
      order_code: order_code || order_no,
      order_no: order_no || order_code,
      name: cleanName,
      phone: cleanPhone,
      address: cleanAddress,
      amount: cleanAmount,
      items: Array.isArray(items) && items.length > 0 ? items : [
        { name: cleanProduct, quantity: 1, price: cleanAmount, subtotal: cleanAmount }
      ],
      product_details: cleanProduct,
      payment_ref: cleanRef,
      status: 'received'
    });

    // Build WhatsApp notification link for customer (Directed strictly to +91 7732075607)
    const rawBizPhone = (process.env.BUSINESS_WHATSAPP || '917732075607').replace(/\D/g, '');
    const businessPhone = rawBizPhone.length === 10 ? `91${rawBizPhone}` : (rawBizPhone || '917732075607');

    const waConfirmationMsg =
      `హరే కృష్ణ! 🙏\n` +
      `ధన్యవాదాలు (Thank you) — నేను కూర్మగ్రామ వేదిక్ విలేజ్ సహజ ఉత్పత్తుల కోసం UPI చెల్లింపు పూర్తి చేశాను.\n\n` +
      `✅ *ఆర్డర్ నమోదైంది (Order Created)*\n` +
      `📦 *Order No:* ${createdOrder.order_no}\n` +
      `👤 *Name:* ${cleanName}\n` +
      `📱 *Phone:* ${cleanPhone}\n` +
      `🌾 *Items:* ${cleanProduct}\n` +
      `💰 *Amount Paid:* ₹${cleanAmount}\n` +
      `🔢 *UPI UTR / Ref:* ${cleanRef}\n` +
      `📍 *Delivery Address:* ${cleanAddress}\n` +
      `🚚 *Shipping Notice:* నవత రోడ్ ట్రాన్స్‌పోర్ట్ (రవాణా ఛార్జీలు అదనం - https://www.navata.com/freight-cal)\n\n` +
      `చెల్లింపు స్క్రీన్‌షాట్ ఇక్కడ జతచేస్తున్నాను. దయచేసి ధ్రువీకరించి సరుకును నవత రోడ్ ట్రాన్స్‌పోర్ట్ ద్వారా పంపగలరు.\n` +
      `ధన్యవాదాలు! (Thank you!) 🙏`;

    const customerWaLink = `https://wa.me/${businessPhone}?text=${encodeURIComponent(waConfirmationMsg)}`;

    return json(201, {
      ok: true,
      order_no: createdOrder.order_no,
      order_code: createdOrder.order_code,
      amount: cleanAmount,
      total_amount: createdOrder.total_amount,
      name: cleanName,
      customer_wa_link: customerWaLink,
    });
  } catch (err) {
    console.error('[create-order] Error:', err.message);
    return json(500, { ok: false, error: 'Could not create order: ' + err.message });
  }
};
