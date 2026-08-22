/**
 * Lichtgewicht statusendpoint voor de UI-statusbalk en externe uptime-monitors.
 *
 *   GET /api/public/health -> 200 { status: "operational", ... }
 *                          -> 503 { status: "degraded", ... }
 *
 * Controleert programmatorisch de SMTP-verbinding (nodemailer verify) en de
 * kChat-webhookconfiguratie. Geeft nooit hostnamen van credentials of PII vrij
 * buiten de reeds publieke SMTP-host.
 */

import { createFileRoute } from "@tanstack/react-router";

// Node.js-runtime verplicht: SMTP heeft TCP-sockets nodig (geen Edge).
export const runtime = "nodejs";

type CheckResult = {
  ok: boolean;
  configured: boolean;
  detail?: string | undefined;
};

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        const startedAt = Date.now();

        const { checkMailTransport } = await import("@/services/mailService");
        const { checkChatWebhook } = await import("@/services/chatService");
        const { inspectEnv } = await import("@/lib/env.server");

        const smtpRaw = await checkMailTransport();
        const chatRaw = checkChatWebhook();
        const env = inspectEnv();

        const smtp: CheckResult = {
          ok: smtpRaw.ok,
          configured: smtpRaw.configured,
          detail: smtpRaw.configured
            ? `${smtpRaw.host}:${smtpRaw.port}${smtpRaw.secure ? " (tls)" : " (starttls)"}`
            : "not_configured",
        };
        const chat: CheckResult = {
          ok: chatRaw.ok,
          configured: chatRaw.configured,
          detail: chatRaw.reason,
        };

        const healthy = smtp.ok && chat.ok && env.ok;

        return Response.json(
          {
            status: healthy ? "operational" : "degraded",
            checkedAt: new Date().toISOString(),
            latencyMs: Math.max(1, Date.now() - startedAt),
            checks: { smtp, chat, env: { ok: env.ok, missing: env.missing.map((i) => i.name) } },
          },
          {
            status: healthy ? 200 : 503,
            headers: { "Cache-Control": "no-store" },
          },
        );
      },
    },
  },
});
