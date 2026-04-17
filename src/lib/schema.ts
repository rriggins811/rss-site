/**
 * JSON-LD schema generators.
 *
 * Every value here auto-derives from /lib/site.ts constants or from post/media
 * frontmatter. Changing content updates schema on next build. Never hardcode
 * values per page.
 */

import { socialLinks } from "@/lib/social";
import { AUTHOR, ORGANIZATION, SITE_NAME, SITE_URL, abs } from "@/lib/site";
import type { BlogPost } from "@/lib/blog";
import type { MediaItem } from "@/lib/media";

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#ryan-riggins`;
const LOGO_ID = `${SITE_URL}/#logo`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: ORGANIZATION.logoUrl,
      contentUrl: ORGANIZATION.logoUrl,
      caption: ORGANIZATION.name,
    },
    founder: { "@id": PERSON_ID },
    email: ORGANIZATION.email,
    telephone: ORGANIZATION.telephone,
    address: {
      "@type": "PostalAddress",
      addressLocality: ORGANIZATION.address.addressLocality,
      addressRegion: ORGANIZATION.address.addressRegion,
      addressCountry: ORGANIZATION.address.addressCountry,
    },
    areaServed: ORGANIZATION.areaServed,
    sameAs: socialLinks.map((s) => s.url),
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.bio,
    image: AUTHOR.imageUrl,
    url: AUTHOR.url,
    worksFor: { "@id": ORG_ID },
    knowsAbout: [...AUTHOR.knowsAbout],
    hasCredential: AUTHOR.credentials.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c,
    })),
    sameAs: socialLinks.map((s) => s.url),
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: ORGANIZATION.name,
    url: SITE_URL,
    image: ORGANIZATION.logoUrl,
    logo: ORGANIZATION.logoUrl,
    telephone: ORGANIZATION.telephone,
    email: ORGANIZATION.email,
    priceRange: "$",
    address: {
      "@type": "PostalAddress",
      addressLocality: ORGANIZATION.address.addressLocality,
      addressRegion: ORGANIZATION.address.addressRegion,
      addressCountry: ORGANIZATION.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 36.0726,
      longitude: -79.792,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    founder: { "@id": PERSON_ID },
    sameAs: socialLinks.map((s) => s.url),
  };
}

/**
 * Article schema derived entirely from BlogPost frontmatter.
 * No manual per-post schema code required.
 */
export function articleSchemaFromPost(post: BlogPost) {
  const url = abs(`/blog/${post.frontmatter.slug}`);
  const imageUrl = post.frontmatter.image
    ? abs(post.frontmatter.image)
    : `${url}/opengraph-image`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    image: [imageUrl],
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    wordCount: post.wordCount,
    articleSection: post.frontmatter.category ?? "Senior Transitions",
    keywords: post.frontmatter.tags ?? undefined,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
    url,
  };
}

/**
 * Podcast/media schema derived from MediaItem frontmatter.
 */
export function mediaSchemaFromItem(item: MediaItem) {
  const url = abs(`/media/${item.frontmatter.slug}`);
  const imageUrl = item.frontmatter.cover_image || `${url}/opengraph-image`;

  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    name: item.frontmatter.title,
    description: item.frontmatter.excerpt,
    datePublished: item.datePublished,
    dateModified: item.dateModified,
    url,
    image: imageUrl,
    partOfSeries: {
      "@type": "PodcastSeries",
      name: item.frontmatter.podcast,
    },
    actor: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

export type FaqItem = { q: string; a: string };

/**
 * FAQPage schema. Callers pass the same Q/A array they render to JSX, so
 * schema stays in sync with on-page content automatically.
 */
export function faqPageSchema(faqs: FaqItem[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: pageUrl,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export type BreadcrumbCrumb = { name: string; path: string };

/**
 * BreadcrumbList derived from a URL path. Pass the route segments with a
 * human-readable name for each.
 *
 * Example: breadcrumbListSchema([
 *   { name: "Home", path: "/" },
 *   { name: "Blog", path: "/blog" },
 *   { name: post.title, path: `/blog/${post.slug}` },
 * ])
 */
export function breadcrumbListSchema(crumbs: BreadcrumbCrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/**
 * Convenience: derive breadcrumb names from a pathname string. Static routes
 * use their route name; dynamic pages (blog/media) pass a custom label.
 */
export function breadcrumbFromPath(
  pathname: string,
  labelOverrides: Record<string, string> = {}
): BreadcrumbCrumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: BreadcrumbCrumb[] = [{ name: SITE_NAME, path: "/" }];
  let acc = "";
  for (const seg of segments) {
    acc += `/${seg}`;
    const label =
      labelOverrides[acc] ??
      seg
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    crumbs.push({ name: label, path: acc });
  }
  return crumbs;
}

export type JsonLdValue = Record<string, unknown> | Record<string, unknown>[];
