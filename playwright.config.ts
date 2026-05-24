import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  expect: {
    timeout: 10000,
  },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:1313",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command:
      "hugo server --port 1313 --baseURL http://localhost:1313 --disableFastRender --noHTTPCache",
    url: "http://localhost:1313",
    reuseExistingServer: true,
    timeout: 120000,
  },
  outputDir: "./e2e-results",
});
