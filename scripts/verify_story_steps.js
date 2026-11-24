const { chromium } = require('playwright');
const path = require('path');

const BRAIN_DIR = 'C:/Users/Nagarjun/.gemini/antigravity/brain/5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Scroll to #our-story & capture screenshot
  const storyEl = await page.$('#our-story');
  if (storyEl) {
    await storyEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const storyShot = path.join(BRAIN_DIR, 'orgaxi-story-multi-photo-1440px.png');
    await page.screenshot({ path: storyShot });
    console.log('Saved:', storyShot);
  }

  // 2. Scroll to #how-to-order & capture screenshot
  const stepsEl = await page.$('#how-to-order');
  if (stepsEl) {
    await stepsEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const cards = await page.$$('.step-card');
    console.log('Found', cards.length, 'step cards.');
    for (let i = 0; i < cards.length; i++) {
      const opacity = await cards[i].evaluate(el => window.getComputedStyle(el).opacity);
      const isVisible = await cards[i].isVisible();
      console.log(`Card ${i}: opacity=${opacity}, isVisible=${isVisible}`);
    }

    const stepsShot = path.join(BRAIN_DIR, 'orgaxi-steps-fixed-1440px.png');
    await page.screenshot({ path: stepsShot });
    console.log('Saved:', stepsShot);
  }

  // 3. Switch to English and check how-to-order
  const langBtn = await page.$('#langToggleBtn');
  if (langBtn) {
    await langBtn.click();
    await page.waitForTimeout(600);
    if (stepsEl) {
      await stepsEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      const stepsEnShot = path.join(BRAIN_DIR, 'orgaxi-steps-en-1440px.png');
      await page.screenshot({ path: stepsEnShot });
      console.log('Saved:', stepsEnShot);
    }
  }

  await browser.close();
  console.log('Verification completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
