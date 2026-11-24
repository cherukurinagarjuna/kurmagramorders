
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 360, height: 740 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });

  // Add product and open modal
  await page.evaluate(() => {
    window.store.addToCart('sunni', 0, 1);
    window.store.openCheckoutModal();
  });

  await page.waitForTimeout(400);

  // Fill in
  await page.fill('#custName', 'రామారావు');
  await page.fill('#custPhone', '9177320756');
  await page.fill('#custAddress', 'శ్రీకాకుళం');
  await page.check('#modalUtrScreenshotOpt');

  await page.click('#submitOrderWhatsAppBtn');
  await page.waitForTimeout(600);

  const artifactDir = 'C:/Users/Nagarjun/.gemini/antigravity/brain/5c624ff9-8db2-40b2-a173-0e674b94ef51';
  await page.screenshot({ path: path.join(artifactDir, 'modal-success-screen-mobile-360px.png') });
  console.log('Captured Mobile modal success screenshot.');

  await browser.close();
})();
