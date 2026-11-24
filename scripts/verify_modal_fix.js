
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log('Opening http://127.0.0.1:3000 ...');
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });

  // Add product and open modal
  await page.evaluate(() => {
    window.store.addToCart('sunni', 0, 1);
    if (window.store.lang !== 'en') {
      window.store.toggleLang();
    }
    window.store.openCheckoutModal();
  });

  await page.waitForTimeout(500);

  // 1. Click submit without filling required fields
  console.log('Testing empty form validation click...');
  await page.click('#submitOrderWhatsAppBtn');
  await page.waitForTimeout(400);

  const errorVisible = await page.evaluate(() => {
    const el = document.getElementById('modalValidationError');
    return el ? (el.style.display !== 'none' && el.offsetParent !== null) : false;
  });
  console.log('Is validation error banner visible?', errorVisible);

  const artifactDir = 'C:/Users/Nagarjun/.gemini/antigravity/brain/5c624ff9-8db2-40b2-a173-0e674b94ef51';
  await page.screenshot({ path: path.join(artifactDir, 'modal-validation-error-1440px.png') });
  console.log('Captured validation error screenshot.');

  // 2. Now fill details
  console.log('Filling valid details...');
  await page.fill('#custName', 'Srinivasa Rao');
  await page.fill('#custPhone', '9876543210');
  await page.fill('#custAddress', 'Flat 402, Srinivasa Nilayam, Srikakulam 532001');
  await page.check('#modalUtrScreenshotOpt');

  // Listen for popup
  const popupPromise = context.waitForEvent('page', { timeout: 3500 }).catch(e => null);

  console.log('Submitting order with details...');
  await page.click('#submitOrderWhatsAppBtn');

  const popup = await popupPromise;
  console.log('Popup URL:', popup ? popup.url() : 'NO POPUP');

  await page.waitForTimeout(800);

  const successVisible = await page.evaluate(() => {
    const el = document.getElementById('modalOrderSuccessCard');
    return el ? (el.style.display !== 'none' && el.offsetParent !== null) : false;
  });
  console.log('Is modal celebration success card visible?', successVisible);

  await page.screenshot({ path: path.join(artifactDir, 'modal-success-screen-1440px.png') });
  console.log('Captured modal success screenshot.');

  await browser.close();
})();
