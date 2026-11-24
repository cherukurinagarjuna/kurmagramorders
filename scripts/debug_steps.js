const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1000);
  
  const stepsEl = await page.$('#how-to-order');
  if (stepsEl) {
    const box = await stepsEl.boundingBox();
    console.log('Steps box:', box);
    const cards = await page.$$('.step-card');
    console.log('Step cards count:', cards.length);
    for (let i = 0; i < cards.length; i++) {
      const cBox = await cards[i].boundingBox();
      const opacity = await cards[i].evaluate(el => window.getComputedStyle(el).opacity);
      const display = await cards[i].evaluate(el => window.getComputedStyle(el).display);
      const visibility = await cards[i].evaluate(el => window.getComputedStyle(el).visibility);
      console.log('Card ' + i + ':', { cBox, opacity, display, visibility });
    }
  }

  // Also check after scrolling to #how-to-order
  await stepsEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  console.log('--- After scrollIntoView ---');
  const cardsAfter = await page.$$('.step-card');
  for (let i = 0; i < cardsAfter.length; i++) {
    const opacity = await cardsAfter[i].evaluate(el => window.getComputedStyle(el).opacity);
    console.log('Card ' + i + ' opacity after scroll:', opacity);
  }

  await browser.close();
})();
