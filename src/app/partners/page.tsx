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
    "Estate attorneys, financial advisors, CPAs, and care managers: a partner for the transition side of your clients' senior housing move. No referral fees, no contracts, no pitch of your service.",
  alternates: { canonical: "/partners" },
  openGraph: {
    title: "For Professionals Who Refer Families",
    description:
      "A partner for the transition side of your clients' senior housing move. Same mission. Different lane.",
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
            A partner for the families your clients are trying to protect.
          </h1>
          <p className="mt-6 text-lg text-cream/85 leading-relaxed">
            You handle the legal, financial, or care plan. We handle the $50K
            mistakes that happen in the house and the transition. Same mission.
            Different lane.
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

      {/* WHO THIS IS FOR */}
      <section className="bg-white border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">Who this is for.</h2>
          <p className="mt-6 text-ink/80 leading-relaxed">
            Estate attorneys, elder law attorneys, trust officers, CPAs,
            financial advisors, senior move managers, care managers, and social
            workers who keep running into the same problem. The family's plan
            is solid on paper, but the transition itself isn't. The house, the
            stuff, the timing, the repairs, the &ldquo;we buy houses&rdquo;
            letters. Nobody is watching that side of it.
          </p>
          <p className="mt-5 text-ink/80 leading-relaxed">
            That&rsquo;s where we come in.
          </p>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="bg-sand border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">
            What we actually do for your clients.
          </h2>
          <ul className="mt-8 space-y-4 text-ink/85 leading-relaxed">
            <li className="pl-6 relative">
              <span
                aria-hidden
                className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-gold-500"
              />
              Walk the property with a builder&rsquo;s eye and tell them what
              is worth fixing and what isn&rsquo;t.
            </li>
            <li className="pl-6 relative">
              <span
                aria-hidden
                className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-gold-500"
              />
              Translate the transition into a 7-phase plan so the family
              isn&rsquo;t guessing.
            </li>
            <li className="pl-6 relative">
              <span
                aria-hidden
                className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-gold-500"
              />
              Protect them from predatory cash buyers and wholesaler pressure.
            </li>
            <li className="pl-6 relative">
              <span
                aria-hidden
                className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-gold-500"
              />
              Coordinate the move, the sale, and the family communication.
            </li>
            <li className="pl-6 relative">
              <span
                aria-hidden
                className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-gold-500"
              />
              Licensed NC broker (#361546, eXp Realty). Full fiduciary duty to
              the family, not a pitch.
            </li>
          </ul>
          <p className="mt-8 text-ink/80 leading-relaxed">
            We&rsquo;re not a move manager. We&rsquo;re not a listing agent.
            We&rsquo;re the advisor who keeps families from losing $50K to a
            bad transition.
          </p>
        </div>
      </section>

      {/* HOW WE WORK WITH PROFESSIONALS */}
      <section className="bg-white border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">
            How we work with professionals.
          </h2>
          <p className="mt-6 text-ink/80 leading-relaxed">
            No referral fees in either direction. No contracts. No MSA. You
            refer a family when the fit is there. We offer your clients a
            meaningful discount on our services as a thank-you to you for the
            warm handoff.
          </p>
          <p className="mt-5 text-ink/80 leading-relaxed">
            Your relationship stays yours. We never pitch your service. We
            never try to replace you. We handle the transition side and hand
            the family back to you for the legal, financial, or care work.
          </p>
        </div>
      </section>

      {/* WHERE WE WORK */}
      <section className="bg-sand border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">Where we work.</h2>
          <p className="mt-6 text-ink/80 leading-relaxed">
            Nationwide for digital products, education, and phone-based
            advising. In person for the NC Triad (Greensboro, High Point,
            Winston-Salem) and surrounding counties.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl">Let&rsquo;s talk.</h2>
          <p className="mt-6 text-ink/80 leading-relaxed">
            If you&rsquo;ve got a family right now who needs this kind of help,
            book a 15-minute intro call and we&rsquo;ll figure out if
            there&rsquo;s a fit.
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
            purposes only and does not constitute legal, financial, or medical
            advice. Always consult with licensed professionals for your
            specific situation.
          </p>
        </div>
      </section>
    </main>
  );
}
