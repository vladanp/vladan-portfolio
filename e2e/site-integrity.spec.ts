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
    expect(sitemap).toContain(
      "<loc>http://127.0.0.1:1313/vladan-petrovic-cv.pdf</loc>",
    );
    expect(sitemap.match(/<loc>/g)).toHaveLength(2);
    expect(sitemap.match(/<lastmod>/g)).toHaveLength(2);
    expect(sitemap).toMatch(
      /<loc>http:\/\/127\.0\.0\.1:1313\/vladan-petrovic-cv\.pdf<\/loc>\s*<lastmod>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})<\/lastmod>/,
    );

    const manifestResponse = await request.get("/manifest.json");
    expect(manifestResponse.status()).toBe(200);
    const manifest = await manifestResponse.json();
    expect(manifest).toMatchObject({
      background_color: "#f5f1e8",
      description:
        "Portfolio of Vladan Petrovic, Senior Software Engineer at Rivian.",
      display: "standalone",
      id: "./",
      lang: "en-US",
      name: "Vladan Petrović | Senior Software Engineer",
      scope: "./",
      start_url: "./",
      theme_color: "#f5f1e8",
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
      }
      for (const link of document.querySelectorAll<HTMLLinkElement>(
        'link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"], link[rel="preload"]',
      )) {
        values.add(link.href);
      }
      return [...values].filter(
        (value) => new URL(value).origin === window.location.origin,
      );
    });

    expect(references.length).toBeGreaterThanOrEqual(9);
    await Promise.all(
      references.map(async (reference) => {
        const response = await request.get(reference);
        expect(response.status(), reference).toBeLessThan(400);
      }),
    );
  });

  test("fragment links point to elements that exist", async ({ context }) => {
    const paths = ["/", "/not-a-real-page"];
    const pages = await Promise.all(
      paths.map(async (path) => {
        const page = await context.newPage();
        await page.goto(path);
        return page;
      }),
    );
    const pageIds = await Promise.all(
      pages.map((page) =>
        page.evaluate(() =>
          [...document.querySelectorAll("[id]")].map((element) => element.id),
        ),
      ),
    );
    const idsByPath = new Map(
      paths.map((path, index) => [path, pageIds[index]] as const),
    );
    const links = (
      await Promise.all(
        pages.map((page) =>
          page
            .locator('a[href*="#"]')
            .evaluateAll((anchors: HTMLAnchorElement[]) =>
              anchors.map((anchor) => anchor.href),
            ),
        ),
      )
    ).flat();

    expect(links.length).toBeGreaterThanOrEqual(10);
    const brokenLinks = links.filter((link) => {
      const url = new URL(link);
      const ids = idsByPath.get(url.pathname) ?? [];
      return ids.filter((id) => id === url.hash.slice(1)).length !== 1;
    });
    expect(brokenLinks).toEqual([]);
  });

  test("renders text with the self hosted typeface", async ({
    page,
    request,
  }) => {
    await page.goto("/");

    // The CSS minifier lowercases family names, and matching ignores case.
    const loadedFamilies = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts]
        .filter((font) => font.status === "loaded")
        .map((font) => font.family.replaceAll('"', "").toLowerCase());
    });
    expect(loadedFamilies).toContain("schibsted grotesk");
    expect(
      await page
        .locator("h1")
        .evaluate((element) => getComputedStyle(element).fontFamily),
    ).toMatch(/^"?Schibsted Grotesk"?,/);
    expect((await request.get("/fonts/OFL.txt")).status()).toBe(200);
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

  test("uses the compact mobile layout without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");

    const columnCount = await page
      .locator(".hero__inner")
      .evaluate(
        (element) =>
          getComputedStyle(element).gridTemplateColumns.split(" ").length,
      );
    expect(columnCount).toBe(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);

    const toolsetLabel = await page
      .locator(".toolsets dt")
      .first()
      .boundingBox();
    const toolsetValue = await page
      .locator(".toolsets dd")
      .first()
      .boundingBox();
    expect(toolsetValue!.x).toBeCloseTo(toolsetLabel!.x, 0);
  });

  test("provides a working keyboard skip link", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit",
      "WebKit does not move focus on synthetic Tab keypresses",
    );

    await page.goto("/");

    await page.keyboard.press("Tab");
    await expect(page.locator(".skip-link")).toBeFocused();
    await expect(page.locator(".skip-link")).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("removes optional motion when reduced motion is requested", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    ).toBe("auto");
    expect(
      await page
        .locator(".text-link")
        .first()
        .evaluate((element) => getComputedStyle(element).transitionDuration),
    ).toBe("0s");
  });
});
