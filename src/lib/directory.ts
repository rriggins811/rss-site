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
    name: "National Association of Senior Move Managers (NASMM)",
    contact: "nasmm.org",
    url: "nasmm.org/find-a-move-manager",
    desc: "The national association for senior move managers. Use its Find a Senior Move Manager directory to locate a vetted, accredited move manager for downsizing, sorting, packing, and the physical move.",
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
  /**
   * Optional metro/region label (e.g. "Triad", "Triangle"). When counties in
   * a state carry regions, the state page groups them under region headings
   * for readability. Omit for states/counties that do not need grouping.
   */
  region?: string;
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
    region: "Triad",
    blurb:
      "Food, energy, Medicare, home repair, transportation, legal, and caregiver help across Guilford County, plus the three numbers that open most doors.",
    taxArticleSlug: "nc-senior-property-tax-relief-guilford-county",
  },
  {
    slug: "forsyth-county-senior-help-directory",
    county: "Forsyth County",
    state: "NC",
    metro: "Winston-Salem",
    region: "Triad",
    blurb:
      "Winston-Salem and Forsyth County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "alamance-county-senior-help-directory",
    county: "Alamance County",
    state: "NC",
    metro: "Burlington",
    region: "Triad",
    blurb:
      "Burlington and Alamance County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "randolph-county-senior-help-directory",
    county: "Randolph County",
    state: "NC",
    metro: "Asheboro",
    region: "Triad",
    blurb:
      "Asheboro and Randolph County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "davidson-county-senior-help-directory",
    county: "Davidson County",
    state: "NC",
    metro: "Lexington",
    region: "Triad",
    blurb:
      "Lexington, Thomasville, and Davidson County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "rockingham-county-senior-help-directory",
    county: "Rockingham County",
    state: "NC",
    metro: "Reidsville",
    region: "Triad",
    blurb:
      "Reidsville, Eden, and Rockingham County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "davie-county-senior-help-directory",
    county: "Davie County",
    state: "NC",
    metro: "Mocksville",
    region: "Triad",
    blurb:
      "Mocksville and Davie County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "cabarrus-county-senior-help-directory",
    county: "Cabarrus County",
    state: "NC",
    metro: "Concord",
    region: "Charlotte",
    blurb:
      "Concord, Kannapolis, and Cabarrus County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "union-county-senior-help-directory",
    county: "Union County",
    state: "NC",
    metro: "Monroe",
    region: "Charlotte",
    blurb:
      "Monroe and Union County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "gaston-county-senior-help-directory",
    county: "Gaston County",
    state: "NC",
    metro: "Gastonia",
    region: "Charlotte",
    blurb:
      "Gastonia and Gaston County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "iredell-county-senior-help-directory",
    county: "Iredell County",
    state: "NC",
    metro: "Statesville",
    region: "Charlotte",
    blurb:
      "Statesville, Mooresville, and Iredell County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "wake-county-senior-help-directory",
    county: "Wake County",
    state: "NC",
    metro: "Raleigh",
    region: "Triangle",
    blurb:
      "Raleigh and Wake County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "durham-county-senior-help-directory",
    county: "Durham County",
    state: "NC",
    metro: "Durham",
    region: "Triangle",
    blurb:
      "Durham County programs for seniors and families, including the county Low-Income Homeowner's Relief tax program: food, utilities, Medicare, transportation, legal, and caregiver support.",
  },
  {
    slug: "orange-county-senior-help-directory",
    county: "Orange County",
    state: "NC",
    metro: "Chapel Hill & Hillsborough",
    region: "Triangle",
    blurb:
      "Chapel Hill, Hillsborough, and Orange County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "johnston-county-senior-help-directory",
    county: "Johnston County",
    state: "NC",
    metro: "Smithfield",
    region: "Triangle",
    blurb:
      "Smithfield, Clayton, and Johnston County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "chatham-county-senior-help-directory",
    county: "Chatham County",
    state: "NC",
    metro: "Pittsboro",
    region: "Triangle",
    blurb:
      "Pittsboro, Siler City, and Chatham County programs for seniors and families: food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "mecklenburg-county-senior-help-directory",
    county: "Mecklenburg County",
    state: "NC",
    metro: "Charlotte",
    region: "Charlotte",
    blurb:
      "Charlotte and Mecklenburg County programs for seniors and families, including free tax-relief application help: food, utilities, Medicare, transportation, legal, and caregiver support.",
  },
  {
    slug: "greenville-county-sc-senior-help-directory",
    county: "Greenville County",
    state: "SC",
    metro: "Greenville",
    region: "Upstate",
    blurb:
      "Greenville and Upstate South Carolina programs for seniors and families: the SC Homestead Exemption, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and PACE.",
  },
  {
    slug: "york-county-sc-senior-help-directory",
    county: "York County",
    state: "SC",
    metro: "Rock Hill",
    region: "Rock Hill",
    blurb:
      "Rock Hill and York County, SC programs for seniors and families: the SC Homestead Exemption, food, utilities, Medicare, home repair, transportation, legal, and caregiver support.",
  },
  {
    slug: "richland-county-sc-senior-help-directory",
    county: "Richland County",
    state: "SC",
    metro: "Columbia",
    region: "Midlands",
    blurb:
      "Columbia and Midlands South Carolina programs for seniors and families: the SC Homestead Exemption, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and PACE.",
  },
  {
    slug: "charleston-county-sc-senior-help-directory",
    county: "Charleston County",
    state: "SC",
    metro: "Charleston",
    region: "Lowcountry",
    blurb:
      "Charleston and Lowcountry South Carolina programs for seniors and families: the SC Homestead Exemption, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and PACE.",
  },
  {
    slug: "horry-county-sc-senior-help-directory",
    county: "Horry County",
    state: "SC",
    metro: "Myrtle Beach",
    region: "Grand Strand",
    blurb:
      "Myrtle Beach, Conway, and the Grand Strand, SC programs for seniors and families: the SC Homestead Exemption, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and PACE.",
  },
  {
    slug: "spartanburg-county-sc-senior-help-directory",
    county: "Spartanburg County",
    state: "SC",
    metro: "Spartanburg",
    region: "Upstate",
    blurb:
      "Spartanburg and Upstate South Carolina programs for seniors and families: the SC Homestead Exemption, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and PACE.",
  },
  {
    slug: "beaufort-county-sc-senior-help-directory",
    county: "Beaufort County",
    state: "SC",
    metro: "Hilton Head",
    region: "Lowcountry",
    blurb:
      "Hilton Head, Bluffton, and Beaufort, SC programs for seniors and families: the SC Homestead Exemption, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and PACE.",
  },
  {
    slug: "fulton-county-ga-senior-help-directory",
    county: "Fulton County",
    state: "GA",
    metro: "Atlanta",
    region: "Atlanta",
    blurb:
      "Atlanta and metro Georgia programs for seniors and families: the county's large senior homestead exemptions, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and PACE.",
  },
  {
    slug: "dekalb-county-ga-senior-help-directory",
    county: "DeKalb County",
    state: "GA",
    metro: "Atlanta",
    region: "Atlanta",
    blurb:
      "Decatur and Atlanta, GA programs for seniors and families: the county's deep senior exemptions (H3 through H9), food, utilities, Medicare, home repair, transportation, legal, caregiver support, and PACE status.",
  },
  {
    slug: "chatham-county-ga-senior-help-directory",
    county: "Chatham County",
    state: "GA",
    metro: "Savannah",
    region: "Coastal Georgia",
    blurb:
      "Savannah, GA programs for seniors and families: the Stephens-Day value freeze, the new voter-approved school-tax exemption, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and PACE status.",
  },
  {
    slug: "richmond-county-ga-senior-help-directory",
    county: "Richmond County",
    state: "GA",
    metro: "Augusta",
    region: "CSRA",
    blurb:
      "Augusta, GA programs for seniors and families: the county's senior homestead exemptions including a full school-tax break at 65, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and PACE status.",
  },
  {
    slug: "muscogee-county-ga-senior-help-directory",
    county: "Muscogee County",
    state: "GA",
    metro: "Columbus",
    region: "West Georgia",
    blurb:
      "Columbus, GA programs for seniors and families: the county's senior homestead exemptions including a local senior school-tax break, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and PACE status.",
  },
  {
    slug: "davidson-county-tn-senior-help-directory",
    county: "Davidson County",
    state: "TN",
    metro: "Nashville",
    region: "Middle Tennessee",
    blurb:
      "Nashville, TN programs for seniors and families: property tax relief and freeze through the Metro Trustee, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and TennCare CHOICES.",
  },
  {
    slug: "williamson-county-tn-senior-help-directory",
    county: "Williamson County",
    state: "TN",
    metro: "Franklin",
    region: "Middle Tennessee",
    blurb:
      "Franklin, TN programs for seniors and families: the county's three property tax programs through the Trustee, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and TennCare CHOICES.",
  },
  {
    slug: "shelby-county-tn-senior-help-directory",
    county: "Shelby County",
    state: "TN",
    metro: "Memphis",
    region: "West Tennessee",
    blurb:
      "Memphis, TN programs for seniors and families: property tax relief and freeze through the County Trustee plus the separate City of Memphis program, MIFA Meals on Wheels, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and TennCare CHOICES.",
  },
  {
    slug: "knox-county-tn-senior-help-directory",
    county: "Knox County",
    state: "TN",
    metro: "Knoxville",
    region: "East Tennessee",
    blurb:
      "Knoxville, TN programs for seniors and families: property tax relief and the senior tax freeze through the County Trustee, Mobile Meals, food, utilities, Medicare, home repair, transportation, legal, caregiver support, and TennCare CHOICES.",
  },
];

