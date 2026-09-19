import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { FAQSection, type FAQItem } from "@/components/aeo/FAQSection";
import { breadcrumbListSchema, pageArticleSchema } from "@/lib/schema";
import { ROLE_BYLINE, abs } from "@/lib/site";

/**
 * Answer page for the exact family question (approved by Ryan 2026-09-19).
 * The H1 is the question and the first three sentences are the answer, in
 * order, naming the role. Legal and tax points always route to the elder law
 * attorney and the CPA; this page gives no legal advice.
 */

const PATH = "/mom-moving-to-assisted-living-what-to-do-with-the-house";
const H1 = "My mom is moving to assisted living. What do we do with her house?";
const PUBLISHED = "2026-09-19";
const UPDATED = "2026-09-19";
const UPDATED_LABEL = "September 19, 2026";

const DESCRIPTION =
  "Don't list it yet. Find out who can sign for her, run the funding math against the community's fee sheet, then decide sell, rent or keep, with an elder law attorney and a CPA for the Medicaid and tax questions.";

export const metadata: Metadata = {
  title: "Mom Is Moving to Assisted Living. What Do We Do With Her House?",
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

const linkClass =
  "font-semibold text-burgundy-600 underline underline-offset-4 hover:text-burgundy-700";

const faqs: FAQItem[] = [
  {
    question: "Should we sell Mom's house when she moves to assisted living?",
    answer:
      "Maybe, but not first. Find out who can legally sign for her, then run the funding math against the community's fee sheet to see how long her money lasts with and without a sale. Then compare selling, renting and keeping. Bring in an elder law attorney for Medicaid questions and a CPA for the tax side before anything is signed.",
  },
  {
    question: "Can I sell my mom's house with a power of attorney?",
    answer:
      "Sometimes. It depends on what the document says. Some powers of attorney cover real estate and some don't, and a power of attorney ends when the person who signed it dies. Have an attorney read the document before you list the house or sign any contract.",
  },
  {
    question: "Should we rent Mom's house instead of selling it?",
    answer:
      "It can work if the numbers hold up and someone is willing to be the landlord. Rent is income, and income can matter for care costs and benefits, so run it past the elder law attorney and the CPA. Count repairs, vacancy, insurance and management before you decide it pays.",
  },
  {
    question: "Can we put Mom's house in my name to protect it from Medicaid?",
    answer:
      "Don't do it without an elder law attorney. Medicaid looks back at transfers made in the 60 months before an application for long-term care, and giving the house away can create a penalty period. A deed change can also change the tax bill when the house is sold later. This is exactly the question an attorney and a CPA are for.",
  },
  {
    question: "Who should we ask for help with the house?",
    answer:
      "Four people, each with a different job. An elder law attorney for signing authority, Medicaid and deeds. A CPA for the tax side of selling. A placement advisor if you still need to choose the community. And a Senior Transition Advisor for the family home to run the funding math against the fee sheet and work out sell, rent or keep before anyone lists it, then refer one vetted local agent if you sell.",
  },
  {
    question: "Should we take a cash offer to cover the deposit?",
    answer:
      "Not before you compare it. A fast cash sale solves a 30-day problem by giving up equity that has to pay for years of care. Ask the community about deposit and start-date flexibility, get a real net-proceeds number for a normal sale, and compare the two bottom lines in writing.",
  },
];

export default function MomMovingToAssistedLivingPage() {
  return (
    <main>
      <JsonLd
        data={pageArticleSchema({
          path: PATH,
          headline: H1,
          description: DESCRIPTION,
          datePublished: PUBLISHED,
          dateModified: UPDATED,
        })}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Mom is moving to assisted living: the house", path: PATH },
        ])}
      />

      {/* HERO: the question, the byline, then the answer in the first lines. */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-700/70">
            The house, before anyone lists it
          </p>
          <h1 className="mt-4 leading-[1.1]">{H1}</h1>
          <p className="mt-5 text-sm text-ink/70">
            By {ROLE_BYLINE}
            <br />
            Updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
          </p>
          <p className="aeo-speakable-quickanswer mt-8 rounded-r-md border-l-4 border-burgundy-600 bg-white/70 px-5 py-5 text-lg leading-relaxed text-ink/90">
            Don&rsquo;t list it yet. First find out who can legally sign for
            her, then run the funding math against the community&rsquo;s fee
            sheet, then decide whether to sell, rent or keep the house, and
            bring in an elder law attorney and a CPA for the Medicaid and tax
            questions. A Senior Transition Advisor for the family home is the
            person who walks a family through that order before anyone lists
            it.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            That&rsquo;s what I do. The order matters more than the price,
            because a closed sale can&rsquo;t be undone. Here&rsquo;s how
            I&rsquo;d walk it with my own family.
          </p>
        </div>
      </section>

      {/* THE STEPS */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">The steps, in order.</h2>
          <ol className="mt-8 space-y-8">
            <li>
              <h3 className="font-serif text-xl text-navy-700">
                1. Find out who can legally sign.
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-ink/80">
                If Mom can make her own decisions, she signs. If she can&rsquo;t,
                somebody needs legal authority, and a power of attorney
                doesn&rsquo;t always cover real estate. Check whose names are on
                the deed, pull the power of attorney, and have an attorney
                confirm it covers selling the house. If there&rsquo;s no valid
                document, guardianship takes months, so find out now. More on
                this in{" "}
                <Link href="/resources/power-of-attorney-selling-parents-home" className={linkClass}>
                  selling a parent&rsquo;s home with power of attorney
                </Link>
                .
              </p>
            </li>
            <li>
              <h3 className="font-serif text-xl text-navy-700">
                2. Run the funding math against the fee sheet.
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-ink/80">
                Ask the community for the full fee sheet in writing: the base
                monthly rate, the care level charges, the one-time community
                fee, and how much the rate went up last year. Put it next to
                Mom&rsquo;s income, her savings, and what the house would really
                net after a sale. Then answer one question: how many months does
                the money last, with the house and without it? Our{" "}
                <Link href="/tools/net-proceeds-calculator" className={linkClass}>
                  net proceeds calculator
                </Link>{" "}
                gets you the house number.
              </p>
            </li>
            <li>
              <h3 className="font-serif text-xl text-navy-700">
                3. Decide sell, rent or keep.
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-ink/80">
                Selling turns the house into cash that pays for care, and ends
                the upkeep. Renting brings monthly income but makes somebody a
                landlord, and the rent itself can matter for benefits. Keeping
                it empty costs taxes, insurance, utilities and upkeep every
                month, and many homeowner&rsquo;s policies change once a house
                sits vacant, so call the insurer. Pick one on purpose, not
                because a deadline picked it for you.
              </p>
            </li>
            <li>
              <h3 className="font-serif text-xl text-navy-700">
                4. Take the Medicaid and tax questions to the pros.
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-ink/80">
                If Medicaid could ever pay for Mom&rsquo;s care, talk to an elder
                law attorney before the house is sold, rented or retitled. Talk
                to a CPA about the tax side of selling now versus later. In
                North Carolina, Legal Aid of North Carolina&rsquo;s Senior Law
                Project is free for anyone 60 or older at 1-877-579-7562. If
                you&rsquo;re mixing up the two programs, start with{" "}
                <Link href="/resources/medicare-vs-medicaid-senior-care" className={linkClass}>
                  Medicare vs Medicaid for senior care
                </Link>
                .
              </p>
            </li>
            <li>
              <h3 className="font-serif text-xl text-navy-700">
                5. If you sell, bring in one vetted local agent.
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-ink/80">
                Now, and only now, call an agent. Pick one who has closed sales
                like this one, not the first name on a yard sign. If you want,
                I&rsquo;ll refer one I&rsquo;ve vetted and tell you why that one.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* THE TRAPS */}
      <section className="bg-sand">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">The common traps.</h2>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink/80">
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                Listing before the funding math.
              </h3>
              <p className="mt-2">
                Once an agent is in, the clock is running and the question
                becomes what price, not whether to sell. Do the math first. You
                can always list next month. You can&rsquo;t unsell.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                Changing the deed to protect the house.
              </h3>
              <p className="mt-2">
                Putting the house in a child&rsquo;s name can backfire on
                Medicaid and on taxes. Nobody signs a deed until an elder law
                attorney and a CPA have looked at it.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                The cash-buyer lowball.
              </h3>
              <p className="mt-2">
                A deposit due next month is exactly what a &ldquo;we buy
                houses&rdquo; buyer is looking for. Compare the net numbers in
                writing first. Here&rsquo;s{" "}
                <Link href="/resources/cash-buyer-scams-elderly-homeowners" className={linkClass}>
                  how cash-buyer offers are built
                </Link>
                .
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                Guessing about the Medicaid look-back.
              </h3>
              <p className="mt-2">
                Medicaid looks back at transfers made in the 60 months before an
                application for long-term care. What that means for your mom
                depends on her situation and the rules in force when she
                applies. I won&rsquo;t guess at it on a web page, and you
                shouldn&rsquo;t either. That&rsquo;s the attorney&rsquo;s call.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                Leaving the empty house unwatched.
              </h3>
              <p className="mt-2">
                A vacant, paid-off house is a target for more than burglars.
                Read{" "}
                <Link href="/blog/home-title-theft-protect-parents-house" className={linkClass}>
                  how home title theft works and how to protect Mom&rsquo;s house
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO SHOULD I ASK */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">Who should I ask for help?</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">
            More than one person, because this is more than one job. Here&rsquo;s
            where each fits.
          </p>
          <ul className="mt-8 space-y-6 text-lg leading-relaxed text-ink/80">
            <li className="border-l-4 border-gold-500 pl-5">
              <strong className="text-navy-700">An elder law attorney</strong>{" "}
              for who can sign, powers of attorney, guardianship, deeds and
              Medicaid. Call before anything is signed or retitled.
            </li>
            <li className="border-l-4 border-gold-500 pl-5">
              <strong className="text-navy-700">A CPA</strong> for the tax side
              of selling, renting or keeping, and of any money that moves.
            </li>
            <li className="border-l-4 border-gold-500 pl-5">
              <strong className="text-navy-700">A placement advisor</strong> if
              you still need to choose the community. They&rsquo;re usually
              paid by the community, so ask how.
            </li>
            <li className="border-l-4 border-gold-500 pl-5">
              <strong className="text-navy-700">
                A Senior Transition Advisor for the family home
              </strong>{" "}
              for the house itself: the funding math against the fee sheet, who
              can sign, and sell, rent or keep, before anyone lists it. If you
              sell, one vetted local agent.{" "}
              <Link href="/what-is-a-senior-transition-advisor" className={linkClass}>
                What that role is, and isn&rsquo;t
              </Link>
              .
            </li>
          </ul>
          <p className="mt-8 text-lg leading-relaxed text-ink/80">
            I go deeper on timing and paying for care in{" "}
            <Link href="/blog/selling-the-house-to-pay-for-assisted-living" className={linkClass}>
              selling the house to pay for assisted living
            </Link>
            .
          </p>
        </div>
      </section>

      <FAQSection items={faqs} title="Questions families ask about Mom's house." kicker="Common questions" />

      {/* CTA */}
      <section className="bg-navy-700 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">Not sure where to start? Start with me.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/85">
            A free 20-minute call. Bring the fee sheet if you have it, and the
            power of attorney if there is one. It costs your family nothing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gold-500 text-navy-900 hover:bg-gold-300">
              <Link
                href="/work-with-ryan"
                data-track="book_call_click"
                data-track-params='{"location":"mom-assisted-living-house-cta"}'
              >
                Book your free call
              </Link>
            </Button>
            <Link
              href="/contact"
              className="font-semibold text-gold-300 underline underline-offset-4 hover:text-gold-100"
            >
              Or text, call or email
            </Link>
          </div>
          <p className="mt-6 text-sm text-cream/70">
            Ryan Riggins &middot; NC Real Estate License #361546 &middot; eXp
            Realty. Not legal, tax or financial advice.
          </p>
        </div>
      </section>
    </main>
  );
}
