import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { LanguageSwitcher, LocaleLink, useDict, useLocale } from "@/i18n";
import type { PageKey } from "@/i18n/config";
import { getExtraDict } from "@/i18n/extra";

const navPages: {
  page: PageKey;
  key: "stack" | "security" | "onboarding" | "faq" | "gateway" | "contact";
}[] = [
  { page: "stack", key: "stack" },
  { page: "security", key: "security" },
  { page: "onboarding", key: "onboarding" },
  { page: "faq", key: "faq" },
  { page: "gateway", key: "gateway" },
  { page: "contact", key: "contact" },
];

export function BrandMark({ className }: { className?: string }) {
  const lang = useLocale();
  return (
    <Link
      to="/$lang"
      params={{ lang }}
      className={`${className ?? ""} inline-flex min-h-11 items-center transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-moss`}
      aria-label="delplanche.cloud"
    >
      <img
        src="/logo.png"
        alt="delplanche.cloud — Cloud Solutions"
        className="h-7 w-auto md:h-8"
        width={702}
        height={160}
      />
    </Link>
  );
}

/** Handgetekend sluit-streepjeskruis */
function HandClose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M6.5 6c3.6 3.4 7.4 7.6 11 12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M17.6 6.2C14 9.5 10 13.8 6.6 18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Handgetekend pijltje ↗ */
export function HandArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M5 19.2C9.5 15 13.8 10.6 18.4 5.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11.6 5.1c2.6-.2 5-.1 7 .3.3 2 .4 4.3.2 6.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TopNav() {
  const t = useDict();
  const locale = useLocale();
  const navLabels: Record<string, string> = { ...t.nav, ...getExtraDict(locale).nav };
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !panel?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panel?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open, close]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gridline bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6 md:px-10">
        <BrandMark className="min-w-0 shrink-0" />

        <div className="flex items-center gap-8">
          <nav className="hidden shrink-0 items-center gap-7 md:flex">
            {navPages.map(({ page, key }) => (
              <LocaleLink
                key={page}
                page={page}
                className="font-mono text-[10px] tracking-[0.18em] text-muted-ink uppercase transition-colors hover:text-ebony"
                activeProps={{ className: "text-ebony" }}
              >
                {navLabels[key]}
              </LocaleLink>
            ))}
          </nav>
          <LanguageSwitcher className="hidden md:flex" />
        </div>

        <button
          ref={toggleRef}
          onClick={() => setOpen((v) => !v)}
          data-testid="nav-toggle"
          className="stamp-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gridline-strong bg-transparent text-ebony md:hidden"
          aria-label={open ? t.nav.close : t.nav.open}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <HandClose className="h-4 w-4" /> : <Menu size={16} />}
        </button>
      </div>

      {open && (
        <div
          ref={panelRef}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.open}
          data-testid="mobile-nav"
          className="fixed inset-x-0 top-16 bottom-0 z-50 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-gridline bg-canvas px-6 py-4 md:hidden"
        >
          <div className="flex items-center justify-between pt-1 pb-4">
            <span className="font-mono text-[9px] tracking-[0.2em] text-muted-ink uppercase">
              {t.nav.language}
            </span>
            <LanguageSwitcher onNavigate={() => setOpen(false)} />
          </div>
          <nav className="flex flex-col border-t border-gridline">
            {navPages.map(({ page, key }, i) => (
              <LocaleLink
                key={page}
                page={page}
                onClick={() => setOpen(false)}
                className={`group flex items-center justify-between py-4 font-mono text-[11px] tracking-[0.18em] text-ebony uppercase ${
                  i === 0 ? "" : "border-t border-gridline"
                }`}
                activeProps={{ className: "text-moss" }}
              >
                {navLabels[key]}
                <HandArrow className="h-4 w-4 text-muted-ink transition-transform duration-300 group-active:translate-x-0.5" />
              </LocaleLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
