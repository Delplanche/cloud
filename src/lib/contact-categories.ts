/** Client-safe categoriedefinities — gedeeld door formulier en server. */

export const CONTACT_CATEGORIES = ["infra", "design", "collab", "direct"] as const;

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ContactCategory, string> = {
  infra: "Infra & Cloud",
  design: "Design & UI",
  collab: "Samenwerking",
  direct: "Direct / Overig",
};

export const CATEGORY_ORDER: ContactCategory[] = ["infra", "design", "collab", "direct"];
