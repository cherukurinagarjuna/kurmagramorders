const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

function downloadBinary(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBinary(res.headers.location, dest).then(resolve).catch(reject);
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => resolve());
      stream.on('error', reject);
    });
  });
}

async function main() {
  console.log('Fetching Google Fonts woff2...');
  const css1 = await fetchText('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  const css2 = await fetchText('https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;600;700&display=swap');
  const combinedCss = css1 + '\n' + css2;

  const blocks = combinedCss.split('@font-face').slice(1);
  let localCss = '';
  let count = 0;

  for (const block of blocks) {
    const familyMatch = block.match(/font-family:\s*['"]?([^'";\n]+)['"]?/);
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    const urlMatch = block.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    const unicodeMatch = block.match(/unicode-range:\s*([^;]+);/);

    if (familyMatch && weightMatch && urlMatch) {
      count++;
      const rawFamily = familyMatch[1].trim();
      const familyClean = rawFamily.replace(/\s+/g, '');
      const weight = weightMatch[1].trim();
      const filename = `${familyClean}-${weight}-${count}.woff2`;
      const filePath = path.join(__dirname, '..', 'vendor', 'fonts', filename);

      await downloadBinary(urlMatch[1], filePath);
      console.log('Downloaded', filename, '(' + fs.statSync(filePath).size + ' B)');

      localCss += `@font-face {\n  font-family: '${rawFamily}';\n  font-style: normal;\n  font-weight: ${weight};\n  font-display: swap;\n  src: url('../vendor/fonts/${filename}') format('woff2');\n` +
        (unicodeMatch ? `  unicode-range: ${unicodeMatch[1].trim()};\n` : '') + `}\n\n`;
    }
  }

  const cssOutPath = path.join(__dirname, '..', 'vendor', 'fonts', 'fonts.css');
  fs.writeFileSync(cssOutPath, localCss);
  console.log('vendor/fonts/fonts.css created successfully with', count, 'font faces!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
