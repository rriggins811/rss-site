import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { BrandPanel } from "@/components/site/BrandPanel";
import { FAQSection, type FAQItem } from "@/components/aeo/FAQSection";
import { JsonLd } from "@/components/site/JsonLd";
import { professionalServiceSchema } from "@/lib/schema";
import { RYAN_REVIEWS } from "@/lib/reviews";

/**
 * Homepage, StoryBrand structure (rebuilt Aug 10 2026).
 *
 * The family is the hero, Ryan is the guide. The page runs in grunt-test
 * order so a stranger knows within five seconds what is offered, how it makes
 * their life better, and what to do next: header, stakes, guide, plan,
 * agreement, success, repeat the call to action.
 *
 * One primary CTA, /work-with-ryan, repeated twice and nowhere contradicted.
 * Everything secondary lives in the footer. The three blocks kept below the
 * plan (directory, testimonials, FAQ) are held back deliberately: they carry
 * real organic traffic and the FAQ block is the page's FAQPage schema, so
 * they sit under the story rather than competing with it.
 */

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    url: "https://rigginsstrategicsolutions.com",
    siteName: "Riggins Strategic Solutions",
    title: "Riggins Strategic Solutions | Senior Transition Advisor",
    description:
      "Handle your parent's move without losing their money, their home, or your peace. A free plan and a guide who has been on both sides of the table.",
    images: [
      {
        url: "https://rigginsstrategicsolutions.com/og/homepage.png",
        width: 1200,
        height: 630,
        alt: "Riggins Strategic Solutions, Senior Transition Advisor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riggins Strategic Solutions | Senior Transition Advisor",
    description:
      "Handle your parent's move without losing their money, their home, or your peace.",
    images: ["https://rigginsstrategicsolutions.com/og/homepage.png"],
  },
};

const planSteps: { n: string; title: string; body: string }[] = [
  {
    n: "1",
    title: "Get the free Blueprint",
    body: "See every option laid out, not just the one someone is trying to sell you.",
  },
  {
    n: "2",
    title: "When it is time to deal with the house, talk to Ryan first",
    body: "One conversation, before you call anybody else. It costs you nothing and it changes what you know.",
  },
  {
    n: "3",
    title: "Ryan puts you with a vetted local agent",
    body: "Or tells you straight if the right move is to wait, or not to sell at all. You are never alone in that room.",
  },
];

const agreement: string[] = [
  "You never sit through the audition. No three appointments, no comparing three prices you cannot check, nobody you have to tell no.",
  "You will never be pushed to sell. “Don’t sell yet” always stays on the table.",
  "No added cost. The referral is paid from the commission you would already pay.",
  "Ryan stays in your corner, a second set of eyes, start to finish.",
];

