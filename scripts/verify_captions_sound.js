const { chromium } = require('playwright');
const path = require('path');

const BRAIN_DIR = 'C:/Users/Nagarjun/.gemini/antigravity/brain/5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Check About page gallery
  console.log('Navigating to http://localhost:3000/about...');
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const galleryEl = await page.$('.editorial-gallery-section');
  if (galleryEl) {
    await galleryEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const galleryShot = path.join(BRAIN_DIR, 'about-gallery-matched-captions-1440px.png');
    await page.screenshot({ path: galleryShot });
    console.log('Saved:', galleryShot);
  }

  // 2. Check topbar sound button
  const topbarShot = path.join(BRAIN_DIR, 'topbar-sound-fixed-1440px.png');
  await page.screenshot({
    path: topbarShot,
    clip: { x: 0, y: 0, width: 1440, height: 120 }
  });
  console.log('Saved:', topbarShot);

  await browser.close();
  console.log('Verification completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
