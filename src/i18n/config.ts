export const locales = ["en", "nl", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  nl: "NL",
  fr: "FR",
};

export const htmlLang: Record<Locale, string> = {
  en: "en",
  nl: "nl",
  fr: "fr",
};

export type PageKey =
  | "home"
  | "stack"
  | "security"
  | "onboarding"
  | "faq"
  | "gateway"
  | "contact"
  | "legal"
  | "privacy";

/** Vertaalde URL-slugs per taal. Lege string = home van die taal. */
export const slugs: Record<PageKey, Record<Locale, string>> = {
  home: { en: "", nl: "", fr: "" },
  stack: { en: "stack", nl: "infrastructuur", fr: "infrastructure" },
  security: { en: "security", nl: "beveiliging", fr: "securite" },
  onboarding: { en: "onboarding", nl: "onboarding", fr: "integration" },
  faq: { en: "faq", nl: "faq", fr: "faq" },
  gateway: { en: "gateway", nl: "gateway", fr: "gateway" },
  contact: { en: "contact", nl: "contact", fr: "contact" },
  legal: { en: "legal", nl: "juridisch", fr: "mentions-legales" },
  privacy: { en: "privacy", nl: "privacy", fr: "confidentialite" },
};

export const SITE_URL = "https://delplanche.cloud";

/** Sociale bannerafbeelding per pagina en taal (1200x630, gegenereerd uit het echte logo). */
export function ogImageUrl(page: PageKey | "cloud", locale: Locale): string {
  return `${SITE_URL}/og/${page}-${locale}.jpg`;
}

/** og:image + twitter:image meta-tags voor één pagina. */
export function ogImageMeta(page: PageKey | "cloud", locale: Locale, alt: string) {
  const url = ogImageUrl(page, locale);
  return [
    { property: "og:image", content: url },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: url },
    { name: "twitter:image:alt", content: alt },
  ];
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/** Pad voor een pagina in een bepaalde taal, bv. /nl/beveiliging */
export function localePath(locale: Locale, page: PageKey): string {
  const slug = slugs[page][locale];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

/** Zoek de pagina die bij een slug hoort binnen een taal. */
export function pageFromSlug(locale: Locale, slug: string): PageKey | null {
  const entry = (Object.keys(slugs) as PageKey[]).find((key) => slugs[key][locale] === slug);
  return entry ?? null;
}

/** Zoek een pagina op basis van een slug in eender welke taal (voor legacy-redirects). */
export function pageFromAnySlug(slug: string): PageKey | null {
  const entry = (Object.keys(slugs) as PageKey[]).find((key) =>
    locales.some((l) => slugs[key][l] === slug),
  );
  return entry ?? null;
}

/** hreflang + canonical links voor de <head> van elke pagina. */
export function alternateLinks(locale: Locale, page: PageKey) {
  return [
    { rel: "canonical", href: `${SITE_URL}${localePath(locale, page)}` },
    ...locales.map((l) => ({
      rel: "alternate",
      hrefLang: htmlLang[l],
      href: `${SITE_URL}${localePath(l, page)}`,
    })),
    {
      rel: "alternate",
      hrefLang: "x-default",
      href: `${SITE_URL}${localePath(defaultLocale, page)}`,
    },
  ];
}

/** Pad voor een cloud-detailpagina, bv. /nl/cloud/hosting */
export function cloudPath(locale: Locale, target: string): string {
  return `/${locale}/cloud/${target}`;
}

/** hreflang + canonical voor de cloud-detailpagina's. */
export function cloudAlternateLinks(locale: Locale, target: string) {
  return [
    { rel: "canonical", href: `${SITE_URL}${cloudPath(locale, target)}` },
    ...locales.map((l) => ({
      rel: "alternate",
      hrefLang: htmlLang[l],
      href: `${SITE_URL}${cloudPath(l, target)}`,
    })),
    {
      rel: "alternate",
      hrefLang: "x-default",
      href: `${SITE_URL}${cloudPath(defaultLocale, target)}`,
    },
  ];
}

/** Beste taalmatch op basis van de browservoorkeur. */
export function detectLocale(candidates: readonly string[]): Locale {
  for (const raw of candidates) {
    const base = raw.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}
