#!/usr/bin/env node
/**
 * CI SEO-validator.
 *
 * Controleert voor elke gerenderde route (inclusief /{lang}/cloud/*):
 *  - exact één canonical, absoluut en gelijk aan de route zelf
 *  - hreflang voor elke taal + x-default
 *  - wederkerigheid: elke hreflang-variant bestaat en verwijst terug
 *  - sitemap-consistentie: elke route staat in /sitemap.xml en omgekeerd
 *
 * Gebruik: node scripts/seo-validate.mjs [baseUrl]
 */
const BASE = (process.argv[2] ?? process.env.SEO_BASE_URL ?? "http://localhost:4173").replace(
  /\/$/,
  "",
);

const LOCALES = ["en", "nl", "fr"];
const X_DEFAULT = "en";

const SLUGS = {
  home: { en: "", nl: "", fr: "" },
  stack: { en: "stack", nl: "infrastructuur", fr: "infrastructure" },
  security: { en: "security", nl: "beveiliging", fr: "securite" },
  onboarding: { en: "onboarding", nl: "onboarding", fr: "integration" },
  faq: { en: "faq", nl: "faq", fr: "faq" },
  gateway: { en: "gateway", nl: "gateway", fr: "gateway" },
  contact: { en: "contact", nl: "contact", fr: "contact" },
  legal: { en: "legal", nl: "juridisch", fr: "mentions-legales" },
  privacy: { en: "privacy", nl: "privacy", fr: "confidentialite" },
};

const CLOUD_TARGETS = ["hosting", "vps", "ksuite", "storage"];

const errors = [];
const fail = (msg) => errors.push(msg);

const pagePath = (locale, page) => {
  const slug = SLUGS[page][locale];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
};
const cloudPath = (locale, target) => `/${locale}/cloud/${target}`;

const routes = [
  ...Object.keys(SLUGS).flatMap((page) =>
    LOCALES.map((l) => ({ path: pagePath(l, page), locale: l, key: `page:${page}` })),
  ),
  ...CLOUD_TARGETS.flatMap((target) =>
    LOCALES.map((l) => ({ path: cloudPath(l, target), locale: l, key: `cloud:${target}` })),
  ),
];

const linkTags = (html) =>
  [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => {
    const tag = m[0];
    const attr = (name) => {
      const re = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i");
      return re.exec(tag)?.[1];
    };
    return { rel: attr("rel"), href: attr("href"), hreflang: attr("hreflang") };
  });

async function checkRoute({ path, locale, key }) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) return fail(`${path}: HTTP ${res.status}`);
  const html = await res.text();
  const links = linkTags(html);

  const canonicals = links.filter((l) => l.rel === "canonical");
  if (canonicals.length !== 1) {
    fail(`${path}: expected 1 canonical, found ${canonicals.length}`);
  } else {
    const href = canonicals[0].href ?? "";
    if (!/^https?:\/\//.test(href)) fail(`${path}: canonical is not absolute (${href})`);
    if (new URL(href, BASE).pathname !== path)
      fail(`${path}: canonical points to ${new URL(href, BASE).pathname}`);
  }

  const alternates = links.filter((l) => l.rel === "alternate" && l.hreflang);
  const expected = new Map(
    LOCALES.map((l) => [
      l,
      key.startsWith("cloud:") ? cloudPath(l, key.slice(6)) : pagePath(l, key.slice(5)),
    ]),
  );

  for (const [l, expectedPath] of expected) {
    const tag = alternates.find((a) => a.hreflang === l);
    if (!tag) {
      fail(`${path}: missing hreflang="${l}"`);
      continue;
    }
    if (new URL(tag.href ?? "", BASE).pathname !== expectedPath)
      fail(`${path}: hreflang="${l}" -> ${tag.href}, expected ${expectedPath}`);
  }

  const xDefault = alternates.find((a) => a.hreflang === "x-default");
  if (!xDefault) fail(`${path}: missing hreflang="x-default"`);
  else if (new URL(xDefault.href ?? "", BASE).pathname !== expected.get(X_DEFAULT))
    fail(`${path}: x-default -> ${xDefault.href}, expected ${expected.get(X_DEFAULT)}`);

  const titles = [...html.matchAll(/<title[^>]*>(.*?)<\/title>/gis)].map((m) => m[1].trim());
  if (titles.length === 0 || !titles[0]) fail(`${path}: missing <title>`);
  if (!/<meta[^>]+name=["']description["'][^>]*>/i.test(html))
    fail(`${path}: missing meta description`);

  return new URL(canonicals[0]?.href ?? `${BASE}${path}`, BASE).pathname;
}

async function checkSitemap() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) {
    fail(`/sitemap.xml: HTTP ${res.status}`);
    return new Set();
  }
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const set = new Set(locs);
  if (locs.length !== set.size) fail("/sitemap.xml: duplicate <loc> entries");
  return set;
}

