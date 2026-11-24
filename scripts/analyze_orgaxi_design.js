const https = require('https');

https.get('https://themazine.com/html/Orgaxi/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    // 1. Hero / Slider
    const heroIdx = html.indexOf('slider-four');
    if (heroIdx !== -1) {
      console.log('--- HERO SECTION SNIPPET ---');
      console.log(html.slice(heroIdx, heroIdx + 1200));
    }

    // 2. Product Card
    const prodIdx = html.indexOf('product-block');
    if (prodIdx !== -1) {
      console.log('\n--- PRODUCT BLOCK SNIPPET ---');
      console.log(html.slice(prodIdx, prodIdx + 1200));
    }

    // 3. Category / Icons
    const catIdx = html.indexOf('category-two');
    if (catIdx !== -1) {
      console.log('\n--- CATEGORY SNIPPET ---');
      console.log(html.slice(catIdx, catIdx + 1000));
    }
  });
}).on('error', err => console.error(err));
