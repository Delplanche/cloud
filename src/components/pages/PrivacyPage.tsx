import type { Dict } from "@/i18n";
import { PageShellLite, SectionTitle } from "@/components/site/Layout";

export function PrivacyPage({ t }: { t: Dict }) {
  const p = t.privacyPage;
  return (
    <PageShellLite index={p.index} title={p.title} lead={p.lead}>
      <section>
        <SectionTitle index={p.policyIndex} title={p.policyTitle} />
        <dl className="mt-8 divide-y divide-gridline border-y border-gridline">
          {p.points.map(([k, v]) => (
            <div
              key={k}
              className="flex flex-col gap-1.5 py-4 md:flex-row md:items-baseline md:gap-10 md:py-5"
            >
              <dt className="w-56 shrink-0 font-mono text-[10px] tracking-[0.16em] text-ebony uppercase">
                {k}
              </dt>
              <dd className="text-sm leading-relaxed text-muted-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section>
        <SectionTitle index={p.disclosureIndex} title={p.disclosureTitle} />
        <blockquote className="mt-8 border-l border-gridline-strong pl-6 text-sm leading-relaxed text-ebony">
          {p.disclosureQuote}
        </blockquote>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-ink">{p.disclosureBody}</p>
      </section>
    </PageShellLite>
  );
}
