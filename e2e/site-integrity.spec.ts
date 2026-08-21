import { expect, test } from "@playwright/test";

test.describe("generated site integrity", () => {
  test("publishes valid robots, sitemap, and manifest endpoints", async ({
    request,
  }) => {
    const robotsResponse = await request.get("/robots.txt");
    expect(robotsResponse.status()).toBe(200);
    expect(await robotsResponse.text()).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: http://127.0.0.1:1313/sitemap.xml\n",
    );

    const sitemapResponse = await request.get("/sitemap.xml");
    expect(sitemapResponse.status()).toBe(200);
    const sitemap = await sitemapResponse.text();
    expect(sitemap).toContain("<urlset");
    expect(sitemap).toContain("<loc>http://127.0.0.1:1313/</loc>");
    expect(sitemap.match(/<loc>/g)).toHaveLength(1);

    const manifestResponse = await request.get("/manifest.json");
    expect(manifestResponse.status()).toBe(200);
    const manifest = await manifestResponse.json();
    expect(manifest).toMatchObject({
      display: "standalone",
      id: "./",
      lang: "en-US",
      scope: "./",
      start_url: "./",
    });
    expect(manifest.icons).toHaveLength(2);
    await Promise.all(
      manifest.icons.map(async (icon: { src: string }) => {
        const iconURL = new URL(
          icon.src,
          "http://127.0.0.1:1313/manifest.json",
        );
        const iconResponse = await request.get(iconURL.href);
        expect(iconResponse.status()).toBe(200);
      }),
    );

    expect((await request.get("/index.xml")).status()).toBe(404);
  });

  test("all local homepage resources resolve", async ({ page, request }) => {
    await page.goto("/");
    const references = await page.evaluate(() => {
      const values = new Set<string>();
      for (const image of document.querySelectorAll("img")) {
        if (image.src) values.add(image.src);
        for (const candidate of image.srcset.split(",")) {
          const source = candidate.trim().split(/\s+/)[0];
          if (source) values.add(new URL(source, document.baseURI).href);
        }
      }
      for (const link of document.querySelectorAll<HTMLLinkElement>(
        'link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]',
      )) {
        values.add(link.href);
      }
      return [...values].filter(
        (value) => new URL(value).origin === window.location.origin,
      );
    });

    expect(references.length).toBeGreaterThan(20);
    await Promise.all(
      references.map(async (reference) => {
        const response = await request.get(reference);
        expect(response.status(), reference).toBeLessThan(400);
      }),
    );
  });

  test("homepage loads without browser or network errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) =>
      errors.push(`${request.method()} ${request.url()}`),
    );

    await page.goto("/");
    expect(errors).toEqual([]);
  });

  test("applies the compact layout without overflow on narrow screens", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");

    await expect
      .poll(() =>
        page
          .locator(".main-container")
          .evaluate((element) => getComputedStyle(element).gap),
      )
      .toBe("24px");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
});
