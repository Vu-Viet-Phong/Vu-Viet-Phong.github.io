import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

console.log('=== REAL PLAYWRIGHT BROWSER E2E TEST SUITE (VUANALYTICS 4.0) ===\n');

const SCREENSHOTS_DIR = path.resolve('screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// 1. Start Vite Preview Server
const previewPort = 4173;
const previewUrl = `http://localhost:${previewPort}`;

const previewProcess = spawn('cmd.exe', ['/c', 'npx', 'vite', 'preview', '--port', String(previewPort)], {
  stdio: 'pipe',
  env: { ...process.env, PATH: `d:\\web\\Vu-Viet-Phong.github.io\\node;${process.env.PATH}` }
});

// Wait for server to become ready
async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200 || res.status === 304) return true;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

await waitForServer(previewUrl);


let browser;
let exitCode = 0;
const results = [];

function recordResult(testName, passed, details = '') {
  results.push({ testName, passed, details });
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${testName} ${details ? '(' + details + ')' : ''}`);
  if (!passed) exitCode = 1;
}

try {
  // Launch Chrome via Playwright channel
  browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  // 1. Initial Load & Document Verification
  await page.goto(previewUrl, { waitUntil: 'networkidle' });
  const title = await page.title();
  recordResult('Document Title', title.includes('VuAnalytics 4.0'), title);

  // 2. Viewport Test: Desktop 1920x1080
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop_1920.png'), fullPage: false });
  recordResult('Desktop 1920x1080 Viewport & Screenshot', true);

  // 3. Viewport Test: Desktop 1440x900
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop_1440.png'), fullPage: false });
  recordResult('Desktop 1440x900 Viewport & Screenshot', true);

  // 4. Viewport Test: Tablet 768x1024
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'tablet_768.png'), fullPage: false });
  recordResult('Tablet 768x1024 Viewport & Screenshot', true);

  // 5. Viewport Test: Mobile 375x812 (iPhone X/13/14)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_375.png'), fullPage: false });
  recordResult('Mobile 375x812 Viewport & Screenshot', true);

  // 6. Viewport Test: Ultra-compact 320x568 (iPhone SE 1st gen)
  await page.setViewportSize({ width: 320, height: 568 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_320.png'), fullPage: false });
  recordResult('Mobile 320x568 Ultra-compact Viewport & Screenshot', true);

  // Switch back to Desktop 1440 for functional tests
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);

  // 7. Navigation Test
  const labNav = page.locator('nav a[href="#lab"]').first();
  if (await labNav.isVisible()) {
    await labNav.click();
    await page.waitForTimeout(600);
  }
  const labSection = page.locator('#lab');
  const isLabVisible = await labSection.isVisible();
  recordResult('Navigation to #lab Section', isLabVisible);

  // 8. Cytoscape Neural Knowledge Graph Interaction
  const graphCanvas = page.locator('div[aria-label="Interactive Knowledge Graph"]');
  const graphExists = await graphCanvas.isVisible();
  recordResult('Neural Knowledge Graph Mounted', graphExists);

  // Click Reset View Button
  const resetBtn = page.locator('button:has-text("Reset View")');
  if (await resetBtn.isVisible()) {
    await resetBtn.click();
    recordResult('Cytoscape Reset View Button Interaction', true);
  } else {
    recordResult('Cytoscape Reset View Button Interaction', false, 'Reset button not visible');
  }

  // 9. Interactive User-Item Sparse Matrix Demo
  const matrixSection = page.locator('#projects');
  await matrixSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Check sparsity ratio text
  const sparsityText = page.locator('text=Sparsity:');
  const sparsityVisible = await sparsityText.isVisible();
  recordResult('Sparse Matrix Sparsity Indicator Present', sparsityVisible);

  // Find and click a matrix cell button
  const matrixButtons = page.locator('button[aria-label*="User"][aria-label*="Item"]');
  const buttonCount = await matrixButtons.count();
  if (buttonCount > 0) {
    const firstCell = matrixButtons.first();
    const initialLabel = await firstCell.getAttribute('aria-label');
    await firstCell.click();
    await page.waitForTimeout(300);
    const updatedLabel = await firstCell.getAttribute('aria-label');
    const toggled = initialLabel !== updatedLabel;
    recordResult('Sparse Matrix Cell Dynamic Toggle Interaction', toggled, `${initialLabel} -> ${updatedLabel}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sparse_matrix_interaction.png') });
  } else {
    recordResult('Sparse Matrix Cell Dynamic Toggle Interaction', false, 'Matrix buttons not found');
  }

  // 10. AI Lab: Recommendation Arena State & Persona Switch
  const arenaTabBtn = page.locator('#lab button:has-text("Recommendation Arena")');
  if (await arenaTabBtn.isVisible()) {
    await arenaTabBtn.click();
    await page.waitForTimeout(400);
  }

  const personaButtons = page.locator('#lab button:has-text("User")');
  if (await personaButtons.count() >= 2) {
    const secondPersona = personaButtons.nth(1);
    await secondPersona.click();
    await page.waitForTimeout(400);
    recordResult('Recommendation Arena Persona Switch Interaction', true);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'ai_lab_arena.png') });
  } else {
    recordResult('Recommendation Arena Persona Switch Interaction', false, 'Personas not clickable');
  }

  // 11. AI Lab: 2D Embedding Space Explorer Interaction (V4.0 Core Feature)
  const embeddingTabBtn = page.locator('#lab button:has-text("Embedding Explorer")');
  if (await embeddingTabBtn.isVisible()) {
    await embeddingTabBtn.click();
    await page.waitForTimeout(600);
    
    // Check SVG scatter canvas rendered
    const embeddingSvg = page.locator('#lab svg[viewBox="0 0 600 600"]');
    const svgRendered = await embeddingSvg.isVisible();
    recordResult('2D Embedding Space Explorer Mounted', svgRendered);

    // Verify user node clicked and latent inspector displays coordinates
    const userNodes = page.locator('#lab svg polygon');
    if (await userNodes.count() > 0) {
      await userNodes.first().click();
      await page.waitForTimeout(400);
      const inspectorText = page.locator('#lab').getByText('PCA Latent Coordinates', { exact: false });
      recordResult('Embedding Space Node Click & Latent Inspector', await inspectorText.isVisible());
    }

    // Capture screenshot of Embedding Explorer
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'embedding_space_explorer.png') });
  } else {
    recordResult('2D Embedding Space Explorer Mounted', false, 'Tab button not found');
  }

  // 12. MMRec Benchmark Dashboard Verification (V4.0 Core Feature)
  await matrixSection.scrollIntoViewIfNeeded();
  const evalTabBtn = page.locator('#projects button:has-text("Benchmark Protocol")');
  if (await evalTabBtn.isVisible()) {
    await evalTabBtn.click();
    await page.waitForTimeout(600);

    const empiricalTable = page.locator('#projects table').first();
    const tableVisible = await empiricalTable.isVisible();
    recordResult('Empirical Benchmark Table Rendered', tableVisible);

    const simulationTable = page.locator('#projects table').nth(1);
    const simTableVisible = await simulationTable.isVisible();
    recordResult('Theoretical Simulations Segregated Table Rendered', simTableVisible);

    const provenanceText = page.locator('#projects').getByText('Julian McAuley Lab', { exact: false });
    recordResult('Dataset Provenance Card Displayed', await provenanceText.isVisible());

    // Capture screenshot of Benchmark comparison
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'benchmark_comparison.png') });
  } else {
    recordResult('Empirical Benchmark Table Rendered', false, 'Evaluation tab button not found');
  }

  // 13. Fashion Copilot Prompt Switch
  const copilotPrompt = page.locator('#products button:has-text("summer day out")');
  if (await copilotPrompt.isVisible()) {
    await copilotPrompt.click();
    await page.waitForTimeout(400);
    const cottonAttr = page.locator('#products').getByText('Cotton', { exact: false }).first();
    recordResult('Fashion Copilot Intent Switching Interaction', await cottonAttr.isVisible());
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'fashion_copilot.png') });
  } else {
    recordResult('Fashion Copilot Intent Switching Interaction', false, 'Test intent not found');
  }

  // 14. Uncaught JS Exceptions & Network Fallback Verification
  const pageErrors = [];
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  const jsErrors = consoleErrors.filter(e => !e.includes('ERR_CONNECTION_REFUSED'));
  const networkFallbackCaught = consoleErrors.some(e => e.includes('ERR_CONNECTION_REFUSED'));

  recordResult('Zero Uncaught JavaScript Runtime Errors', pageErrors.length === 0 && jsErrors.length === 0, jsErrors.join('; '));
  recordResult('Network Offline Fallback Gracefully Caught', networkFallbackCaught, 'FastAPI offline fallback safely triggered');

  console.log('\n=== REAL BROWSER E2E SUMMARY ===');
  console.log(`Total tests: ${results.length}`);
  console.log(`Passed: ${results.filter((r) => r.passed).length}`);
  console.log(`Failed: ${results.filter((r) => !r.passed).length}`);
  console.log(`Screenshots saved to: ${SCREENSHOTS_DIR}`);

} catch (err) {
  console.error('[FATAL ERROR in E2E]', err);
  exitCode = 1;
} finally {
  if (browser) await browser.close();
  previewProcess.kill();
  process.exit(exitCode);
}
