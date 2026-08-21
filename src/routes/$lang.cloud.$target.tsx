import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { cloudAlternateLinks, slugs, toLocale, type Locale } from "@/i18n/config";
import { getCloudDict, isCloudTarget, type CloudDict, type CloudEntry } from "@/i18n/cloud";
import { externalLinkProps } from "@/lib/affiliate";
import { Arrow, PageShellLite, SectionTitle, actionClass } from "@/components/site/Layout";
import { DetailsToggle } from "@/components/site/DetailsToggle";
import { RedlineNote } from "@/components/site/RedlineNote";

export const Route = createFileRoute("/$lang/cloud/$target")({
  beforeLoad: ({ params }) => {
    if (!isCloudTarget(params.target)) throw notFound();
  },
  head: ({ params }) => {
    const locale = toLocale(params.lang);
    if (!isCloudTarget(params.target)) {
      return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    }
    const entry = getCloudDict(locale).targets[params.target];
    return {
      meta: [
        { title: entry.metaTitle },
        { name: "description", content: entry.metaDescription },
        { property: "og:title", content: entry.metaTitle },
        { property: "og:description", content: entry.metaDescription },
      ],
      links: cloudAlternateLinks(locale, params.target),
    };
  },
  component: CloudTargetRoute,
});

const cardClass =
  "flex flex-col rounded-none border border-gridline bg-card px-6 py-7 shadow-[0_1px_0_rgba(44,62,53,0.04)] md:px-8 md:py-9";

function PlanGrid({ entry, l }: { entry: CloudEntry; l: CloudDict["labels"] }) {
  return (
    <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-3">
      {entry.plans.map((plan) => (
        <div
          key={plan.name}
          className={`${cardClass} ${plan.featured ? "ring-1 ring-moss/40" : ""}`}
        >
          <h3 className="text-lg leading-tight text-ebony md:text-xl">{plan.name}</h3>
          <p className="mt-4 font-mono text-[20px] text-ebony md:text-[22px]">{plan.price}</p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-muted-ink uppercase md:tracking-[0.16em]">
            {plan.unit}
          </p>
          <ul className="mt-6 space-y-2.5">
            {plan.specs.slice(0, 3).map((spec) => (
              <li key={spec} className="font-mono text-[11px] leading-relaxed text-muted-ink">
                {spec}
              </li>
            ))}
          </ul>
          {plan.specs.length > 3 && (
            <DetailsToggle id={plan.name}>
              <ul className="space-y-2.5">
                {plan.specs.slice(3).map((spec) => (
                  <li key={spec} className="font-mono text-[11px] leading-relaxed text-muted-ink">
                    {spec}
                  </li>
                ))}
              </ul>
            </DetailsToggle>
          )}
          <div className="grow" />
          <a
            href={`/go/${plan.link}`}
            {...externalLinkProps}
            className={`${actionClass} mt-8 w-full`}
          >
            {l.viewAt} <Arrow />
          </a>
        </div>
      ))}
    </div>
  );
}

