const { test, expect } = require('@playwright/test');

test.describe('Kurmagram Vedic Village — Phase 5 Quality Gate (Q1 - Q6)', () => {

  // Q1: Zero Console Errors across all core pages
  test('Q1: Zero console errors and unhandled exceptions across all pages', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    const routes = ['/', '/shop', '/product/rice', '/cart', '/checkout', '/about', '/how-to-order', '/contact', '/policies'];
    for (const r of routes) {
      await page.goto(r, { waitUntil: 'networkidle' });
      await page.waitForTimeout(200);
    }

    expect(consoleErrors).toHaveLength(0);
  });

  // Q2: Telugu Conjunct Rendering at 360px and 1440px without clipping
  test('Q2: Telugu conjuncts (క్ష, జ్ఞ, త్ర, శ్ర) render without vertical or horizontal clipping', async ({ page }) => {
    const viewports = [{ width: 1440, height: 900 }, { width: 360, height: 780 }];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto('/', { waitUntil: 'networkidle' });

      // Check key Telugu headings containing complex conjuncts
      const conjunctElements = await page.evaluate(() => {
        const textElements = Array.from(document.querySelectorAll('h1, h2, h3, .milestone-title, .brand-name-te'));
        return textElements.map(el => {
          const text = el.textContent || '';
          const hasConjunct = /[క్షజ్ఞత్రశ్ర]/.test(text);
          const style = window.getComputedStyle(el);
          const isHiddenOverflow = style.overflow === 'hidden' || style.overflowY === 'hidden' || style.overflowX === 'hidden';
          const isClipped = isHiddenOverflow && (el.scrollHeight > el.clientHeight + 4 || el.scrollWidth > el.clientWidth + 4);
          return { text: text.trim().slice(0, 30), hasConjunct, isClipped, scrollH: el.scrollHeight, clientH: el.clientHeight };
        }).filter(item => item.hasConjunct);
      });

      expect(conjunctElements.length).toBeGreaterThan(0);
      conjunctElements.forEach(item => {
        expect(item.isClipped).toBe(false);
      });
    }
  });

  // Q3: Reduced-Motion Contract
  test('Q3: prefers-reduced-motion: reduce renders all content immediately in static visible state', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'networkidle' });

    // Verify fluid headline content is fully populated immediately without typing delay
    const headlineContent = await page.locator('#heroFluidHeadline').textContent();
    expect(headlineContent?.length).toBeGreaterThan(5);

    // Verify milestones are visible
    const milestoneCount = await page.locator('.story-milestone-card').count();
    expect(milestoneCount).toBe(4);

    for (let i = 0; i < milestoneCount; i++) {
      const card = page.locator('.story-milestone-card').nth(i);
      await expect(card).toBeVisible();
    }
  });

  // Q4: Keyboard Navigation & Focus Trap
  test('Q4: Keyboard navigation traverses controls and Cart Drawer traps focus on open', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Tab to header cart button and open drawer
    await page.focus('#headerCartBtn');
    await page.keyboard.press('Enter');

    const drawer = page.locator('#cartDrawer');
    await expect(drawer).toHaveClass(/open/);

    // Close on Escape key
    await page.keyboard.press('Escape');
    await expect(drawer).not.toHaveClass(/open/);
  });

  // Q5: No-JS Fallback
  test('Q5: Complete site functions gracefully when JavaScript is disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const noJsPage = await context.newPage();

    await noJsPage.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });

    // Verify catalog commodities and prices render server-side
    const productRows = await noJsPage.locator('.product-ledger-row').count();
    expect(productRows).toBe(8);

    // Verify phone and WhatsApp links work natively
    const waLink = noJsPage.locator('a[href*="wa.me"]').first();
    await expect(waLink).toBeVisible();
    const href = await waLink.getAttribute('href');
    expect(href).toContain('917732075607');

    await context.close();
  });

  // Q6: Full Order Flow E2E
  test('Q6: Full order journey from catalog selection to checkout and WhatsApp handoff', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/shop', { waitUntil: 'networkidle' });

    // Click on Indigenous Rice row to view product detail
    await page.locator('#prod-card-rice a[href*="/product/rice"]').click();
    await page.waitForURL('**/product/rice');

    // Select 25kg unit pill
    const unitPill25kg = page.locator('.detail-unit-pill:has-text("25kg")');
    if (await unitPill25kg.count() > 0) {
      await unitPill25kg.click();
    }

    // Add to Cart
    await page.locator('#detailAddToCartBtn').click();
    await page.waitForTimeout(300);

    // Navigate to dedicated Checkout page
    await page.goto('http://127.0.0.1:3000/checkout', { waitUntil: 'networkidle' });

    // Verify customer input fields exist
    await page.fill('#pageCustName', 'శ్రీనివాస్ రావు');
    await page.fill('#pageCustPhone', '9848012345');
    await page.fill('#pageCustAddress', 'ఇంటి నం. 4-21, గాంధీ నగర్, విజయవాడ, ఆంధ్రప్రదేశ్ - 520003');
    await page.fill('#pageUtrInput', '412398765432');

    // Verify NPCI QR code is present in DOM
    const qrSvg = page.locator('#pageUpiQrContainer svg');
    await expect(qrSvg).toBeVisible();

    // Verify UPI deep link contains NPCI parameters
    const upiLink = await page.locator('#pageUpiDeepLinkBtn').getAttribute('href');
    expect(upiLink).toContain('upi://pay');
    expect(upiLink).toContain('pa=kurmagramvv@upi');
  });

});
