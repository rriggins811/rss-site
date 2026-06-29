import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces } from "next/font/google";
import { paymentLinks } from "@/lib/payment-links";
import { JsonLd } from "@/components/site/JsonLd";
import { QuickAnswer } from "@/components/aeo/QuickAnswer";
import {
  breadcrumbListSchema,
  faqPageSchema,
  blueprintCoreProductSchema,
  blueprintCourseSchema,
} from "@/lib/schema";
import { abs } from "@/lib/site";

// Warm display serif for the headlines, mirroring the premium care-roadmap feel.
const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const display = serif.className;

const CORE_CHECKOUT = paymentLinks.blueprintCore;
const SUPPORT_EMAIL = "ryan@rigginsstrategicsolutions.com";

export const metadata: Metadata = {
  title: "Blueprint Core | The Self-Serve Senior Transition System, $47",
  description:
    "Blueprint Core is the complete senior transition system you run yourself: the whole roadmap, 20 modules, and 70-plus tools, at your own pace. $47, one-time, lifetime access.",
  alternates: { canonical: "/blueprint-core" },
  openGraph: {
    type: "website",
    url: "https://rigginsstrategicsolutions.com/blueprint-core",
    siteName: "Riggins Strategic Solutions",
    title: "Blueprint Core | The Self-Serve Senior Transition System",
    description:
      "The whole path of a senior transition, in your hands. 20 modules, 70-plus tools, 5 exit strategies. Walk it at your own pace. $47, one-time.",
    // OG image is generated per-route by ./opengraph-image.tsx, so no static image here.
  },
  twitter: {
    card: "summary_large_image",
    title: "Blueprint Core | The Self-Serve Senior Transition System",
    description:
      "The whole transition mapped, 20 modules, 70-plus tools. Walk it yourself at your own pace. $47, one-time.",
  },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "How is Blueprint Core different from the Senior Transition Roadmap?",
    a: "Core is the full self-serve system. You work through all 20 modules and 70-plus tools on your own time, at your own pace. The Senior Transition Roadmap is everything in Core plus a personalized written plan, a 60-minute call with Ryan, and 90 days of email support. If you want the system to run yourself, Core is it. If you want someone in your corner while you run the play, step up to the Roadmap.",
  },
  {
    q: "Do I get lifetime access?",
    a: "Yes. Blueprint Core is a one-time $47 purchase with lifetime access. Every module, every tool, and every update, yours to keep. Work through it on whatever timeline your family's situation calls for.",
  },
  {
    q: "Can I upgrade to the Roadmap later?",
    a: "Yes. When you buy Blueprint Core at $47, you get an email within minutes with a discount code that credits the full $47 toward the Senior Transition Roadmap whenever you decide you want Ryan in the room. No double-paying.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes. Blueprint Core comes with a 14-day money-back guarantee. If it is not what you need, email us within 14 days for a full refund.",
  },
];

// --- Data -------------------------------------------------------------------

type Phase = {
  num: string;
  title: string;
  range: string;
  tagline: string;
  anchor?: boolean;
  blurb: string;
  covers: { label: string; slug: string }[];
  tools: string[];
};

