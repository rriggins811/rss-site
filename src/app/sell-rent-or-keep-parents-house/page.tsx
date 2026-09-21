import type { Metadata } from "next";
import { PAGE_UPDATED } from "@/lib/page-dates";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { FAQSection, type FAQItem } from "@/components/aeo/FAQSection";
import { breadcrumbListSchema, pageArticleSchema } from "@/lib/schema";
import { ROLE_BYLINE, abs, pageTitle } from "@/lib/site";

/**
 * Decision page: sell, rent or keep a parent's house when they move to
 * assisted living (built 2026-09-19, preview until Ryan's GO). Answer first,
 * then the table. Every tax and legal figure below was checked on 2026-09-19
 * against the source named in the comment beside it. Legal and tax calls
 * always route to the elder law attorney and the CPA.
 *
 * SOURCES
 * - $250,000 / $500,000 home sale exclusion, 24 of the last 60 months owned
 *   and used, and the care-facility rule (12 months of use, then time in a
 *   licensed care facility counts toward the 2 years): IRS Publication 523,
 *   https://www.irs.gov/publications/p523
 * - Basis of inherited property is generally fair market value at the date
 *   of death; basis of a gift is generally the donor's adjusted basis:
 *   IRS Publication 551, https://www.irs.gov/publications/p551
 * - Medicaid transfer-of-assets look-back is 60 months before the
 *   application: federal rule (Deficit Reduction Act of 2005), NC DHHS Adult
 *   Medicaid Manual MA-2240, https://policies.ncdhhs.gov/wp-content/uploads/ma-2240-14.pdf
 * - NC Homestead Exclusion and Circuit Breaker keep during "an extended
 *   absence while confined to a rest home or nursing home, so long as the
 *   residence is unoccupied or occupied by the owner's spouse or other
 *   dependent": G.S. 105-277.1 and 105-277.1B. Circuit Breaker: on a
 *   disqualifying event the deferred taxes for the preceding three fiscal
 *   years are due, with interest: G.S. 105-277.1B.
 * - HECM reverse mortgage: due and payable when the borrower hasn't lived in
 *   the home for 12 consecutive months for health reasons (including an
 *   assisted living facility) and no co-borrower lives there: HUD HECM
 *   program and CFPB, https://www.consumerfinance.gov/ask-cfpb/when-do-i-have-to-pay-back-a-reverse-mortgage-loan-en-236/
 * - Vacant-home insurance: no figures given on purpose; policies vary.
 */

const PATH = "/sell-rent-or-keep-parents-house";
const H1 = "Sell, rent, or keep a parent's house when they move to assisted living";
const PUBLISHED = "2026-09-19";
const UPDATED = PAGE_UPDATED["/sell-rent-or-keep-parents-house"];
const UPDATED_LABEL = "September 19, 2026";

const DESCRIPTION =
  "Run the funding math first, then compare sell, rent, keep, family living there, or a reverse mortgage already in place. When each fits, costs and risks.";

