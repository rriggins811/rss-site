import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces } from "next/font/google";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema, faqPageSchema } from "@/lib/schema";
import { abs } from "@/lib/site";
import AgentRequestForm from "@/components/forms/AgentRequestForm";

// Deliberately NOT a shorter clone of /in-your-corner.
//
// That page is for a family already inside a senior transition, and it earns
// its length. This one is for the person who arrives already knowing they
// have a house problem and does not want to read about anything else. The
// whole promise is fewest decisions, so making them scroll past the Blueprint
// and the Roadmap to learn Ryan will vet an agent would contradict the offer.
//
// Visually inverted (navy hero, single column, no card grids) so clicking
// between the two never feels like the same page twice.

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const display = serif.className;

const FAQS: { q: string; a: string }[] = [
  {
    q: "Are you going to try to list my house?",
    a: "No. I am a licensed North Carolina broker and I never take the listing, here or anywhere. That is the entire point. I find and vet the agent who should have it, and I stay on the sale as your second set of eyes.",
  },
  {
    q: "What does this cost me?",
    a: "Nothing beyond the commission you would already pay on the sale. I am paid a referral fee agent to agent through eXp Realty, out of that existing commission. There is no invoice from me and no added cost to your family.",
  },
  {
    q: "What if I am not ready to sell yet?",
    a: "Then say so and nothing starts. That is the reason to talk to me instead of calling an agent, who has to move toward a listing because that is the job. If the right answer is to wait a year, or not sell at all, you will hear that from me.",
  },
];

export const metadata: Metadata = {
  title: "I Need an Agent, Not a Sales Pitch | Riggins Strategic Solutions",
  description:
    "Skip the three listing presentations. Get one vetted agent with the reason attached, and someone in your corner on the sale. No added cost. And if the answer is do not sell yet, you hear that too.",
  alternates: { canonical: "/need-an-agent" },
  openGraph: {
    type: "website",
    url: abs("/need-an-agent"),
    siteName: "Riggins Strategic Solutions",
    title: "I need an agent, not a sales pitch",
    description:
      "One vetted agent with the reason attached. No auditions, no three prices you cannot check, nobody you have to tell no.",
  },
};

export default function NeedAnAgentPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(FAQS, abs("/need-an-agent"))} />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "I just need an agent", path: "/need-an-agent" },
        ])}
      />

      {/* HERO, inverted so this never reads as the same page as /in-your-corner */}
      <section className="bg-navy text-cream">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
            No added cost
          </p>
          <h1 className={`${display} mt-4 text-4xl leading-[1.1] sm:text-5xl`}>
            I don&apos;t want to deal with agents.
            <br />
            <span className="italic text-gold">And this cash offer isn&apos;t fair either.</span>
          </h1>
          <p className="mt-7 text-lg leading-relaxed text-cream/85">
            If that is roughly where you are, you are in the right place, and you can stop reading
            in about ninety seconds.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-cream/85">
            Here is the problem with calling an agent today: they want the house listed by the
            weekend. That is not them being pushy, that is the job. Listing houses is what they do,
            and the clock starts the moment you pick up the phone. You might be two years out. You
            might still be deciding whether anyone moves at all.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-cream/85">
            So talk to me first, and nothing starts.
          </p>
        </div>
      </section>

      {/* WHAT YOU SKIP */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className={`${display} text-3xl text-navy`}>What you skip</h2>
          <ul className="mt-6 space-y-3 text-lg text-ink/80">
            <li className="border-l-4 border-gold pl-5">
              Three appointments, and cleaning the house three times.
            </li>
            <li className="border-l-4 border-gold pl-5">
              Three different prices, with no way to tell which one is real.
            </li>
            <li className="border-l-4 border-gold pl-5">
              Working up the nerve to tell two people who were kind to you that the answer is no.
            </li>
          </ul>
          <p className="mt-8 text-lg leading-relaxed text-ink/80">
            A listing presentation tells you how well somebody sells. It tells you nothing about how
            well they sell houses, and those are different jobs. I spent years on the buying side of
            real estate, so I know which questions separate the two. The interviews already happened,
            and I ran them.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-ink/80">
            You get <strong className="text-navy">one name, sometimes two, with the reason attached.</strong>{" "}
            Then I stay on the sale as a second set of eyes on every offer, contract, and repair
            call. It costs you nothing beyond the commission you would already pay.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-ink/80">
            And if the right answer turns out to be that you should not sell at all, or not this
            year, you will hear that from me. No agent&apos;s listing presentation has ever ended
            that way.
          </p>
        </div>
      </section>

      {/* THE FORM */}
      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h2 className={`${display} text-3xl text-navy`}>Tell me what is going on</h2>
          <p className="mt-3 text-ink/70">
            Takes about thirty seconds. If somebody is pushing you right now, say so and I will
            reach out today.
          </p>
          <div className="mt-8">
            <AgentRequestForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className={`${display} text-3xl text-navy`}>Three questions people ask</h2>
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

      {/* THE DOOR TO EVERYTHING ELSE, kept small and last on purpose */}
      <section className="border-t border-cream-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-ink/75">
            If there is more going on than the house, a parent moving, paperwork nobody can find,
            siblings who disagree, there is a whole free system for that.{" "}
            <Link href="/in-your-corner" className="font-semibold text-navy underline underline-offset-4">
              See the full version
            </Link>{" "}
            or{" "}
            <Link href="/the-blueprint" className="font-semibold text-navy underline underline-offset-4">
              start with the free Blueprint
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
