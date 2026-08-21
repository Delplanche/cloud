import { cn } from "@/lib/utils";

export const actionClass =
  "group stamp-press inline-flex items-center justify-center gap-2.5 rounded-full border border-ebony/70 bg-transparent px-5 py-3 font-mono text-[10px] tracking-[0.18em] text-ebony uppercase transition-colors hover:bg-ebony/[0.05] disabled:opacity-50";

export const actionClassMuted =
  "group inline-flex items-center justify-center gap-2.5 font-mono text-[10px] tracking-[0.18em] text-muted-ink uppercase transition-colors hover:text-ebony";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-5xl px-6 md:px-12", className)}>{children}</div>;
}

export function PageIntro({ index, title, lead }: { index: string; title: string; lead?: string }) {
  return (
    <header className="max-w-3xl">
      <span className="font-mono text-[10px] tracking-[0.22em] text-muted-ink uppercase">
        {index}
      </span>
      <h1 className="mt-7 text-[2.25rem] leading-[1.1] text-ebony md:text-6xl">{title}</h1>
      <span className="sketch-underline mt-3" aria-hidden="true" />
      {lead && (
        <p className="mt-7 max-w-2xl text-sm leading-relaxed text-muted-ink md:text-base">{lead}</p>
      )}
    </header>
  );
}

export function SectionTitle({
  index,
  title,
  lead,
}: {
  index: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.22em] text-muted-ink uppercase">
          {index}
        </span>
        <span className="sketch-rule flex-1" aria-hidden="true" />
      </div>
      <h2 className="mt-6 text-2xl leading-[1.18] text-ebony md:text-4xl">{title}</h2>
      {lead && <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-ink">{lead}</p>}
    </div>
  );
}

export function PageShellLite({
  index,
  title,
  lead,
  children,
}: {
  index: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="pt-32 pb-28 md:pt-48 md:pb-40">
      <PageIntro index={index} title={title} {...(lead ? { lead } : {})} />
      <div className="mt-16 space-y-20 md:mt-24 md:space-y-32">{children}</div>
    </Container>
  );
}

/** Neutrale, zakelijke statusregel — geen alarmerend kader. */
export function StatusLine({ label, className }: { label: string; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-mono text-[10px] tracking-[0.16em] text-muted-ink uppercase",
        className,
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" aria-hidden="true" />
      {label}
    </p>
  );
}

export function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
    >
      →
    </span>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] tracking-[0.18em] text-muted-ink uppercase">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export const fieldClass =
  "block min-h-11 w-full border-0 border-b border-gridline-strong bg-transparent px-0 py-3 font-mono text-[13px] text-ebony transition-colors outline-none placeholder:text-muted-ink/50 focus:border-ebony focus-visible:border-moss";

/** Compacte 2-koloms vergelijkingstabel, ook strak op mobiel. */
export function ComparisonTable({
  columns,
  rows,
}: {
  columns: [string, string, string];
  rows: string[][];
}) {
  return (
    <div className="mt-8">
      <div className="hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gridline-strong">
              {columns.map((c, i) => (
                <th
                  key={c}
                  className={cn(
                    "py-4 pr-6 font-mono text-[9px] tracking-[0.2em] uppercase",
                    i === 2 ? "text-ebony" : "text-muted-ink",
                  )}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-b border-gridline last:border-0">
                <td className="py-4 pr-6 font-mono text-[10px] tracking-[0.12em] text-ebony uppercase">
                  {r[0]}
                </td>
                <td className="py-4 pr-6 text-sm leading-relaxed text-muted-ink">{r[1]}</td>
                <td className="py-4 text-sm leading-relaxed text-ebony">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobiel: open, kaartloze rijen op de rasterlijnen */}
      <div className="divide-y divide-gridline border-y border-gridline md:hidden">
        {rows.map((r, i) => (
          <article key={r[0]} className="py-5">
            <header className="flex items-baseline justify-between gap-3">
              <p className="font-mono text-[10px] leading-snug tracking-[0.16em] text-ebony uppercase">
                {r[0]}
              </p>
              <span className="shrink-0 font-mono text-[9px] tracking-[0.18em] text-muted-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
            </header>
            <div className="mt-3 space-y-3">
              <div>
                <span className="font-mono text-[9px] leading-snug tracking-[0.18em] text-muted-ink uppercase">
                  {columns[1]}
                </span>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-ink">{r[1]}</p>
              </div>
              <div>
                <span className="font-mono text-[9px] leading-snug tracking-[0.18em] text-ebony uppercase">
                  {columns[2]}
                </span>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ebony">{r[2]}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/** Tactiele actie-knop (moss-variant) — gebruikt voor dossier-downloads. */
const actionButtonClass =
  "group stamp-press inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-moss bg-card px-6 py-3 font-mono text-[10px] tracking-[0.18em] text-moss uppercase transition-colors hover:bg-moss/[0.07] disabled:opacity-50";

export function ActionButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(actionButtonClass, className)} {...rest}>
      {children}
    </button>
  );
}
