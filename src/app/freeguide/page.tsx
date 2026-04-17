import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { StarterGuideForm } from "@/components/forms/StarterGuideForm";

export const metadata: Metadata = {
  title: "The Simple Blueprint — Free Starter Guide",
  description:
    "A free, plain-English starter guide for families facing a senior housing transition. The first 3 moves most families get wrong, and what to do instead.",
  alternates: { canonical: "/freeguide" },
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

      {/* NEXT STEPS */}
      <section className="bg-sand">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">After you read it.</h2>
          <p className="mt-6 text-lg text-ink/85 leading-relaxed">
            If the situation is more complex than the Simple Blueprint covers,
            there are two paid resources built for exactly that.{" "}
            <a
              href="/the-blueprint"
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
              book a free 30-minute call.
            </a>{" "}
            No pitch, no pressure.
          </p>
        </div>
      </section>
    </main>
  );
}
