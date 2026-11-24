
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });

  // Add product and open modal in Telugu
  await page.evaluate(() => {
    window.store.addToCart('sunni', 0, 1);
    if (window.store.lang !== 'te') {
      window.store.toggleLang();
    }
    window.store.openCheckoutModal();
  });

  await page.waitForTimeout(500);

  // Fill in Telugu
  await page.fill('#custName', 'రామారావు');
  await page.fill('#custPhone', '9177320756');
  await page.fill('#custAddress', 'శ్రీకాకుళం ఆశ్రమం సమీపంలో');
  await page.check('#modalUtrScreenshotOpt');

  await page.click('#submitOrderWhatsAppBtn');
  await page.waitForTimeout(600);

  const artifactDir = 'C:/Users/Nagarjun/.gemini/antigravity/brain/5c624ff9-8db2-40b2-a173-0e674b94ef51';
  await page.screenshot({ path: path.join(artifactDir, 'modal-success-screen-te-1440px.png') });
  console.log('Captured Telugu modal success screenshot.');

  await browser.close();
})();
