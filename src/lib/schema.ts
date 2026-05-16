/**
 * JSON-LD schema generators.
 *
 * Every value here auto-derives from /lib/site.ts constants or from post/media
 * frontmatter. Changing content updates schema on next build. Never hardcode
 * values per page.
 */

import { socialLinks, additionalSameAs } from "@/lib/social";
import { AUTHOR, ORGANIZATION, SITE_NAME, SITE_URL, abs } from "@/lib/site";
import type { BlogPost, HowToStep } from "@/lib/blog";
import type { MediaItem } from "@/lib/media";

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#ryan-riggins`;
const LOGO_ID = `${SITE_URL}/#logo`;

/**
 * WebSite schema with SearchAction. Enables the Google sitelinks search box
 * rich result for branded queries like "riggins strategic solutions [thing]".
 * Mounted sitewide via layout.tsx.
 *
 * The SearchAction `target` template uses /blog?q={search_term_string} — the
 * blog page reads `?q=` and filters posts by title + excerpt + tag match.
 * Even without the filter, the URL is valid (just shows the unfiltered blog
 * index), so the schema is safe to ship before/independent of the search UI.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

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
    // sameAs reinforces the identity graph: same brand on social profiles,
    // the SeniorSafe marketing site (consumer brand for the app shipped by
    // RSS LLC), and any additional org-only profiles from
    // social.ts:additionalSameAs (LinkedIn Company page, future Substack /
    // Medium publication URLs, etc.) that don't render as footer icons.
    sameAs: [
      ...socialLinks.map((s) => s.url),
      "https://seniorsafeapp.com",
      ...additionalSameAs.org,
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
    // socialLinks (rendered in footer) + person-only additionalSameAs
    // (Amazon Author Central, Goodreads, X, Bluesky once claimed).
    sameAs: [
      ...socialLinks.map((s) => s.url),
      ...additionalSameAs.person,
    ],
  };
}

/**
 * Enriched Person schema mounted ON the /about page (in addition to the
 * baseline `personSchema()` emitted sitewide from layout.tsx). Adds
 * occupation, alumni, birth year, and award scaffolds — the strongest
 * E-E-A-T signal short of major-outlet citation.
 *
 * Uses the same @id as personSchema() so the two entries merge into a
 * single Person entity in the graph rather than creating a duplicate.
 *
 * Award + alumniOf populate from `lib/site.ts:AUTHOR` if/when populated;
 * the prompt's spec said "leave award empty until Ryan has credentials" —
 * the array is intentionally empty in AUTHOR for now and this factory
 * just passes it through.
 */
export function enrichedPersonSchema() {
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
    hasOccupation: {
      "@type": "Occupation",
      name: "Senior Transition Advisor",
      occupationLocation: {
        "@type": "City",
        name: `${ORGANIZATION.address.addressLocality}, ${ORGANIZATION.address.addressRegion}`,
      },
      skills: [...AUTHOR.knowsAbout].join(", "),
    },
    // birthDate as year only — keeps schema accurate for entity
    // disambiguation without exposing the full date publicly.
    // Per Round 2 prompt spec: "1990 only (don't expose full date)".
    birthDate: "1990",
    // alumniOf from LinkedIn per Round 2 prompt spec.
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Sandhills Community College",
    },
    // award stays empty until Ryan has earned credentials worth listing.
    // Examples Google accepts: "Top 1% NC Realtors 2026", "Senior Transition
    // Specialist Certification", broker-of-the-year awards, etc.
    award: [],
    sameAs: [
      ...socialLinks.map((s) => s.url),
      ...additionalSameAs.person,
    ],
  };
}

/**
 * Review schema for a client testimonial. Mounted on /about (or wherever
 * the testimonial is visually rendered — Google's "schema must match
 * visible content" rule).
 *
 * Callers pass an array of typed Review entries. The factory wraps each
 * one with the right `itemReviewed` reference to the RSS ProfessionalService
 * entity. Returns a single schema array so layout.tsx can mount it via
 * one <JsonLd> tag.
 *
 * IMPORTANT: per the Round 2 prompt — do NOT fabricate reviews. Empty
 * array = no Review schema emitted. Add real reviews only.
 */
export type ClientReview = {
  authorName: string;
  ratingValue: 1 | 2 | 3 | 4 | 5;
  reviewBody: string;
  /** ISO date or year (YYYY or YYYY-MM-DD). */
  datePublished: string;
  /** Optional — where the review originated. e.g. "Google". */
  publisher?: string;
};

