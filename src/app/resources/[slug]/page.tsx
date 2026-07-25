import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { QuickAnswer } from "@/components/aeo/QuickAnswer";
import { ArticleSchema } from "@/components/aeo/ArticleSchema";
import { FAQSection } from "@/components/aeo/FAQSection";
import {
  RESOURCES,
  getAllResourceSlugs,
  getResourceBySlug,
} from "@/lib/resources";
import {
  getAllResourceContentSlugs,
  getResourceContent,
} from "@/lib/resource-content";
import { breadcrumbListSchema } from "@/lib/schema";
import { abs } from "@/lib/site";

type RouteParams = { slug: string };

// Default publish date for any stub still without a markdown file.
// Real published pillars carry their own `date:` frontmatter.
const STUB_PUBLISHED_ISO = "2026-05-03";

export async function generateStaticParams(): Promise<RouteParams[]> {
  // Union of the registry (RESOURCES) and the markdown filesystem so both
  // stubbed routes and fully-authored pillars get prerendered.
  const slugs = new Set<string>([
    ...getAllResourceSlugs(),
    ...getAllResourceContentSlugs(),
  ]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getResourceContent(slug);
  const registry = getResourceBySlug(slug);
  if (!content && !registry) return { title: "Resource not found" };

  // Prefer authored markdown frontmatter when present; fall back to the
  // registry stub fields so unauthored placeholders still get proper OG.
  const title = content?.frontmatter.title ?? registry!.title;
  const description =
    content?.frontmatter.meta_description ?? registry!.description;
  const published = content?.frontmatter.date ?? STUB_PUBLISHED_ISO;

  return {
    title,
    description,
    alternates: { canonical: `/resources/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/resources/${slug}`,
      publishedTime: published,
      modifiedTime: published,
      authors: ["Ryan Riggins"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * /resources/[slug] article page.
 *
 * Two render paths share this route:
 *
 *   1. Full pillar — content/resources/<slug>.md exists. Renders the
 *      QuickAnswer block from frontmatter.quick_answer, MDX body, a
 *      FAQSection (with FAQPage schema), and the author bio. Emits
 *      Article + Breadcrumb schema in the canonical page source.
 *
 *   2. Stub fallback — registry entry exists but no markdown yet.
 *      Renders the placeholder H2 scaffolding so the URL never 404s
 *      between scaffold and full content. (Original behavior.)
 *
 * Both paths keep the same Blueprint/SeniorSafe alternating CTA + Related
 * resources block so navigation and conversion paths stay stable as
 * pillars ship.
 */
export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const content = getResourceContent(slug);
  const registry = getResourceBySlug(slug);
  if (!content && !registry) notFound();

  const idx = RESOURCES.findIndex((x) => x.slug === slug);
  const ctaToBlueprint = idx === -1 ? true : idx % 2 === 0;
  const url = abs(`/resources/${slug}`);

  const title = content?.frontmatter.title ?? registry!.title;
  const description =
    content?.frontmatter.meta_description ?? registry!.description;
  const topic = content?.frontmatter.category ?? registry?.topic ?? "Resource";
  const published = content?.frontmatter.date ?? STUB_PUBLISHED_ISO;

  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: title, path: `/resources/${slug}` },
  ]);

  const related = RESOURCES.filter((x) => x.slug !== slug);

  // Pre-compile MDX for the body and the bio (if present) so the
  // server-rendered output carries the actual prose, not a string.
  const bodyContent = content
    ? (await compileMDX({ source: content.body })).content
    : null;
  const bioContent =
    content && content.bio
      ? (await compileMDX({ source: content.bio })).content
      : null;

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      <ArticleSchema
        headline={title}
        description={description}
        datePublished={published}
        dateModified={published}
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
            {topic}
          </Badge>
          <h1 className="mt-4 leading-[1.1]">{title}</h1>
          <div className="mt-8">
            <QuickAnswer
              topic={topic}
              answer={
                content?.frontmatter.quick_answer ??
                "Coming soon. The full guide for this topic is in production. Bookmark this page; the answer below will be replaced with a 40-60 word direct answer when the article ships."
              }
            />
          </div>
        </div>
      </section>

      {/* BODY */}
      {bodyContent ? (
        // Full pillar body.
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-6 py-14">
            <article className="prose-rss">{bodyContent}</article>

            {/* CTA — alternates per article index */}
            <div className="mt-14 rounded-lg border border-border bg-cream/70 p-6">
              {ctaToBlueprint ? (
                <>
                  <h3 className="font-serif text-xl text-navy-700 m-0">
                    While you&rsquo;re here: get the full Blueprint
                  </h3>
                  <p className="mt-3 text-ink/80 leading-relaxed">
                    The Senior Transition Blueprint is the 20-module system
                    Ryan uses with client families. 70+ tools, scripts for the
                    hard conversations, and the five exit strategies for the
                    home. Free, all of it, with a free account.
                  </p>
                  <Button asChild className="mt-5">
                    <a href="https://blueprint.rigginsstrategicsolutions.com/signup">Get the Blueprint free</a>
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
      ) : (
        // Stub fallback for registry entries without markdown content yet.
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-6 py-14">
            <p className="text-ink/75 leading-relaxed italic">
              Full article publishing soon. The headings below preview the
              structure of the published guide. Each section will expand into
              actionable detail when the article goes live.
            </p>

            <div className="mt-10 space-y-12">
              {registry!.h2s.map((h2) => (
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

            <div className="mt-14 rounded-lg border border-border bg-cream/70 p-6">
              {ctaToBlueprint ? (
                <>
                  <h3 className="font-serif text-xl text-navy-700 m-0">
                    While you&rsquo;re here: get the full Blueprint
                  </h3>
                  <p className="mt-3 text-ink/80 leading-relaxed">
                    The Senior Transition Blueprint is the 20-module system
                    Ryan uses with client families. 70+ tools, scripts for the
                    hard conversations, and the five exit strategies for the
                    home. Free, all of it, with a free account.
                  </p>
                  <Button asChild className="mt-5">
                    <a href="https://blueprint.rigginsstrategicsolutions.com/signup">Get the Blueprint free</a>
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
      )}

      {/* FAQ — only when authored content provides FAQs. FAQSection
          carries the matching FAQPage JSON-LD. */}
      {content && content.faqs.length > 0 ? (
        <FAQSection items={content.faqs} />
      ) : null}

      {/* AUTHOR BIO — only on fully-authored pillars. */}
      {bioContent ? (
        <section className="bg-white border-y border-border">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <GoldRule />
            <h2 className="mt-3 font-serif text-2xl text-navy-700">
              About Ryan Riggins
            </h2>
            <div className="prose-rss mt-4">{bioContent}</div>
          </div>
        </section>
      ) : null}

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
