const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const artifactDir = 'C:/Users/Nagarjun/.gemini/antigravity/brain/5c624ff9-8db2-40b2-a173-0e674b94ef51';

  console.log('--- TEST 1: Checkout Modal ---');
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });

  // Add item and open modal
  await page.evaluate(() => {
    window.store.addToCart('sunni', 0, 1);
    window.store.openCheckoutModal();
  });
  await page.waitForTimeout(500);

  // Check presence of fields
  const modalFields = await page.evaluate(() => {
    return {
      hasLandmark: !!document.getElementById('custLandmark'),
      hasPincode: !!document.getElementById('custPincode'),
      hasNavataNotice: !!document.querySelector('.navata-shipping-notice'),
      navataLink: document.querySelector('.navata-shipping-notice a')?.href
    };
  });
  console.log('Modal fields detected:', modalFields);

  await page.screenshot({ path: path.join(artifactDir, 'modal-with-landmark-and-pincode-1440px.png') });

  // Fill modal
  await page.fill('#custName', 'నరసింహారావు');
  await page.fill('#custPhone', '9848012345');
  await page.fill('#custAddress', 'ఫ్లాట్ 201, కూర్మ గ్రామం రోడ్');
  await page.fill('#custLandmark', 'పాత శివాలయం వద్ద');
  await page.fill('#custPincode', '532001');
  await page.check('#modalUtrScreenshotOpt');

  // Submit modal
  console.log('Submitting modal order...');
  await page.click('#submitOrderWhatsAppBtn');
  await page.waitForTimeout(600);

  const modalResult = await page.evaluate(() => {
    const card = document.getElementById('modalOrderSuccessCard');
    const printBtn = card ? card.querySelector('button[onclick*="print"]') : null;
    return {
      cardVisible: card ? card.style.display !== 'none' : false,
      hasPrintBtn: !!printBtn,
      cardText: card ? card.innerText : ''
    };
  });
  console.log('Modal submit result (hasPrintBtn should be false):', modalResult);
  await page.screenshot({ path: path.join(artifactDir, 'modal-success-no-print-1440px.png') });

  console.log('--- TEST 2: Dedicated /checkout Page ---');
  await page.goto('http://127.0.0.1:3000/checkout', { waitUntil: 'networkidle' });

  // Add item to cart for checkout page
  await page.evaluate(() => {
    window.store.addToCart('sunni', 0, 1);
    window.location.reload();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle' });

  const pageFields = await page.evaluate(() => {
    return {
      hasLandmark: !!document.getElementById('pageCustLandmark'),
      hasPincode: !!document.getElementById('pageCustPincode'),
      hasNavataBox: !!document.querySelector('.navata-shipping-notice-box'),
      navataLink: document.querySelector('.navata-shipping-notice-box a')?.href
    };
  });
  console.log('/checkout fields detected:', pageFields);

  await page.screenshot({ path: path.join(artifactDir, 'checkout-page-with-navata-1440px.png') });

  // Fill /checkout page
  await page.fill('#pageCustName', 'గోపాలకృష్ణ');
  await page.fill('#pageCustPhone', '9440123456');
  await page.fill('#pageCustAddress', 'ఇంటి నం. 5-12, కృష్ణ నగర్');
  await page.fill('#pageCustLandmark', 'గోశాల ఆర్చ్ ఎదురుగా');
  await page.fill('#pageCustPincode', '532401');
  await page.check('#pageUtrScreenshotOpt');

  console.log('Submitting /checkout page order...');
  await page.click('#pageSubmitOrderWhatsAppBtn');
  await page.waitForTimeout(600);

  const checkoutResult = await page.evaluate(() => {
    const printBtn = document.querySelector('.btn-print-slip');
    const celebration = document.getElementById('receiptSentCelebration');
    const successDetails = document.querySelector('.success-details-card');
    return {
      hasPrintBtn: !!printBtn,
      successDetailsText: successDetails ? successDetails.innerText : '',
      waReceiptBtnText: document.querySelector('.btn-wa-active-receipt')?.innerText
    };
  });
  console.log('/checkout submit result (hasPrintBtn should be false):', checkoutResult);
  await page.screenshot({ path: path.join(artifactDir, 'checkout-success-no-print-1440px.png') });

  await browser.close();
  console.log('All tests completed successfully!');
})();
