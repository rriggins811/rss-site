import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { SocialLinks } from "@/components/site/SocialLinks";
import { EmailFallback } from "@/components/site/EmailFallback";
import { JsonLd } from "@/components/site/JsonLd";
import { ScrollTracker } from "@/components/site/ScrollTracker";
import {
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
  formatPostDate,
} from "@/lib/blog";
import {
  articleSchemaFromPost,
  breadcrumbListSchema,
  faqPageSchema,
  howToSchemaFromPost,
} from "@/lib/schema";
import { abs } from "@/lib/site";
import { RelatedReading } from "@/components/site/RelatedReading";

type RouteParams = { slug: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const url = `/blog/${post.frontmatter.slug}`;
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: "article",
      url,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: ["Ryan Riggins"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
  });

  const related = getRelatedPosts(slug, 3);

  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.frontmatter.title, path: `/blog/${slug}` },
  ]);

  // Per-post schema routing. Posts with `schemaType: "HowTo"` + a populated
  // `howToSteps` frontmatter get HowTo schema in PLACE of Article — Google
  // recommends one primary @type per page. Fall back to Article for the
  // common case. See docs/blog-schema-types.md.
  const useHowTo =
    post.frontmatter.schemaType === "HowTo" &&
    Array.isArray(post.frontmatter.howToSteps) &&
    post.frontmatter.howToSteps.length > 0;
  const primarySchema = useHowTo
    ? howToSchemaFromPost(
        post,
        post.frontmatter.howToSteps!,
        post.frontmatter.totalTime
      )
    : articleSchemaFromPost(post);

  // Optional secondary FAQPage schema. Emitted only when frontmatter
  // declares `faqs` and the body actually renders matching Q&A markdown
  // (Google's schema-must-match-visible rule). Faqs[] in frontmatter is
  // the source of truth; renderers can mirror them visibly via markdown
  // (current pattern for migrated posts) or a future <FAQSection> mount.
  const hasFaqs =
    Array.isArray(post.frontmatter.faqs) &&
    post.frontmatter.faqs.length > 0;
  const faqSchema = hasFaqs
    ? faqPageSchema(
        post.frontmatter.faqs!.map((f) => ({ q: f.question, a: f.answer })),
        abs(`/blog/${slug}`)
      )
    : null;

  return (
    <main>
      <JsonLd data={primarySchema} />
      <JsonLd data={breadcrumbs} />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      <ScrollTracker event="blog_scroll_75" params={{ slug }} />

      {/* HEADER */}
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Link
            href="/blog"
            className="text-sm font-semibold text-burgundy-600 hover:text-burgundy-700"
          >
            &larr; All posts
          </Link>
          <div className="mt-6 text-sm font-semibold uppercase tracking-wider text-burgundy-600">
            {formatPostDate(post.datePublished)} &middot; {post.readMinutes} min read
          </div>
          <h1 className="mt-4 leading-[1.1]">{post.frontmatter.title}</h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed">
            {post.frontmatter.excerpt}
          </p>
        </div>
      </section>

      {/* BODY */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <article className="prose-rss">{content}</article>
        </div>
      </section>

      {/* AUTHOR / CTA */}
      <section className="bg-sand border-y border-border">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] items-center">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-gold-500">
              <Image
                src="/photos/about_hero_ryan_portrait.jpg"
                alt="Ryan Riggins"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-serif text-xl text-navy-700">
                <Link
                  href="/about"
                  className="hover:text-burgundy-700 transition-colors"
                >
                  Ryan Riggins, Senior Transition Advisor
                </Link>
              </div>
              <p className="mt-2 text-ink/80 leading-relaxed">
                Licensed NC broker (#361546, eXp Realty). Fiduciary duty to the
                family, not a pitch. Creator of The Blueprint and SeniorSafe.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <Button asChild size="sm">
                  <a href="https://blueprint.rigginsstrategicsolutions.com/pricing">See The Blueprint</a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link
                    href="/work-with-ryan"
                    data-track="book_call_click"
                    data-track-params='{"location":"blog-post-author-card"}'
                  >
                    Book a free 20-min call
                  </Link>
                </Button>
                <SocialLinks className="ml-auto text-navy-700" iconClassName="h-4 w-4" />
              </div>
              <EmailFallback className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* CLUSTER LINKS — surfaces interactive tools + resource articles in
          the same topical cluster that the tag-based related-posts heuristic
          (next section) can't see. Cluster definitions live in
          lib/internal-links.ts. Renders nothing if this post isn't in any
          cluster, so safe to mount on every post. */}
      <RelatedReading
        current={{ type: "blog", slug }}
        title="Tools and guides in this topic"
        bgClass="bg-white"
      />

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <GoldRule />
            <h2 className="mt-3 text-2xl md:text-3xl">Keep reading.</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.frontmatter.slug}
                  href={`/blog/${r.frontmatter.slug}`}
                  className="group block border border-border rounded-lg p-5 hover:border-burgundy-600 transition-colors"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                    {formatPostDate(r.datePublished)}
                  </div>
                  <h3 className="mt-2 font-serif text-lg text-navy-700 leading-snug group-hover:text-burgundy-700 transition-colors">
                    {r.frontmatter.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
