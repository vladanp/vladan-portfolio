import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  { name: "homepage", path: "/" },
  { name: "404 page", path: "/not-a-real-page" },
];

const appearances = [
  {
    name: "light mode",
    media: {
      colorScheme: "light" as const,
      forcedColors: "none" as const,
      reducedMotion: "no-preference" as const,
    },
  },
  {
    name: "dark mode with reduced motion",
    media: {
      colorScheme: "dark" as const,
      forcedColors: "none" as const,
      reducedMotion: "reduce" as const,
    },
  },
  {
    name: "forced colors",
    media: {
      colorScheme: "light" as const,
      forcedColors: "active" as const,
      reducedMotion: "no-preference" as const,
    },
  },
];

test.describe("accessibility", () => {
  for (const route of routes) {
    for (const appearance of appearances) {
      test(`${route.name} in ${appearance.name} has no detected WCAG 2.2 AA or best practice violations`, async ({
        page,
      }) => {
        await page.emulateMedia(appearance.media);
        await page.goto(route.path);
        const results = await new AxeBuilder({ page })
          .withTags([
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "wcag22aa",
            "best-practice",
          ])
          .options({
            rules: {
              "label-content-name-mismatch": { enabled: true },
              "target-size": { enabled: true },
            },
          })
          .analyze();

        expect(
          results.violations,
          JSON.stringify(results.violations, null, 2),
        ).toEqual([]);
      });
    }
  }
});
