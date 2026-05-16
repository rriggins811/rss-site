import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { QuickAnswer } from "@/components/aeo/QuickAnswer";
import { JsonLd } from "@/components/site/JsonLd";
import {
  enrichedPersonSchema,
  clientReviewsSchema,
  type ClientReview,
} from "@/lib/schema";

// Real client testimonials. Each entry emits a Review JSON-LD entity tied
// to the RSS ProfessionalService — strong E-E-A-T signal.
//
// RULES (per the Round 2 prompt — do NOT break these):
//   1. Only paste REAL testimonials. Empty array is fine.
//   2. authorName must match how the client's name appears on the source
//      platform (Google Business, LinkedIn rec, email signature, etc.)
//      Don't shorten "Sarah Williams" to "Sarah W." — Google compares
//      structured data against visible content and against the platform.
//   3. reviewBody is the verbatim review text. Don't paraphrase, don't
//      add ellipses, don't trim. If it's long, that's fine.
//   4. datePublished is ISO format (YYYY-MM-DD) or year only (YYYY).
//   5. publisher is the platform name if applicable. "Google" for Google
//      Business reviews, "LinkedIn" for LinkedIn recommendations, etc.
//      Omit for direct testimonials emailed to Ryan.
const RYAN_REVIEWS: ClientReview[] = [
  {
    // Verbatim from the Google Business Profile review by Scarlett Begonias
    // (Local Guide, 42 reviews). Captured May 16, 2026 — the review was 13
    // weeks old at capture, which puts it at approximately Feb 14, 2026.
    // Google doesn't surface the exact day in the public UI; using the
    // computed week-13 date as an honest approximation.
    authorName: "Scarlett Begonias",
    ratingValue: 5,
    reviewBody:
      "This is a wonderful business. Ryan and team is an excellent source in providing all the information and services for relocation. From selling your current home to assisting in contacting contractors that can accommodate your move easily and reasonably priced. A great asset for older people and anyone with a busy schedule. A one stop shop for your move. They are professional, courteous and prompt. I will be using them again for my next real estate transaction.",
    datePublished: "2026-02-14",
    publisher: "Google",
  },
];

