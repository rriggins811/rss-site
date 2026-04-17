import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { paymentLinks } from "@/lib/payment-links";

export const metadata: Metadata = {
  title: "The Blueprint — Senior Transition Tiers",
  description:
    "Four ways to work with Ryan Riggins on a senior housing transition. Free Simple Blueprint, $47 Blueprint Core, $297 Blueprint Premium, and $14.99/mo SeniorSafe app.",
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
    label: "Blueprint Core",
    price: "$47",
    priceSub: "One-time. 14-day money-back.",
    title: "The full 19-module system.",
    blurb: "The complete DIY roadmap at your own pace.",
    audience: "Families who want a self-serve plan without the hand-holding.",
    bullets: [
      "19 modules, 60+ tools and checklists",
      "5 exit strategies, not just a traditional listing",
      "Scripts for the hard family conversations",
      "12 months of course access and updates",
    ],
    cta: { href: paymentLinks.blueprintCore, label: "Get Blueprint Core, $47", external: true },
    image: "/photos/blueprint_core_materials_47.jpg",
    alt: "Blueprint Core planning materials and checklists",
  },
  {
    label: "Blueprint Premium",
    price: "$297",
    priceSub: "One-time. 14-day money-back before the call.",
    title: "Core plus Ryan in your corner.",
    blurb: "Everything in Core, plus a personalized plan and a 60-minute call.",
    audience: "Families in active transition who want a real person on their side.",
    bullets: [
      "Everything in Blueprint Core",
      "Personalized Senior Transition Plan written for your situation",
      "60-minute 1-on-1 call with Ryan",
      "90 days of email support while you execute",
    ],
    cta: { href: paymentLinks.blueprintPremium, label: "Get Blueprint Premium, $297", external: true },
    image: "/photos/blueprint_premium_zoom_call_297.jpg",
    alt: "Ryan Riggins on a Zoom consultation with a family",
    accent: true,
  },
  {
    label: "SeniorSafe",
    price: "$14.99/mo",
    priceSub: "14-day free trial. Cancel anytime.",
    title: "The app for the daily part.",
    blurb: "Daily check-ins, medication tracking, family messaging, AI assistant.",
    audience: "Families coordinating daily care across siblings and caregivers.",
    bullets: [
      "Daily wellness check-ins with real-time family updates",
      "Medication and appointment tracking in one place",
      "Private family messaging that beats group texts",
      "Document vault and AI assistant for the paperwork",
    ],
    cta: { href: paymentLinks.seniorSafe, label: "Start free trial", external: true },
    image: "/photos/stock_video_call_setup.jpg",
    alt: "Video call setup representing family coordination via SeniorSafe",
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
    heading: "19 modules",
    value: "19",
    body: "Assessment, rightsizing, strategy, execution, move management, and the one-year follow-up. Not theory. Field-tested with real families.",
  },
  {
    heading: "60+ tools",
    value: "60+",
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
    q: "How is Blueprint Premium different from Core?",
    a: "Core is the full self-serve system. Premium is Core plus a personalized plan written for your specific situation, a 60-minute 1-on-1 call with Ryan, and 90 days of email follow-up while you execute. If you want someone in your corner, not just a playbook, Premium is the pick.",
  },
  {
    q: "Can I start with Core and upgrade to Premium later?",
    a: "Yes. When you buy Blueprint Core at $47, you get an email within minutes with a discount code that credits the $47 toward Blueprint Premium whenever you decide to upgrade. No double-paying.",
  },
  {
    q: "What if I'm not in North Carolina?",
    a: "The Blueprint and SeniorSafe are national. Any family in any state can use them. When a home actually needs to list or sell, Ryan coordinates through a national referral network of agents who specialize in working with seniors.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes. Blueprint Core has a 14-day money-back guarantee. Blueprint Premium has a 14-day money-back guarantee up until the consultation call happens. SeniorSafe has a 14-day free trial, cancel anytime, no charge.",
  },
];

export default function BlueprintPage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="bg-burgundy-100 text-burgundy-700 border-0">
              The Blueprint
            </Badge>
            <h1 className="mt-6 leading-[1.05]">
              Four ways to protect your family&rsquo;s equity, dignity, and sanity.
            </h1>
            <p className="mt-6 font-serif text-xl text-burgundy-600 leading-snug max-w-prose">
              &ldquo;I&rsquo;m not a move manager and I&rsquo;m not a listing
              agent. I&rsquo;m the advisor who helps families avoid the $50K
              mistakes.&rdquo;
            </p>
            <p className="mt-6 max-w-prose text-lg text-ink/80">
              Pick the one that matches where your family is right now. Free
              starter guide, full DIY system, guided advisory, or the daily
              coordination app. Same underlying playbook.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#tiers">See the tiers</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/work-with-ryan">Not sure which? Book a free call</Link>
              </Button>
            </div>
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
              Four tiers, one playbook. Start small, scale up as the situation
              demands, or go straight to guided advisory if the clock is ticking.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
            <h2 className="mt-3">What&rsquo;s inside Core and Premium.</h2>
            <p className="mt-4 text-lg text-ink/80">
              The paid tiers both start from the same foundation. Premium adds
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
          <h2 className="mt-3 text-cream">Risk is on me, not you.</h2>
          <p className="mt-6 text-lg text-cream/90 max-w-2xl mx-auto leading-relaxed">
            Blueprint Core has a 14-day money-back guarantee. Blueprint Premium
            has a 14-day money-back guarantee up until the consultation call
            happens. SeniorSafe is a full 14-day free trial. If it&rsquo;s not
            the right fit, you walk. No hassle, no guilt trip.
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
        </div>
      </section>
    </main>
  );
}