export const metadata: Metadata = {
  title: pageTitle("Sell, Rent or Keep a Parent's House After Assisted Living"),
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

type Row = { option: string; fits: string; money: string; risks: string; ask: string };

const rows: Row[] = [
  {
    option: "Sell",
    fits: "The funding math says the care costs need the equity, nobody wants to be a landlord, or the house needs work nobody can manage from a distance.",
    money: "Turns the house into cash for care and ends the carrying costs. Selling costs come out of the proceeds, and so does any Circuit Breaker lien. A gain may be excluded up to $250,000 ($500,000 for a married couple filing jointly) if the ownership and use tests are met.",
    risks: "Selling under a deadline, or to a cash buyer for less than it's worth. A closed sale can't be undone. The cash itself can affect Medicaid eligibility.",
    ask: "CPA on the exclusion and the timing. Elder law attorney before the sale if Medicaid is possible.",
  },
  {
    option: "Rent",
    fits: "The money lasts without the equity for now, the rent covers the costs with room to spare, and someone will actually be the landlord or pay a manager.",
    money: "Monthly income, minus repairs, vacancy, management, landlord insurance and taxes. The house keeps its value exposure, up or down.",
    risks: "Rent is income, which can matter for care costs and benefits. A tenant may end NC property tax relief that an empty house would keep. Renting can change the tax picture of a later sale. Landlord work doesn't stop because a parent is in assisted living.",
    ask: "Elder law attorney on rent and benefits. CPA on the tax side. The county tax office on the Homestead Exclusion.",
  },
  {
    option: "Keep it empty",
    fits: "There's a real reason to wait: your parent may come home, the market or a repair needs time, or the family needs a few months to decide.",
    money: "Taxes, insurance, utilities, lawn and upkeep every month, with nothing coming in. In NC, the Homestead Exclusion and Circuit Breaker can continue during an extended stay in a rest home or nursing home if the house stays empty.",
    risks: "Many homeowner's policies change once a house sits vacant, so call the insurer. An empty, paid-off house is a target for break-ins and title fraud.",
    ask: "The insurer about vacancy. The county tax office about relief. A neighbor with a key.",
  },
  {
    option: "Let a family member live there",
    fits: "A child or relative needs a place and will pay fair rent or the carrying costs, and the rest of the family agrees in writing.",
    money: "Somebody's covering the bills, or at least some of them. Whether it's rent, a caretaking deal or free makes a difference.",
    risks: "Free or cheap rent can look like a gift to Medicaid. A relative who isn't a spouse or dependent living there can end NC property tax relief. Siblings who aren't living there often feel it later. Moving a relative out when it's time to sell can be hard.",
    ask: "Elder law attorney before anyone moves in. Put the deal in writing.",
  },
  {
    option: "Reverse mortgage already in place",
    fits: "This one isn't a choice so much as a clock. If your parent has a reverse mortgage, the lender's rules set the timeline.",
    money: "On an FHA reverse mortgage (HECM), the loan generally comes due once the borrower hasn't lived in the home for 12 consecutive months for health reasons, including assisted living, unless a co-borrower still lives there. The family can usually sell and keep any equity above the balance.",
    risks: "Waiting past the lender's deadline narrows the options. Letters from the servicer need answers on time. Someone needs authority to deal with the lender.",
    ask: "The loan servicer first, in writing. Elder law attorney on signing authority. See the reverse mortgage posts below.",
  },
];

const faqs: FAQItem[] = [
  {
    question: "Should we sell, rent or keep Mom's house when she moves to assisted living?",
    answer:
      "Run the funding math first: the community's fee sheet against her income, savings and what the house would really net. If the money runs short without the equity, selling usually wins. If it lasts and someone will manage a tenant, renting can work. Keeping it empty only makes sense with a reason and a time limit. Take the Medicaid and tax questions to an elder law attorney and a CPA before deciding.",
  },
  {
    question: "Does my parent owe capital gains tax when the house is sold?",
    answer:
      "Maybe not. The IRS lets a seller exclude up to $250,000 of gain, or $500,000 for a married couple filing jointly, if they owned and lived in the home at least 2 of the last 5 years. If your parent can no longer care for themselves and lived there at least 1 year of the last 5, time in a licensed care facility counts toward the 2 years. Ask a CPA how it applies.",
  },
  {
    question: "Is it better to wait and inherit the house for the step-up in basis?",
    answer:
      "Sometimes, on taxes alone. Inherited property generally gets a basis equal to its value at the date of death, while a gift during life carries over the parent's basis. But the house may be needed to pay for care now, and holding it has costs and Medicaid consequences. That trade is a question for a CPA and an elder law attorney together.",
  },
  {
    question: "Can we rent out the house if Mom might need Medicaid later?",
    answer:
      "Ask an elder law attorney before you do. Medicaid treats the house and the rent under its own rules, and it looks back 60 months at transfers made before an application for long-term care. I won't guess at your mom's situation on a web page.",
  },
  {
    question: "What happens to a reverse mortgage when a parent moves to assisted living?",
    answer:
      "On an FHA reverse mortgage, the loan generally comes due once the borrower hasn't lived in the home for 12 consecutive months for health reasons, unless a co-borrower still lives there. Call the servicer early, in writing, and have someone with signing authority ready to deal with them.",
  },
  {
    question: "Who can help us decide sell, rent or keep?",
    answer:
      "An elder law attorney for Medicaid, deeds and signing authority. A CPA for the tax side. And a Senior Transition Advisor for the family home to run the funding math against the fee sheet and lay out sell, rent or keep before anyone lists the house. If you sell, one vetted local agent.",
  },
];

export default function SellRentOrKeepPage() {
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
          { name: "Sell, rent or keep a parent's house", path: PATH },
        ])}
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-700/70">
            The house decision
          </p>
          <h1 className="mt-4 leading-[1.1]">{H1}</h1>
          <p className="mt-5 text-sm text-ink/70">
            By {ROLE_BYLINE}
            <br />
            Updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
          </p>
          <p className="aeo-speakable-quickanswer mt-8 rounded-r-md border-l-4 border-burgundy-600 bg-white/70 px-5 py-5 text-lg leading-relaxed text-ink/90">
            Decide with the funding math, not the calendar. Put the
            community&rsquo;s fee sheet next to what your parent has, including
            what the house would really net, and see how long the money lasts
            with and without a sale. If the care needs the equity, sell. If it
            doesn&rsquo;t and someone will be the landlord, renting can work.
            Keep it empty only with a reason and a deadline, and take Medicaid
            and tax questions to an elder law attorney and a CPA first.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            I&rsquo;m a licensed broker who never takes the listing, so I
            don&rsquo;t win or lose based on which way you go. Here&rsquo;s how
            I lay the choices out for a family.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/80">
            Want the months counted for you? Try the free{" "}
            <Link href="/tools/sell-rent-or-keep-calculator" className={linkClass}>
              Sell, Rent or Keep calculator
            </Link>
            : it shows how many months of care each choice pays for.
          </p>
        </div>
      </section>

      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">Step one: the funding math.</h2>
          <ol className="mt-8 space-y-5 text-lg leading-relaxed text-ink/80">
            <li>
              <strong className="text-navy-700">1. Get the fee sheet in writing.</strong>{" "}
              The base monthly rate, the care level charges, the one-time
              community fee, and how much the rate went up last year.
            </li>
            <li>
              <strong className="text-navy-700">2. List what your parent has.</strong>{" "}
              Monthly income, savings, and any long-term care insurance or
              veterans benefits.
            </li>
            <li>
              <strong className="text-navy-700">3. Get a real net number for the house.</strong>{" "}
              What it would sell for, minus selling costs, any mortgage or
              reverse mortgage payoff, and any property tax lien. The{" "}
              <Link href="/tools/net-proceeds-calculator" className={linkClass}>
                net proceeds calculator
              </Link>{" "}
              gets you close.
            </li>
            <li>
              <strong className="text-navy-700">4. Count the months.</strong>{" "}
              How long does the money last with the house sold, and without it?
              That one answer usually settles more than any opinion. The{" "}
              <Link href="/tools/sell-rent-or-keep-calculator" className={linkClass}>
                Sell, Rent or Keep calculator
              </Link>{" "}
              counts the months of care for each choice.
            </li>
          </ol>
          <p className="mt-6 text-base leading-relaxed text-ink/70">
            It&rsquo;s a housing-cost comparison, not financial advice.
          </p>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">The five options, side by side.</h2>
          <p className="mt-4 max-w-prose text-lg text-ink/80">
            The tax and legal points here are general. Your parent&rsquo;s
            situation decides how they apply, which is why the last column is
            always a person.
          </p>
          <div className="mt-10 overflow-x-auto rounded-lg border border-border bg-white">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm leading-relaxed">
              <caption className="sr-only">
                Selling, renting, keeping empty, letting a family member live
                there, and a reverse mortgage already in place, compared by
                when each fits, money, risks and who to ask
              </caption>
              <thead className="bg-navy-700 text-cream">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Option</th>
                  <th scope="col" className="px-4 py-3 font-semibold">When it fits</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Money</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Risks</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Who to ask</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.option} className="border-t border-border">
                    <th scope="row" className="px-4 py-4 align-top font-semibold text-navy-700">
                      {r.option}
                    </th>
                    <td className="px-4 py-4 align-top text-ink/80">{r.fits}</td>
                    <td className="px-4 py-4 align-top text-ink/80">{r.money}</td>
                    <td className="px-4 py-4 align-top text-ink/80">{r.risks}</td>
                    <td className="px-4 py-4 align-top text-ink/80">{r.ask}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">The tax and Medicaid points, in plain words.</h2>
          <div className="mt-8 space-y-8 text-lg leading-relaxed text-ink/80">
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                The $250,000 exclusion, and the care-facility rule.
              </h3>
              <p className="mt-2">
                The IRS lets a seller exclude up to $250,000 of gain on a main
                home, or $500,000 for a married couple filing jointly, if they
                owned it and lived in it at least 2 of the 5 years before the
                sale. There&rsquo;s a rule that matters for families like
                yours: if your parent can&rsquo;t care for themselves and lived
                in the house at least 1 of those 5 years, time in a licensed care
                facility counts toward the 2 years. Ask a CPA before you pick a
                sale date.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                Step-up in basis, and why gifting the house can backfire.
              </h3>
              <p className="mt-2">
                Inherited property generally takes a basis equal to its value on
                the date of death. A house given away during life generally
                carries over the parent&rsquo;s old basis, which can mean a much
                bigger taxable gain when the child sells. That&rsquo;s one reason
                nobody should sign a deed to &ldquo;protect&rdquo; the house
                without a CPA and an elder law attorney.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                Medicaid looks back 60 months.
              </h3>
              <p className="mt-2">
                Medicaid reviews transfers made in the 60 months before an
                application for long-term care. Giving the house away, selling it
                cheap to family, or letting someone live there free can all raise
                questions. How the house and its equity count depends on your
                parent&rsquo;s situation and the rules when they apply. Ask an
                elder law attorney. In North Carolina, Legal Aid of North
                Carolina&rsquo;s Senior Law Project is free for anyone 60 or
                older at 1-877-579-7562. If the two programs blur together, read{" "}
                <Link href="/resources/medicare-vs-medicaid-senior-care" className={linkClass}>
                  Medicare vs Medicaid for senior care
                </Link>
                .
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                Who can sign comes before all of it.
              </h3>
              <p className="mt-2">
                None of these options works if nobody has authority to act. A
                power of attorney doesn&rsquo;t always cover real estate. Start
                with{" "}
                <Link href="/resources/power-of-attorney-selling-parents-home" className={linkClass}>
                  selling a parent&rsquo;s home with power of attorney
                </Link>
                .
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-navy-700">
                An empty house needs watching.
              </h3>
              <p className="mt-2">
                If you keep it, even for a few months, call the insurer about
                vacancy and keep an eye on the title. Here&rsquo;s{" "}
                <Link href="/blog/home-title-theft-protect-parents-house" className={linkClass}>
                  how home title theft works and how to protect the house
                </Link>
                , and{" "}
                <Link href="/blog/parents-house-empty-homeowners-insurance-vacancy-clause" className={linkClass}>
                  what the vacancy clause in a homeowner&rsquo;s policy means
                </Link>
                .
              </p>
            </div>
          </div>
          <p className="mt-10 text-lg leading-relaxed text-ink/80">
            Still at the very start? Read{" "}
            <Link href="/mom-moving-to-assisted-living-what-to-do-with-the-house" className={linkClass}>
              my mom is moving to assisted living: what do we do with her house
            </Link>
            . More on the tax side in{" "}
            <Link href="/blog/capital-gains-selling-parents-house-2026" className={linkClass}>
              capital gains when you sell a parent&rsquo;s house
            </Link>
            , and on reverse mortgages in{" "}
            <Link href="/blog/reverse-mortgage-30-day-letter-after-a-parent-dies" className={linkClass}>
              the reverse mortgage letter families get
            </Link>
            .
          </p>
        </div>
      </section>

      <FAQSection items={faqs} title="Questions about selling, renting or keeping." kicker="Common questions" />

      <section className="bg-navy-700 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">Want the math run for your parent&rsquo;s house?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/85">
            A free 20-minute call. Bring the fee sheet if you have it. It costs
            your family nothing, and I&rsquo;m paid only if you sell, by the
            agent&rsquo;s referral fee at closing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gold-500 text-navy-900 hover:bg-gold-300">
              <Link
                href="/work-with-ryan"
                data-track="book_call_click"
                data-track-params='{"location":"sell-rent-keep-cta"}'
              >
                Book your free call
              </Link>
            </Button>
            <Link
              href="/senior-transition-advisor"
              className="font-semibold text-gold-300 underline underline-offset-4 hover:text-gold-100"
            >
              Find your city
            </Link>
          </div>
          <p className="mt-6 text-sm text-cream/70">
            Ryan Riggins, NC Real Estate Broker #361546, eXp Realty. Not legal,
            tax or financial advice.
          </p>
        </div>
      </section>
    </main>
  );
}
