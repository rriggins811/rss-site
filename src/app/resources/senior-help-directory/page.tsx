import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  faqPageSchema,
} from "@/lib/schema";
import { NATIONAL_ANCHORS, DIRECTORY_COUNTIES } from "@/lib/directory";
import { abs } from "@/lib/site";

const TITLE =
  "Senior Help Directory: Free Programs for Seniors & Families (by County)";
const DESCRIPTION =
  "A free, plain-English directory of senior assistance: food, energy, Medicare, home repair, transportation, legal, and caregiver help, organized by county. No sign-up.";
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
    q: "How do I find senior help in my county?",
    a: "If your county is listed below, open its page for local programs and phone numbers. If it is not listed yet, three national front doors work in any US county: call 211, call the Eldercare Locator at 1-800-677-1116, or screen for benefits at benefitscheckup.org.",
  },
  {
    q: "What kind of help does the directory cover?",
    a: "Property tax relief, food, energy and utility bills, Medicare and prescriptions, home repair and safety, transportation, legal help, caregiver support, and full medical care that lets a senior stay at home instead of a nursing home.",
  },
  {
    q: "My county is not listed yet. What should I do?",
    a: "We add counties a little at a time. Until yours is up, start with 211 or the Eldercare Locator at 1-800-677-1116, which route to local aging services in any US county.",
  },
];

export default function SeniorHelpDirectoryHubPage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: "Senior Help Directory", path: CANONICAL },
  ]);

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
            Free help for seniors and families, organized by county.
          </h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed">
            Most families find out about a program a year after they needed it.
            This is the list nobody hands you: real government and nonprofit
            help for food, energy bills, Medicare, home repairs,
            transportation, legal trouble, and caregiver support. It is free,
            there is no sign-up, and we add counties over time.
          </p>
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
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BY COUNTY */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">Find help by county</h2>
          <p className="mt-3 text-ink/75 leading-relaxed">
            County pages list local programs with phone numbers. We are
            building this out one county at a time.
          </p>
          <ul className="mt-8 space-y-5">
            {DIRECTORY_COUNTIES.map((c) => (
              <li key={c.slug}>
                <div className="group block rounded-md border border-border bg-cream/50 p-5 hover:border-burgundy-600 transition-colors">
                  <Link href={`/blog/${c.slug}`} className="block">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg sm:text-xl text-navy-700 leading-snug group-hover:text-burgundy-700 transition-colors">
                        {c.county}, {c.state}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-burgundy-100 text-burgundy-700 border-0"
                      >
                        {c.metro}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-ink/75 leading-relaxed">
                      {c.blurb}
                    </p>
                  </Link>
                  {c.taxArticleSlug ? (
                    <p className="mt-3 text-sm">
                      <Link
                        href={`/blog/${c.taxArticleSlug}`}
                        className="font-semibold text-burgundy-600 hover:text-burgundy-700"
                      >
                        Also: property tax relief guide for this county &rarr;
                      </Link>
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
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
