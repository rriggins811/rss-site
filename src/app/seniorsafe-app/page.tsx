import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { paymentLinks } from "@/lib/payment-links";

export const metadata: Metadata = {
  title: "SeniorSafe — The Family App for Senior Care",
  description:
    "SeniorSafe is the daily coordination app for families navigating senior care. Daily check-ins, medication tracking, family messaging, document vault, and AI assistant. $14.99/month, 14-day free trial, cancel anytime.",
};

const painPoints: { feature: string; title: string; pain: string; fix: string }[] = [
  {
    feature: "Daily check-in",
    title: "The daily \u201Cdid she answer?\u201D check.",
    pain: "Phone call goes to voicemail. Text unanswered. Every minute of silence, your mind goes to the worst place. By the time they text back \u201Csorry, was in the shower,\u201D you\u2019ve already pictured a 911 call.",
    fix: "One tap daily check-in. Mom hits \u201CI\u2019m okay\u201D in the morning and the whole family sees the green light at the same time. No more pit-in-your-stomach mornings.",
  },
  {
    feature: "Family channel",
    title: "Group texts that fall apart.",
    pain: "Someone misses a message. Someone else hits reply-all with a rant. The one sibling who lives closest ends up as the unpaid switchboard operator, and nothing stays organized.",
    fix: "A private family channel built just for mom or dad\u2019s care. Everyone sees the same updates, the same history, the same list of what\u2019s next. The caregiver sibling finally stops being the middleman.",
  },
  {
    feature: "Med log",
    title: "Medication confusion across caregivers.",
    pain: "Morning pill, evening pill, new prescription from the follow-up appointment, one caregiver on Tuesday and a different one Thursday. Nobody has a single source of truth for what was taken when.",
    fix: "Shared medication list with a simple \u201Ctaken / not taken\u201D log. Tuesday\u2019s caregiver sees what Thursday\u2019s caregiver did. No more \u201Cdid she get her blood pressure pill?\u201D guessing game.",
  },
  {
    feature: "Document vault",
    title: "Paperwork scattered everywhere.",
    pain: "POA in a filing cabinet. Insurance card photo on somebody\u2019s phone. Doctor\u2019s note on the fridge. When it\u2019s finally needed, it\u2019s always in the one place nobody can find.",
    fix: "One secure document vault. POA, insurance cards, advance directive, doctor\u2019s notes, all in your pocket. When you\u2019re sitting in an ER at 11 PM, you\u2019re not tearing the house apart. You\u2019re showing the nurse your phone.",
  },
];

const features: { title: string; body: string }[] = [
  {
    title: "Daily wellness check-ins",
    body: "A simple morning prompt for the senior, a real-time update for the family. Missed a check-in? The app tells the people who need to know, without a dozen frantic phone calls.",
  },
  {
    title: "Medication and appointment tracking",
    body: "One place for the full medication list, dosages, times, and refill dates. Appointments synced so everyone knows who's driving to which follow-up.",
  },
  {
    title: "Private family messaging",
    body: "A real thread for the family, not the group-text chaos. Siblings, spouses, and caregivers stay on the same page without CC'ing the neighbor by accident.",
  },
  {
    title: "Document vault",
    body: "POA, insurance cards, healthcare directives, doctor notes. Scan once, organized forever. Shareable with the family members who need access, private from the ones who don't.",
  },
  {
    title: "AI senior-care assistant",
    body: "Not a generic chatbot. A real helper that knows senior care. Drop in a Medicare notice and get it in plain English. Ask what to do about mom\u2019s new diagnosis. Need a script for the hard conversation with dad? It\u2019s got one. Available at 2 AM when the crisis hits and you need an answer before morning.",
  },
  {
    title: "Works with the Blueprint playbook",
    body: "Every feature is built around the same system the Blueprint teaches. If you bought Core or Premium, SeniorSafe is the daily tool that keeps the plan running.",
  },
];

