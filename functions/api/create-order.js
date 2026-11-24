// POST /api/create-order
// Cloudflare Pages Function
import { json, normalizeIndianPhone, validateStr, validateAmount } from './_helpers.js';

export async function onRequestPost(context) {
  try {
    let body = {};
    try {
      body = await context.request.json();
    } catch {
      return json(400, { ok: false, error: 'Request body must be valid JSON' });
    }

    const { name, phone, address, amount, items, product_details, payment_ref, order_code, order_no } = body;

    const cleanName = validateStr(name, 2, 100);
    const cleanAddress = validateStr(address, 10, 500);
    const cleanPhone = normalizeIndianPhone(phone);
    const cleanAmount = validateAmount(amount);
    const cleanRef = payment_ref ? validateStr(payment_ref, 2, 100) : 'Screenshot on WhatsApp';

    if (!cleanName) return json(400, { ok: false, error: 'Name must be between 2 and 100 characters' });
    if (!cleanPhone) return json(400, { ok: false, error: 'Phone must be a valid 10-digit Indian mobile number (starting with 6-9)' });
    if (!cleanAddress) return json(400, { ok: false, error: 'Delivery address must be between 10 and 500 characters' });
    if (!cleanAmount) return json(400, { ok: false, error: 'Amount must be a positive number' });

    let formattedProductDetails = '';
    if (Array.isArray(items) && items.length > 0) {
      formattedProductDetails = items
        .map(i => `${i.name} x ${i.quantity}${i.unit ? ' ' + i.unit : ''} (₹${i.subtotal || (i.price * i.quantity)})`)
        .join(', ');
    } else if (product_details) {
      formattedProductDetails = String(product_details).trim();
    }
    const cleanProduct = validateStr(formattedProductDetails, 3, 500) || 'కూర్మగ్రామ సహజ ఉత్పత్తులు';

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const finalOrderCode = order_code || order_no || `KG-${dateStr}-${randSuffix}`;

    // Store in Cloudflare D1 if available
    if (context.env && context.env.DB) {
      try {
        await context.env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_no TEXT NOT NULL UNIQUE,
            order_code TEXT,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            customer_address TEXT NOT NULL,
            product_details TEXT,
            amount REAL NOT NULL,
            total_amount REAL,
            items TEXT,
            payment_ref TEXT,
            status TEXT NOT NULL DEFAULT 'received',
            lr_number TEXT,
            transporter TEXT DEFAULT 'Navata Road Transport',
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
          )
        `).run();

        await context.env.DB.prepare(`
          INSERT INTO orders (
            order_no, order_code, customer_name, customer_phone, customer_address,
            product_details, amount, total_amount, items, payment_ref, status, transporter
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', 'Navata Road Transport')
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
          cleanRef
        ).run();
      } catch (dbErr) {
        console.error('[create-order D1 error]', dbErr.message);
      }
    }

    // WhatsApp confirmation link directed to Kurmagram Trust (+91 7732075607)
    const rawBizPhone = (context.env?.BUSINESS_WHATSAPP || '917732075607').replace(/\D/g, '');
    const businessPhone = rawBizPhone.length === 10 ? `91${rawBizPhone}` : (rawBizPhone || '917732075607');

    const waConfirmationMsg =
      `హరే కృష్ణ! 🙏\n` +
      `ధన్యవాదాలు (Thank you) — నేను కూర్మగ్రామ వేదిక్ విలేజ్ సహజ ఉత్పత్తుల కోసం UPI చెల్లింపు పూర్తి చేశాను.\n\n` +
      `✅ *ఆర్డర్ నమోదైంది (Order Created)*\n` +
      `📦 *Order No:* ${finalOrderCode}\n` +
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
      order_no: finalOrderCode,
      order_code: finalOrderCode,
      amount: cleanAmount,
      total_amount: cleanAmount,
      name: cleanName,
      customer_wa_link: customerWaLink
    });
  } catch (err) {
    console.error('[create-order error]', err);
    return json(500, { ok: false, error: 'Could not create order: ' + err.message });
  }
}
