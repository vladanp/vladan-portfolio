import { chromium } from "@playwright/test";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(projectRoot, "scripts/social-image.html");
const outputPath = resolve(projectRoot, "assets/images/og-image.png");

const browser = await chromium.launch();

try {
  const page = await browser.newPage({
    deviceScaleFactor: 1,
    viewport: { height: 630, width: 1200 },
  });
  await page.goto(pathToFileURL(sourcePath).href, { waitUntil: "load" });
  await page.screenshot({ path: outputPath, type: "png" });
} finally {
  await browser.close();
}
