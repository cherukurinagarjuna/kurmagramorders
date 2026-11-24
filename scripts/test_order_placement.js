import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Nagarjun\\.gemini\\antigravity\\brain\\5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function testOrderPlacement() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Load shop and set cart
  await page.goto('http://127.0.0.1:3000/shop');
  await page.evaluate(() => {
    localStorage.setItem('kg_cart_v1', JSON.stringify([
      { productId: 'rice', unitIndex: 1, qty: 1 }
    ]));
  });

  // Navigate to checkout
  await page.goto('http://127.0.0.1:3000/checkout');
  await page.waitForSelector('#pageCustName');

  // Fill in form
  await page.fill('#pageCustName', 'శ్రీకాంత్ వర్మ (Srikanth Varma)');
  await page.fill('#pageCustPhone', '9177320756');
  await page.fill('#pageCustAddress', 'ఇంటి నం. 12-4, కృష్ణా నగర్, శ్రీకాకుళం, 532001');
  await page.fill('#pageUtrInput', '432198765432');

  // Intercept window.open
  await page.evaluate(() => {
    window.open = (url) => { console.log('Intercepted window.open:', url); return null; };
  });

  // Click Submit
  await page.click('#pageSubmitOrderWhatsAppBtn');

  // Wait for success screen
  await page.waitForSelector('.checkout-success-vault', { timeout: 10000 });
  await page.waitForTimeout(500);

  // Take screenshot of success confirmation view
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'payment-checkout-success-1440px.png'),
    fullPage: false
  });

  console.log('Order placement verified & success screenshot captured!');
  await browser.close();
}

testOrderPlacement().catch(err => {
  console.error('Error placing order:', err);
  process.exit(1);
});
