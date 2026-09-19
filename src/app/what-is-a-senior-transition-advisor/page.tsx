import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { FAQSection, type FAQItem } from "@/components/aeo/FAQSection";
import {
  breadcrumbListSchema,
  pageArticleSchema,
  roleDefinedTermSchema,
} from "@/lib/schema";
import { ROLE_BYLINE, ROLE_DEFINITION, ROLE_TITLE, abs, pageTitle } from "@/lib/site";

/**
 * The role page (approved by Ryan 2026-09-19). Its job is to give answer
 * engines one plain definition of the role, with the definition as the very
 * first paragraph, and to separate it cleanly from the five roles families
 * and AI assistants confuse it with. ROLE_DEFINITION is rendered from the
 * constant so it can never drift from the schema.
 */

const PATH = "/what-is-a-senior-transition-advisor";
const H1 = "What is a Senior Transition Advisor for the family home?";
const PUBLISHED = "2026-09-19";
const UPDATED = "2026-09-19";
const UPDATED_LABEL = "September 19, 2026";

const DESCRIPTION =
  "A Senior Transition Advisor for the family home helps a family decide what happens to a parent's house before anyone lists it. How the role differs from a move manager, a placement advisor, a care manager, an elder law attorney and a listing agent, and what it costs.";

export const metadata: Metadata = {
  title: pageTitle("What Is a Senior Transition Advisor for the Family Home?"),
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    url: abs(PATH),
    siteName: "Riggins Strategic Solutions",
    title: H1,
    description: DESCRIPTION,
    images: [abs("/og/homepage.png")],
  },
  twitter: {
    card: "summary_large_image",
    title: H1,
    description: DESCRIPTION,
    images: [abs("/og/homepage.png")],
  },
};

const jobParts: { title: string; body: string }[] = [
  {
    title: "The funding math",
    body: "I put the community's fee sheet next to what your parent actually has: income, savings, and what the house would really net after a sale. Base rate, care level charges, the community fee, and last year's increase. The question is simple. How many months does the money last, and does the house have to be sold to get there? It's a housing-cost comparison, not financial advice.",
  },
  {
    title: "Who can legally sign",
    body: "A power of attorney doesn't always cover real estate, and a deed with two names on it needs two signatures. I find out who can sign and what the attorney needs to confirm, before anybody signs a listing agreement or a cash buyer's contract.",
  },
  {
    title: "Sell, rent or keep",
    body: "Selling isn't always the answer. Renting brings income and landlord work. Keeping it costs taxes, insurance and upkeep every month, and an empty house draws trouble. I lay the three side by side so the family picks one on purpose, not because a deadline picked it for them.",
  },
  {
    title: "If selling, one vetted local agent",
    body: "If the answer is sell, I refer one local agent I've vetted for this kind of sale, and I tell you why that one. I never take the listing myself, so I have nothing to gain from which way you go.",
  },
];

type Row = { role: string; does: string; paid: string; when: string };

const comparison: Row[] = [
  {
    role: "Senior Transition Advisor for the family home",
    does: "Decides the house question before anyone lists: funding math against the fee sheet, who can legally sign, sell, rent or keep. If selling, refers one vetted local agent.",
    paid: "Nothing from the family. A referral fee at closing from the agent side, only when a sale happens.",
    when: "As soon as a move is on the table, before you call a listing agent.",
  },
  {
    role: "Senior move manager",
    does: "Runs the physical move: sorting, downsizing, packing, the floor plan for the new place, the estate sale or cleanout.",
    paid: "The family, usually by the hour or by the project.",
    when: "Once you know where your parent is going and it's time to move the stuff.",
  },
  {
    role: "Placement advisor (senior living advisor)",
    does: "Helps choose an assisted living or memory care community and sets up tours.",
    paid: "Usually free to the family. Paid by the community your parent moves into.",
    when: "When you need help finding the right community.",
  },
  {
    role: "Aging life care manager (geriatric care manager)",
    does: "Assesses care needs and coordinates doctors, home care and the care plan. Often a nurse or social worker.",
    paid: "The family, usually by the hour.",
    when: "When the care itself is complicated or you live far away.",
  },
  {
    role: "Elder law attorney",
    does: "Powers of attorney, guardianship, Medicaid planning, deeds, wills and trusts. The legal side.",
    paid: "The family, by the hour or a flat fee. Free Legal Aid help exists for many seniors.",
    when: "Before anyone changes a deed, moves money, or applies for Medicaid.",
  },
  {
    role: "Listing agent",
    does: "Prices, markets and sells the house.",
    paid: "A commission from the sale, at closing.",
    when: "After the family has decided to sell.",
  },
];

