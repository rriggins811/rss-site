import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FAQSection, type FAQItem } from "@/components/aeo/FAQSection";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Questions Families Ask Before They Call",
  description:
    "How this works, what it costs, why I never take the listing, and where I can help. Straight answers about the business, not the paperwork.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Questions Families Ask Before They Call",
    description:
      "What it costs, why I never take the listing, and where I can help. Straight answers before you pick up the phone.",
    type: "website",
    url: "/faq",
  },
};

/**
 * The business-model questions, which live nowhere else on the site.
 *
 * Topic questions (probate, power of attorney, paying for care) are answered
 * on the posts that cover them and generate their own FAQPage schema from the
 * visible section in the body (see lib/blog-faq.ts). This page deliberately
 * does not repeat them; it links out instead, so the same Q+A pair is not
 * duplicated across URLs.
 *
 * Note on schema: Google retired FAQ rich results on 2026-05-07, so the
 * FAQPage JSON-LD here earns nothing in classic search. It stays because the
 * question-and-answer shape is what assistants extract, and because Google's
 * Ask Maps draws on site content for this profile.
 */
const businessFaqs: FAQItem[] = [
  {
    question: "Can you help me sell my parents' house?",
    answer:
      "Yes, but not the way most people expect. I do not list houses and I never take the listing. What I do is find and vet the right local agent for your family's situation, tell you why it is that one, and then stay on the sale as a second set of eyes on the offers, the contract, and the repair calls. It costs your family nothing beyond the commission you would already pay. If the right answer is that you should wait, or not sell at all, you will hear that from me too.",
  },
  {
    question: "Do you buy houses for cash?",
    answer:
      "No, and I never will. That is deliberate. I spent years on the buying side of real estate, mailing letters to paid-off homes owned by older people. I stopped because a family cannot get straight advice from someone who profits from buying their house cheap. If you have a cash offer in hand, I will help you understand what the house is actually worth and what the sale would really net, for free. If the cash offer turns out to be the right call for your family, I will tell you that too.",
  },
  {
    question: "What does this cost my family?",
    answer:
      "Nothing. The course, the calculators, the county directory, and the conversations are all free. If your family ends up selling, the agent I match you with pays me a referral fee out of the commission they were already charging. Nothing is added to what you pay, and you will never get an invoice from me. That is the entire model, and I would rather tell you exactly how I get paid than let you wonder.",
  },
  {
    question: "Why don't you take the listing yourself?",
    answer:
      "Because the moment I do, my advice is worth less. An agent who wants the listing has a reason to tell you to sell, to sell now, and to sell through them. I would rather be the one person in the room with nothing to gain from the answer. It also means I can tell you the truth about the agent I found you, because I am not competing with them.",
  },
  {
    question: "Will you tell us not to sell?",
    answer:
      "Yes, and I have. Sometimes the math says stay. Sometimes the family needs another six months. Sometimes the right move is a different conversation entirely. Most agents cannot say that out loud, not because they are bad people, but because listing houses is the job and the clock starts the moment you call. That pressure is structural. I do not have it, which is the whole point of doing it this way.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "There are two answers, and the difference matters. The course, the calculators, and the county Senior Help Directory are free to anyone, anywhere in the country. Agent matching is nationwide as well: I keep a network of vetted referral partners across the country, so if the house is in Ohio or Arizona I can find and vet the right local agent for that market and stay available to your family as a second set of eyes on what you are being told. Where I work hands-on myself is the Triad: Greensboro, High Point, Winston-Salem, Kernersville, Burlington, Asheboro, Thomasville, and Lexington. I also spend part of the year on the South Carolina coast and can point Grand Strand families to local resources and licensed South Carolina agents.",
  },
  {
    question: "How is the Roadmap different from the Blueprint?",
    answer:
      "The Blueprint is the whole library: 19 modules and more than 90 tools you can work through at your own pace. The Roadmap is what happens when a family does not have time to read a library. You apply, we build a written plan for your specific situation, and I stay with you for 90 days. Both are free. The Blueprint is self-serve. The Roadmap is me in it with you.",
  },
  {
    question: "Who are you, and why should we trust you?",
    answer:
      "I spent eight years in construction project management and house flipping, and for part of that I mailed letters to paid-off homes owned by older people. I was good at it. I stopped because I got tired of profiting from the worst week of a family's life, and because I kept meeting families who had already lost fifty thousand dollars before anyone told them the truth. Now I teach families how this actually works, for free. You do not have to trust me on that. Read the Blueprint, run the numbers yourself, and decide.",
  },
];

export default function FaqPage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Questions", path: "/faq" },
  ]);

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* HERO */}
      <section className="bg-navy-700 text-cream">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-gold-300">
            Common questions
          </div>
          <h1 className="mt-4 text-cream leading-[1.1]">
            The questions families ask before they call.
          </h1>
          <p className="mt-6 text-lg text-cream/85 leading-relaxed">
            How this works, what it costs, and why I never take the listing.
            If you are trying to figure out what I actually do before you spend
            twenty minutes on the phone, start here.
          </p>
        </div>
      </section>

      <FAQSection
        items={businessFaqs}
        title="How this works."
        kicker="Straight answers"
      />

      {/* WHERE TO GO NEXT */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <GoldRule />
          <h2 className="mt-3">Looking for something more specific?</h2>
          <p className="mt-6 text-ink/80 leading-relaxed">
            The questions above are about me and how this works. The questions
            about your situation are answered where they belong.
          </p>
          <ul className="mt-8 space-y-4 text-ink/80 leading-relaxed">
            <li>
              <Link
                href="/blog/selling-an-inherited-house-nc"
                className="font-semibold text-burgundy-600 underline underline-offset-4"
              >
                I inherited a house in North Carolina
              </Link>{" "}
              and I do not know what to do first.
            </li>
            <li>
              <Link
                href="/blog/selling-a-house-in-probate-nc"
                className="font-semibold text-burgundy-600 underline underline-offset-4"
              >
                Can a house be sold while it is in probate?
              </Link>
            </li>
            <li>
              <Link
                href="/blog/selling-parents-house-power-of-attorney-nc"
                className="font-semibold text-burgundy-600 underline underline-offset-4"
              >
                I have power of attorney.
              </Link>{" "}
              Does that let me sell the house?
            </li>
            <li>
              <Link
                href="/blog/selling-the-house-to-pay-for-assisted-living"
                className="font-semibold text-burgundy-600 underline underline-offset-4"
              >
                We need to sell to pay for assisted living.
              </Link>
            </li>
            <li>
              <Link
                href="/blog/selling-a-house-that-is-full-and-needs-repairs"
                className="font-semibold text-burgundy-600 underline underline-offset-4"
              >
                The house is full and it needs work.
              </Link>{" "}
              Can it still be sold?
            </li>
            <li>
              <Link
                href="/blog/choosing-an-agent-for-an-elderly-parents-home-sale"
                className="font-semibold text-burgundy-600 underline underline-offset-4"
              >
                How do we pick the right agent
              </Link>{" "}
              for a parent&rsquo;s house?
            </li>
          </ul>

          <div className="mt-12 flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/need-an-agent">I just need an agent</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/the-blueprint">Start with the free Blueprint</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
