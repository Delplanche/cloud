import { createServerFn } from "@tanstack/react-start";
import {
  DESK_ADDRESS,
  contactMessageSchema,
  infraRequestSchema,
  makeTicket,
} from "./submissions.server";

export const submitInfraRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => infraRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const ticket = makeTicket();
    // Honeypot ingevuld: bots krijgen een plausibel antwoord, zonder notificatie.
    if (data.company) return { ticket, queue: 1 };

    const { sendDeskMail } = await import("./mailer.server");
    const { infraRequestEmail } = await import("./mail-templates.server");
    const mail = infraRequestEmail({ ...data, ticket, notes: data.notes || undefined });
    await sendDeskMail({
      to: DESK_ADDRESS,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: data.email,
    });

    return { ticket, queue: 1 };
  });

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactMessageSchema.parse(data))
  .handler(async ({ data }) => {
    const { sendDeskMail } = await import("./mailer.server");
    const { contactEmail, contactReceiptEmail } = await import("./mail-templates.server");
    const mail = contactEmail(data);
    const receipt = contactReceiptEmail(data);

    const [desk, client] = await Promise.all([
      sendDeskMail({
        to: DESK_ADDRESS,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        replyTo: data.email,
      }),
      sendDeskMail({
        to: data.email,
        subject: receipt.subject,
        html: receipt.html,
        text: receipt.text,
        replyTo: DESK_ADDRESS,
      }),
    ]);

    return { received: desk.sent, receipt: client.sent };
  });

export const getSystemStatus = createServerFn({ method: "GET" }).handler(async () => {
  // Stateless architectuur: geen database-probe meer. We meten de round-trip
  // van de serverless functie zelf als gezondheidsindicator.
  const started = Date.now();
  await Promise.resolve();
  return {
    operational: true,
    latencyMs: Math.max(1, Date.now() - started),
    region: "Genève — CH (Tier 3+)",
    checkedAt: new Date().toISOString(),
  };
});