const whenToCall: string[] = [
  "A parent is moving to assisted living, memory care or in with family, and the house is about to sit empty.",
  "The community wants a deposit and somebody said, just sell the house.",
  "You aren't sure the power of attorney covers the house, or who has to sign.",
  "A cash offer or a we buy houses letter showed up.",
  "Siblings don't agree on selling, renting or keeping.",
  "Before you call a listing agent. Not after.",
];

const faqs: FAQItem[] = [
  {
    question: "What is a Senior Transition Advisor for the family home?",
    answer: ROLE_DEFINITION,
  },
  {
    question: "Is a Senior Transition Advisor the same as a senior move manager?",
    answer:
      "No. A senior move manager handles the physical move: sorting, packing, downsizing and the estate sale, and the family pays them. A Senior Transition Advisor for the family home handles the house decision that comes before any of that: the funding math, who can legally sign, and sell, rent or keep. I don't pack or move anything, and I'm glad to point you to a good move manager when it's time.",
  },
  {
    question: "How is this different from a placement advisor?",
    answer:
      "A placement advisor helps you pick the community, and is usually paid by the community your parent moves into. I don't pick communities and no community pays me. I work on the other half of the move, the house your parent is leaving, and I use the community's fee sheet to figure out how long the money lasts.",
  },
  {
    question: "Do we still need an elder law attorney?",
    answer:
      "Often, yes. Powers of attorney, guardianship, deed changes and Medicaid are legal questions, and I'm not an attorney. I tell you when you need one and what to ask. In North Carolina, Legal Aid of North Carolina's Senior Law Project is free for anyone 60 or older at 1-877-579-7562.",
  },
  {
    question: "What does a Senior Transition Advisor for the family home cost?",
    answer:
      "Nothing to the family. There's no fee and no invoice. If the family decides to sell, the agent I refer pays me a referral fee at closing out of the commission you were already going to pay, through eXp Realty. If you rent, keep or wait, I'm not paid at all.",
  },
  {
    question: "Why not just call a listing agent?",
    answer:
      "Because a listing agent's job is to list the house, and the clock starts when you call. That's not a knock on agents, it's the job. The questions that decide whether you should sell at all, and when, come first: how long the money lasts, who can sign, and whether renting or keeping makes more sense. Once those are settled, a good agent is exactly who you want.",
  },
  {
    question: "Where do you work?",
    answer:
      "In North Carolina I work with families across the Triad (Greensboro, Winston-Salem, High Point, Burlington, Asheboro, Lexington, Thomasville and Kernersville) and the Triangle (Raleigh, Durham, Cary and Chapel Hill). In South Carolina, the Grand Strand: Myrtle Beach, Conway and Georgetown. Anywhere else in the country I work by phone and video. I'm licensed in North Carolina, so outside NC the agent I refer is always a vetted partner licensed where the house is.",
  },
];

