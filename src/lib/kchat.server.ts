/**
 * kChat-notificatie via de inkomende webhook.
 * De webhook-URL komt uitsluitend uit process.env (KCHAT_WEBHOOK_URL).
 */

export type ChatPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
};

function sanitize(value: string) {
  return value
    .replace(/[<>]/g, "")
    .replace(/([\\`*_[\]{}()#+.!|>~-])/g, "\\$1")
    .replace(/@/g, "@\u200B");
}

export async function sendChatNotification(
  data: ChatPayload,
): Promise<{ sent: boolean; errorCode?: string }> {
  const webhook = process.env["KCHAT_WEBHOOK_URL"];
  if (!webhook) {
    console.error("[system] webhook_not_configured");
    return { sent: false, errorCode: "webhook_not_configured" };
  }

  const text = [
    `**Nieuw contactbericht — delplanche.cloud (${data.locale.toUpperCase()})**`,
    `**Naam:** ${sanitize(data.name)}`,
    `**E-mail:** ${sanitize(data.email)}`,
    `**Onderwerp:** ${sanitize(data.subject)}`,
    "",
    sanitize(data.message),
  ].join("\n");

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      console.error(`[system] webhook_failed status=${res.status}`);
      return { sent: false, errorCode: `webhook_failed:${res.status}` };
    }
    console.log("[system] webhook_connected");
    return { sent: true };
  } catch (error) {
    const code = error instanceof Error ? error.name : "unknown_error";
    console.error(`[system] webhook_failed code=${code}`);
    return { sent: false, errorCode: `webhook_failed:${code}` };
  }
}
