/**
 * Stateless-vriendelijke misbruikbescherming voor publieke formulieren.
 *
 * Alles draait in-memory per serverless instance: geen database, geen state
 * die opgeruimd moet worden. Op Vercel betekent dit dat de limieten per
 * warme instance gelden — voldoende om geautomatiseerd spammen af te remmen
 * zonder externe afhankelijkheid.
 */

export type AbuseVerdict =
  | { ok: true }
  | { ok: false; reason: "rate_limited"; retryAfterSeconds: number }
  | { ok: false; reason: "spam_detected"; signal: string };

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 3;
const MAX_KEYS = 5_000;

const hits = new Map<string, number[]>();

export function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function checkRateLimit(key: string): AbuseVerdict {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);

  if (recent.length >= RATE_MAX) {
    hits.set(key, recent);
    const oldest = recent[0] ?? now;
    return {
      ok: false,
      reason: "rate_limited",
      retryAfterSeconds: Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000)),
    };
  }

  recent.push(now);
  hits.set(key, recent);
  if (hits.size > MAX_KEYS) hits.clear();
  return { ok: true };
}

const SPAM_PATTERNS: { signal: string; test: (text: string) => boolean }[] = [
  { signal: "honeypot", test: () => false }, // honeypot wordt apart afgehandeld
  {
    signal: "link_flood",
    test: (t) => (t.match(/https?:\/\//gi) ?? []).length > 3,
  },
  {
    signal: "bbcode",
    test: (t) => /\[url[=\]]|\[\/url\]/i.test(t),
  },
  {
    signal: "keyword_spam",
    test: (t) =>
      /\b(viagra|cialis|casino|crypto\s*giveaway|seo\s*services|backlinks?\s*package|loan\s*offer|bitcoin\s*doubl)/i.test(
        t,
      ),
  },
  {
    signal: "cyrillic_bulk",
    test: (t) => ((t.match(/[\u0400-\u04FF]/g) ?? []).length / Math.max(t.length, 1)) > 0.3,
  },
  {
    signal: "header_injection",
    test: (t) => /\b(bcc|cc|content-type)\s*:/i.test(t) || /[\r\n](to|from)\s*:/i.test(t),
  },
  {
    signal: "no_whitespace_wall",
    test: (t) => t.length > 200 && !/\s/.test(t),
  },
];

/** Heuristische inhoudscontrole. Geeft het eerste signaal terug dat aanslaat. */
export function detectSpam(fields: string[]): string | null {
  const text = fields.join("\n");
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) return pattern.signal;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Idempotency                                                         */
/* ------------------------------------------------------------------ */

const IDEMPOTENCY_TTL_MS = 15 * 60 * 1000;
const seen = new Map<string, { at: number; result: unknown }>();

/** Stabiele hash (FNV-1a) — geen crypto-import nodig, deterministisch. */
export function fingerprint(parts: (string | undefined)[]): string {
  const input = parts.filter(Boolean).join("\u0000");
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `idem_${hash.toString(16).padStart(8, "0")}_${input.length.toString(36)}`;
}

/** Geeft het eerdere resultaat terug wanneer dezelfde inzending herhaald wordt. */
export function recallIdempotent<T>(key: string): T | null {
  const now = Date.now();
  const entry = seen.get(key);
  if (!entry) return null;
  if (now - entry.at > IDEMPOTENCY_TTL_MS) {
    seen.delete(key);
    return null;
  }
  return entry.result as T;
}

export function rememberIdempotent(key: string, result: unknown): void {
  if (seen.size > MAX_KEYS) seen.clear();
  seen.set(key, { at: Date.now(), result });
}
