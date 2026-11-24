import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Nagarjun\\.gemini\\antigravity\\brain\\5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function captureNewQr() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 }
  });
  const page = await context.newPage();

  // Populate cart so checkout displays
  await page.goto('http://127.0.0.1:3000/shop');
  await page.evaluate(() => {
    localStorage.setItem('kg_cart_v1', JSON.stringify([
      { productId: 'rice', unitIndex: 0, qty: 1 }
    ]));
  });

  // Navigate to /checkout
  await page.goto('http://127.0.0.1:3000/checkout');
  await page.waitForSelector('#tabOfficialQr', { timeout: 10000 });

  // Click on the Official Ashram QR tab
  await page.click('#tabOfficialQr');
  await page.waitForTimeout(400);

  // Scroll to show the QR code cleanly
  const qrFrame = page.locator('#officialQrWrapper');
  await qrFrame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Capture screenshot of official QR tab
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'new-official-qr-code-1440px.png'),
    fullPage: false
  });
  console.log('Captured new-official-qr-code-1440px.png');

  // Also capture mobile viewport
  const mobContext = await browser.newContext({
    viewport: { width: 360, height: 900 }
  });
  const pageMob = await mobContext.newPage();
  await pageMob.goto('http://127.0.0.1:3000/shop');
  await pageMob.evaluate(() => {
    localStorage.setItem('kg_cart_v1', JSON.stringify([
      { productId: 'rice', unitIndex: 0, qty: 1 }
    ]));
  });
  await pageMob.goto('http://127.0.0.1:3000/checkout');
  await pageMob.waitForSelector('#tabOfficialQr', { timeout: 10000 });
  await pageMob.click('#tabOfficialQr');
  await pageMob.waitForTimeout(400);
  const mobQr = pageMob.locator('#officialQrWrapper');
  await mobQr.scrollIntoViewIfNeeded();

  await pageMob.screenshot({
    path: path.join(ARTIFACT_DIR, 'new-official-qr-code-360px.png'),
    fullPage: false
  });
  console.log('Captured new-official-qr-code-360px.png');

  await browser.close();
}

captureNewQr().catch(err => {
  console.error(err);
  process.exit(1);
});
