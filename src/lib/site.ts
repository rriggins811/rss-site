/**
 * Site-wide constants. Single source of truth for domain, identity, and
 * brand-facing copy that shows up in schema + metadata.
 *
 * Update once, schema and metadata across the site rebuild automatically.
 */

export const SITE_URL = "https://rigginsstrategicsolutions.com";
export const SITE_NAME = "Riggins Strategic Solutions";

export const SITE_DESCRIPTION =
  "Senior Transition Advisor for the family home: what to do with a parent's house before it's listed. Funding math, who can sign, and sell, rent or keep.";

/**
 * THE ROLE, approved by Ryan 2026-09-19. The title and the definition are used
 * word for word everywhere they appear (home, About, schema, the role page,
 * bylines). Never paraphrase ROLE_DEFINITION; edit it here or not at all.
 */
export const ROLE_TITLE = "Senior Transition Advisor for the family home";

export const ROLE_DEFINITION =
  "A Senior Transition Advisor for the family home helps a family decide what happens to a parent's house before anyone lists it: the funding math against the community's fee sheet, who can legally sign, and sell, rent or keep. If selling, one vetted local agent. Not a mover, not a placement agent, never the listing agent.";

/** Visible byline for answer pages. NC advertising rule: firm name shown. */
export const ROLE_BYLINE =
  "Ryan Riggins, Senior Transition Advisor for the family home, NC broker #361546, eXp Realty";

/**
 * Service area for schema (areaServed). Named cities first, then the
 * nationwide note: outside these markets families are served through vetted
 * partner agents.
 */
const NC_CITIES = [
  "Greensboro",
  "Winston-Salem",
  "High Point",
  "Burlington",
  "Asheboro",
  "Lexington",
  "Thomasville",
  "Kernersville",
  "Raleigh",
  "Durham",
  "Cary",
  "Chapel Hill",
] as const;
const SC_CITIES = ["Myrtle Beach", "Conway", "Georgetown"] as const;

export const SERVICE_AREA = [
  {
    "@type": "Place",
    name: "Piedmont Triad, North Carolina",
    containedInPlace: { "@type": "State", name: "North Carolina" },
  },
  {
    "@type": "Place",
    name: "Research Triangle, North Carolina",
    containedInPlace: { "@type": "State", name: "North Carolina" },
  },
  { "@type": "State", name: "North Carolina" },
  ...NC_CITIES.map((name) => ({
    "@type": "City",
    name: `${name}, NC`,
    containedInPlace: { "@type": "State", name: "North Carolina" },
  })),
  ...SC_CITIES.map((name) => ({
    "@type": "City",
    name: `${name}, SC`,
    containedInPlace: { "@type": "State", name: "South Carolina" },
  })),
  {
    "@type": "Country",
    name: "United States",
    description:
      "Families anywhere in the United States, served through vetted partner agents.",
  },
];

export const ORGANIZATION = {
  name: SITE_NAME,
  // Riggins Strategic Solutions is a d/b/a of Riggins Properties LLC, not an
  // LLC of its own. Ryan's call 2026-09-19, corrected 2026-09-21: ONE public
  // phone, and ONE published address, which is the MAILING address in
  // Raleigh. Ryan is based in Greensboro (he works from home there, no public
  // office yet) and works in Raleigh, statewide and nationwide. `address` is
  // the mailing address in schema parts; `mailingAddress` is an alias for
  // older callers. Label it "Mailing address" in visible copy. Never publish
  // a Greensboro street address or a second phone line.
  legalName: "Riggins Properties LLC",
  legalLine: "Riggins Properties LLC d/b/a Riggins Strategic Solutions",
  mailingAddress: {
    streetAddress: "4030 Wake Forest Rd Ste 349",
    addressLocality: "Raleigh",
    addressRegion: "NC",
    postalCode: "27609",
    addressCountry: "US",
  },
  mailingAddressLine: "4030 Wake Forest Rd Ste 349, Raleigh, NC 27609",
  url: SITE_URL,
  // Optimized brand asset hosted on /brand/ (106KB vs 4.5MB original at
  // /logo/). Same-origin canonical URL referenced from Org/LocalBusiness/
  // ProfessionalService schemas + Web2 mini-site avatars + directory
  // submissions. NAP_MASTER workbook tracks this as a LOCKED URL.
  logoUrl: `${SITE_URL}/brand/logo-horizontal.png`,
  foundingLocation: "Greensboro, North Carolina",
  address: {
    streetAddress: "4030 Wake Forest Rd Ste 349",
    addressLocality: "Raleigh",
    addressRegion: "NC",
    postalCode: "27609",
    addressCountry: "US",
  },
  /** Where Ryan is based, for "based in" copy. Not the mailing address. */
  baseCityState: "Greensboro, NC",
  telephone: "+1-336-553-8933",
  /** The one public phone, display form. */
  telephoneDisplay: "(336) 553-8933",
  email: "ryan@rigginsstrategicsolutions.com",
  areaServed: "United States",
} as const;

export const AUTHOR = {
  name: "Ryan Riggins",
  jobTitle: ROLE_TITLE,
  bio: "Licensed NC broker (#361546, eXp Realty). Fiduciary duty to the family, not a pitch. Creator of The Blueprint and Hammock365.",
  // Optimized headshot hosted on /brand/ (69KB vs 5.3MB original at
  // /photos/). Same-origin canonical URL used by Person schema (sitewide
  // via layout.tsx) + Web2 mini-site avatars + Amazon Author Central /
  // Goodreads author profile pictures. NAP_MASTER tracks as LOCKED URL.
  imageUrl: `${SITE_URL}/brand/ryan-headshot.jpg`,
  url: `${SITE_URL}/about`,
  knowsAbout: [
    "Senior housing transitions",
    "Aging in place decisions",
    "Family caregiving coordination",
    "Senior downsizing",
    "Consumer protection for aging homeowners",
    "Wholesaler and investor protection",
    "North Carolina real estate",
    "Estate preparation for transition",
  ],
  credentials: [
    "North Carolina Real Estate Broker License #361546",
    "eXp Realty",
  ],
} as const;

/**
 * Absolute-URL builder. Handy for OG images, sitemap, and schema.
 */
export function abs(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Page title with the site-name suffix only when it fits. The root layout
 * template appends " | Riggins Strategic Solutions" (30 characters). Google
 * cuts titles at about 60, so a long question title loses the brand and its
 * own ending. When the full title would run past 60 characters, return the
 * base title alone (absolute, so the template is skipped). SEO audit
 * 2026-09-19. H1s and slugs are not affected.
 */
export const MAX_TITLE_LENGTH = 60;

export function pageTitle(base: string): string | { absolute: string } {
  return `${base} | ${SITE_NAME}`.length <= MAX_TITLE_LENGTH
    ? base
    : { absolute: base };
}
