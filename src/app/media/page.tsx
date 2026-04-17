import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema } from "@/lib/schema";
import { getAllMedia, formatMediaDate } from "@/lib/media";

export const metadata: Metadata = {
  title: "Media — Podcasts & Press",
  description:
    "Podcast appearances and press where Senior Transition Advisor Ryan Riggins talks about senior housing transitions, family equity, and the $50K mistakes most families never see coming.",
  alternates: { canonical: "/media" },
};

export default function MediaIndexPage() {
  const items = getAllMedia();

  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Media", path: "/media" },
  ]);

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Badge
            variant="secondary"
            className="bg-burgundy-100 text-burgundy-700 border-0"
          >
            Media
          </Badge>
          <h1 className="mt-6 leading-[1.05]">
            Podcasts and press.
          </h1>
          <p className="mt-6 max-w-prose text-lg text-ink/80">
            Conversations with hosts and reporters on senior housing
            transitions, family equity, and the mistakes that cost families
            $50K or more. Senior Transition Advisor Ryan Riggins.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-white border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">Appearances.</h2>

          {items.length === 0 ? (
            <p className="mt-10 text-ink/70">
              New appearances will be posted here as they air.
            </p>
          ) : (
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {items.map((item) => (
                <Link
                  key={item.frontmatter.slug}
                  href={`/media/${item.frontmatter.slug}`}
                  className="group block bg-white border border-border rounded-lg overflow-hidden hover:border-burgundy-600 transition-colors"
                >
                  <div className="p-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                      Podcast &middot; {formatMediaDate(item.datePublished)}
                    </div>
                    <h3 className="mt-3 font-serif text-2xl font-bold text-navy-700 leading-snug group-hover:text-burgundy-700 transition-colors">
                      {item.frontmatter.title}
                    </h3>
                    <div className="mt-3 text-sm text-navy-600 font-semibold">
                      {item.frontmatter.podcast}
                    </div>
                    <div className="text-sm text-ink/70">
                      Hosted by {item.frontmatter.host}
                    </div>
                    <p className="mt-4 text-ink/80 leading-relaxed">
                      {item.frontmatter.excerpt}
                    </p>
                    <span className="mt-6 inline-flex items-center text-burgundy-600 font-semibold group-hover:text-burgundy-700">
                      See the episode &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="bg-navy-600 text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <GoldRule />
          <h2 className="mt-4 text-white">Booking Ryan.</h2>
          <p className="mt-4 text-white/85 leading-relaxed max-w-prose mx-auto">
            Producers and reporters working on stories about senior housing
            transitions, family caregiving, or the financial side of aging
            can reach Ryan directly.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:ryan@rigginsstrategicsolutions.com"
              className="inline-flex items-center justify-center rounded-md bg-white text-navy-700 font-semibold px-5 py-3 hover:bg-gold-100 transition-colors"
            >
              Email Ryan
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-white/30 text-white font-semibold px-5 py-3 hover:bg-white/10 transition-colors"
            >
              All contact options
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
