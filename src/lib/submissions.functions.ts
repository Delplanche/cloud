import { createServerFn } from "@tanstack/react-start";
import { contactMessageSchema, infraRequestSchema, makeTicket } from "./submissions.server";

export const submitInfraRequest = createServerFn({ method: "POST" })
  .validator((data: unknown) => infraRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const ticket = makeTicket();
    // Honeypot ingevuld: bots krijgen een plausibel antwoord, zonder notificatie.
    if (data.company) return { ticket, queue: 1 };

    const { deliverInfraRequest } = await import("@/services/mailService");
    const { newRequestId } = await import("./mail-log.server");
    await deliverInfraRequest(data, ticket, { requestId: newRequestId() });

    return { ticket, queue: 1 };
  });

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactMessageSchema.parse(data))
  .handler(async ({ data }) => {
    const { deliverContactMessage } = await import("@/services/mailService");
    const { fingerprint, recallIdempotent, rememberIdempotent, detectSpam } = await import(
      "./anti-abuse.server"
    );
    const { newRequestId, logMail } = await import("./mail-log.server");
    const requestId = newRequestId();

    const spamSignal = detectSpam([data.name, data.subject, data.message]);
    if (spamSignal) {
      logMail({ kind: "skipped", channel: "desk", reason: "spam_detected", requestId });
      return { received: false, receipt: false, replay: false };
    }

    const idempotencyKey = fingerprint([data.email, data.category, data.subject, data.message]);
    const replayed = recallIdempotent<{ received: boolean; receipt: boolean }>(idempotencyKey);
    if (replayed) {
      logMail({ kind: "skipped", channel: "desk", reason: "idempotent_replay", requestId });
      return { ...replayed, replay: true };
    }

    const delivery = await deliverContactMessage(data, { requestId, idempotencyKey });
    const result = { received: delivery.desk.sent, receipt: delivery.receipt.sent };
    if (delivery.desk.sent) rememberIdempotent(idempotencyKey, result);
    return { ...result, replay: false };
  });

export const getSystemStatus = createServerFn({ method: "GET" }).handler(async () => {
  // Stateless architectuur: geen database-probe. De statusbalk leest de
  // gezondheid van de mail- en webhookketen via de service-laag.
  const started = Date.now();
  const { checkMailTransport } = await import("@/services/mailService");
  const { checkChatWebhook } = await import("@/services/chatService");
  const [smtp, chat] = [await checkMailTransport(), checkChatWebhook()];
  return {
    operational: smtp.ok && chat.ok,
    latencyMs: Math.max(1, Date.now() - started),
    region: "Genève — CH (Tier 3+)",
    checkedAt: new Date().toISOString(),
  };
});
