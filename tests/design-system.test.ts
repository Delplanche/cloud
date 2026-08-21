import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const css = read("src/styles.css");

/**
 * Visuele regressie-contracten voor "Alpine Vault / Editorial Biophilic".
 * Deze checks falen zodra kalksteen-canvas, papieren schaduw of stempel-respons wijzigt.
 */
describe("design tokens", () => {
  it("keeps the warm linen limestone canvas", () => {
    expect(css).toMatch(/--canvas:\s*#F5F3EF/);
  });

  it("keeps the near-invisible sketch grid", () => {
    expect(css).toMatch(/--grid-ink:\s*rgba\(44, 62, 53, 0\.022\)/);
  });

  it("keeps deep moss and warm terracotta accents", () => {
    expect(css).toMatch(/--moss:\s*#2A4736/);
    expect(css).toMatch(/--terracotta:\s*#C26D52/);
  });

  it("keeps the soft heavy-paper shadow", () => {
    expect(css).toMatch(/--paper-shadow:[\s\S]*?24px 48px -28px rgba\(44, 62, 53, 0\.14\)/);
  });
});

describe("paper surfaces", () => {
  it("keeps dossier sheets organically framed (sketch-frame aesthetic)", () => {
    const frame = css.slice(css.indexOf("@utility sketch-frame"));
    expect(frame.slice(0, 300)).toMatch(/border:\s*1px solid var\(--gridline\)/);
    expect(frame.slice(0, 300)).toMatch(/border-radius:\s*22px 26px 20px 28px/);
    expect(css).toMatch(/--radius-lg:\s*14px/);
    expect(css).toMatch(/--radius-xl:\s*18px/);
  });

  it("keeps the stamp-press tactile response", () => {
    const stamp = css.slice(css.indexOf("@utility stamp-press"));
    expect(stamp.slice(0, 300)).toMatch(/transform:\s*translateY\(1px\)/);
    expect(stamp.slice(0, 300)).toMatch(/box-shadow:\s*inset/);
  });

  it("provides the terracotta marginalia annotation layer", () => {
    expect(css).toContain("@utility margin-note");
    const note = css.slice(css.indexOf("@utility margin-note"));
    expect(note.slice(0, 300)).toMatch(/font-family:\s*var\(--font-hand\)/);
    expect(note.slice(0, 300)).toMatch(/color:\s*var\(--terracotta\)/);
  });

  it("no longer ships the retired blueprint/vault frames", () => {
    expect(css).not.toContain("@utility blueprint-panel");
    expect(css).not.toContain("@utility vault-frame");
    expect(css).not.toContain("@utility hand-note");
  });
});

describe("components", () => {
  const copy = read("src/components/site/CopyAction.tsx");
  const nav = read("src/components/site/TopNav.tsx");
  const footer = read("src/components/site/Footer.tsx");

  it("copy action swaps to a confirmation state", () => {
    expect(copy).toContain("[ ✓ GEKOPIEERD ]");
    expect(copy).toContain("[ COPY ]");
    expect(copy).toMatch(/setTimeout\([\s\S]*?2000\)/);
    expect(copy).toContain("data-copied");
  });

  it("mobile overlay is a modal dialog with escape handling", () => {
    expect(nav).toContain('role="dialog"');
    expect(nav).toContain('aria-modal="true"');
    expect(nav).toContain('e.key === "Escape"');
    expect(nav).toContain('e.key !== "Tab"');
    expect(nav).toContain("pointerdown");
  });

  it("footer keeps the muted colophon, copy vector and channel grid", () => {
    expect(footer).toContain("core@delplanche.cloud");
    expect(footer).not.toContain("vault-frame");
    expect(footer).toContain("sm:grid-cols-3");
    expect(footer).toContain("footer-channels");
  });

  it("footer carries one ultra-clean technical signature line", () => {
    expect(footer).toContain("footer-colophon");
    expect(footer).toMatch(/footer-colophon[\s\S]{0,200}text-muted-ink/);
    expect(footer).toContain("© 2026 delplanche.cloud // 100% hydro Swiss infrastructure //");
    expect(footer).toContain("Impressum: J.Z.D., Brussels (BE)");
    // Stewardship-paragraaf is volledig verwijderd uit de footer.
    expect(footer).not.toContain("stewardship");
    expect(footer).not.toContain("getAnnotations");
  });

  it("footer action cluster stacks without overlapping touch targets", () => {
    expect(footer).toContain("footer-actions");
    expect(footer).toMatch(/footer-actions[\s\S]{0,160}flex flex-col items-start gap-4/);
    expect(footer).not.toMatch(/footer-actions[\s\S]{0,160}absolute/);
  });

  it("impressum uses an open editorial blueprint instead of heavy cards", () => {
    const legal = read("src/components/pages/LegalPage.tsx");
    expect(legal).toContain("legal-disclosures");
    expect(legal).toContain("divide-gridline");
    expect(legal).not.toContain("vault-frame");
    const dict = read("src/i18n/dict.ts");
    for (const needle of ["FADP/DSG", "CLOUD Act", "zero tracking cookies", "Infomaniak SA"]) {
      expect(dict.toLowerCase()).toContain(needle.toLowerCase());
    }
  });

  it("hard-codes GitHub to the organisation and Repositories to the cloud project", () => {
    expect(footer).toMatch(
      /label: "GITHUB",\s*value: "delplanche",\s*href: "https:\/\/github\.com\/delplanche"/,
    );
    expect(footer).toMatch(
      /label: "REPOSITORIES",\s*value: "delplanche\/cloud",\s*href: "https:\/\/github\.com\/delplanche\/cloud"/,
    );
    expect(footer).not.toContain("jdelplanche");
    expect(footer).not.toContain("[ {c.value} ]");
  });
});
