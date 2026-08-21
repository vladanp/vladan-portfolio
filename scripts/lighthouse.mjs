import { spawn } from "node:child_process";
import { access, mkdir, readFile } from "node:fs/promises";
import { once } from "node:events";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

import { chromium } from "@playwright/test";

const localURL = "http://127.0.0.1:4173/";
const requestedURL = process.argv[2];
const targetURL = new URL(requestedURL ?? localURL);
const reportDirectory = path.resolve(".lighthouseci");
const runCount = Number.parseInt(
  process.env.LIGHTHOUSE_RUNS ?? (requestedURL ? "3" : "1"),
  10,
);
const chromeFlags = [
  "--headless=new",
  ...(process.env.CI ? ["--no-sandbox"] : []),
].join(" ");
const thresholds = {
  performance: 0.9,
  accessibility: 1,
  "best-practices": 0.95,
  seo: 1,
};

if (!["http:", "https:"].includes(targetURL.protocol)) {
  throw new Error("The Lighthouse target must use HTTP or HTTPS.");
}

if (targetURL.username || targetURL.password) {
  throw new Error("The Lighthouse target must not contain credentials.");
}

if (!Number.isInteger(runCount) || runCount < 1 || runCount > 5) {
  throw new Error("LIGHTHOUSE_RUNS must be an integer between 1 and 5.");
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", ...options });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${command} exited with ${signal ? `signal ${signal}` : `code ${code}`}`,
        ),
      );
    });
  });
}

async function waitForServer(url, server, deadline = Date.now() + 30_000) {
  if (server.exitCode !== null) {
    throw new Error(`Hugo exited with code ${server.exitCode} before startup.`);
  }

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (response.ok) return;
  } catch {
    // The server may still be starting.
  }

  if (Date.now() >= deadline) {
    throw new Error(`Hugo did not become ready at ${url} within 30 seconds.`);
  }

  await delay(250);
  return waitForServer(url, server, deadline);
}

async function stopServer(server) {
  if (!server || server.exitCode !== null) return;

  server.kill("SIGTERM");
  await Promise.race([once(server, "exit"), delay(5_000)]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

async function playwrightChromePath() {
  const executablePath = chromium.executablePath();
  try {
    await access(executablePath);
    return executablePath;
  } catch {
    return undefined;
  }
}

function median(values) {
  const sorted = values.toSorted((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

async function collectAuditScores(chromePath, scores, runNumber = 1) {
  if (runNumber > runCount) return;

  const reportPath = path.join(reportDirectory, `lighthouse-${runNumber}.json`);
  const environment = chromePath
    ? { ...process.env, CHROME_PATH: chromePath }
    : process.env;

  await run(
    "pnpm",
    [
      "exec",
      "lighthouse",
      targetURL.href,
      "--quiet",
      "--locale=en-US",
      `--chrome-flags=${chromeFlags}`,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--output=json",
      `--output-path=${reportPath}`,
    ],
    { env: environment },
  );

  const report = JSON.parse(await readFile(reportPath, "utf8"));
  for (const category of Object.keys(thresholds)) {
    scores[category].push(report.categories[category].score);
  }

  return collectAuditScores(chromePath, scores, runNumber + 1);
}

async function main() {
  let server;

  try {
    if (!requestedURL) {
      server = spawn(
        "hugo",
        [
          "server",
          "--environment",
          "production",
          "--minify",
          "--renderToMemory",
          "--disableLiveReload",
          "--disableFastRender",
          "--noHTTPCache",
          "--bind",
          "127.0.0.1",
          "--port",
          "4173",
          "--baseURL",
          localURL,
        ],
        { stdio: "inherit" },
      );
      await delay(100);
      await waitForServer(localURL, server);
    }

    await mkdir(reportDirectory, { recursive: true });
    const chromePath =
      process.env.CHROME_PATH ?? (await playwrightChromePath());
    const scores = Object.fromEntries(
      Object.keys(thresholds).map((category) => [category, []]),
    );

    await collectAuditScores(chromePath, scores);

    const failures = [];
    for (const [category, threshold] of Object.entries(thresholds)) {
      const score = median(scores[category]);
      console.log(
        `${category}: ${Math.round(score * 100)} (minimum ${threshold * 100})`,
      );
      if (score < threshold) failures.push(`${category}: ${score}`);
    }

    if (failures.length > 0) {
      throw new Error(`Lighthouse thresholds failed: ${failures.join(", ")}`);
    }
  } finally {
    await stopServer(server);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
