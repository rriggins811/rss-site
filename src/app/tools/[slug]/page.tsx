import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmailFallback } from "@/components/site/EmailFallback";
import { JsonLd } from "@/components/site/JsonLd";
import { ToolIframe } from "@/components/site/ToolIframe";
import {
  getAllToolSlugs,
  getToolBySlug,
  CATEGORY_LABELS,
} from "@/lib/tools";
import { breadcrumbListSchema } from "@/lib/schema";
import { abs, AUTHOR, ORGANIZATION, SITE_URL } from "@/lib/site";

type RouteParams = { slug: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool not found" };
  const url = `/tools/${tool.slug}`;
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: url },
    openGraph: {
      title: tool.title,
      description: tool.description,
      type: "website",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const url = abs(`/tools/${tool.slug}`);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.description,
    url,
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    operatingSystem: "Any (web browser)",
    author: { "@id": `${SITE_URL}/#ryan-riggins` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: tool.title, path: `/tools/${tool.slug}` },
  ]);

  return (
    <main>
      <JsonLd data={webAppSchema} />
      <JsonLd data={breadcrumbs} />

      {/* HEADER */}
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <Link
            href="/tools"
            className="text-sm font-semibold text-burgundy-600 hover:text-burgundy-700"
          >
            &larr; All tools
          </Link>
          <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-burgundy-600">
            {CATEGORY_LABELS[tool.category]}
          </div>
          <h1 className="mt-3 leading-[1.1]">{tool.title}</h1>
          <p className="mt-5 text-lg text-ink/80 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </section>

      {/* TOOL */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <ToolIframe
            slug={tool.slug}
            title={tool.title}
            minHeight={tool.minHeight}
          />
        </div>
      </section>

      {/* FOLLOW-UP */}
      <section className="bg-sand border-y border-border">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center">
          <h2 className="text-2xl md:text-3xl">Need help interpreting your results?</h2>
          <p className="mt-4 text-ink/80 leading-relaxed">
            Numbers on a page don't decide anything. A 20-minute call will. Walk
            through what you just saw with {AUTHOR.name}, {AUTHOR.jobTitle}.
            No sales pressure. Ryan is licensed ({ORGANIZATION.legalName})
            but does not work as a traditional listing agent.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link
                href="/work-with-ryan"
                data-track="book_call_click"
                data-track-params={`{"location":"tool-footer","tool":"${tool.slug}"}`}
              >
                Book a free 20-min call
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/freeguide">Get the free Simple Blueprint</Link>
            </Button>
          </div>
          <EmailFallback className="mt-6" align="center" />
        </div>
      </section>
    </main>
  );
}
