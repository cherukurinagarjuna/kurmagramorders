const fs = require('fs');
let c = fs.readFileSync('public/js/app.js', 'utf8');

c = c.replace(
  'const L=I||`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(this.formatWhatsAppMessage(S))}`;',
  'const L=(I&&I.includes("917732075607"))?I:`https://wa.me/917732075607?text=${encodeURIComponent(this.formatWhatsAppMessage(S))}`;'
);

c = c.replace(
  'n=`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(this.formatWhatsAppMessage(r))}`;',
  'n=`https://wa.me/917732075607?text=${encodeURIComponent(this.formatWhatsAppMessage(r))}`;'
);

fs.writeFileSync('public/js/app.js', c, 'utf8');
console.log('Cleanly updated public/js/app.js');
