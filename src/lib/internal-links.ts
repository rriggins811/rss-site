/**
 * Typed internal-linking registry.
 *
 * Groups tools, blog posts, and resource articles into topical clusters so a
 * page in one cluster can surface related pages in the same cluster without
 * each page hard-coding its own related-link list. This is the topical-
 * authority graph Google uses to decide which of several competing pages
 * in a topic should rank.
 *
 * Adding a cluster:
 *   1. Add a new entry to CLUSTERS keyed by a stable cluster id
 *   2. List the cluster's tools, blog posts (by slug), and resources (by slug)
 *   3. Optionally tag a pillar URL (the canonical "X 101" page in the topic)
 *
 * Resolving cluster siblings:
 *   - getClusterFor(toolSlug | blogSlug | resourceSlug) returns the cluster
 *   - getRelatedFor(currentSlug, currentType, limit) returns the most relevant
 *     siblings, excluding the current page, capped at `limit`
 *
 * Used by:
 *   - <RelatedReading> on tool pages (mounted on the 3 SEO-optimized tools)
 *   - Future blog-post "Related reading" footers (TODO when blog [slug]
 *     wants the same treatment)
 */

export type ClusterTopic =
  | "selling-parents-home"
  | "caregiver-burnout"
  | "medicare-coverage-gaps"
  | "aging-in-place-vs-assisted-living"
  | "crisis-response"
  | "elder-fraud-and-predatory-buyers"
  | "senior-transition-fundamentals"
  | "long-term-care-funding-policy";

export type ClusterMember =
  | { type: "tool"; slug: string }
  | { type: "blog"; slug: string }
  | { type: "resource"; slug: string };

export type Cluster = {
  id: ClusterTopic;
  /** Human-readable label rendered on the page. */
  label: string;
  /** Optional pillar page slug — the canonical "X 101" article in the topic. */
  pillar?: ClusterMember;
  members: ClusterMember[];
};

