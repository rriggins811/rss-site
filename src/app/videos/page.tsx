import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema, collectionPageSchema } from "@/lib/schema";
import { getPublishedVideos, formatVideoDate, humanDuration } from "@/lib/videos";
import { abs } from "@/lib/site";

const DESCRIPTION =
  "Short videos on senior transitions from Ryan Riggins, who spent eight years on the cash-buyer side before switching. Every one has a full transcript, so you can read it instead of watching.";

export const metadata: Metadata = {
  title: "Videos | Senior Transition Straight Talk",
  description: DESCRIPTION,
  alternates: { canonical: "/videos" },
};

export default function VideosIndexPage() {
  const items = getPublishedVideos();

  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Videos", path: "/videos" },
  ]);

  const collection =
    items.length > 0
      ? collectionPageSchema({
          name: "Videos | Senior Transition Straight Talk",
          description: DESCRIPTION,
          pageUrl: abs("/videos"),
          items: items.map((v) => ({
            name: v.frontmatter.title,
            itemUrl: abs(`/videos/${v.frontmatter.slug}`),
            description: v.frontmatter.excerpt,
          })),
        })
      : null;

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      {collection ? <JsonLd data={collection} /> : null}

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Badge
            variant="secondary"
            className="bg-burgundy-100 text-burgundy-700 border-0"
          >
            Videos
          </Badge>
          <h1 className="mt-6 leading-[1.05]">
            Short answers to the expensive questions.
          </h1>
          <p className="mt-6 max-w-prose text-lg text-ink/80">{DESCRIPTION}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        {items.length === 0 ? (
          <p className="text-ink/70">New videos are on the way.</p>
        ) : (
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((v) => {
              const runtime = humanDuration(v.frontmatter.duration);
              return (
                <li key={v.frontmatter.slug}>
                  <Link
                    href={`/videos/${v.frontmatter.slug}`}
                    className="group block"
                  >
                    <h2 className="text-xl leading-snug underline-offset-4 group-hover:underline">
                      {v.frontmatter.title}
                    </h2>
                    <p className="mt-2 text-sm text-ink/60">
                      {formatVideoDate(v.datePublished)}
                      {runtime ? ` · ${runtime}` : null}
                    </p>
                    <p className="mt-3 text-ink/80">{v.frontmatter.excerpt}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <GoldRule className="my-14" />

        <p className="max-w-prose text-ink/80">
          Every video here has the whole script written out underneath it. If you
          would rather not watch, read it. Nothing is held back for the video.
        </p>
      </section>
    </main>
  );
}
