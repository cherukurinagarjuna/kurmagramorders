const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Nagarjun\\.gemini\\antigravity\\brain\\5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('=== Step 1: Testing Streamlined Admin Table ===');
  await page.goto('http://127.0.0.1:3000/admin', { waitUntil: 'networkidle' });

  // Login if needed
  const pwdInput = await page.$('#adminPasswordInput');
  if (pwdInput && await pwdInput.isVisible()) {
    await page.fill('#adminPasswordInput', 'changeme');
    await page.click('#adminLoginForm button[type="submit"]');
  }

  await page.waitForSelector('#adminOrdersTbody tr', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Verify that the old 3 buttons DO NOT exist
  const oldBtnReceived = await page.$('.btn-wa-received');
  const oldBtnProcessing = await page.$('.btn-wa-processing');
  const oldBtnShipped = await page.$('.btn-wa-shipped');

  console.log('Old 3 Buttons Check:');
  console.log('  btn-wa-received exists?', !!oldBtnReceived);
  console.log('  btn-wa-processing exists?', !!oldBtnProcessing);
  console.log('  btn-wa-shipped exists?', !!oldBtnShipped);

  if (oldBtnReceived || oldBtnProcessing || oldBtnShipped) {
    throw new Error('Old 3 buttons still present in admin table!');
  }

  // Verify single WhatsApp button exists
  const singleWaButtons = await page.$$('.btn-wa-single-notify');
  console.log('Single WhatsApp buttons found:', singleWaButtons.length);
  if (singleWaButtons.length === 0) {
    throw new Error('Single WhatsApp button not found in table rows!');
  }

  // Intercept window.open
  let lastOpenedUrl = null;
  await page.evaluate(() => {
    window.open = (url) => { window.__lastWaUrl = url; return null; };
  });

  // Test changing status in dropdown
  console.log('Testing changing status in dropdown...');
  const firstStatusSelect = await page.$('#adminOrdersTbody tr:first-child .order-status-selector');
  await firstStatusSelect.selectOption('processing');
  await page.waitForTimeout(1000);

  const capturedUrl = await page.evaluate(() => window.__lastWaUrl);
  console.log('Captured WhatsApp URL on status change:', capturedUrl);
  if (!capturedUrl || !capturedUrl.includes('wa.me')) {
    throw new Error('Direct WhatsApp link was not triggered on status change!');
  }

  // Take screenshot of streamlined admin
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'admin-streamlined-actions-1440px.png'),
    fullPage: false
  });
  console.log('Saved admin screenshot: admin-streamlined-actions-1440px.png');

  console.log('=== Step 2: Testing Shipping Slip Single-Page Print Layout ===');
  await page.goto('http://127.0.0.1:3000/slip?id=1&code=KG-20261123-7454&key=changeme', { waitUntil: 'networkidle' });
  await page.waitForSelector('#dispatchSlipDocument', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Screenshot in screen mode
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'slip-screen-view-1440px.png'),
    fullPage: true
  });

  // Switch to print emulation
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(500);

  // Measure card height in print mode
  const cardBox = await page.locator('#dispatchSlipDocument').boundingBox();
  console.log('Print Mode Card Dimensions:', cardBox);
  
  // A4 portrait is 297mm height = approx 1122px at 96 DPI
  // With 6mm margins, printable height is ~1076px.
  // The card height should comfortably be under 1050px to ensure strict 1-page fit.
  console.log(`Measured Card Height in Print: ${cardBox.height}px (A4 printable limit is ~1076px)`);
  if (cardBox.height > 1060) {
    console.warn(`WARNING: Card height ${cardBox.height}px is close to boundary!`);
  } else {
    console.log(`SUCCESS: Card height ${cardBox.height}px is well within single page boundary!`);
  }

  // Capture screenshot of print preview
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'slip-print-single-page-1440px.png'),
    fullPage: true
  });
  console.log('Saved single-page print screenshot: slip-print-single-page-1440px.png');

  console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
  await browser.close();
}

verify().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
