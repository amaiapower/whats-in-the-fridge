// One-off / recurring dev tool: captures a screenshot of a local route using
// the system's installed Edge/Chrome (via puppeteer-core, no bundled browser).
// Usage: node build-log/screenshot.mjs <path> <output-filename>
// Example: node build-log/screenshot.mjs /retro build-log/screenshots/retro.png
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const executablePath = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

const [, , routePath, outputFile] = process.argv;
if (!routePath || !outputFile) {
  console.error("Usage: node screenshot.mjs <path> <output-filename>");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1400 });
  await page.goto(`http://localhost:3000${routePath}`, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: outputFile, fullPage: true });
  console.log(`Saved ${outputFile}`);
} finally {
  await browser.close();
}
