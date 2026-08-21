/**
 * Vercel Edge Middleware — netwerkrand-bescherming voor publieke formulieren.
 *
 * Blokkeert snelle, herhaalde POST-verzoeken naar /api/public/* nog vóór de
 * serverless mailhandler warm wordt. Volledig stateless per edge-instance:
 * geen database, geen externe afhankelijkheid.
 */

export const config = {
  matcher: ["/api/public/:path*"],
};

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const MAX_KEYS = 5_000;

const hits = new Map<string, number[]>();

function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export default function middleware(request: Request): Response | undefined {
  if (request.method !== "POST") return undefined;

  const now = Date.now();
  const key = clientIp(request);
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    const oldest = recent[0] ?? now;
    const retryAfter = Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
    return new Response(JSON.stringify({ error: "rate_limited", retryAfterSeconds: retryAfter }), {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(retryAfter),
      },
    });
  }

  recent.push(now);
  hits.set(key, recent);
  if (hits.size > MAX_KEYS) hits.clear();
  return undefined;
}
