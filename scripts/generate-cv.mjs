import { chromium } from "@playwright/test";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(projectRoot, "scripts/vladan-petrovic-cv.html");
const outputPath = resolve(projectRoot, "static/vladan-petrovic-cv.pdf");

const browser = await chromium.launch(
  process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : undefined,
);

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(sourcePath).href, { waitUntil: "load" });
  await page.pdf({
    displayHeaderFooter: false,
    outline: true,
    path: outputPath,
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
  });
} finally {
  await browser.close();
}
