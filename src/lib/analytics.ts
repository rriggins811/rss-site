/**
 * Client-side GA4 event helper. No-ops if gtag isn't loaded or if the user
 * has Do-Not-Track enabled.
 */

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "consent",
      targetOrEvent: string | Date,
      params?: EventParams
    ) => void;
    dataLayer?: unknown[];
  }
}

// Source of truth: NEXT_PUBLIC_GA_ID Vercel env var. Hardcoded fallback
// preserved so prerender + local dev don't break if the env var is unset.
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-4435CEVWS9";

export function shouldTrack(): boolean {
  if (typeof window === "undefined") return false;
  const dnt =
    navigator.doNotTrack === "1" ||
    (navigator as unknown as { msDoNotTrack?: string }).msDoNotTrack === "1";
  if (dnt) return false;
  return typeof window.gtag === "function";
}

export function trackEvent(name: string, params: EventParams = {}) {
  if (!shouldTrack() || !window.gtag) return;
  window.gtag("event", name, params);
}

export function trackPageView(path: string) {
  if (!shouldTrack() || !window.gtag) return;
  // GA4 reads campaign attribution (utm_source/medium/campaign) from
  // page_location at the moment of the page_view event. Sending a clean
  // page_path via gtag('config', ...) made GA4 ignore the UTMs on the
  // landing URL, so paid traffic was bucketed as Direct/Organic. Fire a
  // proper GA4 page_view EVENT that includes the full URL with its query
  // string so attribution is preserved.
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: typeof document !== "undefined" ? document.title : undefined,
  });
}
