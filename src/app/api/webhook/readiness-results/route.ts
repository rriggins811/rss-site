import { NextResponse } from "next/server";
import { validateLead } from "@/lib/lead-validation";
import { getServiceSupabase } from "@/lib/supabase-server";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  upsertGhlContactWithTags,
  readinessBand,
  readinessTags,
} from "@/lib/ghl-proxy";

export const runtime = "nodejs";

/**
 * Optional "email me my results" capture on /tools/family-readiness-score.
 *
 * The tool is NOT gated: the family sees their full score, pillar breakdown,
 * and next steps before this form ever appears. This endpoint only exists for
 * the ones who want the results sent to them. That distinction matters because
 * both the tool copy and the /tools registry advertise "no email required",
 * and that claim has to stay true.
 *
 * Deliberately NOT wired to GHL_WEBHOOKS.starterGuide: that webhook fires the
 * Simple Blueprint nurture, which is the wrong sequence for this audience and
 * would double-enroll anyone who already has it. Instead the contact is
 * upserted with a lead tag plus one readiness band tag, and Ryan builds the
 * nurture in GHL against a tag-added trigger.
 *
 * Band is derived from the score HERE, never taken from the request body, so a
 * forged payload can't drop someone into the wrong sequence.
 */

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

function sanitizeAttribution(input: unknown): Record<string, string> | undefined {
  if (!input || typeof input !== "object") return undefined;
  const src = input as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const v = src[key];
    if (typeof v === "string" && v.length > 0) out[key] = v.slice(0, 500);
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * Per-pillar breakdown, e.g. {housing: 12, finances: 8}. Kept as plain
 * number pairs and capped so a hostile payload can't bloat raw_payload.
 */
function sanitizePillars(input: unknown): Record<string, number> | undefined {
  if (!input || typeof input !== "object") return undefined;
  const src = input as Record<string, unknown>;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(src).slice(0, 12)) {
    if (typeof v === "number" && Number.isFinite(v)) {
      out[k.slice(0, 40)] = Math.round(v);
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  // Honeypot. The form ships a hidden field real people never fill in.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    // Pretend it worked so the bot doesn't retry with a different shape.
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const ip = getClientIp(req);
  const limit = await checkAndRecordRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const validated = validateLead({
    first_name: body.first_name,
    email: body.email,
  });
  if (!validated.ok) {
    return NextResponse.json(
      { ok: false, error: validated.error },
      { status: 400 }
    );
  }
  const lead = validated.value;

  const rawScore = typeof body.score === "number" ? body.score : Number.NaN;
  if (!Number.isFinite(rawScore) || rawScore < 0 || rawScore > 100) {
    return NextResponse.json(
      { ok: false, error: "Invalid score." },
      { status: 400 }
    );
  }
  const score = Math.round(rawScore);
  const band = readinessBand(score);

  const attribution = sanitizeAttribution(body.attribution);
  const pillars = sanitizePillars(body.pillars);
  const source = "tools/family-readiness-score";

  // Same dedupe contract as the starter-guide route: the unique index on
  // (lower(email), form_type, dedupe_hour) means a double-submit inside the
  // same hour produces exactly one row and one GHL write.
  const sb = getServiceSupabase();
  const { data: insertedRows, error: insertErr } = await sb
    .from("leads")
    .upsert(
      {
        form_type: "tool-family-readiness-score",
        email: lead.email,
        first_name: lead.first_name,
        last_name: null,
        phone: null,
        message: null,
        source,
        raw_payload: {
          score,
          band,
          ip,
          ...(pillars ? { pillars } : {}),
          ...(attribution ? { attribution } : {}),
        },
      },
      { onConflict: "lower(email),form_type,dedupe_hour", ignoreDuplicates: true }
    )
    .select("id");

  if (insertErr) {
    console.error("[readiness-results] supabase upsert failed", insertErr);
    // Keep going. A Supabase hiccup should not cost us the GHL contact.
  }

  const isDuplicate = !insertErr && (!insertedRows || insertedRows.length === 0);

  if (!isDuplicate) {
    const ghl = await upsertGhlContactWithTags(
      {
        email: lead.email,
        firstName: lead.first_name,
        source,
      },
      readinessTags(band)
    );
    if (!ghl.ok) {
      console.error("[readiness-results] GHL upsert failed", ghl.status, ghl.error);
    }
  }

  // Always a 200 to the family. Downstream plumbing is our problem, not
  // something to surface as a scary error under their assessment results.
  return NextResponse.json(
    { ok: true, message: "Sent. Check your inbox in the next few minutes." },
    { status: 200 }
  );
}
