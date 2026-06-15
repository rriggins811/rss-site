"use client";

import { trackPixelEvent, getFbc, getFbp } from "@/lib/meta/pixel";
import { generateEventId } from "@/lib/meta/events";

// The $9.99 map checkout lives on blueprint-site (reuses its Stripe + webhook).
const CHECKOUT_URL =
  "https://blueprint.rigginsstrategicsolutions.com/api/checkout/map";

// Sales-page CTA. Fires Meta InitiateCheckout (pixel + CAPI, deduped on a shared
// event id, value 9.99) before sending the buyer to Stripe, so the ad can
// optimize on the full funnel. keepalive lets the CAPI POST survive the
// cross-domain navigation to Stripe.
export function MapCheckoutButton({
  label = "Unlock the full map for $9.99",
}: {
  label?: string;
}) {
  function go() {
    const eventId = generateEventId();
    const customData = {
      value: 9.99,
      currency: "USD",
      content_name: "blueprint_map",
    };
    try {
      trackPixelEvent({ eventName: "InitiateCheckout", eventId, customData });
    } catch {
      /* pixel best-effort */
    }
    try {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          eventName: "InitiateCheckout",
          eventId,
          eventSourceUrl: window.location.href,
          userData: { fbc: getFbc(), fbp: getFbp() },
          customData,
        }),
      }).catch(() => {});
    } catch {
      /* CAPI best-effort */
    }
    window.location.href = CHECKOUT_URL;
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
