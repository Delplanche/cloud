import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { defaultLocale, isLocale, localePath, pageFromAnySlug } from "@/i18n/config";

export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.lang)) {
      // Legacy of onbekend pad: stuur door naar de Engelse variant.
      const page = pageFromAnySlug(params.lang);
      throw redirect({
        href: page ? localePath(defaultLocale, page) : `/${defaultLocale}`,
        replace: true,
      });
    }
  },
  component: () => <Outlet />,
});
