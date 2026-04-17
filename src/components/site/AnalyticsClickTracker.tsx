"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Global click listener that auto-fires GA4 events based on:
 *   1. Explicit data-track attribute on the element.
 *   2. URL pattern of the nearest anchor/link (book call, Stripe checkout).
 *
 * Keeps tracking centralized so new CTAs don't require per-button wiring.
 */

const BOOK_CALL_PATTERNS = [
  /^\/work-with-ryan(?:\/|$|\?)/,
  /^https?:\/\/(?:api|app|services)\.leadconnectorhq\.com\/widget\/booking\//i,
];

const STRIPE_CHECKOUT_PATTERN =
  /^https?:\/\/link\.fastpaydirect\.com\/payment-link\//i;

function detectUrlEvent(href: string):
  | { event: string; params: Record<string, string> }
  | null {
  if (BOOK_CALL_PATTERNS.some((p) => p.test(href))) {
    return { event: "book_call_click", params: { href } };
  }
  if (STRIPE_CHECKOUT_PATTERN.test(href)) {
    return { event: "stripe_checkout_click", params: { href } };
  }
  return null;
}

export function AnalyticsClickTracker() {
  useEffect(() => {
    function handler(e: MouseEvent) {
      const el = e.target as HTMLElement | null;
      if (!el) return;

      // Explicit data-track first. Skip URL auto-detect if present.
      const tracked = el.closest<HTMLElement>("[data-track]");
      if (tracked) {
        const event = tracked.getAttribute("data-track");
        if (event) {
          let params: Record<string, string | number | boolean | undefined> =
            {};
          const raw = tracked.getAttribute("data-track-params");
          if (raw) {
            try {
              params = JSON.parse(raw);
            } catch {}
          }
          trackEvent(event, params);
        }
        return;
      }

      // URL-based auto-detect on the nearest anchor.
      const anchor = el.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const detected = detectUrlEvent(href);
      if (detected) {
        trackEvent(detected.event, detected.params);
      }
    }

    document.addEventListener("click", handler, { capture: true });
    return () =>
      document.removeEventListener("click", handler, { capture: true });
  }, []);

  return null;
}
