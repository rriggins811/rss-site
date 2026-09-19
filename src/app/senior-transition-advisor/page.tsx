import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema, collectionPageSchema } from "@/lib/schema";
import { ROLE_BYLINE, ROLE_DEFINITION, abs, pageTitle } from "@/lib/site";
import { CITY_INDEX_PATH, CITY_PAGES, cityPath } from "@/lib/city-pages";

/**
 * Index of the city pages (built 2026-09-19, preview until Ryan's GO).
 */

const H1 = "Senior Transition Advisor for the family home, by city";
const UPDATED = "2026-09-19";
const UPDATED_LABEL = "September 19, 2026";
const DESCRIPTION =
  "Help deciding a parent's house before anyone lists it, in Greensboro, Winston-Salem, High Point, Raleigh, Durham, Cary and Chapel Hill, NC. Free to the family.";

export const metadata: Metadata = {
  title: pageTitle("Senior Transition Advisor by City: NC Triad and Triangle"),
  description: DESCRIPTION,
  alternates: { canonical: CITY_INDEX_PATH },
  openGraph: {
    type: "website",
    url: abs(CITY_INDEX_PATH),
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

export default function CityIndexPage() {
  const regions: ("Triad" | "Triangle")[] = ["Triad", "Triangle"];
  return (
    <main>
      <JsonLd
        data={collectionPageSchema({
          name: H1,
          description: DESCRIPTION,
          pageUrl: abs(CITY_INDEX_PATH),
          items: CITY_PAGES.map((c) => ({
            name: `Senior Transition Advisor for the family home in ${c.city}, NC`,
            itemUrl: abs(cityPath(c.slug)),
            description: c.description,
          })),
        })}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Senior Transition Advisor by city", path: CITY_INDEX_PATH },
        ])}
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-700/70">
            Where I work
          </p>
          <h1 className="mt-4 leading-[1.1]">{H1}</h1>
          <p className="mt-5 text-sm text-ink/70">
            By {ROLE_BYLINE}
            <br />
            Updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
          </p>
          <p className="aeo-speakable-quickanswer mt-8 rounded-r-md border-l-4 border-burgundy-600 bg-white/70 px-5 py-5 text-lg leading-relaxed text-ink/90">
            {ROLE_DEFINITION}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            I&rsquo;m based in Greensboro and work with families across the
            Triad and the Triangle. Each page below covers that city&rsquo;s
            county, the local offices you&rsquo;ll actually deal with, and the
            house questions that come up there. Anywhere else in the country I
            work by phone and video, and the agent I refer is always a vetted
            partner licensed where the house is.
          </p>
        </div>
      </section>

      {regions.map((region) => (
        <section key={region} className="bg-white border-t border-border">
          <div className="mx-auto max-w-4xl px-6 py-14">
            <GoldRule />
            <h2 className="mt-3">The {region}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {CITY_PAGES.filter((c) => c.region === region).map((c) => (
                <Link
                  key={c.slug}
                  href={cityPath(c.slug)}
                  className="block rounded-lg border border-border bg-cream/40 p-6 hover:border-burgundy-600"
                >
                  <h3 className="font-serif text-xl text-navy-700">{c.city}, NC</h3>
                  <p className="mt-1 text-sm text-ink/60">{c.counties.join(", ")}</p>
                  <p className="mt-3 leading-relaxed text-ink/80">{c.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-sand border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-14 text-lg leading-relaxed text-ink/80">
          <p>
            Not in one of these cities? Start with{" "}
            <Link href="/mom-moving-to-assisted-living-what-to-do-with-the-house" className={linkClass}>
              what to do with the house when Mom moves to assisted living
            </Link>
            , or compare{" "}
            <Link href="/sell-rent-or-keep-parents-house" className={linkClass}>
              sell, rent or keep
            </Link>
            . County help lives in the{" "}
            <Link href="/resources/senior-help-directory" className={linkClass}>
              Senior Help Directory
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-navy-700 text-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <GoldRule className="mx-auto" />
          <h2 className="mt-3 text-cream">Talk to me before anyone lists the house.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/85">
            A free 20-minute call. It costs your family nothing.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gold-500 text-navy-900 hover:bg-gold-300">
            <Link
              href="/work-with-ryan"
              data-track="book_call_click"
              data-track-params='{"location":"city-index-cta"}'
            >
              Book your free call
            </Link>
          </Button>
          <p className="mt-6 text-sm text-cream/70">
            Ryan Riggins, NC Real Estate Broker #361546, eXp Realty
          </p>
        </div>
      </section>
    </main>
  );
}
