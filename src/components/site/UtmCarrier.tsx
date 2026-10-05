"use client";

import { useEffect } from "react";

// Carries campaign attribution across the site and onto the Blueprint app
// (Oct 5 2026). The printed book's /book/<name> short links land on pages
// like /the-blueprint?utm_source=book&utm_content=blueprint. Without this,
// the utm params died on the first click to blueprint.rigginsstrategicsolutions.com,
// so a reader who signed up there was never tagged `book-reader` in GHL.
//
// 1. Any utm_* on the landing URL is saved for the session (last touch), and
//    seeds `rss_attribution` (first touch) if nothing set it yet, so the guide
//    forms on later pages still send it.
// 2. Clicks on links into the Blueprint app get the saved utm_* appended,
//    unless the link already carries its own.

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const STORE_KEY = "rss_utm";
const BLUEPRINT_HOST = "blueprint.rigginsstrategicsolutions.com";

function readStored(): Record<string, string> | null {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : null;
  } catch {
    return null;
  }
}

export function UtmCarrier() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const utm: Record<string, string> = {};
      for (const k of UTM_KEYS) {
        const v = params.get(k);
        if (v) utm[k] = v.slice(0, 120);
      }
      if (Object.keys(utm).length > 0) {
        sessionStorage.setItem(STORE_KEY, JSON.stringify(utm));
        if (!sessionStorage.getItem("rss_attribution")) {
          sessionStorage.setItem(
            "rss_attribution",
            JSON.stringify({ ...utm, landing_url: window.location.href })
          );
        }
      }
    } catch {
      // storage blocked: nothing to carry
    }

    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href) return;
      let url: URL;
      try {
        url = new URL(a.href);
      } catch {
        return;
      }
      if (url.hostname !== BLUEPRINT_HOST || url.searchParams.has("utm_source")) return;
      const utm = readStored();
      if (!utm) return;
      for (const [k, v] of Object.entries(utm)) url.searchParams.set(k, v);
      a.href = url.toString();
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
