import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema, collectionPageSchema } from "@/lib/schema";
import { RESOURCES } from "@/lib/resources";
import { abs } from "@/lib/site";

const TITLE = "Resources for families navigating a senior transition";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Plain-English guides for families navigating a senior housing transition. Selling a parent's home, talking to a stubborn parent, spotting cash-buyer scams, choosing between assisted living and memory care, and more.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: TITLE,
    description:
      "Plain-English guides for families navigating a senior housing transition.",
    url: "/resources",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Plain-English guides for families navigating a senior housing transition.",
  },
};

export default function ResourcesIndexPage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
  ]);

  // Upgraded from bare ItemList to CollectionPage (which wraps the same
  // ItemList) so Google sees this as a proper hub page entity, not a
  // floating list. Uses the same collectionPageSchema() factory mounted on
  // /guides, /tools, /blog so all hub pages emit the same shape.
  const collection = collectionPageSchema({
    name: TITLE,
    description:
      "Plain-English guides for families navigating a senior housing transition. Selling a parent's home, talking to a stubborn parent, spotting cash-buyer scams, choosing between assisted living and memory care, and more.",
    pageUrl: abs("/resources"),
    items: RESOURCES.map((r) => ({
      name: r.title,
      itemUrl: abs(`/resources/${r.slug}`),
      description: r.description,
    })),
  });

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={collection} />

      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:py-24">
          <Badge
            variant="secondary"
            className="bg-burgundy-100 text-burgundy-700 border-0"
          >
            Resources
          </Badge>
          <h1 className="mt-6 leading-[1.05]">
            Plain-English guides for families navigating a senior transition.
          </h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed">
            Practical answers to the questions families actually ask. Selling
            a parent&rsquo;s home, talking to a stubborn parent, spotting
            cash-buyer scams, choosing between assisted living and memory
            care, and the financial planning checklist that protects equity.
          </p>
        </div>
      </section>

      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">All guides</h2>
          <ul className="mt-8 space-y-5">
            {RESOURCES.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/resources/${r.slug}`}
                  className="group block rounded-md border border-border bg-cream/50 p-5 hover:border-burgundy-600 transition-colors"
                >
                  <h3 className="font-serif text-lg sm:text-xl text-navy-700 leading-snug group-hover:text-burgundy-700 transition-colors">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink/75 leading-relaxed">
                    {r.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
