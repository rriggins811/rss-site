import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { LeadMagnetForm } from "@/components/forms/LeadMagnetForm";
import {
  breadcrumbListSchema,
  collectionPageSchema,
} from "@/lib/schema";
import { TOOLS } from "@/lib/tools";
import { HUB_LEAD_MAGNETS } from "@/lib/lead-magnets";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Senior Transition Guides",
  description:
    "Free guides for adult children navigating their parents' senior transitions. Practical, no-fluff. Built from 8+ years of construction, real estate, and family-side experience.",
  alternates: { canonical: "/guides" },
  openGraph: {
    type: "website",
    url: "https://rigginsstrategicsolutions.com/guides",
    siteName: "Riggins Strategic Solutions",
    title: "Free Senior Transition Guides | Riggins Strategic Solutions",
    description:
      "Free guides for adult children navigating their parents' senior transitions. Practical, no-fluff. Use them. Share them. They're free.",
    images: [
      {
        url: "https://rigginsstrategicsolutions.com/brand/ryan-headshot.jpg",
        width: 1200,
        height: 670,
        alt: "Free senior transition guides from Riggins Strategic Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Senior Transition Guides | Riggins Strategic Solutions",
    description:
      "Free guides for adult children navigating their parents' senior transitions. Practical, no-fluff.",
  },
};

// Placeholder guides — published concepts TBD per the 12-month plan
// (Months 2-4 buildout). Each card's CTA points to /freeguide so visitor
// interest converts to a notification-list subscriber who gets emailed
// when the guide goes live.
//
// As real magnets ship, REMOVE the thematically-matching placeholder
// from this list. Removed so far:
//   - "wholesaler and cash-buyer red flags" → Cash Buyer Beware (May 18)
//   - "adult children weighing aging-in-place vs assisted living" →
//     Aging in Place vs Assisted Living (May 18)
//   - "families navigating a parent's sudden hospitalization" →
//     When Mom Falls at 2 AM Crisis Playbook (May 18)
const PLACEHOLDER_GUIDES: { title: string; audience: string }[] = [
  { title: "Guide 4 — Coming Soon", audience: "families starting a parent's home sale" },
  { title: "Guide 5 — Coming Soon", audience: "families wary of wholesaler home offers" },
  { title: "Guide 6 — Coming Soon", audience: "the sandwich generation managing burnout" },
  { title: "Guide 7 — Coming Soon", audience: "siblings coordinating a parent's care from out of state" },
];

// The 3 SEO-optimized free tools we want to surface alongside the guides
// on this hub page. Pulled from the central tools registry so titles and
// descriptions stay in sync with /tools/[slug] pages.
const FEATURED_TOOL_SLUGS = [
  "net-proceeds-calculator",
  "caregiver-burnout-triage",
  "medicare-gap-analyzer",
] as const;

export default function GuidesPage() {
  const featuredTools = FEATURED_TOOL_SLUGS
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ]);

  // CollectionPage ItemList includes:
  //   1. Every real LEAD_MAGNETS entry (using the /guides#slug anchor so AI
  //      tools route visitors through the email gate, not direct PDF)
  //   2. The 3 featured tools
  // Placeholder cards intentionally omitted from the schema — they all
  // CTA to /freeguide so distinct-URL constraint would fail.
  const collection = collectionPageSchema({
    name: "Free Senior Transition Guides",
    description:
      "Free downloadable guides and interactive tools for adult children navigating their parents' senior transitions.",
    pageUrl: abs("/guides"),
    items: [
      ...HUB_LEAD_MAGNETS.map((m) => ({
        name: m.title,
        itemUrl: `${abs("/guides")}#${m.slug}`,
        description: m.description,
      })),
      ...featuredTools.map((t) => ({
        name: t.title,
        itemUrl: abs(`/tools/${t.slug}`),
        description: t.description,
      })),
    ],
  });

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={collection} />

      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <Badge variant="secondary" className="bg-burgundy-100 text-burgundy-700 border-0">
            Free Resources
          </Badge>
          <h1 className="mt-6 leading-[1.05]">
            Free Guides for Families Navigating Senior Transitions
          </h1>
          <p className="mt-6 text-lg text-ink/80 max-w-2xl">
            Practical, no-fluff guides built from 8+ years of construction,
            real estate, and family-side experience. Use them. Share them.
            They&apos;re free.
          </p>
          <p className="mt-4 text-base text-ink/70 max-w-2xl">
            Built for the adult child managing a parent&apos;s next move —
            whether that means aging in place, assisted living, selling the
            family home, or just figuring out what comes next. No sales
            pitch, no upsell, no &ldquo;we buy houses&rdquo; gotcha.
          </p>
          <GoldRule className="mt-8" />
        </div>
      </section>

      {/* AVAILABLE NOW — real downloadable lead magnets. Renders one card
          per LEAD_MAGNETS entry, each with an inline LeadMagnetForm that
          email-gates the PDF. Section silently omitted when registry empty. */}
      {HUB_LEAD_MAGNETS.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Available now
            </h2>
            <p className="mt-4 text-base text-ink/70 max-w-2xl">
              Free downloadable guides. Enter your email to get the PDF and
              we&apos;ll add you to the no-spam notification list for future
              guides.
            </p>

            <ul
              className={
                "mt-10 grid gap-8 " +
                (HUB_LEAD_MAGNETS.length === 1
                  ? "max-w-3xl mx-auto"
                  : "md:grid-cols-2")
              }
            >
              {HUB_LEAD_MAGNETS.map((magnet) => (
                <li key={magnet.slug} id={magnet.slug}>
                  <Card className="h-full">
                    <CardHeader>
                      <Badge
                        variant="outline"
                        className="w-fit border-navy-700/30 text-navy-700"
                      >
                        Free · {magnet.pageCount} pages
                      </Badge>
                      <CardTitle className="mt-3 text-2xl">
                        {magnet.title}
                      </CardTitle>
                      <p className="mt-1 text-base font-semibold text-burgundy-600">
                        {magnet.subtitle}
                      </p>
                      <CardDescription className="mt-3 text-ink/75 leading-relaxed text-base">
                        {magnet.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <LeadMagnetForm magnet={magnet} />
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* COMING SOON — remaining placeholders. As LEAD_MAGNETS grows,
          remove the matching thematic placeholder from this list above. */}
      {PLACEHOLDER_GUIDES.length > 0 && (
        <section className="bg-cream">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Coming soon
            </h2>
            <p className="mt-4 text-base text-ink/70 max-w-2xl">
              {PLACEHOLDER_GUIDES.length}
              {" "}
              more guides are in the oven, each tackling a different
              transition decision. Sign up below and we&apos;ll send each one
              the day it goes live.
            </p>

            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {PLACEHOLDER_GUIDES.map((g) => (
                <li key={g.title}>
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <Badge variant="outline" className="w-fit border-burgundy-200 text-burgundy-700">
                        Coming Soon
                      </Badge>
                      <CardTitle className="mt-3 text-xl">{g.title}</CardTitle>
                      <CardDescription className="text-ink/70">
                        A practical guide for {g.audience}. Building now —
                        sign up to be notified when it goes live.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/freeguide">Notify Me</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* AVAILABLE RIGHT NOW — 3 SEO-optimized free tools. Surfaces real
          working tools alongside the guides so the page isn't waiting on
          future content to be useful today. */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Interactive tools, ready now
          </h2>
          <p className="mt-4 text-base text-ink/70 max-w-2xl">
            Free interactive tools you can use right now. Each one answers
            a specific question families get wrong by tens of thousands of
            dollars.
          </p>

          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredTools.map((t) => (
              <li key={t.slug}>
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg leading-snug">
                      {t.title}
                    </CardTitle>
                    <CardDescription className="text-ink/70 mt-2">
                      {t.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button asChild className="w-full">
                      <Link href={`/tools/${t.slug}`}>Open the tool</Link>
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/tools">See all interactive tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CLOSING CTA — the Simple Blueprint is the canonical free-tier
          entry into the funnel, so end the page pointing there. */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Start with the Simple Blueprint
          </h2>
          <p className="mt-4 text-base text-ink/70">
            The free starter guide. The first three moves most families get
            wrong, and how to avoid them. Short enough to read on a lunch
            break.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/freeguide">Get the Simple Blueprint</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
