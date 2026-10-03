import type { Metadata } from "next";
import { pageTitle } from "@/lib/site";

// The hub printed in "The Senior Transition" (the book). Every tool link in the
// book is a short /book/<name> address that redirects (next.config.ts, "Book
// links") to the real page with utm_source=book, so GA4 can count book readers.
// The cards below go through the same short links so hub clicks are counted too.
// Source of truth for the list: Master Book/BOOK_LINKS.md (2026-10-03).

export const metadata: Metadata = {
  title: pageTitle("The Senior Transition: Book Tools"),
  description:
    "Every calculator, checklist and guide mentioned in The Senior Transition by Ryan Riggins, chapter by chapter.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "The Senior Transition: Book Tools",
    description:
      "Every tool mentioned in The Senior Transition, chapter by chapter.",
    type: "website",
    url: "/book",
  },
};

type BookTool = { name: string; what: string; slug: string };
type BookSection = { part: string; chapters: string; tools: BookTool[] };

const SECTIONS: BookSection[] = [
  {
    part: "The Conversation",
    chapters: "Chapters 2 to 8",
    tools: [
      {
        name: "Family Readiness Score",
        what: "A two-minute check on where your family actually stands.",
        slug: "readiness",
      },
      {
        name: "The Family Meeting Agenda",
        what: "The fill-in-the-blank agenda from Chapter 7, inside the Blueprint.",
        slug: "family-meeting",
      },
      {
        name: "Senior Help Directory",
        what: "Local agencies and professionals, county by county.",
        slug: "professionals",
      },
    ],
  },
  {
    part: "The Decision and the Stuff",
    chapters: "Chapters 9 to 11",
    tools: [
      {
        name: "Aging in Place vs Assisted Living",
        what: "The honest break-even between staying home and moving.",
        slug: "aging-in-place",
      },
      {
        name: "Smart Prep Budget",
        what: "What to fix before selling, and what to leave alone.",
        slug: "prep-budget",
      },
    ],
  },
  {
    part: "The House and the Wolves at the Door",
    chapters: "Chapters 12 to 20",
    tools: [
      {
        name: "Net Proceeds Calculator",
        what: "What the house actually puts in your parent's pocket after costs.",
        slug: "net-proceeds",
      },
      {
        name: "6 Ways to Sell a Parent's House",
        what: "The ways to sell, side by side, for your timeline and your house.",
        slug: "ways-to-sell",
      },
      {
        name: "Sell, Rent or Keep",
        what: "What each choice means for Mom's money.",
        slug: "sell-rent-keep",
      },
      {
        name: "Senior Scam Protection",
        what: "How the cash-buyer and wholesaler plays work, and how to stop them.",
        slug: "scams",
      },
      {
        name: "Money Safety Sheet",
        what: "One page to keep your parent's money safe from scams.",
        slug: "money-safety",
      },
    ],
  },
  {
    part: "The Money and the Care",
    chapters: "Chapters 21 to 23",
    tools: [
      {
        name: "Care Runway Calculator",
        what: "How long the money lasts in a care community.",
        slug: "care-runway",
      },
      {
        name: "Medicare Gap Analyzer",
        what: "What Medicare does not cover, before the bill shows up.",
        slug: "medicare-gap",
      },
      {
        name: "Senior Help Directory",
        what: "Food, energy, prescription and benefit help in your county.",
        slug: "help-directory",
      },
    ],
  },
  {
    part: "The Legal",
    chapters: "Chapter 24",
    tools: [
      {
        name: "Beneficiary Designation Audit",
        what: "Check who actually inherits each account, before it matters.",
        slug: "beneficiaries",
      },
    ],
  },
  {
    part: "The Team and the System",
    chapters: "Chapters 25 to 28",
    tools: [
      {
        name: "The Senior Transition Blueprint",
        what: "The step-by-step course that walks you through the whole move.",
        slug: "blueprint",
      },
      {
        name: "Caregiver Burnout Quiz",
        what: "A two-minute check on how you are really holding up.",
        slug: "burnout",
      },
    ],
  },
  {
    part: "From Information to Action",
    chapters: "Chapter 29",
    tools: [
      {
        name: "The Senior Transition Roadmap",
        what: "A written plan built with Ryan for your family. No cost, by application.",
        slug: "roadmap",
      },
      {
        name: "Talk to Ryan",
        what: "One 30-minute call by phone, video, email or text. No obligation.",
        slug: "call",
      },
    ],
  },
];

export default function BookToolsPage() {
  return (
    <main>
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-burgundy-600">
            The Senior Transition
          </p>
          <h1 className="mt-3 leading-[1.1]">Every tool from the book.</h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed max-w-2xl mx-auto">
            Here is everything the book points to, in the order you will need
            it. Each one costs nothing to use. Laws and benefit numbers change
            every year, so check current figures with the agency or a licensed
            professional before you act.
          </p>
        </div>
      </section>

      {SECTIONS.map((s) => (
        <section key={s.part} className="bg-white border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-ink/60">
              {s.chapters}
            </p>
            <h2 className="mt-1 text-2xl md:text-3xl">{s.part}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {s.tools.map((t) => (
                <a
                  key={t.slug + s.part}
                  href={`/book/${t.slug}`}
                  className="group block h-full rounded-lg border border-border bg-white p-6 hover:border-burgundy-600 transition-colors"
                >
                  <h3 className="font-serif text-lg text-navy-700 leading-snug group-hover:text-burgundy-700 transition-colors">
                    {t.name}
                  </h3>
                  <p className="mt-3 text-sm text-ink/80 leading-relaxed">
                    {t.what}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-burgundy-600 group-hover:text-burgundy-700 transition-colors">
                    Open &rarr;
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-sand">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="text-2xl md:text-3xl">Reading the book and stuck?</h2>
          <p className="mt-4 text-ink/80 leading-relaxed">
            Tell me what your family is facing. One 30-minute call, any way
            you like, and you leave with your next two or three steps.
          </p>
          <p className="mt-6">
            <a
              href="/book/call"
              className="font-semibold text-burgundy-600 hover:text-burgundy-700 underline underline-offset-2"
            >
              Book a 30-minute call with Ryan
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
