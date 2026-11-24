const { chromium } = require('playwright');
const path = require('path');

const BRAIN_DIR = 'C:/Users/Nagarjun/.gemini/antigravity/brain/5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function testCartAndCheckout() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // 1. Click Add to Cart on first product
  const firstAddBtn = await page.locator('.btn-add-cart').first();
  await firstAddBtn.click();
  await page.waitForTimeout(500);

  // 2. Click Header Cart Button to open drawer
  const headerCartBtn = await page.locator('#headerCartBtn');
  await headerCartBtn.click();
  await page.waitForTimeout(600);

  // 3. Capture Cart Drawer
  const cartDrawerShot = path.join(BRAIN_DIR, 'orgaxi-cart-drawer-open-1440px.png');
  await page.screenshot({ path: cartDrawerShot });
  console.log('Saved:', cartDrawerShot);

  // 4. Click Checkout Button in Cart Drawer
  const checkoutBtn = await page.locator('#cartCheckoutBtn');
  await checkoutBtn.click();
  await page.waitForTimeout(800);

  // 5. Capture Checkout Modal
  const modalShot = path.join(BRAIN_DIR, 'orgaxi-checkout-modal-open-1440px.png');
  await page.screenshot({ path: modalShot });
  console.log('Saved:', modalShot);

  await browser.close();
  console.log('Cart & checkout test completed successfully!');
}

testCartAndCheckout().catch(err => {
  console.error(err);
  process.exit(1);
});
