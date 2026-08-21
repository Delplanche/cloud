/**
 * kChat-notificatie via de inkomende webhook.
 * De webhook-URL komt uitsluitend uit process.env (KCHAT_WEBHOOK_URL).
 */

import { describeError, logMail } from "./mail-log.server";
import type { ContactCategory } from "./submissions.server";
import { CATEGORY_LABELS } from "./submissions.server";

export type ChatPayload = {
  category: ContactCategory;
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
  requestId?: string;
};

function sanitize(value: string) {
  return value
    .replace(/[<>]/g, "")
    .replace(/([\\`*_[\]{}()#+.!|>~-])/g, "\\$1")
    .replace(/@/g, "@\u200B");
}

function snippet(value: string, max = 240) {
  const flat = value.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

export async function sendChatNotification(
  data: ChatPayload,
): Promise<{ sent: boolean; errorCode?: string }> {
  const requestId = data.requestId ?? "req_unknown";
  const webhook = process.env["KCHAT_WEBHOOK_URL"];
  if (!webhook) {
    logMail({ kind: "skipped", channel: "chat", reason: "not_configured", requestId });
    return { sent: false, errorCode: "webhook_not_configured" };
  }

  const label = CATEGORY_LABELS[data.category];
  const body = {
    text: [
      `**[${sanitize(label)}] Nieuw contactbericht — delplanche.cloud (${data.locale.toUpperCase()})**`,
      `**Naam:** ${sanitize(data.name)}`,
      `**E-mail:** ${sanitize(data.email)}`,
      `**Onderwerp:** ${sanitize(data.subject)}`,
      "",
      sanitize(snippet(data.message)),
    ].join("\n"),
    // Gestructureerde velden naast de tekst, voor eventuele automatisering.
    category: data.category,
    category_label: label,
    name: data.name,
    email: data.email,
    subject: data.subject,
    snippet: snippet(data.message),
    locale: data.locale,
    request_id: requestId,
  } satisfies Record<string, unknown>;

  const started = Date.now();
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      logMail({
        kind: "failed",
        channel: "chat",
        errorCode: `webhook_failed:${res.status}`,
        errorName: "HttpError",
        errorMessage: `status ${res.status}`,
        durationMs: Date.now() - started,
        requestId,
      });
      return { sent: false, errorCode: `webhook_failed:${res.status}` };
    }
    logMail({
      kind: "sent",
      channel: "chat",
      messageId: null,
      durationMs: Date.now() - started,
      requestId,
    });
    return { sent: true };
  } catch (error) {
    const described = describeError(error);
    logMail({
      kind: "failed",
      channel: "chat",
      errorCode: `webhook_failed:${described.errorCode}`,
      errorName: described.errorName,
      errorMessage: described.errorMessage,
      durationMs: Date.now() - started,
      requestId,
    });
    return { sent: false, errorCode: `webhook_failed:${described.errorCode}` };
  }
}
