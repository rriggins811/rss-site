"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = {
  event: string;
  /** Fraction of page height to trigger at. Defaults to 0.75 (75%). */
  threshold?: number;
  /** Extra params to include when the event fires. */
  params?: Record<string, string | number | boolean | undefined>;
};

/**
 * Fires a GA4 event once when the user scrolls past a threshold of
 * document height. Used for blog_scroll_75.
 */
export function ScrollTracker({ event, threshold = 0.75, params = {} }: Props) {
  const fired = useRef(false);

  useEffect(() => {
    function check() {
      if (fired.current) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total <= 0) return;
      if (scrolled / total >= threshold) {
        fired.current = true;
        trackEvent(event, params);
        window.removeEventListener("scroll", check);
      }
    }
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, [event, threshold, params]);

  return null;
}
