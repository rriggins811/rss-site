import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { EmailFallback } from "@/components/site/EmailFallback";
import { JsonLd } from "@/components/site/JsonLd";
import { paymentLinks } from "@/lib/payment-links";
import { breadcrumbListSchema, faqPageSchema } from "@/lib/schema";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blueprint Premium — $297 Guided Advisory",
  description:
    "Blueprint Premium is everything in Core plus a personalized Senior Transition Plan, a 60-minute 1-on-1 call with Ryan Riggins, and 90 days of email support. $297, one-time, outcome-focused.",
  alternates: { canonical: "/blueprint-premium" },
};

const whatYouGet: { title: string; body: string }[] = [
  {
    title: "Everything in Blueprint Core",
    body: "The full 19-module system, 60+ tools, 5 exit strategies, and every checklist and script. You get the foundation first.",
  },
  {
    title: "A personalized Senior Transition Plan",
    body: "Ryan writes a plan specific to your family, your timeline, the property, and the dynamics at play. Not a template. A document built for you.",
  },
  {
    title: "A 60-minute 1-on-1 call with Ryan",
    body: "You walk through the plan together. Ryan answers the specific questions nobody else will answer straight. You leave with a list of next moves, not more confusion.",
  },
  {
    title: "90 days of email support",
    body: "After the call, you have 90 days to email Ryan as new questions come up. Contractor quote looks off? Sibling pushing back? Facility demanding a deposit? Reply and get a straight answer.",
  },
];

const whoForSignals: string[] = [
  "You're in active transition — a move is happening in the next 0 to 12 months.",
  "There's real equity on the line. $300K+ property, or complex assets you don't want to mishandle.",
  "The situation is messy. Multiple siblings, health decline, out-of-state family, or all three.",
  "You've already been pitched something that didn't feel right, and you want a second opinion from someone without a commission at stake.",
  "You want a plan you can actually execute, not another 47-tab PDF you'll never open.",
];

const whoNotFor: string[] = [
  "You're 5+ years out and just starting to think about it. Start with Simple Blueprint or Blueprint Core.",
  "You want someone to do the whole thing for you, start to finish. Premium is guided advisory, not full-service coordination.",
  "You're looking for a free chat. Book the free 20-minute call, or grab the free Simple Blueprint first.",
];

const differentFromConsulting: { title: string; body: string }[] = [
  {
    title: "Fixed price, not billable hours",
    body: "$297 is the whole number. No hourly clock, no surprise invoice. If the call runs 70 minutes because your situation warrants it, that's on Ryan.",
  },
  {
    title: "No upsells baked in",
    body: "Typical senior-transition consulting runs $2,500 to $5,000 and prices by the hour. Premium is the opposite: one flat price, and most families never need another thing from Ryan after they execute the plan. That's the outcome he's shooting for.",
  },
  {
    title: "Outcome-focused, not meeting-focused",
    body: "The deliverable is a plan you can execute, plus 90 days of backup while you do. Not a schedule of recurring consulting calls. The goal is to make Ryan unnecessary, fast.",
  },
];