export default function SeniorSafePage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <Badge variant="secondary" className="bg-burgundy-100 text-burgundy-700 border-0">
              SeniorSafe &middot; $14.99/mo &middot; 14-day free trial
            </Badge>
            <h1 className="mt-6 leading-[1.05]">
              SeniorSafe. The family app for the daily part of senior care.
            </h1>
            <p className="mt-6 font-serif text-xl text-burgundy-600 leading-snug max-w-prose">
              &ldquo;I&rsquo;m not a move manager and I&rsquo;m not a listing
              agent. I&rsquo;m the advisor who helps families avoid the $50K
              mistakes.&rdquo;
            </p>
            <p className="mt-6 max-w-prose text-lg text-ink/80">
              The Blueprint is the plan. SeniorSafe is the daily tool that
              keeps the plan running: check-ins, medications, messaging, the
              document vault, and an AI assistant for all the paperwork that
              used to slip through the cracks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a
                  href={paymentLinks.seniorSafe}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start your free 14-day trial
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/the-blueprint">Compare with The Blueprint</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-ink/60">
              $14.99/month after the trial. Cancel anytime. No partial-month refunds.
            </p>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-lg overflow-hidden shadow-xl shadow-navy-900/10">
            <Image
              src="/photos/stock_video_call_setup.jpg"
              alt="Family on a video call, coordinating care together"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* PROBLEM: COORDINATION CHAOS */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">Coordination chaos lives in the daily details.</h2>
            <p className="mt-4 text-lg text-ink/80">
              Every family running senior care hits the same four walls.
              SeniorSafe is built to get past all of them.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {painPoints.map((p, i) => (
              <Card key={p.title} className="bg-cream">
                <CardContent className="pt-6">
                  <div className="font-serif text-4xl font-extrabold text-gold-500 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                    {p.feature}
                  </div>
                  <h3 className="mt-3 font-serif text-xl text-navy-700">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-ink/80 leading-relaxed">{p.pain}</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-ink/85 leading-relaxed">
                      <strong className="text-burgundy-700">
                        SeniorSafe fixes it:
                      </strong>{" "}
                      {p.fix}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION: FEATURES */}
      <section className="bg-sand border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">One app. The whole picture.</h2>
            <p className="mt-4 text-lg text-ink/80">
              Six things SeniorSafe does so the family doesn&rsquo;t have to
              keep six separate systems in their head.
            </p>
          </div>

          <div className="mt-8 border-l-2 border-gold-500 pl-4 max-w-xl">
            <p className="italic font-serif text-lg text-burgundy-700">
              Plus a 24/7 AI that knows senior care. Not a chatbot. A real helper.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-border rounded-lg p-6">
                <h3 className="font-serif text-xl text-navy-700">{f.title}</h3>
                <p className="mt-3 text-ink/80 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING / TRIAL */}
      <section className="bg-burgundy-700 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">14 days free. Then $14.99 a month.</h2>
          <p className="mt-6 text-lg text-cream/90 max-w-2xl mx-auto leading-relaxed">
            Start the trial today. Use every feature for 14 days with no
            charge. If it&rsquo;s not the right fit, cancel before day 14 and
            owe nothing. After that, $14.99 a month. Cancel anytime. No
            partial-month refunds.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gold-500 text-navy-900 hover:bg-gold-300">
            <a
              href={paymentLinks.seniorSafe}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start your free 14-day trial
            </a>
          </Button>
          <p className="mt-4 text-sm text-cream/70">
            The family pays directly. Ryan&rsquo;s incentive is to keep your
            family happy, not to push you toward a transaction.
          </p>
        </div>
      </section>

      {/* HOW IT FITS */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <GoldRule />
          <h2 className="mt-3">How SeniorSafe fits with The Blueprint.</h2>
          <div className="mt-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <p>
              The Blueprint is the one-time plan: the framework, the
              checklists, the exit strategies, the scripts for the hard
              conversations. You buy it once, you execute it once, and most
              families don&rsquo;t need it again.
            </p>
            <p>
              SeniorSafe is the ongoing layer. The daily coordination.
              Medication tracking, check-ins, the document vault that gets
              used every week for years. Built to run after the plan is in
              motion.
            </p>
            <p>
              Plenty of families use one without the other. Some use both. The
              Blueprint page lays out all four tiers side by side so you can
              pick what fits.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/the-blueprint">See all four tiers</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/work-with-ryan">Book a free call to talk it through</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-navy-600 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">Stop holding it all in your head.</h2>
          <p className="mt-6 text-lg text-cream/85 max-w-2xl mx-auto">
            14 days free. No credit card pressure. If it works for your
            family, stay. If not, walk.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gold-500 text-navy-900 hover:bg-gold-300">
            <a
              href={paymentLinks.seniorSafe}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start your free 14-day trial
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
