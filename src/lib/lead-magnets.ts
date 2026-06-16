/**
 * Typed registry of all lead-magnet PDFs offered on rss-site.
 *
 * Adding a new magnet (e.g. "5 Wholesaler Red Flags Mom Won't See" per the
 * 12-month plan) is a one-line addition to LEAD_MAGNETS below — no
 * component edits, no API changes, no per-magnet route. Constraint that
 * future Saturday work depends on: keep this file the single source of
 * truth and never inline magnet metadata into components or pages.
 *
 * The /guides hub renders one card per LEAD_MAGNETS entry (replacing the
 * placeholder "Coming Soon" cards in slug-publish-order). The
 * /api/webhook/starter-guide endpoint accepts a `magnet` param matching a
 * LEAD_MAGNETS slug and routes the lead-capture flow accordingly:
 *   - GHL tags derived from magnetTags()
 *   - Resend email template lookup by slug
 *   - Meta CAPI Lead event_id stamped with the slug
 *
 * The warm-funnel ad pages at /g/[slug] also read this registry: each
 * magnet's `landing` block is the per-guide ad landing-page copy, and
 * /api/guide-deliver delivers the magnet instantly (Resend email +
 * branded /g/[slug]/ready page) without the account-creation step.
 *
 * Same source-of-truth principle as lib/internal-links.ts (cluster
 * registry): the data shape is typed and validated, components pull from
 * here rather than holding their own copy.
 */

/**
 * Ad landing-page copy for a guide. Empathy-first, plain language, no
 * urgency/pressure (brand voice). Lives in the registry so a new guide's
 * /g/[slug] page is a data add, not a new page component.
 */
export type GuideLanding = {
  /** Feeling-first H1 on the /g/[slug] ad landing page. */
  headline: string;
  /** One-line bridge under the H1. */
  subhead: string;
  /** The gut-level "this is you" paragraph that earns the email. */
  pain: string;
  /** What's inside — 4 short, scannable bullets. */
  bullets: string[];
};

export type LeadMagnet = {
  /** URL-safe identifier, used in tags, event_ids, API params. */
  slug: string;
  /** Card title (4-6 words ideal). */
  title: string;
  /** Card subtitle (8-15 words ideal). */
  subtitle: string;
  /** Long-form description shown in the card body. */
  description: string;
  /** Page count badge ("15 pages"). */
  pageCount: number;
  /**
   * Public path (same-origin, served from public/downloads/). Canonical
   * download URL for this magnet across every surface that links it
   * (rss-site /guides, blueprint-site dashboard tile, the /g ad LPs).
   * Update here, propagates everywhere.
   */
  pdfPath: string;
  /** Locked publish date for the magnet (when it became downloadable). */
  publishedDate: string;
  /**
   * Optional cover image path (public/). Falls back to a branded
   * placeholder when omitted. Add cover later without touching code.
   */
  coverImage?: string;
  /**
   * GHL contact tags applied to anyone who downloads this magnet. Used by
   * GHL nurture workflows to segment + route follow-up sequences.
   * Universal `lead-magnet-download` + source + magnet-slug pattern,
   * per the locked SOP tag convention.
   */
  ghlTags: string[];
  /**
   * Per-guide ad landing-page copy (the /g/[slug] warm-funnel page).
   * Optional so older callers/tests don't break, but every shipped
   * magnet should carry it so its ad LP renders fully.
   */
  landing?: GuideLanding;
  /**
   * When true, the magnet is excluded from the public /guides browse hub
   * but still powers its own /g/[slug] ad landing page and
   * /api/guide-deliver. Used for the Simple Blueprint, whose canonical
   * opt-in is /freeguide; we don't want a duplicate hub card routing
   * through the account-creation flow.
   */
  hideFromHub?: boolean;
};

/**
 * Canonical lead magnet list. Display order = source-of-truth order.
 * /guides hub renders in this order; any LEAD_MAGNETS entry replaces a
 * "Coming Soon" placeholder, remaining placeholders render last.
 */
