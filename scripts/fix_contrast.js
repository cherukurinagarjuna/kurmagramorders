const fs = require('fs');

let css = fs.readFileSync('src/styles/styles.css', 'utf8');

// Add --color-ittadi-text in :root
css = css.replace(
  '  --color-ittadi: #B5944B;',
  '  --color-ittadi: #B5944B;\n  --color-ittadi-text: #6B4F10;   /* Deep antique brass ink: 7.1:1 AAA contrast on cream */'
);

// 1. .brand-name-en
css = css.replace(
  /(\.brand-name-en\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 2. .ledger-row-num
css = css.replace(
  /(\.ledger-row-num\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 3. .ledger-serial
css = css.replace(
  /(\.ledger-serial\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 4. .ledger-eyebrow
css = css.replace(
  /(\.ledger-eyebrow\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 5. .milestone-step-index
css = css.replace(
  /(\.milestone-step-index\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 6. .milestone-latin-sub
css = css.replace(
  /(\.milestone-latin-sub\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 7. .masthead-vintage-tag
css = css.replace(
  /(\.masthead-vintage-tag\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 8. .gallery-kicker
css = css.replace(
  /(\.gallery-kicker\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 9. .step-eng-tag
css = css.replace(
  /(\.step-eng-tag\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 10. .channel-tag
css = css.replace(
  /(\.channel-tag\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 11. .policy-num
css = css.replace(
  /(\.policy-num\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 12. .visit-meta-item strong
css = css.replace(
  /(\.visit-meta-item strong\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 13. .gps-stamp
css = css.replace(
  /(\.gps-stamp\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 14. .detail-sku-badge
css = css.replace(
  /(\.detail-sku-badge\s*\{[^}]+color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// 15. .shop-hero-banner
css = css.replace(
  /(\.shop-hero-banner[^{]*\{[\s\S]*?color:\s*)var\(--color-ittadi\);/,
  '$1var(--color-ittadi-text);'
);

// Also check #detailAddToCartBtn aria-label in src/pages/product/[id].astro
fs.writeFileSync('src/styles/styles.css', css);
fs.writeFileSync('public/css/styles.css', css);
fs.writeFileSync('css/styles.css', css);
console.log('Contrast updates written to styles.css.');
