import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { EmailFallback } from "@/components/site/EmailFallback";
import { JsonLd } from "@/components/site/JsonLd";
import { QuickAnswer } from "@/components/aeo/QuickAnswer";
import { paymentLinks } from "@/lib/payment-links";
import {
  breadcrumbListSchema,
  faqPageSchema,
  blueprintCoreProductSchema,
  blueprintCourseSchema,
} from "@/lib/schema";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Blueprint | Senior Transition Tiers",
  description:
    "Five ways to work with Ryan Riggins on a senior housing transition. The free Simple Blueprint, the free Senior Transition Blueprint course, the Senior Transition Roadmap (free, by application), the SeniorSafe app from $14.99/mo, and Get Me in Your Corner, a vetted real estate agent referral at no added cost.",
  alternates: { canonical: "/the-blueprint" },
  openGraph: {
    type: "website",
    url: "https://rigginsstrategicsolutions.com/the-blueprint",
    siteName: "Riggins Strategic Solutions",
    title: "The Blueprint | Senior Transition Tiers",
    description:
      "Five ways to work with Ryan Riggins on a senior housing transition. The free Simple Blueprint, the free Senior Transition Blueprint course, the Senior Transition Roadmap (free, by application), the SeniorSafe app, and Get Me in Your Corner, a vetted agent referral at no added cost.",
    images: [
      {
        url: "https://rigginsstrategicsolutions.com/og/the-blueprint.png",
        width: 1200,
        height: 630,
        alt: "Riggins Strategic Solutions, Senior Transition Blueprint and SeniorSafe app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Blueprint | Senior Transition Tiers",
    description:
      "Five ways to work with Ryan Riggins on a senior housing transition. Free guide, free course, a free guided Roadmap by application, the SeniorSafe app, and a vetted agent referral at no added cost.",
    images: ["https://rigginsstrategicsolutions.com/og/the-blueprint.png"],
  },
};

type Tier = {
  label: string;
  price: string;
  priceSub?: string;
  title: string;
  blurb: string;
  audience: string;
  bullets: string[];
  cta: { href: string; label: string; external?: boolean };
  image: string;
  alt: string;
  accent?: boolean;
  learnMore?: { href: string; label: string };
};

const tiers: Tier[] = [
  {
    label: "Simple Blueprint",
    price: "Free",
    priceSub: "Email signup",
    title: "The free starter guide.",
    blurb: "The 10 biggest mistakes families make, and how to avoid them.",
    audience: "Everyone. Start here if you're just beginning to think about this.",
    bullets: [
      "10-mistake checklist from 8+ years of real families",
      "Delivered straight to your inbox",
      "No credit card, no sales call",
      "Short enough to read on a lunch break",
    ],
    cta: { href: paymentLinks.simpleBlueprint, label: "Get the free guide" },
    image: "/photos/simple_blueprint_guide.jpg",
    alt: "Simple Blueprint starter guide on a desk",
  },
  {
    label: "Senior Transition Blueprint",
    price: "Free",
    priceSub: "All of it. Free account signup.",
    title: "The full 20-module system.",
    blurb: "The complete DIY roadmap at your own pace.",
    audience: "Families who want a self-serve plan without the hand-holding.",
    bullets: [
      "20 modules, 70+ tools and checklists",
      "5 exit strategies, not just a traditional listing",
      "Scripts for the hard family conversations",
      "Lifetime access. Sign up with your email, no payment",
    ],
    cta: { href: paymentLinks.blueprintCore, label: "Create your free account", external: true },
    learnMore: { href: "/blueprint-core", label: "See what's inside the Blueprint" },
    image: "/photos/blueprint_core_materials_47.jpg",
    alt: "Senior Transition Blueprint planning materials and checklists",
  },
  {
    label: "Senior Transition Roadmap",
    price: "Free",
    priceSub: "By application. Built together, not downloaded.",
    title: "The Blueprint plus Ryan in your corner.",
    blurb: "Everything in the Blueprint, plus a written plan you and Ryan build together.",
    audience: "Families in active transition who want a real person on their side.",
    bullets: [
      "Everything in the Senior Transition Blueprint",
      "A detailed intake form, then an intake call with Ryan",
      "A written Senior Transition Plan built with your family",
      "A follow-up call on how to move forward, plus 90 days of email support",
    ],
    cta: { href: paymentLinks.blueprintPremium, label: "Apply for the Roadmap", external: true },
    learnMore: { href: "/blueprint-premium", label: "See how the Roadmap works, with an example plan" },
    image: "/photos/blueprint_premium_zoom_call_297.jpg",
    alt: "Ryan Riggins on a Zoom consultation with a family",
    accent: true,
  },
  {
    label: "SeniorSafe",
    price: "$14.99/mo",
    priceSub: "or $39.99/mo with Maggie",
    title: "The app for the daily part.",
    blurb: "Daily check-ins, medication tracking, family messaging, and SeniorSafe AI. Add Maggie for the full transition specialist.",
    audience: "Families coordinating daily care, with an upgrade for those in an active move.",
    bullets: [
      "SeniorSafe, $14.99/mo: daily check-ins, medication tracking, document vault, family messaging.",
      "With Maggie, $39.99/mo: everything above, plus the AI built to help you manage the whole transition.",
      "Maggie knows the full 20-module Blueprint and flags wholesaler offers in real time.",
      "14-day free trial on either tier. Cancel anytime.",
    ],
    cta: { href: paymentLinks.seniorSafe, label: "Start free trial", external: true },
    image: "/photos/stock_video_call_setup.jpg",
    alt: "Family coordinating senior care with the SeniorSafe app",
  },
  {
    label: "Don't Pick an Agent Alone",
    price: "No added cost",
    priceSub: "paid from the commission, not by you",
    title: "Get Me in Your Corner.",
    blurb: "Wherever you are, I find and vet the right agent for your situation and stay in it with you the whole way.",
    audience: "Families selling a parent's home who want a vetted agent and a second eye on the deal.",
    bullets: [
      "The right local agent, hand picked and vetted for you.",
      "A second eye on every offer, contract, and repair call.",
      "No added cost beyond the commission you would pay anyway.",
      "A real estate referral through eXp Realty, not an RSS product.",
    ],
    cta: { href: "/in-your-corner", label: "See How It Works" },
    image: "/photos/property_walkthrough_ryan.jpg",
    alt: "Ryan Riggins walking a property as an advocate on the home sale",
  },
];

const problemStories: { stat: string; title: string; body: string }[] = [
  {
    stat: "$33,000",
    title: "The kitchen that didn't pay back.",
    body: "Family remodels the kitchen to sell. Costs $33,000. Adds $15,000 in resale value. Contractor made a living. The senior lost $18,000 that was supposed to fund care.",
  },
  {
    stat: "$50,000+",
    title: "The panic sale.",
    body: "Adult child gets the 2 AM fall call. Three weeks later, a quick-cash investor offers 60 cents on the dollar. Everyone's too tired to fight it. $50,000 of equity walks out the door.",
  },
  {
    stat: "15 pros",
    title: "The coordination chaos.",
    body: "Estate attorney, financial advisor, Medicare specialist, senior advisor, mover, estate sale coordinator, two contractors. Nobody's talking to each other. The adult child becomes the unpaid project manager and burns out.",
  },
];

const included: { heading: string; value: string; body: string }[] = [
  {
    heading: "20 modules",
    value: "20",
    body: "Assessment, rightsizing, strategy, execution, move management, and the one-year follow-up. Not theory. Field-tested with real families.",
  },
  {
    heading: "70+ tools",
    value: "70+",
    body: "Checklists, scripts, worksheets, decision trees. The exact stuff Ryan uses on client calls. You get them too.",
  },
  {
    heading: "5 exit strategies",
    value: "5",
    body: "Most agents know one play: list the house. Blueprint covers all five, including the three that usually save the family the most money.",
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "How is the Senior Transition Roadmap different from the Blueprint?",
    a: "The Blueprint is the full self-serve system, free with a free account. The Roadmap is the guided version. It starts with an application and a detailed intake form, then an intake call with Ryan, then the two of you build a written plan for your family together, then a follow-up call on how to move forward. If you want someone in your corner, not just a playbook, the Roadmap is the pick.",
  },
  {
    q: "How is SeniorSafe with Maggie different from regular SeniorSafe?",
    a: "SeniorSafe at $14.99/mo gives you the daily app for the senior plus SeniorSafe AI as a general-purpose helper. Adding Maggie at $39.99/mo brings in an AI transition specialist built for the adult child managing the move. Maggie knows the full 20-module Blueprint, recognizes resistant parent personas, and walks you through wholesaler offers in real time. Choose SeniorSafe with Maggie if YOU need the specialist, not just the daily check-in tool.",
  },
  {
    q: "Why is the Blueprint free? What's the catch?",
    a: "No catch. Ryan makes his living on real estate referrals, paid to him by the agent, never by the family. The education is free because families who understand the whole transition make better decisions, and when it is time to deal with the house, we want you to talk to Ryan first. You can use every module and every tool and never owe a dime.",
  },
  {
    q: "What if I'm not in North Carolina?",
    a: "The Blueprint and SeniorSafe are national. Any family in any state can use them. When a home actually needs to list or sell, Ryan coordinates through a national referral network of agents who specialize in working with seniors.",
  },
  {
    q: "Does the Roadmap really cost nothing?",
    a: "Yes. The Roadmap is free, by application. The honest trade is your time and detail, not your money: the intake form asks real questions about your family's situation, and the plan is built with Ryan on calls, not downloaded. Ryan takes the families he can genuinely help. SeniorSafe is separate: a 14-day free trial, then $14.99/mo or $39.99/mo with Maggie.",
  },
];

export default function BlueprintPage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "The Blueprint", path: "/the-blueprint" },
  ]);

  return (
    <main>
      <JsonLd data={faqPageSchema(faqs, abs("/the-blueprint"))} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={blueprintCoreProductSchema()} />
      <JsonLd data={blueprintCourseSchema()} />

      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="bg-burgundy-100 text-burgundy-700 border-0">
              The Blueprint
            </Badge>
            <h1 className="mt-6 leading-[1.05]">
              The Senior Transition Blueprint: five tiers, one goal. Protect your
              family&rsquo;s equity, dignity, and sanity.
            </h1>
            <QuickAnswer
              className="mt-6 max-w-prose"
              topic="What's the Blueprint"
              question="What is the Senior Transition Blueprint?"
              answer="The Senior Transition Blueprint is a 20-module online course with 70 plus tools that walks families through every stage of a senior transition. Built from eight years of working both sides of these conversations. Covers the questions to ask, the contracts to read carefully, and the conversations most families avoid until it is too late."
            />
            <p className="mt-6 font-serif text-xl text-burgundy-600 leading-snug max-w-prose">
              &ldquo;I&rsquo;m not a move manager and I&rsquo;m not a listing
              agent. I&rsquo;m the advisor who helps families avoid the $50K
              mistakes.&rdquo;
            </p>
            <p className="mt-6 max-w-prose text-lg text-ink/80">
              Pick the one that matches where your family is right now. Free
              starter guide, full DIY system, guided advisory, the daily
              coordination app, or SeniorSafe with Maggie as your AI transition
              specialist. Same underlying playbook across every tier.
            </p>
            <p className="mt-4 max-w-prose text-sm font-semibold text-navy-700">
              Built by Ryan Riggins, Senior Transition Advisor and the former
              flipper who switched sides.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#tiers">See the tiers</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/work-with-ryan">Not sure which? Book a free call</Link>
              </Button>
            </div>
            <EmailFallback className="mt-4 max-w-prose" />
          </div>
        </div>
      </section>

      {/* PROBLEM STORIES */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">Three ways families lose money.</h2>
            <p className="mt-4 text-lg text-ink/80">
              This is the stuff the Blueprint is built to prevent. Every story
              here comes from real families Ryan has watched get taken.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {problemStories.map((s) => (
              <Card key={s.title} className="bg-cream border-border">
                <CardContent className="pt-6">
                  <div className="font-serif text-4xl font-extrabold text-gold-500 leading-none">
                    {s.stat}
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-navy-700">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-ink/80 text-sm leading-relaxed">
                    {s.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section id="tiers" className="bg-sand border-b border-border scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">Pick your path.</h2>
            <p className="mt-4 text-lg text-ink/80">
              Five tiers, one playbook. Start small, scale up as the situation
              demands, or go straight to guided advisory if the clock is ticking.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {tiers.map((t) => (
              <Card
                key={t.label}
                className={`flex flex-col overflow-hidden pt-0 ${
                  t.accent
                    ? "border-burgundy-600 border-2 shadow-xl shadow-burgundy-600/10"
                    : "bg-white"
                }`}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={t.image}
                    alt={t.alt}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  {t.accent && (
                    <Badge className="absolute top-3 right-3 bg-gold-500 text-navy-900 hover:bg-gold-500 border-0">
                      Most families start here
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <div className="text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                    {t.label}
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-extrabold text-navy-700">
                      {t.price}
                    </span>
                    {t.priceSub && (
                      <span className="text-xs text-ink/60">{t.priceSub}</span>
                    )}
                  </div>
                  <CardTitle className="mt-3 font-serif text-xl leading-snug">
                    {t.title}
                  </CardTitle>
                  <CardDescription className="text-base text-ink/70">
                    {t.blurb}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy-600 mb-2">
                    For
                  </p>
                  <p className="text-sm text-ink/80 mb-4">{t.audience}</p>
                  <ul className="space-y-2 text-sm text-ink/85 mb-6">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span aria-hidden className="text-burgundy-600 mt-[2px]">
                          ✓
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={t.accent ? "default" : "outline"}
                    className="mt-auto w-full"
                  >
                    {t.cta.external ? (
                      <a href={t.cta.href} target="_blank" rel="noopener noreferrer">
                        {t.cta.label}
                      </a>
                    ) : (
                      <Link href={t.cta.href}>{t.cta.label}</Link>
                    )}
                  </Button>
                  {t.learnMore ? (
                    <Link
                      href={t.learnMore.href}
                      className="mt-3 block text-center text-sm font-medium text-burgundy-600 underline underline-offset-4 hover:text-burgundy-700"
                    >
                      {t.learnMore.label} &rarr;
                    </Link>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-white border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">What&rsquo;s inside the Blueprint and the Roadmap.</h2>
            <p className="mt-4 text-lg text-ink/80">
              Both start from the same foundation. The Roadmap adds
              the personal layer on top.
            </p>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {included.map((item) => (
              <div key={item.heading}>
                <div className="font-serif text-6xl font-extrabold text-gold-500 leading-none">
                  {item.value}
                </div>
                <h3 className="mt-3 font-serif text-xl text-navy-700">
                  {item.heading}
                </h3>
                <p className="mt-3 text-ink/80 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="bg-burgundy-700 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">The Blueprint is free. All of it.</h2>
          <p className="mt-6 text-lg text-cream/90 max-w-2xl mx-auto leading-relaxed">
            The Roadmap is free too. It starts with an application. Ryan makes
            his living on real estate referrals, paid by the agent, never by the
            family, so the education costs you nothing. The one thing we ask:
            when it&rsquo;s time to deal with the house, talk to Ryan first.
            SeniorSafe, with or without Maggie, is a 14-day free trial. If
            it&rsquo;s not the right fit, you walk. No hassle, no guilt trip.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-sand border-y border-border">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <GoldRule />
          <h2 className="mt-3">Common questions.</h2>
          <div className="mt-10 space-y-8">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-serif text-xl text-navy-700">{f.q}</h3>
                <p className="mt-3 text-ink/80 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-navy-600 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">Still not sure which tier?</h2>
          <p className="mt-6 text-lg text-cream/85 max-w-2xl mx-auto">
            Book a free 20-minute call. You bring the situation, Ryan will tell
            you straight up which tier fits, or whether you need any of it at
            all.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gold-500 text-navy-900 hover:bg-gold-300">
            <Link href="/work-with-ryan">Book your free 20-minute call</Link>
          </Button>
          <EmailFallback variant="dark" align="center" className="mt-4" />
        </div>
      </section>
    </main>
  );
}
