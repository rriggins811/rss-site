/**
 * Client-side GA4 event helper. No-ops if gtag isn't loaded or if the user
 * has Do-Not-Track enabled.
 */

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "consent" | "set",
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

// --- Google Ads conversion tracking ("Free Guide Lead"), campaign relaunch ---
// Hardcoded (NOT NEXT_PUBLIC_*) as the single source of truth: NEXT_PUBLIC_*
// values inline at build time, so a stale Vercel env value silently breaks
// tracking (the cal.com booking-url lesson). Fill BOTH from the Google Ads UI:
//   Goals → Conversions → "Free Guide Lead" → Tag setup → "Install the tag
//   yourself". The event snippet shows:  send_to: 'AW-XXXXXXXXXX/aBcdEf...'
//     GOOGLE_ADS_ID                     = the 'AW-XXXXXXXXXX' part (before the /)
//     GOOGLE_ADS_LEAD_CONVERSION_LABEL  = the part AFTER the /
// Until both are real (placeholders below), the conversion fire is a no-op and
// the AW tag config is skipped, so this ships safely inert.
export const GOOGLE_ADS_ID = "AW-17907566007";
export const GOOGLE_ADS_LEAD_CONVERSION_LABEL = "-s-fCLasm70cELeL_9pC";

export function googleAdsConfigured(): boolean {
  return (
    !GOOGLE_ADS_ID.includes("XXXX") &&
    !GOOGLE_ADS_LEAD_CONVERSION_LABEL.includes("YYYY")
  );
}

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

/**
 * Fire the Google Ads "Free Guide Lead" conversion. Call this once, in a lead
 * form's success branch (alongside the existing Meta Lead fire). No-ops if gtag
 * isn't loaded, Do-Not-Track is on, or the AW- id/label aren't configured yet.
 *
 * Enhanced Conversions: when an email is provided we hand it to gtag via
 * `set user_data` so Google can match the lead to the originating ad click even
 * when the GCLID cookie is lost (Safari ITP, etc.). gtag normalizes + hashes it
 * client-side before sending. Enhanced Conversions must ALSO be toggled on in
 * the Google Ads UI (Conversions → Settings → Enhanced conversions, "Google
 * tag" method) for the hashed data to be used.
 */
export function trackGoogleAdsLeadConversion(opts?: { email?: string }) {
  if (!shouldTrack() || !window.gtag) return;
  if (!googleAdsConfigured()) return; // inert until real AW- id/label are set
  if (opts?.email) {
    window.gtag("set", "user_data", { email: opts.email.trim().toLowerCase() });
  }
  window.gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_CONVERSION_LABEL}`,
  });
}
