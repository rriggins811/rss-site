import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmailFallback } from "@/components/site/EmailFallback";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "For Professionals Who Refer Families",
  description:
    "Elder law and estate attorneys, trust officers, CPAs, advisors, care managers and placement advisors: I handle the house end of the plan you already built. I never take the listing and I never buy the house.",
  alternates: { canonical: "/partners" },
  openGraph: {
    title: "For Professionals Who Refer Families",
    description:
      "I handle the house end of the plan you already built. I never take the listing and I never buy the house.",
    type: "website",
    url: "/partners",
  },
};

export default function PartnersPage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "For Professionals", path: "/partners" },
  ]);

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* HERO */}
      <section className="bg-navy-700 text-cream">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-gold-300">
            For Professionals
          </div>
          <h1 className="mt-4 text-cream leading-[1.1]">
            The house end of the plan you already built.
          </h1>
          <p className="mt-6 text-lg text-cream/85 leading-relaxed">
            You handle the legal, tax, financial or care work. The house is
            usually the largest thing the family owns and the one asset nobody
            at that table works with directly. That is the part I take.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link
                href="/work-with-ryan"
                data-track="book_call_click"
                data-track-params='{"location":"partners-hero"}'
              >
                Book a call
              </Link>
            </Button>
          </div>
          <EmailFallback className="mt-5" align="center" variant="dark" />
        </div>
      </section>

      {/* HOW I AM PAID, first, on purpose */}
      <section className="bg-white border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">
            How I am paid, before anything else.
          </h2>
          <p className="mt-6 text-ink/80 leading-relaxed">
            You should know this before you consider handing me a client, so it
            goes first rather than in a footnote.
          </p>
          <p className="mt-5 text-ink/80 leading-relaxed">
            <strong>I never take the listing.</strong> When a family decides to
            sell, I hand them to a vetted agent in their market. That agent pays
            me a referral fee out of the commission that already existed, broker
            to broker, under a signed referral agreement. The family pays no
            premium and no added cost.
          </p>
          <p className="mt-5 text-ink/80 leading-relaxed">
            I earn that fee <strong>only</strong> if the family both decides to
            sell and uses the agent I pair them with. If they do not sell, I
            earn nothing. If they sell to a cash buyer, I earn nothing. Of the
            families I am carrying at any given time, most are not going to
            produce a fee, and that is a normal outcome rather than a failed
            one.
          </p>
          <p className="mt-5 text-ink/80 leading-relaxed">
            <strong>You pay me nothing and I pay you nothing.</strong> There is
            no fee in either direction between us, no contract and no MSA. The
            referral compensation described above flows between brokerages on
            the sale side only.
          </p>
          <p className="mt-5 text-ink/70 leading-relaxed text-sm">
            The full arrangement, including the NCAR referral form and the RESPA
            position, is written out on the{" "}
            <Link href="/referral-terms" className="underline">
              referral terms
            </Link>{" "}
            page.
          </p>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="bg-sand border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">Who this is for.</h2>
          <p className="mt-6 text-ink/80 leading-relaxed">
            Elder law and estate attorneys. Trust officers and trust companies.
            CPAs and fee-only advisors. Aging life care managers and
            private-duty home care owners. Placement advisors, senior move
            managers, and community directors. Business brokers working with
            owners who are retiring.
          </p>
          <p className="mt-5 text-ink/80 leading-relaxed">
            The pattern is the same across all of them. The plan is sound on
            paper. Then the house decides the timeline instead of the plan,
            because nobody was standing at that end of it.
          </p>
        </div>
      </section>

      {/* WHAT I DO */}
      <section className="bg-white border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">
            What I actually do for your clients.
          </h2>
          <ul className="mt-8 space-y-4 text-ink/85 leading-relaxed">
            {[
              "Walk the property with a builder's eye and say what is worth fixing and what is not.",
              "Lay out every realistic path for the house and what each one actually nets, so the family sees the whole board before choosing.",
              "Hold the timing you set. When you tell a client not to move on the house yet, I am the one who makes it stick and who tells you the day something changes.",
              "Stand between the family and the cash-offer letters. I spent eight years writing those, which is why they do not work on me.",
              "Bring the right specialist for the asset, and stay involved through closing so the plan survives contact with the transaction.",
            ].map((item) => (
              <li key={item} className="pl-6 relative">
                <span
                  aria-hidden
                  className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-gold-500"
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-ink/80 leading-relaxed">
            Your relationship stays yours. I never pitch your service, I never
            try to replace you, and the family comes back to your office for the
            legal, tax, financial or care work.
          </p>
        </div>
      </section>

      {/* THE WALL */}
      <section className="bg-navy-700 text-cream border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl text-cream">
            What I never do.
          </h2>
          <ul className="mt-8 space-y-4 text-cream/85 leading-relaxed">
            {[
              "I never take the listing. Not for anyone, not ever.",
              "I never buy the house. If a family runs a cash-offer process, I bring real competing buyers and I am not one of them.",
              "I am never paid by a buyer, an investor, a facility, or a community. My compensation comes from one place and it is disclosed above.",
              "I do not give legal, tax or financial advice. That is your work and I hand it back to you.",
            ].map((item) => (
              <li key={item} className="pl-6 relative">
                <span
                  aria-hidden
                  className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-gold-300"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* MORE THAN ONE ASSET */}
      <section className="bg-sand border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">
            When the house is not the only asset.
          </h2>
          <p className="mt-6 text-ink/80 leading-relaxed">
            For your clients with larger estates, the question is usually not
            what the house sells for. It is whether it should be sold at all,
            and how it fits everything else.
          </p>
          <p className="mt-5 text-ink/80 leading-relaxed">
            By the time I meet these families there is already an attorney, often
            a trust officer, an advisor and a CPA. Every one of them has a plan
            for the proceeds. Frequently nobody has a plan for the real property
            itself, or for the second home, the rental, the land, or the
            business the client is retiring out of.
          </p>
          <p className="mt-5 text-ink/80 leading-relaxed">
            That is the gap I work in. Whether it needs to be sold at all, or
            whether it is passing to family and is structured the way everyone
            believes it is. Timing against the capital gains exclusion on a
            primary residence, which is $250,000 single and $500,000 married
            under Section 121 and which properties in this range often exceed.
            Whether holding until passing and resetting basis serves the family
            better than selling now. Whether a 1031 exchange moves other real
            estate into something that performs better.
          </p>
          <p className="mt-5 text-ink/80 leading-relaxed">
            <strong>
              I am not the attorney and I am not the tax person.
            </strong>{" "}
            I make sure the property stops being the piece nobody at that table
            is holding, and that the facts you need are on it when you make the
            call.
          </p>
        </div>
      </section>

      {/* WHERE */}
      <section className="bg-white border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">Where I work.</h2>
          <p className="mt-6 text-ink/80 leading-relaxed">
            In person across the Triad, Greensboro, High Point and
            Winston-Salem, and now Alamance, Orange and Durham counties. My
            license is statewide in North Carolina.
          </p>
          <p className="mt-5 text-ink/80 leading-relaxed">
            Outside that footprint I still take the family. The education and
            the advising work anywhere by phone, and the referral goes to a
            vetted agent in their own market, which means a client who moved out
            of state is not a client I have to turn away.
          </p>
        </div>
      </section>

      {/* AI DISCLOSURE */}
      <section className="bg-sand border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">
            How I use AI, stated plainly.
          </h2>
          <p className="mt-6 text-ink/80 leading-relaxed">
            I use AI tools for research and for drafting. Every Roadmap and
            every written plan is then reviewed, revised and approved by me, a
            licensed North Carolina broker, before a family or a professional
            ever sees it. Nothing goes out that I have not gone through myself.
          </p>
          <p className="mt-5 text-ink/80 leading-relaxed">
            <strong>
              Client information never goes into free or public AI tools.
            </strong>{" "}
            Family details are handled only in private, paid tools, and any
            example used in published material is anonymized before it is
            drafted rather than after.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl">Let&rsquo;s talk.</h2>
          <p className="mt-6 text-ink/80 leading-relaxed">
            If you have a client right now where the house is holding up
            everything else, book a short intro call. If you would rather just
            see the work first, the Blueprint and the Roadmap are both no cost
            and there is nothing to buy in either one.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link
                href="/work-with-ryan"
                data-track="book_call_click"
                data-track-params='{"location":"partners-footer"}'
              >
                Book a call
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/the-blueprint">See the Blueprint</Link>
            </Button>
          </div>
          <EmailFallback className="mt-6" align="center" />
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="bg-cream border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <p className="text-xs text-ink/60 leading-relaxed">
            Ryan Riggins is a licensed real estate broker in North Carolina
            (License #361546 with eXp Realty). Content is for educational
            purposes only and does not constitute legal, tax, financial or
            medical advice. Tax figures cited are general federal rules and are
            not advice about any specific situation. Always consult licensed
            professionals for your client&rsquo;s circumstances.
          </p>
        </div>
      </section>
    </main>
  );
}
