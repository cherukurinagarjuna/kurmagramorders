
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('dialog', async dialog => {
    console.log('PAGE DIALOG (ALERT):', dialog.type(), dialog.message());
    await dialog.dismiss();
  });

  console.log('Navigating to http://127.0.0.1:3000 ...');
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });

  // Add product to cart
  console.log('Adding product to cart...');
  await page.evaluate(() => {
    window.store.addToCart(1, 0, 1);
    window.store.openCheckoutModal();
  });

  await page.waitForTimeout(500);

  // Check modal visibility
  const isModalActive = await page.evaluate(() => {
    const m = document.getElementById('checkoutModal');
    return m ? m.classList.contains('active') : false;
  });
  console.log('Is checkoutModal active?', isModalActive);

  // Switch to English language to match user screenshot
  await page.evaluate(() => {
    if (window.store.lang !== 'en') {
      window.store.toggleLang();
    }
    // Reopen modal if toggle closed it
    window.store.openCheckoutModal();
  });
  await page.waitForTimeout(500);

  // Click submit button WITHOUT filling inputs
  console.log('Clicking Send Order Receipt without inputs...');
  await page.click('#submitOrderWhatsAppBtn');
  await page.waitForTimeout(500);

  // Now fill the inputs
  console.log('Filling name, phone, address...');
  await page.fill('#custName', 'Ramarao');
  await page.fill('#custPhone', '9876543210');
  await page.fill('#custAddress', '1-23 Srikakulam');
  await page.check('#modalUtrScreenshotOpt');

  // Listen for popup
  const popupPromise = context.waitForEvent('page', { timeout: 3000 }).catch(e => null);

  console.log('Clicking Send Order Receipt WITH inputs...');
  await page.click('#submitOrderWhatsAppBtn');

  const popup = await popupPromise;
  console.log('Was popup opened?', popup ? popup.url() : 'NO POPUP (BLOCKED)');

  await page.waitForTimeout(1000);
  console.log('Modal active after submit?', await page.evaluate(() => document.getElementById('checkoutModal')?.classList.contains('active')));

  await browser.close();
})();
