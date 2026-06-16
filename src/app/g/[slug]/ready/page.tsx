import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEAD_MAGNETS, getLeadMagnet } from "@/lib/lead-magnets";

/**
 * Branded instant-delivery page for the warm funnel. The user lands here
 * the moment they opt in (and the Resend email links here too). Two jobs:
 *   1. deliver the guide instantly on our domain (not a raw file dump),
 *   2. present the $9.99 Blueprint Map as the ONE soft next step.
 * Deliberately shows no other guides — one offer, one decision.
 *
 * noindex (paid-traffic page) and header hidden on /g/* via SiteHeaderGate.
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
  if (!magnet) return { title: "Your guide" };
  return {
    title: `Your ${magnet.title} is ready`,
    robots: { index: false, follow: false },
  };
}

export default async function GuideReadyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) notFound();

  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto w-full max-w-2xl px-5 py-8 md:py-12">
        <Link
          href="/"
          className="inline-block text-sm font-semibold tracking-tight text-navy-700"
        >
          Riggins Strategic Solutions
        </Link>

        {/* Instant delivery. */}
        <section className="mt-8 rounded-xl border border-navy-100 bg-white p-6 shadow-sm md:mt-10 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy-600">
            You're in
          </p>
          <h1 className="mt-3 font-serif text-2xl font-semibold leading-tight tracking-tight text-navy-700 md:text-3xl">
            Your copy of {magnet.title} is ready.
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink/75">
            Read it right here, or check your inbox, we just emailed you the same
            link so it is saved for later.
          </p>
          <a
            href={magnet.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-navy-700 px-6 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Read {magnet.title} ({magnet.pageCount} pages)
          </a>
        </section>

        {/* The ONE next step: the $9.99 Blueprint Map. Soft. */}
        <section
          className="mt-8 rounded-xl border-2 p-6 md:p-8"
          style={{ borderColor: "#1C3A52", backgroundColor: "#1C3A52" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: "#D4AF37" }}
          >
            When one piece isn't the whole picture
          </p>
          <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight tracking-tight text-white md:text-3xl">
            See every step of the transition, in order, on one screen.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/80">
            That guide answers one question. The Blueprint Map answers the rest,
            every step of a senior transition laid out in order, each with a
            short video that explains it in plain English. No more digging
            through a stack of PDFs to figure out what comes next.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/90">
            It is the same video lessons and summaries from the $47 course, for{" "}
            <span className="font-semibold" style={{ color: "#D4AF37" }}>
              $9.99
            </span>
            .
          </p>
          <a
            href="/blueprint-preview"
            className="mt-5 inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-base font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#D4AF37", color: "#1C3A52" }}
          >
            See the Blueprint Map
            <span aria-hidden className="ml-2">
              &rarr;
            </span>
          </a>
          <p className="mt-3 text-xs text-white/55">
            No pressure. The guide above is yours to keep either way.
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
