import { cn } from "@/lib/utils";

const base = "h-4 w-4 shrink-0 text-moss";

export function SwissCross({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="21" height="21" stroke="currentColor" strokeWidth="1" />
      <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
    </svg>
  );
}

export function HydroLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" aria-hidden="true">
      <path
        d="M12 3c5 3 7 6.5 7 10a7 7 0 1 1-14 0c0-3.5 2-7 7-10Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M6 14c3-2 9-2 12 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function E2ELock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="none" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" stroke="currentColor" strokeWidth="1" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function QualityStamps({ className }: { className?: string }) {
  const items = [
    { Icon: SwissCross, label: "Swiss Sovereignty" },
    { Icon: HydroLeaf, label: "100% Hydroelectric" },
    { Icon: E2ELock, label: "E2E Encryption" },
  ];
  return (
    <div className={cn("flex flex-wrap items-center gap-x-8 gap-y-4", className)}>
      {items.map(({ Icon, label }) => (
        <span key={label} className="flex items-center gap-2.5">
          <Icon />
          <span className="label-mono">{label}</span>
        </span>
      ))}
    </div>
  );
}
