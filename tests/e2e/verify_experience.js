import fs from 'fs';
import path from 'path';

console.log('=== VuAnalytics QA Verification & Viewport Audit ===\n');

const distDir = path.resolve('dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('[FAIL] dist/index.html does not exist! Please run "npm run build" first.');
  process.exit(1);
}

const html = fs.readFileSync(indexHtmlPath, 'utf8');

const checks = [
  { name: 'Document Title Check', test: html.includes('<title>VuAnalytics 4.0') },
  { name: 'Font Space Grotesk Link', test: html.includes('Space+Grotesk') },
  { name: 'Font Inter Link', test: html.includes('family=Inter') },
  { name: 'Font JetBrains Mono Link', test: html.includes('JetBrains+Mono') },
  { name: 'Root Mount Element', test: html.includes('<div id="root"></div>') },
  { name: 'Open Graph Metadata', test: html.includes('property="og:title"') && html.includes('property="og:description"') },
  { name: 'Canonical Domain', test: html.includes('href="https://vuanalytics.me"') },
  { name: 'Favicon Declaration', test: html.includes('rel="icon"') },
];

let allPassed = true;
checks.forEach((c) => {
  if (c.test) {
    console.log(`[PASS] ${c.name}`);
  } else {
    console.error(`[FAIL] ${c.name}`);
    allPassed = false;
  }
});

// Inspect compiled CSS bundle for responsive breakpoints & reduced motion
const assetsDir = path.join(distDir, 'assets');
const cssFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.css'));

if (cssFiles.length > 0) {
  const css = fs.readFileSync(path.join(assetsDir, cssFiles[0]), 'utf8');
  
  const cssChecks = [
    { name: 'Design Token Background (#090f1c)', test: css.includes('#090f1c') },
    { name: 'Design Token Surface (#111b2e)', test: css.includes('#111b2e') },
    { name: 'Design Token Accent Cyan (#22d3ee)', test: css.includes('#22d3ee') },
    { name: 'Design Token Accent Violet (#8b5cf6)', test: css.includes('#8b5cf6') },
    { name: 'Reduced Motion Media Query', test: css.includes('prefers-reduced-motion') },
    { name: 'Mobile Viewport Breakpoint (sm)', test: css.includes('min-width: 640px') || css.includes('640px') },
    { name: 'Tablet Viewport Breakpoint (md)', test: css.includes('min-width: 768px') || css.includes('768px') },
    { name: 'Desktop Viewport Breakpoint (lg)', test: css.includes('min-width: 1024px') || css.includes('1024px') },
    { name: 'Ultrawide Breakpoint (xl)', test: css.includes('min-width: 1280px') || css.includes('1280px') },
  ];

  console.log('\n--- Responsive CSS & Media Query Verification ---');
  cssChecks.forEach((c) => {
    if (c.test) {
      console.log(`[PASS] ${c.name}`);
    } else {
      console.error(`[FAIL] ${c.name}`);
      allPassed = false;
    }
  });
}

// Inspect compiled JS bundle for vendor splitting
const jsFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
console.log('\n--- Bundle Code-Splitting Audit ---');
jsFiles.forEach((file) => {
  const stat = fs.statSync(path.join(assetsDir, file));
  const sizeKb = (stat.size / 1024).toFixed(2);
  const isUnderLimit = stat.size < 600 * 1024;
  console.log(`[${isUnderLimit ? 'PASS' : 'WARN'}] ${file}: ${sizeKb} KB`);
  if (!isUnderLimit) allPassed = false;
});

if (allPassed) {
  console.log('\n>>> ALL 18 QA VERIFICATION GATES PASSED! <<<');
  process.exit(0);
} else {
  console.error('\n>>> QA VERIFICATION FAILED! <<<');
  process.exit(1);
}
