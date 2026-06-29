import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces } from "next/font/google";
import { JsonLd } from "@/components/site/JsonLd";
import { QuickAnswer } from "@/components/aeo/QuickAnswer";
import { breadcrumbListSchema, faqPageSchema } from "@/lib/schema";
import { abs } from "@/lib/site";

// Warm display serif for the headlines, matching the Blueprint Core and Roadmap pages.
const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const display = serif.className;

const SUPPORT_EMAIL = "ryan@rigginsstrategicsolutions.com";

export const metadata: Metadata = {
  title: "Get Me in Your Corner | A Vetted Agent and an Advocate on the Sale",
  description:
    "Selling a parent's home? Ryan Riggins finds and vets the right local real estate agent for your situation, wherever you are, and stays in your corner the whole way. A referral service through eXp Realty, at no added cost to you.",
  alternates: { canonical: "/in-your-corner" },
  openGraph: {
    type: "website",
    url: "https://rigginsstrategicsolutions.com/in-your-corner",
    siteName: "Riggins Strategic Solutions",
    title: "Get Me in Your Corner | A Vetted Agent and an Advocate on the Sale",
    description:
      "Don't pick an agent alone. Ryan finds and vets the right local agent for your situation and stays in it with you the whole way. No added cost to you.",
    // OG image is generated per-route by ./opengraph-image.tsx, so no static image here.
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Me in Your Corner | A Vetted Agent and an Advocate",
    description:
      "Ryan finds and vets the right local agent for your situation and stays in your corner on the sale. No added cost to you.",
  },
};

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "1",
    title: "Tell me your situation",
    body: "We start with a free call. Where the home is, where your parent is, the timeline, the family, and what is worrying you most. No pitch, no pressure.",
  },
  {
    n: "2",
    title: "I find and vet the right agent",
    body: "I tap a national network and hand pick the local agent who actually fits your situation, then vet them so you are not gambling on a name off a sign. The right person for a senior sale, not just the closest one.",
  },
  {
    n: "3",
    title: "I stay in your corner",
    body: "As much or as little as you want. I am a second eye and ear on the offers, the contract, the repair calls, and the strategy, so the things that quietly cost families do not get past you.",
  },
  {
    n: "4",
    title: "You sell right, protected",
    body: "The local agent runs the sale and represents you. I make sure it is done the way it should be, and that nobody takes advantage of your family along the way.",
  },
];

const CORNER_WORK: string[] = [
  "Reading every offer and telling you what it really means, not just the top number.",
  "Spotting the cash buyer and wholesaler traps before they cost you tens of thousands.",
  "The repair and prep calls: what pays you back, and what is money down the drain.",
  "The contract red flags most families never know to look for.",
  "A straight answer whenever you are unsure, for as long as the sale takes.",
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "What does this cost me?",
    a: "Nothing beyond the commission you would already pay on the sale. I am compensated by a referral fee that is paid agent to agent through eXp Realty, out of that existing commission. There is no separate invoice from me and no added cost to your family.",
  },
  {
    q: "Are you my real estate agent?",
    a: "No. I find and vet the right local agent for your situation, and that agent represents you in the sale. I stay involved as your advocate and a second set of eyes. I am the referring broker, not your listing or selling agent.",
  },
  {
    q: "Do you only work in North Carolina?",
    a: "No. I am a licensed North Carolina real estate broker, and I work as a referral broker to connect you with a vetted local agent wherever your parent's home is. The local agent handles the sale in your state. I stay in your corner throughout.",
  },
  {
    q: "How is this different from the Senior Transition Roadmap?",
    a: "This covers the home sale: picking the right agent and keeping a second eye on the deal, at no added cost. The Senior Transition Roadmap is the whole transition, the personalized plan, the course, and the call that cover care, legal, financial, and the move, not just the house. The corner is the house. The Roadmap is everything.",
  },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Get Me in Your Corner: Senior Home Sale Agent Referral and Advocacy",
  serviceType: "Real estate agent referral and advocacy",
  description:
    "Ryan Riggins, a licensed North Carolina real estate broker with eXp Realty, finds and vets the right local real estate agent for a family selling a senior's home and stays involved as their advocate and a second set of eyes on the sale. He is the referring broker, never the listing or selling agent. The referral is paid agent to agent out of the existing commission, at no added cost to the family.",
  provider: {
    "@type": "RealEstateAgent",
    name: "Ryan Riggins",
    url: "https://rigginsstrategicsolutions.com/in-your-corner",
    memberOf: { "@type": "Organization", name: "eXp Realty" },
    areaServed: { "@type": "Country", name: "United States" },
  },
  areaServed: { "@type": "Country", name: "United States" },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description:
      "No added cost to the family. The referral fee is paid agent to agent out of the existing real estate commission.",
  },
};

