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
import {
  getAllMediaSlugs,
  getAllMedia,
  getMediaBySlug,
  formatMediaDate,
  getYouTubeId,
} from "@/lib/media";
import { breadcrumbListSchema, mediaSchemaFromItem } from "@/lib/schema";

type RouteParams = { slug: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  return getAllMediaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getMediaBySlug(slug);
  if (!item) return { title: "Episode not found" };
  const url = `/media/${item.frontmatter.slug}`;
  return {
    title: item.frontmatter.title,
    description: item.frontmatter.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: item.frontmatter.title,
      description: item.frontmatter.excerpt,
      type: "article",
      url,
      publishedTime: item.datePublished,
      modifiedTime: item.dateModified,
      authors: ["Ryan Riggins"],
    },
    twitter: {
      card: "summary_large_image",
      title: item.frontmatter.title,
      description: item.frontmatter.excerpt,
    },
  };
}

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const item = getMediaBySlug(slug);
  if (!item) notFound();

  const { content } = await compileMDX({ source: item.content });

  const youtubeUrl = item.frontmatter.links?.find((l) =>
    /youtu\.?be/i.test(l)
  );
  const ytId = youtubeUrl ? getYouTubeId(youtubeUrl) : null;

  const related = getAllMedia()
    .filter((p) => p.frontmatter.slug !== slug)
    .slice(0, 3);

  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Media", path: "/media" },
    { name: item.frontmatter.title, path: `/media/${slug}` },
  ]);

  return (
    <main>
      <JsonLd data={mediaSchemaFromItem(item)} />
      <JsonLd data={breadcrumbs} />

      {/* HEADER */}
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Link
            href="/media"
            className="text-sm font-semibold text-burgundy-600 hover:text-burgundy-700"
          >
            &larr; All appearances
          </Link>
          <div className="mt-6 text-sm font-semibold uppercase tracking-wider text-burgundy-600">
            Podcast &middot; {formatMediaDate(item.datePublished)}
          </div>
          <h1 className="mt-4 leading-[1.1]">{item.frontmatter.title}</h1>
          <div className="mt-6 font-serif text-xl text-navy-700">
            {item.frontmatter.podcast}
          </div>
          <div className="text-ink/70">
            Hosted by {item.frontmatter.host}
          </div>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed">
            {item.frontmatter.excerpt}
          </p>
        </div>
      </section>

      {/* EMBED */}
      {ytId && (
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-6 pt-12">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                title={item.frontmatter.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </section>
      )}

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
                Licensed NC broker (#361546, eXp Realty). Fiduciary duty to
                the family, not a pitch. Creator of The Blueprint and
                SeniorSafe.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <Button asChild size="sm">
                  <Link href="/the-blueprint">See The Blueprint</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link
                    href="/work-with-ryan"
                    data-track="book_call_click"
                    data-track-params='{"location":"media-post-author-card"}'
                  >
                    Book a free 20-min call
                  </Link>
                </Button>
                <SocialLinks
                  className="ml-auto text-navy-700"
                  iconClassName="h-4 w-4"
                />
              </div>
              <EmailFallback className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <GoldRule />
            <h2 className="mt-3 text-2xl md:text-3xl">More appearances.</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.frontmatter.slug}
                  href={`/media/${r.frontmatter.slug}`}
                  className="group block border border-border rounded-lg p-5 hover:border-burgundy-600 transition-colors"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                    {formatMediaDate(r.datePublished)}
                  </div>
                  <h3 className="mt-2 font-serif text-lg text-navy-700 leading-snug group-hover:text-burgundy-700 transition-colors">
                    {r.frontmatter.title}
                  </h3>
                  <div className="mt-2 text-sm text-ink/70">
                    {r.frontmatter.podcast}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