const caseStudies: { title: string; situation: string; what: string; outcome: string }[] = [
  {
    title: "The 2 AM fall.",
    situation: "Adult daughter in Ohio, mom in Georgia. Fall, hospitalization, three-week discharge clock. Panic-mode cash investor already circling with a 60-cents-on-the-dollar offer.",
    what: "Premium call mapped the real timeline, which was closer to 8 weeks than 3. Ryan walked her through the 5 exit strategies and flagged the specific Georgia-market tactic that doubled the net price without waiting for a traditional listing.",
    outcome: "House sold for $82,000 more than the panic offer. Mom moved on schedule. Daughter spent $297 and took home 275x that in equity.",
  },
  {
    title: "Three siblings, three opinions.",
    situation: "Three adult kids across three states, mom's health changing fast, and three different ideas about what to do. Group chat had become a battlefield. Nobody was moving.",
    what: "Ryan built a decision framework the family could run together, with specific scripts for the harder conversations. The 60-minute call included all three siblings.",
    outcome: "Family alignment inside two weeks. Mom moved into the community they'd all agreed on. One of the siblings later bought Blueprint Core for their own future planning.",
  },
  {
    title: "The $30K kitchen that almost was.",
    situation: "Family had a $30,000 kitchen remodel quote from a contractor who said the house 'wouldn't sell without it.' Renovations in the $25K to $40K range are common in this situation. They called Ryan before signing.",
    what: "Ryan walked through the property virtually, identified which fixes would actually return value, which would not, and which the next buyer would rip out anyway. Built a $7,000 targeted punch list instead.",
    outcome: "House sold at a higher net than the $30K-reno scenario would have produced. Family kept $23,000 that would have gone to the contractor.",
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "How is this different from Blueprint Core?",
    a: "Core is the full self-serve system. You work through 19 modules on your own time. Premium is Core plus a personalized plan written for your specific situation, a 60-minute 1-on-1 call with Ryan, and 90 days of email follow-up while you execute. If you want the system, buy Core. If you want the system plus someone in your corner while you run the play, buy Premium.",
  },
  {
    q: "What if I need more than 90 days of support?",
    a: "After day 90, your email support wraps up. That's the deal. If things change and you need help later, we can book a paid follow-up strategy call. Most families don't need it. By day 90 they've got the plan and the tools.",
  },
  {
    q: "Can I upgrade from Core to Premium later?",
    a: "Yes. When you buy Blueprint Core at $47, you get an email within minutes with a discount code that credits the full $47 toward Blueprint Premium whenever you decide to upgrade. No double-paying.",
  },
  {
    q: "What if Premium isn't a fit after the first call?",
    a: "The 14-day money-back guarantee runs up until the consultation call happens. If you decide after buying but before the call that Premium isn't right, refund is automatic. Once the call happens, the refund window closes because the personalized plan and advisory time have been delivered.",
  },
];

