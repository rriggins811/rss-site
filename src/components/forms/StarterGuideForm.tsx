"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackEvent, trackGoogleAdsLeadConversion } from "@/lib/analytics";
import { trackPixelEvent, getFbc, getFbp } from "@/lib/meta/pixel";
import { META_EVENTS, generateEventId } from "@/lib/meta/events";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  source?: string;
  className?: string;
};

// PKCE code_verifier is stored in localStorage on the origin that initiates
// the OAuth call. Initiating from rss-site would leave the verifier on
// rigginsstrategicsolutions.com, where blueprint.rigginsstrategicsolutions.com
// can't read it. Bounce to Blueprint /login first; the OAuth call (and the
// verifier) lives there end-to-end.
const BLUEPRINT_GOOGLE_SIGNUP_URL =
  "https://blueprint.rigginsstrategicsolutions.com/login?signup_via_google=1&from=freeguide";

function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 18 18"
      className={className}
      width="18"
      height="18"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

export function StarterGuideForm({
  source = "website-freeguide",
  className = "",
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // Capture UTM / ad attribution on first paint and persist in sessionStorage
  // so it survives navigation (e.g. user clicks through other tabs and comes
  // back to submit). Server-side, /api/webhook/starter-guide reads the
  // attribution field off the POST body and writes it into leads.raw_payload.
  // Sparse object: any missing UTM key is omitted entirely (per spec) — we
  // never write empty strings.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("rss_attribution")) return; // first-touch wins
    const params = new URLSearchParams(window.location.search);
    const attribution: Record<string, string> = {};
    const KEYS = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "gclid",
    ] as const;
    for (const k of KEYS) {
      const v = params.get(k);
      if (v) attribution[k] = v;
    }
    if (document.referrer) attribution.referrer = document.referrer;
    // landing_url always captured for context (even on organic visits with
    // no UTMs/referrer). Acceptance criterion 6 expects organic rows to
    // still have a populated attribution object.
    attribution.landing_url = window.location.href;
    sessionStorage.setItem("rss_attribution", JSON.stringify(attribution));
  }, []);

  function onGoogle() {
    setError(null);
    setGoogleLoading(true);
    trackEvent("lead_magnet_google_click", { source });
    window.location.href = BLUEPRINT_GOOGLE_SIGNUP_URL;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    // Pull attribution captured on page load (sessionStorage). Best-effort:
    // if storage is blocked or the JSON is corrupt, attribution is just
    // omitted from the POST and the server records the lead without it.
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
          last_name: last || undefined,
          email,
          phone: phone || undefined,
          source,
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
      trackEvent("lead_magnet_download", { source });
      // Google Ads "Free Guide Lead" conversion (Enhanced Conversions via email).
      // Fires once: this success block runs once per submission and the page
      // redirects on success, so it can't double-fire.
      trackGoogleAdsLeadConversion({ email });

      // Meta Pixel + CAPI dedup fire on Lead conversion. Same event_id on
      // both legs so Meta merges into a single counted conversion.
      const metaEventId = generateEventId();
      trackPixelEvent({
        eventName: META_EVENTS.LEAD,
        eventId: metaEventId,
        customData: { content_name: "freeguide", content_category: source },
      });
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: META_EVENTS.LEAD,
          eventId: metaEventId,
          eventSourceUrl: window.location.href,
          userData: {
            email,
            phone: phone || undefined,
            firstName: first,
            lastName: last || undefined,
            fbc: getFbc(),
            fbp: getFbp(),
          },
          customData: { content_name: "freeguide", content_category: source },
        }),
      }).catch(() => {
        // Best-effort. Browser pixel already fired; CAPI is the dedup leg.
      });
      // Redirect to the dedicated check-email page so the activation flow
      // is the obvious next step.
      router.push(
        `/freeguide/check-email?email=${encodeURIComponent(email)}`
      );
    } catch {
      setStatus("error");
      setError("Network error. Try again.");
    }
  }

  const submitting = status === "submitting";
  const disabled = submitting || googleLoading;

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-lg bg-white border border-border p-6 md:p-8 shadow-sm ${className}`}
      noValidate
    >
      <Button
        type="button"
        size="lg"
        variant="outline"
        onClick={onGoogle}
        disabled={disabled}
        className="w-full bg-white border-2 border-navy-700 text-navy-700 hover:bg-navy-50"
      >
        <GoogleIcon className="mr-2" />
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </Button>
      <p className="mt-2 text-xs text-ink/60 text-center">
        One click, no inbox waiting. Same login as the Blueprint dashboard.
      </p>

      <div
        className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-ink/50"
        aria-hidden
      >
        <span className="h-px flex-1 bg-border" />
        <span>or use your email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="sg-first">First name *</Label>
          <Input
            id="sg-first"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            disabled={disabled}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="sg-last">Last name</Label>
          <Input
            id="sg-last"
            name="last_name"
            type="text"
            autoComplete="family-name"
            value={last}
            onChange={(e) => setLast(e.target.value)}
            disabled={disabled}
            className="mt-2"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="sg-email">Email *</Label>
        <Input
          id="sg-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
          className="mt-2"
        />
      </div>

      <div className="mt-4">
        <Label htmlFor="sg-phone">Phone (optional)</Label>
        <Input
          id="sg-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={disabled}
          className="mt-2"
          placeholder="(336) 555-0100"
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-burgundy-700" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        disabled={disabled}
      >
        {submitting ? "Sending..." : "Send me the Simple Blueprint"}
      </Button>

      <p className="mt-3 text-xs text-ink/60 text-center">
        Plain-English PDF. No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
