const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.resolve('C:/Users/Nagarjun/.gemini/antigravity/brain/5c624ff9-8db2-40b2-a173-0e674b94ef51');

const sampleCartItems = [
  {
    id: 'rice',
    titleTe: 'దేశవాళీ బియ్యం',
    titleEn: 'Indigenous Rice',
    selectedUnit: '25kg',
    price: 2500,
    qty: 1,
    image: '/assets/images/rice.jpg'
  },
  {
    id: 'sesame',
    titleTe: 'నువ్వుల నూనె',
    titleEn: 'Sesame Oil',
    selectedUnit: '1L',
    price: 450,
    qty: 2,
    image: '/assets/images/sesame.jpg'
  }
];

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

    // 1. PRODUCT DETAIL (/product/rice)
    console.log(`Capturing Product Detail at ${vp.name}...`);
    await page.goto('http://127.0.0.1:3000/product/rice', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const prodDetailPath = path.join(ARTIFACT_DIR, `slice2-product-detail-${vp.name}.png`);
    await page.screenshot({ path: prodDetailPath, fullPage: false });

    const prodDetailFullPath = path.join(ARTIFACT_DIR, `slice2-product-detail-${vp.name}-full.png`);
    await page.screenshot({ path: prodDetailFullPath, fullPage: true });

    // 2. CART PAGE (/cart) with seeded items
    console.log(`Capturing Cart Page at ${vp.name}...`);
    await page.goto('http://127.0.0.1:3000/cart', { waitUntil: 'networkidle' });
    await page.evaluate((items) => {
      localStorage.setItem('kg_cart_v1', JSON.stringify(items));
    }, sampleCartItems);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const cartPath = path.join(ARTIFACT_DIR, `slice2-cart-${vp.name}.png`);
    await page.screenshot({ path: cartPath, fullPage: false });

    const cartFullPath = path.join(ARTIFACT_DIR, `slice2-cart-${vp.name}-full.png`);
    await page.screenshot({ path: cartFullPath, fullPage: true });

    // 3. CHECKOUT PAGE (/checkout) with seeded items & populated form
    console.log(`Capturing Checkout Page at ${vp.name}...`);
    await page.goto('http://127.0.0.1:3000/checkout', { waitUntil: 'networkidle' });
    await page.evaluate((items) => {
      localStorage.setItem('kg_cart_v1', JSON.stringify(items));
    }, sampleCartItems);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Fill sample customer info to show complete checkout state
    if (await page.$('#chk-name')) {
      await page.fill('#chk-name', 'రాఘవ శర్మ (Raghava Sharma)');
      await page.fill('#chk-phone', '9876543210');
      await page.fill('#chk-address', 'ఫ్లాట్ 402, శ్రీ వెంకటేశ్వర రెసిడెన్సీ, శ్రీకాకుళం, ఆంధ్రప్రదేశ్ - 532001');
      await page.fill('#chk-utr', '432109876543');
    }

    const checkoutPath = path.join(ARTIFACT_DIR, `slice2-checkout-${vp.name}.png`);
    await page.screenshot({ path: checkoutPath, fullPage: false });

    const checkoutFullPath = path.join(ARTIFACT_DIR, `slice2-checkout-${vp.name}-full.png`);
    await page.screenshot({ path: checkoutFullPath, fullPage: true });

    await context.close();
  }

  await browser.close();
  console.log('All Slice 2 screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
