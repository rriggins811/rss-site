import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEAD_MAGNETS, getLeadMagnet } from "@/lib/lead-magnets";
import { GuideOptInForm } from "@/components/forms/GuideOptInForm";

/**
 * Warm-funnel ad landing page. One guide, one job: earn the email and
 * deliver instantly. The global site header is hidden on /g/* (see
 * SiteHeaderGate) so the page has a single action and no nav to leak
 * clicks. noindex: this is a paid-traffic destination, kept out of the
 * SEO index so it doesn't compete with the /guides hub.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LEAD_MAGNETS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) return { title: "Free guide" };
  return {
    title: magnet.title,
    description: magnet.landing?.subhead ?? magnet.subtitle,
    robots: { index: false, follow: false },
  };
}

export default async function GuideLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) notFound();

  const lp = magnet.landing;

  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto w-full max-w-2xl px-5 py-8 md:py-12">
        {/* Slim brand wordmark (header is hidden on /g/*). */}
        <Link
          href="/"
          className="inline-block text-sm font-semibold tracking-tight text-navy-700"
        >
          Riggins Strategic Solutions
        </Link>

        <div className="mt-8 md:mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy-600">
            Free guide
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-navy-700 md:text-4xl">
            {lp?.headline ?? magnet.title}
          </h1>
          {lp?.subhead ? (
            <p className="mt-4 text-lg leading-relaxed text-ink/80">
              {lp.subhead}
            </p>
          ) : null}
        </div>

        {lp?.pain ? (
          <p className="mt-6 text-base leading-relaxed text-ink/75">{lp.pain}</p>
        ) : null}

        {/* The opt-in, kept high on the page so it's the obvious action. */}
        <div className="mt-8 rounded-xl border border-navy-100 bg-white p-5 shadow-sm md:p-6">
          <p className="text-base font-semibold text-navy-700">
            Tell us where to send it.
          </p>
          <div className="mt-4">
            <GuideOptInForm magnet={magnet} />
          </div>
        </div>

        {/* What's inside. */}
        {lp?.bullets?.length ? (
          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/60">
              What's inside, {magnet.pageCount} pages
            </h2>
            <ul className="mt-4 space-y-3">
              {lp.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <CheckIcon />
                  <span className="text-base leading-relaxed text-ink/85">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Quiet credibility + reassurance. */}
        <section className="mt-10 rounded-lg bg-sand px-5 py-5">
          <p className="text-sm leading-relaxed text-ink/75">
            Written by Ryan Riggins, who helps families through the senior
            transition so they are not taken advantage of during the hardest
            season of their lives. Plain-English. No jargon. No pressure. We
            email the guide right away and send a link to read it online.
          </p>
        </section>

        <p className="mt-8 text-xs leading-relaxed text-ink/55">
          This guide is general education, not financial, tax, medical, or legal
          advice. Riggins Strategic Solutions is an education and media company.
          Ryan Riggins, NC Real Estate License #361546, eXp Realty.
        </p>
      </div>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <circle cx="12" cy="12" r="11" fill="#D4AF37" opacity="0.18" />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        stroke="#A88A30"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
