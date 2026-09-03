import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("presents the current role and selected previous work clearly", async ({
    page,
  }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(
      "Vladan Petrovic | Senior Software Engineer",
    );
    await expect(page.locator(".site-header")).toHaveCount(1);
    await expect(page.locator(".site-header__identity")).toHaveText(
      "Vladan Petrović",
    );
    await expect(page.locator(".site-header__role")).toHaveCount(0);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Vladan Petrović");
    await expect(page.locator(".hero__role")).toHaveText(
      "Senior Software Engineer",
    );
    await expect(page.locator(".hero__actions")).toHaveAttribute(
      "role",
      "group",
    );
    await expect(page.locator(".current-role")).toContainText(
      "Senior Software Engineer",
    );
    await expect(page.locator(".current-role")).toContainText("Rivian");

    await expect(page.locator("main section")).toHaveCount(4);
    await expect(page.locator(".system-entry")).toHaveCount(3);
    await expect(page.locator(".system-entry__title")).toHaveText([
      "Scheduling products",
      "Where to buy commerce",
      "Cardiac care software",
    ]);
    await expect(page.locator("#work")).toContainText("Comtrade Group");
    await expect(page.locator("#work")).toContainText(
      "Commerce Connector GmbH",
    );
    await expect(page.locator("#work")).toContainText("Doodle AG");
    await expect(page.locator(".system-entry__number")).toHaveCount(0);
    await expect(page.locator(".section-heading__number")).toHaveCount(0);
    await expect(page.locator("#work")).not.toContainText(/CHF|EUR|million/);
    await expect(page.locator("#experience")).toHaveCount(0);

    const rivianLink = page.getByRole("link", {
      name: "Rivian company website, opens in a new tab",
    });
    await expect(rivianLink).toHaveAttribute("href", "https://rivian.com/");
    await expect(rivianLink).toHaveAttribute("target", "_blank");
    await expect(rivianLink).toHaveAttribute("rel", "external noopener");
  });

  test("hosts the CV locally and links it from useful places", async ({
    page,
    request,
  }) => {
    await page.goto("/");

    const cvLinks = page.locator('a[href="/vladan-petrovic-cv.pdf"]');
    await expect(cvLinks).toHaveCount(3);
    await expect(cvLinks).toContainText(["CV", "View CV", "CV, PDF"]);
    expect(
      await cvLinks.evaluateAll((links) =>
        links.map((link) => link.getAttribute("type")),
      ),
    ).toEqual(["application/pdf", "application/pdf", "application/pdf"]);
    expect(
      await cvLinks.evaluateAll((links) =>
        links.map((link) => ({
          rel: link.getAttribute("rel"),
          target: link.getAttribute("target"),
        })),
      ),
    ).toEqual([
      { rel: "noopener", target: "_blank" },
      { rel: "noopener", target: "_blank" },
      { rel: "noopener", target: "_blank" },
    ]);

    const response = await request.get("/vladan-petrovic-cv.pdf");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  });

  test("uses named text links for contact and professional profiles", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.locator('a[href="mailto:vladanpetrovic89@gmail.com"]'),
    ).toHaveText(/Email/);

    const profileLinks = page.locator(".contact-links a[rel~='me']");
    await expect(profileLinks).toHaveCount(2);
    await expect(profileLinks).toContainText(["LinkedIn", "GitHub"]);
    expect(
      await profileLinks.evaluateAll((links) =>
        links.map((link) => ({
          href: link.getAttribute("href"),
          target: link.getAttribute("target"),
        })),
      ),
    ).toEqual([
      {
        href: "https://www.linkedin.com/in/vladanpet",
        target: "_blank",
      },
      { href: "https://github.com/vladanp", target: "_blank" },
    ]);
  });

  test("uses a single lightweight employer image with intrinsic dimensions", async ({
    page,
  }) => {
    await page.goto("/");

    const images = page.locator("main img");
    await expect(images).toHaveCount(1);
    await expect(images).toHaveAttribute("src", /rivian-wordmark/);
    await expect(images).toHaveAttribute("width", "409");
    await expect(images).toHaveAttribute("height", "56");
    await expect(images).toHaveAttribute("alt", "");
  });

  test("has consistent search, social, and professional metadata", async ({
    page,
    request,
  }) => {
    await page.goto("/");

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toContain("Senior Software Engineer");
    expect(description).toContain("Rivian");
    expect(description).toContain("Vladan Petrovic");
    expect(description).toContain("TypeScript");
    expect(description).toContain("software architecture");
    expect(description).toBe(description?.trim());
    await expect(page.locator('meta[name="author"]')).toHaveAttribute(
      "content",
      "Vladan Petrovic",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow, max-image-preview:large",
    );
    await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
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
      "Vladan Petrović, Senior Software Engineer, currently at Rivian",
    );
    await expect(
      page.locator('meta[property="og:image:type"]'),
    ).toHaveAttribute("content", "image/png");
    await expect(
      page.locator('meta[property="og:image:width"]'),
    ).toHaveAttribute("content", "1200");
    await expect(
      page.locator('meta[property="og:image:height"]'),
    ).toHaveAttribute("content", "630");
    await expect(
      page.locator('meta[name="twitter:image:alt"]'),
    ).toHaveAttribute(
      "content",
      "Vladan Petrović, Senior Software Engineer, currently at Rivian",
    );
    const socialImageURL = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect((await request.get(socialImageURL!)).status()).toBe(200);

    const rawStructuredData = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    const structuredData = JSON.parse(rawStructuredData!);
    expect(structuredData).toMatchObject({
      "@context": "https://schema.org",
      "@graph": expect.arrayContaining([
        {
          "@id": "http://127.0.0.1:1313/#website",
          "@type": "WebSite",
          alternateName: ["Vladan Petrovic", "vladan.dev"],
          inLanguage: "en-US",
          name: "Vladan Petrović",
          url: "http://127.0.0.1:1313/",
        },
      ]),
    });

    const profilePage = structuredData["@graph"].find(
      (item: { "@type": string }) => item["@type"] === "ProfilePage",
    );
    expect(profilePage).toMatchObject({
      "@type": "ProfilePage",
      dateCreated: "2024-08-19T11:56:48+02:00",
      mainEntity: {
        "@id": "http://127.0.0.1:1313/#person",
        "@type": "Person",
        alternateName: "Vladan Petrovic",
        description:
          "Vladan Petrovic is a Senior Software Engineer at Rivian specializing in TypeScript, React, Node.js, software architecture, and developer experience.",
        homeLocation: {
          "@type": "Place",
          name: "Belgrade, Serbia",
        },
        jobTitle: "Senior Software Engineer",
        knowsAbout: [
          "Full stack software development",
          "Software architecture",
          "Continuous integration",
          "Developer experience",
          "AI assisted software development",
        ],
        name: "Vladan Petrović",
        sameAs: [
          "https://www.linkedin.com/in/vladanpet",
          "https://github.com/vladanp",
        ],
        url: "http://127.0.0.1:1313/",
        worksFor: {
          "@type": "Organization",
          name: "Rivian",
          url: "https://rivian.com/",
        },
      },
      description:
        "Vladan Petrovic is a Senior Software Engineer at Rivian specializing in TypeScript, React, Node.js, software architecture, and developer experience.",
      inLanguage: "en-US",
      isPartOf: {
        "@id": "http://127.0.0.1:1313/#website",
      },
      name: "Vladan Petrovic | Senior Software Engineer",
      url: "http://127.0.0.1:1313/",
    });
    expect(Date.parse(profilePage.dateModified)).not.toBeNaN();
    expect(Date.parse(profilePage.dateModified)).toBeGreaterThanOrEqual(
      Date.parse(profilePage.dateCreated),
    );
  });

  test("keeps the public positioning concise and current", async ({ page }) => {
    await page.goto("/");

    const visibleText = await page.locator("body").innerText();
    expect(visibleText).not.toContain("Senior Full Stack Software Engineer");
    expect(visibleText).not.toMatch(/Claude Code|Cursor|Devin/);
    expect(visibleText).not.toMatch(/\b(?:19|20)\d{2}\b/);
    expect(visibleText).not.toMatch(/[A-Za-z][\u2013\u2014-][A-Za-z]/);
  });
});
