import { createFileRoute } from "@tanstack/react-router";
import { AFFILIATE_LINKS, isAffiliateKey } from "@/lib/affiliate";

/**
 * /go/<key> is een pure 302-redirect naar de geautoriseerde Infomaniak-link.
 * Onbekende sleutels gaan naar de Infomaniak-homepagina.
 */
export const Route = createFileRoute("/go/$target")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const key = params.target.toLowerCase();
        const destination = isAffiliateKey(key) ? AFFILIATE_LINKS[key] : AFFILIATE_LINKS.home;

        // Stateless: geen klik-opslag, enkel een systeem-event in de logs.
        console.log(`[system] affiliate_redirect key=${key}`);



        return new Response(null, {
          status: 302,
          headers: {
            Location: destination,
            "Cache-Control": "no-store",
            "Referrer-Policy": "no-referrer-when-downgrade",
            "X-Robots-Tag": "noindex, nofollow",
          },
        });
      },
    },
  },
  component: GoRedirect,
});

function GoRedirect() {
  const { target } = Route.useParams();
  const key = target.toLowerCase();
  const destination = isAffiliateKey(key) ? AFFILIATE_LINKS[key] : AFFILIATE_LINKS.home;

  if (typeof window !== "undefined") {
    window.location.replace(destination);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-40 text-center">
      <p className="font-mono text-[10px] tracking-[0.14em] text-muted-ink uppercase md:tracking-[0.16em]">
        Redirecting to Infomaniak…
      </p>
      <a
        href={destination}
        rel="noopener noreferrer nofollow sponsored"
        className="mt-6 inline-block font-mono text-[12px] text-ebony underline underline-offset-4"
      >
        {destination}
      </a>
    </div>
  );
}
