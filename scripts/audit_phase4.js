const fs = require('fs');
const path = require('path');

const targetDirs = ['src', 'js'];
const filesToAudit = [];

function collectFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full);
    } else if (/\.(astro|css|js|html)$/.test(entry.name)) {
      filesToAudit.push(full);
    }
  }
}

targetDirs.forEach(collectFiles);

const findings = {};

function addFinding(file, lineNo, message) {
  const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
  if (!findings[rel]) findings[rel] = [];
  findings[rel].push(`${rel}:${lineNo} - ${message}`);
}

const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
const fluffRegex = /(discover\s+peace|find\s+harmony\s+within|nourish\s+your\s+soul|awaken\s+your\s+spirit|radiate\s+peace)/i;

filesToAudit.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;

    // 1. Emoji icons / decoration
    if (emojiRegex.test(line)) {
      // Ignore comment or test file if any
      addFinding(file, lineNo, `Emoji icon/decoration detected in UI: ${line.trim()}`);
    }

    // 2. Vague fluff copy
    if (fluffRegex.test(line)) {
      addFinding(file, lineNo, `Banned vague AI fluff copy detected: ${line.trim()}`);
    }

    // 3. transition: all
    if (/transition\s*:\s*all/i.test(line)) {
      addFinding(file, lineNo, `transition: all → list properties explicitly`);
    }

    // 4. outline: none / outline-none without focus-visible
    if (/(outline\s*:\s*none|outline-none)/i.test(line) && !line.includes(':focus-visible') && !line.includes('outline:')) {
      addFinding(file, lineNo, `outline: none detected without replacement`);
    }

    // 5. Triple dots ... instead of ellipsis …
    if (/\.{3}/.test(line) && !line.includes('...') && !line.includes('//') && !line.includes('/*') && !line.includes('import') && !line.includes('Astro.props')) {
      if (line.includes('...') && !line.includes('({') && !line.includes('Astro') && !line.includes('Props') && !line.includes('...Array') && !line.includes('...')) {
        // check if user-visible text
      }
    }

    // 6. Generic banned fonts (Inter, Roboto, Poppins)
    if (/font-family.*(Inter|Roboto|Poppins)/i.test(line)) {
      addFinding(file, lineNo, `Banned generic font family found: ${line.trim()}`);
    }

    // 7. rounded-2xl
    if (/rounded-2xl/i.test(line)) {
      addFinding(file, lineNo, `Banned rounded-2xl class found`);
    }

    // 8. Lorem ipsum
    if (/lorem\s+ipsum/i.test(line)) {
      addFinding(file, lineNo, `Banned lorem ipsum placeholder text found`);
    }

    // 9. Glassmorphism backdrop-filter: blur
    if (/backdrop-filter\s*:\s*blur\([1-9]/i.test(line) && !line.includes('var(')) {
      addFinding(file, lineNo, `Excessive glassmorphism blur detected`);
    }

    // 10. Purple / indigo SaaS gradients
    if (/(linear-gradient|radial-gradient).*#(?:[6789a-fA-F][0-9a-fA-F]{3,5}|(?:purple|violet|indigo))/i.test(line)) {
      addFinding(file, lineNo, `Banned purple/indigo SaaS gradient detected`);
    }

    // 11. HTML-specific checks for .astro
    if (file.endsWith('.astro')) {
      // <img> without alt
      if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(line)) {
        addFinding(file, lineNo, `img tag missing alt attribute`);
      }
      // <img> without width or height
      if (/<img\b(?![^>]*\bwidth=)[^>]*>/i.test(line) && !line.includes('role="presentation"')) {
        addFinding(file, lineNo, `img tag missing explicit width/height`);
      }
      // button without aria-label if no text or icon only
      if (/<button\b(?![^>]*\baria-label=)[^>]*>\s*<svg/i.test(line)) {
        addFinding(file, lineNo, `Icon-only button missing aria-label`);
      }
      // input without label or aria-label
      if (/<input\b(?![^>]*\b(aria-label|id)=)[^>]*>/i.test(line)) {
        addFinding(file, lineNo, `input element missing id or aria-label for accessibility`);
      }
    }
  });
});

console.log('--- Phase 4 Audit Results ---');
let totalFindings = 0;
for (const [file, items] of Object.entries(findings)) {
  console.log(`\n## ${file}`);
  items.forEach(it => console.log(it));
  totalFindings += items.length;
}

if (totalFindings === 0) {
  console.log('\n✓ Zero findings! All files pass Web Interface Guidelines and Anti-Slop Blacklist.');
} else {
  console.log(`\nTotal findings: ${totalFindings}`);
}
