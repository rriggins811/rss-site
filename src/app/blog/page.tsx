import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema, collectionPageSchema } from "@/lib/schema";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog | Senior Transition Insights",
  description:
    "Real stories and plain-English guidance on senior housing transitions, aging in place, caregiving, and protecting your family's equity. Senior Transition Advisor Ryan Riggins.",
  alternates: { canonical: "/blog" },
};

// Optional `?q=` filter to support the SearchAction target advertised by
// the WebSite schema in layout.tsx. Filters by title + excerpt + tag
// (case-insensitive substring match). Conservative on purpose — no fuzzy
// matching, no relevance ranking — because the primary callers are AI
// crawlers + Google sitelinks search box, both of which work fine with
// "exact substring or nothing." If the query yields zero posts we show
// the full list with a "no matches" notice so the URL is never broken.
type BlogSearchParams = { q?: string };

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<BlogSearchParams>;
}) {
  const all = getAllPosts();
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();

  const matched = query
    ? all.filter((p) => {
        const hay = [
          p.frontmatter.title,
          p.frontmatter.excerpt,
          ...(p.frontmatter.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      })
    : all;

  // Fall back to full index when query returns nothing — keeps the URL
  // useful for Google's "Search this site" UI even when the term misses.
  const posts = matched.length > 0 ? matched : all;
  const showNoMatchNotice = query.length > 0 && matched.length === 0;

  if (posts.length === 0) {
    return (
      <main className="bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h1>Blog coming soon.</h1>
          <p className="mt-4 text-ink/80">
            Posts are being imported. Check back in a minute.
          </p>
        </div>
      </main>
    );
  }

  const [featured, ...rest] = posts;

  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  // CollectionPage + ItemList for the blog hub. Cap to the 25 most-recent
  // posts so the ItemList stays a reasonable size for Google's parser
  // (recommended max ~30 items per ItemList). Full archive remains
  // crawlable via individual post links + the sitemap.
  const collection = collectionPageSchema({
    name: "Blog | Senior Transition Insights",
    description:
      "Real stories and plain-English guidance on senior housing transitions, aging in place, caregiving, and protecting your family's equity. Written by Senior Transition Advisor Ryan Riggins.",
    pageUrl: abs("/blog"),
    items: posts.slice(0, 25).map((p) => ({
      name: p.frontmatter.title,
      itemUrl: abs(`/blog/${p.frontmatter.slug}`),
      description: p.frontmatter.excerpt,
    })),
  });

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={collection} />

      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Badge variant="secondary" className="bg-burgundy-100 text-burgundy-700 border-0">
            Blog
          </Badge>
          <h1 className="mt-6 leading-[1.05]">
            Real stories. Plain English.
          </h1>
          <p className="mt-6 max-w-prose text-lg text-ink/80">
            Short-form education from 8+ years helping families work through
            senior transitions. Written by Senior Transition Advisor Ryan
            Riggins.
          </p>
          {query ? (
            <p className="mt-4 text-sm text-ink/70">
              {showNoMatchNotice ? (
                <>
                  No posts matched <span className="font-semibold">&ldquo;{query}&rdquo;</span> —
                  showing all posts.
                </>
              ) : (
                <>
                  Showing posts matching <span className="font-semibold">&ldquo;{query}&rdquo;</span> ({matched.length})
                </>
              )}
            </p>
          ) : null}
        </div>
      </section>

      {/* FEATURED POST */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">Latest.</h2>
          <Link
            href={`/blog/${featured.frontmatter.slug}`}
            className="mt-8 block group"
          >
            <div className="grid gap-8 lg:grid-cols-5 items-center">
              <div className="lg:col-span-3 relative aspect-[16/9] rounded-lg overflow-hidden bg-sand">
                <Image
                  src="/photos/blog_header.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="lg:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                  {formatPostDate(featured.datePublished)} &middot; {featured.readMinutes} min read
                </div>
                <h3 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-navy-700 leading-tight group-hover:text-burgundy-700 transition-colors">
                  {featured.frontmatter.title}
                </h3>
                <p className="mt-4 text-ink/80 leading-relaxed">
                  {featured.frontmatter.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center text-burgundy-600 font-semibold group-hover:text-burgundy-700">
                  Read the post &rarr;
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-sand border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">More posts.</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.frontmatter.slug}
                href={`/blog/${post.frontmatter.slug}`}
                className="group block bg-white border border-border rounded-lg overflow-hidden hover:border-burgundy-600 transition-colors"
              >
                <div className="relative aspect-[16/9] bg-sand">
                  <Image
                    src="/photos/blog_header.jpg"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                    {formatPostDate(post.datePublished)} &middot; {post.readMinutes} min
                  </div>
                  <h3 className="mt-2 font-serif text-xl font-bold text-navy-700 leading-snug group-hover:text-burgundy-700 transition-colors">
                    {post.frontmatter.title}
                  </h3>
                  <p className="mt-3 text-sm text-ink/75 leading-relaxed">
                    {post.frontmatter.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RSS LINK */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10 text-center text-sm text-ink/60">
          <a href="/rss.xml" className="hover:text-burgundy-600">
            Subscribe via RSS
          </a>
        </div>
      </section>
    </main>
  );
}
