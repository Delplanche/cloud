import type { Locale } from "./config";

/**
 * Terracotta marginalia — handgeschreven annotatielaag ("Architectural Field Dossier").
 * Bewust kort: het zijn kanttekeningen, geen copy.
 */
export type Annotations = {
  /** Notitie per stack-pijler, in dezelfde volgorde als t.stacks. */
  stacks: [string, string, string];
  /** Notitie bij de infrastructuur / hosting. */
  hosting: string;
  /** Notitie bij de dataflow-tijdlijn. */
  flow: string;
  /** Transparant stewardship, volledige verklaring in de voeter. */
  stewardship: string;
};

const en: Annotations = {
  stacks: [
    "// 100% GDPR-compliant. No US Cloud Act risk",
    "// Our fixed choice",
    "// Reviewed by hand before delivery",
  ],
  hosting: "// Our fixed choice — Swiss, hydroelectric",
  flow: "// Data never leaves Switzerland",
  stewardship:
    "Stewardship — providers tested and approved by Delplanche. Authorised links support this ecosystem at no extra cost.",
};

const nl: Annotations = {
  stacks: [
    "// 100% GDPR-compliant. Geen US Cloud Act-risico",
    "// Onze vaste keuze",
    "// Handmatig nagekeken voor oplevering",
  ],
  hosting: "// Onze vaste keuze — Zwitsers, waterkracht",
  flow: "// Data verlaat Zwitserland nooit",
  stewardship:
    "Stewardship — alle providers zijn door Delplanche getest en goedgekeurd. Geautoriseerde links steunen dit ecosysteem, zonder extra kosten.",
};

const fr: Annotations = {
  stacks: [
    "// 100% conforme au RGPD. Aucun risque US Cloud Act",
    "// Notre choix constant",
    "// Vérifiée à la main avant livraison",
  ],
  hosting: "// Notre choix constant — suisse, hydroélectrique",
  flow: "// Les données ne quittent jamais la Suisse",
  stewardship:
    "Stewardship — fournisseurs testés et approuvés par Delplanche. Les liens autorisés soutiennent cet écosystème, sans frais.",
};

const dicts: Record<Locale, Annotations> = { en, nl, fr };

export function getAnnotations(locale: Locale): Annotations {
  return dicts[locale];
}
