import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],
  use: {
    baseURL: "http://localhost:1313",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "hugo server --port 1313 --baseURL http://localhost:1313 --disableFastRender",
    url: "http://localhost:1313",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  outputDir: "./e2e-results",
});
