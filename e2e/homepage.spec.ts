import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("responds successfully with the expected semantic structure", async ({
    page,
  }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(
      "Vladan Petrovic | Senior Software Engineer",
    );
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Vladan Petrović");
    await expect(page.locator(".intro-section__summary")).toContainText(
      "Full-stack development",
    );
    await expect(page.locator(".social-links")).toBeVisible();
    await expect(page.locator(".skills")).toBeVisible();
    const inlineCSS = await page.locator("style").textContent();
    expect(inlineCSS).toContain(".intro-section");
    expect(inlineCSS).not.toContain(".error-page");
    expect(
      await page
        .locator(".skills-container")
        .evaluate((element) => element.tagName),
    ).toBe("UL");
  });

  test("external profile and skill links are protected and named", async ({
    page,
  }) => {
    await page.goto("/");
    const links = await page.locator('a[target="_blank"]').evaluateAll((els) =>
      els.map((el) => ({
        href: el.getAttribute("href"),
        label: el.getAttribute("aria-label"),
        rel: el.getAttribute("rel"),
      })),
    );

    expect(links).toHaveLength(7);
    for (const link of links) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.label).toContain("opens in a new tab");
      expect(link.rel).toBe("noopener noreferrer");
    }
  });

  test("serves compact responsive images with intrinsic dimensions", async ({
    page,
  }) => {
    await page.goto("/");
    const images = await page.locator("main img").evaluateAll((elements) =>
      elements.map((image) => ({
        height: image.getAttribute("height"),
        loading: image.getAttribute("loading"),
        sizes: image.getAttribute("sizes"),
        srcset: image.getAttribute("srcset"),
        width: image.getAttribute("width"),
      })),
    );

    expect(images).toHaveLength(8);
    for (const image of images) {
      expect(image.width).toMatch(/^(56|80)$/);
      expect(image.height).toBe(image.width);
      expect(image.loading).toBeNull();
      expect(image.sizes).toMatch(/^(56|80)px$/);
      expect(image.srcset).toContain("200w");
      expect(image.srcset).toContain("400w");
      expect(image.srcset).not.toContain("800");
    }
  });

  test("has consistent search and social metadata", async ({ page }) => {
    await page.goto("/");

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toContain("Senior Software Engineer");
    expect(description).toBe(description?.trim());
    await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "http://127.0.0.1:1313/",
    );

    await Promise.all(
      [
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
      ].map((selector) =>
        expect(page.locator(selector)).toHaveAttribute("content", description!),
      ),
    );

    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      "content",
      "Illustration of a computer monitor displaying code",
    );
    await expect(
      page.locator('meta[name="twitter:image:alt"]'),
    ).toHaveAttribute(
      "content",
      "Illustration of a computer monitor displaying code",
    );

    const rawStructuredData = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    const person = JSON.parse(rawStructuredData!);
    expect(person).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      alternateName: "Vladan Petrovic",
      jobTitle: "Senior Software Engineer",
      name: "Vladan Petrović",
      sameAs: [
        "https://www.linkedin.com/in/vladanpet",
        "https://github.com/vladanp",
      ],
      url: "http://127.0.0.1:1313/",
    });
  });
});
