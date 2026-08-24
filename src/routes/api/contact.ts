import { createFileRoute } from "@tanstack/react-router";

/**
 * Alias voor /api/public/contact — zelfde stateless intake, zodat externe
 * integraties of oudere formulieren op /api/contact blijven werken.
 */
export const runtime = "nodejs";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleContactRequest } = await import("@/lib/contact-intake.server");
        return handleContactRequest(request);
      },
    },
  },
});
