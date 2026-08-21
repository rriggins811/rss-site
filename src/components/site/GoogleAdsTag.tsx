"use client";

// Google Ads tag (gtag.js) for conversion tracking. Mount once in
// app/layout.tsx. The conversion EVENT fires from the forms that count
// (AgentRequestForm) via fireGoogleAdsConversion below; this component only
// loads the base tag so every page can attribute the click.

import Script from "next/script";

export const GOOGLE_ADS_ID = "AW-17907566007";
export const CONVERSION_LABELS = {
  // "Agent Request Submitted" conversion action, created 2026-08-21 by the
  // Ads Script build. $250 default value, one per click.
  agentRequest: "AW-17907566007/4STZCM7b0eUcELeL_9pC",
} as const;

export function fireGoogleAdsConversion(sendTo: string) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("event", "conversion", { send_to: sendTo });
  }
}

export function GoogleAdsTag() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
      </Script>
    </>
  );
}
