const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BRAIN_DIR = 'C:/Users/Nagarjun/.gemini/antigravity/brain/5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function main() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1440px
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await desktopContext.newPage();

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // Wait 1s for fonts & styles
  await page.waitForTimeout(1000);

  // Screenshot 1: Desktop Full Page
  const homeFullShot = path.join(BRAIN_DIR, 'orgaxi-homepage-desktop-1440px.png');
  await page.screenshot({ path: homeFullShot, fullPage: true });
  console.log('Saved:', homeFullShot);

  // Screenshot 2: Hero & Pillars Viewport
  const heroShot = path.join(BRAIN_DIR, 'orgaxi-hero-and-pillars-1440px.png');
  await page.screenshot({ path: heroShot });
  console.log('Saved:', heroShot);

  // Screenshot 3: Scroll to Catalog Cards
  const catalogEl = await page.$('#catalog');
  if (catalogEl) {
    await catalogEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const catalogShot = path.join(BRAIN_DIR, 'orgaxi-catalog-grid-1440px.png');
    await page.screenshot({ path: catalogShot });
    console.log('Saved:', catalogShot);
  }

  // 2. Mobile 360px
  const mobileContext = await browser.newContext({
    viewport: { width: 360, height: 800 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  const mobileShot = path.join(BRAIN_DIR, 'orgaxi-homepage-mobile-360px.png');
  await mobilePage.screenshot({ path: mobileShot, fullPage: true });
  console.log('Saved:', mobileShot);

  // 3. Shop Page 1440px
  await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const shopShot = path.join(BRAIN_DIR, 'orgaxi-shop-page-1440px.png');
  await page.screenshot({ path: shopShot, fullPage: false });
  console.log('Saved:', shopShot);

  await browser.close();
  console.log('Verification completed successfully!');
}

main().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
