import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { QuickAnswer } from "@/components/aeo/QuickAnswer";
import { ArticleSchema } from "@/components/aeo/ArticleSchema";
import {
  RESOURCES,
  getAllResourceSlugs,
  getResourceBySlug,
} from "@/lib/resources";
import { breadcrumbListSchema } from "@/lib/schema";
import { abs } from "@/lib/site";

type RouteParams = { slug: string };

const PUBLISHED_ISO = "2026-05-03";

export async function generateStaticParams(): Promise<RouteParams[]> {
  return getAllResourceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getResourceBySlug(slug);
  if (!r) return { title: "Resource not found" };
  return {
    title: r.title,
    description: r.description,
    alternates: { canonical: `/resources/${r.slug}` },
    openGraph: {
      title: r.title,
      description: r.description,
      type: "article",
      url: `/resources/${r.slug}`,
      publishedTime: PUBLISHED_ISO,
      modifiedTime: PUBLISHED_ISO,
      authors: ["Ryan Riggins"],
    },
    twitter: {
      card: "summary_large_image",
      title: r.title,
      description: r.description,
    },
  };
}

/**
 * Stub article page. Renders QuickAnswer placeholder + H1 + 4-5 H2
 * scaffolding + Related Resources + alternating CTA. Each article
 * gets replaced inline as the full content lands; structure stays
 * stable so the URL never 404s during the gap between scaffold and
 * real content.
 *
 * CTA alternation: even-indexed articles route to Blueprint Core
 * ($47), odd-indexed to the SeniorSafe trial. Roughly balances the
 * two product paths across the 15-article scaffold.
 */
export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const r = getResourceBySlug(slug);
  if (!r) notFound();

  const idx = RESOURCES.findIndex((x) => x.slug === r.slug);
  const ctaToBlueprint = idx % 2 === 0;
  const url = abs(`/resources/${r.slug}`);

  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: r.title, path: `/resources/${r.slug}` },
  ]);

  const related = RESOURCES.filter((x) => x.slug !== r.slug);

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      <ArticleSchema
        headline={r.title}
        description={r.description}
        datePublished={PUBLISHED_ISO}
        dateModified={PUBLISHED_ISO}
        url={url}
        image="/photos/hero_ryan_consulting_family.jpg"
      />

      {/* HEADER */}
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Link
            href="/resources"
            className="text-sm font-semibold text-burgundy-600 hover:text-burgundy-700"
          >
            &larr; All resources
          </Link>
          <Badge
            variant="secondary"
            className="mt-4 bg-burgundy-100 text-burgundy-700 border-0"
          >
            Resource
          </Badge>
          <h1 className="mt-4 leading-[1.1]">{r.title}</h1>
          <div className="mt-8">
            <QuickAnswer
              topic={r.topic}
              answer="Coming soon. The full guide for this topic is in production. Bookmark this page; the answer below will be replaced with a 40-60 word direct answer when the article ships."
            />
          </div>
        </div>
      </section>

      {/* SCAFFOLD BODY */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="text-ink/75 leading-relaxed italic">
            Full article publishing soon. The headings below preview the
            structure of the published guide. Each section will expand into
            actionable detail when the article goes live.
          </p>

          <div className="mt-10 space-y-12">
            {r.h2s.map((h2) => (
              <section key={h2}>
                <h2 className="font-serif text-2xl text-navy-700 leading-snug">
                  {h2}
                </h2>
                <p className="mt-3 text-ink/75 leading-relaxed">
                  In-progress section. Full content publishing soon.
                </p>
              </section>
            ))}
          </div>

          {/* CTA — alternates per article index */}
          <div className="mt-14 rounded-lg border border-border bg-cream/70 p-6">
            {ctaToBlueprint ? (
              <>
                <h3 className="font-serif text-xl text-navy-700 m-0">
                  While you&rsquo;re here: get the full Blueprint
                </h3>
                <p className="mt-3 text-ink/80 leading-relaxed">
                  Blueprint Core is the 19-module system Ryan uses with
                  client families. 60+ tools, scripts for the hard
                  conversations, and the five exit strategies for the home.
                  $47, one-time, 14-day money-back guarantee.
                </p>
                <Button asChild className="mt-5">
                  <a href="https://blueprint.rigginsstrategicsolutions.com/pricing">See Blueprint Core, $47</a>
                </Button>
              </>
            ) : (
              <>
                <h3 className="font-serif text-xl text-navy-700 m-0">
                  While you&rsquo;re here: try SeniorSafe
                </h3>
                <p className="mt-3 text-ink/80 leading-relaxed">
                  SeniorSafe is the family app for the daily part of senior
                  care. Daily check-ins, document vault, family messaging,
                  and two AIs working together: SeniorSafe AI for your
                  parent, Maggie for the adult child running the move.
                  14-day free trial.
                </p>
                <Button asChild className="mt-5">
                  <a
                    href="https://app.seniorsafeapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Start the SeniorSafe free trial
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="bg-sand border-y border-border">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">Related resources</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {related.map((x) => (
              <li key={x.slug}>
                <Link
                  href={`/resources/${x.slug}`}
                  className="group block rounded-md border border-border bg-white p-4 hover:border-burgundy-600 transition-colors"
                >
                  <span className="block font-serif text-base text-navy-700 leading-snug group-hover:text-burgundy-700 transition-colors">
                    {x.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
