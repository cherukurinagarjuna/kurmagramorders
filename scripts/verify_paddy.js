const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/about');
  await page.waitForTimeout(600);
  
  const frameEl = await page.locator('.editorial-art-frame').first();
  await frameEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const shotPath = path.join('C:/Users/Nagarjun/.gemini/antigravity/brain/5c624ff9-8db2-40b2-a173-0e674b94ef51', 'about-paddy-planting-verified-1440px.png');
  await frameEl.screenshot({ path: shotPath });
  console.log('Saved:', shotPath);

  await browser.close();
})();
