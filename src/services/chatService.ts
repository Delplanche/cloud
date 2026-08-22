/**
 * Service-laag voor de kChat-webhook. Enkel fetch — geen platform-SDK's.
 */

import { sendChatNotification, type ChatPayload } from "@/lib/kchat.server";

export async function notifyChat(payload: ChatPayload) {
  return sendChatNotification(payload);
}

/**
 * Gezondheidscheck: valideert dat de webhook-URL geconfigureerd is en een
 * geldige https-endpoint vormt. Er wordt bewust geen testbericht gepost.
 */
export function checkChatWebhook(): { ok: boolean; configured: boolean; reason?: string } {
  const url = process.env["KCHAT_WEBHOOK_URL"];
  if (!url) return { ok: false, configured: false, reason: "not_configured" };
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return { ok: false, configured: true, reason: "insecure_protocol" };
    }
    return { ok: true, configured: true };
  } catch {
    return { ok: false, configured: true, reason: "invalid_url" };
  }
}
