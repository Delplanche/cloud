import type { Dict } from "@/i18n";
import { PageShellLite } from "@/components/site/Layout";

export function LegalPage({ t }: { t: Dict }) {
  const p = t.legalPage;
  return (
    <PageShellLite index={p.index} title={p.title} lead={p.lead}>
      {/* Metadata: dunne rasterlijnen, geen kaders */}
      <section data-testid="legal-identity">
        <dl className="divide-y divide-gridline border-y border-gridline">
          {p.rows.map(([k, v]) => (
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

      {/* Editorial blueprint: index-kolom links, tekstkolom rechts */}
      <section data-testid="legal-disclosures" className="border-t border-gridline">
        <div className="divide-y divide-gridline">
          {p.sections.map((s) => (
            <article
              key={s.index}
              className="grid gap-3 py-8 md:grid-cols-[14rem_1fr] md:gap-10 md:py-10"
            >
              <header className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-[0.16em] text-muted-ink uppercase">
                  {s.index}
                </span>
                <h2 className="text-base leading-snug text-ebony md:text-lg">{s.title}</h2>
              </header>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-ink">{s.body}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShellLite>
  );
}
