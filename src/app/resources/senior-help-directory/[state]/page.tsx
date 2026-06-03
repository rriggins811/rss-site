import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import {
  breadcrumbListSchema,
  collectionPageSchema,
} from "@/lib/schema";
import {
  DIRECTORY_STATES,
  NATIONAL_ANCHORS,
  countiesForState,
  stateBySlug,
} from "@/lib/directory";
import { abs } from "@/lib/site";

type RouteParams = { state: string };

const HUB = "/resources/senior-help-directory";

export function generateStaticParams(): RouteParams[] {
  return DIRECTORY_STATES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const state = stateBySlug(slug);
  if (!state) return { title: "State not found" };

  const counties = countiesForState(state.code);
  const hasCounties = counties.length > 0;
  const canonical = `${HUB}/${state.slug}`;

  const title = hasCounties
    ? `${state.name} Senior Help Directory: Programs by County`
    : `${state.name} Senior Help: Free Programs for Seniors & Families`;
  const description = hasCounties
    ? `Free, plain-English senior help in ${state.name}, organized by county: food, energy, Medicare, home repair, transportation, legal, and caregiver programs. No sign-up.`
    : `Free national resources for seniors and families in ${state.name}. County-by-county listings are being added. Start with 211 and the Eldercare Locator.`;

  return {
    title,
    description,
    alternates: { canonical },
    // Empty state pages are noindex until they have at least one county page,
    // so we never publish thin near-duplicate pages. They flip to indexed
    // automatically once a county is added (hasCounties === true).
    robots: hasCounties ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function StateDirectoryPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { state: slug } = await params;
  const state = stateBySlug(slug);
  if (!state) notFound();

  const counties = countiesForState(state.code);
  const hasCounties = counties.length > 0;
  const canonical = `${HUB}/${state.slug}`;

  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: "Senior Help Directory", path: HUB },
    { name: state.name, path: canonical },
  ]);

  // Group counties by region (metro) for readability, preserving the order
  // each region first appears in the registry. Counties without a region fall
  // into a single unlabeled group, so states that do not use regions still
  // render a flat list.
  const countyGroups: { region: string | null; items: typeof counties }[] = [];
  for (const c of counties) {
    const key = c.region ?? null;
    const existing = countyGroups.find((g) => g.region === key);
    if (existing) existing.items.push(c);
    else countyGroups.push({ region: key, items: [c] });
  }
  const useRegionHeadings =
    countyGroups.length > 1 || countyGroups[0]?.region != null;

  const collection = hasCounties
    ? collectionPageSchema({
        name: `${state.name} Senior Help Directory`,
        description: `Senior help in ${state.name}, organized by county.`,
        pageUrl: abs(canonical),
        items: counties.map((c) => ({
          name: `${c.county}, ${c.state} Senior Help Directory`,
          itemUrl: abs(`/blog/${c.slug}`),
          description: c.blurb,
        })),
      })
    : null;

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      {collection ? <JsonLd data={collection} /> : null}

      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:py-20">
          <Link
            href={HUB}
            className="text-sm font-semibold text-burgundy-600 hover:text-burgundy-700"
          >
            &larr; Senior Help Directory
          </Link>
          <Badge
            variant="secondary"
            className="mt-4 bg-burgundy-100 text-burgundy-700 border-0"
          >
            {state.name}
          </Badge>
          <h1 className="mt-4 leading-[1.05]">
            {hasCounties
              ? `Senior help in ${state.name}, by county.`
              : `Senior help in ${state.name}.`}
          </h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed">
            {hasCounties
              ? `Free government and nonprofit programs for seniors and families in ${state.name}. Pick your county for local phone numbers, or use the national resources below, which work anywhere in the state.`
              : `We are building out ${state.name} county by county. Until your county page is up, the national resources below work statewide. The fastest start is to call 211 or the Eldercare Locator.`}
          </p>
        </div>
      </section>

      {/* COUNTIES (only when present) */}
      {hasCounties ? (
        <section className="bg-white border-y border-border">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <GoldRule />
            <h2 className="mt-3 text-2xl md:text-3xl">Find help by county</h2>
            <div className="mt-8 space-y-10">
              {countyGroups.map((group) => (
                <div key={group.region ?? "_"}>
                  {useRegionHeadings && group.region ? (
                    <h3 className="font-serif text-lg text-burgundy-700 uppercase tracking-wider">
                      {group.region}
                    </h3>
                  ) : null}
                  <ul className="mt-4 space-y-5">
                    {group.items.map((c) => (
                      <li key={c.slug}>
                        <div className="group block rounded-md border border-border bg-cream/50 p-5 hover:border-burgundy-600 transition-colors">
                          <Link href={`/blog/${c.slug}`} className="block">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-serif text-lg sm:text-xl text-navy-700 leading-snug group-hover:text-burgundy-700 transition-colors">
                                {c.county}, {c.state}
                              </h4>
                              <Badge
                                variant="secondary"
                                className="bg-burgundy-100 text-burgundy-700 border-0"
                              >
                                {c.metro}
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm text-ink/75 leading-relaxed">
                              {c.blurb}
                            </p>
                          </Link>
                          {c.taxArticleSlug ? (
                            <p className="mt-3 text-sm">
                              <Link
                                href={`/blog/${c.taxArticleSlug}`}
                                className="font-semibold text-burgundy-600 hover:text-burgundy-700"
                              >
                                Also: property tax relief guide for this county
                                &rarr;
                              </Link>
                            </p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* NATIONAL FALLBACK (works anywhere; the only substantive content on
          an empty state page, so it is useful rather than thin) */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">
            Works anywhere in {state.name}
          </h2>
          <p className="mt-3 text-ink/75 leading-relaxed">
            These national resources reach local services in any county. Start
            with 211 or the Eldercare Locator and let them route you.
          </p>
          <ul className="mt-8 space-y-4">
            {NATIONAL_ANCHORS.map((a) => (
              <li
                key={a.name}
                className="rounded-md border border-border bg-cream/50 p-5"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-serif text-lg text-navy-700">
                    {a.name}
                  </span>
                  <span className="font-semibold text-burgundy-700">
                    {a.contact}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink/75 leading-relaxed">
                  {a.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="bg-sand border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <p className="text-xs text-ink/60 leading-relaxed">
            Ryan Riggins is a licensed North Carolina real estate agent
            (#361546, eXp Realty). Riggins Strategic Solutions is an education
            and media company, not a real estate sales business. This directory
            is not a solicitation to buy, sell, or list a home, and it is not
            financial, tax, medical, or legal advice. Programs, income limits,
            contacts, and deadlines change and vary by individual situation.
            Confirm current details directly with each program or a licensed
            professional before making any decision.
          </p>
        </div>
      </section>
    </main>
  );
}