const sitemap = await checkSitemap();
const perRoute = [];
for (const route of routes) {
  const before = errors.length;
  await checkRoute(route);
  if (!sitemap.has(route.path)) fail(`/sitemap.xml: missing ${route.path}`);
  perRoute.push({ path: route.path, issues: errors.slice(before) });
}
const known = new Set(routes.map((r) => r.path));
for (const loc of sitemap) {
  if (!known.has(loc)) fail(`/sitemap.xml: unknown route ${loc}`);
}

// Rapport-artefacten (markdown + JSON). Geen client-side impact.
const { mkdir, writeFile } = await import("node:fs/promises");
const passed = perRoute.filter((r) => r.issues.length === 0).length;

const classify = (issue) => {
  if (/canonical/i.test(issue)) return "canonical";
  if (/x-default/i.test(issue)) return "xDefault";
  if (/hreflang/i.test(issue)) return "hreflang";
  if (/sitemap/i.test(issue)) return "sitemap";
  if (/title|description/i.test(issue)) return "metadata";
  return "http";
};

// Strikte gates: deze categorieën laten de build hard falen.
const CRITICAL = new Set(["canonical", "hreflang", "xDefault", "sitemap", "http"]);
const critical = errors.filter((e) => CRITICAL.has(classify(e)));

const summary = {
  baseUrl: BASE,
  generatedAt: new Date().toISOString(),
  routesChecked: routes.length,
  routesPassing: passed,
  sitemapEntries: sitemap.size,
  totals: {
    issues: errors.length,
    critical: critical.length,
    byCategory: errors.reduce((acc, e) => {
      const c = classify(e);
      acc[c] = (acc[c] ?? 0) + 1;
      return acc;
    }, {}),
  },
  routes: perRoute.map((r) => ({
    path: r.path,
    status: r.issues.length === 0 ? "pass" : "fail",
    checks: {
      canonical: r.issues.some((i) => classify(i) === "canonical") ? "fail" : "pass",
      hreflang: r.issues.some((i) => classify(i) === "hreflang") ? "fail" : "pass",
      xDefault: r.issues.some((i) => classify(i) === "xDefault") ? "fail" : "pass",
      sitemap: r.issues.some((i) => classify(i) === "sitemap") ? "fail" : "pass",
    },
    issues: r.issues.map((i) => i.replace(/^[^:]+:\s*/, "")),
  })),
  criticalIssues: critical,
};

const lines = [
  "# SEO validator report",
  "",
  `Base URL: ${BASE}`,
  `Generated: ${summary.generatedAt}`,
  "",
  `- Routes checked: ${routes.length}`,
  `- Routes passing: ${passed}`,
  `- Sitemap entries: ${sitemap.size}`,
  `- Total issues: ${errors.length} (critical: ${critical.length})`,
  "",
  "| Route | Canonical | hreflang | x-default | Sitemap | Issues |",
  "| --- | --- | --- | --- | --- | --- |",
  ...summary.routes.map(
    (r) =>
      `| ${r.path} | ${r.checks.canonical} | ${r.checks.hreflang} | ${r.checks.xDefault} | ${r.checks.sitemap} | ${
        r.issues.join("<br>") || "\u2014"
      } |`,
  ),
];

await mkdir("reports", { recursive: true });
await writeFile("reports/seo-report.md", lines.join("\n") + "\n", "utf8");
await writeFile("reports/seo-report.json", JSON.stringify(summary, null, 2) + "\n", "utf8");
console.log("Reports written to reports/seo-report.md and reports/seo-report.json");

if (critical.length) {
  console.error(`SEO validation FAILED (${critical.length} critical issue(s)):`);
  for (const e of critical) console.error(` - ${e}`);
  process.exit(1);
}
if (errors.length) {
  console.warn(`SEO validation passed with ${errors.length} non-critical issue(s):`);
  for (const e of errors) console.warn(` - ${e}`);
}
console.log(`SEO validation passed: ${routes.length} routes, ${sitemap.size} sitemap entries.`);
