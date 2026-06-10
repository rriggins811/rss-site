"use client";

import Script from "next/script";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  googleAdsConfigured,
  trackPageView,
} from "@/lib/analytics";

function RouteChangeTracker() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const q = search?.toString();
    const full = q ? `${pathname}?${q}` : pathname;
    trackPageView(full);
  }, [pathname, search]);

  return null;
}

export function Analytics() {
  // Add the Google Ads (AW-) tag alongside GA4 on the same gtag instance. This
  // also sets up the conversion linker, which reads the ?gclid= from ad clicks
  // (Google Ads auto-tagging must be ON account-side) into a first-party cookie
  // so click-to-lead attribution works. Skipped until the AW- id is real.
  const googleAdsConfig = googleAdsConfigured()
    ? `gtag('config', '${GOOGLE_ADS_ID}');`
    : "";
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          if (navigator.doNotTrack !== '1' && window.doNotTrack !== '1') {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
            ${googleAdsConfig}
          }
        `}
      </Script>
      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  );
}
