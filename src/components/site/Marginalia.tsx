import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Lichte rotatie zodat de notitie met de hand geschreven lijkt. */
  rotate?: number;
};

/**
 * Terracotta marginalia: een korte, handgeschreven kanttekening naast de
 * technische inhoud. Puur decoratief-informatief, nooit een navigatie-element.
 */
export function Marginalia({ children, className, rotate = -1.4 }: Props) {
  return (
    <p
      className={cn("margin-note max-w-[22rem]", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </p>
  );
}
