/**
 * Beveiligde diagnostische route om de SMTP-instellingen op Vercel te
 * verifiëren. Stuurt één desk-notificatie én één auto-responder naar een
 * opgegeven adres en rapporteert per kanaal de uitkomst incl. Message-ID.
 *
 * Beveiliging: vereist de header `x-admin-token` (of `Authorization: Bearer`)
 * die exact overeenkomt met de server-side secret MAIL_SELFTEST_TOKEN.
 * Zonder secret is de route volledig uitgeschakeld (503).
 *
 *   curl -X POST https://delplanche.cloud/api/public/mail-selftest \
 *        -H "x-admin-token: $MAIL_SELFTEST_TOKEN" \
 *        -H "content-type: application/json" \
 *        -d '{"to":"jij@example.com"}'
 */

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { checkRateLimit, clientIp } from "@/lib/anti-abuse.server";
import { logMail, newRequestId } from "@/lib/mail-log.server";
import { DESK_ADDRESS } from "@/lib/submissions.server";

const bodySchema = z.object({
  to: z.string().trim().email().max(200),
  locale: z.enum(["en", "nl", "fr"]).default("nl"),
});

/** Timing-safe vergelijking zonder Node-specifieke Buffer-API. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const Route = createFileRoute("/api/public/mail-selftest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = newRequestId();
        const secret = process.env["MAIL_SELFTEST_TOKEN"];
        if (!secret) {
          return Response.json({ error: "selftest_disabled" }, { status: 503 });
        }

        const provided =
          request.headers.get("x-admin-token") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
          "";
        if (!safeEqual(provided, secret)) {
          return new Response("Unauthorized", { status: 401 });
        }

        const limit = checkRateLimit(`selftest:${clientIp(request)}`);
        if (!limit.ok && limit.reason === "rate_limited") {
          return Response.json(
            { error: "rate_limited", retryAfterSeconds: limit.retryAfterSeconds },
            { status: 429 },
          );
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          raw = {};
        }
        const parsed = bodySchema.safeParse(raw);
        if (!parsed.success) {
          return Response.json({ error: "invalid_input" }, { status: 400 });
        }

        const probe = {
          category: "direct" as const,
          locale: parsed.data.locale,
          name: "SMTP self-test",
          email: parsed.data.to,
          subject: `Diagnostiek ${new Date().toISOString()}`,
          message:
            "Dit is een geautomatiseerde testinzending om de SMTP-configuratie te verifiëren. Geen actie vereist.",
        };

        const { sendDeskMail } = await import("@/lib/mailer.server");
        const { contactEmail, contactReceiptEmail } = await import("@/lib/mail-templates.server");
        const desk = contactEmail(probe);
        const receipt = contactReceiptEmail(probe);
        const idempotencyKey = `selftest_${requestId}`;

        const [deskResult, receiptResult] = await Promise.all([
          sendDeskMail({
            to: DESK_ADDRESS,
            subject: `[TEST] ${desk.subject}`,
            html: desk.html,
            text: desk.text,
            channel: "diagnostic",
            requestId,
            idempotencyKey,
          }),
          sendDeskMail({
            to: probe.email,
            subject: `[TEST] ${receipt.subject}`,
            html: receipt.html,
            text: receipt.text,
            replyTo: DESK_ADDRESS,
            channel: "diagnostic",
            requestId,
            idempotencyKey,
          }),
        ]);

        logMail({
          kind: deskResult.sent && receiptResult.sent ? "sent" : "failed",
          channel: "diagnostic",
          ...(deskResult.sent && receiptResult.sent
            ? { messageId: deskResult.messageId, durationMs: 0, requestId }
            : {
                errorCode: deskResult.errorCode ?? receiptResult.errorCode ?? "unknown",
                errorName: "SelfTestFailure",
                errorMessage: "one or more diagnostic channels failed",
                durationMs: 0,
                requestId,
              }),
        } as Parameters<typeof logMail>[0]);

        return Response.json(
          {
            ok: deskResult.sent && receiptResult.sent,
            requestId,
            smtpConfigured: Boolean(process.env["SMTP_HOST"] && process.env["SMTP_USER"]),
            devMock: Boolean(process.env["MAIL_DEV_MOCK"]),
            desk: {
              sent: deskResult.sent,
              messageId: deskResult.messageId,
              errorCode: deskResult.errorCode ?? null,
              errorMessage: deskResult.errorMessage ?? null,
            },
            autoResponder: {
              sent: receiptResult.sent,
              messageId: receiptResult.messageId,
              errorCode: receiptResult.errorCode ?? null,
              errorMessage: receiptResult.errorMessage ?? null,
            },
          },
          { status: deskResult.sent && receiptResult.sent ? 200 : 502 },
        );
      },
    },
  },
});
