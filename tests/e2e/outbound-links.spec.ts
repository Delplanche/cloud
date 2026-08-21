import { expect, test } from "@playwright/test";

const KEYS = ["webhosting", "vps", "ksuite", "storage", "home"];

test.describe("/go/<key> outbound tracking", () => {
  test("redirect is direct, zonder tussenstappen of merkbare vertraging", async ({ request }) => {
    for (const key of KEYS) {
      const started = Date.now();
      const res = await request.get(`/go/${key}`, { maxRedirects: 0 });
      const elapsed = Date.now() - started;

      expect(res.status(), key).toBe(302);
      const location = res.headers()["location"] ?? "";
      expect(location, key).toMatch(/^https:\/\/www\.infomaniak\.com\//);
      expect(res.headers()["cache-control"], key).toContain("no-store");
      expect(res.headers()["x-robots-tag"], key).toContain("noindex");

      // Tracking mag de redirect niet blokkeren: één hop, ruim onder 1s.
      expect(elapsed, `${key} duurde ${elapsed}ms`).toBeLessThan(1000);
    }
  });

  test("onbekende sleutel valt terug op de homepagina zonder extra hop", async ({ request }) => {
    const res = await request.get("/go/does-not-exist", { maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(res.headers()["location"]).toMatch(/^https:\/\/www\.infomaniak\.com\//);
  });

  test("gerenderde partnerlinks behouden hun beveiligde attributen", async ({ page }) => {
    await page.goto("/en/cloud/vps");
    const links = page.locator('a[href*="infomaniak.com"], a[href^="/go/"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer nofollow sponsored");
    }
  });
});
