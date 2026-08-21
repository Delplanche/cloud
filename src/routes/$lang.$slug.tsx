import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  SITE_URL,
  alternateLinks,
  localePath,
  pageFromSlug,
  toLocale,
  type PageKey,
} from "@/i18n/config";
import { getDict } from "@/i18n";
import { getExtraDict } from "@/i18n/extra";
import { StackPage } from "@/components/pages/StackPage";
import { SecurityPage } from "@/components/pages/SecurityPage";
import { OnboardingPage } from "@/components/pages/OnboardingPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { LegalPage } from "@/components/pages/LegalPage";
import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { FaqPage } from "@/components/pages/FaqPage";
import { GatewayPage } from "@/components/pages/GatewayPage";

export const Route = createFileRoute("/$lang/$slug")({
  beforeLoad: ({ params }) => {
    const locale = toLocale(params.lang);
    if (!pageFromSlug(locale, params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const locale = toLocale(params.lang);
    const page = pageFromSlug(locale, params.slug);
    if (!page || page === "home") {
      return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    }

    const extra = getExtraDict(locale);
    const meta =
      page === "faq"
        ? { title: extra.faq.metaTitle, description: extra.faq.metaDescription }
        : page === "gateway"
          ? { title: extra.gateway.metaTitle, description: extra.gateway.metaDescription }
          : getDict(locale).meta[page as Exclude<PageKey, "home" | "faq" | "gateway">];

    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
        { property: "og:url", content: `${SITE_URL}${localePath(locale, page)}` },
      ],
      links: alternateLinks(locale, page),
    };
  },
  component: SlugRoute,
});

function SlugRoute() {
  const { lang, slug } = Route.useParams();
  const locale = toLocale(lang);
  const t = getDict(locale);
  const page = pageFromSlug(locale, slug);

  switch (page) {
    case "stack":
      return <StackPage t={t} />;
    case "security":
      return <SecurityPage t={t} locale={locale} />;
    case "onboarding":
      return <OnboardingPage t={t} />;
    case "faq":
      return <FaqPage locale={locale} />;
    case "gateway":
      return <GatewayPage locale={locale} />;
    case "contact":
      return <ContactPage t={t} />;
    case "legal":
      return <LegalPage t={t} />;
    case "privacy":
      return <PrivacyPage t={t} />;
    default:
      return null;
  }
}
