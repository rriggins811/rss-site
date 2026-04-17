import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";

const paths: {
  tag: string;
  title: string;
  price: string;
  blurb: string;
  bullets: string[];
  cta: { href: string; label: string };
  image: string;
  alt: string;
  accent?: boolean;
}[] = [
  {
    tag: "DIY",
    title: "Blueprint Core",
    price: "$47 one-time",
    blurb: "For families who want a self-serve roadmap.",
    bullets: [
      "19 modules, 60+ tools and checklists",
      "Walk through it at your own pace",
      "The exact playbook Ryan uses with clients",
    ],
    cta: { href: "/the-blueprint", label: "See what's inside" },
    image: "/photos/blueprint_core_materials_47.jpg",
    alt: "Blueprint Core planning materials and checklists",
  },
  {
    tag: "Guided",
    title: "Blueprint Premium",
    price: "$297 one-time",
    blurb: "For families who want Ryan in their corner.",
    bullets: [
      "Everything in Core, plus a personalized plan",
      "60-minute 1-on-1 call with Ryan",
      "90 days of email support while you execute",
    ],
    cta: { href: "/blueprint-premium", label: "See Premium" },
    image: "/photos/blueprint_premium_zoom_call_297.jpg",
    alt: "Ryan on a Zoom consultation call with a family",
    accent: true,
  },
  {
    tag: "App",
    title: "SeniorSafe",
    price: "$14.99/mo · 14-day free trial",
    blurb: "For families coordinating daily care across siblings.",
    bullets: [
      "Daily check-ins and medication tracking",
      "AI assistant, document vault, family messaging",
      "Keep everyone on the same page without group texts",
    ],
    cta: { href: "/seniorsafe-app", label: "Start free trial" },
    image: "/photos/stock_video_call_setup.jpg",
    alt: "Video call setup representing family coordination via SeniorSafe",
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
      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <Badge variant="secondary" className="bg-burgundy-100 text-burgundy-700 border-0">
              Senior Transition Advisor · Greensboro, NC · Serving families nationwide
            </Badge>
            <h1 className="mt-6 leading-[1.05]">
              Your parents&rsquo; home has{" "}
              <span className="text-burgundy-600">$200K+ in equity.</span> Don&rsquo;t
              let a bad move cost you $50,000 of it.
            </h1>
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
                <Link href="/freeguide">Get the Simple Blueprint — free</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-ink/60">
              No pressure. No upsells. Just real answers.
            </p>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-lg overflow-hidden shadow-xl shadow-navy-900/10">
            <Image
              src="/photos/hero_ryan_consulting_family.jpg"
              alt="Ryan Riggins consulting with an elderly couple, reviewing documents at a kitchen table"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* THREE PATHS */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">Three ways to work with Ryan.</h2>
            <p className="mt-4 text-lg text-ink/80">
              Self-serve, guided, or daily-care app. Pick the one that matches where
              your family is right now.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
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
                    <Link href={p.cta.href}>{p.cta.label}</Link>
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
