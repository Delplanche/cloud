import { expect, test } from "@playwright/test";

/**
 * Visuele regressie voor de colofon-footer en het actiecluster.
 * Draait in beide Playwright-projecten (mobile + desktop).
 */
const SIGNATURE =
  "© 2026 delplanche.cloud // 100% hydro Swiss infrastructure // Impressum: J.Z.D., Brussels (BE)";

test.describe("colophon footer", () => {
  test("shows exactly one ultra-clean signature line", async ({ page }) => {
    await page.goto("/en");
    const colophon = page.getByTestId("footer-colophon");
    await colophon.scrollIntoViewIfNeeded();
    await expect(colophon).toBeVisible();

    const text = (await colophon.innerText()).replace(/\s+/g, " ").trim();
    expect(text).toBe(SIGNATURE);
    await expect(page.getByTestId("footer-stewardship")).toHaveCount(0);

    // Één regel, geen blokkerige paragraaf.
    const box = (await colophon.boundingBox())!;
    expect(box.height).toBeLessThan(48);
  });

  test("action cluster stacks without overlapping touch targets", async ({ page }) => {
    await page.goto("/en");
    const actions = page.getByTestId("footer-actions");
    await actions.scrollIntoViewIfNeeded();

    const copy = actions.getByTestId("copy-action");
    const contact = actions.locator("a").first();
    await expect(copy).toBeVisible();
    await expect(contact).toBeVisible();

    const a = (await copy.boundingBox())!;
    const b = (await contact.boundingBox())!;
    // Verticaal gestapeld met echte ademruimte, nooit overlappend.
    expect(b.y).toBeGreaterThanOrEqual(a.y + a.height);
    expect(b.y - (a.y + a.height)).toBeGreaterThanOrEqual(8);
  });

  test("footer links stay locked to the correct GitHub paths", async ({ page }) => {
    await page.goto("/en");
    const channels = page.getByTestId("footer-channels");
    await expect(channels.locator('a[href="https://github.com/delplanche"]')).toHaveCount(1);
    await expect(channels.locator('a[href="https://github.com/delplanche/cloud"]')).toHaveCount(1);
  });

  test("colophon visual snapshot", async ({ page }) => {
    await page.goto("/en");
    const titleblock = page.getByTestId("footer-titleblock");
    await titleblock.scrollIntoViewIfNeeded();
    await expect(titleblock).toHaveScreenshot("footer-colophon.png", {
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    });
  });
});
