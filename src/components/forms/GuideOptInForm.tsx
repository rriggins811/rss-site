"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent, trackGoogleAdsLeadConversion } from "@/lib/analytics";
import { trackPixelEvent, getFbc, getFbp } from "@/lib/meta/pixel";
import { META_EVENTS, generateEventId } from "@/lib/meta/events";
import type { LeadMagnet } from "@/lib/lead-magnets";

type Status = "idle" | "submitting" | "error";

/**
 * Email-only opt-in for the warm-funnel ad landing pages (/g/[slug]). One
 * field, one job: capture the email and deliver the guide instantly.
 *
 * Server contract: POST /api/guide-deliver with { email, magnet, source,
 * attribution? }. That endpoint writes to public.leads (same 1-hour dedupe
 * as the rest of the funnel), tags the contact in GHL, and sends the
 * branded Resend delivery email. On success we redirect to the branded
 * /g/[slug]/ready delivery page (no PII in the URL).
 *
 * Tracking mirrors LeadMagnetForm: GA4 lead event + Google Ads Enhanced
 * Conversion + Meta Pixel Lead with a shared event_id deduped against the
 * server-side CAPI leg (/api/track).
 */
export function GuideOptInForm({ magnet }: { magnet: LeadMagnet }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const submitting = status === "submitting";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    // Best-effort ad attribution blob (utm_*, fbclid, gclid, referrer,
    // landing_url) captured site-wide into sessionStorage. Missing or
    // corrupt = omitted; the server tolerates absence.
    let attribution: Record<string, string> | undefined;
    try {
      const stored = sessionStorage.getItem("rss_attribution");
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (parsed && typeof parsed === "object") {
          attribution = parsed as Record<string, string>;
        }
      }
    } catch {
      // ignore
    }

    try {
      const res = await fetch("/api/guide-deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: phone || undefined,
          magnet: magnet.slug,
          source: `lp-${magnet.slug}`,
          attribution,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error || "Something went wrong. Try again.");
        return;
      }

      // Successful lead. Client GA4 + Google Ads + Meta Pixel, with the
      // same event_id passed to the server-side CAPI leg for dedup.
      trackEvent("lead_magnet_submit", {
        magnet: magnet.slug,
        source: `lp_${magnet.slug}`,
      });
      trackGoogleAdsLeadConversion({ email });
      const metaEventId = generateEventId();
      trackPixelEvent({
        eventName: META_EVENTS.LEAD,
        eventId: metaEventId,
        customData: {
          content_name: magnet.slug,
          content_category: "lead_magnet",
        },
      });
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          eventName: META_EVENTS.LEAD,
          eventId: metaEventId,
          eventSourceUrl:
            typeof window !== "undefined" ? window.location.href : undefined,
          userData: { email, phone: phone || undefined, fbc: getFbc(), fbp: getFbp() },
          customData: {
            content_name: magnet.slug,
            content_category: "lead_magnet",
          },
        }),
      }).catch(() => {});

      // Branded instant-delivery page. No email in the URL (privacy).
      router.push(`/g/${magnet.slug}/ready`);
    } catch {
      setStatus("error");
      setError("Network error. Try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor="guide-optin-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3">
        <Input
          id="guide-optin-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          className="h-12 text-base"
        />
        <label htmlFor="guide-optin-phone" className="sr-only">
          Phone number (optional)
        </label>
        <Input
          id="guide-optin-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Phone (optional, for quick text tips)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={submitting}
          className="h-12 text-base"
        />
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="h-12 w-full bg-navy-700 px-6 text-base hover:bg-navy-800"
        >
          {submitting ? "Sending..." : `Send me the guide`}
        </Button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-burgundy-700" role="alert">
          {error}
        </p>
      ) : null}

      <p className="mt-3 text-xs text-ink/60">
        Free. We email it right away and send a link to read it online. No spam,
        unsubscribe anytime.
      </p>
      <p className="mt-2 text-xs text-ink/50">
        Phone is optional. Add it and we will text you occasional quick tips.
        Message and data rates may apply, reply STOP to opt out.
      </p>
    </form>
  );
}
