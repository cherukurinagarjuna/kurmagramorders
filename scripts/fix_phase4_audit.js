const fs = require('fs');

let css = fs.readFileSync('src/styles/styles.css', 'utf8');

// 1. Line 208: transition: all in header
css = css.replace(
  /transition:\s*all\s*var\(--transition-smooth\);/,
  'transition: background-color var(--transition-smooth), border-color var(--transition-smooth), box-shadow var(--transition-smooth);'
);

// 2. Line 304: transition: all in nav-btn
css = css.replace(
  /transition:\s*all\s*var\(--transition-tactile\);(\s*\})/,
  'transition: background-color var(--transition-tactile), border-color var(--transition-tactile), color var(--transition-tactile);$1'
);

// 3. Line 470 diamond
css = css.replace(
  /\.hero-newspaper-rule::after\s*\{[^}]+\}/,
  `.hero-newspaper-rule::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 20%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background-color: var(--color-ittadi);
  border: 1px solid var(--color-kasi);
}`
);

// 4. Line 513 & 536
css = css.replace(
  /(btn-sharp-primary[\s\S]*?)transition:\s*all\s*0\.15s\s*ease-out;/,
  '$1transition: background-color 0.15s ease-out, color 0.15s ease-out, transform 0.15s ease-out, box-shadow 0.15s ease-out;'
);
css = css.replace(
  /(btn-sharp-secondary[\s\S]*?)transition:\s*all\s*0\.15s\s*ease-out;/,
  '$1transition: background-color 0.15s ease-out, color 0.15s ease-out, border-color 0.15s ease-out;'
);

// 5. Line 775
css = css.replace(
  /(\.btn\s*\{[\s\S]*?)transition:\s*all\s*var\(--transition-tactile\);/,
  '$1transition: background-color var(--transition-tactile), border-color var(--transition-tactile), color var(--transition-tactile), transform var(--transition-tactile), box-shadow var(--transition-tactile);'
);

// 6. Line 1045 search-input
css = css.replace(
  /(\.search-input\s*\{[\s\S]*?)transition:\s*all\s*var\(--transition-tactile\);/,
  '$1transition: border-color var(--transition-tactile), box-shadow var(--transition-tactile), background-color var(--transition-tactile);'
);

// 7. Line 1073 chip-btn
css = css.replace(
  /(\.chip-btn\s*\{[\s\S]*?)transition:\s*all\s*var\(--transition-tactile\);/,
  '$1transition: background-color var(--transition-tactile), border-color var(--transition-tactile), color var(--transition-tactile), transform var(--transition-tactile);'
);

// 8. Line 1193 search-input-ledger
css = css.replace(
  /(\.search-input-ledger\s*\{[\s\S]*?)transition:\s*all\s*0\.15s\s*ease;/,
  '$1transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;'
);

// 9. Line 1375 unit-pill
css = css.replace(
  /(\.unit-pill\s*\{[\s\S]*?)transition:\s*all\s*0\.12s\s*ease;/,
  '$1transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease;'
);

// 10. Line 1467 catalog-link-action
css = css.replace(
  /(\.catalog-link-action[\s\S]*?)transition:\s*all\s*0\.15s\s*ease-out;/,
  '$1transition: color 0.15s ease-out, transform 0.15s ease-out;'
);

// 11. Line 1637 unit-pill
css = css.replace(
  /(\.unit-pill\s*\{[\s\S]*?)transition:\s*all\s*var\(--transition-tactile\);/,
  '$1transition: background-color var(--transition-tactile), color var(--transition-tactile), border-color var(--transition-tactile);'
);

// 12. Line 1669 btn-add-cart
css = css.replace(
  /(\.btn-add-cart\s*\{[\s\S]*?)transition:\s*all\s*var\(--transition-tactile\);/,
  '$1transition: background-color var(--transition-tactile), transform var(--transition-tactile);'
);

// 13. Line 1738 story-step-item
css = css.replace(
  /(\.story-step-item\s*\{[\s\S]*?)transition:\s*all\s*var\(--transition-tactile\);/,
  '$1transition: border-left-color var(--transition-tactile), box-shadow var(--transition-tactile);'
);

// 14. Drawer backdrop & Modal overlay (Lines 1883/1887 & 2033/2041)
css = css.replace(
  /backdrop-filter:\s*blur\(2px\);/g,
  '/* no heavy glassmorphism blur */'
);
css = css.replace(
  /(\.drawer-backdrop\s*\{[\s\S]*?)transition:\s*all\s*var\(--transition-smooth\);/,
  '$1transition: opacity var(--transition-smooth), visibility var(--transition-smooth);'
);
css = css.replace(
  /(\.modal-overlay\s*\{[\s\S]*?)transition:\s*all\s*var\(--transition-smooth\);/,
  '$1transition: opacity var(--transition-smooth), visibility var(--transition-smooth);'
);

// 15. Toast notice (Line 2201)
css = css.replace(
  /(\.toast-notice\s*\{[\s\S]*?)transition:\s*all\s*var\(--transition-smooth\);/,
  '$1transition: transform var(--transition-smooth), opacity var(--transition-smooth);'
);

// 16. Story footer buttons (Lines 3569 & 3586)
css = css.replace(
  /(\.story-footer-btn-primary\s*\{[\s\S]*?)transition:\s*all\s*0\.2s\s*ease;/,
  '$1transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;'
);
css = css.replace(
  /(\.story-footer-btn-secondary\s*\{[\s\S]*?)transition:\s*all\s*0\.2s\s*ease;/,
  '$1transition: background-color 0.2s ease, color 0.2s ease;'
);

// 17. Diamond in standards list (Line 3770)
css = css.replace(
  /\.editorial-standards-list\s+li::before\s*\{[^}]+\}/,
  `.editorial-standards-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.6rem;
  width: 6px;
  height: 6px;
  background-color: var(--color-ittadi);
  border: 1px solid var(--color-kasi);
  transform: rotate(45deg);
}`
);

// 18. Editorial visit buttons (Lines 3965 & 3985)
css = css.replace(
  /(\.btn-editorial-primary\s*\{[\s\S]*?)transition:\s*all\s*0\.2s\s*ease;/,
  '$1transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;'
);
css = css.replace(
  /(\.btn-editorial-secondary\s*\{[\s\S]*?)transition:\s*all\s*0\.2s\s*ease;/,
  '$1transition: background-color 0.2s ease;'
);

// Replace any remaining transition: all with explicit properties
css = css.replace(/transition:\s*all\s*([^;]+);/g, (match, timing) => {
  return `transition: transform ${timing}, opacity ${timing}, background-color ${timing}, border-color ${timing}, color ${timing};`;
});

fs.writeFileSync('src/styles/styles.css', css);
fs.writeFileSync('public/css/styles.css', css);
fs.writeFileSync('css/styles.css', css);
console.log('All CSS files updated and synced cleanly.');