export const LEAD_MAGNETS: LeadMagnet[] = [
  {
    slug: "cash-buyer-beware",
    title: "Cash Buyer Beware",
    subtitle: "What to know before Mom signs anything",
    description:
      "A 15-page protection guide for families navigating senior home sales. The 5 questions to ask before signing, the math wholesalers don't want you to see, and what to do if Mom already signed.",
    pageCount: 15,
    pdfPath: "/downloads/cash-buyer-beware.pdf",
    publishedDate: "2026-05-18",
    // Tag set per the May-18 spec update: /guides signups now route
    // through the full Blueprint Free signup flow, so they need the
    // same `freeguide` tag the /freeguide flow uses to enroll in the
    // existing Free Guide Trial Nurture workflow. The `meta-lead` tag
    // is the universal paid-traffic tag set on every Meta-ad-sourced
    // signup; `cash-buyer-beware` is the entry-door identifier so
    // segmentation can split this funnel from future magnets.
    ghlTags: [
      "meta-lead",
      "freeguide",
      "lead-source-rss-guides",
      "cash-buyer-beware",
    ],
    landing: {
      headline: "Before your parent signs with a cash buyer, read this.",
      subhead:
        "A plain-English look at what those 'we buy houses' offers really cost, and the questions that protect your family.",
      pain: "The letters and the calls feel like a lifeline when you are overwhelmed and the house is one more thing to deal with. Some of those offers are fair. Some quietly cost a family tens of thousands of dollars. The hard part is telling them apart when you are already stretched thin.",
      bullets: [
        "The 5 questions to ask before anyone signs anything",
        "The simple math that shows what an offer really nets your family",
        "What to do if your parent has already signed",
        "How to tell the fair buyers from the predatory ones",
      ],
    },
  },
  {
    slug: "when-mom-falls-crisis-playbook",
    title: "When Mom Falls at 2 AM",
    subtitle:
      "The First 30 Minutes (and the 30 Mistakes Most Families Make)",
    description:
      "A 17-page crisis playbook. The exact sequence when the 2 AM call comes — 911 first, observation vs admitted, decisions to defer, family meeting structure, and the 5 mistakes that cost families $50K. Plus a pre-crisis prep guide.",
    pageCount: 17,
    pdfPath: "/downloads/when-mom-falls-crisis-playbook.pdf",
    publishedDate: "2026-05-18",
    // Per May-18 user decision: match Cash Buyer Beware tag pattern so
    // these signups enter the same Free Guide Trial Nurture workflow
    // and inherit the universal `meta-lead` paid-traffic tag.
    ghlTags: [
      "meta-lead",
      "freeguide",
      "lead-source-rss-guides",
      "when-mom-falls-crisis-playbook",
    ],
    landing: {
      headline:
        "When the 2 AM call comes, you will not have time to figure it out.",
      subhead:
        "The first 30 minutes, step by step, so you can act instead of freeze.",
      pain: "One phone call and everything changes. In that moment no one is thinking clearly, and the decisions coming at you fast are the ones that shape the months ahead. This is the playbook to keep by the phone before you ever need it.",
      bullets: [
        "Exactly what to do in the first 30 minutes",
        "Observation vs admitted, and why it costs families thousands",
        "The 5 mistakes that cost families $50K",
        "How to run the family meeting that has to happen next",
      ],
    },
  },
  {
    slug: "aging-in-place-vs-assisted-living",
    title: "Aging in Place vs Assisted Living",
    subtitle: "The Honest Math (and 5 Questions That Actually Decide)",
    description:
      "A 17-page decision guide with real 5-year cost math for both options, the 5 questions that determine if aging in place is viable, 6 hybrid housing options most families never consider, and a decoder for what Mom says vs what Mom means.",
    pageCount: 17,
    pdfPath: "/downloads/aging-in-place-vs-assisted-living.pdf",
    publishedDate: "2026-05-18",
    ghlTags: [
      "meta-lead",
      "freeguide",
      "lead-source-rss-guides",
      "aging-in-place-vs-assisted-living",
    ],
    landing: {
      headline:
        "Keep Mom at home, or move her somewhere safer? There is no easy answer.",
      subhead:
        "The honest 5-year cost math and the 5 questions that actually decide it.",
      pain: "Everyone in the family has an opinion, and they rarely agree. What you actually need is the real math and the right questions, so the decision holds up later and the family stays together through it instead of splitting over it.",
      bullets: [
        "Real 5-year cost math for both paths",
        "The 5 questions that actually decide it",
        "6 hybrid options most families never consider",
        "What Mom says vs what Mom means, decoded",
      ],
    },
  },
  {
    slug: "medicare-coverage-gaps",
    title: "Medicare Coverage Gaps Most Families Don't Know About",
    subtitle: "The hospital and rehab questions that cost families $10K to $30K",
    description:
      "A 17-page coverage guide. The inpatient vs observation trap, the 100-day skilled nursing myth, Medicare Advantage prior auth tactics, the Medicaid 5-year lookback, the underused VA Aid & Attendance benefit, and the exact questions to ask before the next hospital stay so a coverage gap doesn't cost the family $10K-$30K out of pocket.",
    pageCount: 17,
    pdfPath: "/downloads/medicare-coverage-gaps.pdf",
    publishedDate: "2026-05-19",
    ghlTags: [
      "meta-lead",
      "freeguide",
      "lead-source-rss-guides",
      "medicare-coverage-gaps",
    ],
    landing: {
      headline:
        "The Medicare gaps that cost families $10K to $30K, before anyone sees them coming.",
      subhead:
        "The hospital and rehab questions to ask before the next stay, not after the bill.",
      pain: "Most families learn how Medicare really works the expensive way: after a hospital stay, when the bill arrives and a word like 'observation' suddenly costs them thousands. This is how to know the right questions before you need them, while you can still ask.",
      bullets: [
        "The inpatient vs observation trap, in plain English",
        "The 100-day skilled nursing myth that surprises everyone",
        "The Medicaid 5-year lookback, explained simply",
        "The underused VA Aid & Attendance benefit",
      ],
    },
  },
  {
    slug: "simple-blueprint",
    title: "The Simple Blueprint",
    subtitle: "Where to start when a parent needs more help",
    description:
      "A 14-page, plain-English starter map for the whole senior transition: what to handle first and what can wait, the conversations to have before a crisis forces them, and where the money usually hides and leaks. The calm starting point when it all lands at once.",
    pageCount: 14,
    // The Simple Blueprint PDF lives at /files/ (the original free-guide
    // path), not /downloads/ with the other magnets. The registry keeps
    // the canonical path so every surface links the same file.
    pdfPath: "/files/simple-blueprint.pdf",
    publishedDate: "2026-05-18",
    ghlTags: [
      "meta-lead",
      "freeguide",
      "lead-source-rss-guides",
      "simple-blueprint",
    ],
    // Canonical Simple Blueprint opt-in is /freeguide; keep it off the
    // /guides browse hub but power its /g/simple-blueprint ad LP.
    hideFromHub: true,
    landing: {
      headline: "Where do you even start? Here is the whole picture on one page.",
      subhead:
        "A plain-English starter map for the senior transition, so the overwhelm has somewhere to go.",
      pain: "When a parent needs more help, it all lands at once: the house, the money, the care, the hard conversations, the rest of the family. This is the calm starting point that puts it in order, so you are working a plan instead of fighting a fire.",
      bullets: [
        "The big picture in plain English, start to finish",
        "What to handle first, and what can safely wait",
        "The conversations to have before a crisis forces them",
        "Where the money usually hides, and where it leaks",
      ],
    },
  },
  // Future magnets: append here. /guides hub will auto-render them in
  // source-of-truth order. No component edits required.
  //
  // Next-planned rotation (per the May-19 audit): "5 Wholesaler Red Flags
  // Mom Won't See" (slug: wholesaler-red-flags), then "Sandwich Generation
  // Burnout" (slug: sandwich-generation-burnout). Both placeholders are
  // live in PLACEHOLDER_GUIDES at /guides/page.tsx slots 5 and 6.
];

