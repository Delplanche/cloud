/**
 * Service-laag voor uitgaande e-mail.
 *
 * Enige plek waar templates en SMTP-transport samenkomen. API-routes en
 * server-functies roepen uitsluitend deze functies aan; UI-componenten nooit.
 * Pure Node.js — draait ongewijzigd in een serverless functie of Docker.
 */

import { sendDeskMail, verifySmtpConnection, type MailResult } from "@/lib/mailer.server";
import {
  DESK_ADDRESS,
  type ContactMessage,
  type infraRequestSchema,
} from "@/lib/submissions.server";
import type { z } from "zod";

export type InfraRequest = z.infer<typeof infraRequestSchema>;

export type DeliveryContext = {
  requestId: string;
  idempotencyKey: string;
  /** Korte publieke referentie (DPC-XXXXXX) die in beide mails terugkomt. */
  reference?: string;
};

export type ContactDelivery = { desk: MailResult; receipt: MailResult };

/** Desk-notificatie + auto-responder voor een contactbericht. */
export async function deliverContactMessage(
  data: ContactMessage,
  context: DeliveryContext,
): Promise<ContactDelivery> {
  const { requestId, idempotencyKey, reference } = context;
  const { contactEmail, contactReceiptEmail } = await import("@/lib/mail-templates.server");
  const mail = contactEmail({ ...data, ...(reference ? { reference } : {}) });
  const receipt = contactReceiptEmail({
    ...data,
    category: data.category,
    ...(reference ? { reference } : {}),
  });

  // Ontvanger komt uit de omgeving (MAIL_TO); DESK_ADDRESS is enkel fallback.
  const owner = process.env["MAIL_TO"] || DESK_ADDRESS;

  const [desk, client] = await Promise.all([
    sendDeskMail({
      to: owner,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: data.email,
      channel: "desk",
      ...context,
    }),
    sendDeskMail({
      to: data.email,
      subject: receipt.subject,
      html: receipt.html,
      text: receipt.text,
      replyTo: DESK_ADDRESS,
      channel: "receipt",
      ...context,
    }),
  ]);

  return { desk, receipt: client };
}

/** Desk-notificatie voor een infrastructuuraanvraag. */
export async function deliverInfraRequest(
  data: InfraRequest & { notes?: string | undefined },
  ticket: string,
  context?: Partial<DeliveryContext>,
): Promise<MailResult> {
  const { infraRequestEmail } = await import("@/lib/mail-templates.server");
  const mail = infraRequestEmail({ ...data, ticket, notes: data.notes || undefined });
  return sendDeskMail({
    channel: "desk",
    to: DESK_ADDRESS,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: data.email,
    ...(context?.requestId ? { requestId: context.requestId } : {}),
    ...(context?.idempotencyKey ? { idempotencyKey: context.idempotencyKey } : {}),
  });
}

/** Gezondheidscheck voor /api/public/health. */
export const checkMailTransport = verifySmtpConnection;
