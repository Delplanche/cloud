/**
 * Table-based HTML e-mailtemplates in de editorial/biophilic huisstijl:
 * warm linnen canvas, zachte afgeronde hoeken, serif koppen, mono metadata.
 */

const CANVAS = "#F5F3EF";
const CARD = "#FBFAF7";
const INK = "#1C1D1F";
const MUTED = "#6B6A65";
const MOSS = "#2A4736";
const LINE = "#E2DFD8";

import { CATEGORY_LABELS, type ContactCategory } from "./submissions.server";

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string) {
  return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid ${LINE};font-family:${MONO};font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:${MUTED};width:38%;vertical-align:top;">${esc(label)}</td>
        <td style="padding:14px 0;border-bottom:1px solid ${LINE};font-family:${SANS};font-size:14px;line-height:1.7;color:${INK};">${esc(value)}</td>
      </tr>`;
}

export function shell(opts: {
  eyebrow: string;
  banner?: string;
  title: string;
  intro: string;
  rows: [string, string][];
  body?: { label: string; content: string };
  footer: string;
}) {
  const rowsHtml = opts.rows.map(([l, v]) => row(l, v)).join("");
  const bodyHtml = opts.body
    ? `
        <tr><td style="padding-top:28px;">
          <div style="font-family:${MONO};font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${MUTED};">${esc(opts.body.label)}</div>
          <div style="margin-top:12px;padding:18px 20px;border:1px solid ${LINE};border-radius:18px;background:${CANVAS};font-family:${SANS};font-size:14px;line-height:1.75;color:${INK};white-space:pre-wrap;">${esc(opts.body.content)}</div>
        </td></tr>`
    : "";

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${CANVAS};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CANVAS};padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${CARD};border:1px solid ${LINE};border-radius:24px;overflow:hidden;">
        <tr><td style="padding:34px 34px 0 34px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="width:34px;height:34px;background:${INK};border-radius:10px;text-align:center;vertical-align:middle;font-family:${SERIF};font-size:17px;line-height:34px;color:${CANVAS};">D</td>
            <td style="padding-left:12px;font-family:${MONO};font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:${MUTED};">delplanche.cloud</td>
          </tr></table>
          ${
            opts.banner
              ? `<div style="margin-top:22px;display:inline-block;padding:7px 14px;border:1px solid ${LINE};border-radius:999px;background:${CANVAS};font-family:${MONO};font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${MOSS};">${esc(opts.banner)}</div>`
              : ""
          }
          <div style="margin-top:24px;font-family:${MONO};font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:${MUTED};">${esc(opts.eyebrow)}</div>
          <h1 style="margin:16px 0 0 0;font-family:${SERIF};font-weight:400;font-size:28px;line-height:1.15;color:${INK};">${esc(opts.title)}</h1>
          <div style="height:2px;width:120px;margin-top:14px;background:${MOSS};opacity:.28;border-radius:999px;"></div>
          <p style="margin:20px 0 0 0;font-family:${SANS};font-size:14px;line-height:1.75;color:${MUTED};">${esc(opts.intro)}</p>
        </td></tr>

        <tr><td style="padding:26px 34px 0 34px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table>
        </td></tr>
        ${bodyHtml ? `<tr><td style="padding:0 34px;"><table role="presentation" width="100%">${bodyHtml}</table></td></tr>` : ""}
        <tr><td style="padding:30px 34px 34px 34px;">
          <div style="border-top:1px solid ${LINE};padding-top:18px;font-family:${MONO};font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:${MUTED};">${esc(opts.footer)}</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function contactEmail(data: {
  category: ContactCategory;
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
}) {
  const label = CATEGORY_LABELS[data.category];
  const rows: [string, string][] = [
    ["Categorie", label],
    ["Naam", data.name],
    ["E-mail", data.email],
    ["Onderwerp", data.subject],
    ["Taal", data.locale.toUpperCase()],
    ["Ontvangen", new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC"],
  ];

  return {
    subject: `[Inzending - ${label}] ${data.name}`,
    html: shell({
      eyebrow: "Contactformulier / delplanche.cloud",
      banner: label,
      title: "Nieuw bericht ontvangen",
      intro: "Een bezoeker heeft het beveiligde contactformulier ingevuld.",
      rows,
      body: { label: "Bericht", content: data.message },
      footer: "delplanche.cloud — sovereign swiss stack",
    }),
    text: [
      `Nieuw contactbericht [${label}] — delplanche.cloud`,
      ...rows.map(([l, v]) => `${l}: ${v}`),
      "",
      data.message,
    ].join("\n"),
  };
}


const RECEIPT_COPY = {
  en: {
    eyebrow: "Receipt / delplanche.cloud",
    title: "Thank you — your message is logged",
    intro:
      "Your message reached the infrastructure desk. A human reads it; you can expect a reply within one working day.",
    rows: { name: "Name", subject: "Subject", received: "Received" },
    body: "Your message",
    footer: "delplanche.cloud — no tracking pixels, no profiling",
  },
  nl: {
    eyebrow: "Ontvangstbevestiging / delplanche.cloud",
    title: "Bedankt — uw bericht is geregistreerd",
    intro:
      "Uw bericht bereikte de infrastructuurdesk. Een mens leest het; u mag een antwoord verwachten binnen één werkdag.",
    rows: { name: "Naam", subject: "Onderwerp", received: "Ontvangen" },
    body: "Uw bericht",
    footer: "delplanche.cloud — geen trackingpixels, geen profilering",
  },
  fr: {
    eyebrow: "Accusé de réception / delplanche.cloud",
    title: "Merci — votre message est enregistré",
    intro:
      "Votre message est arrivé au bureau d'infrastructure. Un humain le lit ; réponse sous un jour ouvrable.",
    rows: { name: "Nom", subject: "Objet", received: "Reçu" },
    body: "Votre message",
    footer: "delplanche.cloud — aucun pixel de suivi, aucun profilage",
  },
} as const;

/** Auto-responder naar de indiener: bevestiging met samenvatting van de inzending. */
export function contactReceiptEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
}) {
  const copy =
    RECEIPT_COPY[
      (data.locale as keyof typeof RECEIPT_COPY) in RECEIPT_COPY
        ? (data.locale as keyof typeof RECEIPT_COPY)
        : "en"
    ];
  const received = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
  const rows: [string, string][] = [
    [copy.rows.name, data.name],
    [copy.rows.subject, data.subject],
    [copy.rows.received, received],
  ];

  return {
    subject: `${copy.title} — delplanche.cloud`,
    html: shell({
      eyebrow: copy.eyebrow,
      title: copy.title,
      intro: copy.intro,
      rows,
      body: { label: copy.body, content: data.message },
      footer: copy.footer,
    }),
    text: [copy.title, "", ...rows.map(([l, v]) => `${l}: ${v}`), "", data.message].join("\n"),
  };
}

export function infraRequestEmail(data: {
  ticket: string;
  org: string;
  domain: string;
  stack: string;
  account: string;
  email: string;
  notes?: string | undefined;
  locale: string;
}) {
  const rows: [string, string][] = [
    ["Ticket", data.ticket],
    ["Organisatie", data.org],
    ["Domein", data.domain],
    ["Stack", data.stack],
    ["Account", data.account],
    ["E-mail", data.email],
    ["Taal", data.locale.toUpperCase()],
  ];

  return {
    subject: `[delplanche.cloud] Infra-aanvraag ${data.ticket}`,
    html: shell({
      eyebrow: "Onboarding / delplanche.cloud",
      title: "Nieuwe infrastructuuraanvraag",
      intro: "Een nieuwe onboarding-aanvraag staat in de wachtrij.",
      rows,
      ...(data.notes ? { body: { label: "Notities", content: data.notes } } : {}),
      footer: "delplanche.cloud — sovereign swiss stack",
    }),
    text: [
      "Nieuwe infra-aanvraag — delplanche.cloud",
      ...rows.map(([l, v]) => `${l}: ${v}`),
      ...(data.notes ? ["", data.notes] : []),
    ].join("\n"),
  };
}
