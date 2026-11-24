const fs = require('fs');

let css = fs.readFileSync('src/styles/styles.css', 'utf8');

// 1. .hero-brand-title
css = css.replace(
  /\.hero-brand-title\s*\{([^}]+)\}/,
  (match, p1) => {
    let updated = p1.replace(/line-height:\s*[^;]+;/, 'line-height: 1.75;');
    return `.hero-brand-title {${updated}}`;
  }
);

// 2. .ledger-title
css = css.replace(
  /\.ledger-title\s*\{([^}]+)\}/,
  (match, p1) => {
    let updated = p1.replace(/line-height:\s*[^;]+;/, 'line-height: 1.75;');
    return `.ledger-title {${updated}}`;
  }
);

// 3. .ledger-name-te
css = css.replace(
  /\.ledger-name-te\s*\{([^}]+)\}/,
  (match, p1) => {
    let updated = p1.replace(/line-height:\s*[^;]+;/, 'line-height: 1.75;');
    return `.ledger-name-te {${updated}}`;
  }
);

// 4. .story-editorial-title
css = css.replace(
  /\.story-editorial-title\s*\{([^}]+)\}/,
  (match, p1) => {
    let updated = p1.replace(/line-height:\s*[^;]+;/, 'line-height: 1.75;');
    return `.story-editorial-title {${updated}}`;
  }
);

// 5. .milestone-title
css = css.replace(
  /\.milestone-title\s*\{([^}]+)\}/,
  (match, p1) => {
    let updated = p1.replace(/line-height:\s*[^;]+;/, 'line-height: 1.75;');
    return `.milestone-title {${updated}}`;
  }
);

// 6. .brand-name-te
css = css.replace(
  /\.brand-name-te\s*\{([^}]+)\}/,
  (match, p1) => {
    let updated = p1.replace(/line-height:\s*[^;]+;/, 'line-height: 1.75;');
    if (!updated.includes('display:')) updated += '\n  display: inline-block;';
    return `.brand-name-te {${updated}}`;
  }
);

// 7. .section-title
css = css.replace(
  /\.section-title\s*\{([^}]+)\}/,
  (match, p1) => {
    let updated = p1.replace(/line-height:\s*[^;]+;/, 'line-height: 1.75;');
    return `.section-title {${updated}}`;
  }
);

fs.writeFileSync('src/styles/styles.css', css);
console.log('Telugu typography line-heights updated to 1.75');