export const CLUSTERS: Cluster[] = [
  {
    id: "selling-parents-home",
    label: "Selling a parent's home",
    members: [
      { type: "tool", slug: "net-proceeds-calculator" },
      { type: "resource", slug: "how-to-sell-elderly-parents-house" },
      { type: "resource", slug: "power-of-attorney-selling-parents-home" },
      { type: "resource", slug: "how-to-talk-to-mom-about-selling-house" },
      { type: "blog", slug: "quitclaim-deed-fraud-protect-parents-home" },
      { type: "blog", slug: "they-stole-the-house-while-the-family-was-grieving" },
      { type: "blog", slug: "how-a-1-8-million-estate-got-stolen-with-a-signature" },
    ],
  },
  {
    id: "caregiver-burnout",
    label: "Caregiver burnout in the sandwich generation",
    members: [
      { type: "tool", slug: "caregiver-burnout-triage" },
      {
        type: "blog",
        slug: "78-of-family-caregivers-are-burning-out-heres-what-nobody-tells-you-before-it-happens",
      },
      {
        type: "blog",
        slug: "the-324000-mistake-nobody-warns-caregivers-about",
      },
      {
        type: "blog",
        slug: "why-group-texts-dont-work-for-senior-transitions-and-what-to-use-instead",
      },
    ],
  },
  {
    id: "medicare-coverage-gaps",
    label: "Medicare coverage gaps and decoding the system",
    members: [
      { type: "tool", slug: "medicare-gap-analyzer" },
      {
        type: "blog",
        slug: "medicare-inpatient-vs-observation-status-2026",
      },
      { type: "blog", slug: "medicare-observation-status-trap" },
      {
        type: "blog",
        slug: "the-first-72-hours-after-your-parent-falls-what-nobody-tells-you",
      },
      { type: "resource", slug: "medicare-vs-medicaid-senior-care" },
    ],
  },
  {
    id: "aging-in-place-vs-assisted-living",
    label: "Aging in place vs assisted living decisions",
    members: [
      { type: "tool", slug: "aging-in-place-break-even" },
      {
        type: "blog",
        slug: "the-20000-monthly-blind-spot-why-aging-in-place-might-be-your-most-expensive-mistake",
      },
      {
        type: "blog",
        slug: "the-50000-renovation-trap-why-aging-in-place-is-often-a-costly-financial-mistake",
      },
      { type: "resource", slug: "assisted-living-vs-memory-care-difference" },
      { type: "resource", slug: "cost-of-assisted-living-in-2026" },
    ],
  },
  {
    id: "crisis-response",
    label: "Crisis response: when something happens fast",
    members: [
      {
        type: "blog",
        slug: "the-first-72-hours-after-your-parent-falls-what-nobody-tells-you",
      },
      {
        type: "blog",
        slug: "nursing-home-staffing-rule-repealed-what-families-need-to-ask",
      },
    ],
  },
  {
    id: "elder-fraud-and-predatory-buyers",
    label: "Elder fraud, scams, and predatory cash buyers",
    members: [
      {
        type: "blog",
        slug: "doj-2025-annual-report-elder-fraud-2-billion-2024",
      },
      { type: "blog", slug: "quitclaim-deed-fraud-protect-parents-home" },
      { type: "blog", slug: "they-stole-the-house-while-the-family-was-grieving" },
      { type: "blog", slug: "how-a-1-8-million-estate-got-stolen-with-a-signature" },
      { type: "resource", slug: "wholesaler-scams-targeting-seniors" },
    ],
  },
  {
    // Big-picture orientation cluster — claims the "adult-child guide"
    // post as pillar since it's the most comprehensive overview piece
    // (1,980 words, the longest post in the library). Pairs it with the
    // other broad-overview/listicle posts that don't fit a single
    // narrow topic. New post bucket: anything that's "intro to senior
    // transitions" goes here unless a more specific cluster fits better.
    id: "senior-transition-fundamentals",
    label: "Senior transition fundamentals",
    pillar: {
      type: "blog",
      slug: "the-adult-childs-guide-to-mastering-a-senior-housing-transition-without-the-chaos",
    },
    members: [
      {
        type: "blog",
        slug: "the-adult-childs-guide-to-mastering-a-senior-housing-transition-without-the-chaos",
      },
      {
        type: "blog",
        slug: "the-starting-point-fallacy-5-surprising-realities-of-navigating-a-senior-move-without-losing-your-mind-or-your-savings",
      },
      {
        type: "blog",
        slug: "the-50000-transition-trap-5-surprising-truths-about-navigating-a-senior-move-without-the-chaos",
      },
      {
        type: "blog",
        slug: "navigating-your-aging-parents-senior-housing-transition",
      },
      {
        type: "blog",
        slug: "free-tools-to-help-your-family-assess-senior-transition-readiness-1",
      },
    ],
  },
  {
    // State-level long-term care funding policy. Anchors on Washington
    // (first state with public LTC benefits) + Massachusetts disclosure
    // rules — both state-specific policy explainers that don't fit the
    // tactical/personal clusters. Add new state-policy posts here as
    // they ship.
    id: "long-term-care-funding-policy",
    label: "Long-term care funding by state",
    members: [
      {
        type: "blog",
        slug: "washington-wa-cares-fund-first-state-long-term-care-benefits",
      },
      {
        type: "blog",
        slug: "massachusetts-assisted-living-disclosure-rules",
      },
    ],
  },
];

/**
 * Find the cluster a given page belongs to. Returns the FIRST cluster a
 * page appears in — a page MAY belong to multiple clusters (e.g., the
 * first-72-hours post is in both crisis-response and medicare-coverage-gaps),
 * in which case the order in CLUSTERS above determines primary cluster.
 */
export function getClusterFor(
  member: ClusterMember
): Cluster | undefined {
  return CLUSTERS.find((c) =>
    c.members.some(
      (m) => m.type === member.type && m.slug === member.slug
    )
  );
}

/**
 * Resolve members for a given page's related-reading list. Returns siblings
 * in the same primary cluster, excluding the page itself, optionally typed-
 * filtered, capped at `limit`.
 */
export function getRelatedFor(args: {
  type: ClusterMember["type"];
  slug: string;
  /** Restrict to one type if you want e.g. "only blog posts". */
  filterType?: ClusterMember["type"];
  limit?: number;
}): { cluster: Cluster | undefined; related: ClusterMember[] } {
  const cluster = getClusterFor({ type: args.type, slug: args.slug });
  if (!cluster) return { cluster: undefined, related: [] };

  const limit = args.limit ?? 4;
  const related = cluster.members
    .filter(
      (m) => !(m.type === args.type && m.slug === args.slug)
    )
    .filter((m) => (args.filterType ? m.type === args.filterType : true))
    .slice(0, limit);

  return { cluster, related };
}

/**
 * Map a cluster member to its canonical site URL. Centralized so URL
 * conventions live in one place.
 */
export function memberToUrl(m: ClusterMember): string {
  switch (m.type) {
    case "tool":
      return `/tools/${m.slug}`;
    case "blog":
      return `/blog/${m.slug}`;
    case "resource":
      return `/resources/${m.slug}`;
  }
}
