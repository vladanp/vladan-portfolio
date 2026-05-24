import { test, expect } from "@playwright/test";

test.describe("404 page", () => {
  test("returns HTTP 404 with correct elements", async ({ page }) => {
    const response = await page.goto("/nonexistent-page");
    expect(response?.status()).toBe(404);
    await expect(page.locator(".error-page")).toBeVisible();
    await expect(page.locator(".error-page__code")).toHaveText("404");
    await expect(page.locator(".error-page__title")).toBeVisible();
  });

  test("home link navigates back to homepage", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await expect(page.locator(".error-page__home-link")).toHaveAttribute(
      "href",
      "/",
    );
    await page.click(".error-page__home-link");
    await expect(page).toHaveURL("/");
    await expect(page.locator(".main-container")).toBeVisible();
  });

  test("has correct SEO metadata", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await expect(page).toHaveTitle(/Page Not Found/i);
    await expect(page).toHaveTitle(/Vladan/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
    );
    // 404 pages should not expose structured data
    await expect(
      page.locator('script[type="application/ld+json"]'),
    ).not.toBeAttached();
  });
});
