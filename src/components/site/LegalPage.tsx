import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema } from "@/lib/schema";
import { formatLegalDate, type LegalPage as LegalPageType } from "@/lib/legal";

type Props = {
  page: LegalPageType;
};

export async function LegalPage({ page }: Props) {
  const { content } = await compileMDX({ source: page.content });
  const href = `/${page.frontmatter.slug}`;
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: page.frontmatter.title, path: href },
  ]);

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <Link
            href="/"
            className="text-sm font-semibold text-burgundy-600 hover:text-burgundy-700"
          >
            &larr; Home
          </Link>
          <h1 className="mt-6 leading-[1.1]">{page.frontmatter.title}</h1>
          <p className="mt-4 text-sm text-ink/70">
            Last updated: {formatLegalDate(page.lastUpdated)}
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <article className="prose-rss">{content}</article>
        </div>
      </section>
    </main>
  );
}