/** Systems-engineering layout: spec sheet eerst, daarna genummerde node-tiers. */
function ComputeLayout({ entry, l }: { entry: CloudEntry; l: CloudDict["labels"] }) {
  return (
    <>
      <section>
        <SectionTitle index={l.techIndex} title={l.techTitle} lead={l.techLead} />
        <div className="mt-8 overflow-hidden rounded-none border border-gridline">
          <dl className="divide-y divide-gridline">
            {(entry.techSpecs ?? []).map(([k, v]) => (
              <div
                key={k}
                className="flex flex-col gap-1.5 bg-card px-5 py-4 md:flex-row md:items-baseline md:gap-8 md:px-7 md:py-5"
              >
                <dt className="w-48 shrink-0 font-mono text-[10px] tracking-[0.16em] text-muted-ink uppercase">
                  {k}
                </dt>
                <dd className="font-mono text-[12px] leading-relaxed text-ebony">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <SectionTitle index={l.pricingIndex} title={l.pricingTitle} />
        <div className="mt-8 space-y-6">
          {entry.plans.map((plan, i) => (
            <article
              key={plan.name}
              className={`${cardClass} gap-6 md:flex-row md:items-start md:justify-between ${
                plan.featured ? "ring-1 ring-moss/40" : ""
              }`}
            >
              <div className="min-w-0 md:max-w-md">
                <span className="font-mono text-[10px] tracking-[0.22em] text-muted-ink">
                  NODE / {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg leading-tight text-ebony md:text-xl">{plan.name}</h3>
                <p className="mt-3 font-mono text-[18px] text-ebony md:text-[20px]">{plan.price}</p>
                <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-muted-ink uppercase">
                  {plan.unit}
                </p>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-6 md:max-w-sm">
                <ul className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-1">
                  {plan.specs.slice(0, 3).map((spec) => (
                    <li key={spec} className="font-mono text-[11px] leading-relaxed text-muted-ink">
                      {spec}
                    </li>
                  ))}
                </ul>
                {plan.specs.length > 3 && (
                  <DetailsToggle id={plan.name}>
                    <ul className="grid gap-2.5">
                      {plan.specs.slice(3).map((spec) => (
                        <li
                          key={spec}
                          className="font-mono text-[11px] leading-relaxed text-muted-ink"
                        >
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </DetailsToggle>
                )}
                <a
                  href={`/go/${plan.link}`}
                  {...externalLinkProps}
                  className={`${actionClass} w-full`}
                >
                  {l.viewAt} <Arrow />
                </a>
              </div>
            </article>
          ))}
        </div>
        <RedlineNote className="mt-8 max-w-2xl" rotate={-1.2}>
          {l.disclaimer}
        </RedlineNote>
      </section>
    </>
  );
}

function CloudTargetRoute() {
  const { lang, target } = Route.useParams();
  const locale = toLocale(lang) as Locale;
  const dict = getCloudDict(locale);
  const l = dict.labels;

  if (!isCloudTarget(target)) {
    return (
      <PageShellLite index="CLOUD / 404" title={l.notFoundTitle} lead={l.notFoundLead}>
        <Link
          to="/$lang/$slug"
          params={{ lang, slug: slugs.stack[locale] }}
          className={actionClass}
        >
          {l.backToStack} <Arrow />
        </Link>
      </PageShellLite>
    );
  }

  const entry = dict.targets[target];
  const isCompute = target === "vps";

  return (
    <PageShellLite index={entry.index} title={entry.title} lead={entry.lead}>
      {isCompute ? (
        <ComputeLayout entry={entry} l={l} />
      ) : (
        <section>
          <SectionTitle index={l.pricingIndex} title={l.pricingTitle} />
          <PlanGrid entry={entry} l={l} />
          <RedlineNote className="mt-8 max-w-2xl" rotate={-1.2}>
            {l.disclaimer}
          </RedlineNote>
        </section>
      )}

      <section>
        <SectionTitle index={l.teamIndex} title={l.teamTitle} lead={l.teamLead} />
        <dl className="mt-8 space-y-3 md:space-y-0 md:divide-y md:divide-gridline md:border-y md:border-gridline">
          {entry.team.map(([k, v]) => (
            <div
              key={k}
              className="flex flex-col gap-1.5 rounded-none border border-gridline bg-card px-5 py-4 md:flex-row md:items-baseline md:gap-10 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-5"
            >
              <dt className="w-64 shrink-0 font-mono text-[10px] tracking-[0.14em] text-muted-ink uppercase md:tracking-[0.16em]">
                {k}
              </dt>
              <dd className="text-sm leading-relaxed text-ebony">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={`/go/${entry.signupLink}`}
            {...externalLinkProps}
            className={`${actionClass} w-full sm:w-auto`}
          >
            {entry.signupLabel} <Arrow />
          </a>
          <Link
            to="/$lang/$slug"
            params={{ lang, slug: slugs.onboarding[locale] }}
            className={`${actionClass} w-full sm:w-auto`}
          >
            {l.turnkey} <Arrow />
          </Link>
        </div>
        <p className="mt-8">
          <Link
            to="/$lang/$slug"
            params={{ lang, slug: slugs.stack[locale] }}
            className="font-mono text-[10px] tracking-[0.14em] text-muted-ink uppercase transition-colors hover:text-ebony md:tracking-[0.16em]"
          >
            ← {l.backToStack}
          </Link>
        </p>
      </section>
    </PageShellLite>
  );
}
