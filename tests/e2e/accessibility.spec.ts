import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("geen axe-overtredingen op de belangrijkste mobiele pagina's", async ({ page }) => {
  for (const path of ["/en", "/en/security", "/en/faq", "/en/gateway", "/en/cloud/vps"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations, `${path}: ${JSON.stringify(results.violations, null, 2)}`).toEqual(
      [],
    );
  }
});

test("hamburger is volledig bedienbaar met het toetsenbord", async ({ page }) => {
  await page.goto("/en");
  const toggle = page.getByTestId("nav-toggle");

  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toHaveAttribute("aria-controls", "mobile-nav");
  await expect(toggle).toHaveAttribute("aria-label", /.+/);

  await toggle.focus();
  await expect(toggle).toBeFocused();
  const outline = await toggle.evaluate((el) => {
    el.classList.add("focus-visible");
    return getComputedStyle(el).outlineStyle;
  });
  expect(typeof outline).toBe("string");

  await page.keyboard.press("Enter");
  const panel = page.getByTestId("mobile-nav");
  await expect(panel).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toHaveAttribute("role", "dialog");
  await expect(panel).toHaveAttribute("aria-modal", "true");

  // Focus verhuist naar het paneel en blijft er gevangen.
  await expect(panel.locator(":focus")).toHaveCount(1);
  for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
  await expect(panel.locator(":focus")).toHaveCount(1);

  // Escape sluit en geeft focus terug aan de knop.
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("taalwisselaar is bereikbaar en gelabeld", async ({ page }) => {
  await page.goto("/en");
  await page.getByTestId("nav-toggle").click();
  const panel = page.getByTestId("mobile-nav");

  const langLinks = panel.getByRole("link", { name: /^(EN|NL|FR)$/ });
  await expect(langLinks).toHaveCount(3);

  const current = panel.getByRole("link", { name: "EN", exact: true });
  await expect(current).toHaveAttribute("hreflang", /en/);

  await langLinks.nth(2).focus();
  await expect(langLinks.nth(2)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/fr(\/|$)/);
});

test("axe-audit van de mobiele overlay-drawer", async ({ page }) => {
  await page.goto("/en");
  await page.getByTestId("nav-toggle").click();
  await expect(page.getByTestId("mobile-nav")).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include('[data-testid="mobile-nav"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("axe-audit van de footer inclusief kanaalgrid", async ({ page }) => {
  await page.goto("/en");
  await page.locator("footer").scrollIntoViewIfNeeded();

  const results = await new AxeBuilder({ page })
    .include("footer")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
