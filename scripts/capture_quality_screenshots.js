const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/Nagarjun/.gemini/antigravity/brain/5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function capture() {
  const browser = await chromium.launch();

  // 1. Desktop 1440px - Home Hero & Conjuncts
  const page1440 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page1440.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await page1440.waitForTimeout(500);
  await page1440.screenshot({ path: path.join(ARTIFACT_DIR, 'qg-home-1440px.png'), fullPage: false });

  // 2. Mobile 360px - Home Hero & Conjuncts
  const page360 = await browser.newPage({ viewport: { width: 360, height: 780 } });
  await page360.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await page360.waitForTimeout(500);
  await page360.screenshot({ path: path.join(ARTIFACT_DIR, 'qg-home-360px.png'), fullPage: false });

  // 3. Checkout with UPI QR Code & 0% fee verification (1440px)
  const checkoutPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await checkoutPage.goto('http://127.0.0.1:3000/product/rice', { waitUntil: 'networkidle' });
  await checkoutPage.locator('#detailAddToCartBtn').click();
  await checkoutPage.waitForTimeout(300);
  await checkoutPage.goto('http://127.0.0.1:3000/checkout', { waitUntil: 'networkidle' });
  await checkoutPage.waitForTimeout(500);
  await checkoutPage.screenshot({ path: path.join(ARTIFACT_DIR, 'qg-checkout-qr-1440px.png'), fullPage: false });

  // 4. Checkout Mobile 360px
  const checkoutMobile = await browser.newPage({ viewport: { width: 360, height: 780 } });
  await checkoutMobile.goto('http://127.0.0.1:3000/product/rice', { waitUntil: 'networkidle' });
  await checkoutMobile.locator('#detailAddToCartBtn').click();
  await checkoutMobile.waitForTimeout(300);
  await checkoutMobile.goto('http://127.0.0.1:3000/checkout', { waitUntil: 'networkidle' });
  await checkoutMobile.waitForTimeout(500);
  await checkoutMobile.screenshot({ path: path.join(ARTIFACT_DIR, 'qg-checkout-qr-360px.png'), fullPage: false });

  console.log('Visual regression & quality gate screenshots captured successfully!');
  await browser.close();
}

capture().catch(console.error);
