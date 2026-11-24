// POST /api/razorpay-verify-payment
// Cloudflare Pages Function - Cryptographically verifies Razorpay payments
import { json, normalizeIndianPhone, validateStr, validateAmount } from './_helpers.js';

async function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
  const encoder = new TextEncoder();
  const data = `${orderId}|${paymentId}`;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const expectedHex = Array.from(new Uint8Array(sigBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return expectedHex === signature;
}

export async function onRequestPost(context) {
  try {
    let body = {};
    try {
      body = await context.request.json();
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

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return json(400, { ok: false, error: 'Missing Razorpay payment verification details' });
    }

    const keySecret = context.env?.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return json(500, { ok: false, error: 'RAZORPAY_KEY_SECRET is not configured on server' });
    }

    // Cryptographic signature verification
    const isValid = await verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      keySecret.trim()
    );

    if (!isValid) {
      console.error('[Razorpay Signature Mismatch]', { razorpay_order_id, razorpay_payment_id });
      return json(400, { ok: false, error: 'Payment signature verification failed. Fraudulent or invalid transaction.' });
    }

    // Prepare clean order details
    const cleanName = validateStr(name, 2, 100) || 'గ్రాహకులు';
    const cleanPhone = normalizeIndianPhone(phone) || phone;
    const cleanAddress = validateStr(address, 10, 500) || '';
    const cleanAmount = validateAmount(amount) || 0;
    const finalOrderCode = order_code || `KG-${Date.now()}`;

    let formattedProductDetails = '';
    if (Array.isArray(items) && items.length > 0) {
      formattedProductDetails = items
        .map(i => `${i.name} x ${i.quantity}${i.unit ? ' ' + i.unit : ''} (₹${i.subtotal || (i.price * i.quantity)})`)
        .join(', ');
    } else if (product_details) {
      formattedProductDetails = String(product_details).trim();
    }
    const cleanProduct = validateStr(formattedProductDetails, 3, 500) || 'కూర్మగ్రామ సహజ ఉత్పత్తులు';

    // Store in Cloudflare D1
    if (context.env && context.env.DB) {
      try {
        await context.env.DB.prepare(`
          INSERT INTO orders (
            order_no, order_code, customer_name, customer_phone, customer_address,
            product_details, amount, total_amount, items, payment_ref, payment_status,
            status, transporter
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid', 'received', 'Navata Road Transport')
        `).bind(
          finalOrderCode,
          finalOrderCode,
          cleanName,
          cleanPhone,
          cleanAddress,
          cleanProduct,
          cleanAmount,
          cleanAmount,
          JSON.stringify(items || []),
          razorpay_payment_id
        ).run();
      } catch (dbErr) {
        console.error('[verify-payment D1 error]', dbErr.message);
      }
    }

    // Compose official verified WhatsApp notification directed to +91 7732075607
    const rawBizPhone = (context.env?.BUSINESS_WHATSAPP || '917732075607').replace(/\D/g, '');
    const businessPhone = rawBizPhone.length === 10 ? `91${rawBizPhone}` : (rawBizPhone || '917732075607');

    const waConfirmationMsg =
      `హరే కృష్ణ! 🙏\n` +
      `ధన్యవాదాలు (Thank you) — నేను కూర్మగ్రామ వేదిక్ విలేజ్ సహజ ఉత్పత్తుల కోసం Razorpay ద్వారా సురక్షిత చెల్లింపు పూర్తి చేశాను.\n\n` +
      `✅ *చెల్లింపు ధ్రువీకరించబడింది (Payment Verified)*\n` +
      `📦 *Order No:* ${finalOrderCode}\n` +
      `💳 *Razorpay Payment ID:* ${razorpay_payment_id}\n` +
      `👤 *Name:* ${cleanName}\n` +
      `📱 *Phone:* ${cleanPhone}\n` +
      `🌾 *Items:* ${cleanProduct}\n` +
      `💰 *Amount Paid:* ₹${cleanAmount}\n` +
      `📍 *Delivery Address:* ${cleanAddress}\n` +
      `🚚 *Shipping Notice:* నవత రోడ్ ట్రాన్స్‌పోర్ట్ (రవాణా ఛార్జీలు అదనం - https://www.navata.com/freight-cal)\n\n` +
      `దయచేసి ధ్రువీకరించి సరుకును నవత రోడ్ ట్రాన్స్‌పోర్ట్ ద్వారా పంపగలరు.\n` +
      `ధన్యవాదాలు! (Thank you!) 🙏`;

    const customerWaLink = `https://wa.me/${businessPhone}?text=${encodeURIComponent(waConfirmationMsg)}`;

    return json(200, {
      ok: true,
      verified: true,
      order_no: finalOrderCode,
      order_code: finalOrderCode,
      payment_id: razorpay_payment_id,
      amount: cleanAmount,
      name: cleanName,
      customer_wa_link: customerWaLink
    });
  } catch (err) {
    console.error('[razorpay-verify-payment error]', err);
    return json(500, { ok: false, error: 'Verification error: ' + err.message });
  }
}
