/**
 * Eén centrale intake voor het contactformulier.
 *
 * Server-only. Voert per inzending drie acties uit:
 *   1. desk-mail naar de eigenaar (SMTP, MAIL_TO)
 *   2. bevestigingsmail naar de bezoeker
 *   3. kChat-webhookmelding (KCHAT_WEBHOOK_URL)
 *
 * Alle credentials komen uitsluitend uit process.env. Wanneer één kanaal
 * faalt blijven de andere kanalen gewoon doorlopen; er lekt nooit een
 * provider-detail naar de client.
 */

import { z } from "zod";

import {
  checkRateLimit,
  clientIp,
  detectSpam,
  fingerprint,
  recallIdempotent,
  rememberIdempotent,
} from "./anti-abuse.server";
import { referenceFromKey } from "./contact-categories";
import { logMail, newRequestId } from "./mail-log.server";
import { contactMessageSchema } from "./submissions.server";

const payloadSchema = contactMessageSchema.extend({
  // Honeypot: moet leeg blijven — bots vullen dit in.
  company: z.string().max(200).optional(),
});

export type ContactResponse = {
  ok: true;
  email: boolean;
  receipt: boolean;
  chat: boolean;
  messageId: string | null;
  idempotencyKey: string;
  reference: string;
  replay?: boolean;
};

export async function handleContactRequest(request: Request): Promise<Response> {
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
  if (company) {
    logMail({ kind: "skipped", channel: "desk", reason: "spam_detected", requestId });
    return Response.json({ ok: true, email: false, receipt: false, chat: false });
  }

  const spamSignal = detectSpam([data.name, data.subject, data.message]);
  if (spamSignal) {
    logMail({ kind: "skipped", channel: "desk", reason: "spam_detected", requestId });
    return Response.json({ error: "spam_detected", signal: spamSignal }, { status: 422 });
  }

  const idempotencyKey =
    request.headers.get("idempotency-key")?.slice(0, 120) ||
    fingerprint([data.email, data.category, data.subject, data.message]);

  const replayed = recallIdempotent<ContactResponse>(idempotencyKey);
  if (replayed) {
    logMail({ kind: "skipped", channel: "desk", reason: "idempotent_replay", requestId });
    return Response.json({ ...replayed, replay: true });
  }

  const { deliverContactMessage } = await import("@/services/mailService");
  const { notifyChat } = await import("@/services/chatService");

  // Beide kanalen los van elkaar: een SMTP-storing mag de kChat-melding niet
  // tegenhouden en omgekeerd.
  const [mailSettled, chatSettled] = await Promise.allSettled([
    deliverContactMessage(data, { requestId, idempotencyKey }),
    notifyChat({ ...data, requestId }),
  ]);

  const delivery =
    mailSettled.status === "fulfilled"
      ? mailSettled.value
      : { desk: { sent: false, messageId: null }, receipt: { sent: false, messageId: null } };
  const chatResult =
    chatSettled.status === "fulfilled" ? chatSettled.value : { sent: false };

  const result: ContactResponse = {
    ok: true,
    email: delivery.desk.sent,
    receipt: delivery.receipt.sent,
    chat: chatResult.sent,
    messageId: delivery.desk.messageId,
    idempotencyKey,
  };

  // Enkel wanneer élk kanaal faalt is de inzending echt verloren.
  if (!result.email && !result.chat) {
    return Response.json({ error: "delivery_failed", requestId }, { status: 502 });
  }

  rememberIdempotent(idempotencyKey, result);
  return Response.json(result);
}
