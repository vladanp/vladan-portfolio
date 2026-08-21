import { chromium } from "@playwright/test";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(projectRoot, "scripts/site-icon.html");
const outputs = [
  [16, "assets/images/favicon-16x16.png"],
  [32, "assets/images/favicon-32x32.png"],
  [180, "assets/images/apple-touch-icon.png"],
  [192, "static/android-chrome-192x192.png"],
  [512, "static/android-chrome-512x512.png"],
];

const browser = await chromium.launch();

try {
  await Promise.all(
    outputs.map(async ([size, relativePath]) => {
      const page = await browser.newPage({
        deviceScaleFactor: 1,
        viewport: { height: size, width: size },
      });
      await page.goto(pathToFileURL(sourcePath).href, { waitUntil: "load" });
      await page.screenshot({
        omitBackground: true,
        path: resolve(projectRoot, relativePath),
        type: "png",
      });
      await page.close();
    }),
  );
} finally {
  await browser.close();
}
