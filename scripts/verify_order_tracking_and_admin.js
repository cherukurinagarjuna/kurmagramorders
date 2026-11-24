const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Nagarjun\\.gemini\\antigravity\\brain\\5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function runVerification() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('=== Step 1: Testing /track with user order KG-20261123-7454 ===');
  await page.goto('http://127.0.0.1:3000/track', { waitUntil: 'networkidle' });

  // Fill in order code and phone
  await page.waitForSelector('#trackCodeInput', { timeout: 10000 });
  await page.fill('#trackCodeInput', 'KG-20261123-7454');
  await page.fill('#trackPhoneInput', '9876543210');
  
  // Submit search
  await page.click('#trackSubmitBtn');

  // Wait for results
  await page.waitForSelector('#trackResultsContainer article', { timeout: 10000 });
  await page.waitForTimeout(1000);

  const trackContent = await page.textContent('#trackResultsContainer');
  console.log('Tracking Result found!');
  if (!trackContent.includes('KG-20261123-7454')) {
    throw new Error('Order KG-20261123-7454 not visible in track results!');
  }

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'tracking-verified-cherukuri-1440px.png'),
    fullPage: false
  });
  console.log('Saved tracking screenshot: tracking-verified-cherukuri-1440px.png');

  console.log('=== Step 2: Testing /admin login and orders ledger ===');
  await page.goto('http://127.0.0.1:3000/admin', { waitUntil: 'networkidle' });

  // Check if login needed
  const pwdInput = await page.$('#adminPasswordInput');
  if (pwdInput && await pwdInput.isVisible()) {
    await page.fill('#adminPasswordInput', 'changeme');
    await page.click('#adminLoginForm button[type="submit"]');
  }

  // Wait for dashboard table to load
  await page.waitForSelector('#adminOrdersTbody tr', { timeout: 10000 });
  await page.waitForTimeout(1000);

  const statTotal = await page.textContent('#statTotalOrders');
  console.log('Admin Total Orders:', statTotal);

  const tableHtml = await page.innerHTML('#adminOrdersTbody');
  if (!tableHtml.includes('KG-20261123-7454') || !tableHtml.includes('Cherukuri Nagarjun')) {
    throw new Error('User order Cherukuri Nagarjun not found in Admin table!');
  }
  console.log('Cherukuri Nagarjun order confirmed in Admin table!');

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'admin-verified-cherukuri-1440px.png'),
    fullPage: false
  });
  console.log('Saved admin screenshot: admin-verified-cherukuri-1440px.png');

  console.log('=== Step 3: Testing New Order Placement & Auto-Sync ===');
  await page.goto('http://127.0.0.1:3000/shop', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('kg_cart_v1', JSON.stringify([
      { productId: 'rice', unitIndex: 1, qty: 1 }
    ]));
  });

  await page.goto('http://127.0.0.1:3000/checkout', { waitUntil: 'networkidle' });
  await page.waitForSelector('#pageCustName');

  await page.fill('#pageCustName', 'శ్రీరామమూర్తి (Srirama Murthy)');
  await page.fill('#pageCustPhone', '9848012345');
  await page.fill('#pageCustAddress', 'గాంధీ బొమ్మ సెంటర్, శ్రీకాకుళం');
  await page.fill('#pageCustLandmark', 'శివాలయం ఎదురుగా');
  await page.fill('#pageCustPincode', '532001');

  // Intercept window.open
  await page.evaluate(() => {
    window.open = (url) => { console.log('WhatsApp window.open URL:', url); return null; };
  });

  await page.click('#pageSubmitOrderWhatsAppBtn');
  await page.waitForSelector('.checkout-success-vault', { timeout: 10000 });
  await page.waitForTimeout(1000);

  const successText = await page.textContent('.checkout-success-vault');
  console.log('New Order Success Text:', successText.slice(0, 150));

  // Verify new order appears in admin
  await page.goto('http://127.0.0.1:3000/admin', { waitUntil: 'networkidle' });
  await page.waitForSelector('#adminOrdersTbody tr', { timeout: 10000 });
  const updatedTable = await page.innerHTML('#adminOrdersTbody');
  if (!updatedTable.includes('Srirama Murthy') && !updatedTable.includes('శ్రీరామమూర్తి')) {
    throw new Error('New order not visible in admin after submission!');
  }
  console.log('New order successfully verified in Admin dashboard!');

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'admin-verified-multiple-orders-1440px.png'),
    fullPage: false
  });

  console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
  await browser.close();
}

runVerification().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
