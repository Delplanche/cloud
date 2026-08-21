import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  SITE_URL,
  cloudPath,
  htmlLang,
  locales,
  localePath,
  slugs,
  type PageKey,
} from "@/i18n/config";
import { cloudTargets } from "@/i18n/cloud";

const pages = Object.keys(slugs) as PageKey[];

const priority: Partial<Record<PageKey, string>> = {
  home: "1.0",
  stack: "0.9",
  security: "0.9",
  onboarding: "0.8",
  faq: "0.8",
  gateway: "0.6",
  contact: "0.8",
  legal: "0.3",
  privacy: "0.3",
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = pages.flatMap((page) =>
          locales.map((locale) =>
            [
              `  <url>`,
              `    <loc>${SITE_URL}${localePath(locale, page)}</loc>`,
              ...locales.map(
                (alt) =>
                  `    <xhtml:link rel="alternate" hreflang="${htmlLang[alt]}" href="${SITE_URL}${localePath(alt, page)}"/>`,
              ),
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localePath("en", page)}"/>`,
              `    <changefreq>monthly</changefreq>`,
              `    <priority>${priority[page] ?? "0.5"}</priority>`,
              `  </url>`,
            ].join("\n"),
          ),
        );

        const cloudUrls = cloudTargets.flatMap((target) =>
          locales.map((locale) =>
            [
              `  <url>`,
              `    <loc>${SITE_URL}${cloudPath(locale, target)}</loc>`,
              ...locales.map(
                (alt) =>
                  `    <xhtml:link rel="alternate" hreflang="${htmlLang[alt]}" href="${SITE_URL}${cloudPath(alt, target)}"/>`,
              ),
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${cloudPath("en", target)}"/>`,
              `    <changefreq>monthly</changefreq>`,
              `    <priority>0.7</priority>`,
              `  </url>`,
            ].join("\n"),
          ),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          ...cloudUrls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
