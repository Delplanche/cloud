import { Monitor, Network, Warehouse } from "lucide-react";
import { LocaleLink, useLocale, type Dict } from "@/i18n";
import { getAnnotations } from "@/i18n/annotations";
import {
  Arrow,
  Container,
  SectionTitle,
  actionClass,
  actionClassMuted,
} from "@/components/site/Layout";
import { CloudLink } from "@/components/site/CloudLink";
import { Marginalia } from "@/components/site/Marginalia";

const flowIcons = [Monitor, Network, Warehouse];

export function HomePage({ t }: { t: Dict }) {
  const notes = getAnnotations(useLocale());

  const scrollToStacks = () =>
    document.getElementById("stacks")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <Container className="pt-28 pb-24 md:pt-40 md:pb-32">
      {/* HERO */}
      <section>
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-ink uppercase">
          {t.home.badge}
        </span>
        <h1 className="mt-8 max-w-3xl text-[2.5rem] leading-[1.05] text-ebony md:text-7xl">
          {t.home.title}
        </h1>
        <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-ink">{t.home.lead}</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <button type="button" onClick={scrollToStacks} className={actionClass}>
            {t.home.ctaPrimary} <Arrow />
          </button>
          <LocaleLink page="stack" className={actionClass}>
            {t.home.ctaSecondary} <Arrow />
          </LocaleLink>
        </div>
      </section>

      {/* DATAFLOW — compacte tijdlijn */}
      <section className="mt-20 md:mt-32">
        <SectionTitle index={t.home.flowIndex} title={t.home.flowTitle} lead={t.home.flowLead} />
        <ol className="mt-10 grid gap-px overflow-hidden border border-gridline bg-gridline md:grid-cols-3">
          {t.home.flowNodes.map((node, i) => {
            const Icon = flowIcons[i] ?? Monitor;
            return (
              <li key={node[0]} className="bg-canvas p-7 md:p-8">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[9px] tracking-[0.22em] text-muted-ink uppercase">
                    {node[0]}
                  </span>
                  <Icon size={14} strokeWidth={1.2} className="text-muted-ink" />
                </div>
                <p className="mt-5 text-lg leading-tight text-ebony">{node[1]}</p>
                <p className="mt-1.5 font-mono text-[10px] tracking-[0.14em] text-muted-ink uppercase">
                  {node[2]}
                </p>
              </li>
            );
          })}
        </ol>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <p className="font-mono text-[9.5px] tracking-[0.16em] text-muted-ink uppercase">
            {t.home.flowFooter}
          </p>
          <Marginalia rotate={-1} className="mt-1 ml-1 sm:mt-0 sm:ml-0 sm:text-right">
            {notes.flow}
          </Marginalia>
        </div>
      </section>

      {/* STACKS */}
      <section id="stacks" className="mt-20 scroll-mt-24 md:mt-32">
        <SectionTitle
          index={t.home.stacksIndex}
          title={t.home.stacksTitle}
          lead={t.home.stacksLead}
        />
        <div className="mt-10 divide-y divide-gridline border-t border-gridline md:grid md:grid-cols-3 md:gap-10 md:divide-y-0 md:border-t md:pt-10">
          {t.stacks.map((s, i) => (
            <div key={s.id} className="flex flex-col py-8 md:py-0">
              <span className="font-mono text-[10px] tracking-[0.22em] text-muted-ink">{s.id}</span>
              <h3 className="mt-4 text-xl leading-tight text-ebony md:text-2xl">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-ink">{s.for}</p>
              <Marginalia rotate={i % 2 === 0 ? -1.4 : 1.2} className="mt-5 ml-1 sm:ml-5">
                {notes.stacks[i] ?? notes.hosting}
              </Marginalia>
              <ul className="mt-5 space-y-2">
                {s.specs.map((spec) => (
                  <li key={spec} className="font-mono text-[11px] leading-relaxed text-muted-ink">
                    {spec}
                  </li>
                ))}
              </ul>
              <div className="grow" />
              <CloudLink target={s.target} className={`${actionClass} mt-7 w-full md:w-auto`}>
                {s.cta} <Arrow />
              </CloudLink>
            </div>
          ))}
        </div>
      </section>

      {/* PROTOCOL */}
      <section className="mt-20 md:mt-32">
        <SectionTitle
          index={t.home.protocolIndex}
          title={t.home.protocolTitle}
          lead={t.home.protocolLead}
        />
        <ol className="mt-10 divide-y divide-gridline border-y border-gridline">
          {t.steps.map(([id, title, body]) => (
            <li key={id} className="flex flex-col gap-2 py-6 md:flex-row md:gap-10">
              <span className="w-16 shrink-0 font-mono text-[10px] tracking-[0.22em] text-muted-ink">
                {id}
              </span>
              <div>
                <h3 className="text-lg text-ebony">{title}</h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-ink">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-9 flex flex-wrap items-center gap-6">
          <LocaleLink page="onboarding" className={actionClass}>
            {t.home.protocolCta} <Arrow />
          </LocaleLink>
          <LocaleLink page="stack" className={actionClassMuted}>
            {t.home.specsLink}
          </LocaleLink>
        </div>
      </section>
    </Container>
  );
}
