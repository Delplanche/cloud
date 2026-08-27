/**
 * Service-laag voor uitgaande e-mail.
 *
 * Enige plek waar templates en transport samenkomen. Verzending gebeurt via de
 * Brevo HTTP REST API (geen SMTP-sockets), zodat de route op elke serverless
 * runtime betrouwbaar werkt. API-routes en server-functies roepen uitsluitend
 * deze functies aan; UI-componenten nooit.
 */

import {
  sendBrevoEmail,
  templateIdFromEnv,
  verifyBrevoConnection,
  DESK_RECIPIENT,
  type BrevoResult,
} from "@/lib/brevo.server";
import {
  DESK_ADDRESS,
  type ContactMessage,
  type infraRequestSchema,
} from "@/lib/submissions.server";
import type { z } from "zod";

export type MailResult = BrevoResult;

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
  const { requestId, reference } = context;
  const { contactEmail, contactReceiptEmail } = await import("@/lib/mail-templates.server");
  const mail = contactEmail({ ...data, ...(reference ? { reference } : {}) });
  const receipt = contactReceiptEmail({
    ...data,
    category: data.category,
    ...(reference ? { reference } : {}),
  });

  // Ontvanger komt uit de omgeving (MAIL_TO); anders de vaste desk-inbox.
  const owner = process.env["MAIL_TO"] || DESK_RECIPIENT;

  const [desk, client] = await Promise.all([
    sendBrevoEmail({
      to: { email: owner, name: "Delplanche Cloud Desk" },
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: { email: data.email, name: data.name },
      channel: "desk",
      requestId,
      ...(reference ? { reference } : {}),
    }),
    sendBrevoEmail({
      to: { email: data.email, name: data.name },
      subject: receipt.subject,
      html: receipt.html,
      text: receipt.text,
      replyTo: { email: DESK_ADDRESS, name: "Delplanche Cloud Desk" },
      channel: "receipt",
      requestId,
      ...(reference ? { reference } : {}),
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
  return sendBrevoEmail({
    channel: "desk",
    to: { email: process.env["MAIL_TO"] || DESK_RECIPIENT },
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: { email: data.email },
    ...(context?.requestId ? { requestId: context.requestId } : {}),
    reference: ticket,
  });
}

/** Gezondheidscheck voor /api/public/health. */
export const checkMailTransport = verifyBrevoConnection;

