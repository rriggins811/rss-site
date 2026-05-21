import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { ArticleSchema } from "@/components/aeo/ArticleSchema";
import { breadcrumbListSchema } from "@/lib/schema";
import { abs } from "@/lib/site";

const TITLE = "Sorting & Progress Tracker";
const DESCRIPTION =
  "Free senior decluttering tracker. Five-pile system, two-bag daily log, room-by-room dashboard. Download the Excel spreadsheet, no email signup.";
const FILE_PATH = "/downloads/sorting-progress-tracker.xlsx";
const PUBLISHED_ISO = "2026-05-21";

export const metadata: Metadata = {
  // Site suffix is appended by the root layout title template.
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/resources/sorting-tracker" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/resources/sorting-tracker",
    type: "article",
    publishedTime: PUBLISHED_ISO,
    modifiedTime: PUBLISHED_ISO,
    authors: ["Ryan Riggins"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function SortingTrackerPage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: TITLE, path: "/resources/sorting-tracker" },
  ]);

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      <ArticleSchema
        headline={TITLE}
        description={DESCRIPTION}
        datePublished={PUBLISHED_ISO}
        url={abs("/resources/sorting-tracker")}
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:py-24">
          <Badge
            variant="secondary"
            className="bg-burgundy-100 text-burgundy-700 border-0"
          >
            Free download
          </Badge>
          <h1 className="mt-6 leading-[1.05]">
            Sorting &amp; Progress Tracker
          </h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed">
            A practical decluttering tracker for families helping a parent
            downsize. One spreadsheet covers the whole home: a five-pile sorting
            system per room, a daily two-bag log to keep momentum, and a
            dashboard that shows where the family is across every room at once.
          </p>
          <p className="mt-4 text-lg text-ink/80 leading-relaxed">
            The rule that holds the system together is the two-bag minimum.
            Two bags a day. Every day. Six months of that pace clears most
            senior homes without turning the family into a wrecking crew.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a
                href={FILE_PATH}
                download
                data-track="download_resource"
                data-track-params='{"resource":"sorting-progress-tracker","source":"resources_landing"}'
              >
                Download the spreadsheet (.xlsx)
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/resources">All resources</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-ink/60">
            12 KB Excel file. No email signup. Share it with anyone who needs
            it.
          </p>
        </div>
      </section>

      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">
            The five-pile sorting system
          </h2>
          <p className="mt-4 text-base text-ink/80">
            Every item in the house ends up in exactly one of five piles. No
            sixth pile. Once a family stops inventing new categories, the
            sorting actually moves.
          </p>
          <ol className="mt-6 space-y-4 text-base text-ink/85">
            <li>
              <span className="font-semibold text-navy-700">1. Keep.</span>{" "}
              Goes to the next home. Earns its place because it gets used,
              fits the new space, and matches the next chapter of life.
            </li>
            <li>
              <span className="font-semibold text-navy-700">2. Family.</span>{" "}
              Goes to a specific named person. Not the vague &ldquo;the kids
              might want it&rdquo; pile. A specific name, or it moves to
              another pile.
            </li>
            <li>
              <span className="font-semibold text-navy-700">3. Donate.</span>{" "}
              Goes to a charity, shelter, or thrift store the same week it
              hits the pile. Items that sit in the donate pile for more than
              two weeks usually end up back in the home. Move them.
            </li>
            <li>
              <span className="font-semibold text-navy-700">4. Sell.</span>{" "}
              Worth enough to be worth the effort. Estate sale, online
              consignment, marketplace listing. Set a price floor for what
              qualifies, or this pile bloats and stalls everything else.
            </li>
            <li>
              <span className="font-semibold text-navy-700">5. Trash.</span>{" "}
              Broken, expired, unsafe, or worn past usefulness. The pile most
              families resist filling, and the pile that creates the most
              breathing room when it gets filled.
            </li>
          </ol>
          <p className="mt-6 text-sm text-ink/70">
            The spreadsheet tracks counts per pile per room and gives the
            family a real-time view of progress. Mom in Greensboro can see
            what the daughter in Charlotte sorted yesterday. No phone tag, no
            duplicate work.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">When this tracker fits</h2>
          <ul className="mt-6 space-y-3 text-base text-ink/85 list-disc pl-5">
            <li>
              The family has decided a move is coming in 6 to 18 months and
              wants a system, not a guess.
            </li>
            <li>
              Multiple adult children are coordinating from different cities
              and need one shared source of truth.
            </li>
            <li>
              The parent is mostly cooperative but easily overwhelmed by big
              piles. The two-bag daily rule keeps progress feeling possible.
            </li>
            <li>
              There is genuine value in the home (furniture, art, collections)
              that needs the Sell pile tracked separately so it does not get
              donated by accident.
            </li>
          </ul>
          <p className="mt-6 text-base text-ink/80">
            The tracker is one piece of a much larger system. The full Senior
            Transition Blueprint covers everything from financial planning to
            move-day logistics to the family conversations that make any of
            this possible.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/the-blueprint">See the full Blueprint ($47)</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={FILE_PATH} download>
                Just give me the spreadsheet
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center text-xs text-ink/60">
          <p>
            Ryan Riggins &middot; NC Real Estate License #361546 &middot; eXp Realty
          </p>
        </div>
      </section>
    </main>
  );
}
