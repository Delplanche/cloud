/**
 * Fail-fast validatie van de server-omgeving.
 *
 * Pure Node.js: leest uitsluitend process.env, geen platform-SDK's. Dezelfde
 * functie draait in een Vercel-functie, in `node server.js` of in Docker.
 */

export type EnvIssue = { name: string; reason: string };

export type EnvReport = {
  ok: boolean;
  missing: EnvIssue[];
  warnings: EnvIssue[];
};

/** Variabelen zonder dewelke de mailketen niet kan functioneren. */
const REQUIRED = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_FROM", "MAIL_TO"];

/** Optioneel, maar afwezigheid betekent stil verlies van functionaliteit. */
const RECOMMENDED = ["KCHAT_WEBHOOK_URL", "MAIL_SELFTEST_TOKEN"];

export function inspectEnv(env: NodeJS.ProcessEnv = process.env): EnvReport {
  const missing: EnvIssue[] = [];
  const warnings: EnvIssue[] = [];

  // De dev-mock vervangt SMTP volledig; dan zijn de SMTP-variabelen optioneel.
  const mocked = Boolean(env["MAIL_DEV_MOCK"]);

  for (const name of REQUIRED) {
    if (env[name]) continue;
    (mocked ? warnings : missing).push({ name, reason: "ontbreekt" });
  }

  const port = env["SMTP_PORT"];
  if (port && !Number.isInteger(Number(port))) {
    missing.push({ name: "SMTP_PORT", reason: `geen geheel getal ("${port}")` });
  }

  for (const name of RECOMMENDED) {
    if (!env[name]) warnings.push({ name, reason: "niet ingesteld — functie uitgeschakeld" });
  }

  return { ok: missing.length === 0, missing, warnings };
}

/**
 * Logt één samenvattende regel bij het opstarten. Gooit wanneer `strict`
 * aanstaat (productie-start of build) en er een vereiste variabele ontbreekt.
 */
export function validateEnv(options: { strict?: boolean } = {}): EnvReport {
  const report = inspectEnv();
  const line = `[env] ${JSON.stringify({
    ok: report.ok,
    missing: report.missing.map((i) => i.name),
    warnings: report.warnings.map((i) => i.name),
  })}`;

  if (report.ok) console.log(line);
  else console.error(line);

  if (!report.ok && options.strict) {
    const detail = report.missing.map((i) => `${i.name} (${i.reason})`).join(", ");
    throw new Error(`Ontbrekende of ongeldige environment variables: ${detail}`);
  }
  return report;
}
