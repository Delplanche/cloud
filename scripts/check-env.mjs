#!/usr/bin/env node
/**
 * Fail-fast environment-check voor build en container-start.
 *
 *   node scripts/check-env.mjs           -> waarschuwt (build/dev)
 *   node scripts/check-env.mjs --strict  -> faalt hard bij ontbrekende vars
 *
 * Bewust een losse .mjs zonder afhankelijkheden, zodat hij ook in een kale
 * Docker-container of CI-stap draait.
 */

const REQUIRED = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_FROM", "MAIL_TO"];
const RECOMMENDED = ["KCHAT_WEBHOOK_URL", "MAIL_SELFTEST_TOKEN"];

const strict = process.argv.includes("--strict") || process.env["ENV_CHECK_STRICT"] === "1";
const mocked = Boolean(process.env["MAIL_DEV_MOCK"]);

const missing = REQUIRED.filter((name) => !process.env[name]);
const warnings = RECOMMENDED.filter((name) => !process.env[name]);

const port = process.env["SMTP_PORT"];
if (port && !Number.isInteger(Number(port))) missing.push(`SMTP_PORT (geen getal: "${port}")`);

for (const name of warnings) {
  console.warn(`\u26a0 check-env: ${name} ontbreekt — bijhorende functie is uitgeschakeld`);
}

if (missing.length > 0) {
  const message = `check-env: ontbrekende environment variables: ${missing.join(", ")}`;
  if (strict && !mocked) {
    console.error(`\n\u2716 ${message}\n`);
    process.exit(1);
  }
  console.warn(`\u26a0 ${message}${mocked ? " (MAIL_DEV_MOCK actief)" : ""}`);
} else {
  console.log("\u2714 check-env: alle vereiste environment variables zijn aanwezig");
}
