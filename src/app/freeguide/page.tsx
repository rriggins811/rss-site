import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { StarterGuideForm } from "@/components/forms/StarterGuideForm";
import { FAQSection, type FAQItem } from "@/components/aeo/FAQSection";

// FAQs derived from the actual signup-flow questions that come in
// repeatedly (search console "people also ask" + Ryan's inbox). FAQSection
// auto-emits the matching FAQPage JSON-LD so schema and visible content
// stay in lockstep — Google's "structured data must match visible page
// content" rule is enforced structurally, not by convention.
const FREEGUIDE_FAQS: FAQItem[] = [
  {
    question: "What is the Simple Blueprint?",
    answer:
      "The Simple Blueprint is a free, plain-English starter guide for families just beginning to think about a parent's senior housing transition. It covers the 10 most common mistakes families make, the three conversations to have before calling any professional, and the four-stage transition timeline. Short enough to read on a lunch break.",
  },
  {
    question: "How much does it cost?",
    answer:
      "It's free. Email signup, no credit card, no upsell during checkout. The Simple Blueprint is the entry-level resource — there are paid Blueprint Core ($47) and Senior Transition Roadmap ($297) products for families who want more, but those are entirely optional.",
  },
  {
    question: "What happens after I sign up?",
    answer:
      "You get an email with the activation link to your free Blueprint account. One click sets up your account, gives you the interactive Module 00, three free tools (Starting Point Assessment, Net Proceeds Calculator, 7-Day Quick Start tracker), and a 14-day Premium+ trial of the SeniorSafe family coordination app — no card required, the trial is automatic.",
  },
  {
    question: "Who is the Simple Blueprint for?",
    answer:
      "Adult children (typically 40-65) whose aging parent is starting to need help with housing decisions. It also fits people who live out of state from a parent, the sibling who handles things, and anyone about to call a realtor about a parent's home — read this first.",
  },
  {
    question: "Do I have to enter a credit card for the SeniorSafe trial?",
    answer:
      "No. The 14-day Premium+ trial activates automatically with your Simple Blueprint signup. When the trial ends you can pick a paid SeniorSafe plan ($14.99/mo Premium or $39.99/mo Premium+) or just stop using the app — no charges either way.",
  },
  {
    question: "How is the free Simple Blueprint different from Blueprint Core ($47)?",
    answer:
      "The Simple Blueprint is the starter guide — first principles, 10 common mistakes, the four-stage transition framework. Blueprint Core is the full DIY course: 20 modules, 70+ interactive tools and worksheets, the whole playbook Ryan uses with paying clients. Most families start with the free guide and decide from there whether Core is the right next step.",
  },
];

export const metadata: Metadata = {
  title: "The Simple Blueprint | Free Starter Guide",
  description:
    "A free, plain-English starter guide for families facing a senior housing transition. The first 3 moves most families get wrong, and what to do instead.",
  alternates: { canonical: "/freeguide" },
  openGraph: {
    type: "website",
    url: "https://rigginsstrategicsolutions.com/freeguide",
    siteName: "Riggins Strategic Solutions",
    title: "The Simple Blueprint | Free Starter Guide",
    description:
      "A free, plain-English starter guide for families facing a senior housing transition. The first 3 moves most families get wrong, and what to do instead.",
    images: [
      {
        url: "https://rigginsstrategicsolutions.com/og/freeguide.png",
        width: 1200,
        height: 630,
        alt: "Riggins Strategic Solutions — Senior Transition Blueprint and SeniorSafe app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Simple Blueprint | Free Starter Guide",
    description:
      "Free, plain-English starter guide for families facing a senior housing transition. First 3 moves most families get wrong.",
    images: ["https://rigginsstrategicsolutions.com/og/freeguide.png"],
  },
};

export default function FreeGuidePage() {
  return (
    <main>
      {/* HERO + FORM */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <Badge
              variant="secondary"
              className="bg-burgundy-100 text-burgundy-700 border-0"
            >
              Free starter guide
            </Badge>
            <h1 className="mt-6 leading-[1.05]">
              The Simple Blueprint.
            </h1>
            <p className="mt-6 text-lg text-ink/85 leading-relaxed max-w-prose">
              A short, plain-English guide for families who are just starting
              to think about a senior housing transition. No jargon. No sales
              pitch. Just the moves that save families money and stress.
            </p>

            <ul className="mt-8 space-y-3 text-ink/85">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-500 flex-none" />
                <span>
                  The three conversations you need to have before you call
                  anyone.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-500 flex-none" />
                <span>
                  Why calling a realtor first is usually the $50K mistake.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-500 flex-none" />
                <span>
                  Net proceeds: the one number every family should know before
                  any decision gets made.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-500 flex-none" />
                <span>
                  The four-stage timeline most families stumble through, and
                  where it usually goes wrong.
                </span>
              </li>
            </ul>

            <p className="mt-8 text-sm text-ink/70 leading-relaxed">
              Written by Ryan Riggins, Senior Transition Advisor. Licensed NC
              broker (#361546, eXp Realty). Fiduciary duty to the family, not a
              pitch.
            </p>
          </div>

          <div className="lg:pt-6">
            <StarterGuideForm />
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">Who this is for.</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                Early-awareness families.
              </h3>
              <p className="mt-3 text-ink/80 leading-relaxed">
                You&rsquo;ve started noticing things. A parent struggling with
                stairs. Meds missed. Mail piling up. Nothing is on fire, but
                you know the question is coming.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                Adult children at a distance.
              </h3>
              <p className="mt-3 text-ink/80 leading-relaxed">
                You live out of state. You&rsquo;re the oldest, or the one who
                handles things. You need a shared frame so your siblings
                aren&rsquo;t reinventing the wheel on every call.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                Anyone about to call a realtor.
              </h3>
              <p className="mt-3 text-ink/80 leading-relaxed">
                Read this first. Ten minutes now will change what you ask the
                agent and what you protect against. Worst case you waste ten
                minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — auto-emits FAQPage schema, same items render visibly +
          structurally. Mounts between WHO IT'S FOR and NEXT STEPS so the
          AEO-friendly FAQ content sits in the page's natural Q&A slot
          (typical visitor pattern: "is this for me?" → "what are the
          common questions?" → "what's next?"). */}
      <FAQSection
        items={FREEGUIDE_FAQS}
        kicker="Common questions"
        title="Frequently asked questions about the Simple Blueprint"
      />

      {/* NEXT STEPS */}
      <section className="bg-sand">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">After you read it.</h2>
          <p className="mt-6 text-lg text-ink/85 leading-relaxed">
            If the situation is more complex than the Simple Blueprint covers,
            there are two paid resources built for exactly that.{" "}
            <a
              href="https://blueprint.rigginsstrategicsolutions.com/pricing"
              className="text-burgundy-600 hover:text-burgundy-700 underline underline-offset-2"
            >
              See The Blueprint.
            </a>
          </p>
          <p className="mt-4 text-lg text-ink/85 leading-relaxed">
            If you&rsquo;d rather just talk it through,{" "}
            <a
              href="/work-with-ryan"
              className="text-burgundy-600 hover:text-burgundy-700 underline underline-offset-2"
            >
              book a free 20-minute call.
            </a>{" "}
            No pitch, no pressure.
          </p>
        </div>
      </section>
    </main>
  );
}
