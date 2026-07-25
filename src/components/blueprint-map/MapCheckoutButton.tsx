"use client";

import { trackPixelEvent, getFbc, getFbp } from "@/lib/meta/pixel";
import { generateEventId } from "@/lib/meta/events";

// Free-pivot: the Blueprint Map is no longer sold. The map content is part of
// the free Senior Transition Blueprint, so this CTA now sends visitors to the
// free account signup on blueprint-site.
const SIGNUP_URL = "https://blueprint.rigginsstrategicsolutions.com/signup";

// CTA button (name kept from the old checkout wiring so imports don't churn).
// Fires a Meta Lead event (pixel + CAPI, deduped on a shared event id) before
// sending the visitor to the free signup, so ads can still optimize on the
// funnel. keepalive lets the CAPI POST survive the cross-domain navigation.
export function MapCheckoutButton({
  label = "Get the Blueprint free",
}: {
  label?: string;
}) {
  function go() {
    const eventId = generateEventId();
    const customData = {
      content_name: "blueprint_free_signup",
    };
    try {
      trackPixelEvent({ eventName: "Lead", eventId, customData });
    } catch {
      /* pixel best-effort */
    }
    try {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          eventName: "Lead",
          eventId,
          eventSourceUrl: window.location.href,
          userData: { fbc: getFbc(), fbp: getFbp() },
          customData,
        }),
      }).catch(() => {});
    } catch {
      /* CAPI best-effort */
    }
    window.location.href = SIGNUP_URL;
  }

  return (
    <button
      type="button"
      onClick={go}
      className="inline-flex items-center justify-center rounded-lg px-7 py-4 text-base font-bold transition-opacity hover:opacity-90"
      style={{ background: "#D4AF37", color: "#1C3A52" }}
    >
      {label}
      <span aria-hidden className="ml-2">&rarr;</span>
    </button>
  );
}
