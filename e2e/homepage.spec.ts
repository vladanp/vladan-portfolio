import { test, expect } from "@playwright/test";

test("homepage loads with correct title", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Vladan/i);
});

test("homepage has key sections visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".main-container")).toBeVisible();
  await expect(page.locator(".intro-section")).toBeVisible();
  await expect(page.locator(".expertise-section")).toBeVisible();
  await expect(page.locator(".social-links")).toBeVisible();
});

test("homepage has meta description", async ({ page }) => {
  await page.goto("/");
  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute("content", /Vladan/i);
});

test("homepage is valid HTML", async ({ page }) => {
  await page.goto("/");
  const title = await page.title();
  expect(title).toBeTruthy();
  const doctype = await page.evaluate(() => document.doctype?.name);
  expect(doctype).toBe("html");
});
