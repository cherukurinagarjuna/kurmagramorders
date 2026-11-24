const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '../vendor/fonts');
if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

const url = 'https://fonts.googleapis.com/css2?family=Noto+Serif+Telugu:wght@600;700&family=Ramabhadra&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700&family=Source+Sans+3:wght@400;600&display=swap';

const options = {
  headers: {
    // User agent to receive modern woff2 format
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(url, options, (res) => {
  let css = '';
  res.on('data', chunk => css += chunk);
  res.on('end', async () => {
    console.log('Fetched CSS of length:', css.length);
    
    // Extract url(...) matches
    const urlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^\)]+)\)/g;
    let match;
    const downloads = [];
    let fontIndex = 1;

    let modifiedCss = css;

    while ((match = urlRegex.exec(css)) !== null) {
      const fontUrl = match[1];
      const fontExt = path.extname(fontUrl.split('?')[0]) || '.woff2';
      const fileName = `custom-font-${fontIndex}${fontExt}`;
      fontIndex++;
      
      downloads.push({ fontUrl, fileName });
      modifiedCss = modifiedCss.replace(fontUrl, fileName);
    }

    console.log(`Downloading ${downloads.length} font slices...`);

    for (const d of downloads) {
      await new Promise((resolve, reject) => {
        const dest = path.join(fontsDir, d.fileName);
        const file = fs.createWriteStream(dest);
        https.get(d.fontUrl, (resp) => {
          resp.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }).on('error', reject);
      });
      console.log(`Saved ${d.fileName}`);
    }

    // Append to fonts.css
    fs.appendFileSync(path.join(fontsDir, 'fonts.css'), '\n/* --- Noto Serif Telugu, Ramabhadra, Fraunces, Source Sans 3 --- */\n' + modifiedCss);
    console.log('Successfully updated fonts.css and vendored all font files locally!');
  });
}).on('error', err => {
  console.error('Error fetching fonts:', err);
});
