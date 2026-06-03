/**
 * Senior Help Directory registry.
 *
 * Powers the directory hub at /resources/senior-help-directory:
 *   - NATIONAL_ANCHORS render the "Start here (works anywhere)" section.
 *   - DIRECTORY_COUNTIES render the "Find help by county" list AND the hub's
 *     CollectionPage ItemList schema.
 *
 * GROWTH MODEL (intentionally low-friction): adding a county is two steps.
 *   1. Publish the county article as content/blog/<slug>.mdx (it auto-joins
 *      the sitemap + /blog index via the blog pipeline).
 *   2. Add one DIRECTORY_COUNTIES entry below pointing at that blog slug.
 * The hub list + hub schema update automatically. Nothing else to touch.
 *
 * County directory articles deliberately live under /blog (not /resources)
 * so every county page shares one URL namespace with the first one already
 * live (Guilford, shipped June 2026) and inherits the blog route's native
 * Article + BreadcrumbList + FAQPage schema and auto-sitemap.
 */

export type NationalAnchor = {
  /** Program name. */
  name: string;
  /** Phone, short code, or shorthand a reader can act on. */
  contact: string;
  /** Bare domain (no protocol) when the program has a self-service site. */
  url?: string;
  /** One-line plain-English description of what it is for. */
  desc: string;
};

/**
 * Verify-stable national resources that work in any US state. Source of
 * truth mirrors the MASTER directory's national layer. No em-dashes.
 */
export const NATIONAL_ANCHORS: NationalAnchor[] = [
  {
    name: "211",
    contact: "Dial 2-1-1",
    desc: "Free, 24/7, every county. Routes you to rent, utility, food, and medical help near you.",
  },
  {
    name: "Eldercare Locator",
    contact: "1-800-677-1116",
    url: "eldercare.acl.gov",
    desc: "The federal front door to local aging services anywhere in the US.",
  },
  {
    name: "National Elder Fraud Hotline (DOJ)",
    contact: "1-833-372-8311",
    desc: "Report scams or financial exploitation of an older adult and get connected to help.",
  },
  {
    name: "1-800-MEDICARE",
    contact: "1-800-633-4227",
    desc: "Medicare questions, plan help, and fraud reporting.",
  },
  {
    name: "Social Security Administration",
    contact: "1-800-772-1213",
    desc: "Retirement and disability benefits, plus SSI.",
  },
  {
    name: "VA Benefits",
    contact: "1-800-827-1000",
    desc: "Veteran pensions, Aid and Attendance, and survivor benefits.",
  },
  {
    name: "Alzheimer's Association 24/7 Helpline",
    contact: "1-800-272-3900",
    desc: "Around-the-clock support for dementia caregiving.",
  },
  {
    name: "NCOA BenefitsCheckUp",
    contact: "benefitscheckup.org",
    url: "benefitscheckup.org",
    desc: "Screens a senior for every benefit program they may qualify for. A powerful first step.",
  },
  {
    name: "Family Caregiver Alliance",
    contact: "caregiver.org",
    url: "caregiver.org",
    desc: "Caregiver support plus a state-by-state services locator.",
  },
  {
    name: "988 Suicide & Crisis Lifeline",
    contact: "Dial 988",
    desc: "Free, confidential mental health crisis support, any age.",
  },
  {
    name: "Adult Protective Services",
    contact: "Via county DSS or the Eldercare Locator",
    desc: "Report suspected elder abuse, neglect, or exploitation.",
  },
];

export type DirectoryCounty = {
  /** Blog slug of the county directory article (lives at /blog/<slug>). */
  slug: string;
  /** County name, e.g. "Guilford County". */
  county: string;
  /** Two-letter state. */
  state: string;
  /** Metro / cities the county page covers, for the hub label. */
  metro: string;
  /** One-line description for the hub card + ItemList schema. */
  blurb: string;
  /**
   * Optional blog slug of a dedicated property-tax-relief article for this
   * county (some counties have a deeper standalone tax guide). Surfaces a
   * secondary link on the hub card when present.
   */
  taxArticleSlug?: string;
};

/**
 * Live county directory pages, newest counties appended. Order here = order
 * on the hub. Each `slug` must have a published content/blog/<slug>.mdx.
 */
export const DIRECTORY_COUNTIES: DirectoryCounty[] = [
  {
    slug: "guilford-county-senior-help-directory",
    county: "Guilford County",
    state: "NC",
    metro: "Greensboro & High Point",
    blurb:
      "Food, energy, Medicare, home repair, transportation, legal, and caregiver help across Guilford County, plus the three numbers that open most doors.",
    taxArticleSlug: "nc-senior-property-tax-relief-guilford-county",
  },
  {
    slug: "forsyth-county-senior-help-directory",
    county: "Forsyth County",
    state: "NC",
    metro: "Winston-Salem",
    blurb:
      "Winston-Salem and Forsyth County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
];
