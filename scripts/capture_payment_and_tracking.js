import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Nagarjun\\.gemini\\antigravity\\brain\\5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function main() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop (1440px)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const pageDesk = await desktopContext.newPage();

  // Populate localStorage with a product in cart so checkout renders with items
  await pageDesk.goto('http://127.0.0.1:3000/shop');
  await pageDesk.evaluate(() => {
    localStorage.setItem('kg_cart_v1', JSON.stringify([
      { productId: 'rice', unitIndex: 1, qty: 1 } // 25kg Rice ₹2,600
    ]));
  });

  // Navigate to /checkout
  await pageDesk.goto('http://127.0.0.1:3000/checkout');
  await pageDesk.waitForSelector('#pageUpiQrContainer', { timeout: 10000 });
  await pageDesk.waitForTimeout(500);

  // Fill in customer details so the form looks complete & professional
  await pageDesk.fill('#pageCustName', 'నారాయణ దాస్ (Narayana Das)');
  await pageDesk.fill('#pageCustPhone', '9876543210');
  await pageDesk.fill('#pageCustAddress', 'ఫ్లాట్ 402, శ్రీ కృష్ణ నిలయం, గాంధీ నగర్, విజయవాడ, 520003');
  await pageDesk.fill('#pageUtrInput', '412890123456');

  // Capture Dynamic QR Tab on Desktop
  await pageDesk.screenshot({
    path: path.join(ARTIFACT_DIR, 'payment-checkout-dynamic-qr-1440px.png'),
    fullPage: false
  });

  // Switch to Official Ashram Trust QR Tab
  await pageDesk.click('#tabOfficialQr');
  await pageDesk.waitForTimeout(400);

  // Capture Official QR Tab on Desktop
  await pageDesk.screenshot({
    path: path.join(ARTIFACT_DIR, 'payment-checkout-official-qr-1440px.png'),
    fullPage: false
  });

  // Navigate to /track with ?code=RICE-2026-0006
  await pageDesk.goto('http://127.0.0.1:3000/track?code=RICE-2026-0006');
  await pageDesk.waitForSelector('.track-order-card', { timeout: 10000 });
  await pageDesk.waitForTimeout(500);

  // Capture Order Tracking Page with live DB result on Desktop
  await pageDesk.screenshot({
    path: path.join(ARTIFACT_DIR, 'order-tracking-result-1440px.png'),
    fullPage: false
  });

  // 2. Mobile (360px)
  const mobileContext = await browser.newContext({
    viewport: { width: 360, height: 780 },
    deviceScaleFactor: 1
  });
  const pageMob = await mobileContext.newPage();

  await pageMob.goto('http://127.0.0.1:3000/shop');
  await pageMob.evaluate(() => {
    localStorage.setItem('kg_cart_v1', JSON.stringify([
      { productId: 'rice', unitIndex: 1, qty: 1 }
    ]));
  });

  // Navigate to /checkout on mobile
  await pageMob.goto('http://127.0.0.1:3000/checkout');
  await pageMob.waitForSelector('#pageUpiQrContainer', { timeout: 10000 });
  await pageMob.waitForTimeout(500);

  await pageMob.fill('#pageCustName', 'నారాయణ దాస్');
  await pageMob.fill('#pageCustPhone', '9876543210');
  await pageMob.fill('#pageCustAddress', 'గాంధీ నగర్, విజయవాడ, 520003');

  // Capture Dynamic QR on mobile
  await pageMob.screenshot({
    path: path.join(ARTIFACT_DIR, 'payment-checkout-dynamic-qr-360px.png'),
    fullPage: false
  });

  // Switch to Official Ashram Trust QR on mobile
  await pageMob.click('#tabOfficialQr');
  await pageMob.waitForTimeout(400);

  await pageMob.screenshot({
    path: path.join(ARTIFACT_DIR, 'payment-checkout-official-qr-360px.png'),
    fullPage: false
  });

  // Navigate to /track on mobile
  await pageMob.goto('http://127.0.0.1:3000/track?code=RICE-2026-0006');
  await pageMob.waitForSelector('.track-order-card', { timeout: 10000 });
  await pageMob.waitForTimeout(500);

  await pageMob.screenshot({
    path: path.join(ARTIFACT_DIR, 'order-tracking-result-360px.png'),
    fullPage: false
  });

  await browser.close();
  console.log('Payment & Order Tracking screenshots captured successfully!');
}

main().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
