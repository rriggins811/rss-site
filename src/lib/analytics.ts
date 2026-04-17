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

export const GA_MEASUREMENT_ID = "G-4435CEVWS9";

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
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
  });
}
