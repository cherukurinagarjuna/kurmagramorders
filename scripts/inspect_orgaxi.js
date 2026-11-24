const https = require('https');

https.get('https://themazine.com/html/Orgaxi/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Fonts
    const fonts = data.match(/fonts\.googleapis\.com[^\"]+/g) || [];
    console.log('FONTS:', fonts);

    // Style files
    const css = data.match(/href=[\"'][^\"']*\.css[^\"']*[\"']/g) || [];
    console.log('STYLESHEETS:', css.slice(0, 10));

    // Headings
    const headings = [...data.matchAll(/<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi)]
      .map(m => m[2].replace(/<[^>]+>/g, '').trim())
      .filter(Boolean);
    console.log('HEADINGS:', headings.slice(0, 15));

    // Nav items
    const navItems = [...data.matchAll(/<li[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/gi)]
      .map(m => m[1].replace(/<[^>]+>/g, '').trim())
      .filter(t => t.length > 1 && t.length < 30);
    console.log('NAV ITEMS:', [...new Set(navItems)].slice(0, 12));

    // Structure overview: extract main sections
    const sections = [...data.matchAll(/<(section|header|footer)[^>]*class=[\"']([^\"']+)[\"']/gi)]
      .map(m => `${m[1]}.${m[2].split(/\s+/).join('.')}`);
    console.log('MAIN SECTIONS:', sections);
  });
}).on('error', err => console.error('Fetch error:', err.message));
