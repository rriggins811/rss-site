import type { Metadata } from "next";
import { PAGE_UPDATED } from "@/lib/page-dates";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { FAQSection } from "@/components/aeo/FAQSection";
import {
  breadcrumbListSchema,
  cityServiceSchema,
  pageArticleSchema,
} from "@/lib/schema";
import { ROLE_BYLINE, ROLE_DEFINITION, ROLE_TITLE, abs, pageTitle } from "@/lib/site";
import { CITY_INDEX_PATH, CITY_PAGES, cityBySlug, cityPath } from "@/lib/city-pages";

/**
 * One page per city (built 2026-09-19, preview until Ryan's GO). All local
 * copy lives in src/lib/city-pages.ts with its sources; this file is layout.
 * The shared parts (the definition, how the call works, what it costs) are
 * the same promise on every page on purpose; the county, the local facts,
 * the resources and the FAQ are each city's own.
 */

type RouteParams = { city: string };

const PUBLISHED = "2026-09-19";
const UPDATED = PAGE_UPDATED.cityPages;
const UPDATED_LABEL = "September 19, 2026";

const linkClass =
  "font-semibold text-burgundy-600 underline underline-offset-4 hover:text-burgundy-700";

export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  return CITY_PAGES.map((c) => ({ city: c.slug }));
}

