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
 * Same source-of-truth principle as lib/internal-links.ts (cluster
 * registry): the data shape is typed and validated, components pull from
 * here rather than holding their own copy.
 */

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
   * (rss-site /guides, blueprint-site dashboard tile, future ad LPs).
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
    ghlTags: [
      "lead-magnet-download",
      "lead-source-rss-guides",
      "cash-buyer-beware",
    ],
  },
  // Future magnets: append here. /guides hub will auto-render them in
  // source-of-truth order. No component edits required.
  //
  // Next per the 12-month plan: "5 Wholesaler Red Flags Mom Won't See"
  // slug: "wholesaler-red-flags"
];

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
