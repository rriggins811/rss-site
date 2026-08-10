import { NextResponse } from "next/server";
import { validateLead } from "@/lib/lead-validation";
import { getServiceSupabase } from "@/lib/supabase-server";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  upsertGhlContactWithTags,
  readinessBand,
  readinessTags,
} from "@/lib/ghl-proxy";
import { sendReadinessResultsEmail } from "@/lib/email/readiness-results";

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
 * On a successful capture this does two things: sends the results email via
 * Resend, and upserts the GHL contact with a lead tag plus one band tag.
 *
 * The email is sent HERE rather than left to a GHL workflow. The form promises
 * results the instant they submit, so this request has to keep that promise on
 * its own. The GHL tags remain the hook for whatever nurture Ryan builds later.
 *
 * Deliberately NOT wired to GHL_WEBHOOKS.starterGuide: that webhook fires the
 * Simple Blueprint nurture, which is the wrong sequence for this audience and
 * would double-enroll anyone who already has it.
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

  // Plain insert, NOT upsert(onConflict). PostgREST resolves on_conflict
  // against real column names, so passing the expression index target
  // "lower(email),..." makes it look for a column literally named "lower"
  // and the write fails with 42703. Instead we let the existing unique index
  // leads_dedupe_email_formtype_hour_idx do its job and treat a unique
  // violation (23505) as the duplicate signal. Emails are already lowercased
  // by validateLead, so lower(email) and email agree for every row we write.
  const sb = getServiceSupabase();
  const { data: insertedRows, error: insertErr } = await sb
    .from("leads")
    .insert({
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
    })
    .select("id");

  // 23505 = unique_violation, i.e. this email already submitted this hour.
  const isDuplicate = insertErr?.code === "23505";

  if (insertErr && !isDuplicate) {
    console.error("[readiness-results] supabase insert failed", insertErr);
    // Keep going. A Supabase hiccup should not cost them the email.
  }
  if (!insertErr && (!insertedRows || insertedRows.length === 0)) {
    console.warn("[readiness-results] insert returned no rows");
  }

  if (!isDuplicate) {
    // Send the results ourselves rather than depending on a GHL workflow.
    // The form promises "email me my results" the moment they submit, so the
    // promise has to be kept by this request, not by automation that may not
    // be built yet. Best-effort: a send failure is logged, never surfaced.
    const sent = await sendReadinessResultsEmail({
      to: lead.email,
      firstName: lead.first_name,
      score,
      band,
      pillars: pillars ?? null,
    });
    if (!sent.ok) {
      console.error("[readiness-results] results email not sent:", sent.reason);
    }

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
