/**
 * E-mailverzending via de Brevo HTTP REST API.
 *
 * Bewust HTTP in plaats van SMTP: geen TCP-sockets nodig, dus betrouwbaar op
 * elke serverless runtime. De API-sleutel komt uitsluitend uit
 * process.env.BREVO_API_KEY — nooit uit de broncode of de client.
 */

import { describeError, logMail, type MailChannel } from "./mail-log.server";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export const DEFAULT_SENDER = {
  name: "Delplanche Cloud Desk",
  email: "noreply@send.delplanche.cloud",
} as const;

/** Desk-ontvanger; overschrijfbaar via MAIL_TO. */
export const DESK_RECIPIENT = "jona@delplanche.cloud";

export type BrevoContact = { email: string; name?: string };

export type BrevoPayload = {
  to: BrevoContact;
  subject: string;
  html: string;
  text: string;
  replyTo?: BrevoContact;
  channel?: MailChannel;
  requestId?: string;
  /** Wordt als tag meegestuurd zodat een replay herkenbaar blijft. */
  reference?: string;
};

export type BrevoResult = {
  sent: boolean;
  messageId: string | null;
  errorCode?: string;
  errorMessage?: string;
};

export async function sendBrevoEmail(payload: BrevoPayload): Promise<BrevoResult> {
  const startedAt = Date.now();
  const channel = payload.channel ?? "desk";
  const requestId = payload.requestId ?? "req_unknown";

  const apiKey = process.env["BREVO_API_KEY"];
  if (!apiKey) {
    logMail({ kind: "skipped", channel, reason: "not_configured", requestId });
    return { sent: false, messageId: null, errorCode: "brevo_not_configured" };
  }

  const sender = {
    name: process.env["MAIL_FROM_NAME"] || DEFAULT_SENDER.name,
    email: process.env["MAIL_FROM"] || DEFAULT_SENDER.email,
  };

  const body = {
    sender,
    to: [payload.to],
    subject: payload.subject,
    htmlContent: payload.html,
    textContent: payload.text,
    ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
    ...(payload.reference ? { tags: [payload.reference] } : {}),
  };

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = (await res.text()).slice(0, 500);
      console.error(`Brevo error [${res.status}]: ${detail}`);
      logMail({
        kind: "failed",
        channel,
        errorCode: `brevo_failed:${res.status}`,
        errorName: "HttpError",
        errorMessage: `status ${res.status}`,
        durationMs: Date.now() - startedAt,
        requestId,
      });
      return {
        sent: false,
        messageId: null,
        errorCode: `brevo_failed:${res.status}`,
        errorMessage: `status ${res.status}`,
      };
    }

    const json = (await res.json().catch(() => ({}))) as { messageId?: string };
    const messageId = json.messageId ?? null;
    logMail({
      kind: "sent",
      channel,
      messageId,
      durationMs: Date.now() - startedAt,
      requestId,
      accepted: 1,
      rejected: 0,
    });
    return { sent: true, messageId };
  } catch (error) {
    console.error("Brevo Error:", error);
    const described = describeError(error);
    logMail({
      kind: "failed",
      channel,
      errorCode: `brevo_failed:${described.errorCode}`,
      errorName: described.errorName,
      errorMessage: described.errorMessage,
      durationMs: Date.now() - startedAt,
      requestId,
    });
    return {
      sent: false,
      messageId: null,
      errorCode: `brevo_failed:${described.errorCode}`,
      errorMessage: described.errorMessage,
    };
  }
}

/** Gezondheidscheck zonder mail te versturen: valideert de API-sleutel. */
export async function verifyBrevoConnection(): Promise<{
  ok: boolean;
  configured: boolean;
  errorMessage?: string;
}> {
  const apiKey = process.env["BREVO_API_KEY"];
  if (!apiKey) return { ok: false, configured: false };
  try {
    const res = await fetch("https://api.brevo.com/v3/account", {
      headers: { accept: "application/json", "api-key": apiKey },
    });
    if (!res.ok) {
      return { ok: false, configured: true, errorMessage: `status ${res.status}` };
    }
    return { ok: true, configured: true };
  } catch (error) {
    return { ok: false, configured: true, errorMessage: describeError(error).errorMessage };
  }
}
