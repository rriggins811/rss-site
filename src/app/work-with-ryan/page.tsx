import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { BrandPanel } from "@/components/site/BrandPanel";
import { EmailFallback } from "@/components/site/EmailFallback";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema } from "@/lib/schema";
import { abs } from "@/lib/site";
import { BOOKING_EMBED_URL } from "@/lib/booking";

/**
 * /work-with-ryan, StoryBrand structure (rebuilt Aug 10 2026).
 *
 * The money page. Its whole job is to kill the fear and make the entity split
 * unmistakable, so the compensation section is written to be literally true
 * rather than merely reassuring. See the notes on section 5 below.
 *
 * One action: book the call. The hero button scrolls to the inline scheduler
 * rather than navigating to Google, so the family never leaves the page to
 * book. Nothing else on the page competes with it.
 */

const BOOKING_ANCHOR = "#book";

export const metadata: Metadata = {
  title: "Book a call with Ryan",
  description:
    "Get a guide in your corner before you deal with the house. One free 20-minute call with a licensed broker who never takes the listing. No cost, no pressure, no pitch.",
  alternates: { canonical: "/work-with-ryan" },
  openGraph: {
    type: "website",
    url: "https://rigginsstrategicsolutions.com/work-with-ryan",
    siteName: "Riggins Strategic Solutions",
    title: "Book a call with Ryan",
    description:
      "Get a guide in your corner before you deal with the house. One free 20-minute call. No cost, no pressure, no pitch.",
    images: [
      {
        url: "https://rigginsstrategicsolutions.com/og/work-with-ryan.png",
        width: 1200,
        height: 630,
        alt: "Riggins Strategic Solutions, Senior Transition Blueprint and SeniorSafe app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a call with Ryan | Riggins Strategic Solutions",
    description:
      "One free 20-minute call with a guide who has been on both sides of the table. No cost, no pressure, no pitch.",
    images: ["https://rigginsstrategicsolutions.com/og/work-with-ryan.png"],
  },
};

const agreement: string[] = [
  "You never sit through the audition. No three appointments, no comparing three prices you cannot check, nobody you have to tell no.",
  "You will never be pushed to sell. “Don’t sell yet” always stays on the table.",
  "Every option gets shown to you honestly, including the ones Ryan makes nothing on.",
  "No added cost.",
  "Ryan stays your second set of eyes, start to finish.",
  "Your parent gets treated like family, not a transaction.",
];

const steps: { n: string; title: string; body: string }[] = [
  {
    n: "1",
    title: "Talk to Ryan first",
    body: "Before you call an agent or answer a cash buyer. One conversation, and it costs you nothing.",
  },
  {
    n: "2",
    title: "He lays out every option",
    body: "With the honest number and the real timeline on each, not the flattering one.",
  },
  {
    n: "3",
    title: "If selling is the right move",
    body: "He places you with a vetted local agent and stays in your corner through closing. If it is not the right move, he tells you straight.",
  },
];

export default function WorkWithRyanPage() {
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Senior Transition Advisory Call",
          serviceType: "Senior transition advisory consultation",
          url: abs("/work-with-ryan"),
          description:
            "A free 20-minute call with Ryan Riggins, Senior Transition Advisor and licensed North Carolina broker who never takes the listing. Every option laid out honestly, including selling, waiting, renting, or not selling at all. If selling is the right move, Ryan refers a vetted local agent and is paid agent to agent through eXp Realty out of the existing commission, at no added cost to the family.",
          provider: {
            "@type": "Person",
            name: "Ryan Riggins",
            jobTitle: "Senior Transition Advisor and Advocate",
            worksFor: {
              "@type": "Organization",
              name: "Riggins Strategic Solutions",
            },
          },
          areaServed: { "@type": "Country", name: "United States" },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "No cost for the call. No obligation.",
          },
        }}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Book a call with Ryan", path: "/work-with-ryan" },
        ])}
      />

      {/* 1. HEADER */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="leading-[1.05]">
              Get a guide in your corner{" "}
              <span className="text-burgundy-600">
                before you deal with the house.
              </span>
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink/80">
              One conversation with someone who has been on both sides of the
              table, so you see every option, protect your parent&rsquo;s
              money, and never sit through the audition.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <a
                  href={BOOKING_ANCHOR}
                  data-track="book_call_click"
                  data-track-params='{"location":"work-with-ryan-hero"}'
                >
                  Book a call with Ryan
                </a>
              </Button>
              <p className="mt-3 text-sm text-ink/60">
                No cost, no pressure, no pitch.
              </p>
            </div>
          </div>
          <BrandPanel
            className="aspect-[4/3] lg:aspect-square"
            kicker="The 20-minute call"
            heading="Bring the situation. Leave with every option on the table."
          />
        </div>
      </section>

      {/* 2. WHAT THIS ACTUALLY IS */}
      <section className="bg-navy-700 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-cream">This is not a sales call.</h2>
          <p className="mt-6 text-lg leading-relaxed text-cream/85">
            It is a second set of eyes on the biggest financial decision of your
            parent&rsquo;s life. You bring the situation, Ryan lays out every
            option honestly, sell now, wait, rent, or do not sell at all, and if
            selling is the right move, he puts you with a vetted local agent and
            stays in the room start to finish. You are never handling the house
            alone, and you are never being sold.
          </p>
        </div>
      </section>

      {/* 3. THE AGREEMENT */}
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

      {/* 4. HOW IT WORKS */}
      <section className="bg-sand border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">How it works.</h2>
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="rounded-lg border border-border bg-white p-7">
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
        </div>
      </section>

      {/* 5. HOW RYAN GETS PAID
          The spec's third bullet claimed Ryan "is paid the same whether the
          answer is list it, wait, or do not sell at all" and then, one clause
          later, that "he only earns anything if selling is genuinely your
          move." Both cannot be true, and the first one is a false statement
          about compensation on the page whose entire job is trust. Rewritten
          to the version that is literally accurate: he earns nothing unless
          you sell AND choose the agent he finds, which is a STRONGER trust
          argument than the false one, because "don't sell" visibly costs him
          the fee. */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">How Ryan gets paid.</h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            Trust is the whole game here, so this gets said plainly.
          </p>
          <ul className="mt-8 space-y-5 text-lg leading-relaxed text-ink/80">
            <li className="border-l-2 border-gold-500 pl-5">
              Riggins Strategic Solutions is free education. Ryan does not
              charge you a dime for the call, the Blueprint, or the tools.
            </li>
            <li className="border-l-2 border-gold-500 pl-5">
              When it is time to sell, Ryan is not your listing agent. He never
              takes the listing. He refers you to a vetted local agent and is
              paid a referral fee agent to agent through eXp Realty, out of the
              commission you were already going to pay that agent. No added
              cost.
            </li>
            <li className="border-l-2 border-gold-500 pl-5">
              He earns nothing unless you decide to sell and choose to work
              with the agent he finds. So &ldquo;wait&rdquo; and &ldquo;do not
              sell&rdquo; cost him the fee, and he will still tell you when
              that is the right answer. That is the whole point of keeping him
              off the listing.
            </li>
          </ul>
          <p className="mt-8 text-lg leading-relaxed text-ink/80">
            That is the exact opposite of the cash buyer and the &ldquo;we buy
            houses&rdquo; wholesaler, whose entire paycheck depends on getting
            your parent&rsquo;s house for less than it is worth.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-ink/60">
            Ryan Riggins is a licensed North Carolina real estate broker
            (#361546, eXp Realty). Referral fees are paid broker to broker out
            of the existing commission and are never an added charge to your
            family.
          </p>
        </div>
      </section>

      {/* 6. WHY TRUST HIM */}
      <section className="bg-cream border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-[auto_1fr] md:items-center">
          <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-full border-4 border-gold-500 md:h-64 md:w-64">
            <Image
              src="/photos/about_hero_ryan_portrait.jpg"
              alt="Ryan Riggins, Senior Transition Advisor"
              fill
              sizes="(min-width: 768px) 256px, 224px"
              className="object-cover"
            />
          </div>
          <div>
            <GoldRule />
            <h2 className="mt-3">Why trust him.</h2>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink/80">
              I spent eight years in construction project management and
              flipping houses, running the same playbook these buyers run on
              families like yours. Then I switched sides. Now I protect
              families from the guy I used to be.
            </p>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink/80">
              A North Carolina broker&rsquo;s license, two books, the SeniorSafe
              app, and a free Blueprint that lays out every option.
            </p>
          </div>
        </div>
      </section>

      {/* 7. THE CALL TO ACTION + inline scheduler */}
      <section id="book" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="text-center">
            <GoldRule className="mx-auto" />
            <h2 className="mt-3">Book a call with Ryan.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink/80">
              Bring the situation. Leave with a plan and every option on the
              table. No cost, no pressure, no pitch.
            </p>
          </div>

          {/* Inline scheduler rather than a link out to Google. Booking without
              leaving the page is a materially better conversion path, and the
              hero button scrolls here, so the page still has exactly one
              action. See the note to Ryan in the build summary. */}
          <div className="mt-10 w-full overflow-hidden rounded-lg border border-border bg-white">
            <iframe
              src={BOOKING_EMBED_URL}
              title="Book a 20-minute call with Ryan Riggins"
              className="block w-full"
              style={{ minHeight: "820px", border: 0 }}
              loading="lazy"
              allow="fullscreen *"
            />
          </div>

          <p className="mt-4 text-center text-sm text-ink/60">
            I never take the listing and I never buy the house.
          </p>

          <div className="mt-6 flex justify-center">
            <EmailFallback align="center" />
          </div>
        </div>
      </section>
    </main>
  );
}
