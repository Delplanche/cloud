/**
 * SMTP-verzending (Node.js / Vercel runtime).
 *
 * SECURITY: geen enkele credential staat in de broncode. Host, poort,
 * gebruiker en wachtwoord komen uitsluitend uit process.env:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *
 * Nodemailer wordt lazy geïmporteerd zodat de module enkel in een
 * server-handler geladen wordt en nooit in de clientbundel belandt.
 */

import { describeError, logMail, type MailChannel } from "./mail-log.server";

export type MailPayload = {
  to?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  /** Kanaal voor de gestructureerde logging. */
  channel?: MailChannel;
  /** Correleert alle logregels van één inzending. */
  requestId?: string;
  /** Idempotency-sleutel; wordt als Message-ID meegestuurd zodat een
   *  dubbele verzending door de mailserver herkend kan worden. */
  idempotencyKey?: string;
};

export type MailResult = {
  sent: boolean;
  messageId: string | null;
  errorCode?: string;
  errorMessage?: string;
};

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
};

function readConfig(): SmtpConfig | null {
  const host = process.env["SMTP_HOST"];
  const port = Number(process.env["SMTP_PORT"] ?? "587");
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];
  if (!host || !user || !pass || !Number.isFinite(port)) return null;
  return {
    host,
    port,
    user,
    pass,
    from: process.env["MAIL_FROM"] ?? user,
    to: process.env["MAIL_TO"] ?? user,
  };
}

/** Deterministische Message-ID zodat dezelfde inzending nooit twee
 *  verschillende identiteiten krijgt bij een retry. */
function buildMessageId(payload: MailPayload): string | undefined {
  if (!payload.idempotencyKey) return undefined;
  const channel = payload.channel ?? "desk";
  return `<${payload.idempotencyKey}.${channel}@delplanche.cloud>`;
}

/**
 * Lokale development-mock. Actief zodra MAIL_DEV_MOCK gezet is:
 *   MAIL_DEV_MOCK=1     -> doet alsof de mail vertrokken is
 *   MAIL_DEV_MOCK=fail  -> forceert een fout, zodat de retry-keten
 *                          end-to-end getest kan worden zonder echte SMTP
 * Er wordt nooit ontvanger of inhoud gelogd, enkel het systeem-event.
 */
function devMock(payload: MailPayload, startedAt: number): MailResult | null {
  const mode = process.env["MAIL_DEV_MOCK"];
  if (!mode) return null;
  const channel = payload.channel ?? "desk";
  const requestId = payload.requestId ?? "req_unknown";

  if (mode === "fail") {
    logMail({
      kind: "failed",
      channel,
      errorCode: "smtp_failed:mock",
      errorName: "MockFailure",
      errorMessage: "MAIL_DEV_MOCK=fail",
      durationMs: Date.now() - startedAt,
      requestId,
    });
    return { sent: false, messageId: null, errorCode: "smtp_failed:mock" };
  }

  const messageId = buildMessageId(payload) ?? null;
  logMail({ kind: "skipped", channel, reason: "dev_mock", requestId });
  return { sent: true, messageId };
}

export async function sendDeskMail(payload: MailPayload): Promise<MailResult> {
  const startedAt = Date.now();
  const channel = payload.channel ?? "desk";
  const requestId = payload.requestId ?? "req_unknown";

  const mocked = devMock(payload, startedAt);
  if (mocked) return mocked;

  const config = readConfig();
  if (!config) {
    logMail({ kind: "skipped", channel, reason: "not_configured", requestId });
    return { sent: false, messageId: null, errorCode: "smtp_not_configured" };
  }

  try {
    const nodemailer = (await import("nodemailer")).default;
    const transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      requireTLS: config.port !== 465,
      auth: { user: config.user, pass: config.pass },
    });

    const messageId = buildMessageId(payload);
    const info = await transport.sendMail({
      from: `"delplanche.cloud" <${config.from}>`,
      to: payload.to ?? config.to,
      ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
      ...(messageId ? { messageId } : {}),
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    logMail({
      kind: "sent",
      channel,
      messageId: info.messageId ?? messageId ?? null,
      durationMs: Date.now() - startedAt,
      requestId,
      accepted: Array.isArray(info.accepted) ? info.accepted.length : 0,
      rejected: Array.isArray(info.rejected) ? info.rejected.length : 0,
    });

    return { sent: true, messageId: info.messageId ?? messageId ?? null };
  } catch (error) {
    // Enkel systeem-events loggen — nooit ontvanger, inhoud of credentials.
    const described = describeError(error);
    logMail({
      kind: "failed",
      channel,
      errorCode: `smtp_failed:${described.errorCode}`,
      errorName: described.errorName,
      errorMessage: described.errorMessage,
      durationMs: Date.now() - startedAt,
      requestId,
    });
    return {
      sent: false,
      messageId: null,
      errorCode: `smtp_failed:${described.errorCode}`,
      errorMessage: described.errorMessage,
    };
  }
}