export type DirectoryState = {
  /** Two-letter postal code, matches DirectoryCounty.state. */
  code: string;
  /** Full state name. */
  name: string;
  /** URL slug for /resources/senior-help-directory/<slug>. */
  slug: string;
  /**
   * Set true once the state's content file has been enriched with verified,
   * state-specific data (real program names, figures, sources). Flips the page
   * from noindex to indexed + adds it to the sitemap even before it has county
   * pages. States gain indexing either via this flag OR via a county page
   * (stateHasCounties). Leave unset for the thin, locator-only placeholders.
   */
  indexable?: boolean;
};

/**
 * Every US state + DC. The directory is organized National -> State -> County.
 * A state page exists for each entry below, but only states that actually have
 * county pages are indexed + added to the sitemap (see hasCounties / the
 * county-driven sitemap + per-page robots noindex). Empty state pages still
 * render the national resources as a statewide fallback, so they are useful,
 * not thin doorways. As we add a county in a new state, that state flips to
 * indexed automatically. Names + slugs only; no em-dashes.
 */
export const DIRECTORY_STATES: DirectoryState[] = [
  { code: "AL", name: "Alabama", slug: "alabama", indexable: true },
  { code: "AK", name: "Alaska", slug: "alaska", indexable: true },
  { code: "AZ", name: "Arizona", slug: "arizona", indexable: true },
  { code: "AR", name: "Arkansas", slug: "arkansas", indexable: true },
  { code: "CA", name: "California", slug: "california", indexable: true },
  { code: "CO", name: "Colorado", slug: "colorado", indexable: true },
  { code: "CT", name: "Connecticut", slug: "connecticut", indexable: true },
  { code: "DE", name: "Delaware", slug: "delaware", indexable: true },
  { code: "DC", name: "District of Columbia", slug: "district-of-columbia", indexable: true },
  { code: "FL", name: "Florida", slug: "florida", indexable: true },
  { code: "GA", name: "Georgia", slug: "georgia", indexable: true },
  { code: "HI", name: "Hawaii", slug: "hawaii", indexable: true },
  { code: "ID", name: "Idaho", slug: "idaho", indexable: true },
  { code: "IL", name: "Illinois", slug: "illinois", indexable: true },
  { code: "IN", name: "Indiana", slug: "indiana", indexable: true },
  { code: "IA", name: "Iowa", slug: "iowa", indexable: true },
  { code: "KS", name: "Kansas", slug: "kansas", indexable: true },
  { code: "KY", name: "Kentucky", slug: "kentucky", indexable: true },
  { code: "LA", name: "Louisiana", slug: "louisiana", indexable: true },
  { code: "ME", name: "Maine", slug: "maine", indexable: true },
  { code: "MD", name: "Maryland", slug: "maryland", indexable: true },
  { code: "MA", name: "Massachusetts", slug: "massachusetts", indexable: true },
  { code: "MI", name: "Michigan", slug: "michigan", indexable: true },
  { code: "MN", name: "Minnesota", slug: "minnesota", indexable: true },
  { code: "MS", name: "Mississippi", slug: "mississippi", indexable: true },
  { code: "MO", name: "Missouri", slug: "missouri", indexable: true },
  { code: "MT", name: "Montana", slug: "montana", indexable: true },
  { code: "NE", name: "Nebraska", slug: "nebraska", indexable: true },
  { code: "NV", name: "Nevada", slug: "nevada", indexable: true },
  { code: "NH", name: "New Hampshire", slug: "new-hampshire", indexable: true },
  { code: "NJ", name: "New Jersey", slug: "new-jersey", indexable: true },
  { code: "NM", name: "New Mexico", slug: "new-mexico", indexable: true },
  { code: "NY", name: "New York", slug: "new-york", indexable: true },
  { code: "NC", name: "North Carolina", slug: "north-carolina" },
  { code: "ND", name: "North Dakota", slug: "north-dakota", indexable: true },
  { code: "OH", name: "Ohio", slug: "ohio", indexable: true },
  { code: "OK", name: "Oklahoma", slug: "oklahoma", indexable: true },
  { code: "OR", name: "Oregon", slug: "oregon", indexable: true },
  { code: "PA", name: "Pennsylvania", slug: "pennsylvania", indexable: true },
  { code: "RI", name: "Rhode Island", slug: "rhode-island", indexable: true },
  { code: "SC", name: "South Carolina", slug: "south-carolina", indexable: true },
  { code: "SD", name: "South Dakota", slug: "south-dakota", indexable: true },
  { code: "TN", name: "Tennessee", slug: "tennessee", indexable: true },
  { code: "TX", name: "Texas", slug: "texas", indexable: true },
  { code: "UT", name: "Utah", slug: "utah", indexable: true },
  { code: "VT", name: "Vermont", slug: "vermont", indexable: true },
  { code: "VA", name: "Virginia", slug: "virginia", indexable: true },
  { code: "WA", name: "Washington", slug: "washington", indexable: true },
  { code: "WV", name: "West Virginia", slug: "west-virginia", indexable: true },
  { code: "WI", name: "Wisconsin", slug: "wisconsin", indexable: true },
  { code: "WY", name: "Wyoming", slug: "wyoming", indexable: true },
];

/** Counties published under a given state code, in registry order. */
export function countiesForState(stateCode: string): DirectoryCounty[] {
  return DIRECTORY_COUNTIES.filter((c) => c.state === stateCode);
}

/** A state has at least one published county page. */
export function stateHasCounties(stateCode: string): boolean {
  return DIRECTORY_COUNTIES.some((c) => c.state === stateCode);
}

/** Look up a state by its URL slug. */
export function stateBySlug(slug: string): DirectoryState | undefined {
  return DIRECTORY_STATES.find((s) => s.slug === slug);
}

/** States that currently have county pages. */
export function statesWithCounties(): DirectoryState[] {
  return DIRECTORY_STATES.filter((s) => stateHasCounties(s.code));
}

/**
 * States safe to index + sitemap: either enriched with verified state-specific
 * content (indexable flag) or backed by at least one county page. The thin,
 * locator-only placeholder states are excluded until they earn one of those.
 */
export function indexableStates(): DirectoryState[] {
  return DIRECTORY_STATES.filter(
    (s) => s.indexable || stateHasCounties(s.code)
  );
}

/** Whether a single state page should be indexed. */
export function isStateIndexable(state: DirectoryState): boolean {
  return Boolean(state.indexable) || stateHasCounties(state.code);
}
