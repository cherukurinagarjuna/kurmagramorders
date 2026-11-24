const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running Lighthouse Mobile Audit on http://127.0.0.1:3000/ ...');

const outputPath = path.resolve('scripts/lighthouse-report.json');

try {
  execSync(
    `npx lighthouse http://127.0.0.1:3000/ --output=json --output-path="${outputPath}" --form-factor=mobile --screenEmulation.mobile=true --throttling-method=simulate --chrome-flags="--headless" --quiet`,
    { stdio: 'inherit', timeout: 90000 }
  );

  const raw = fs.readFileSync(outputPath, 'utf8');
  const report = JSON.parse(raw);

  const categories = report.categories;
  const perf = Math.round(categories.performance.score * 100);
  const a11y = Math.round(categories.accessibility.score * 100);
  const bestPractices = Math.round(categories['best-practices'].score * 100);
  const seo = Math.round(categories.seo.score * 100);

  const audits = report.audits;
  const lcp = audits['largest-contentful-paint'] ? audits['largest-contentful-paint'].displayValue : 'N/A';
  const cls = audits['cumulative-layout-shift'] ? audits['cumulative-layout-shift'].displayValue : 'N/A';
  const tbt = audits['total-blocking-time'] ? audits['total-blocking-time'].displayValue : 'N/A';
  const fcp = audits['first-contentful-paint'] ? audits['first-contentful-paint'].displayValue : 'N/A';
  const speedIndex = audits['speed-index'] ? audits['speed-index'].displayValue : 'N/A';

  console.log('\n--- Lighthouse Mobile Results ---');
  console.log(`Performance:    ${perf} / 100  (Target: ≥90)`);
  console.log(`Accessibility:  ${a11y} / 100  (Target: ≥95)`);
  console.log(`Best Practices: ${bestPractices} / 100  (Target: ≥95)`);
  console.log(`SEO:            ${seo} / 100  (Target: ≥95)`);
  console.log('\n--- Core Web Vitals (Mobile Lab) ---');
  console.log(`LCP (Largest Contentful Paint): ${lcp} (Target: < 2.5s)`);
  console.log(`CLS (Cumulative Layout Shift):  ${cls} (Target: < 0.1)`);
  console.log(`TBT (Total Blocking Time):       ${tbt}`);
  console.log(`FCP (First Contentful Paint):   ${fcp}`);
  console.log(`Speed Index:                    ${speedIndex}`);

} catch (err) {
  console.error('Lighthouse execution failed:', err);
  process.exit(1);
}
