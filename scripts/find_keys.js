const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let res = [];
  if (!fs.existsSync(dir)) return res;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) res.push(...getFiles(p));
    else res.push(p);
  }
  return res;
}

const files = [...getFiles('src'), 'index.html'];
const keys = new Set();
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /data-i18n=["']([^"']+)["']/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    keys.add(m[1]);
  }
}

console.log('Total keys found:', keys.size);
console.log(JSON.stringify(Array.from(keys).sort(), null, 2));

// Compare with STRINGS in js/app.js
const appJs = fs.readFileSync('js/app.js', 'utf8');
const stringsMatch = appJs.match(/const STRINGS = \{[\s\S]*?\n\s*\};/);
let STRINGS;
if (stringsMatch) {
  eval(stringsMatch[0].replace('const STRINGS', 'STRINGS'));
  const teKeys = Object.keys(STRINGS.te);
  const enKeys = Object.keys(STRINGS.en);
  const missingInTe = Array.from(keys).filter(k => !STRINGS.te[k]);
  const missingInEn = Array.from(keys).filter(k => !STRINGS.en[k]);
  console.log('\nMissing in STRINGS.te:', missingInTe);
  console.log('\nMissing in STRINGS.en:', missingInEn);
}
