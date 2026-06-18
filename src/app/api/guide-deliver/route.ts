import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rate-limit";
import { upsertGhlContactWithTags } from "@/lib/ghl-proxy";
import { getLeadMagnet, guideDeliveryUrl } from "@/lib/lead-magnets";
import { sendLeadMagnetEmail } from "@/lib/email/lead-magnets";

export const runtime = "nodejs";

/**
 * Warm-funnel instant guide delivery (the /g/[slug] ad landing pages).
 *
 * This is the LIGHT path, deliberately different from the account-creating
 * /api/webhook/starter-guide flow (whose own code notes the magnet email
 * funnel "had a 0% activation rate" because it forced account activation
 * before the guide appeared). Here we:
 *   1. capture the email into the SAME public.leads table with the SAME
 *      1-hour dedupe index (lower(email), form_type, dedupe_hour),
 *   2. tag the contact in GHL (magnet tags + `guide-lp` so the warm-funnel
 *      nurture can target these leads distinctly),
 *   3. send the branded Resend guide-delivery email instantly,
 * and we do NOT create a Blueprint auth account. Accounts get created at
 * the $9.99 Map purchase (already wired in blueprint-site). The branded
 * /g/[slug]/ready page is the instant on-page delivery + Map offer, so the
 * user has the guide even if the email is delayed.
 *
 * Email-only opt-in: first_name is optional. When absent, the email greets
 * "there" and the GHL contact carries email only.
 */

// Same whitelist + caps as the starter-guide route, kept local so this
// endpoint has no dependency on that route's internals.
const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "referrer",
  "landing_url",
] as const;

function sanitizeAttribution(
  input: unknown
): Record<string, string> | undefined {
  if (!input || typeof input !== "object") return undefined;
  const src = input as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const v = src[key];
    if (typeof v === "string" && v.length > 0) out[key] = v.slice(0, 500);
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

// Minimal email validation. We intentionally don't reuse validateLead here
// because that requires first_name (this is an email-only opt-in).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function normalizeEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const e = input.trim().toLowerCase();
  if (e.length < 3 || e.length > 254 || !EMAIL_RE.test(e)) return null;
  return e;
}

function cleanName(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const n = input.trim().slice(0, 100);
  return n.length > 0 ? n : null;
}

// Phone is OPTIONAL on the warm-LP form. Normalize to E.164 so GHL/Twilio can
// text it. 10 digits -> +1XXXXXXXXXX; 11 starting with 1 -> +1...; a leading-+
// international number (8-15 digits) is kept. Anything else (blank, too short,
// junk) is treated as absent — we never block the opt-in on a bad phone.
function normalizePhone(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (input.trim().startsWith("+") && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }
  return null;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);

  const limit = await checkAndRecordRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again in an hour." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      }
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const body = raw as Record<string, unknown>;

  const email = normalizeEmail(body.email);
  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email." },
      { status: 400 }
    );
  }

  const slug = typeof body.magnet === "string" ? body.magnet : "";
  const magnet = getLeadMagnet(slug);
  if (!magnet) {
    return NextResponse.json(
      { ok: false, error: `Unknown guide: ${slug}` },
      { status: 400 }
    );
  }

  const firstName = cleanName(body.first_name);
  const phone = normalizePhone(body.phone);
  const source =
    typeof body.source === "string" && body.source.length > 0
      ? body.source.slice(0, 120)
      : `lp-${magnet.slug}`;
  const attribution = sanitizeAttribution(body.attribution);
  const timestamp = new Date().toISOString();

  // Same leads table + same form_type + same dedupe key as the existing
  // funnel, so a person who hit both surfaces in the same hour collapses to
  // one row. A genuine first insert returns the row; a same-hour duplicate
  // returns zero rows and we skip the fan-out (no double GHL tag, no double
  // email), still returning success so the page shows the normal state.
  const sb = getServiceSupabase();
  const { data: insertedRows, error: insertErr } = await sb
    .from("leads")
    .upsert(
      {
        form_type: `lead-magnet-${magnet.slug}`,
        email,
        first_name: firstName,
        last_name: null,
        phone,
        message: null,
        source,
        raw_payload: {
          source,
          magnet: magnet.slug,
          channel: "guide-lp",
          timestamp,
          ip,
          ...(attribution ? { attribution } : {}),
        },
      },
      { onConflict: "lower(email),form_type,dedupe_hour", ignoreDuplicates: true }
    )
    .select("id");

  if (insertErr) {
    console.error(`[guide-deliver:${magnet.slug}] supabase upsert failed`, insertErr);
  }

  const readUrl = guideDeliveryUrl(magnet);
  const isDuplicate = !insertErr && (!insertedRows || insertedRows.length === 0);
  if (isDuplicate) {
    console.info(
      `[guide-deliver:${magnet.slug}] duplicate within the hour for ${email} — skipping fan-out`
    );
    return NextResponse.json(
      { ok: true, magnet: magnet.slug, readUrl },
      { status: 200 }
    );
  }

  // New lead: tag in GHL (magnet tags + warm-funnel marker) and send the
  // branded delivery email. Both best-effort; the /ready page is the
  // instant guarantee, so neither blocks the user-facing success.
  const [ghlRes, emailRes] = await Promise.allSettled([
    upsertGhlContactWithTags(
      { email, firstName: firstName ?? undefined, phone: phone ?? undefined, source },
      // Strip `freeguide` on the warm-LP path: that tag enrolls contacts in the
      // OLD account-flow nurture, which assumes a Blueprint dashboard these
      // ad leads do not have (the funnel that converted ~0). The new warm-funnel
      // nurture triggers on `guide-lp` (all guides) / the guide slug instead, so
      // these leads enter ONLY the new path. The /guides hub + starter-guide
      // route are unchanged (they still use the full magnet.ghlTags).
      [...magnet.ghlTags.filter((t) => t !== "freeguide"), "guide-lp"]
    ),
    sendLeadMagnetEmail({ to: email, firstName, magnet }),
  ]);

  if (ghlRes.status === "rejected") {
    console.error(`[guide-deliver:${magnet.slug}] ghl upsert rejected=${String(ghlRes.reason)}`);
  } else if (!ghlRes.value.ok) {
    console.error(
      `[guide-deliver:${magnet.slug}] ghl upsert failed status=${ghlRes.value.status} error=${ghlRes.value.error}`
    );
  }
  if (emailRes.status === "rejected") {
    console.error(`[guide-deliver:${magnet.slug}] email rejected=${String(emailRes.reason)}`);
  } else if (!emailRes.value.ok) {
    console.warn(
      `[guide-deliver:${magnet.slug}] email not sent reason=${emailRes.value.reason}`
    );
  }

  return NextResponse.json({ ok: true, magnet: magnet.slug, readUrl }, { status: 200 });
}