const PHASES: Phase[] = [
  {
    num: "1",
    title: "Get Your Bearings",
    range: "Modules 00 to 04",
    tagline: "Clarity first",
    blurb:
      "Before anything moves, we get your family on the same page and take an honest look at where you actually stand. Then we start clearing the house: the sorting, the paperwork, and the tough sentimental decisions that stop most families cold.",
    covers: [
      { label: "Foundations and Quick Start", slug: "module-00" },
      { label: "Starting Point Assessment", slug: "module-01" },
      { label: "Sorting and Decluttering", slug: "module-02" },
      { label: "Paperwork System", slug: "module-03" },
      { label: "Sentimental Items and Decisions", slug: "module-04" },
    ],
    tools: [
      "Starting Point Assessment",
      "Transition Stage Readiness",
      "5-Pile Sorting System",
      "3-Folder Paperwork System",
    ],
  },
  {
    num: "2",
    title: "The Home and the Money",
    range: "Modules 05 to 09",
    tagline: "Where the dollars are won or lost",
    anchor: true,
    blurb:
      "What the home is really worth, the repairs that actually pay you back versus the ones that just drain the account, every way to sell, and how to spot the cash buyers and wholesalers circling. Plus the legal and financial footing, so the home decision lines up with the rest of the plan instead of blowing it up. This is where the system goes deepest, because it is where the biggest dollars are won or lost.",
    covers: [
      { label: "Property Prep and Repairs", slug: "module-05" },
      { label: "Legal and Financial Foundation", slug: "module-06" },
      { label: "Touring and Comparing Facilities", slug: "module-07" },
      { label: "Asset and Estate Inventory", slug: "module-08" },
      { label: "Sale Decision Path", slug: "module-09" },
    ],
    tools: [
      "Smart Prep Budget",
      "Repair Priority",
      "Transition Cost Estimator",
      "Net Proceeds Calculator",
      "Cash Offer Evaluation",
      "Decision Pyramid",
    ],
  },
  {
    num: "3",
    title: "Make the Move",
    range: "Modules 10 to 12",
    tagline: "The hand-off nobody warns you about",
    blurb:
      "The logistics nobody warns you about. The move timeline, closing day, and the first 72 hours after, which is when most things go sideways if no one is watching.",
    covers: [
      { label: "Move Logistics", slug: "module-10" },
      { label: "Closing Day", slug: "module-11" },
      { label: "First 72 Hours After Move", slug: "module-12" },
    ],
    tools: [
      "Move Timeline",
      "Closing Day Checklist",
      "First 72 Hours Playbook",
      "Daily Check-In",
    ],
  },
  {
    num: "4",
    title: "The Long Game",
    range: "Modules 13 to 18",
    tagline: "Your team steps in",
    blurb:
      "Keeping the family standing and the plan funded for the long haul. Family dynamics, aging in place versus moving, long-term care, government benefits, estate planning, and watching for caregiver burnout. This is where you build your team. For care, legal, financial, and the rest, the system shows you how to work with your own professionals, or find and vet the credentialed ones you need in your area and state.",
    covers: [
      { label: "Family Dynamics", slug: "module-13" },
      { label: "Aging in Place vs Move", slug: "module-14" },
      { label: "Long-Term Care Planning", slug: "module-15" },
      { label: "Government Benefits", slug: "module-16" },
      { label: "Estate Planning", slug: "module-17" },
      { label: "Caregiver Self-Care", slug: "module-18" },
    ],
    tools: [
      "Family Meeting Agenda",
      "Aging Cost Calculator",
      "LTC Decision",
      "Medicaid Spend-Down",
      "Trust Selection",
      "Burnout Assessment",
    ],
  },
  {
    num: "5",
    title: "Cross the Finish Line",
    range: "Module 19",
    tagline: "Wrap it up and breathe",
    blurb:
      "Wrap it up, take a breath, and look at what is next. A check-back to make sure the plan held, and a soft landing into SeniorSafe for the day to day once the transition is done.",
    covers: [{ label: "Completion", slug: "module-19" }],
    tools: ["Completion Assessment"],
  },
];

const FEELINGS = [
  ["The all-at-once", "The house, the money, the paperwork, and the care all land in the same hard week."],
  ["The guilt", "Wondering whether you are doing enough, or doing right by your parent."],
  ["Fear of the wrong call", "Big decisions with real money on them, and no map to follow."],
  ["Family friction", "Siblings and spouses who do not all see it the same way."],
  ["Caregiver exhaustion", "Running on empty while trying to hold everyone else up."],
  ["Decision paralysis", "Every path feels uncertain, so the easy, costly choice wins."],
] as const;

// --- Page -------------------------------------------------------------------

