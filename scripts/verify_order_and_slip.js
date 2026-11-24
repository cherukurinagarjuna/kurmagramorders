import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Nagarjun\\.gemini\\antigravity\\brain\\5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function verifyOrderAndSlip() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  console.log('1. Adding items to cart and placing fresh test order...');
  await page.goto('http://127.0.0.1:3000/shop');
  await page.evaluate(() => {
    // Add 2 items: 25kg Rice + 1L Sesame Oil
    localStorage.setItem('kg_cart_v1', JSON.stringify([
      { productId: 'rice', unitIndex: 1, qty: 2 },
      { productId: 'sesame', unitIndex: 0, qty: 1 }
    ]));
  });

  // Navigate to checkout
  await page.goto('http://127.0.0.1:3000/checkout');
  await page.waitForSelector('#pageCustName');

  // Fill in customer delivery details
  await page.fill('#pageCustName', 'శ్రీ రామకృష్ణ వర్మ (Sri Ramakrishna Varma)');
  await page.fill('#pageCustPhone', '9848012345');
  await page.fill('#pageCustAddress', 'ఫ్లాట్ 402, శ్రీ వెంకటేశ్వర నిలయం, గాంధీ రోడ్డు, నవత ట్రాన్స్‌పోర్ట్ ఎదురుగా, విజయవాడ — 520002');
  await page.fill('#pageUtrInput', '432987123654');

  // Intercept window.open so popup doesn't block
  await page.evaluate(() => {
    window.open = (url) => { console.log('Intercepted WhatsApp popup:', url); return null; };
  });

  // Click Submit Order
  await page.click('#pageSubmitOrderWhatsAppBtn');

  // Wait for success screen
  await page.waitForSelector('.checkout-success-vault', { timeout: 15000 });
  const orderBadgeText = await page.textContent('.success-order-id');
  console.log('Order submitted successfully! Generated Badge:', orderBadgeText);

  // 2. Go to /admin and login
  console.log('2. Navigating to Admin Dashboard...');
  await page.goto('http://127.0.0.1:3000/admin');
  await page.waitForSelector('#adminPasswordInput');
  await page.fill('#adminPasswordInput', 'changeme');
  await page.click('#adminLoginSubmitBtn');

  // Wait for orders table
  await page.waitForSelector('#adminOrdersTable', { state: 'visible', timeout: 10000 });
  await page.waitForTimeout(600);

  // Capture Admin Dashboard with Print Button
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'admin-dashboard-with-print-btn-1440px.png'),
    fullPage: false
  });
  console.log('Captured admin-dashboard-with-print-btn-1440px.png');

  // Find the Print Slip button in the first row
  const firstRow = page.locator('#adminOrdersTbody tr').first();
  const printSlipBtn = firstRow.locator('.btn-action-print-slip');
  const printHref = await printSlipBtn.getAttribute('href');
  console.log('Print Slip Button Href:', printHref);

  if (!printHref) {
    throw new Error('Print Slip button href not found in admin table!');
  }

  // 3. Navigate to the Slip URL (without autoprint for headless screenshot)
  const slipUrl = `http://127.0.0.1:3000${printHref.replace('&autoprint=1', '')}`;
  console.log('3. Navigating to Dispatch Slip page:', slipUrl);
  await page.goto(slipUrl);

  // Wait for the document card to be visible
  await page.waitForSelector('#dispatchSlipDocument', { state: 'visible', timeout: 10000 });
  await page.waitForTimeout(800);

  // Extract rendered data on slip
  const dispOrderNo = await page.textContent('#dispOrderNo');
  const dispCustomerName = await page.textContent('#dispCustomerName');
  const dispCustomerPhone = await page.textContent('#dispCustomerPhone');
  const dispCustomerAddress = await page.textContent('#dispCustomerAddress');
  const dispTotalAmount = await page.textContent('#dispTotalAmount');
  const itemsCount = await page.locator('#dispItemsTbody tr').count();

  console.log('Slip Rendered Data:');
  console.log(' - Order No:', dispOrderNo);
  console.log(' - Customer Name:', dispCustomerName);
  console.log(' - Customer Phone:', dispCustomerPhone);
  console.log(' - Address:', dispCustomerAddress);
  console.log(' - Total Amount:', dispTotalAmount);
  console.log(' - Commodities count:', itemsCount);

  // Capture Dispatch Slip Screenshot (Desktop 1440px)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'dispatch-slip-preview-1440px.png'),
    fullPage: true
  });
  console.log('Captured dispatch-slip-preview-1440px.png');

  // 4. Capture Mobile view of Slip (360px)
  const mobileContext = await browser.newContext({
    viewport: { width: 420, height: 900 },
    deviceScaleFactor: 1
  });
  const pageMob = await mobileContext.newPage();
  await pageMob.goto(slipUrl);
  await pageMob.waitForSelector('#dispatchSlipDocument', { state: 'visible', timeout: 10000 });
  await pageMob.waitForTimeout(500);

  await pageMob.screenshot({
    path: path.join(ARTIFACT_DIR, 'dispatch-slip-preview-mobile.png'),
    fullPage: true
  });
  console.log('Captured dispatch-slip-preview-mobile.png');

  await browser.close();
  console.log('All verifications and screenshots completed successfully!');
}

verifyOrderAndSlip().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
