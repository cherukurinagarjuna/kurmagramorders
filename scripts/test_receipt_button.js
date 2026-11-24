import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Nagarjun\\.gemini\\antigravity\\brain\\5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function testReceiptButton() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('1. Adding test item to cart on /shop...');
  await page.goto('http://127.0.0.1:3000/shop');
  await page.evaluate(() => {
    localStorage.setItem('kg_cart_v1', JSON.stringify([
      { productId: 'sesame', unitIndex: 1, qty: 1 }
    ]));
  });

  console.log('2. Navigating to /checkout...');
  await page.goto('http://127.0.0.1:3000/checkout');
  await page.waitForSelector('#pageCustName');

  // Fill in customer particulars
  await page.fill('#pageCustName', 'విజయ్ కుమార్ (Vijay Kumar)');
  await page.fill('#pageCustPhone', '9440123456');
  await page.fill('#pageCustAddress', 'డోర్ నం 5-11, గాంధీ చౌక్, విశాఖపట్నం — 530001');
  await page.fill('#pageUtrInput', '432198765432');

  // Track intercepted popup / redirect URLs
  let openedUrl = null;
  await page.evaluate(() => {
    window.open = (url) => {
      console.log('Intercepted window.open URL:', url);
      window.__lastOpenedUrl = url;
      return null;
    };
  });

  console.log('3. Submitting order...');
  await page.click('#pageSubmitOrderWhatsAppBtn');

  // Wait for success vault
  await page.waitForSelector('.checkout-success-vault', { timeout: 15000 });
  await page.waitForTimeout(600);

  // Inspect the active WhatsApp receipt button
  const receiptBtn = page.locator('.btn-wa-active-receipt');
  const btnCount = await receiptBtn.count();
  console.log('Receipt button count on confirmation screen:', btnCount);

  if (btnCount === 0) {
    throw new Error('Active receipt button .btn-wa-active-receipt not found!');
  }

  const receiptHref = await receiptBtn.getAttribute('href');
  const btnText = await receiptBtn.textContent();
  console.log('Receipt Button Text:', btnText.trim());
  console.log('Receipt Button Href:', receiptHref);

  // Assert target phone number is strictly 917732075607
  if (!receiptHref.startsWith('https://wa.me/917732075607')) {
    throw new Error(`Receipt button link does NOT direct to +91 7732075607! Found: ${receiptHref}`);
  }

  console.log('✅ PASS: Order Receipt Button is ACTIVE and directs strictly to +91 7732075607!');

  // Capture screenshot of the confirmation screen with the active receipt button
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'checkout-receipt-activated-1440px.png'),
    fullPage: false
  });
  console.log('Captured checkout-receipt-activated-1440px.png');

  await browser.close();
}

testReceiptButton().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
