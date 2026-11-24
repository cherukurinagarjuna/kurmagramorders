const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

const routes = [
  { name: 'Home (/)', url: 'http://127.0.0.1:3000/' },
  { name: 'Shop (/shop)', url: 'http://127.0.0.1:3000/shop' },
  { name: 'Product Detail (/product/rice)', url: 'http://127.0.0.1:3000/product/rice' },
  { name: 'Cart (/cart)', url: 'http://127.0.0.1:3000/cart' },
  { name: 'Checkout (/checkout)', url: 'http://127.0.0.1:3000/checkout' },
  { name: 'About (/about)', url: 'http://127.0.0.1:3000/about' },
  { name: 'How to Order (/how-to-order)', url: 'http://127.0.0.1:3000/how-to-order' },
  { name: 'Contact (/contact)', url: 'http://127.0.0.1:3000/contact' },
  { name: 'Policies (/policies)', url: 'http://127.0.0.1:3000/policies' },
];

async function runAxeAudit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('--- Axe-Core WCAG 2.2 AA Audit ---');
  let totalCritical = 0;
  let totalSerious = 0;
  const results = [];

  for (const r of routes) {
    await page.goto(r.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    const criticalViolations = axeResults.violations.filter(v => v.impact === 'critical');
    const seriousViolations = axeResults.violations.filter(v => v.impact === 'serious');
    const otherViolations = axeResults.violations.filter(v => v.impact !== 'critical' && v.impact !== 'serious');

    totalCritical += criticalViolations.length;
    totalSerious += seriousViolations.length;

    results.push({
      name: r.name,
      passes: axeResults.passes.length,
      critical: criticalViolations,
      serious: seriousViolations,
      other: otherViolations
    });

    console.log(`\nPage: ${r.name}`);
    console.log(`  Passed rules: ${axeResults.passes.length}`);
    console.log(`  Critical: ${criticalViolations.length}`);
    console.log(`  Serious: ${seriousViolations.length}`);
    console.log(`  Moderate/Minor: ${otherViolations.length}`);

    if (criticalViolations.length > 0 || seriousViolations.length > 0) {
      console.log('  Violations:');
      [...criticalViolations, ...seriousViolations].forEach(v => {
        console.log(`    - [${v.impact.toUpperCase()}] ${v.id}: ${v.help}`);
        v.nodes.forEach(n => console.log(`      Target: ${n.target.join(' ')}`));
      });
    }
  }

  await browser.close();

  console.log('\n====================================');
  console.log(`Total Critical Violations: ${totalCritical}`);
  console.log(`Total Serious Violations: ${totalSerious}`);
  if (totalCritical === 0 && totalSerious === 0) {
    console.log('✓ WCAG 2.2 AA Gate PASSED: Zero critical and zero serious violations!');
  } else {
    console.log('❌ WCAG 2.2 AA Gate FAILED');
  }
}

runAxeAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
