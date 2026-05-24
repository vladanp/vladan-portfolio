import { test, expect } from "@playwright/test";

test("404 page loads correctly for nonexistent route", async ({ page }) => {
  const response = await page.goto("/nonexistent-page");
  expect(response?.status()).toBe(404);
  await expect(page.locator(".error-page")).toBeVisible();
  await expect(page.locator(".error-page__code")).toHaveText("404");
  await expect(page.locator(".error-page__title")).toBeVisible();
  await expect(page.locator(".error-page__home-link")).toHaveAttribute(
    "href",
    "/"
  );
});

test("404 page has navigation link back to home", async ({ page }) => {
  await page.goto("/nonexistent-page");
  await page.click(".error-page__home-link");
  await expect(page).toHaveURL("/");
});
