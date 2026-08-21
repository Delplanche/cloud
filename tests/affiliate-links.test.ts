import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = join(process.cwd(), "src");
const REQUIRED_REL = "noopener noreferrer nofollow sponsored";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(tsx?|jsx?)$/.test(name) && !name.endsWith("routeTree.gen.ts") ? [full] : [];
  });
}

/** Alle <a>-tags in een bestand, ruw geëxtraheerd uit de JSX-bron. */
function anchors(source: string): string[] {
  return [...source.matchAll(/<a\b[\s\S]*?>/g)].map((m) => m[0]);
}

const files = walk(SRC).map((path) => ({ path, source: readFileSync(path, "utf8") }));

describe("outbound partner links", () => {
  it("every anchor to /go/<key> or infomaniak carries the required attributes", () => {
    const offenders: string[] = [];

    for (const { path, source } of files) {
      for (const tag of anchors(source)) {
        const isPartner =
          /href=\{?["'`]?\/go\//.test(tag) ||
          /infomaniak/i.test(tag) ||
          /AFFILIATE_LINKS|INFOMANIAK_LINKS/.test(tag);
        if (!isPartner) continue;

        const hasSpread = /\{\.\.\.externalLinkProps\}/.test(tag);
        const hasTarget = hasSpread || /target=["']_blank["']/.test(tag);
        const hasRel = hasSpread || new RegExp(`rel=["']${REQUIRED_REL}["']`).test(tag);
        if (!hasTarget || !hasRel)
          offenders.push(`${path}: ${tag.replace(/\s+/g, " ").slice(0, 120)}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it("externalLinkProps itself stays intact", async () => {
    const { externalLinkProps } = await import("@/config/affiliates");
    expect(externalLinkProps.target).toBe("_blank");
    expect(externalLinkProps.rel).toBe(REQUIRED_REL);
  });
});
