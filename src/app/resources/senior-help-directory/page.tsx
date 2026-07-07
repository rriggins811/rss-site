import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  faqPageSchema,
} from "@/lib/schema";
import {
  NATIONAL_ANCHORS,
  DIRECTORY_COUNTIES,
  DIRECTORY_STATES,
  countiesForState,
} from "@/lib/directory";
import { abs } from "@/lib/site";

const TITLE =
  "Senior Help Directory: Free Programs for Seniors & Families (by State & County)";
const DESCRIPTION =
  "A free, plain-English directory of senior assistance: food, energy, Medicare, home repair, transportation, legal, and caregiver help, organized by state and county. No sign-up.";
const CANONICAL = "/resources/senior-help-directory";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Hub FAQ. Q/A text is rendered visibly below AND fed verbatim to the
// FAQPage schema, so the two stay in sync (Google's match rule).
const HUB_FAQS: { q: string; a: string }[] = [
  {
    q: "Is the Senior Help Directory free?",
    a: "Yes, completely free and open. There is no sign-up, no email wall, and nothing to buy. It lists government and nonprofit programs only.",
  },
  {
    q: "How do I find senior help in my state and county?",
    a: "Use the national resources at the top, which work anywhere, then pick your state below and open your county for local programs and phone numbers. If your county is not listed yet, call 211 or the Eldercare Locator at 1-800-677-1116, which route to local aging services in any US county.",
  },
  {
    q: "What kind of help does the directory cover?",
    a: "Property tax relief, food, energy and utility bills, Medicare and prescriptions, home repair and safety, transportation, legal help, caregiver support, and full medical care that lets a senior stay at home instead of a nursing home.",
  },
  {
    q: "My state or county is not listed yet. What should I do?",
    a: "We add states and counties a little at a time. Until yours is up, start with 211 or the Eldercare Locator at 1-800-677-1116, which route to local aging services in any US county.",
  },
  {
    q: "What if we also need to sell the house?",
    a: "That is the other half of what I do. I never list homes myself. I find and vet a local agent for your family and stay on the sale as your advocate, at no added cost to you, paid from the commission you would already pay. See rigginsstrategicsolutions.com/in-your-corner.",
  },
];

