"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics";
import {
  trackPixelEvent,
  getFbc,
  getFbp,
} from "@/lib/meta/pixel";
import { META_EVENTS, generateEventId } from "@/lib/meta/events";
import type { LeadMagnet } from "@/lib/lead-magnets";

type Status = "idle" | "submitting" | "error";

type Props = {
  magnet: LeadMagnet;
  /** When true the form starts expanded; default is collapsed-with-CTA. */
  startExpanded?: boolean;
  className?: string;
};

/**
 * Reusable inline-expand email gate for any lead magnet. Pulls the magnet
 * config from props so adding magnet #2 is a one-line registry add — no
 * new form component needed.
 *
 * UX flow:
 *   idle      → "Get the Guide" button visible, form collapsed
 *   expanded  → first name + email + phone (optional) + submit
 *   submitting → button shows spinner state
 *   success   → "Check your email" + immediate "Download Now" button
 *               linked directly to the PDF (covers the user need even
 *               if Resend is misconfigured or the email is delayed)
 *   error     → inline error + form re-enabled
 *
 * Server contract: POST /api/webhook/starter-guide with body shape
 * { first_name, email, phone, magnet: magnet.slug, source, attribution? }
 * The starter-guide endpoint branches on the `magnet` param:
 * cash-buyer-beware (or any other LEAD_MAGNETS slug) bypasses the
 * Blueprint auth-user creation and instead does Supabase insert +
 * ghl-proxy upsert with magnet.ghlTags + Resend email + Meta CAPI Lead.
 */
export function LeadMagnetForm({
  magnet,
  startExpanded = false,
  className = "",
}: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(startExpanded);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [first, setFirst] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Initial CTA state — clicking expands the form inline rather than
  // navigating away or opening a full-page modal.
  if (!expanded && status === "idle") {
    return (
      <Button
        type="button"
        size="lg"
        onClick={() => {
          setExpanded(true);
          trackEvent("lead_magnet_form_open", { magnet: magnet.slug });
        }}
        className={`bg-navy-700 hover:bg-navy-800 ${className}`}
      >
        Get the Guide
      </Button>
    );
  }

  const submitting = status === "submitting";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    // Pull the same attribution sessionStorage blob the StarterGuideForm
    // writes (utm_*, fbclid, gclid, referrer, landing_url). Best-effort:
    // missing or corrupt = omitted from POST, server handles the absence.
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
      const res = await fetch("/api/webhook/starter-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first,
          email,
          phone: phone || undefined,
          magnet: magnet.slug,
          source: `guides_${magnet.slug}`,
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

      // Track the successful submit. Client-side GA4 + Meta Pixel +
      // server-side CAPI dedup (same event_id on both legs).
      trackEvent("lead_magnet_submit", {
        magnet: magnet.slug,
        source: "guides_inline",
      });
      const metaEventId = generateEventId();
      trackPixelEvent({
        eventName: META_EVENTS.LEAD,
        eventId: metaEventId,
        customData: {
          content_name: magnet.slug,
          content_category: "lead_magnet",
        },
      });
      // Server-side dedup leg via /api/track. Best-effort, never blocks.
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: META_EVENTS.LEAD,
          eventId: metaEventId,
          eventSourceUrl:
            typeof window !== "undefined" ? window.location.href : undefined,
          userData: {
            email,
            phone: phone || undefined,
            firstName: first,
            fbc: getFbc(),
            fbp: getFbp(),
          },
          customData: {
            content_name: magnet.slug,
            content_category: "lead_magnet",
          },
        }),
      }).catch(() => {});

      // Redirect to the same activation-pending page the /freeguide
      // form uses. The user now lands in the EXACT same flow: check
      // email, click activation link, set password, land on /dashboard
      // with both PDFs (Simple Blueprint + Cash Buyer Beware) visible.
      router.push(
        `/freeguide/check-email?email=${encodeURIComponent(email)}`
      );
    } catch {
      setStatus("error");
      setError("Network error. Try again.");
    }
  }

  // Google sign-in fast path. Bounces to blueprint.r.com/login with the
  // signup_via_google=1 trigger so PKCE state stays on blueprint subdomain.
  // The /auth/callback there runs applyFreeTierSetup with course_access for
  // all 4 lead magnets included, so the user lands on the dashboard with the
  // magnet PDF they came for visible alongside the Blueprint modules. Added
  // 2026-05-26 because the magnet email funnel had a 0% activation rate;
  // skipping the email step entirely via OAuth should match the /freeguide
  // funnel's higher rate.
  const googleSignupUrl =
    "https://blueprint.rigginsstrategicsolutions.com/login?signup_via_google=1";

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-md border border-border bg-white p-5 ${className}`}
      noValidate
    >
      <p className="text-sm text-ink/70 mb-4">
        Tell us where to send <span className="font-semibold">{magnet.title}</span>.
        Plain-English, {magnet.pageCount} pages, no spam.
      </p>

      <a
        href={googleSignupUrl}
        className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50"
        onClick={() =>
          trackEvent("lead_magnet_google_signup", { magnet: magnet.slug })
        }
      >
        <GoogleLogo />
        Continue with Google
      </a>
      <p className="mt-2 text-center text-xs text-ink/60">
        Fastest. One tap. No password to remember.
      </p>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wider text-ink/50">
          or use your email
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-3">
        <div>
          <Label htmlFor={`lm-${magnet.slug}-first`}>First name *</Label>
          <Input
            id={`lm-${magnet.slug}-first`}
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            disabled={submitting}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`lm-${magnet.slug}-email`}>Email *</Label>
          <Input
            id={`lm-${magnet.slug}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`lm-${magnet.slug}-phone`}>Phone (optional)</Label>
          <Input
            id={`lm-${magnet.slug}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={submitting}
            className="mt-1"
            placeholder="(336) 555-0100"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-burgundy-700" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="mt-4 w-full bg-navy-700 hover:bg-navy-800"
      >
        {submitting ? "Sending..." : `Send me ${magnet.title}`}
      </Button>
      <p className="mt-2 text-xs text-ink/60 text-center">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.61z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.46-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.07l3.01-2.32z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 .96 4.96L3.97 7.3C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
