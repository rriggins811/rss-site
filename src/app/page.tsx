import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { FAQSection, type FAQItem } from "@/components/aeo/FAQSection";
import { JsonLd } from "@/components/site/JsonLd";
import { professionalServiceSchema } from "@/lib/schema";
import { RYAN_REVIEWS } from "@/lib/reviews";
import { ROLE_DEFINITION, ROLE_TITLE } from "@/lib/site";
import { RYAN_PHONE, RYAN_PHONE_DISPLAY } from "@/lib/contact";

/**
 * Homepage, one short message (rebuilt Oct 14 2026).
 *
 * Ryan's brief: the top of the page says everything we do in one short
 * message, readable on a phone, and on a laptop (1366x768 and up) the whole
 * hero plus the call-to-action sits above the fold with no scrolling. The
 * rest of the page got much simpler.
 *
 * Order: hero (the message, the call, and the six things we get in order
 * first), three quips (the conversation, the roadmap, the Blueprint), the
 * role definition and entity split kept compact for SEO/AEO, reviews, the
 * FAQ (the page's FAQPage schema), and one closing call to action.
 *
 * One primary CTA, /work-with-ryan, repeated twice and nowhere contradicted.
 * The call is never called free; it is "no obligation". The Blueprint and
 * the roadmap may be called free.
 */

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    url: "https://rigginsstrategicsolutions.com",
    siteName: "Riggins Strategic Solutions",
    title: "Riggins Strategic Solutions | Senior Transition Advisor",
    description:
      "A real estate agent who won’t list your house. Ryan gets everything else in order first, then brings in the one right agent.",
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
      "A real estate agent who won’t list your house. Ryan gets everything else in order first, then brings in the one right agent.",
    images: ["https://rigginsstrategicsolutions.com/og/homepage.png"],
  },
};

// The six things handled before anyone talks about listing. Kept short on
// purpose: each line has to fit the hero's right column above the fold.
const inOrderFirst: { title: string; body: string }[] = [
  {
    title: "The plan",
    body: "Medicaid and care planning, with the right planner or elder law attorney.",
  },
  {
    title: "The paperwork",
    body: "Deed, will, trust, power of attorney, beneficiary forms.",
  },
  {
    title: "The taxes",
    body: "Step-up in basis and timing, checked by your CPA before anyone signs.",
  },
  {
    title: "The stuff",
    body: "Keep, sell, donate, toss, and who carries the boxes.",
  },
  {
    title: "The logistics",
    body: "Keys, mail, utilities, insurance on an empty house, the move.",
  },
  {
    title: "The family",
    body: "Everyone on the same page before the house goes on the market.",
  },
];

// Three short doors under the hero. The roadmap comes after the call, so
// its card points at the call too.
const quips: { title: string; body: string; href: string; cta: string }[] = [
  {
    title: "The conversation",
    body: "30 minutes with Ryan before you call anyone else. No obligation, no pressure.",
    href: "/work-with-ryan",
    cta: "Talk with Ryan",
  },
  {
    title: "The roadmap",
    body: "After we talk, a written plan for your family within 48 hours: every step, in order.",
    href: "/work-with-ryan",
    cta: "Start with the call",
  },
  {
    title: "The Blueprint",
    body: "A free guide to every option, not just the one someone is selling.",
    href: "/the-blueprint",
    cta: "Get the free Blueprint",
  },
];

