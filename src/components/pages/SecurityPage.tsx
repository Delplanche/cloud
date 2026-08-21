import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { ComparisonTable, PageShellLite, SectionTitle, StatusLine } from "@/components/site/Layout";
import { DossierDownload } from "@/components/site/DossierDownload";
import { DataflowSchema } from "@/components/site/DataflowSchema";

export function SecurityPage({ t, locale }: { t: Dict; locale: Locale }) {
  const p = t.securityPage;
  return (
    <PageShellLite index={p.index} title={p.title} lead={p.lead}>
      <section className="divide-y divide-gridline border-y border-gridline md:grid md:grid-cols-2 md:gap-12 md:divide-y-0 md:py-2">
        {p.pillars.map(([title, body]) => (
          <div key={title} className="py-7">
            <h2 className="font-mono text-[10px] tracking-[0.16em] text-ebony uppercase">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-ink">{body}</p>
          </div>
        ))}
      </section>

      <DataflowSchema locale={locale} />

      <section>
        <SectionTitle index={p.matrixIndex} title={p.matrixTitle} lead={p.matrixLead} />
        <ComparisonTable columns={[p.colParam, p.colUs, p.colCh]} rows={p.matrix} />
      </section>

      <section>
        <SectionTitle index={p.isoIndex} title={p.isoTitle} />
        <dl className="mt-8 divide-y divide-gridline border-y border-gridline">
          {p.iso.map(([k, v]) => (
            <div
              key={k}
              className="flex flex-col gap-1.5 py-4 md:flex-row md:items-baseline md:gap-10 md:py-5"
            >
              <dt className="w-40 shrink-0 font-mono text-[11px] tracking-[0.14em] text-ebony">
                {k}
              </dt>
              <dd className="text-sm leading-relaxed text-muted-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <SectionTitle index={p.encryptionIndex} title={p.encryptionTitle} lead={p.encryptionLead} />
        <dl className="mt-8 divide-y divide-gridline border-y border-gridline">
          {p.encryption.map(([k, v]) => (
            <div
              key={k}
              className="flex flex-col gap-1.5 py-4 md:flex-row md:items-baseline md:gap-10 md:py-5"
            >
              <dt className="w-40 shrink-0 font-mono text-[11px] tracking-[0.14em] text-ebony">
                {k}
              </dt>
              <dd className="text-sm leading-relaxed text-muted-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <StatusLine className="mt-6" label={p.encryptionStatus} />
      </section>

      <section>
        <SectionTitle index={p.exportIndex} title={p.exportTitle} />
        <div className="mt-8">
          <DossierDownload label={p.exportLabel} />
        </div>
      </section>
    </PageShellLite>
  );
}
