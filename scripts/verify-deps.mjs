#!/usr/bin/env node
/**
 * Pre-deploy guard (Vercel-vriendelijk).
 *
 * Faalt hard, mét een leesbare foutmelding, wanneer:
 *   1. de broncode een npm-pakket importeert dat niet in package.json staat;
 *   2. een verbannen afhankelijkheid (Supabase) terugkeert;
 *   3. een verwachte publieke asset ontbreekt (logo, favicon, OG-banner).
 *
 * Draait vóór `tsc` en `vite build`, zodat een ontbrekend pakket niet pas
 * halverwege de Vercel-build ontdekt wordt.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

const BANNED = ["@supabase/supabase-js", "@supabase/ssr", "@supabase/auth-helpers-react"];
const REQUIRED_ASSETS = [
  "public/logo.png",
  "public/favicon.png",
  "public/apple-touch-icon.png",
  "public/og-image.jpg",
];

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const declared = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
]);

const NODE_BUILTINS = new Set([
  "node:fs",
  "node:path",
  "node:crypto",
  "node:buffer",
  "node:url",
  "node:stream",
  "node:util",
  "node:os",
  "node:events",
]);

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if ([".ts", ".tsx", ".mts", ".js", ".jsx"].includes(extname(entry))) out.push(full);
  }
  return out;
}

const IMPORT_RE = /(?:from\s+|import\s*\(\s*|require\(\s*)["']([^"']+)["']/g;

/** @type {string[]} */
const errors = [];
/** @type {Map<string, string>} */
const missing = new Map();

for (const file of walk(SRC)) {
  const code = readFileSync(file, "utf8");
  const rel = file.slice(ROOT.length + 1);

  for (const banned of BANNED) {
    if (code.includes(banned)) {
      errors.push(`Verbannen afhankelijkheid "${banned}" wordt nog gebruikt in ${rel}`);
    }
  }

  for (const match of code.matchAll(IMPORT_RE)) {
    const spec = match[1];
    if (!spec) continue;
    if (spec.startsWith(".") || spec.startsWith("/") || spec.startsWith("@/")) continue;
    if (spec.startsWith("node:") && !NODE_BUILTINS.has(spec)) continue;
    if (spec.startsWith("node:")) continue;
    if (spec.endsWith(".css") || spec.endsWith("?url") || spec.endsWith("?raw")) continue;

    const name = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
    if (!name || declared.has(name)) continue;
    if (!missing.has(name)) missing.set(name, rel);
  }
}

for (const banned of BANNED) {
  if (declared.has(banned)) {
    errors.push(`Verbannen afhankelijkheid "${banned}" staat nog in package.json`);
  }
}

for (const [name, rel] of missing) {
  errors.push(`Ontbrekend npm-pakket "${name}" (geïmporteerd in ${rel}) — voeg het toe met bun add`);
}

for (const asset of REQUIRED_ASSETS) {
  if (!existsSync(join(ROOT, asset))) {
    errors.push(`Ontbrekende publieke asset: /${asset.replace(/^public\//, "")} (${asset})`);
  }
}

if (errors.length > 0) {
  console.error("\n\u2716 verify-deps: build gestopt vóór deployment\n");
  for (const error of errors) console.error(`  - ${error}`);
  console.error("");
  process.exit(1);
}

console.log("\u2714 verify-deps: alle imports, assets en afhankelijkheden zijn in orde");
