import { useRef, useState } from "react";
import { SectionTitle } from "@/components/site/Layout";
import { Marginalia } from "@/components/site/Marginalia";
import { getExtraDict } from "@/i18n/extra";
import { getAnnotations } from "@/i18n/annotations";
import type { Locale } from "@/i18n/config";

/** Technisch blueprint-schema van het soevereine datapad — open, kaartloos raster. */
export function DataflowSchema({ locale }: { locale: Locale }) {
  const p = getExtraDict(locale).flow;
  const notes = getAnnotations(locale);
  const [active, setActive] = useState(0);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const select = (i: number) => {
    setActive(i);
    requestAnimationFrame(() => {
      detailRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const renderDetail = (i: number) => {
    const step = p.steps[i]!;
    return (
      <>
        <p className="font-mono text-[10px] tracking-[0.2em] text-muted-ink uppercase">
          {step.code} // {step.place}
        </p>
        <dl className="mt-4 divide-y divide-gridline border-y border-gridline">
          {step.specs.map(([k, v]) => (
            <div
              key={k}
              className="flex flex-col gap-1.5 py-3 md:flex-row md:items-baseline md:gap-8"
            >
              <dt className="w-40 shrink-0 font-mono text-[10px] tracking-[0.16em] text-muted-ink uppercase">
                {k}
              </dt>
              <dd className="font-mono text-[12px] leading-relaxed text-ebony">{v}</dd>
            </div>
          ))}
        </dl>
      </>
    );
  };

  return (
    <section>
      <SectionTitle index={p.index} title={p.title} lead={p.lead} />

      <div className="mt-6 flex items-center gap-4">
        <span className="font-mono text-[9px] tracking-[0.22em] text-moss uppercase">
          {p.marker}
        </span>
        <span className="h-px grow bg-gridline" />
        <span className="font-mono text-[9px] tracking-[0.22em] text-muted-ink uppercase">
          {p.hint}
        </span>
      </div>

      <div className="mt-6 divide-y divide-gridline border-t border-gridline md:grid md:grid-cols-3 md:gap-10 md:divide-y-0 md:pt-2">
        {p.steps.map((step, i) => {
          const isActive = i === active;
          return (
            <div key={step.code} className="flex flex-col">
              <button
                type="button"
                onClick={() => select(i)}
                aria-expanded={isActive}
                aria-controls={`flow-detail-${i}`}
                className="flex min-h-11 w-full flex-col py-6 text-left md:py-8"
              >
                <span className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-muted-ink">
                  <span
                    aria-hidden="true"
                    className={`inline-block h-1.5 w-1.5 rounded-full transition-colors ${
                      isActive ? "bg-terracotta" : "bg-gridline-strong"
                    }`}
                  />
                  {step.code}
                </span>
                <h3
                  className={`mt-3 text-base leading-tight transition-colors md:text-lg ${
                    isActive ? "text-ebony" : "text-muted-ink"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="mt-1.5 font-mono text-[10px] tracking-[0.16em] text-moss uppercase">
                  {step.place}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-ink">{step.summary}</p>
                <span
                  aria-hidden="true"
                  className={`mt-4 h-px w-full transition-colors ${
                    isActive ? "bg-ebony/60" : "bg-transparent"
                  }`}
                />
              </button>

              {/* Mobiel: detail opent direct onder de aangeklikte stap */}
              <div
                id={`flow-detail-${i}`}
                ref={(el) => {
                  detailRefs.current[i] = el;
                }}
                hidden={!isActive}
                className="pb-7 md:hidden"
              >
                {renderDetail(i)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: één detailpaneel onder het raster */}
      <div className="mt-8 hidden md:block">{renderDetail(active)}</div>

      <Marginalia rotate={-1.1} className="mt-6 ml-1 sm:ml-8">
        {notes.hosting}
      </Marginalia>
    </section>
  );
}