export default function BlueprintCorePage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "The Blueprint", path: "/the-blueprint" },
    { name: "Blueprint Core", path: "/blueprint-core" },
  ]);

  return (
    <main className="w-full bg-cream text-ink">
      <JsonLd data={faqPageSchema(FAQS, abs("/blueprint-core"))} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={blueprintCoreProductSchema()} />
      <JsonLd data={blueprintCourseSchema()} />

      {/* HERO */}
      <section className="border-b border-cream-200 bg-cream">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-burgundy/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-burgundy">
              Blueprint Core &middot; $47
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy/60">
              The complete system, in your hands
            </span>
          </div>
          <h1 className={`${display} mt-7 text-4xl leading-[1.08] text-navy sm:text-5xl lg:text-6xl`}>
            <span className="italic text-gold-700">The Whole Path,</span>
            <br />
            In Your Hands
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">
            When a parent needs to move, it hits all at once. The house, the money, the paperwork, the
            care, the family, and a hundred decisions you have never had to make before, usually in the
            middle of a hard week. Blueprint Core lays the whole transition out in front of you, in order,
            so you can walk it at your own pace and see every step before you decide anything.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["The whole map", "Every phase of the transition, in order, in one place."],
              ["Your own pace", "No deadlines, lifetime access. Work it when your family needs it."],
              ["Every tool included", "All 70-plus tools, scripts, and calculators, ready to use."],
            ].map(([h, s]) => (
              <div key={h} className="rounded-lg border-l-4 border-gold bg-white/70 px-5 py-4">
                <p className="font-semibold text-navy">{h}</p>
                <p className="mt-1 text-sm text-ink/70">{s}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink/70">
            The same playbook Ryan uses with paying clients, built on years on the buying side of real estate,
            across dozens of properties, by a licensed North Carolina broker who now works for families instead
            of against them.
          </p>

          <QuickAnswer
            className="mt-8 max-w-2xl"
            topic="Blueprint Core tier"
            question="What is Blueprint Core?"
            answer="Blueprint Core is the complete Senior Transition Blueprint system you run yourself: all 20 modules and 70 plus tools that map the whole transition, from getting your bearings to crossing the finish line. Self-paced, with lifetime access. Forty seven dollars, one time. It is the same playbook Ryan uses with paying clients, without the one on one call."
          />

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={CORE_CHECKOUT}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-navy px-7 py-3.5 font-semibold text-cream transition hover:bg-navy-800"
            >
              Get Blueprint Core, $47
            </a>
            <a href="#phases" className="text-sm font-semibold text-burgundy underline underline-offset-4">
              See the five phases first
            </a>
          </div>
        </div>
      </section>

      {/* FEELINGS LAYER */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className={`${display} text-2xl text-navy sm:text-3xl`}>What families carry</h2>
          <p className="mt-2 text-ink/70">If you recognize yourself here, you are not behind, and you are not alone.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEELINGS.map(([h, s]) => (
              <div key={h} className="rounded-lg border border-cream-200 bg-cream/60 p-5">
                <p className="font-semibold text-navy">{h}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{s}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border-l-4 border-burgundy bg-burgundy/5 px-6 py-4">
            <p className="text-ink/90">
              This is exactly the weight the system is built to carry. It brings order, calm, and a clear
              next step to all of it, so you can take them one at a time.
            </p>
          </div>
        </div>
      </section>

      {/* ROADMAP AT A GLANCE */}
      <section id="phases" className="scroll-mt-20 bg-navy text-cream">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
          <h2 className={`${display} text-3xl sm:text-4xl`}>Your roadmap at a glance</h2>
          <p className="mt-2 text-cream/70">Five connected phases. You walk them in order, at your own pace, with every tool in hand.</p>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {PHASES.map((p) => (
              <li key={p.num} className="relative flex flex-col items-start">
                <div className={`${display} flex h-12 w-12 items-center justify-center rounded-full bg-gold text-xl font-bold text-navy`}>
                  {p.num}
                </div>
                <p className="mt-4 font-semibold leading-snug text-cream">{p.title}</p>
                <p className="mt-1 text-sm italic text-gold">{p.tagline}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PER-PHASE DETAIL */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="space-y-8">
            {PHASES.map((p) => (
              <article
                key={p.num}
                className={
                  "relative overflow-hidden rounded-xl border bg-white p-7 lg:p-9 " +
                  (p.anchor ? "border-gold shadow-sm" : "border-cream-200")
                }
              >
                <span className={`${display} pointer-events-none absolute right-5 top-2 select-none text-7xl font-bold text-cream-200`}>
                  {p.num.padStart(2, "0")}
                </span>
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">
                      Phase {p.num} of 5 · {p.range}
                    </span>
                    {p.anchor ? (
                      <span className="rounded-full bg-burgundy/10 px-2.5 py-0.5 text-xs font-semibold text-burgundy">
                        Where the dollars are won or lost
                      </span>
                    ) : null}
                  </div>
                  <h3 className={`${display} mt-2 text-2xl text-navy sm:text-3xl`}>{p.title}</h3>
                  <p className="mt-1 text-sm italic text-ink/60">{p.tagline}</p>
                  <p className="mt-4 max-w-3xl leading-relaxed text-ink/80">{p.blurb}</p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-navy/60">What this covers</p>
                      <ul className="mt-2 space-y-1.5">
                        {p.covers.map((m) => (
                          <li key={m.slug} className="flex gap-2 text-sm text-navy/90">
                            <span aria-hidden className="text-gold-700">&middot;</span>
                            <span>{m.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-navy/60">Key tools</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {p.tools.map((t) => (
                          <span key={t} className="rounded-full bg-cream px-3 py-1 text-xs text-ink/75">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream">
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

      {/* CORE OFFER + CTA */}
      <section className="bg-navy text-cream">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
          <h2 className={`${display} text-3xl sm:text-4xl`}>The whole system, in your hands</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-cream/85">
            Blueprint Core is the complete Senior Transition Blueprint, yours to run at your own pace. The full
            five-phase map, all 20 modules, and every one of the 70-plus tools, scripts, and calculators. The
            same playbook Ryan uses with paying clients, so you can make the big calls with confidence instead
            of guessing under pressure.
          </p>

          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Everything in Blueprint Core</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "All 20 modules, the full five-phase transition mapped end to end.",
                "All 70-plus tools, scripts, checklists, and calculators, ready to use.",
                "The 5 exit strategies for the home, not just a traditional listing.",
                "Scripts for the hard family conversations most people avoid.",
                "Self-paced with lifetime access. No deadlines, yours to keep.",
                "A 14-day money-back guarantee, no questions asked.",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-cream/15 bg-white/[0.04] px-4 py-3">
                  <span className="mt-0.5 text-gold">&#10003;</span>
                  <span className="text-sm leading-relaxed text-cream/85">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-cream/15 bg-white/[0.04] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Want Ryan in the room with you?</p>
            <p className="mt-3 text-cream/85">
              Some situations are too high-stakes for self-serve: too much equity on the line, the siblings not
              aligned, the clock ticking. The{" "}
              <strong className="font-semibold text-cream">Senior Transition Roadmap</strong> is everything in Core
              plus a personalized written plan, a 60-minute call with Ryan, and 90 days of support. And your $47
              credits toward it if you upgrade.
            </p>
            <Link
              href="/blueprint-premium"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold underline underline-offset-4 hover:text-cream"
            >
              See the Senior Transition Roadmap
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href={CORE_CHECKOUT}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-gold px-7 py-3.5 font-semibold text-navy transition hover:bg-gold-700 hover:text-cream"
            >
              Get Blueprint Core, $47
            </a>
            <Link href="/the-blueprint" className="text-sm text-cream/80 underline underline-offset-4 hover:text-gold">
              Compare every way to work with Ryan
            </Link>
            <a
              href="https://blueprint.rigginsstrategicsolutions.com/login"
              className="text-sm text-cream/55 underline underline-offset-4 hover:text-gold"
            >
              Already purchased? Log in
            </a>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-cream/70">
            <span className="font-semibold text-gold">14-day money-back guarantee.</span> If Blueprint Core is
            not what your family needs, email us within 14 days and we refund every dollar.
          </p>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="text-xs leading-relaxed text-ink/55">
            This is education and real estate guidance, not legal, tax, or financial advice. Ryan Riggins is a
            licensed North Carolina real estate broker (#361546, eXp Realty) and works as a fiduciary to the
            families he serves. We coordinate with your attorney, tax professional, and financial advisor. We do
            not replace them. Questions? Email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
