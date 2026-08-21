import { useState } from "react";
import { useLocale } from "@/i18n";

const LABELS = {
  en: { more: "+ MORE DETAILS", less: "− HIDE DETAILS" },
  nl: { more: "+ MEER DETAILS", less: "− MINDER DETAILS" },
  fr: { more: "+ PLUS DE DETAILS", less: "− MOINS DE DETAILS" },
} as const;

/**
 * Terminal-stijl toggle: `[ + MEER DETAILS ]`.
 * Houdt kaarten compact op mobiel; strikt vierkante hoeken.
 */
export function DetailsToggle({ children, id }: { children: React.ReactNode; id: string }) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const l = LABELS[locale] ?? LABELS.en;

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`details-${id}`}
        className="rounded-none border border-gridline-strong inline-flex min-h-11 items-center px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-muted-ink uppercase transition-colors hover:bg-ebony/[0.04] hover:text-ebony"
      >
        [ {open ? l.less : l.more} ]
      </button>
      {open && (
        <div
          id={`details-${id}`}
          className="mt-4 rounded-none border border-gridline bg-canvas px-4 py-4"
        >
          {children}
        </div>
      )}
    </div>
  );
}
