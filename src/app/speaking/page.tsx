import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema } from "@/lib/schema";
import { BOOKING_URL } from "@/lib/booking";

export const metadata: Metadata = {
  // Layout's title template auto-appends " | Riggins Strategic Solutions",
  // so the rendered <title> becomes "Speaking & Seminars | Riggins Strategic Solutions".
  title: "Speaking & Seminars",
  description:
    "Ryan Riggins speaks to AAAs, senior living communities, elder law firms, and community groups about senior transitions, consumer protection, and family coordination. Bookings in NC Triad / Charlotte / Triangle (in person) or virtual anywhere.",
  alternates: { canonical: "/speaking" },
  openGraph: {
    type: "website",
    url: "https://rigginsstrategicsolutions.com/speaking",
    siteName: "Riggins Strategic Solutions",
    title: "Speaking & Seminars | Riggins Strategic Solutions",
    description:
      "Ryan Riggins speaks to AAAs, senior living communities, elder law firms, and community groups about senior transitions, consumer protection, and family coordination.",
    images: [
      {
        url: "https://rigginsstrategicsolutions.com/og/speaking.png",
        width: 1200,
        height: 630,
        alt: "Riggins Strategic Solutions — Senior Transition Blueprint and SeniorSafe app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Speaking & Seminars | Riggins Strategic Solutions",
    description:
      "Ryan Riggins speaks to AAAs, senior living communities, elder law firms, and community groups. NC Triad / Charlotte / Triangle in person or virtual anywhere.",
    images: ["https://rigginsstrategicsolutions.com/og/speaking.png"],
  },
};

const audiences: string[] = [
  "Area Agencies on Aging",
  "Senior living communities (for resident families and staff)",
  "Elder law firms (lunch-and-learns, client education events)",
  "Churches and faith communities",
  "Rotary clubs, Kiwanis, community organizations",
  "Financial planning firms (client appreciation events)",
  "Hospital and health system discharge teams",
  "Caregiver support groups",
];

type Topic = {
  title: string;
  body: string;
};

const topics: Topic[] = [
  {
    title: "The Senior Transition Blueprint.",
    body: "Every stage from the first conversation to the final move, and what most families miss at each one.",
  },
  {
    title: "How Seniors Lose Their Homes.",
    body: "Wholesalers, cash buyers, deed fraud, and the 5 exit strategies families never hear about.",
  },
  {
    title: "The Nursing Home Question.",
    body: "What changed when the federal staffing rule got repealed, and the 4 questions to ask before you sign.",
  },
  {
    title: "Medicare, Medicaid, and the Gap Nobody Explains.",
    body: "What’s covered, what isn’t, and what catches families off guard.",
  },
  {
    title: "Having the Conversation.",
    body: "How to talk to a parent who doesn’t want to talk about it.",
  },
  {
    title: "Protecting the Estate.",
    body: "How a signature on the wrong document transfers everything, and the one question that prevents it.",
  },
  {
    title: "Family Coordination Without the Family Fight.",
    body: "How to keep siblings, spouses, and caregivers on the same page.",
  },
];

export default function SpeakingPage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Speaking", path: "/speaking" },
  ]);

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* HERO */}
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center">
          <Badge
            variant="secondary"
            className="bg-burgundy-100 text-burgundy-700 border-0"
          >
            Speaking
          </Badge>
          <h1 className="mt-6 leading-[1.05]">
            Bring the Blueprint to Your Organization
          </h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed max-w-prose mx-auto">
            Ryan Riggins speaks to families, professionals, and organizations
            about the decisions most people make too late in a senior
            transition. No slides full of bullet points. Real cases. Real
            numbers. Real protection.
          </p>
          <p className="mt-4 italic text-ink/70">
            No kickbacks. No commissions. Just better outcomes.
          </p>
        </div>
      </section>

      {/* WHO BOOKS RYAN */}
      <section className="bg-white border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">Who books Ryan.</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {audiences.map((a) => (
              <li
                key={a}
                className="flex items-start gap-3 rounded-lg border border-border bg-cream/40 px-4 py-3"
              >
                <span
                  aria-hidden
                  className="mt-2 inline-block h-2 w-2 flex-none rounded-full bg-gold-500"
                />
                <span className="text-ink/85 leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHAT RYAN TALKS ABOUT */}
      <section className="bg-sand border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">What Ryan talks about.</h2>
          <ol className="mt-8 grid gap-5">
            {topics.map((t, i) => (
              <li
                key={t.title}
                className="flex items-start gap-5 rounded-lg border border-border bg-white p-6"
              >
                <div
                  // cream-on-navy badge for AA contrast (>10:1).
                  // gold-on-white was 2.1:1 (WCAG large-text threshold is 3:1).
                  className="font-serif text-xl text-cream bg-navy-700 rounded-full w-12 h-12 flex items-center justify-center flex-none"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-navy-700 leading-snug">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-ink/80 leading-relaxed">{t.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 italic text-ink/70 text-center">
            Ryan tailors every presentation to your audience. These are starting
            points, not scripts.
          </p>
        </div>
      </section>

      {/* ABOUT RYAN */}
      <section className="bg-white border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">About Ryan.</h2>
          <div className="mt-8 space-y-5 text-ink/85 leading-relaxed">
            <p>
              Third-generation hospitality. Ryan grew up in his family&rsquo;s
              motel and restaurant in small-town North Carolina. His grandfather
              opened the Scotland Inn in 1956. His dad and granddad opened a
              hotel in 1994. The restaurant space went from the Plantation
              Restaurant to the Scotland Inn Restaurant to Champs Fine Foods and
              Spirits. When neither Ryan nor his sister wanted to build a life
              in that small town, it was the right time for his father to sell
              and retire.
            </p>
            <p>
              8 years in construction project management and house flipping. Saw
              what happened to families on the other side of every deal.
              Switched sides. Built Riggins Strategic Solutions to give families
              the information that changes every decision. Two books on Amazon.
            </p>
          </div>

          <blockquote className="mt-8 border-l-4 border-gold-500 pl-5 font-serif text-xl leading-relaxed text-navy-700">
            &ldquo;I am not here to help anyone buy or sell a house. I am here
            to make sure every family has every option in front of them before
            pen hits paper.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* BOOK RYAN */}
      {/* TODO: Phase 2 — replace with Kit-tagged form (seminar-inquiry tag).
          Fields: name, organization, event type, approximate date, audience size, notes.
          Submission posts to Kit with seminar-inquiry tag plus an email
          notification to Ryan. */}
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl">Invite Ryan to speak.</h2>
          <p className="mt-4 text-lg text-ink/80 leading-relaxed">
            30 to 60 minutes. In person in the NC Triad, Charlotte, and
            Triangle. Virtual anywhere.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <a href="mailto:ryan@rigginsstrategicsolutions.com?subject=Speaking%20inquiry">
                Email ryan@rigginsstrategicsolutions.com
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                Book a quick call
              </a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-ink/75">
            Or visit{" "}
            <Link href="/work-with-ryan" className="underline hover:text-burgundy-600">
              rigginsstrategicsolutions.com/work-with-ryan
            </Link>{" "}
            to book directly.
          </p>
        </div>
      </section>

      {/* PAGE-LEVEL DISCLAIMER */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-lg border border-border bg-cream/60 p-6 text-sm text-ink/80 leading-relaxed">
            <p className="font-semibold text-navy-700">
              Ryan Riggins | NC Real Estate License #361546 | eXp Realty
            </p>
            <p className="mt-3">
              Riggins Strategic Solutions is a consumer protection education
              company. Speaking engagements, seminars, the Senior Transition
              Blueprint, and SeniorSafe are educational resources and are not
              substitutes for licensed legal, financial, or real estate
              professionals. Should clients or customers engage Ryan Riggins in
              his licensed real estate capacity, that is a separate legal
              agreement governed by North Carolina real estate law and the NC
              Real Estate Commission.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
