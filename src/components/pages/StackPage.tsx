import { useLocale, type Dict } from "@/i18n";
import { getAnnotations } from "@/i18n/annotations";
import {
  Arrow,
  ComparisonTable,
  PageShellLite,
  SectionTitle,
  actionClass,
} from "@/components/site/Layout";
import { CloudLink } from "@/components/site/CloudLink";
import { Marginalia } from "@/components/site/Marginalia";

export function StackPage({ t }: { t: Dict }) {
  const p = t.stackPage;
  const notes = getAnnotations(useLocale());
  return (
    <PageShellLite index={p.index} title={p.title} lead={p.lead}>
      <section>
        <SectionTitle index={p.pillarsIndex} title={p.pillarsTitle} />
        <div className="mt-10 divide-y divide-gridline border-t border-gridline md:grid md:grid-cols-3 md:gap-10 md:divide-y-0 md:pt-10">
          {t.stacks.map((s, i) => (
            <div key={s.id} className="flex flex-col py-8 md:py-0">
              <span className="font-mono text-[10px] tracking-[0.22em] text-muted-ink">{s.id}</span>
              <h3 className="mt-4 text-xl leading-tight text-ebony">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-ink">{s.for}</p>
              <Marginalia rotate={i % 2 === 0 ? -1.4 : 1.2} className="mt-4">
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

      <section>
        <SectionTitle index={p.matrixIndex} title={p.matrixTitle} />
        <ComparisonTable columns={[p.colParam, p.colUs, p.colCh]} rows={p.matrix} />
      </section>

      <section>
        <SectionTitle index={p.hardwareIndex} title={p.hardwareTitle} />
        <dl className="mt-8 divide-y divide-gridline border-y border-gridline">
          {p.hardware.map(([k, v]) => (
            <div
              key={k}
              className="flex flex-col gap-1.5 py-4 md:flex-row md:items-baseline md:gap-10"
            >
              <dt className="w-56 shrink-0 font-mono text-[10px] tracking-[0.16em] text-muted-ink uppercase">
                {k}
              </dt>
              <dd className="text-sm leading-relaxed text-ebony">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </PageShellLite>
  );
}