export const metadata: Metadata = {
  title: "About Ryan Riggins",
  description:
    "Senior Transition Advisor helping families avoid the $50K mistakes of a senior housing transition. Not a move manager, not a listing agent. Greensboro, NC.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "https://rigginsstrategicsolutions.com/about",
    siteName: "Riggins Strategic Solutions",
    title: "About Ryan Riggins | Riggins Strategic Solutions",
    description:
      "Senior Transition Advisor helping families avoid the $50K mistakes of a senior housing transition. Not a move manager, not a listing agent. Greensboro, NC.",
    images: [
      {
        url: "https://rigginsstrategicsolutions.com/photos/hero_ryan_consulting_family.jpg",
        width: 2752,
        height: 1536,
        alt: "Ryan Riggins consulting with an elderly couple at a kitchen table",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Ryan Riggins | Riggins Strategic Solutions",
    description:
      "Senior Transition Advisor helping families avoid the $50K mistakes of a senior housing transition.",
    images: ["https://rigginsstrategicsolutions.com/photos/hero_ryan_consulting_family.jpg"],
  },
};

const credentials: { title: string; body: string }[] = [
  {
    title: "Real-world experience",
    body: "15+ property renovations personally managed. Hands-on, not theory.",
  },
  {
    title: "Construction & project management",
    body: "Years managing vendors, timelines, and budgets across renovations, restaurants, and insurance claims.",
  },
  {
    title: "Licensed for fiduciary duty",
    body: "Licensed NC broker (#361546, eXp Realty). Full fiduciary duty to the family, not a pitch.",
  },
  {
    title: "Systems thinker",
    body: "Frameworks, checklists, and decision tools that replace guesswork with a repeatable process.",
  },
  {
    title: "Empathy & patience",
    body: "Respect for the senior's dignity and the family's timeline. No rush, no pressure.",
  },
  {
    title: "Insider protection",
    body: "I know exactly how investors and quick-cash buyers think. I use that knowledge to protect families from predatory offers.",
  },
];

export default function AboutPage() {
  const reviewSchemas = clientReviewsSchema(RYAN_REVIEWS);

  return (
    <main>
      <JsonLd data={enrichedPersonSchema()} />
      {reviewSchemas ? <JsonLd data={reviewSchemas} /> : null}

      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <Badge variant="secondary" className="bg-burgundy-100 text-burgundy-700 border-0">
              About Ryan
            </Badge>
            <h1 className="mt-6 leading-tight">
              I&rsquo;m Ryan Riggins. Senior Transition Advisor.
            </h1>
            <QuickAnswer
              className="mt-6 max-w-prose"
              topic="About Ryan"
              question="Who is Ryan Riggins?"
              answer="Ryan Riggins is the founder of Riggins Strategic Solutions, a consumer protection company for families going through senior transitions. He spent eight years in construction project management and house flipping before switching sides to help the families he used to do business with. Two books on Amazon. North Carolina real estate license number 361546."
            />
            <p className="mt-6 max-w-prose font-serif text-xl text-burgundy-600 leading-snug">
              &ldquo;I&rsquo;m not a move manager and I&rsquo;m not a listing
              agent. I&rsquo;m the advisor who helps families avoid the $50K
              mistakes.&rdquo;
            </p>
            <p className="mt-4 text-sm text-ink/70">
              Greensboro, NC · Serving families nationwide
            </p>
            <p className="mt-6 max-w-prose text-ink/80">
              My real expertise comes from 8+ years in the trenches. Flipping
              houses, managing renovations, and watching families get taken
              advantage of during the hardest moments of their lives.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/work-with-ryan">Book your free 20-minute call</Link>
            </Button>
          </div>
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-xl shadow-navy-900/10">
            <Image
              src="/photos/about_hero_ryan_portrait.jpg"
              alt="Ryan Riggins professional portrait"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* WHO I AM */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <GoldRule />
          <h2 className="mt-3">Who I am.</h2>
          <div className="mt-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <p>
              I&rsquo;m the founder of Riggins Strategic Solutions. Before that, I
              wore a lot of hats: house flipper, construction project manager,
              restaurant operator, insurance adjuster.
            </p>
            <p>
              What that combination buys you: I can walk through a property and tell
              you in 10 minutes what needs fixing, what doesn&rsquo;t, and what a
              contractor is about to try to oversell you on. Most families waste
              $30,000 to $50,000 on updates that don&rsquo;t return a dime at
              closing. That&rsquo;s the mistake I was built to stop.
            </p>
          </div>
        </div>
      </section>

      {/* SWITCHED SIDES */}
      <section className="bg-burgundy-700 text-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 lg:grid-cols-5 items-center">
          <div className="lg:col-span-3">
            <GoldRule />
            <h2 className="mt-3 text-cream">
              Why I started Riggins Strategic Solutions.
            </h2>
            <div className="mt-6 space-y-5 text-lg text-cream/90 leading-relaxed">
              <p>
                For 8 years I flipped houses. More than half of what I bought came
                from seniors or the adult children who&rsquo;d just inherited Mom&rsquo;s
                house.
              </p>
              <p>
                I saw the same pattern over and over. Families making rushed
                decisions under crisis pressure. Adult kids accepting the first
                quick-cash offer because nobody had laid out the options. $50,000 or
                $100,000 of equity walking out the door because there was no plan.
              </p>
              <p className="font-serif text-2xl text-gold-300">
                I decided I couldn&rsquo;t be on that side of the table anymore.
              </p>
              <p>
                Now I use everything I learned as an investor — how the pricing
                games work, what contractors pad, which exit strategies actually
                protect equity — to put families in the driver&rsquo;s seat.
              </p>
              <p className="text-cream font-semibold">Welcome to the helpful side.</p>
            </div>
          </div>
          <div className="lg:col-span-2 relative aspect-square rounded-lg overflow-hidden bg-cream/5">
            <Image
              src="/photos/flipper_now_protector_brand_narrative.png"
              alt="Graphic: flipper turned protector"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-contain p-6"
            />
          </div>
        </div>
      </section>

      {/* WHAT I BRING */}
      <section className="bg-sand border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">What I bring to the table.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {credentials.map((c) => (
              <Card key={c.title} className="bg-white">
                <CardContent className="pt-6">
                  <h3 className="font-serif text-xl text-navy-700">{c.title}</h3>
                  <p className="mt-3 text-ink/80">{c.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BEYOND THE ADVISORY */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="/photos/family_consultation_ryan.jpg"
              alt="Ryan meeting with a multigenerational family"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <GoldRule />
            <h2 className="mt-3">Beyond the advisory.</h2>
            <div className="mt-6 space-y-5 text-ink/85 text-lg leading-relaxed">
              <p>
                I also built <strong>SeniorSafe</strong>, a family coordination app
                for the ongoing part of senior care. Daily check-ins, medication
                tracking, document vault, AI assistant, family messaging. $14.99 a
                month after a 14-day free trial.
              </p>
              <p>
                And I wrote two books on having the hard conversations:{" "}
                <em>The Unheard Conversation</em> and{" "}
                <em>The Other Side of the Conversation</em>. Both on Amazon.
              </p>
              <p>
                The advisory work, the app, the books — different shapes, same job:
                help families handle this without losing their money or their minds.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/seniorsafe-app">See SeniorSafe</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Say hi</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT TESTIMONIALS — visible render of the same RYAN_REVIEWS
          array that powers the Review JSON-LD schema mounted at the top
          of this page. Single source of truth so the schema-must-match-
          visible-content rule is enforced structurally. Mounts only when
          there's at least one real review to show. */}
      {RYAN_REVIEWS.length > 0 && (
        <section className="bg-cream border-y border-border">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <GoldRule />
            <h2 className="mt-3">What clients say.</h2>
            <p className="mt-4 text-ink/70 text-base max-w-2xl">
              Real reviews from real families. We don&rsquo;t solicit them — these
              come in unprompted when the work lands.
            </p>
            <ul
              className={
                "mt-12 grid gap-6 " +
                (RYAN_REVIEWS.length === 1
                  ? "max-w-2xl mx-auto"
                  : "md:grid-cols-2")
              }
            >
              {RYAN_REVIEWS.map((r) => (
                <li key={`${r.authorName}-${r.datePublished}`}>
                  <Card className="bg-white h-full">
                    <CardContent className="pt-6 flex flex-col h-full">
                      {/* Star rating — visible match for the Rating in the
                          Review JSON-LD. Filled gold star for each
                          ratingValue point. */}
                      <div
                        aria-label={`${r.ratingValue} out of 5 stars`}
                        className="flex gap-1 text-gold-500"
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            aria-hidden
                            className={
                              i < r.ratingValue ? "text-gold-500" : "text-ink/15"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {/* Verbatim review body (italic). Must match the
                          reviewBody field in the JSON-LD exactly — do not
                          paraphrase or truncate. */}
                      <blockquote className="mt-5 font-serif text-lg text-ink/90 leading-relaxed italic">
                        &ldquo;{r.reviewBody}&rdquo;
                      </blockquote>
                      <div className="mt-6 pt-5 border-t border-border text-sm text-ink/70">
                        <p className="font-semibold text-navy-700 not-italic">
                          {r.authorName}
                        </p>
                        <p className="mt-1">
                          {formatReviewDate(r.datePublished)}
                          {r.publisher ? ` · via ${r.publisher}` : ""}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-navy-600 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">Let&rsquo;s talk.</h2>
          <p className="mt-6 text-lg text-cream/85 max-w-2xl mx-auto">
            Free 20-minute call. You bring the situation. I&rsquo;ll bring straight
            answers.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gold-500 text-navy-900 hover:bg-gold-300">
            <Link href="/work-with-ryan">Book your free call</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

/**
 * Format a review's datePublished ("2026-02-14" or "2026") to a human
 * "February 2026" / "2026" string for visible display. The schema keeps
 * the ISO format; this is just for the rendered card.
 */
function formatReviewDate(iso: string): string {
  // Year-only form ("2026"). Just return it.
  if (/^\d{4}$/.test(iso)) return iso;
  // Full ISO date — format as "Month Year". Use UTC parsing to avoid TZ
  // edge cases that shift the displayed month.
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
