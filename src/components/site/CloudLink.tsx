import { Link } from "@tanstack/react-router";
import { useLocale } from "@/i18n";

/** Interne link naar een cloud-detailpagina in de actieve taal. */
export function CloudLink({
  target,
  children,
  className,
}: {
  target: string;
  children: React.ReactNode;
  className?: string | undefined;
}) {
  const lang = useLocale();
  return (
    <Link
      to="/$lang/cloud/$target"
      params={{ lang, target }}
      {...(className !== undefined ? { className } : {})}
    >
      {children}
    </Link>
  );
}
