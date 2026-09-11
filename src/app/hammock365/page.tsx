import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { EmailFallback } from "@/components/site/EmailFallback";
import { AppPlatformBadges } from "@/components/site/AppPlatformBadges";
import { JsonLd } from "@/components/site/JsonLd";
import { paymentLinks } from "@/lib/payment-links";
import { seniorSafeMobileApplicationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Hammock365 | The Family App for Senior Care",
  description:
    "Hammock365 is free, forever: the daily I'm Okay check-in, a text to one family member when it is missed, medication reminders, and Maggie, one assistant for the senior and the family. One paid plan, $14.99 a month or $140 a year, for the whole family.",
  alternates: { canonical: "/hammock365" },
  openGraph: {
    type: "website",
    url: "https://rigginsstrategicsolutions.com/hammock365",
    siteName: "Riggins Strategic Solutions",
    title: "Hammock365 | The Family App for Senior Care",
    description:
      "Your family. One place. One plan. Free forever: the daily I'm Okay check-in, a text when it is missed, medication reminders, and Maggie, one assistant for the senior and the family. One paid plan, $14.99 a month or $140 a year.",
    images: [
      {
        url: "https://rigginsstrategicsolutions.com/og/hammock365.png",
        width: 1200,
        height: 630,
        alt: "Hammock365: your family, one place, one plan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hammock365 | The Family App for Senior Care",
    description:
      "Your family. One place. One plan. The daily coordination app for families facing senior care decisions.",
    images: ["https://rigginsstrategicsolutions.com/og/hammock365.png"],
  },
};

const painPoints: {
  feature: string;
  title: string;
  pain: string;
  fix: string;
  paid?: boolean;
}[] = [
  {
    feature: "Daily check-in",
    title: "The daily “did she answer?” check.",
    pain: "Phone call goes to voicemail. Text unanswered. Every minute of silence, your mind goes to the worst place. By the time they text back “sorry, was in the shower,” you’ve already pictured a 911 call.",
    fix: "One tap daily check-in. Mom hits “I’m okay” in the morning and the family sees the green light at the same time. If the tap never comes, one family member gets a text, free. On the paid plan, everyone does. No more pit-in-your-stomach mornings.",
  },
  {
    feature: "Family messages",
    paid: true,
    title: "Group texts that fall apart.",
    pain: "Someone misses a message. Someone else hits reply-all with a rant. The one sibling who lives closest ends up as the unpaid switchboard operator, and nothing stays organized.",
    fix: "A private family channel built just for mom or dad’s care. Everyone sees the same updates, the same history, the same list of what’s next. The caregiver sibling finally stops being the middleman.",
  },
  {
    feature: "Medication reminders",
    title: "Medication confusion across caregivers.",
    pain: "Morning pill, evening pill, new prescription from the follow-up appointment, one caregiver on Tuesday and a different one Thursday. Nobody has a single source of truth for what was taken when.",
    fix: "One medication list with reminders on your parent’s phone, free. On the paid plan the family gets a missed-dose alert, so Tuesday’s caregiver knows what happened Thursday without a phone call. No more “did she get her blood pressure pill?” guessing game.",
  },
  {
    feature: "Document vault",
    paid: true,
    title: "Paperwork scattered everywhere.",
    pain: "POA in a filing cabinet. Insurance card photo on somebody’s phone. Doctor’s note on the fridge. When it’s finally needed, it’s always in the one place nobody can find.",
    fix: "One secure document vault. POA, insurance cards, advance directive, doctor’s notes, all in your pocket. When you’re sitting in an ER at 11 PM, you’re not tearing the house apart. You’re showing the nurse your phone.",
  },
];

const features: { title: string; body: string; plan: "free" | "paid" }[] = [
  {
    plan: "free",
    title: "The daily “I’m Okay” check-in",
    body: "One tap on your parent’s phone each morning, a push notification to the family, and a history you can look back on. If the check-in is missed, or your parent presses I Need Help, one family member gets a text. The emergency card is there too.",
  },
  {
    plan: "free",
    title: "Medication reminders",
    body: "The full medication list with reminders on your parent’s phone at the times each dose is due. Nothing to set up beyond the list itself.",
  },
  {
    plan: "free",
    title: "Maggie, one assistant for the whole family",
    body: "Plain answers in large type for your parent. Planning help for you. Every family gets 10 messages free, and the paid plan opens Maggie up every day.",
  },
  {
    plan: "paid",
    title: "Family messages",
    body: "A real thread for the family, not the group-text chaos. Siblings, spouses, and caregivers stay on the same page without CC’ing the neighbor by accident. Unlimited family members, joined by code.",
  },
  {
    plan: "paid",
    title: "Document vault",
    body: "POA, insurance cards, healthcare directives, doctor notes. Scan once, organized forever. Shareable with the family members who need access, private from the ones who don’t.",
  },
  {
    plan: "paid",
    title: "Appointments and missed-dose alerts",
    body: "Appointments the whole family can see, so everyone knows who is driving to which follow-up. And when a dose is missed, the family hears about it, not just the phone on the nightstand.",
  },
];

const freePlan: string[] = [
  "The daily “I’m Okay” check-in",
  "A text to one family member when the check-in is missed or I Need Help is pressed",
  "Push notifications",
  "Check-in history",
  "The emergency card",
  "Medication reminders on your parent’s phone",
  "Inviting your parent to the app",
  "10 Maggie messages per family",
];

const paidPlan: string[] = [
  "Texts to everyone in the family",
  "Unlimited family members, joined by code",
  "Missed-dose alerts",
  "Family messages",
  "The document vault",
  "Appointments",
  "Maggie every day",
];

export default function SeniorSafePage() {
  return (
    <main>
      <JsonLd data={seniorSafeMobileApplicationSchema()} />

      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <Badge variant="secondary" className="bg-burgundy-100 text-burgundy-700 border-0">
              Free forever &middot; Paid plan $14.99 a month
            </Badge>
            <h1 className="mt-6 leading-[1.05]">
              Hammock365. The family app for the daily part of senior care.
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink/80">
              Your parent taps I&rsquo;m Okay once a day. If the tap does not
              come, one family member gets a text. That is the whole idea, and
              it is free for as long as you use it. Medication reminders,
              check-in history, the emergency card, and your first 10 messages
              with Maggie, the app&rsquo;s one assistant, are free too.
            </p>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink/80">
              The Blueprint is the plan. Hammock365 is what keeps it running
              after the move, on the ordinary days.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a
                  href={paymentLinks.seniorSafe}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Hammock365 free
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/the-blueprint">Compare with The Blueprint</a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-ink/60">
              No card at signup. No trial clock. One paid plan, $14.99 a month
              or $140 a year for the whole family, when you want everyone
              looped in. Cancel anytime. No partial-month refunds.
            </p>
            <AppPlatformBadges className="mt-8" />
            <p className="mt-4 text-sm text-ink/60">
              More on the app, features, and pricing at{" "}
              <a
                href="https://hammock365.com"
                className="font-semibold text-burgundy-600 hover:text-burgundy-700 underline underline-offset-2"
              >
                hammock365.com
              </a>
              .
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
              Hammock365 is built to get past all of them.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {painPoints.map((p, i) => (
              <Card key={p.title} className="bg-cream">
                <CardContent className="pt-6">
                  <div className="font-serif text-4xl font-extrabold text-gold-500 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                    <span>{p.feature}</span>
                    {p.paid ? (
                      <span className="rounded-full border border-burgundy-600/40 px-2 py-0.5 text-[10px]">
                        Paid plan
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 font-serif text-xl text-navy-700">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-ink/80 leading-relaxed">{p.pain}</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-ink/85 leading-relaxed">
                      <strong className="text-burgundy-700">
                        Hammock365 fixes it:
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
              Six things Hammock365 does so the family doesn&rsquo;t have to
              keep six separate systems in their head. Three are free forever.
              Three come with the paid plan.
            </p>
          </div>

          <div className="mt-8 border-l-2 border-gold-500 pl-4 max-w-xl">
            <p className="italic font-serif text-lg text-burgundy-700">
              Free forever means free forever. The paid plan is one price,
              $14.99 a month or $140 a year, for the whole family.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-border rounded-lg p-6">
                <div
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    f.plan === "paid" ? "text-burgundy-600" : "text-navy-700"
                  }`}
                >
                  {f.plan === "paid" ? "Paid plan" : "Free forever"}
                </div>
                <h3 className="mt-2 font-serif text-xl text-navy-700">{f.title}</h3>
                <p className="mt-3 text-ink/80 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAGGIE */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <GoldRule />
            <h2 className="mt-3">One assistant. Her name is Maggie.</h2>
            <p className="mt-4 text-lg text-ink/80">
              Hammock365 has one assistant, and she works for both sides of
              the family.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="bg-cream border border-border rounded-lg p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                For your parent
              </div>
              <p className="mt-3 text-ink/85 leading-relaxed">
                Plain answers in large type. What a Medicare notice means. How
                to word a note to the doctor. What day the appointment is.
                Maggie answers the way a patient grandchild would.
              </p>
            </div>
            <div className="bg-cream border border-border rounded-lg p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                For you
              </div>
              <p className="mt-3 text-ink/85 leading-relaxed">
                Planning help for the adult child running the move. Maggie
                knows the full 20-module Blueprint, the hard conversations,
                and what to do when the wholesaler letter shows up. Ask her at
                2 AM if that is when the question comes.
              </p>
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-lg text-ink/80 leading-relaxed">
            Every family gets 10 Maggie messages free. The paid plan opens her
            up every day, for everyone in the family.
          </p>
          <Button asChild className="mt-6">
            <a
              href={paymentLinks.seniorSafe}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Hammock365 free
            </a>
          </Button>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-burgundy-700 text-cream">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center">
            <GoldRule className="mx-auto" />
            <h2 className="mt-3 text-cream">Free forever. One paid plan.</h2>
            <p className="mt-6 text-lg text-cream/90 max-w-2xl mx-auto leading-relaxed">
              No card at signup. No trial clock. The free app is the whole
              daily check-in, and it stays free for as long as your family
              uses it. The paid plan is for families who want everyone looped
              in.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-cream/30 bg-cream/5 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-gold-500">
                Free, forever
              </div>
              <div className="mt-2 font-serif text-3xl text-cream">$0</div>
              <ul className="mt-6 space-y-3 text-cream/90">
                {freePlan.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-500 flex-none" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border-2 border-gold-500 bg-cream/10 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-gold-500">
                Paid plan, the whole family
              </div>
              <div className="mt-2 font-serif text-3xl text-cream">
                $14.99 a month{" "}
                <span className="text-lg text-cream/80">or $140 a year</span>
              </div>
              <p className="mt-3 text-sm text-cream/80">Everything in free, plus:</p>
              <ul className="mt-4 space-y-3 text-cream/90">
                {paidPlan.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-500 flex-none" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 max-w-2xl mx-auto text-center text-cream/85 leading-relaxed">
            Paid features show a lock in the app. Tap the lock and you see the
            price. Nothing is charged unless you choose the plan. Cancel
            anytime. No partial-month refunds.
          </p>

          <div className="mt-8 text-center">
            <Button asChild size="lg" className="bg-gold-500 text-navy-900 hover:bg-gold-300">
              <a
                href={paymentLinks.seniorSafe}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Hammock365 free
              </a>
            </Button>
            <p className="mt-4 text-sm text-cream/70">
              The family pays directly. Ryan&rsquo;s incentive is to keep your
              family happy, not to push you toward a transaction.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT FITS */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <GoldRule />
          <h2 className="mt-3">How Hammock365 fits with The Blueprint.</h2>
          <div className="mt-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <p>
              The Blueprint is the one-time plan: the framework, the
              checklists, the exit strategies, the scripts for the hard
              conversations. You buy it once, you execute it once, and most
              families don&rsquo;t need it again.
            </p>
            <p>
              Hammock365 is the ongoing layer. The daily check-in and the
              medication reminders, free, for years. And on the paid plan, the
              family messages and the document vault that get used every
              week. Built to run after the plan is in motion.
            </p>
            <p>
              Plenty of families use one without the other. Some use both. The
              Blueprint page lays out every way to work together side by side so you can
              pick what fits.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href="/the-blueprint">See all the ways to work together</a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/work-with-ryan">Book a free call to talk it through</Link>
            </Button>
          </div>
          <EmailFallback className="mt-4" />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-navy-600 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">Stop holding it all in your head.</h2>
          <p className="mt-6 text-lg text-cream/85 max-w-2xl mx-auto">
            Free forever. No card, no clock. If it works for your family,
            stay. If not, walk.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gold-500 text-navy-900 hover:bg-gold-300">
            <a
              href={paymentLinks.seniorSafe}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Hammock365 free
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
