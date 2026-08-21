/**
 * Typeveilige, gestructureerde logging voor de mailketen.
 *
 * Elke regel is één JSON-object met het prefix `[mail]`, zodat de Vercel-logs
 * doorzoekbaar zijn op channel, uitkomst en Message-ID. Er wordt bewust nooit
 * berichtinhoud of een credential gelogd — enkel metadata.
 */

export type MailChannel = "desk" | "receipt" | "chat" | "diagnostic";

export type MailLogEvent =
  | {
      kind: "sent";
      channel: MailChannel;
      messageId: string | null;
      durationMs: number;
      requestId: string;
      accepted?: number;
      rejected?: number;
    }
  | {
      kind: "failed";
      channel: MailChannel;
      errorCode: string;
      errorName: string;
      errorMessage: string;
      durationMs: number;
      requestId: string;
    }
  | {
      kind: "skipped";
      channel: MailChannel;
      reason: "not_configured" | "dev_mock" | "idempotent_replay" | "spam_detected";
      requestId: string;
    };

export function logMail(event: MailLogEvent): void {
  const line = `[mail] ${JSON.stringify({ ts: new Date().toISOString(), ...event })}`;
  if (event.kind === "failed") console.error(line);
  else console.log(line);
}

export function newRequestId(): string {
  return `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** Normaliseert een onbekende fout tot loggable, typeveilige velden. */
export function describeError(error: unknown): {
  errorName: string;
  errorMessage: string;
  errorCode: string;
} {
  if (error instanceof Error) {
    const code = (error as Error & { code?: string }).code;
    return {
      errorName: error.name,
      errorMessage: error.message.slice(0, 300),
      errorCode: code ?? error.name,
    };
  }
  return {
    errorName: "unknown_error",
    errorMessage: String(error).slice(0, 300),
    errorCode: "unknown_error",
  };
}
