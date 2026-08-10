import type { ClientReview } from "@/lib/schema";

/**
 * Real client reviews, single source of truth.
 *
 * Lifted out of app/about/page.tsx on Aug 10 2026 when the homepage started
 * showing the same review. Both pages render from this array, so the visible
 * quote can never drift from the Review JSON-LD the About page emits, and a
 * review can never appear on one page in a stale form.
 *
 * Only add entries that are verbatim from a real, publicly checkable review.
 * Never paraphrase, never compose one, never add a name that did not write it.
 */
export const RYAN_REVIEWS: ClientReview[] = [
  {
    // Verbatim from the Google Business Profile review by Scarlett Begonias
    // (Local Guide, 42 reviews). Captured May 16, 2026. The review was 13
    // weeks old at capture, which puts it at approximately Feb 14, 2026.
    // Google doesn't surface the exact day in the public UI; using the
    // computed week-13 date as an honest approximation.
    authorName: "Scarlett Begonias",
    ratingValue: 5,
    reviewBody:
      "This is a wonderful business. Ryan and team is an excellent source in providing all the information and services for relocation. From selling your current home to assisting in contacting contractors that can accommodate your move easily and reasonably priced. A great asset for older people and anyone with a busy schedule. A one stop shop for your move. They are professional, courteous and prompt. I will be using them again for my next real estate transaction.",
    datePublished: "2026-02-14",
    publisher: "Google",
  },
];
