/**
 * Pinned "last updated" dates (YYYY-MM-DD) for static pages that show one.
 *
 * One source for the visible "Updated" line, the page's dateModified schema
 * and the sitemap lastmod. Bump a date only when the page's content really
 * changes (and bump that page's UPDATED_LABEL with it). Site-wide chores like
 * a footer or address change do not re-date a page.
 *
 * Pages that are not listed here get no lastmod in the sitemap at all,
 * rather than a lastmod stamped with the build time (sitemap honesty,
 * 2026-09-21).
 */
export const PAGE_UPDATED = {
  "/what-is-a-senior-transition-advisor": "2026-09-19",
  "/mom-moving-to-assisted-living-what-to-do-with-the-house": "2026-09-19",
  "/sell-rent-or-keep-parents-house": "2026-09-19",
  "/senior-transition-advisor": "2026-09-19",
  /** Shared by every city page under /senior-transition-advisor/. */
  cityPages: "2026-09-19",
  "/resources/sorting-tracker": "2026-05-21",
} as const;
