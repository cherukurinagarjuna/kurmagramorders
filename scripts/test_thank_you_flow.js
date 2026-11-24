import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Nagarjun\\.gemini\\antigravity\\brain\\5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function testThankYouFlow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 }
  });
  const page = await context.newPage();

  console.log('1. Setting cart items on /shop...');
  await page.goto('http://127.0.0.1:3000/shop');
  await page.evaluate(() => {
    localStorage.setItem('kg_cart_v1', JSON.stringify([
      { productId: 'rice', unitIndex: 1, qty: 1 }
    ]));
  });

  console.log('2. Navigating to /checkout...');
  await page.goto('http://127.0.0.1:3000/checkout');
  await page.waitForSelector('#pageCustName');

  await page.fill('#pageCustName', 'శ్రీనివాస రావు (Srinivasa Rao)');
  await page.fill('#pageCustPhone', '9848555666');
  await page.fill('#pageCustAddress', 'ప్లాట్ నెం. 22, బాలాజీ కాలనీ, తిరుపతి — 517501');
  await page.fill('#pageUtrInput', '432109876543');

  // Intercept window.open
  let capturedWaLink = null;
  await page.evaluate(() => {
    window.open = (url) => {
      console.log('Intercepted window.open URL:', url);
      window.__waUrl = url;
      return null;
    };
  });

  console.log('3. Clicking submit button on checkout...');
  await page.click('#pageSubmitOrderWhatsAppBtn');

  // Wait for success vault
  await page.waitForSelector('.checkout-success-vault', { timeout: 15000 });
  await page.waitForTimeout(500);

  console.log('4. Clicking the WhatsApp Send Receipt Button...');
  const waBtn = page.locator('.btn-wa-active-receipt');
  capturedWaLink = await waBtn.getAttribute('href');
  console.log('Captured WhatsApp Link:', capturedWaLink);

  // Click the button to trigger the Thank You celebration
  await waBtn.click();
  await page.waitForTimeout(600);

  // Verify thank you celebration card is displayed
  const celebration = page.locator('#receiptSentCelebration');
  const isVisible = await celebration.isVisible();
  console.log('Is Thank You Celebration Box Visible:', isVisible);

  if (!isVisible) {
    throw new Error('Thank you celebration card #receiptSentCelebration did not appear!');
  }

  const celebrationText = await celebration.textContent();
  console.log('Celebration Header Text:', celebrationText.substring(0, 150));

  // Capture screenshot of the Thank You / Order Created view (1440px)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'checkout-thank-you-screen-1440px.png'),
    fullPage: false
  });
  console.log('Captured checkout-thank-you-screen-1440px.png');

  // Mobile viewport screenshot
  const mobContext = await browser.newContext({
    viewport: { width: 360, height: 850 }
  });
  const pageMob = await mobContext.newPage();
  await pageMob.goto('http://127.0.0.1:3000/shop');
  await pageMob.evaluate(() => {
    localStorage.setItem('kg_cart_v1', JSON.stringify([
      { productId: 'rice', unitIndex: 1, qty: 1 }
    ]));
  });
  await pageMob.goto('http://127.0.0.1:3000/checkout');
  await pageMob.waitForSelector('#pageCustName');
  await pageMob.fill('#pageCustName', 'శ్రీనివాస రావు (Srinivasa Rao)');
  await pageMob.fill('#pageCustPhone', '9848555666');
  await pageMob.fill('#pageCustAddress', 'ప్లాట్ నెం. 22, బాలాజీ కాలనీ, తిరుపతి — 517501');
  await pageMob.fill('#pageUtrInput', '432109876543');
  await pageMob.click('#pageSubmitOrderWhatsAppBtn');
  await pageMob.waitForSelector('.checkout-success-vault', { timeout: 15000 });
  await pageMob.waitForTimeout(500);
  await pageMob.click('.btn-wa-active-receipt');
  await pageMob.waitForTimeout(600);

  await pageMob.screenshot({
    path: path.join(ARTIFACT_DIR, 'checkout-thank-you-screen-360px.png'),
    fullPage: false
  });
  console.log('Captured checkout-thank-you-screen-360px.png');

  await browser.close();
  console.log('Thank you and order creation flow verified successfully!');
}

testThankYouFlow().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
