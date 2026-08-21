import { test, expect } from "@playwright/test";

test.describe("homepage", () => {
  test("responds HTTP 200 with correct title", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Vladan/i);
  });

  test("key sections are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".main-container")).toBeVisible();
    await expect(page.locator(".intro-section")).toBeVisible();
    await expect(page.locator(".expertise-section")).toBeVisible();
    await expect(page.locator(".social-links")).toBeVisible();
  });

  test("social links have correct attributes", async ({ page }) => {
    await page.goto("/");
    const links = await page.locator(".social-links__link").evaluateAll((els) =>
      els.map((el) => ({
        href: el.getAttribute("href"),
        target: el.getAttribute("target"),
        rel: el.getAttribute("rel"),
      })),
    );
    expect(links.length).toBeGreaterThanOrEqual(2);

    for (const link of links) {
      if (link.href?.startsWith("mailto:")) {
        continue;
      }
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.href).toMatch(/^https?:\/\//);
    }
  });

  test("has SEO metadata and structured data", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Vladan/i,
    );
    await expect(page.locator('meta[name="author"]')).toHaveAttribute(
      "content",
      /Vladan/i,
    );

    // Open Graph
    await expect(page.locator('meta[property="og:title"]')).toBeAttached();
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website",
    );
    await expect(page.locator('meta[property="og:image"]')).toBeAttached();

    // Twitter card
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );

    // Canonical URL (dev server uses localhost; production uses vladan.dev)
    await expect(page.locator('link[rel="canonical"]')).toBeAttached();

    // Structured data
    const ldJson = page.locator('script[type="application/ld+json"]');
    await expect(ldJson).toBeAttached();
    const raw = await ldJson.textContent();
    const parsed = JSON.parse(raw!);
    expect(parsed["@type"]).toBe("Person");
    expect(parsed.name).toBeTruthy();
    expect(parsed.jobTitle).toBeTruthy();
    expect(parsed.url).toMatch(/^https?:\/\/.+/);
    expect(Array.isArray(parsed.sameAs)).toBe(true);
    expect(parsed.sameAs.length).toBeGreaterThanOrEqual(1);
  });
});