export default function SeniorHelpDirectoryHubPage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: "Senior Help Directory", path: CANONICAL },
  ]);

  // Hub ItemList points at the substantive content pages (the live county
  // guides) so crawlers reach the real content directly, regardless of the
  // state grouping shown visually.
  const collection = collectionPageSchema({
    name: TITLE,
    description: DESCRIPTION,
    pageUrl: abs(CANONICAL),
    items: DIRECTORY_COUNTIES.map((c) => ({
      name: `${c.county}, ${c.state} Senior Help Directory`,
      itemUrl: abs(`/blog/${c.slug}`),
      description: c.blurb,
    })),
  });

  const faq = faqPageSchema(HUB_FAQS, abs(CANONICAL));

  // States ordered: ones with county guides first (by count, then name),
  // then the rest alphabetically. Names are already alphabetical in the
  // registry except NC; a stable sort keeps that order within each group.
  const statesByActivity = DIRECTORY_STATES.map((s) => ({
    state: s,
    count: countiesForState(s.code).length,
  })).sort((a, b) => {
    if ((b.count > 0 ? 1 : 0) !== (a.count > 0 ? 1 : 0)) {
      return (b.count > 0 ? 1 : 0) - (a.count > 0 ? 1 : 0);
    }
    if (b.count !== a.count) return b.count - a.count;
    return a.state.name.localeCompare(b.state.name);
  });

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={collection} />
      <JsonLd data={faq} />

      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:py-24">
          <Badge
            variant="secondary"
            className="bg-burgundy-100 text-burgundy-700 border-0"
          >
            Senior Help Directory
          </Badge>
          <h1 className="mt-6 leading-[1.05]">
            Free help for seniors and families, organized by state and county.
          </h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed">
            Most families find out about a program a year after they needed it.
            This is the list nobody hands you: real government and nonprofit
            help for food, energy bills, Medicare, home repairs,
            transportation, legal trouble, and caregiver support. It is free,
            there is no sign-up, and we add states and counties over time.
          </p>
          <p className="mt-4 text-sm text-ink/70 leading-relaxed">
            Maintained by Ryan Riggins, Senior Transition Advisor. I built
            this because families kept finding out about help a year too late.
          </p>

          {/* Featured callout: Scam Protection hub */}
          <Link
            href="/resources/senior-scam-protection"
            className="group mt-8 block rounded-lg border border-burgundy-200 bg-white p-6 transition-colors hover:border-burgundy-600"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-burgundy-700">
              Consumer Protection
            </p>
            <p className="mt-2 font-serif text-2xl text-navy-700">
              Protect Against Scams
            </p>
            <p className="mt-2 text-ink/75 leading-relaxed">
              Older Americans lost 4.9 billion dollars to fraud in 2024. Learn
              the simple rules that stop the scams aimed at seniors and their
              homes, and where to report fraud fast.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-burgundy-700 group-hover:text-burgundy-800">
              Open the Scam Protection Guide <span aria-hidden>&rarr;</span>
            </span>
          </Link>
        </div>
      </section>

      {/* NATIONAL "START HERE" */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">
            Start here (works anywhere)
          </h2>
          <p className="mt-3 text-ink/75 leading-relaxed">
            These national resources work in any state. If you only do one
            thing, call 211 or the Eldercare Locator and let them route you.
          </p>
          <ul className="mt-8 space-y-4">
            {NATIONAL_ANCHORS.map((a) => (
              <li
                key={a.name}
                className="rounded-md border border-border bg-cream/50 p-5"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-serif text-lg text-navy-700">
                    {a.name}
                  </span>
                  <span className="font-semibold text-burgundy-700">
                    {a.contact}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink/75 leading-relaxed">
                  {a.desc}
                </p>
                {a.url && a.url !== a.contact ? (
                  <a
                    href={`https://${a.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-semibold text-burgundy-700 underline underline-offset-2 hover:text-burgundy-800"
                  >
                    {a.url}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BROWSE BY STATE */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">Find help by state</h2>
          <p className="mt-3 text-ink/75 leading-relaxed">
            States with county guides are listed first. We are building this
            out one county at a time. If your state is not filled in yet, its
            page still points you to the national resources above.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {statesByActivity.map(({ state, count }) => (
              <li key={state.code}>
                <Link
                  href={`${CANONICAL}/${state.slug}`}
                  className={`group flex items-center justify-between gap-2 rounded-md border px-4 py-3 transition-colors ${
                    count > 0
                      ? "border-burgundy-200 bg-cream/60 hover:border-burgundy-600"
                      : "border-border bg-white hover:border-burgundy-400"
                  }`}
                >
                  <span
                    className={`text-sm leading-snug ${
                      count > 0
                        ? "font-semibold text-navy-700 group-hover:text-burgundy-700"
                        : "text-ink/70 group-hover:text-burgundy-700"
                    }`}
                  >
                    {state.name}
                  </span>
                  {count > 0 ? (
                    <span className="shrink-0 rounded-full bg-burgundy-100 px-2 py-0.5 text-xs font-semibold text-burgundy-700">
                      {count}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* OVERWHELMED CTA — human next step between the state list and
          the FAQs. */}
      <section className="bg-cream border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="rounded-lg border border-burgundy-200 bg-white p-8 text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-navy-700">
              Overwhelmed by the list?
            </h2>
            <p className="mt-3 text-ink/80 leading-relaxed max-w-2xl mx-auto">
              Book a free 20 minute call and I will help you figure out which
              programs your parent actually qualifies for.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/work-with-ryan">Book a free 20-minute call</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-sand border-y border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">
            Frequently asked questions
          </h2>
          <dl className="mt-8 space-y-8">
            {HUB_FAQS.map((f) => (
              <div key={f.q}>
                <dt className="font-serif text-lg text-navy-700">{f.q}</dt>
                <dd className="mt-2 text-ink/80 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <p className="text-xs text-ink/60 leading-relaxed">
            Ryan Riggins is a licensed North Carolina real estate agent
            (#361546, eXp Realty). Riggins Strategic Solutions is an education
            and media company, not a real estate sales business. This directory
            is not a solicitation to buy, sell, or list a home, and it is not
            financial, tax, medical, or legal advice. Programs, income limits,
            contacts, and deadlines change and vary by individual situation.
            Confirm current details directly with each program or a licensed
            professional before making any decision.
          </p>
        </div>
      </section>
    </main>
  );
}