export default function BlueprintPremiumPage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "The Blueprint", path: "/the-blueprint" },
    { name: "Blueprint Premium", path: "/blueprint-premium" },
  ]);

  return (
    <main>
      <JsonLd data={faqPageSchema(faqs, abs("/blueprint-premium"))} />
      <JsonLd data={breadcrumbs} />

      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <Badge variant="secondary" className="bg-burgundy-100 text-burgundy-700 border-0">
              Blueprint Premium &middot; $297
            </Badge>
            <h1 className="mt-6 leading-[1.05]">
              When you want someone in your corner, not just a roadmap.
            </h1>
            <p className="mt-6 font-serif text-xl text-burgundy-600 leading-snug max-w-prose">
              &ldquo;I&rsquo;m not a move manager and I&rsquo;m not a listing
              agent. I&rsquo;m the advisor who helps families avoid the $50K
              mistakes.&rdquo;
            </p>
            <p className="mt-6 max-w-prose text-lg text-ink/80">
              Blueprint Core gives you the full system to run on your own.
              Premium gives you the system plus a plan written for your
              family, an hour on the phone with Ryan, and 90 days of email
              support while you execute.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a
                  href={paymentLinks.blueprintPremium}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Blueprint Premium, $297
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/work-with-ryan">Not sure? Book a free call first</Link>
              </Button>
            </div>
            <EmailFallback className="mt-4" />
            <p className="mt-4 text-sm text-ink/60">
              14-day money-back up until the consultation call happens.
            </p>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-lg overflow-hidden shadow-xl shadow-navy-900/10">
            <Image
              src="/photos/blueprint_premium_zoom_call_297.jpg"
              alt="Ryan Riggins on a Zoom consultation call with a family"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">What you get for $297.</h2>
            <p className="mt-4 text-lg text-ink/80">
              Four things, in this order. The Core system first, then the
              personal layer on top so you&rsquo;re not running it alone.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {whatYouGet.map((item, i) => (
              <Card key={item.title} className="bg-cream">
                <CardContent className="pt-6">
                  <div className="font-serif text-4xl font-extrabold text-gold-500 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-navy-700">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-ink/80 leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="bg-sand border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">Who Premium is for.</h2>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                You&rsquo;re in the right place if...
              </h3>
              <ul className="mt-5 space-y-3">
                {whoForSignals.map((s) => (
                  <li key={s} className="flex gap-3 text-ink/85">
                    <span aria-hidden className="text-burgundy-600 mt-[2px]">
                      ✓
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                Probably not the right fit if...
              </h3>
              <ul className="mt-5 space-y-3">
                {whoNotFor.map((s) => (
                  <li key={s} className="flex gap-3 text-ink/70">
                    <span aria-hidden className="text-ink/40 mt-[2px]">
                      &ndash;
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHY DIFFERENT FROM CONSULTING */}
      <section className="bg-burgundy-700 text-cream">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <GoldRule />
            <h2 className="mt-3 text-cream">
              Why this isn&rsquo;t consulting.
            </h2>
            <p className="mt-4 text-lg text-cream/90 leading-relaxed">
              Consulting bills by the hour, keeps you on the clock, and always
              tries to sell you the next tier. Premium is built to do the
              opposite.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {differentFromConsulting.map((d) => (
              <div key={d.title}>
                <h3 className="font-serif text-xl text-gold-300">{d.title}</h3>
                <p className="mt-3 text-cream/85 leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY THIS EXISTS (RYAN'S STORY) */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 lg:grid-cols-5 items-center">
          <div className="lg:col-span-2 relative aspect-square rounded-lg overflow-hidden bg-cream">
            <Image
              src="/photos/flipper_now_protector_brand_narrative.png"
              alt="Graphic: Ryan's story, flipper turned advisor"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-contain p-6"
            />
          </div>
          <div className="lg:col-span-3">
            <GoldRule />
            <h2 className="mt-3">Why Premium exists.</h2>
            <div className="mt-6 space-y-5 text-lg text-ink/85 leading-relaxed">
              <p>
                For 8 years, I flipped houses. More than half of what I bought
                came from seniors or the adult kids sorting out a parent&rsquo;s
                estate. I watched families make rushed calls under crisis
                pressure and lose $50,000 or $100,000 of equity because nobody
                laid out the options in plain English.
              </p>
              <p>
                I switched sides. Blueprint Core gives families the full system
                so they can run it themselves. But some situations are too
                messy or too high-stakes for self-serve. The house has too
                much equity on the line. The siblings aren&rsquo;t aligned. The
                clock is ticking.
              </p>
              <p className="font-serif text-xl text-burgundy-600">
                Premium is for those situations. A fixed-price way to get me
                on the phone, looking at your specific situation, without
                signing up for a $5,000 consulting package.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="bg-sand border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">What Premium actually looks like.</h2>
            <p className="mt-4 text-lg text-ink/80">
              Three composite stories, drawn from real Premium engagements.
              Names changed, details blended, outcomes accurate.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {caseStudies.map((c) => (
              <Card key={c.title} className="bg-white flex flex-col">
                <CardContent className="pt-6 flex-1 flex flex-col">
                  <h3 className="font-serif text-xl text-navy-700">{c.title}</h3>
                  <div className="mt-4 space-y-4 text-sm text-ink/85 leading-relaxed flex-1">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-burgundy-600 mb-1">
                        The situation
                      </div>
                      <p>{c.situation}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-burgundy-600 mb-1">
                        What we did
                      </div>
                      <p>{c.what}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-gold-700 mb-1">
                        The outcome
                      </div>
                      <p className="font-semibold text-navy-700">{c.outcome}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-b border-border">
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
          <h2 className="mt-3 text-cream">Ready when you are.</h2>
          <p className="mt-6 text-lg text-cream/85 max-w-2xl mx-auto">
            $297, one-time. 14-day money-back before the call. Personalized
            plan, 60 minutes with Ryan, 90 days of email support. If
            you&rsquo;d rather talk first, book the free 20-minute call.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-gold-500 text-navy-900 hover:bg-gold-300">
              <a
                href={paymentLinks.blueprintPremium}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Blueprint Premium, $297
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-cream text-cream hover:bg-cream hover:text-navy-600"
            >
              <Link href="/work-with-ryan">Book a free 20-min call</Link>
            </Button>
          </div>
          <EmailFallback variant="dark" align="center" className="mt-6" />
        </div>
      </section>
    </main>
  );
}
