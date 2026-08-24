/** Client-safe categoriedefinities — gedeeld door formulier en server. */

export const CONTACT_CATEGORIES = ["infra", "design", "collab", "direct"] as const;

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ContactCategory, string> = {
  infra: "Infra & Cloud",
  design: "Design & UI",
  collab: "Samenwerking",
  direct: "Direct / Overig",
};

/** Gelokaliseerde labels voor het formulier; de desk-mail blijft NL. */
export const CATEGORY_LABELS_BY_LOCALE: Record<string, Record<ContactCategory, string>> = {
  nl: CATEGORY_LABELS,
  en: {
    infra: "Infra & Cloud",
    design: "Design & UI",
    collab: "Collaboration",
    direct: "Direct / Other",
  },
  fr: {
    infra: "Infra & Cloud",
    design: "Design & UI",
    collab: "Collaboration",
    direct: "Direct / Autre",
  },
};

export function categoryLabel(category: ContactCategory, locale: string): string {
  return (CATEGORY_LABELS_BY_LOCALE[locale] ?? CATEGORY_LABELS)[category];
}

export const CATEGORY_ORDER: ContactCategory[] = ["infra", "design", "collab", "direct"];

/** Korte, mensvriendelijke referentie afgeleid van de idempotency-sleutel. */
export function referenceFromKey(key: string): string {
  const clean = key.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return `DPC-${(clean || "000000").slice(0, 6).padEnd(6, "0")}`;
}
