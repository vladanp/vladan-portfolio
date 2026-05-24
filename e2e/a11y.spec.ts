import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("accessibility", () => {
  test("homepage has no critical or serious a11y violations", async ({
    page,
  }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const violations = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );

    if (violations.length > 0) {
      console.log("A11y violations:", JSON.stringify(violations, null, 2));
    }

    expect(violations).toEqual([]);
  });

  test("404 page has no critical or serious a11y violations", async ({
    page,
  }) => {
    await page.goto("/nonexistent-page");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const violations = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );

    if (violations.length > 0) {
      console.log("A11y violations:", JSON.stringify(violations, null, 2));
    }

    expect(violations).toEqual([]);
  });
});
