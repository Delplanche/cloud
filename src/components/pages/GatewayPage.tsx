import { Link } from "@tanstack/react-router";
import { Arrow, PageShellLite, SectionTitle, actionClass } from "@/components/site/Layout";
import { getExtraDict } from "@/i18n/extra";
import { slugs, type Locale } from "@/i18n/config";

export function GatewayPage({ locale }: { locale: Locale }) {
  const p = getExtraDict(locale).gateway;
  const internalSlug = (i: number) => (i === 2 ? slugs.faq[locale] : slugs.contact[locale]);

  return (
    <PageShellLite index={p.index} title={p.title} lead={p.lead}>
      <section>
        <SectionTitle index={p.hubIndex} title={p.hubTitle} lead={p.hubLead} />
        <div className="mt-10 divide-y divide-gridline border-t border-gridline md:grid md:grid-cols-2 md:gap-x-12 md:divide-y-0">
          {p.links.map((node, i) => (
            <article key={node.code} className="flex flex-col py-7 md:py-9">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] tracking-[0.22em] text-muted-ink">
                  {node.code}
                </span>
                <span className="font-mono text-[9px] tracking-[0.18em] text-moss uppercase">
                  {node.status}
                </span>
              </div>
              <h3 className="mt-4 text-lg leading-tight text-ebony md:text-xl">{node.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-ink">{node.body}</p>
              <div className="grow" />
              {node.external ? (
                <a
                  href={node.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className={`${actionClass} mt-7 w-full`}
                >
                  {node.label} <Arrow />
                </a>
              ) : (
                <Link
                  to="/$lang/$slug"
                  params={{ lang: locale, slug: internalSlug(i) }}
                  className={`${actionClass} mt-7 w-full`}
                >
                  {node.label} <Arrow />
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle index={p.noteIndex} title={p.noteTitle} />
        <div className="mt-8 border-y border-gridline py-7 md:py-9">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-ink">{p.note}</p>
          <Link
            to="/$lang/$slug"
            params={{ lang: locale, slug: slugs.contact[locale] }}
            className={`${actionClass} mt-7 w-full sm:w-auto`}
          >
            {p.contactLabel} <Arrow />
          </Link>
        </div>
      </section>
    </PageShellLite>
  );
}