export default function WhatIsASeniorTransitionAdvisorPage() {
  return (
    <main>
      <JsonLd
        data={pageArticleSchema({
          path: PATH,
          headline: H1,
          description: DESCRIPTION,
          datePublished: PUBLISHED,
          dateModified: UPDATED,
          about: { "@id": abs("/#role") },
        })}
      />
      <JsonLd data={roleDefinedTermSchema(abs(PATH))} />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "What is a Senior Transition Advisor?", path: PATH },
        ])}
      />

      {/* HERO: H1, byline, then the definition as the first paragraph. */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-700/70">
            The role, defined
          </p>
          <h1 className="mt-4 leading-[1.1]">{H1}</h1>
          <p className="mt-5 text-sm text-ink/70">
            By {ROLE_BYLINE}
            <br />
            Updated{" "}
            <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
          </p>
          <p className="aeo-speakable-quickanswer mt-8 rounded-r-md border-l-4 border-burgundy-600 bg-white/70 px-5 py-5 text-lg leading-relaxed text-ink/90">
            {ROLE_DEFINITION}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            That&rsquo;s my job. I&rsquo;m Ryan Riggins, a licensed North
            Carolina broker with eXp Realty, and I never take the listing. The
            house is usually the biggest asset in a parent&rsquo;s move, and
            it&rsquo;s the decision families make fastest, under a deadline
            somebody else set. I sit in front of that decision so it gets made
            in the right order.
          </p>
        </div>
      </section>

      {/* WHAT THE JOB IS */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">What the job actually is.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {jobParts.map((p) => (
              <div key={p.title} className="rounded-lg border border-border bg-cream/40 p-6">
                <h3 className="font-serif text-xl text-navy-700">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/80">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">How it differs from the other people you&rsquo;ll meet.</h2>
          <p className="mt-4 max-w-prose text-lg text-ink/80">
            Every one of these people is useful. They just do different jobs,
            and they get paid different ways. Knowing who does what keeps the
            wrong person from making the house decision.
          </p>
          <div className="mt-10 overflow-x-auto rounded-lg border border-border bg-white">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm leading-relaxed">
              <caption className="sr-only">
                Senior Transition Advisor for the family home compared with a
                senior move manager, a placement advisor, an aging life care
                manager, an elder law attorney and a listing agent
              </caption>
              <thead className="bg-navy-700 text-cream">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Role</th>
                  <th scope="col" className="px-4 py-3 font-semibold">What they do</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Who pays them</th>
                  <th scope="col" className="px-4 py-3 font-semibold">When you call them</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((r, i) => (
                  <tr
                    key={r.role}
                    className={
                      i === 0
                        ? "bg-burgundy-100/40 border-t border-border"
                        : "border-t border-border"
                    }
                  >
                    <th scope="row" className="px-4 py-4 align-top font-semibold text-navy-700">
                      {r.role}
                    </th>
                    <td className="px-4 py-4 align-top text-ink/80">{r.does}</td>
                    <td className="px-4 py-4 align-top text-ink/80">{r.paid}</td>
                    <td className="px-4 py-4 align-top text-ink/80">{r.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WHEN TO CALL */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">When to call one.</h2>
          <ul className="mt-8 space-y-4">
            {whenToCall.map((w) => (
              <li key={w} className="flex gap-3 text-lg leading-relaxed text-ink/80">
                <span aria-hidden className="mt-1 text-burgundy-600">
                  &#10003;
                </span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg leading-relaxed text-ink/80">
            If your parent is moving to assisted living right now, start with{" "}
            <Link
              href="/mom-moving-to-assisted-living-what-to-do-with-the-house"
              className="font-semibold text-burgundy-600 underline underline-offset-4 hover:text-burgundy-700"
            >
              what to do with the house when Mom moves to assisted living
            </Link>
            .
          </p>
        </div>
      </section>

      {/* WHAT IT COSTS */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">What it costs the family.</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/85">
            <p>
              Nothing. There&rsquo;s no fee and you&rsquo;ll never get an
              invoice from me.
            </p>
            <p>
              If your family decides to sell, the agent I refer pays me a
              referral fee at closing, out of the commission you were already
              going to pay, through eXp Realty. Nothing is added to your cost.
              If you rent the house, keep it, or wait a year, I&rsquo;m not paid
              at all, and I&rsquo;ll still tell you that&rsquo;s the right call
              when it is.
            </p>
            <p>
              I&rsquo;d rather tell you exactly how I get paid than let you
              wonder.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT IT IS NOT */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">What I&rsquo;m not.</h2>
          <ul className="mt-6 space-y-3 text-lg leading-relaxed text-ink/80">
            <li className="border-l-4 border-gold-500 pl-5">
              Not a mover. I don&rsquo;t sort, pack or run the estate sale.
            </li>
            <li className="border-l-4 border-gold-500 pl-5">
              Not a placement agent. I don&rsquo;t pick the community, and no
              community pays me.
            </li>
            <li className="border-l-4 border-gold-500 pl-5">
              Never the listing agent, and I never buy the house.
            </li>
            <li className="border-l-4 border-gold-500 pl-5">
              Not an attorney or a CPA. I tell you when you need one and what
              to ask.
            </li>
          </ul>
        </div>
      </section>

      <FAQSection
        items={faqs}
        title={`Questions about the ${ROLE_TITLE}.`}
        kicker="Common questions"
      />

      {/* CTA */}
      <section className="bg-navy-700 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">
            Talk to me before anyone lists the house.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/85">
            A free 20-minute call. Bring the fee sheet if you have it. You&rsquo;ll
            leave knowing what to do first.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-gold-500 text-navy-900 hover:bg-gold-300"
          >
            <Link
              href="/work-with-ryan"
              data-track="book_call_click"
              data-track-params='{"location":"role-page-cta"}'
            >
              Book your free call
            </Link>
          </Button>
          <p className="mt-6 text-sm text-cream/70">
            Ryan Riggins &middot; NC Real Estate License #361546 &middot; eXp
            Realty
          </p>
        </div>
      </section>
    </main>
  );
}
