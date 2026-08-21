import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  arrow?: "none" | "down" | "up" | "left" | "right";
  rotate?: number;
};

export function RedlineNote({ children, className, arrow = "none", rotate = -2 }: Props) {
  return (
    <div
      className={cn("flex items-end gap-2 text-terracotta", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {arrow === "left" && <RedlineArrow direction="left" />}
      <p className="font-hand text-lg leading-snug md:text-xl">{children}</p>
      {arrow !== "none" && arrow !== "left" && <RedlineArrow direction={arrow} />}
    </div>
  );
}

export function RedlineArrow({
  direction = "down",
  className,
}: {
  direction?: "down" | "up" | "left" | "right";
  className?: string;
}) {
  const rotation = { down: 0, up: 180, left: 90, right: -90 }[direction];
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-8 w-8 shrink-0 text-terracotta", className)}
      style={{ transform: `rotate(${rotation}deg)` }}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 4c14 2 22 10 24 28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M24 24l6 8 6-9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RedlineCircle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 90"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-terracotta",
        className,
      )}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M100 4C42 4 6 20 6 45s38 41 96 41 92-17 92-41S158 6 104 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
