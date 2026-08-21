import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyAction({
  value,
  label,
  icon,
  className,
}: {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => (timer.current ? clearTimeout(timer.current) : undefined), []);

  const flash = (ok: boolean) => {
    setCopied(ok);
    setFailed(!ok);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2000);
  };

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback voor browsers zonder Clipboard API-permissie
        const el = document.createElement("textarea");
        el.value = value;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(el);
        if (!ok) throw new Error("copy failed");
      }
      flash(true);
    } catch {
      flash(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-testid="copy-action"
      data-copied={copied ? "true" : "false"}
      aria-label={`Kopieer ${label ?? value}`}
      className={cn(
        "stamp-press group inline-flex items-center gap-2.5 rounded-full border-2 border-moss bg-card px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] text-ebony uppercase transition-colors hover:bg-moss/[0.06]",
        copied && "border-moss bg-moss/[0.08]",
        failed && "border-terracotta",
        className,
      )}
    >
      {icon ?? <span aria-hidden="true">✉</span>}
      <span className="truncate">{label ?? value}</span>
      <span
        className={cn(
          "ml-1 inline-flex items-center gap-1",
          failed ? "text-terracotta" : copied ? "text-moss" : "text-terracotta",
        )}
      >
        {copied ? <Check size={11} /> : <Copy size={11} />}
        <span className="text-[9px]">
          {failed ? "[ KOPIE MISLUKT ]" : copied ? "[ ✓ GEKOPIEERD ]" : "[ COPY ]"}
        </span>
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? `${value} gekopieerd naar klembord` : failed ? "Kopiëren mislukt" : ""}
      </span>
    </button>
  );
}
