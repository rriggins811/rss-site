import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { AppPlatformBadges } from "@/components/site/AppPlatformBadges";
import { WelcomeVideo } from "@/components/site/WelcomeVideo";
import { FAQSection, type FAQItem } from "@/components/aeo/FAQSection";
import { QuickAnswer } from "@/components/aeo/QuickAnswer";
import { JsonLd } from "@/components/site/JsonLd";
import { professionalServiceSchema } from "@/lib/schema";

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    url: "https://rigginsstrategicsolutions.com",
    siteName: "Riggins Strategic Solutions",
    title: "Riggins Strategic Solutions | Senior Transition Advisor",
    description:
      "Senior Transition Advisor Ryan Riggins helps families avoid the $50K mistakes of a senior housing transition. Not a move manager. Not a listing agent.",
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
      "Senior Transition Advisor Ryan Riggins helps families avoid the $50K mistakes of a senior housing transition.",
    images: ["https://rigginsstrategicsolutions.com/og/homepage.png"],
  },
};

const paths: {
  tag: string;
  title: string;
  price: string;
  blurb: string;
  bullets: string[];
  cta: { href: string; label: string; external?: boolean };
  image: string;
  alt: string;
  accent?: boolean;
}[] = [
  {
    tag: "DIY",
    title: "Senior Transition Blueprint",
    price: "Free",
    blurb: "The complete self-serve system. Free with a free account.",
    bullets: [
      "20 modules, 70+ tools and checklists",
      "Walk through it at your own pace, lifetime access",
      "The exact playbook Ryan uses with clients",
    ],
    cta: { href: "/blueprint-core", label: "See what's inside" },
    image: "/photos/blueprint_core_materials_47.jpg",
    alt: "Senior Transition Blueprint planning materials and checklists",
  },
  {
    tag: "Guided",
    title: "Senior Transition Roadmap",
    price: "Free, by application",
    blurb: "For families who want a written plan built with Ryan.",
    bullets: [
      "Everything in the Blueprint, plus a written plan you build with Ryan",
      "An intake call, then a follow-up call on how to move forward",
      "Starts with an application and a detailed intake form",
    ],
    cta: { href: "/blueprint-premium", label: "See what's in the Roadmap" },
    image: "/photos/blueprint_premium_zoom_call_297.jpg",
    alt: "Ryan on a Zoom consultation call with a family",
    accent: true,
  },
  {
    tag: "Advocacy",
    title: "Get Me in Your Corner",
    price: "No added cost",
    blurb:
      "No three listing presentations. No comparing prices you cannot check. No telling anyone no. You get one vetted agent with the reason attached, and me on the sale as your advocate. Paid from the commission, not by you.",
    bullets: [
      "You never sit through the audition",
      "The right local agent, hand picked and vetted",
      "A second eye on every offer, contract, and repair call",
      "If the answer is do not sell, you hear that too",
    ],
    cta: { href: "/in-your-corner", label: "See how it works" },
    image: "/photos/property_walkthrough_ryan.jpg",
    alt: "Ryan Riggins walking a property as an advocate on the home sale",
  },
  {
    tag: "App",
    title: "SeniorSafe App",
    price: "$14.99 or $39.99 per month",
    blurb:
      "The family app for the daily part of senior care. Check-ins, meds, documents, and Maggie, the AI specialist for adult children.",
    bullets: [
      "Daily check-ins and medication tracking",
      "Document vault and private family messaging",
      "Add Maggie, your AI transition specialist, at $39.99/mo",
      "14-day free trial on either tier",
    ],
    cta: { href: "/seniorsafe-app", label: "Start free trial" },
    image: "/photos/stock_video_call_setup.jpg",
    alt: "Video call setup representing family coordination via SeniorSafe",
  },
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
    question:
      "How do I avoid the $50K mistakes most families make in a senior transition?",
    answer:
      "The five most expensive mistakes: selling to a wholesaler at 30-50% under market, choosing the wrong care level (paying for memory care when assisted living suffices), missing the Medicare lookback window, signing predatory CCRC contracts without legal review, and waiting too long so urgency forces bad decisions. Each one is preventable with the right framework.",
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

const testimonials: { quote: string; author: string; location: string }[] = [
  {
    quote:
      "Ryan walked us through what the house was actually worth, what to fix, and what to leave alone. We listed without pouring $30,000 into renovations that wouldn't return anything.",
    author: "Sarah M.",
    location: "Greensboro, NC",
  },
  {
    quote:
      "When Mom fell, I had three weeks to figure out housing, finances, and selling the house. Ryan laid it all out in plain English. I stopped guessing.",
    author: "David R.",
    location: "Winston-Salem, NC",
  },
];

export default function HomePage() {
  return (
    <main>
      <JsonLd data={professionalServiceSchema()} />

      {/* HERO — value-prop copy + welcome video (AI avatar of Ryan) */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28 grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <Badge variant="secondary" className="bg-burgundy-100 text-burgundy-700 border-0">
              Senior Transition Advisor · Greensboro, NC · Serving families nationwide
            </Badge>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-navy-700/70">
              Ryan Riggins | Senior Transition Advisor and Advocate
            </p>
            <h1 className="mt-4 leading-[1.05]">
              Your parents&rsquo; home has{" "}
              <span className="text-burgundy-600">$200K+ in equity.</span> Don&rsquo;t
              let a bad move cost you $50,000 of it.
            </h1>
            <QuickAnswer
              className="mt-6 max-w-prose"
              topic="About RSS"
              question="What is Riggins Strategic Solutions?"
              answer="Riggins Strategic Solutions helps families get through senior transitions without getting taken advantage of. Ryan Riggins is a licensed NC broker and former house flipper who now works for the family instead of the transaction, and who never takes the listing. The Senior Transition Blueprint at no cost, a guided Roadmap by application, a family coordination app, and direct access to Ryan when families want a real conversation."
            />
            <p className="mt-6 max-w-prose text-lg text-ink/80">
              Plain-English guidance from a Senior Transition Advisor who spent 8
              years flipping houses, saw how families got taken advantage of, and
              switched sides.
            </p>
            <p className="mt-3 max-w-prose italic text-ink/70">
              Not a move manager. Not a listing agent. The advisor who helps
              families avoid the $50K mistakes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/work-with-ryan">Book your free 20-minute call</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/freeguide">Get the Simple Blueprint, free</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-ink/60">
              No pressure. No upsells. Just real answers.
            </p>
          </div>
          <div>
            <WelcomeVideo />
            <div className="mt-8 flex justify-center">
              <AppPlatformBadges className="text-center" />
            </div>
            {/* Pure-utility nudge to the free directory. No sales, no pitch. */}
            <Link
              href="/resources/senior-help-directory"
              className="group mt-10 block rounded-lg border border-border bg-white p-6 transition-colors hover:border-burgundy-400"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-burgundy-700">
                Free · Nationwide · No sign-up
              </p>
              <h3 className="mt-2 font-serif text-xl text-navy-700">
                Senior Help Directory
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                Government and nonprofit help for seniors, organized by state,
                with county programs added over time. Food, energy bills,
                Medicare, home repair, transportation, legal, and caregiver
                support. No sales, no pitch.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-burgundy-700 group-hover:text-burgundy-800">
                Browse the directory <span aria-hidden>→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* THREE PATHS */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">Ways to work with Ryan.</h2>
            <p className="mt-4 text-lg text-ink/80">
              Self-serve, guided, an advocate on the home sale, or the daily-care
              app. Pick the one that matches where your family is right now.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {paths.map((p) => (
              <Card
                key={p.title}
                className={`flex flex-col overflow-hidden pt-0 ${
                  p.accent ? "border-burgundy-600 border-2 shadow-lg shadow-burgundy-600/10" : ""
                }`}
              >
                <div className="relative aspect-[4/3]">
                  <Image src={p.image} alt={p.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                  {p.accent && (
                    <Badge className="absolute top-3 right-3 bg-gold-500 text-navy-900 hover:bg-gold-500 border-0">
                      Most families start here
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <div className="text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                    {p.tag}
                  </div>
                  <CardTitle className="font-serif text-2xl">{p.title}</CardTitle>
                  <CardDescription className="text-base text-ink/70">
                    {p.blurb}
                  </CardDescription>
                  <div className="mt-1 text-navy-700 font-semibold">{p.price}</div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2 text-sm text-ink/80 mb-6">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span aria-hidden className="text-burgundy-600 mt-[2px]">
                          ✓
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant={p.accent ? "default" : "outline"} className="mt-auto w-full">
                    {p.cta.external ? (
                      <a href={p.cta.href} target="_blank" rel="noopener noreferrer">
                        {p.cta.label}
                      </a>
                    ) : (
                      <Link href={p.cta.href}>{p.cta.label}</Link>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SWITCHED SIDES */}
      <section className="bg-burgundy-700 text-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 lg:grid-cols-5 items-center">
          <div className="lg:col-span-3">
            <GoldRule />
            <h2 className="mt-3 text-cream">
              I used to be the guy buying your parents&rsquo; house for 60 cents on the
              dollar.
            </h2>
            <div className="mt-6 space-y-4 text-cream/90 text-lg leading-relaxed">
              <p>
                For 8 years I flipped houses. More than half of what I bought came from
                seniors in crisis, or from the adult kids trying to figure it out fast.
              </p>
              <p>
                I watched families accept the first quick-cash offer because they were
                overwhelmed. I watched $50,000 in equity walk out the door because
                nobody laid out the options in plain English.
              </p>
              <p className="font-serif text-2xl text-gold-300">
                I decided I couldn&rsquo;t be on that side of the table anymore.
              </p>
              <p>
                I still use the insider knowledge from those 8 years. I just use it to
                put families in the driver&rsquo;s seat instead of taking advantage of
                them.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-8 bg-transparent border-cream text-cream hover:bg-cream hover:text-burgundy-700">
              <Link href="/about">Read the full story</Link>
            </Button>
          </div>
          <div className="lg:col-span-2 relative aspect-square rounded-lg overflow-hidden bg-cream/5">
            <Image
              src="/photos/flipper_now_protector_brand_narrative.png"
              alt="Graphic illustrating Ryan's story: flipper turned protector"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-contain p-6"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-sand border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">Families who stopped guessing.</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.author} className="border-l-2 border-gold-500 pl-6">
                <blockquote className="font-serif text-xl leading-relaxed text-navy-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-ink/70">
                  <span className="font-semibold text-ink">{t.author}</span>
                  {" · "}
                  {t.location}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-10 text-sm">
            <a
              href="https://www.google.com/search?q=Riggins+Strategic+Solutions+Greensboro+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="text-burgundy-600 font-semibold hover:text-burgundy-700"
            >
              Read more on Google &rarr;
            </a>
          </p>
        </div>
      </section>

      {/* FAQ — homepage */}
      <FAQSection
        items={homeFaqs}
        title="Common questions families ask."
        kicker="Common questions"
      />

      {/* FINAL CTA */}
      <section className="bg-navy-600 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">
            Don&rsquo;t guess. Get real answers in 20 minutes.
          </h2>
          <p className="mt-6 text-lg text-cream/85 max-w-2xl mx-auto">
            Free call. No pressure. No upsells. You&rsquo;ll walk away knowing what to
            do next, whether you ever work with me again or not.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gold-500 text-navy-900 hover:bg-gold-300">
            <Link href="/work-with-ryan">Book your free 20-minute call</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
