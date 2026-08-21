import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { htmlLang, toLocale } from "@/i18n/config";
import { TopNav } from "@/components/site/TopNav";
import { Footer } from "@/components/site/Footer";

function NotFoundComponent() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-6"
      style={{
        backgroundColor: "var(--ebony)",
        backgroundImage:
          "linear-gradient(to right, rgba(245,243,239,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,243,239,0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="w-full max-w-lg" style={{ color: "var(--canvas)" }}>
        <p className="label-mono" style={{ color: "var(--terracotta)" }}>
          Error / 404
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">Pagina niet gevonden</h1>
        <div className="mt-5 h-px w-24" style={{ backgroundColor: "var(--terracotta)" }} />
        <p className="mt-5 text-sm opacity-70">
          Dit adres bestaat niet (meer) binnen onze architectuur. De rest van het systeem draait
          gewoon door.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="stamp-press inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium"
            style={{ backgroundColor: "var(--canvas)", color: "var(--ebony)" }}
          >
            Terug naar start
          </Link>
          <a
            href="/nl/contact"
            className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: "rgba(245,243,239,0.28)", color: "var(--canvas)" }}
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sovereign Cloud Architecture — delplanche.cloud" },
      {
        name: "description",
        content:
          "Absolute datasoevereiniteit, ontworpen voor volledige onafhankelijkheid. Gecureerde Zwitserse cloudinfrastructuur met FADP-bescherming en 100% hernieuwbare energie.",
      },
      { name: "author", content: "Delplanche" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "delplanche.cloud" },
      { property: "og:title", content: "Sovereign Cloud Architecture — delplanche.cloud" },
      {
        property: "og:description",
        content: "Absolute datasoevereiniteit, ontworpen voor volledige onafhankelijkheid.",
      },
      { property: "og:url", content: "https://delplanche.cloud/" },
      { property: "og:image", content: "https://delplanche.cloud/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "delplanche.cloud — Sovereign Cloud Architecture",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Sovereign Cloud Architecture — delplanche.cloud" },
      {
        name: "twitter:description",
        content: "Absolute datasoevereiniteit, ontworpen voor volledige onafhankelijkheid.",
      },
      { name: "twitter:image", content: "https://delplanche.cloud/og-image.jpg" },
      {
        name: "twitter:image:alt",
        content: "delplanche.cloud — Sovereign Cloud Architecture",
      },
      { name: "theme-color", content: "#1c1d1f" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "delplanche.cloud" },
      { name: "application-name", content: "delplanche.cloud" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preload",
        href: "/fonts/inter-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "shortcut icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "icon", type: "image/png", href: "/icon-192.png", sizes: "192x192" },
      { rel: "icon", type: "image/png", href: "/icon-512.png", sizes: "512x512" },
      { rel: "manifest", href: "/manifest.json" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://delplanche.cloud/#organization",
          name: "delplanche.cloud",
          alternateName: "Delplanche Cloud Solutions",
          url: "https://delplanche.cloud",
          logo: {
            "@type": "ImageObject",
            url: "https://delplanche.cloud/logo.png",
            width: 702,
            height: 160,
          },
          image: "https://delplanche.cloud/og-image.jpg",
          description:
            "Sovereign Cloud Architecture — gecureerde Zwitserse cloudinfrastructuur met FADP-bescherming en 100% hernieuwbare energie.",
          slogan: "Absolute datasoevereiniteit, ontworpen voor volledige onafhankelijkheid.",
          knowsAbout: [
            "Sovereign cloud infrastructure",
            "Data privacy",
            "Swiss data residency",
            "Self-hosted infrastructure",
          ],
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: "core@delplanche.cloud",
              url: "https://delplanche.cloud/nl/contact",
              availableLanguage: ["nl", "en", "fr"],
            },
            {
              "@type": "ContactPoint",
              contactType: "security",
              email: "core@delplanche.cloud",
              url: "https://delplanche.cloud/.well-known/security.txt",
            },
          ],
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = htmlLang[toLocale(pathname.split("/")[1])];

  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>

      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TopNav />
      <main className="min-h-screen">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}
