/**
 * Site-wide constants. Single source of truth for domain, identity, and
 * brand-facing copy that shows up in schema + metadata.
 *
 * Update once, schema and metadata across the site rebuild automatically.
 */

export const SITE_URL = "https://rigginsstrategicsolutions.com";
export const SITE_NAME = "Riggins Strategic Solutions";

export const SITE_TAGLINE =
  "Senior Transition Advisor Ryan Riggins helps families avoid the $50K mistakes of a senior housing transition.";

export const SITE_DESCRIPTION =
  "Senior Transition Advisor Ryan Riggins helps families avoid the $50K mistakes of a senior housing transition. Not a move manager. Not a listing agent.";

export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: "Riggins Strategic Solutions, LLC",
  url: SITE_URL,
  // Optimized brand asset hosted on /brand/ (106KB vs 4.5MB original at
  // /logo/). Same-origin canonical URL referenced from Org/LocalBusiness/
  // ProfessionalService schemas + Web2 mini-site avatars + directory
  // submissions. NAP_MASTER workbook tracks this as a LOCKED URL.
  logoUrl: `${SITE_URL}/brand/logo-horizontal.png`,
  foundingLocation: "Greensboro, North Carolina",
  address: {
    addressLocality: "Greensboro",
    addressRegion: "NC",
    addressCountry: "US",
  },
  telephone: "+1-336-553-8933",
  email: "ryan@rigginsstrategicsolutions.com",
  areaServed: "United States",
} as const;

export const AUTHOR = {
  name: "Ryan Riggins",
  jobTitle: "Senior Transition Advisor",
  bio: "Licensed NC broker (#361546, eXp Realty). Fiduciary duty to the family, not a pitch. Creator of The Blueprint and SeniorSafe.",
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
