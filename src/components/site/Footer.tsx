import { BrandMark } from "@/components/site/TopNav";
import { CopyAction } from "@/components/site/CopyAction";
import { LocaleLink, useDict, useLocale } from "@/i18n";
import { getExtraDict } from "@/i18n/extra";
import type { PageKey } from "@/i18n/config";
import { Arrow, actionClass } from "@/components/site/Layout";

type Item = { label: string; page?: PageKey; href?: string };

/** Technische kanalen — strikt monospace metadata, geen social icons. */
const CHANNELS: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}[] = [
  {
    label: "GITHUB",
    value: "delplanche",
    href: "https://github.com/delplanche",
    external: true,
  },
  {
    label: "REPOSITORIES",
    value: "delplanche/cloud",
    href: "https://github.com/delplanche/cloud",
    external: true,
  },
  {
    label: "MATRIX",
    value: "@jona:delplanche.cloud",
    href: "https://matrix.to/#/@jona:delplanche.cloud",
    external: true,
  },
  { label: "PGP KEY", value: "9F3C 21A7 D4B8 6E05", href: "/pgp.asc" },
];

export function Footer() {
  const t = useDict();
  const locale = useLocale();

  const columns: { title: string; items: Item[] }[] = [
    {
      title: t.footer.infrastructure,
      items: [
        { label: t.stacks[0]!.title, page: "stack" },
        { label: t.stacks[1]!.title, page: "stack" },
        { label: t.stacks[2]!.title, page: "stack" },
      ],
    },
    {
      title: t.footer.law,
      items: [
        { label: t.nav.security.replace(/^\d+\s/, ""), page: "security" },
        { label: t.privacyPage.title, page: "privacy" },
        { label: t.legalPage.title, page: "legal" },
      ],
    },
    {
      title: t.footer.vectors,
      items: [
        { label: t.onboardingPage.title, page: "onboarding" },
        { label: getExtraDict(locale).faq.title, page: "faq" },
        { label: getExtraDict(locale).gateway.title, page: "gateway" },
        { label: t.contactPage.title, page: "contact" },
      ],
    },
  ];

  const linkClass =
    "group flex min-h-11 items-center justify-between gap-3 font-mono text-[10px] tracking-[0.16em] text-muted-ink uppercase transition-colors hover:text-ebony focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-moss";

  const microLabel = "font-mono text-[9px] tracking-[0.2em] text-muted-ink uppercase";

  return (
    <footer className="border-t border-gridline">
      <div className="dossier-gutter mx-auto w-full max-w-6xl py-4 md:py-5">
        {/* Architectonisch titelblok — één technisch raster, scherpe hoeken */}
        <section
          data-testid="footer-titleblock"
          className="divide-y divide-gridline border border-gridline"
        >
          {/* Rij 1: identiteit + navigatiekolommen */}
          <div className="grid gap-3 p-3 sm:p-4 md:grid-cols-[1fr_1.7fr] md:gap-6">
            <div>
              <BrandMark className="font-mono text-[12px] font-medium tracking-[0.16em] text-ebony" />
              <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-muted-ink">
                {t.footer.tagline}
              </p>
              <div
                data-testid="footer-actions"
                className="relative mt-3 flex flex-col items-start gap-4"
              >
                <CopyAction value="core@delplanche.cloud" label="core@delplanche.cloud" />
                <LocaleLink page="contact" className={actionClass}>
                  {t.footer.contactCta} <Arrow />
                </LocaleLink>
              </div>
            </div>

            {/* Desktop kolommen */}
            <div className="hidden gap-5 sm:grid sm:grid-cols-3">
              {columns.map((col) => (
                <div key={col.title} className="flex flex-col gap-1">
                  <span className="mb-1 font-mono text-[9px] font-semibold tracking-[0.2em] text-ebony uppercase">
                    {col.title}
                  </span>
                  {col.items.map((item) => (
                    <LocaleLink key={item.label} page={item.page ?? "home"} className={linkClass}>
                      {item.label}
                    </LocaleLink>
                  ))}
                </div>
              ))}
            </div>

            {/* Mobiel: accordeons */}
            <div className="divide-y divide-gridline border-t border-gridline sm:hidden">
              {columns.map((col) => (
                <details key={col.title} className="group">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-mono text-[10px] font-semibold tracking-[0.2em] text-ebony uppercase">
                    {col.title}
                    <span className="text-muted-ink transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="flex flex-col pb-1">
                    {col.items.map((item) => (
                      <LocaleLink key={item.label} page={item.page ?? "home"} className={linkClass}>
                        {item.label}
                      </LocaleLink>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Rij 2: vector-microgrid — compacte label/waarde-rijen */}
          <div
            data-testid="footer-channels"
            className="grid grid-cols-1 divide-y divide-gridline sm:grid-cols-2 sm:divide-y-0 md:grid-cols-4 sm:[&>a]:border-b sm:[&>a]:border-gridline sm:[&>a:nth-child(n+3)]:border-b-0 md:[&>a]:border-b-0 sm:divide-x sm:divide-gridline"
          >
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                {...(c.external
                  ? {
                      target: "_blank",
                      rel: "noopener noreferrer",
                      "aria-label": `${c.label}: ${c.value} (opens in a new tab)`,
                    }
                  : { "aria-label": `${c.label}: ${c.value}` })}
                className="group flex min-h-11 items-center justify-between gap-3 px-3 py-2 transition-colors hover:bg-ebony/[0.03] focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-moss sm:px-4"
              >
                <span className={microLabel}>{c.label}</span>
                <span className="flex items-baseline gap-2">
                  <span className="font-mono text-[11px] tracking-[0.04em] text-ebony">
                    {c.value}
                  </span>
                  {c.external ? (
                    <span
                      aria-hidden="true"
                      className="font-mono text-[10px] text-muted-ink transition-colors group-hover:text-terracotta"
                    >
                      ↗
                    </span>
                  ) : null}
                </span>
              </a>
            ))}
          </div>

          {/* Rij 3: één ultracompacte technische signatuurregel */}
          <div className="px-3 py-2 sm:px-4">
            <p
              data-testid="footer-colophon"
              className="font-mono text-[9px] leading-[1.55] tracking-[0.05em] text-muted-ink"
            >
              © 2026 delplanche.cloud // 100% hydro Swiss infrastructure //{" "}
              <LocaleLink
                page="legal"
                className="underline underline-offset-2 transition-colors hover:text-ebony focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-moss"
              >
                Impressum: J.Z.D., Brussels (BE)
              </LocaleLink>
            </p>
          </div>
        </section>
      </div>
    </footer>
  );
}
