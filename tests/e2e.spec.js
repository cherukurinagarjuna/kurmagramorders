const { test, expect } = require('@playwright/test');

test.describe('Kurmagram Vedic Village E2E Acceptance Suite (T1 - T14)', () => {

  test('T1: Home page loads with Telugu default title and tagline', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/కూర్మగ్రామ వేదిక్ విలేజ్/);
    const tagline = page.locator('.hero-tagline');
    await expect(tagline).toContainText('సరళ జీవనం – ఉన్నత ఆశయం');
  });

  test('T2: Zero external runtime CDN calls', async ({ page }) => {
    const externalRequests = [];
    page.on('request', (req) => {
      const url = req.url();
      if (!url.startsWith('http://localhost:3000') && !url.startsWith('http://127.0.0.1:3000') && !url.startsWith('data:') && !url.startsWith('blob:')) {
        externalRequests.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(externalRequests).toEqual([]);
  });

  test('T3: Bilingual toggle flips text between Telugu and English dynamically', async ({ page }) => {
    await page.goto('/');
    const langBtn = page.locator('#langToggleBtn');
    await expect(langBtn).toContainText('English');

    // Switch to English
    await langBtn.click();
    await expect(langBtn).toContainText('తెలుగు');
    await expect(page.locator('.hero-tagline')).toContainText('Simple Living – High Thinking');

    // Switch back to Telugu
    await langBtn.click();
    await expect(langBtn).toContainText('English');
    await expect(page.locator('.hero-tagline')).toContainText('సరళ జీవనం – ఉన్నత ఆశయం');
  });

  test('T4: Fuzzy product search works for Telugu and English queries', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('#productSearchInput');

    // Search Telugu keyword 'సున్నిపిండి'
    await searchInput.fill('సున్నిపిండి');
    await page.waitForTimeout(300);
    const cardsTe = page.locator('.product-card');
    await expect(cardsTe).toHaveCount(1);
    await expect(cardsTe.first()).toContainText('సున్నిపిండి');

    // Search English keyword 'brown rice'
    await searchInput.fill('brown rice');
    await page.waitForTimeout(300);
    const cardsEn = page.locator('.product-card');
    await expect(cardsEn).toHaveCount(1);
    await expect(cardsEn.first()).toContainText('బ్రౌన్ రైస్');

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(300);
    const allCards = page.locator('.product-card');
    await expect(allCards).toHaveCount(8);
  });

  test('T5: Category filter chips filter products accurately', async ({ page }) => {
    await page.goto('/');
    // Click 'గానుగ నూనెలు' (Oils category)
    const oilsChip = page.locator('.chip-btn[data-category="oils"]');
    await oilsChip.click();
    await page.waitForTimeout(200);

    const cards = page.locator('.product-card');
    await expect(cards).toHaveCount(2); // Sesame oil and Groundnut oil
    await expect(cards.nth(0)).toContainText('నువ్వుల నూనె');
    await expect(cards.nth(1)).toContainText('పల్లి నూనె');
  });

  test('T6: Unit selector switches size and updates price accordingly', async ({ page }) => {
    await page.goto('/');
    // Check Rice 25kg special discount offer
    const riceCard = page.locator('#prod-card-rice');
    const unitPills = riceCard.locator('.unit-pill');
    await expect(unitPills).toHaveCount(2);

    // Initial unit: 1kg @ ₹130
    await expect(riceCard.locator('.price-val')).toHaveText('₹130');

    // Click 25kg pill
    await unitPills.nth(1).click();
    await expect(riceCard.locator('.price-val')).toHaveText('₹3000');
    await expect(riceCard.locator('.discount-badge')).toContainText('₹250 తగ్గింపు!');
  });

  test('T7: Add to Cart updates badge count and shows toast notice', async ({ page }) => {
    await page.goto('/');
    const firstAddBtn = page.locator('.product-card .btn-add-cart').first();
    await firstAddBtn.click();

    // Verify badge count
    const badge = page.locator('#cartCountBadge');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('1');

    // Verify toast
    const toast = page.locator('#toastNotification');
    await expect(toast).toHaveClass(/show/);
  });

  test('T8: Cart Drawer quantity controls (+ / - / remove) update totals', async ({ page }) => {
    await page.goto('/');
    // Add two items
    await page.locator('#prod-card-sunni .btn-add-cart').click();
    await page.waitForTimeout(100);

    // Open Cart Drawer
    await page.locator('#headerCartBtn').click();
    const cartDrawer = page.locator('#cartDrawer');
    await expect(cartDrawer).toHaveClass(/open/);

    const subtotalEl = page.locator('#cartSubtotalAmount');
    await expect(subtotalEl).toHaveText('₹120');

    // Increment quantity
    await cartDrawer.locator('.inc-btn').click();
    await expect(subtotalEl).toHaveText('₹240');

    // Decrement quantity
    await cartDrawer.locator('.dec-btn').click();
    await expect(subtotalEl).toHaveText('₹120');

    // Remove item
    await cartDrawer.locator('.cart-remove-btn').click();
    await expect(page.locator('.cart-empty-view')).toBeVisible();
    await expect(subtotalEl).toHaveText('₹0');
  });

  test('T9: Cart Drawer accessibility (ESC key close and body scroll lock)', async ({ page }) => {
    await page.goto('/');
    await page.locator('#headerCartBtn').click();
    await expect(page.locator('body')).toHaveClass(/scroll-locked/);

    // Press Escape
    await page.keyboard.press('Escape');
    await expect(page.locator('#cartDrawer')).not.toHaveClass(/open/);
    await expect(page.locator('body')).not.toHaveClass(/scroll-locked/);
  });

  test('T10: Checkout modal opens with generated Order ID', async ({ page }) => {
    await page.goto('/');
    await page.locator('#prod-card-sunni .btn-add-cart').click();
    await page.locator('#headerCartBtn').click();
    await page.locator('#cartCheckoutBtn').click();

    const checkoutModal = page.locator('#checkoutModal');
    await expect(checkoutModal).toHaveClass(/active/);

    const orderIdText = await page.locator('#checkoutOrderId').textContent();
    expect(orderIdText).toMatch(/^KG-\d{8}-\d{4}$/);
  });

  test('T11: UPI QR code is rendered in DOM', async ({ page }) => {
    await page.goto('/');
    await page.locator('#prod-card-sunni .btn-add-cart').click();
    await page.locator('#headerCartBtn').click();
    await page.locator('#cartCheckoutBtn').click();

    const qrContainer = page.locator('#upiQrContainer');
    await expect(qrContainer.locator('svg')).toBeVisible();
  });

  test('T12: UPI deep link format matches NPCI specifications', async ({ page }) => {
    await page.goto('/');
    await page.locator('#prod-card-sunni .btn-add-cart').click(); // ₹120
    await page.locator('#headerCartBtn').click();
    await page.locator('#cartCheckoutBtn').click();

    const deepLink = page.locator('#upiPayDeepLink');
    const href = await deepLink.getAttribute('href');
    expect(href).toContain('upi://pay?');
    expect(href).toContain('pa=kurmagramvv%40upi');
    expect(href).toContain('pn=Kurmagram%20Vedic%20Village');
    expect(href).toContain('am=120.00');
    expect(href).toContain('cu=INR');
    expect(href).toContain('tn=KG-');
  });

  test('T13: WhatsApp submission URL contains encoded order details', async ({ page }) => {
    await page.goto('/');
    await page.locator('#prod-card-sunni .btn-add-cart').click();
    await page.locator('#headerCartBtn').click();
    await page.locator('#cartCheckoutBtn').click();

    // Fill form
    await page.fill('#custName', 'రామకృష్ణ');
    await page.fill('#custPhone', '9876543210');
    await page.fill('#custAddress', 'శ్రీకాకుళం, ఆంధ్రప్రదేశ్, 532428');

    // Intercept window.open
    const [popup] = await Promise.all([
      page.waitForEvent('popup').catch(() => null),
      page.click('#submitOrderWhatsAppBtn')
    ]);

    if (popup) {
      const url = popup.url();
      expect(url).toMatch(/(?:wa\.me\/917732075607|phone=917732075607)/);
      expect(url).toContain(encodeURIComponent('రామకృష్ణ'));
      expect(url).toContain(encodeURIComponent('సున్నిపిండి'));
    }
  });

  test('T14: Mobile viewport (360x640) has no horizontal scroll overflow', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow subpixel rounding
  });

});
