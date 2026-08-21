import { expect, test } from "@playwright/test";

test.describe("404 page", () => {
  test("returns HTTP 404 with a descriptive heading and main landmark", async ({
    page,
  }) => {
    const response = await page.goto("/not-a-real-page");

    expect(response?.status()).toBe(404);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator(".site-header__identity")).toHaveText(
      "Vladan Petrović",
    );
    await expect(page.locator(".site-header__identity")).toHaveAttribute(
      "href",
      "/",
    );
    await expect(page.locator(".site-header__role")).toHaveCount(0);
    await expect(page.locator("h1")).toHaveText("Page Not Found");
    await expect(page.locator(".error-page__code")).toHaveText("404");
    await expect(page.locator(".error-page__code")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    const inlineCSS = await page.locator("style").textContent();
    expect(inlineCSS).toContain(".error-page");
    expect(inlineCSS).not.toContain(".hero__title");
  });

  test("home link has matching visible and accessible text", async ({
    page,
  }) => {
    await page.goto("/not-a-real-page");
    const homeLink = page.getByRole("link", { name: "Go to Homepage" });

    await expect(homeLink).toHaveAttribute("href", "/");
    await homeLink.click();
    await expect(page).toHaveURL("/");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("is excluded from indexing and does not claim a canonical page", async ({
    page,
  }) => {
    await page.goto("/not-a-real-page");

    await expect(page).toHaveTitle(
      "Page Not Found | Vladan Petrovic | Senior Software Engineer",
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "The page you requested could not be found.",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[property^="og:"]')).toHaveCount(0);
    await expect(page.locator('meta[name^="twitter:"]')).toHaveCount(0);
    await expect(
      page.locator('script[type="application/ld+json"]'),
    ).toHaveCount(0);
  });
});
