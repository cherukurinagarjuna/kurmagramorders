const esbuild = require('esbuild');
const fs = require('fs');

async function minifyFiles() {
  const targets = [
    'public/vendor/qrcode.min.js',
    'public/js/app.js',
    'public/js/motion.js'
  ];

  for (const file of targets) {
    if (fs.existsSync(file)) {
      const code = fs.readFileSync(file, 'utf8');
      const min = await esbuild.transform(code, { minify: true });
      fs.writeFileSync(file, min.code);
      console.log(`Minified ${file}: ${code.length} -> ${min.code.length} bytes`);
    }
  }
}

minifyFiles().catch(console.error);