export default function InYourCornerPage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "The Blueprint", path: "/the-blueprint" },
    { name: "Get Me in Your Corner", path: "/in-your-corner" },
  ]);

  return (
    <main className="w-full bg-cream text-ink">
      <JsonLd data={faqPageSchema(FAQS, abs("/in-your-corner"))} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={SERVICE_SCHEMA} />

      {/* HERO */}
      <section className="border-b border-cream-200 bg-cream">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-burgundy/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-burgundy">
              Don&apos;t pick an agent alone
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy/60">
              Work with Ryan on the home
            </span>
          </div>
          <h1 className={`${display} mt-7 text-4xl leading-[1.08] text-navy sm:text-5xl lg:text-6xl`}>
            <span className="italic text-gold-700">Get Me</span>
            <br />
            in Your Corner
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">
            Selling a parent&apos;s home is one of the biggest financial moves your family will ever make,
            usually under pressure and on a clock. The wrong agent, or a cash buyer circling at the wrong
            moment, can cost you fifty thousand dollars or more. You should not have to figure out who to
            trust on your own. I find and vet the right agent for your exact situation, wherever you are,
            and stay in it with you the whole way.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["The right agent, vetted", "I hand pick the local agent who fits your situation, then vet them for you."],
              ["A second eye and ear", "On every offer, contract, and repair call. I catch what costs families money."],
              ["No added cost", "Paid from the commission you would pay anyway. Nothing extra from you."],
            ].map(([h, s]) => (
              <div key={h} className="rounded-lg border-l-4 border-gold bg-white/70 px-5 py-4">
                <p className="font-semibold text-navy">{h}</p>
                <p className="mt-1 text-sm text-ink/70">{s}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink/70">
            Ryan Riggins, licensed North Carolina real estate broker (#361546, eXp Realty), working as your
            referral broker and advocate. Built on years on the buying side of real estate, across dozens of
            properties, now spent for families instead of against them.
          </p>

          <QuickAnswer
            className="mt-8 max-w-2xl"
            topic="Get Me in Your Corner"
            question="What is Get Me in Your Corner?"
            answer="It is a real estate referral service from Ryan Riggins, a licensed North Carolina broker with eXp Realty. Ryan finds and vets the right local real estate agent for your family's situation, wherever the home is, and stays involved as your advocate and a second set of eyes on the sale. It costs you nothing beyond the commission you would already pay, because Ryan is compensated by a referral fee paid agent to agent through eXp out of that commission. He is the referring broker, not your listing agent."
          />

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/work-with-ryan"
              className="rounded-md bg-navy px-7 py-3.5 font-semibold text-cream transition hover:bg-navy-800"
            >
              Book a free call
            </Link>
            <a href="#how" className="text-sm font-semibold text-burgundy underline underline-offset-4">
              See exactly how it works first
            </a>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className={`${display} text-2xl text-navy sm:text-3xl`}>What families are up against</h2>
          <p className="mt-2 max-w-2xl text-ink/70">
            The moment a senior&apos;s home sale becomes necessary, the wrong people show up first.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["The wrong agent", "Picked off a yard sign or a friend of a friend, with no idea whether they know a senior sale from any other."],
              ["The circling cash buyer", "Mailers, calls, and door knocks with offers thirty to fifty percent under value, built on your urgency."],
              ["The $50,000 mistakes", "A needless remodel, a panic sale, a contract nobody read closely. Quiet money, gone for good."],
              ["No one in your corner", "Everybody at the table is paid on the deal closing. Nobody is paid to protect your family."],
              ["The clock", "A discharge date, a deposit due, a sibling pushing. Pressure makes the costly, easy choice look like the only one."],
              ["The distance", "You are two states away trying to manage a sale you cannot see, through people you have never met."],
            ].map(([h, s]) => (
              <div key={h} className="rounded-lg border border-cream-200 bg-cream/60 p-5">
                <p className="font-semibold text-navy">{h}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{s}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border-l-4 border-burgundy bg-burgundy/5 px-6 py-4">
            <p className="text-ink/90">
              This is exactly where I step in. Not as one more person paid on the sale, but as the one in your
              corner making sure it is done right.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="scroll-mt-20 bg-navy text-cream">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
          <h2 className={`${display} text-3xl sm:text-4xl`}>How it works</h2>
          <p className="mt-2 text-cream/70">Four steps, and you are in control of how involved I stay at every one.</p>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s) => (
              <li key={s.n} className="relative flex flex-col items-start">
                <div className={`${display} flex h-12 w-12 items-center justify-center rounded-full bg-gold text-xl font-bold text-navy`}>
                  {s.n}
                </div>
                <p className="mt-4 font-semibold leading-snug text-cream">{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-cream/75">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHAT IN YOUR CORNER MEANS */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className={`${display} text-3xl text-navy sm:text-4xl`}>What &ldquo;in your corner&rdquo; actually means</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink/80">
            Anybody can hand you a name and walk away. Staying in your corner means I am still there when the
            offers come in and the decisions get hard. This is the part that protects your family&apos;s money.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {CORNER_WORK.map((item) => (
              <li key={item} className="flex gap-3 rounded-lg border border-cream-200 bg-white px-5 py-4">
                <span aria-hidden className="mt-0.5 font-bold text-gold-700">&#10003;</span>
                <span className="text-sm leading-relaxed text-ink/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW THIS WORKS - the eXp / referral mechanics + cost */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className={`${display} text-3xl text-navy sm:text-4xl`}>Here is exactly how this is set up</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink/80">
            Straight talk, because you deserve to know who you are working with and how everyone gets paid.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-cream-200 bg-cream/50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">Who I am here</p>
              <p className="mt-2 leading-relaxed text-ink/80">
                On this, I am wearing my real estate hat: a licensed North Carolina broker affiliated with eXp
                Realty. I work as a referral broker, finding and vetting the right local agent for your
                situation. That agent represents you in the sale. I am your advocate and connector, never your
                listing or selling agent.
              </p>
            </div>
            <div className="rounded-xl border border-cream-200 bg-cream/50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">How I am paid</p>
              <p className="mt-2 leading-relaxed text-ink/80">
                By a referral fee, paid agent to agent through eXp Realty, out of the commission the sale
                already pays. That is it. Your family pays nothing beyond the commission you would already pay
                for an agent, and there is no separate bill from me. The local agent earns their share for
                running the sale, and a portion comes to me for the referral and the advocacy.
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-lg border-l-4 border-gold bg-cream/60 px-6 py-4">
            <p className="text-ink/90">
              <span className="font-semibold text-navy">One important note.</span> This real estate referral is
              a service of Ryan Riggins through eXp Realty. It is separate from the education and planning
              products of Riggins Strategic Solutions, the Blueprint, the Senior Transition Roadmap, and the
              SeniorSafe app, which are paid to that company. Different hats, kept clean on purpose.
            </p>
          </div>
        </div>
      </section>

      {/* IN YOUR CORNER vs THE ROADMAP */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className={`${display} text-3xl text-navy sm:text-4xl`}>The corner is the house. The Roadmap is everything.</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink/80">
            Some families want one thing handled right: the sale. Others want the whole transition mapped. Here
            is how to tell which one you need.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border-2 border-gold bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">Get Me in Your Corner</p>
              <p className={`${display} mt-1 text-xl text-navy`}>The home sale, handled right</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                The right vetted agent and a second eye on the deal. No added cost to your family. Best when the
                house is the piece you are worried about getting wrong.
              </p>
            </div>
            <div className="rounded-xl border border-cream-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">Senior Transition Roadmap</p>
              <p className={`${display} mt-1 text-xl text-navy`}>The whole transition, mapped</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                Everything: a personalized written plan, the full course and tools, and a call with Ryan that
                covers care, legal, financial, and the move, not just the house. $297, one time.
              </p>
              <Link href="/blueprint-premium" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-burgundy underline underline-offset-4 hover:text-burgundy-700">
                See the Senior Transition Roadmap
                <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </div>
          <p className="mt-5 text-sm text-ink/60">
            Plenty of families do both: the Roadmap to plan the whole thing, and me in their corner when the
            house actually goes to market.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className={`${display} text-3xl text-navy sm:text-4xl`}>Common questions</h2>
          <div className="mt-8 space-y-7">
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-navy">{f.q}</h3>
                <p className="mt-2 leading-relaxed text-ink/80">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-cream">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-20 text-center">
          <h2 className={`${display} text-3xl sm:text-4xl`}>Let&apos;s talk before you pick anyone</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            One free call. Tell me where your family stands, and I will tell you straight whether I can help and
            who the right agent for your situation looks like. No pitch, no pressure, no cost.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <Link
              href="/work-with-ryan"
              className="rounded-md bg-gold px-7 py-3.5 font-semibold text-navy transition hover:bg-gold-700 hover:text-cream"
            >
              Book a free call
            </Link>
            <Link href="/the-blueprint" className="text-sm text-cream/80 underline underline-offset-4 hover:text-gold">
              See every way to work with Ryan
            </Link>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="text-xs leading-relaxed text-ink/55">
            Ryan Riggins is a licensed North Carolina real estate broker (#361546) affiliated with eXp Realty.
            This page describes a real estate referral service: Ryan connects families with a vetted local real
            estate agent and is compensated by a referral fee paid agent to agent through eXp Realty, out of the
            commission earned on the transaction. Ryan does not act as your listing or selling agent; the local
            agent you choose represents you in the sale. This referral service is provided by Ryan Riggins
            through eXp Realty and is separate from the education and planning products offered by Riggins
            Strategic Solutions. This is education and real estate guidance, not legal, tax, or financial
            advice. Questions? Email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
