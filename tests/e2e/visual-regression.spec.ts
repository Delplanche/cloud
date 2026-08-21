import { expect, test } from "@playwright/test";

/**
 * Visuele regressie voor mobiele viewports: pricing- en gateway-CTA-kaarten
 * in alle ondersteunde talen. Bewaakt tekstoverflow en layoutverschuiving.
 */
test.use({ viewport: { width: 390, height: 844 } });

const LOCALES = ["en", "fr", "nl"] as const;
const GATEWAY_SLUG = { en: "gateway", fr: "gateway", nl: "gateway" } as const;

async function assertNoOverflow(cards: import("@playwright/test").Locator) {
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    const overflow = await cards.nth(i).evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
}

for (const locale of LOCALES) {
  test(`pricing cards render cleanly on mobile (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/cloud/vps`);
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();
    await assertNoOverflow(cards);

    // Geen horizontale paginascroll = geen tekstwrap-/overflowprobleem.
    const docOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(docOverflow).toBeLessThanOrEqual(1);

    await expect(page).toHaveScreenshot(`pricing-${locale}-mobile.png`, {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    });
  });

  test(`gateway CTA cards render cleanly on mobile (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/${GATEWAY_SLUG[locale]}`);
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();
    await assertNoOverflow(cards);

    // CTA-labels mogen niet buiten hun knop vallen.
    const ctas = cards.locator("a");
    const ctaCount = await ctas.count();
    for (let i = 0; i < ctaCount; i++) {
      const box = await ctas.nth(i).boundingBox();
      expect(box!.width).toBeLessThanOrEqual(390);
    }

    await expect(page).toHaveScreenshot(`gateway-${locale}-mobile.png`, {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    });
  });

  test(`partner links keep secure attributes (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/cloud/vps`);
    const links = page.locator('a[href*="infomaniak"], a[href^="/go/"]');
    const n = await links.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      await expect(links.nth(i)).toHaveAttribute("target", "_blank");
      await expect(links.nth(i)).toHaveAttribute("rel", "noopener noreferrer nofollow sponsored");
    }
  });
}
