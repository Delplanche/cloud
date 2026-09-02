import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  SITE_URL,
  defaultLocale,
  detectLocale,
  localeLabels,
  localePath,
  locales,
  ogImageMeta,
} from "@/i18n/config";
import { getDict } from "@/i18n";
import { Container } from "@/components/site/Layout";

export const Route = createFileRoute("/")({
  head: () => {
    const meta = getDict(defaultLocale).meta.home;
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
        { property: "og:url", content: `${SITE_URL}${localePath(defaultLocale, "home")}` },
        { name: "twitter:title", content: meta.title },
        { name: "twitter:description", content: meta.description },
        ...ogImageMeta("home", defaultLocale, meta.title),
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}${localePath(defaultLocale, "home")}` },
        ...locales.map((l) => ({
          rel: "alternate",
          hrefLang: l,
          href: `${SITE_URL}${localePath(l, "home")}`,
        })),
        {
          rel: "alternate",
          hrefLang: "x-default",
          href: `${SITE_URL}${localePath(defaultLocale, "home")}`,
        },
      ],
    };
  },
  component: LocaleGate,
});

/** Detecteert de browsertaal en stuurt door naar /en, /nl of /fr. */
function LocaleGate() {
  const router = useRouter();

  useEffect(() => {
    const locale = detectLocale(navigator.languages ?? [navigator.language]);
    router.navigate({ href: localePath(locale, "home"), replace: true });
  }, [router]);

  return (
    <Container className="flex min-h-screen items-center pt-28 pb-24">
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-muted-ink uppercase">
          Detecting language…
        </p>
        <nav className="mt-6 flex gap-6">
          {locales.map((l) => (
            <a
              key={l}
              href={localePath(l, "home")}
              className="font-mono text-[12px] tracking-[0.18em] text-ebony uppercase hover:text-moss"
            >
              {localeLabels[l]}
            </a>
          ))}
        </nav>
      </div>
    </Container>
  );
}