export function clientReviewsSchema(reviews: ClientReview[]) {
  if (reviews.length === 0) return null;
  return reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    // itemReviewed needs @type + @id (not @id alone) — Google's Review
    // snippet validator treats bare-@id references as `Thing`, which fails
    // the "must be a concrete reviewable type" rule (LocalBusiness,
    // Organization, Product, SoftwareApplication, etc.). Explicit @type
    // lets Google resolve the type without graph-walking, and @id still
    // links it to the canonical ProfessionalService entity emitted from
    // the homepage so the graph stays connected. `name` is optional per
    // Google but recommended — gives the review snippet display text.
    itemReviewed: {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#professionalservice`,
      name: ORGANIZATION.name,
    },
    author: { "@type": "Person", name: r.authorName },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(r.ratingValue),
      bestRating: "5",
    },
    reviewBody: r.reviewBody,
    datePublished: r.datePublished,
    ...(r.publisher
      ? { publisher: { "@type": "Organization", name: r.publisher } }
      : {}),
  }));
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
    sameAs: [
      ...socialLinks.map((s) => s.url),
      ...additionalSameAs.org,
    ],
  };
}

/**
 * CSS selectors carrying voice-readable content sitewide. The selector list
 * is consumed by SpeakableSpecification embedded in Article + HowTo schemas
 * below. Adding a new speakable region anywhere on the site is a one-line
 * edit here — no per-page schema changes needed.
 *
 * Components that contribute:
 *   - QuickAnswer (`aeo-speakable-quickanswer` on its wrapper)
 *   - FAQSection (`aeo-speakable-faq` on each Q+A item)
 *
 * Per Google's docs, Speakable is currently a limited-rollout feature
 * intended for news-style content. Limiting the property to Article + HowTo
 * (and not Product / MobileApplication pages) keeps us inside the intended
 * use case so we don't get flagged as schema spam.
 */
const SPEAKABLE_SELECTORS = [
  ".aeo-speakable-quickanswer",
  ".aeo-speakable-faq",
];

function speakableSpec() {
  return {
    "@type": "SpeakableSpecification",
    cssSelector: SPEAKABLE_SELECTORS,
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
    speakable: speakableSpec(),
    // All blog posts are free to read — explicit so AI assistants can
    // confidently cite without "paywalled" hedging.
    isAccessibleForFree: true,
  };
}

/**
 * HowTo schema for procedural blog posts. Opt-in per post via the
 * `schemaType: "HowTo"` frontmatter field; the [slug] route emits this
 * instead of articleSchemaFromPost when present.
 *
 * Steps come from the post's `howToSteps` frontmatter array. AI assistants
 * (Perplexity, ChatGPT browse, Google AI Overviews) pull HowTo step text
 * directly into answer panels, so step text should be self-contained and
 * actionable — not "click here to read more."
 *
 * See docs/blog-schema-types.md for authoring guidance + the conversion
 * checklist used to qualify a post as HowTo-eligible.
 */
export function howToSchemaFromPost(
  post: BlogPost,
  steps: HowToStep[],
  totalTime?: string
) {
  const url = abs(`/blog/${post.frontmatter.slug}`);
  const imageUrl = post.frontmatter.image
    ? abs(post.frontmatter.image)
    : `${url}/opengraph-image`;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    image: [imageUrl],
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    speakable: speakableSpec(),
    isAccessibleForFree: true,
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${url}#step-${i + 1}`,
      ...(s.duration ? { performTime: s.duration } : {}),
    })),
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
 *
 * `isAccessibleForFree: false` helps AI assistants route "free version of"
 * vs "paid version of" queries to the right entity. Pair tag with
 * /freeguide which is `true` (sitewide WebPage default).
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
    isAccessibleForFree: false,
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
    isAccessibleForFree: false,
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
    // Paid app with a 14-day free trial. The trial doesn't make the app
    // "free" for schema purposes — the Offers below are the truth.
    isAccessibleForFree: false,
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
    sameAs: [
      ...socialLinks.map((s) => s.url),
      ...additionalSameAs.org,
    ],
  };
}

/**
 * CollectionPage + ItemList schema for hub pages like /guides, /tools,
 * /resources. Pass the items the page actually links to. Google treats
 * ItemList as a strong topical-cluster signal; pointing 6 placeholder
 * items at the same URL gets flagged as low-quality, so callers should
 * pass real distinct itemUrls.
 */
export type CollectionItem = {
  name: string;
  itemUrl: string;
  description?: string;
};

export function collectionPageSchema(args: {
  name: string;
  description: string;
  pageUrl: string;
  items: CollectionItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: args.name,
    description: args.description,
    url: args.pageUrl,
    isPartOf: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
    // Hub pages like /guides + /tools surface free interactive resources —
    // explicit flag so AI tools route "free tools for X" queries here.
    isAccessibleForFree: true,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: args.items.length,
      itemListElement: args.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: it.itemUrl,
        ...(it.description ? { description: it.description } : {}),
      })),
    },
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
