import { createFileRoute } from "@tanstack/react-router";
import { alternateLinks, toLocale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { HomePage } from "@/components/pages/HomePage";

export const Route = createFileRoute("/$lang/")({
  head: ({ params }) => {
    const locale = toLocale(params.lang);
    const meta = getDict(locale).meta.home;
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
      ],
      links: alternateLinks(locale, "home"),
    };
  },
  component: HomeRoute,
});

function HomeRoute() {
  const { lang } = Route.useParams();
  return <HomePage t={getDict(toLocale(lang))} />;
}
