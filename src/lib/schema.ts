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
    // sameAs reinforces the identity graph: same brand on social profiles
    // plus the SeniorSafe marketing site, which is the consumer-facing
    // brand for the family coordination app shipped by RSS LLC.
    sameAs: [
      ...socialLinks.map((s) => s.url),
      "https://seniorsafeapp.com",
    ],
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

/**
 * Product schema for Blueprint Core ($47 DIY course). Mounted on
 * /the-blueprint. Brand/seller derive from ORGANIZATION constants so a name
 * change in lib/site.ts propagates here automatically.
 */
export function blueprintCoreProductSchema() {
  const url = abs("/the-blueprint");
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Blueprint Core",
    description:
      "The Blueprint Core is a $47 DIY course covering the full senior housing transition process. 19 modules, 60+ tools and worksheets, self-paced.",
    brand: { "@type": "Brand", name: ORGANIZATION.name },
    image: abs("/og/the-blueprint.png"),
    url,
    category: "Online Course",
    offers: {
      "@type": "Offer",
      price: "47",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
      priceValidUntil: "2027-12-31",
      seller: { "@id": ORG_ID },
    },
  };
}

/**
 * Product schema for Blueprint Premium ($297 advisory). Mounted on
 * /blueprint-premium.
 */
export function blueprintPremiumProductSchema() {
  const url = abs("/blueprint-premium");
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Blueprint Premium",
    description:
      "Blueprint Premium is everything in Core plus a personalized Senior Transition Plan, a 60-minute 1-on-1 call with Ryan Riggins, and 90 days of email support. $297, one-time, outcome-focused.",
    brand: { "@type": "Brand", name: ORGANIZATION.name },
    image: abs("/og/blueprint-premium.png"),
    url,
    category: "Senior Transition Advisory",
    offers: {
      "@type": "Offer",
      price: "297",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
      priceValidUntil: "2027-12-31",
      seller: { "@id": ORG_ID },
    },
  };
}

/**
 * MobileApplication schema for the SeniorSafe app. Mounted on /seniorsafe-app.
 * Two subscription tiers exposed as Offer[] so Google can surface both prices
 * in rich results. Intentionally omits aggregateRating until legitimate app
 * store reviews exist (faking ratings violates Google's structured data
 * policies).
 */
export function seniorSafeMobileApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "SeniorSafe",
    alternateName: "SeniorSafe App",
    description:
      "SeniorSafe is the family coordination app for senior care. Daily check-ins, medication tracking, family messaging, document vault, and two AI assistants: SeniorSafe AI for the elder, Maggie for the adult child managing the transition.",
    operatingSystem: "iOS, Android, Web",
    applicationCategory: "HealthApplication",
    applicationSubCategory: "Family Coordination",
    url: "https://seniorsafeapp.com",
    downloadUrl:
      "https://apps.apple.com/us/app/seniorsafe-app/id6753033083",
    image: "https://seniorsafeapp.com/og/homepage.png",
    offers: [
      {
        "@type": "Offer",
        name: "SeniorSafe Premium",
        price: "14.99",
        priceCurrency: "USD",
        category: "Subscription",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "14.99",
          priceCurrency: "USD",
          billingDuration: "P1M",
          unitText: "MONTH",
        },
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "SeniorSafe Premium+",
        price: "39.99",
        priceCurrency: "USD",
        category: "Subscription",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "39.99",
          priceCurrency: "USD",
          billingDuration: "P1M",
          unitText: "MONTH",
        },
        availability: "https://schema.org/InStock",
      },
    ],
    creator: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
  };
}

/**
 * ProfessionalService schema for the homepage. Adds local-business signals
 * (geo, areaServed, opening hours, price range) on top of the global
 * Organization + Person schemas emitted from layout.tsx. Helps with
 * "Greensboro senior transition advisor"-style local queries.
 */
export function professionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#professionalservice`,
    name: ORGANIZATION.name,
    description:
      "Senior transition advisory for families navigating elderly parent housing transitions. Education-first consumer protection company.",
    url: SITE_URL,
    telephone: ORGANIZATION.telephone,
    email: ORGANIZATION.email,
    image: abs("/og/homepage.png"),
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
    areaServed: [
      { "@type": "State", name: "North Carolina" },
      { "@type": "Country", name: "United States" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "17:00",
    },
    priceRange: "$$",
    founder: { "@id": PERSON_ID },
    sameAs: socialLinks.map((s) => s.url),
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
