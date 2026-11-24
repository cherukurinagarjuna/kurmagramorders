import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Nagarjun\\.gemini\\antigravity\\brain\\5c624ff9-8db2-40b2-a173-0e674b94ef51';

async function recapture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1050 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  const slipUrl = 'http://127.0.0.1:3000/slip?id=1&code=KG-20261123-0001&key=changeme';
  await page.goto(slipUrl);
  await page.waitForSelector('#dispatchSlipDocument', { state: 'visible', timeout: 10000 });
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'dispatch-slip-preview-1440px.png'),
    fullPage: true
  });

  // Mobile screenshot
  const mobContext = await browser.newContext({
    viewport: { width: 420, height: 900 },
    deviceScaleFactor: 1
  });
  const pageMob = await mobContext.newPage();
  await pageMob.goto(slipUrl);
  await pageMob.waitForSelector('#dispatchSlipDocument', { state: 'visible', timeout: 10000 });
  await pageMob.waitForTimeout(500);

  await pageMob.screenshot({
    path: path.join(ARTIFACT_DIR, 'dispatch-slip-preview-mobile.png'),
    fullPage: true
  });

  await browser.close();
  console.log('Recaptured slip screenshots cleanly!');
}

recapture().catch(err => {
  console.error(err);
  process.exit(1);
});
