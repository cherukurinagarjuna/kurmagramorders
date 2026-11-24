import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Nagarjun\\.gemini\\antigravity\\brain\\5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function captureAdmin() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop (1440px)
  const deskContext = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    deviceScaleFactor: 1
  });
  const pageDesk = await deskContext.newPage();

  // Navigate to /admin
  await pageDesk.goto('http://127.0.0.1:3000/admin');
  await pageDesk.waitForSelector('#adminLoginSection');
  await pageDesk.waitForTimeout(400);

  // Capture Login Screen
  await pageDesk.screenshot({
    path: path.join(ARTIFACT_DIR, 'admin-login-1440px.png'),
    fullPage: false
  });

  // Perform Login
  await pageDesk.fill('#adminPasswordInput', 'changeme');
  await pageDesk.click('#adminLoginSubmitBtn');

  // Wait for Dashboard Panel and Orders Table
  await pageDesk.waitForSelector('#adminOrdersTable', { state: 'visible', timeout: 10000 });
  await pageDesk.waitForTimeout(600);

  // Capture Desktop Admin Dashboard with live table & 3 WhatsApp buttons
  await pageDesk.screenshot({
    path: path.join(ARTIFACT_DIR, 'admin-dashboard-1440px.png'),
    fullPage: false
  });

  // Verify the 3 buttons exist in first row
  const firstRow = pageDesk.locator('#adminOrdersTbody tr').first();
  const btnReceived = firstRow.locator('.btn-wa-received');
  const btnProcessing = firstRow.locator('.btn-wa-processing');
  const btnShipped = firstRow.locator('.btn-wa-shipped');

  console.log('Button Received count:', await btnReceived.count());
  console.log('Button Processing count:', await btnProcessing.count());
  console.log('Button Shipped count:', await btnShipped.count());

  const receivedHref = await btnReceived.getAttribute('href');
  const processingHref = await btnProcessing.getAttribute('href');
  const shippedHref = await btnShipped.getAttribute('href');

  console.log('Sample Received Link:', decodeURIComponent(receivedHref));
  console.log('Sample Processing Link:', decodeURIComponent(processingHref));
  console.log('Sample Shipped Link:', decodeURIComponent(shippedHref));

  // 2. Mobile (360px)
  const mobContext = await browser.newContext({
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 1
  });
  const pageMob = await mobContext.newPage();

  await pageMob.goto('http://127.0.0.1:3000/admin');
  await pageMob.waitForSelector('#adminLoginSection');
  await pageMob.fill('#adminPasswordInput', 'changeme');
  await pageMob.click('#adminLoginSubmitBtn');

  await pageMob.waitForSelector('#adminOrdersTable', { state: 'visible', timeout: 10000 });
  await pageMob.waitForTimeout(600);

  // Capture Mobile Admin Dashboard
  await pageMob.screenshot({
    path: path.join(ARTIFACT_DIR, 'admin-dashboard-360px.png'),
    fullPage: false
  });

  await browser.close();
  console.log('Admin Dashboard screenshots captured successfully!');
}

captureAdmin().catch(err => {
  console.error('Error capturing admin dashboard:', err);
  process.exit(1);
});
