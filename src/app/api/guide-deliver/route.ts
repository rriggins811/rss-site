import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rate-limit";
import { upsertGhlContactWithTags } from "@/lib/ghl-proxy";
import { getLeadMagnet, guideDeliveryUrl } from "@/lib/lead-magnets";
import { sendLeadMagnetEmail } from "@/lib/email/lead-magnets";
import { recordFailure } from "@/lib/failure-log";

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
 * the free Blueprint signup on blueprint-site. The branded
 * /g/[slug]/ready page is the instant on-page delivery + free Map/Blueprint
 * nudge, so the user has the guide even if the email is delayed.
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
  // Plain insert, NOT upsert(onConflict). PostgREST resolves on_conflict
  // against real column names, so the expression-index target
  // "lower(email),form_type,dedupe_hour" makes it look for a column literally
  // named "lower" and the whole write fails with 42703. Verified against the
  // live database on Aug 12 2026: this exact call returns
  // 400 "column \"lower\" does not exist" today. It used to work, so a
  // PostgREST change between Aug 9 and Aug 10 2026 broke it, and because the
  // error was only logged the routes went on silently losing every row.
  //
  // The unique index leads_dedupe_email_formtype_hour_idx still enforces
  // dedupe, so a same-hour duplicate surfaces as a 23505 unique violation and
  // is treated as the duplicate signal. validateLead lowercases every email,
  // so lower(email) and email agree for every row written here.
  const { data: insertedRows, error: insertErr } = await sb
    .from("leads")
    .insert({
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
    })
    .select("id");

  // A same-hour duplicate is normal traffic, not a failure. Alerting on it
  // would page Ryan every time someone double-submits a form.
  if (insertErr && insertErr.code !== "23505") {
    await recordFailure({
      route: `guide-deliver:${magnet.slug}`,
      stage: "supabase-insert",
      code: insertErr.code,
      message: insertErr.message,
      email,
      payload: { firstName, phone, magnet: magnet.slug, source },
    });
  }

  const readUrl = guideDeliveryUrl(magnet);
  // 23505 = unique_violation from leads_dedupe_email_formtype_hour_idx, i.e.
  // this email already submitted this form inside the same hour. With a
  // plain insert that arrives as an error rather than as zero rows.
  const isDuplicate = insertErr?.code === "23505";
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

  const magnetFailurePayload = { firstName, phone, magnet: magnet.slug };
  if (ghlRes.status === "rejected") {
    await recordFailure({
      route: `guide-deliver:${magnet.slug}`,
      stage: "ghl-upsert",
      message: String(ghlRes.reason),
      email,
      payload: magnetFailurePayload,
    });
  } else if (!ghlRes.value.ok) {
    await recordFailure({
      route: `guide-deliver:${magnet.slug}`,
      stage: "ghl-upsert",
      code: ghlRes.value.status,
      message: ghlRes.value.error,
      email,
      payload: magnetFailurePayload,
    });
  }
  if (emailRes.status === "rejected") {
    await recordFailure({
      route: `guide-deliver:${magnet.slug}`,
      stage: "email-send",
      message: String(emailRes.reason),
      email,
      payload: magnetFailurePayload,
    });
  } else if (!emailRes.value.ok) {
    await recordFailure({
      route: `guide-deliver:${magnet.slug}`,
      stage: "email-send",
      message: emailRes.value.reason,
      email,
      payload: magnetFailurePayload,
    });
  }

  return NextResponse.json({ ok: true, magnet: magnet.slug, readUrl }, { status: 200 });
}
