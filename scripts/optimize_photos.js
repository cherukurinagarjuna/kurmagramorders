const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../assets/images/farm/raw');
const outDir = path.join(__dirname, '../assets/images/farm/optimized');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

const widths = [1200, 800, 400];

async function processAll() {
  console.log(`Optimizing ${files.length} farm photos...`);
  const manifest = [];

  for (const file of files) {
    const baseName = path.parse(file).name;
    const inputPath = path.join(srcDir, file);

    const image = sharp(inputPath);
    const meta = await image.metadata();
    console.log(`Processing ${file} (Original: ${meta.width}x${meta.height})`);

    const fileEntry = {
      original: file,
      originalDimensions: `${meta.width}x${meta.height}`,
      variants: []
    };

    for (const w of widths) {
      if (w > meta.width && w !== 400) continue; // Don't upscale unless it's mobile min

      const targetWidth = Math.min(w, meta.width);

      // WebP
      const webpName = `${baseName}-${targetWidth}w.webp`;
      const webpPath = path.join(outDir, webpName);
      await sharp(inputPath)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: 82, effort: 6 })
        .toFile(webpPath);
      const webpStat = fs.statSync(webpPath);

      // AVIF
      const avifName = `${baseName}-${targetWidth}w.avif`;
      const avifPath = path.join(outDir, avifName);
      await sharp(inputPath)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .avif({ quality: 75, effort: 6 })
        .toFile(avifPath);
      const avifStat = fs.statSync(avifPath);

      fileEntry.variants.push({
        width: targetWidth,
        webp: { file: webpName, sizeKb: (webpStat.size / 1024).toFixed(1) },
        avif: { file: avifName, sizeKb: (avifStat.size / 1024).toFixed(1) }
      });
    }

    manifest.push(fileEntry);
  }

  fs.writeFileSync(path.join(outDir, 'photo-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('Successfully optimized all photos into responsive WebP & AVIF!');
}

processAll().catch(err => {
  console.error('Processing error:', err);
  process.exit(1);
});