function h1For(city: string) {
  return `Senior Transition Advisor for the family home in ${city}, NC`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const c = cityBySlug(slug);
  if (!c) return { title: "Not found" };
  const path = cityPath(c.slug);
  const h1 = h1For(c.city);
  return {
    title: pageTitle(c.metaTitle),
    description: c.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: abs(path),
      siteName: "Riggins Strategic Solutions",
      title: h1,
      description: c.description,
      images: [abs("/og/homepage.png")],
    },
    twitter: {
      card: "summary_large_image",
      title: h1,
      description: c.description,
      images: [abs("/og/homepage.png")],
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { city: slug } = await params;
  const c = cityBySlug(slug);
  if (!c) notFound();

  const path = cityPath(c.slug);
  const h1 = h1For(c.city);
  const others = CITY_PAGES.filter((o) => o.slug !== c.slug);

  return (
    <main>
      <JsonLd
        data={cityServiceSchema({
          path,
          city: c.city,
          counties: c.counties,
          description: `${ROLE_DEFINITION} Serving families with a house in ${c.city}, NC.`,
        })}
      />
      <JsonLd
        data={pageArticleSchema({
          path,
          headline: h1,
          description: c.description,
          datePublished: PUBLISHED,
          dateModified: UPDATED,
          about: { "@id": abs("/#role") },
        })}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Senior Transition Advisor by city", path: CITY_INDEX_PATH },
          { name: `${c.city}, NC`, path },
        ])}
      />

      {/* HERO: H1, byline, then the answer in the first sentences. */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-700/70">
            {c.city}, NC &middot; {c.counties.join(", ")}
          </p>
          <h1 className="mt-4 leading-[1.1]">{h1}</h1>
          <p className="mt-5 text-sm text-ink/70">
            By {ROLE_BYLINE}
            <br />
            Updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
          </p>
          <p className="aeo-speakable-quickanswer mt-8 rounded-r-md border-l-4 border-burgundy-600 bg-white/70 px-5 py-5 text-lg leading-relaxed text-ink/90">
            {c.quickAnswer}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">{c.intro}</p>
        </div>
      </section>

      {/* THE ROLE, in one sentence */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <GoldRule />
          <h2 className="mt-3">What I do, in one sentence.</h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/85">{ROLE_DEFINITION}</p>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">
            More on{" "}
            <Link href="/what-is-a-senior-transition-advisor" className={linkClass}>
              what a {ROLE_TITLE} is, and isn&rsquo;t
            </Link>
            .
          </p>
        </div>
      </section>

      {/* THE COUNTY */}
      <section className="bg-sand">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">{c.countyHeading}</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/80">
            {c.countyBody.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL HOUSE FACTS */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">What&rsquo;s specific to a {c.city} house.</h2>
          <div className="mt-8 space-y-8">
            {c.facts.map((f) => (
              <div key={f.title}>
                <h3 className="font-serif text-xl text-navy-700">{f.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-ink/80">{f.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-base leading-relaxed text-ink/70">
            None of this is legal or tax advice. Signing authority, deeds and
            Medicaid belong with an elder law attorney, and the tax side of a
            sale belongs with a CPA. I tell you when you need one and what to
            ask.
          </p>
        </div>
      </section>

      {/* LOCAL RESOURCES */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">Local help worth a call.</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">{c.resourcesIntro}</p>
          <ul className="mt-8 space-y-5 text-lg leading-relaxed text-ink/80">
            {c.resources.map((r) => (
              <li key={r.name} className="border-l-4 border-gold-500 pl-5">
                <strong className="text-navy-700">{r.name}</strong>
                <br />
                {r.detail}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg leading-relaxed text-ink/80">
            The full lists:{" "}
            {c.directories.map((d, i) => (
              <span key={d.href}>
                {i > 0 ? ", " : ""}
                <Link href={d.href} className={linkClass}>
                  {d.label}
                </Link>
              </span>
            ))}
            .
          </p>
        </div>
      </section>

      {/* HOW THE CALL AND THE ROADMAP WORK */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">How working with me goes.</h2>
          <ol className="mt-8 space-y-6 text-lg leading-relaxed text-ink/80">
            <li>
              <strong className="text-navy-700">1. A free 20-minute call.</strong>{" "}
              Phone or video. Bring the community&rsquo;s fee sheet if you have
              it, and the power of attorney if there is one. You&rsquo;ll leave
              knowing what to do first.
            </li>
            <li>
              <strong className="text-navy-700">2. The funding math.</strong>{" "}
              The fee sheet next to what your parent actually has: income,
              savings, and what the house would really net. How many months does
              the money last, with the house and without it?
            </li>
            <li>
              <strong className="text-navy-700">3. A written plan, if you want one.</strong>{" "}
              The{" "}
              <Link href="/the-roadmap" className={linkClass}>
                Senior Transition Roadmap
              </Link>{" "}
              is free, by application: an intake form, a call with me, a written
              plan we build together, a follow-up call and 90 days of email
              support.
            </li>
            <li>
              <strong className="text-navy-700">4. Sell, rent or keep, on purpose.</strong>{" "}
              I lay the three side by side. Here&rsquo;s{" "}
              <Link href="/sell-rent-or-keep-parents-house" className={linkClass}>
                how sell, rent and keep compare
              </Link>
              .
            </li>
            <li>
              <strong className="text-navy-700">5. If selling, one vetted local agent.</strong>{" "}
              I refer one agent I&rsquo;ve vetted for this kind of sale and tell
              you why that one. I never take the listing.
            </li>
          </ol>
          <p className="mt-8 text-lg leading-relaxed text-ink/80">
            <strong className="text-navy-700">What it costs:</strong> nothing to
            your family. If you sell, the agent I refer pays me a referral fee
            at closing out of the commission, through eXp Realty. If you rent,
            keep or wait, I&rsquo;m not paid at all.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            If your mom or dad is moving right now, start with{" "}
            <Link
              href="/mom-moving-to-assisted-living-what-to-do-with-the-house"
              className={linkClass}
            >
              what to do with the house when Mom moves to assisted living
            </Link>
            .
          </p>
        </div>
      </section>

      <FAQSection
        items={c.faqs}
        title={`Questions from ${c.city} families.`}
        kicker="Common questions"
      />

      {/* OTHER CITIES */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-base leading-relaxed text-ink/80">
            Other cities:{" "}
            {others.map((o, i) => (
              <span key={o.slug}>
                {i > 0 ? ", " : ""}
                <Link href={cityPath(o.slug)} className={linkClass}>
                  {o.city}
                </Link>
              </span>
            ))}
            . Or see{" "}
            <Link href={CITY_INDEX_PATH} className={linkClass}>
              every city I serve
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-700 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">
            Talk to me before anyone lists the {c.city} house.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/85">
            A free 20-minute call. It costs your family nothing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gold-500 text-navy-900 hover:bg-gold-300">
              <Link
                href="/work-with-ryan"
                data-track="book_call_click"
                data-track-params={JSON.stringify({ location: `city-${c.slug}-cta` })}
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
            Ryan Riggins, NC Real Estate Broker #361546, eXp Realty. Not legal,
            tax or financial advice.
          </p>
        </div>
      </section>
    </main>
  );
}