/**
 * Magnets shown on the public /guides browse hub. Excludes entries flagged
 * hideFromHub (e.g. Simple Blueprint, whose canonical opt-in is /freeguide).
 * The /g/[slug] ad landing pages and /api/guide-deliver use the full
 * LEAD_MAGNETS list, so a hidden magnet still has a working ad funnel.
 */
export const HUB_LEAD_MAGNETS: LeadMagnet[] = LEAD_MAGNETS.filter(
  (m) => !m.hideFromHub
);

/**
 * Lookup helper. Returns undefined when slug doesn't match — callers
 * should treat that as a 404 / invalid magnet param.
 */
export function getLeadMagnet(slug: string): LeadMagnet | undefined {
  return LEAD_MAGNETS.find((m) => m.slug === slug);
}

/**
 * Canonical absolute URL for a magnet PDF. Used by the Blueprint dashboard
 * tile (which lives on a different origin) and any external surface that
 * links the PDF. Hardcodes the rss-site canonical domain so the URL stays
 * stable even if relative paths shift.
 */
export function magnetAbsoluteUrl(magnet: LeadMagnet): string {
  return `https://rigginsstrategicsolutions.com${magnet.pdfPath}`;
}

/**
 * Canonical absolute URL for a guide's branded delivery page (the warm-
 * funnel /g/[slug]/ready page). This is what the Resend delivery email
 * links to instead of dumping the raw PDF URL — a branded page that
 * presents the guide AND the $9.99 Blueprint Map next step.
 */
export function guideDeliveryUrl(magnet: LeadMagnet): string {
  return `https://rigginsstrategicsolutions.com/g/${magnet.slug}/ready`;
}

/**
 * Canonical absolute URL for a guide's ad landing page (/g/[slug]). The
 * destination an ad points at: one guide, one job, email-only opt-in.
 */
export function guideLandingUrl(magnet: LeadMagnet): string {
  return `https://rigginsstrategicsolutions.com/g/${magnet.slug}`;
}
