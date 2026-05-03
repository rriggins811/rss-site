import { JsonLd } from "@/components/site/JsonLd";
import { ORGANIZATION, SITE_URL, abs } from "@/lib/site";

type Props = {
  headline: string;
  description: string;
  /** Author's display name. Defaults to Ryan Riggins. */
  author?: string;
  /** ISO 8601 published date (e.g. "2026-05-03"). */
  datePublished: string;
  /** ISO 8601 modified date. Defaults to datePublished. */
  dateModified?: string;
  /** Absolute or site-relative image URL. */
  image?: string;
  /** Canonical URL of the article. */
  url: string;
};

/**
 * JSON-LD Article schema. The author block links by @id to the
 * canonical Person schema emitted on every page via the root layout
 * (lib/schema personSchema), so sameAs URLs and credentials live in
 * one place and propagate without per-article duplication.
 */
export function ArticleSchema({
  headline,
  description,
  author = "Ryan Riggins",
  datePublished,
  dateModified,
  image,
  url,
}: Props) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#ryan-riggins`,
      name: author,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: ORGANIZATION.name,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION.logoUrl,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
  if (image) {
    data.image = [image.startsWith("http") ? image : abs(image)];
  }
  return <JsonLd data={data} />;
}
