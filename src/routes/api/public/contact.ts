import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  checkRateLimit,
  clientIp,
  detectSpam,
  fingerprint,
  recallIdempotent,
  rememberIdempotent,
} from "@/lib/anti-abuse.server";
import { logMail, newRequestId } from "@/lib/mail-log.server";
import { contactMessageSchema } from "@/lib/submissions.server";

// Node.js-runtime verplicht: nodemailer heeft TCP-sockets nodig (geen Edge).
export const runtime = "nodejs";

const payloadSchema = contactMessageSchema.extend({
  // Honeypot: moet leeg blijven — bots vullen dit in.
  company: z.string().max(200).optional(),
});

type ContactResponse = {
  ok: true;
  email: boolean;
  receipt: boolean;
  chat: boolean;
  messageId: string | null;
  idempotencyKey: string;
  replay?: boolean;
};

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = newRequestId();
        const ip = clientIp(request);

        const limit = checkRateLimit(`contact:${ip}`);
        if (!limit.ok && limit.reason === "rate_limited") {
          return Response.json(
            { error: "rate_limited", retryAfterSeconds: limit.retryAfterSeconds },
            { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
          );
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ error: "invalid_json" }, { status: 400 });
        }

        const parsed = payloadSchema.safeParse(raw);
        if (!parsed.success) {
          return Response.json({ error: "invalid_input" }, { status: 400 });
        }

        const { company, ...data } = parsed.data;
        // Honeypot ingevuld → stilzwijgend accepteren, niets doorsturen.
        if (company) {
          logMail({ kind: "skipped", channel: "desk", reason: "spam_detected", requestId });
          return Response.json({ ok: true, email: false, receipt: false, chat: false });
        }

        const spamSignal = detectSpam([data.name, data.subject, data.message]);
        if (spamSignal) {
          logMail({ kind: "skipped", channel: "desk", reason: "spam_detected", requestId });
          return Response.json({ error: "spam_detected", signal: spamSignal }, { status: 422 });
        }

        // Idempotency: dezelfde inzending binnen het TTL-venster stuurt geen
        // tweede mail naar de desk of de klant — het eerste resultaat keert terug.
        const idempotencyKey =
          request.headers.get("idempotency-key")?.slice(0, 120) ||
          fingerprint([data.email, data.category, data.subject, data.message]);

        const replayed = recallIdempotent<ContactResponse>(idempotencyKey);
        if (replayed) {
          logMail({ kind: "skipped", channel: "desk", reason: "idempotent_replay", requestId });
          return Response.json({ ...replayed, replay: true });
        }

        // Stateless: geen opslag. Alle netwerktaken lopen via de service-laag:
        // mailService (SMTP) en chatService (webhook).
        const { deliverContactMessage } = await import("@/services/mailService");
        const { notifyChat } = await import("@/services/chatService");

        const [delivery, chatResult] = await Promise.all([
          deliverContactMessage(data, { requestId, idempotencyKey }),
          notifyChat({ ...data, requestId }),
        ]);
        const mailResult = delivery.desk;
        const receiptResult = delivery.receipt;

        if (!mailResult.sent) {
          return Response.json(
            { error: "mail_failed", code: mailResult.errorCode ?? "unknown", requestId },
            { status: 502 },
          );
        }

        const result: ContactResponse = {
          ok: true,
          email: mailResult.sent,
          receipt: receiptResult.sent,
          chat: chatResult.sent,
          messageId: mailResult.messageId,
          idempotencyKey,
        };
        rememberIdempotent(idempotencyKey, result);

        return Response.json(result);
      },
    },
  },
});
