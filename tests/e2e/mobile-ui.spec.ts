import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test.describe("mobiele header en footer", () => {
  test("hamburgermenu opent volledig dekkend en navigeert", async ({ page }) => {
    await page.goto("/en");

    const toggle = page.getByTestId("nav-toggle");
    await expect(toggle).toBeVisible();
    await toggle.click();

    const panel = page.getByTestId("mobile-nav");
    await expect(panel).toBeVisible();

    // Volledig opaak: geen alpha-kanaal in de achtergrondkleur.
    const bg = await panel.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toContain("rgba");

    // Vult de viewport onder de header.
    const box = await panel.boundingBox();
    expect(box!.height).toBeGreaterThan(600);

    await panel.getByRole("link", { name: /faq/i }).click();
    await expect(page).toHaveURL(/\/en\/faq$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("taalmenu wisselt naar de vertaalde slug", async ({ page }) => {
    await page.goto("/en/security");
    await page.getByTestId("nav-toggle").click();
    const panel = page.getByTestId("mobile-nav");
    await panel.getByRole("link", { name: "NL", exact: true }).click();
    await expect(page).toHaveURL(/\/nl\/beveiliging$/);
  });

  test("contact stacks en het titelblok in de footer renderen", async ({ page }) => {
    await page.goto("/en");
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer.getByRole("link", { name: /legal notice/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /legal impresser/i })).toHaveCount(0);
  });
});

test.describe("kaartlayout op mobiel", () => {
  test("cloudkaarten hebben scherpe hoeken en onderlinge ruimte", async ({ page }) => {
    await page.goto("/en/cloud/vps");
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();

    const radius = await cards
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
    expect(radius).toBe(0);

    if ((await cards.count()) > 1) {
      const a = await cards.nth(0).boundingBox();
      const b = await cards.nth(1).boundingBox();
      expect(b!.y - (a!.y + a!.height)).toBeGreaterThanOrEqual(16);
    }
  });

  test("prijzen tonen euro's, geen CHF", async ({ page }) => {
    await page.goto("/en/cloud/vps");
    await expect(page.locator("body")).toContainText("€");
    await expect(page.locator("body")).not.toContainText("CHF");
  });
});

test("FAQ-accordeon opent en sluit", async ({ page }) => {
  await page.goto("/en/faq");
  const first = page.locator("details").first();
  await expect(first).not.toHaveAttribute("open", /.*/);
  await first.locator("summary").click();
  await expect(first).toHaveAttribute("open", /.*/);
});

test("dataflow-schema toont details bij selectie", async ({ page }) => {
  await page.goto("/en/security");
  const steps = page.getByRole("button", { expanded: false });
  await steps.first().click();
  await expect(page.locator("#flow-detail-1, #flow-detail-2").first()).toBeVisible();
});

test.describe("footer opschoning", () => {
  test("geen J.Z.D.-badge, vierkante hoeken en technische kanaal-links", async ({ page }) => {
    await page.goto("/en");
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();

    await expect(footer).not.toContainText("J.Z.D.");

    const frame = page.getByTestId("footer-titleblock");
    const radius = await frame.evaluate((el) =>
      parseFloat(getComputedStyle(el).borderTopLeftRadius),
    );
    expect(radius).toBe(0);

    const channels = page.getByTestId("footer-channels");
    await expect(channels).toContainText("GITHUB");
    await expect(channels).toContainText("MATRIX");
    await expect(channels).toContainText("PGP KEY");
    await expect(channels.getByRole("link", { name: /^GITHUB:/ })).toHaveAttribute(
      "href",
      "https://github.com/delplanche",
    );
    await expect(channels.getByRole("link", { name: /^REPOSITORIES:/ })).toHaveAttribute(
      "href",
      "https://github.com/delplanche/cloud",
    );

    // De merknaam en tagline mogen exact één keer in de footer staan.
    await expect(footer.getByRole("link", { name: "delplanche.cloud" })).toHaveCount(1);
  });
});

test.describe("mobiele kerncomponenten", () => {
  test("hamburger vult de volledige hoogte en sluit weer", async ({ page }) => {
    await page.goto("/en");
    const toggle = page.getByTestId("nav-toggle");
    await toggle.click();

    const panel = page.getByTestId("mobile-nav");
    const box = await panel.boundingBox();
    const viewport = page.viewportSize()!;
    expect(box!.height).toBeGreaterThanOrEqual(viewport.height - box!.y - 1);
    expect(await panel.evaluate((el) => getComputedStyle(el).position)).toBe("fixed");

    await toggle.click();
    await expect(panel).toBeHidden();
  });

  test("taalwisselaar bewaart de pagina bij taalwissel", async ({ page }) => {
    await page.goto("/en/faq");
    await page.getByTestId("nav-toggle").click();
    await page.getByTestId("mobile-nav").getByRole("link", { name: "FR", exact: true }).click();
    await expect(page).toHaveURL(/\/fr\/faq$/);
  });

  test("footer-secties zijn inklapbaar op mobiel", async ({ page }) => {
    await page.goto("/en");
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();

    const sections = footer.locator("details");
    await expect(sections).toHaveCount(3);
    const first = sections.first();
    await expect(first).not.toHaveAttribute("open", /.*/);
    await first.locator("summary").click();
    await expect(first).toHaveAttribute("open", /.*/);
    await first.locator("summary").click();
    await expect(first).not.toHaveAttribute("open", /.*/);
  });

  test("kanaalgrid en slank impressum-blok", async ({ page }) => {
    await page.goto("/en");
    const channels = page.getByTestId("footer-channels");
    await channels.scrollIntoViewIfNeeded();
    await expect(channels).toBeVisible();
    await expect(channels.locator("a")).toHaveCount(4);

    const frame = page.getByTestId("footer-titleblock");
    const height = (await frame.boundingBox())!.height;
    expect(height).toBeLessThan(520);
    expect(await frame.evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius))).toBe(
      0,
    );
  });

  test("alle actieknoppen zijn strikt vierkant", async ({ page }) => {
    for (const path of [
      "/en/faq",
      "/en/gateway",
      "/en/contact",
      "/en/onboarding",
      "/en/cloud/vps",
    ]) {
      await page.goto(path);
      const radii = await page.evaluate(() =>
        [...document.querySelectorAll("a, button")].map((el) =>
          parseFloat(getComputedStyle(el).borderTopLeftRadius),
        ),
      );
      expect(
        radii.filter((r) => r > 0 && r < 100),
        path,
      ).toEqual([]);
    }
  });
});

test("pricing-kaarten hebben een uitklapbare detailsectie", async ({ page }) => {
  await page.goto("/en/cloud/vps");
  const toggle = page.getByRole("button", { name: /MORE DETAILS/i }).first();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("button", { name: /HIDE DETAILS/i }).first()).toBeVisible();
});

test("vergelijkingsmatrix stapelt in modulaire blokken op mobiel", async ({ page }) => {
  await page.goto("/en/security");
  const blocks = page.locator("article");
  await expect(blocks.first()).toBeVisible();
  await expect(page.locator("table:visible")).toHaveCount(0);
});