const homeFaqs: FAQItem[] = [
  {
    question: "How do I help my aging parent decide whether to sell their house?",
    answer:
      "Start by listening, not selling. Most parents resist because they fear losing autonomy or burdening you, not because they don't see the math. Have an honest conversation about their daily reality, document the maintenance costs and the time, then bring in an agent who has actually closed senior and estate sales, and ask how many. A designation like SRES is a starting point for that conversation, not proof of it. The Senior Transition Blueprint walks you through the conversation step by step.",
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
      "SRES stands for Seniors Real Estate Specialist, a designation an agent earns through coursework offered through the National Association of Realtors. It signals interest in working with older adults and their families, and that is worth something. What it does not tell you is how many senior or estate sales that agent has actually closed. Treat the letters as a starting point, then ask the question that decides it: how many of these have you done, and what happened when one went sideways?",
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

      {/* 1. HERO. The whole message plus the button fits above the fold on a
          1366x768 laptop, so padding and type are deliberately tight. On a
          phone it stacks: text first, the six things second. */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:py-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-700/70">
              Ryan Riggins | {ROLE_TITLE}
            </p>
            <h1 className="mt-3 text-4xl leading-[1.08] md:text-5xl lg:text-[2.75rem]">
              I&rsquo;m a real estate agent who won&rsquo;t list your house.
            </h1>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink/80">
              When a parent moves into care, the house is the last step, not
              the first. I get everything else in order, then bring in the one
              agent in your area who&rsquo;s best at your kind of house. No
              folder, no presentation, no pitch.
            </p>
            <p className="mt-4 max-w-prose text-lg font-semibold leading-snug text-burgundy-600">
              Before anyone makes you an offer, find out what the house is
              worth and what your choices are.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button asChild size="lg" className="h-11 px-6 text-base">
                <Link
                  href="/work-with-ryan"
                  data-track="book_call_click"
                  data-track-params='{"location":"home-hero"}'
                >
                  Talk with Ryan
                </Link>
              </Button>
              {/* Text button (Ryan, Oct 14 2026): most families won't call or
                  email, but they will text. sms: opens the phone's Messages
                  app with Ryan's number already filled in. */}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 border-burgundy-600 px-6 text-base text-burgundy-700 hover:bg-burgundy-600 hover:text-cream"
              >
                <a
                  href={`sms:${RYAN_PHONE}`}
                  data-track="text_click"
                  data-track-params='{"location":"home-hero"}'
                >
                  Text Ryan
                </a>
              </Button>
              <Link
                href="/the-blueprint"
                className="text-base font-semibold text-burgundy-600 underline-offset-4 hover:text-burgundy-700 hover:underline"
              >
                Get the free Blueprint
              </Link>
            </div>
            <p className="mt-3 text-sm text-ink/60">
              30 minutes. Phone, Zoom or text. No obligation.
            </p>
            <p className="mt-1 text-sm text-ink/70">
              Text Ryan on his personal number,{" "}
              <a
                href={`sms:${RYAN_PHONE}`}
                className="font-semibold text-burgundy-600 hover:text-burgundy-700"
                data-track="text_click"
                data-track-params='{"location":"home-hero-line"}'
              >
                {RYAN_PHONE_DISPLAY}
              </a>
              . Ask anything.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 lg:p-7">
            <h2 className="m-0 font-serif text-xl leading-snug text-navy-700 md:text-2xl">
              What we get in order first
            </h2>
            <ul className="mt-4 space-y-2.5">
              {inOrderFirst.map((item) => (
                <li
                  key={item.title}
                  className="flex gap-3 text-base leading-snug text-ink/80"
                >
                  <span aria-hidden className="mt-0.5 text-burgundy-600">
                    &#10003;
                  </span>
                  <span>
                    <strong className="font-semibold text-ink">
                      {item.title}:
                    </strong>{" "}
                    {item.body}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-border pt-4 text-sm text-ink/65">
              Then one vetted agent, picked for your house. Slow down to speed
              up.
            </p>
          </div>
        </div>
      </section>

      {/* 2. THREE QUIPS. One short row, three doors. */}
      <section className="bg-sand border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <ul className="grid gap-5 md:grid-cols-3">
            {quips.map((q) => (
              <li key={q.title}>
                <Link
                  href={q.href}
                  className="group block h-full rounded-lg border border-border bg-white p-6 transition-colors hover:border-burgundy-400"
                >
                  <h2 className="m-0 font-serif text-xl leading-snug text-navy-700">
                    {q.title}
                  </h2>
                  <p className="mt-2 leading-relaxed text-ink/75">{q.body}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-burgundy-700 group-hover:text-burgundy-800">
                    {q.cta} <span aria-hidden>&rarr;</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. THE ROLE AND THE ENTITY SPLIT, kept compact for SEO/AEO. The role
          title plus the verbatim definition (approved 2026-09-19) carries the
          speakable class. The entity split says on the page that RSS is the
          free education and the referral is Ryan working as a broker. */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="aeo-speakable-quickanswer rounded-r-md border-l-4 border-burgundy-600 bg-cream px-6 py-6">
            <h2 className="m-0 font-serif text-xl leading-snug text-navy-700 md:text-2xl">
              {ROLE_TITLE}
            </h2>
            <p className="mt-3 max-w-4xl text-lg leading-relaxed text-ink/85">
              {ROLE_DEFINITION}
            </p>
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href="/what-is-a-senior-transition-advisor"
                className="font-semibold text-burgundy-600 underline-offset-4 hover:text-burgundy-700 hover:underline"
              >
                What the role is, and isn&rsquo;t &rarr;
              </Link>
              <Link
                href="/mom-moving-to-assisted-living-what-to-do-with-the-house"
                className="font-semibold text-burgundy-600 underline-offset-4 hover:text-burgundy-700 hover:underline"
              >
                Mom is moving to assisted living. What about the house? &rarr;
              </Link>
            </p>
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink/65">
            Riggins Strategic Solutions is the free education. The agent
            referral is Ryan working as a licensed North Carolina broker with
            eXp Realty, paid agent to agent out of the commission you would
            already pay. He never takes the listing himself.
          </p>
          <p className="mt-2 text-xs text-ink/55">
            Ryan Riggins &middot; NC Real Estate License #361546 &middot; eXp
            Realty
          </p>
        </div>
      </section>

      {/* 4. REVIEWS. Renders from lib/reviews.ts, the same array the About
          page uses, so the quote here can never drift from the Review JSON-LD
          About emits. Review schema is deliberately NOT repeated here: it
          already exists on /about under the same entity, and self-serving
          review markup about your own business is not eligible for rich
          results anyway. */}
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

            {/* Press mention for Hammock365, Ryan's daily check-in app. Kept
                out of RYAN_REVIEWS on purpose: it reviews the app, not RSS
                client work, so it must never be emitted as an RSS Review. */}
            <figure className="mt-12 border-t border-border pt-10">
              <div className="text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                In the press
              </div>
              <blockquote className="mt-3 font-serif text-2xl leading-snug text-navy-700">
                &ldquo;One tap. Every morning. The whole family sees it.&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-ink/70">
                <span className="font-semibold text-ink">Rosaria Michaels</span>
                {" · ParentCareTech"}
                <span className="mt-1 block">
                  From her independent review of Hammock365, the daily check-in
                  app for families with a parent who lives alone.
                </span>
                <a
                  href="https://parentcaretech.com/hammock365-review-the-free-daily-check-in-app-i-wish-wed-had-for-nana/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-semibold text-burgundy-600 hover:text-burgundy-700"
                >
                  Read the review &rarr;
                </a>
              </figcaption>
            </figure>
          </div>
        </section>
      )}

      {/* 5. FAQ: the page's FAQPage schema + AEO surface. */}
      <FAQSection
        items={homeFaqs}
        title="Common questions families ask."
        kicker="Common questions"
      />

      {/* 6. CLOSING CALL TO ACTION */}
      <section className="bg-burgundy-700 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">
            One conversation, before you call anybody else.
          </h2>
          <Button
            asChild
            size="lg"
            className="mt-8 h-11 bg-gold-500 px-6 text-base text-navy-900 hover:bg-gold-300"
          >
            <Link
              href="/work-with-ryan"
              data-track="book_call_click"
              data-track-params='{"location":"home-final-cta"}'
            >
              Talk with Ryan
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="ml-3 mt-8 h-11 border-gold-500 bg-transparent px-6 text-base text-gold-300 hover:bg-gold-500 hover:text-navy-900"
          >
            <a
              href={`sms:${RYAN_PHONE}`}
              data-track="text_click"
              data-track-params='{"location":"home-final-cta"}'
            >
              Text Ryan
            </a>
          </Button>
          <p className="mt-4 text-sm text-cream/80">
            30 minutes. Phone, Zoom or text. No obligation.
          </p>
          <p className="mt-1 text-sm text-cream/80">
            Text Ryan on his personal number, {RYAN_PHONE_DISPLAY}. Ask
            anything.
          </p>
        </div>
      </section>
    </main>
  );
}
