import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { VideoPlayer } from "@/components/site/VideoPlayer";
import {
  getAllVideoSlugs,
  getVideoBySlug,
  getPublishedVideos,
  formatVideoDate,
  humanDuration,
} from "@/lib/videos";
import { breadcrumbListSchema, videoSchemaFromItem } from "@/lib/schema";

type RouteParams = { slug: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  return getAllVideoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getVideoBySlug(slug);
  if (!item) return { title: "Video not found" };
  const url = `/videos/${item.frontmatter.slug}`;
  return {
    title: item.frontmatter.title,
    description: item.frontmatter.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: item.frontmatter.title,
      description: item.frontmatter.excerpt,
      // video.other's OG type does not accept publishedTime/releaseDate in
      // Next's Metadata types. The publish date is carried by the VideoObject
      // JSON-LD instead, which is what crawlers actually read here.
      type: "video.other",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: item.frontmatter.title,
      description: item.frontmatter.excerpt,
    },
  };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const item = getVideoBySlug(slug);
  if (!item) notFound();

  const fm = item.frontmatter;
  const runtime = humanDuration(fm.duration);

  const related = getPublishedVideos()
    .filter((v) => v.frontmatter.slug !== slug)
    .slice(0, 3);

  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Videos", path: "/videos" },
    { name: fm.title, path: `/videos/${slug}` },
  ]);

  // The transcript is split on blank lines in the source MDX, so each paragraph
  // renders as its own <p>. Deliberately not compiled as MDX: a transcript is
  // plain speech and should never execute components.
  const paragraphs = item.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={videoSchemaFromItem(item)} />

      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Badge
            variant="secondary"
            className="bg-burgundy-100 text-burgundy-700 border-0"
          >
            {fm.pillar ?? "Video"}
          </Badge>
          <h1 className="mt-6 leading-[1.05]">{fm.title}</h1>
          <p className="mt-4 text-sm text-ink/60">
            {formatVideoDate(item.datePublished)}
            {runtime ? ` · ${runtime}` : null}
          </p>
          <p className="mt-6 max-w-prose text-lg text-ink/80">{fm.excerpt}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex justify-center">
          <VideoPlayer
            title={fm.title}
            youtubeId={fm.youtubeId}
            videoUrl={fm.videoUrl}
            poster={fm.poster}
          />
        </div>

        <GoldRule className="my-12" />

        <h2 className="text-2xl">Full transcript</h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/85">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-14 rounded-xl bg-navy px-8 py-10 text-center text-cream">
          <h2 className="text-2xl text-cream">
            Everything a family needs here is free.
          </h2>
          <p className="mx-auto mt-4 max-w-prose text-cream/80">
            Twenty modules and sixty-nine tools in the Blueprint, and the
            Roadmap that lays your situation out on one page. No cost, and no
            pressure to sell anything.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/the-blueprint">Get the free Blueprint</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/work-with-ryan">Get the free Roadmap</Link>
            </Button>
          </div>
        </div>

        {related.length > 0 ? (
          <>
            <GoldRule className="my-12" />
            <h2 className="text-2xl">More videos</h2>
            <ul className="mt-6 space-y-4">
              {related.map((v) => (
                <li key={v.frontmatter.slug}>
                  <Link
                    href={`/videos/${v.frontmatter.slug}`}
                    className="text-lg underline-offset-4 hover:underline"
                  >
                    {v.frontmatter.title}
                  </Link>
                  <p className="mt-1 text-sm text-ink/70">
                    {v.frontmatter.excerpt}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>
    </main>
  );
}