const homeFaqs: FAQItem[] = [
  {
    question: "How do I help my aging parent decide whether to sell their house?",
    answer:
      "Start by listening, not selling. Most parents resist because they fear losing autonomy or burdening you, not because they don't see the math. Have an honest conversation about their daily reality, document maintenance costs and time, then bring in a Senior Real Estate Specialist (SRES) who works for the family, not the sale. Senior Transition Blueprint walks you through this conversation step by step.",
  },
  {
    question: "Do I need power of attorney to sell my parent's home?",
    answer:
      "Yes, if your parent is mentally competent they can sign their own paperwork, but most families benefit from a power of attorney (POA) document signed in advance. If your parent has lost capacity without a POA in place, you'll need to petition the court for guardianship, which is more expensive and takes months. Talk to an elder law attorney early.",
  },
  {
    question:
      "What's the difference between a Senior Real Estate Specialist and a regular agent?",
    answer:
      "A Senior Real Estate Specialist (SRES) has specific training in working with adults 50+, including understanding Medicare timing, downsizing logistics, and the emotional weight of selling a long-time family home. Regular agents are trained to close deals fast. SRES agents are trained to protect the family.",
  },
  {
    question:
      "How do I spot a wholesaler trying to take advantage of my elderly parent?",
    answer:
      "Wholesalers send 'we buy houses' mailers, knock on doors, or cold call with cash offers 30-50% below market value. They prey on urgency and confusion. Red flags: no MLS listing, no inspection, 'as-is' only, and pressure to sign within 48 hours. A real buyer goes through proper channels and lets you get a second opinion.",
  },
  {
    question: "How much does assisted living cost in 2026?",
    answer:
      "National average is around $5,500/month for assisted living, $9,000+/month for memory care. Costs vary 2-3x by state and city. Most families dramatically underestimate. Sale of the home is often the funding source, which is why getting the sale right matters so much for long-term care affordability.",
  },
  {
    question: "What if my parent refuses to even talk about moving?",
    answer:
      "This is the most common situation. The right approach depends on your parent's personality (we identify five 'parent personas' in the Blueprint). For most families, the answer isn't pushing harder but creating safety: small conversations over months, addressing their specific fears, and bringing in a neutral third party when emotions run high.",
  },
  {
    // Corrected Aug 10 2026: this previously read "missing the Medicare
    // lookback window". There is no Medicare look-back. The 60-month
    // look-back is Medicaid, and it penalizes transfers for less than fair
    // market value (gifting or deeding the home), not selling at market.
    question:
      "How do I avoid the $50K mistakes most families make in a senior transition?",
    answer:
      "The five most expensive mistakes: selling to a wholesaler at 30-50% under market, choosing the wrong care level (paying for memory care when assisted living suffices), transferring the home to a child in a way that triggers the Medicaid 60-month look-back penalty, signing predatory CCRC contracts without legal review, and waiting too long so urgency forces bad decisions. Each one is preventable with the right framework.",
  },
  {
    question: "Are senior referral services like A Place for Mom really free?",
    answer:
      "Free to you, but they're paid commissions by the facilities they refer you to (typically 50-100% of the first month's rent). This creates a built-in conflict: they're motivated to recommend facilities that pay them, not necessarily the ones best for your parent. Always do independent research alongside their recommendations.",
  },
  {
    question:
      "What's the difference between independent living, assisted living, and memory care?",
    answer:
      "Independent living is for active seniors who want community without medical support. Assisted living adds help with daily activities (bathing, medication, meals). Memory care is specialized for dementia and Alzheimer's with locked units and 24/7 trained staff. Each tier roughly doubles in cost. Most families overshoot the level needed.",
  },
  {
    question: "How do I get my siblings on the same page about parents' care?",
    answer:
      "Sibling conflict is the #1 reason senior transitions go badly. Schedule a structured family meeting (not a casual call), bring in objective data on parents' status, and assign clear roles based on geography and skills. The Blueprint includes a sibling alignment framework that has prevented family fractures in dozens of cases.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Person schema for the guide is NOT emitted here: layout.tsx already
          ships personSchema() sitewide under the same @id, so a second block
          would be redundant rather than a stronger signal. */}
      <JsonLd data={professionalServiceSchema()} />

      {/* 1. HEADER (the 5-second test) */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-700/70">
              Ryan Riggins | Senior Transition Advisor and Advocate
            </p>
            <h1 className="mt-4 leading-[1.05]">
              Handle your parent&rsquo;s move without losing their money, their
              home, or <span className="text-burgundy-600">your peace.</span>
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink/80">
              You did not ask to become an expert in any of this, and you should
              not have to be one to protect your own parent. Get a free plan and
              a guide who has been on both sides of the table, and who never
              takes the listing.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link
                  href="/work-with-ryan"
                  data-track="book_call_click"
                  data-track-params='{"location":"home-hero"}'
                >
                  Get Ryan in your corner
                </Link>
              </Button>
              <Link
                href="/the-blueprint"
                className="text-base font-semibold text-burgundy-600 underline-offset-4 hover:text-burgundy-700 hover:underline"
              >
                Start with the free Blueprint
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink/60">
              Free 20-minute call. No pressure, no upsells.
            </p>
          </div>
          {/* The locked core proposition, set in the brand type system.
              Deliberately not a restatement of the H1. */}
          <BrandPanel
            className="aspect-[4/3] lg:aspect-square"
            heading="Calling an agent starts a clock."
            sub="Ryan is the call that doesn’t."
          />
        </div>
      </section>

      {/* 2. THE STAKES */}
      <section className="bg-navy-700 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-cream">
            Going in blind is where families get taken.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-cream/85">
            When a parent can&rsquo;t stay in their home, the people with a plan
            are usually the ones circling it: the cash buyer, the &ldquo;we buy
            houses&rdquo; wholesaler, and the listing agent whose only move is a
            sign in the yard. Families who face it alone take the cash offer
            that lands 30 to 50 percent under what the house is worth, sell at
            the worst possible time, hand the house to a child in a way that
            costs them Medicaid eligibility later, or end up split over money.
            It is not your fault. You were handed the hardest decision of your
            parent&rsquo;s life with no map and a clock running.
          </p>
        </div>
      </section>

      {/* 3. THE GUIDE */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 md:grid-cols-[auto_1fr] md:items-center">
          <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-full border-4 border-gold-500 md:h-64 md:w-64">
            <Image
              src="/photos/about_hero_ryan_portrait.jpg"
              alt="Ryan Riggins, Senior Transition Advisor"
              fill
              sizes="(min-width: 768px) 256px, 224px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <GoldRule />
            {/* The empathy line doubles as this section's heading so the guide
                section isn't a headingless block in the document outline. */}
            <h2 className="mt-3 font-serif text-2xl leading-snug text-navy-700 md:text-3xl">
              I know the dread before you even pick up the phone. I have sat in
              this exact seat.
            </h2>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink/80">
              I spent eight years in construction project management and
              flipping houses, running the same playbook these buyers use on
              families like yours. Then I switched sides. Now I protect families
              from the guy I used to be.
            </p>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink/80">
              A North Carolina broker&rsquo;s license, two books, the SeniorSafe
              app, and a free Blueprint that lays out every option.
            </p>
            <p className="mt-5 text-sm text-ink/60">
              Ryan Riggins &middot; NC Real Estate License #361546 &middot; eXp
              Realty
            </p>
          </div>
        </div>
      </section>

      {/* 4. THE PLAN */}
      <section className="bg-sand border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">Three steps, in order.</h2>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {planSteps.map((s) => (
              <li
                key={s.n}
                className="rounded-lg border border-border bg-white p-7"
              >
                <span
                  aria-hidden
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy-600 font-serif text-xl text-cream"
                >
                  {s.n}
                </span>
                <h3 className="mt-5 font-serif text-xl leading-snug text-navy-700">
                  {s.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink/75">{s.body}</p>
              </li>
            ))}
          </ol>
          {/* Entity split. RSS is the free education; the referral is Ryan
              working as a licensed broker, paid agent to agent. Stated on the
              page rather than buried in the referral terms. */}
          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-ink/65">
            Riggins Strategic Solutions is the free education. The agent
            referral is Ryan working as a licensed North Carolina broker with
            eXp Realty, paid agent to agent out of the commission you would
            already pay. He never takes the listing himself.
          </p>
        </div>
      </section>

      {/* 5. THE AGREEMENT */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">What you are agreeing to, and what you are not.</h2>
          <ul className="mt-8 space-y-4">
            {agreement.map((a) => (
              <li key={a} className="flex gap-3 text-lg leading-relaxed text-ink/80">
                <span aria-hidden className="mt-1 text-burgundy-600">
                  &#10003;
                </span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. SUCCESS */}
      <section className="bg-cream border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <GoldRule />
            <h2 className="mt-3">What it looks like when you get it right.</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">
              The transition handled, your parent&rsquo;s money and dignity
              intact, and the family still whole. The right call made with a
              guide in the room instead of a sales pitch. You go back to being
              the son or daughter instead of the crisis manager.
            </p>
            <p className="mt-6 font-serif text-2xl text-burgundy-600">
              &ldquo;I did right by them.&rdquo; Relief.
            </p>
          </div>
          <BrandPanel
            className="aspect-[4/3]"
            kicker="What right looks like"
            heading="Money intact. Dignity intact. Family intact."
          />
        </div>
      </section>

      {/* 7. REPEAT THE CALL TO ACTION */}
      <section className="bg-burgundy-700 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">
            One conversation, before you call anybody else.
          </h2>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-gold-500 text-navy-900 hover:bg-gold-300"
          >
            <Link
              href="/work-with-ryan"
              data-track="book_call_click"
              data-track-params='{"location":"home-final-cta"}'
            >
              Get Ryan in your corner
            </Link>
          </Button>
          <p className="mt-6 text-cream/85">
            Not ready to talk yet?{" "}
            <Link
              href="/tools/family-readiness-score"
              className="font-semibold text-gold-300 underline underline-offset-4 hover:text-gold-100"
            >
              Take the free Family Readiness Score
            </Link>{" "}
            and see where your family really stands.
          </p>
        </div>
      </section>

      {/* Kept below the story: free nationwide utility, no pitch. */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Link
            href="/resources/senior-help-directory"
            className="group block rounded-lg border border-border p-7 transition-colors hover:border-burgundy-400"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-burgundy-700">
              Free &middot; Nationwide &middot; No sign-up
            </p>
            <h2 className="mt-2 font-serif text-2xl text-navy-700">
              Senior Help Directory
            </h2>
            <p className="mt-2 max-w-3xl leading-relaxed text-ink/75">
              Government and nonprofit help for seniors by state and county.
              Property tax relief, food, energy bills, Medicare counseling,
              transportation, legal aid, and caregiver support. No sales, no
              pitch.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-burgundy-700 group-hover:text-burgundy-800">
              Browse the directory <span aria-hidden>&rarr;</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Kept below the story: authority evidence for the guide. Renders from
          lib/reviews.ts, the same array the About page uses, so the quote here
          can never drift from the Review JSON-LD About emits. Review schema is
          deliberately NOT repeated here: it already exists on /about under the
          same entity, and self-serving review markup about your own business
          is not eligible for rich results anyway. */}
      {RYAN_REVIEWS.length > 0 && (
        <section className="bg-sand border-y border-border">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <GoldRule />
            <h2 className="mt-3">Families who stopped guessing.</h2>
            <ul className="mt-10 space-y-8">
              {RYAN_REVIEWS.map((r) => (
                <li key={`${r.authorName}-${r.datePublished}`}>
                  <figure className="border-l-2 border-gold-500 pl-6">
                    <div
                      aria-label={`${r.ratingValue} out of 5 stars`}
                      className="flex gap-1"
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          aria-hidden
                          className={
                            i < r.ratingValue ? "text-gold-500" : "text-ink/15"
                          }
                        >
                          &#9733;
                        </span>
                      ))}
                    </div>
                    <blockquote className="mt-3 font-serif text-xl leading-relaxed text-navy-700">
                      &ldquo;{r.reviewBody}&rdquo;
                    </blockquote>
                    <figcaption className="mt-4 text-sm text-ink/70">
                      <span className="font-semibold text-ink">
                        {r.authorName}
                      </span>
                      {r.publisher ? ` · ${r.publisher} review` : null}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm">
              <a
                href="https://www.google.com/search?q=Riggins+Strategic+Solutions+Greensboro+reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-burgundy-600 hover:text-burgundy-700"
              >
                Read more on Google &rarr;
              </a>
            </p>
          </div>
        </section>
      )}

      {/* Kept below the story: the page's FAQPage schema + AEO surface. */}
      <FAQSection
        items={homeFaqs}
        title="Common questions families ask."
        kicker="Common questions"
      />
    </main>
  );
}
