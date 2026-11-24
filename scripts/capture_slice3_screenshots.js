const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.resolve('C:/Users/Nagarjun/.gemini/antigravity/brain/5c624ff9-8db2-40b2-a173-0e674b94ef51');

async function capture() {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: '1440px', width: 1440, height: 900 },
    { name: '360px', width: 360, height: 780 }
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    // 1. Soil-to-Bottle Story Section on Home (/#our-story)
    console.log(`Capturing Story Section at ${vp.name}...`);
    await page.goto('http://127.0.0.1:3000/#our-story', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const storyEl = await page.$('#our-story');
    if (storyEl) {
      const storyPath = path.join(ARTIFACT_DIR, `slice3-story-${vp.name}.png`);
      await storyEl.screenshot({ path: storyPath });
    }

    // 2. /about Page
    console.log(`Capturing About Page at ${vp.name}...`);
    await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const aboutPath = path.join(ARTIFACT_DIR, `slice3-about-${vp.name}.png`);
    await page.screenshot({ path: aboutPath, fullPage: false });
    const aboutFullPath = path.join(ARTIFACT_DIR, `slice3-about-${vp.name}-full.png`);
    await page.screenshot({ path: aboutFullPath, fullPage: true });

    // 3. /how-to-order Page
    console.log(`Capturing How-to-Order Page at ${vp.name}...`);
    await page.goto('http://127.0.0.1:3000/how-to-order', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const htoPath = path.join(ARTIFACT_DIR, `slice3-how-to-order-${vp.name}.png`);
    await page.screenshot({ path: htoPath, fullPage: false });
    const htoFullPath = path.join(ARTIFACT_DIR, `slice3-how-to-order-${vp.name}-full.png`);
    await page.screenshot({ path: htoFullPath, fullPage: true });

    // 4. /contact Page
    console.log(`Capturing Contact Page at ${vp.name}...`);
    await page.goto('http://127.0.0.1:3000/contact', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const contactPath = path.join(ARTIFACT_DIR, `slice3-contact-${vp.name}.png`);
    await page.screenshot({ path: contactPath, fullPage: false });
    const contactFullPath = path.join(ARTIFACT_DIR, `slice3-contact-${vp.name}-full.png`);
    await page.screenshot({ path: contactFullPath, fullPage: true });

    // 5. /policies Page
    console.log(`Capturing Policies Page at ${vp.name}...`);
    await page.goto('http://127.0.0.1:3000/policies', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const policiesPath = path.join(ARTIFACT_DIR, `slice3-policies-${vp.name}.png`);
    await page.screenshot({ path: policiesPath, fullPage: false });
    const policiesFullPath = path.join(ARTIFACT_DIR, `slice3-policies-${vp.name}-full.png`);
    await page.screenshot({ path: policiesFullPath, fullPage: true });

    await context.close();
  }

  await browser.close();
  console.log('All Slice 3 screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
