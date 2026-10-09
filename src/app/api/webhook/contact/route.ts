import { NextResponse } from "next/server";
import { validateLead } from "@/lib/lead-validation";
import { getServiceSupabase } from "@/lib/supabase-server";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rate-limit";
import { GHL_WEBHOOKS, postToGhl } from "@/lib/ghl-webhooks";
import { recordFailure } from "@/lib/failure-log";
import { callGhlProxy, upsertGhlContactWithTags } from "@/lib/ghl-proxy";

export const runtime = "nodejs";

// Same whitelist + caps as the guide-deliver route, kept local so this
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

const SUCCESS = NextResponse.json(
  { ok: true, message: "Got it. Ryan will reply within one business day." },
  { status: 200 }
);

export async function POST(req: Request) {
  const ip = getClientIp(req);

  const limit = await checkAndRecordRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again in an hour." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
  if (!raw || typeof raw !== "object") {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  const body = raw as Record<string, unknown>;
  const source = typeof body.source === "string" ? body.source : "website-contact";
  const tag = typeof body.tag === "string" ? body.tag : "website-contact-form";

  const result = validateLead(body, { requireMessage: true });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  const lead = result.value;

  const timestamp = new Date().toISOString();

  const ghlPayload = {
    email: lead.email,
    first_name: lead.first_name,
    last_name: lead.last_name ?? "",
    phone: lead.phone ?? "",
    message: lead.message ?? "",
    source,
    tag,
    timestamp,
  };

  const sb = getServiceSupabase();
  const { error: insertErr } = await sb.from("leads").insert({
    form_type: "contact",
    email: lead.email,
    first_name: lead.first_name,
    last_name: lead.last_name,
    phone: lead.phone,
    message: lead.message,
    source,
    raw_payload: { ...ghlPayload, ip },
  });

  if (insertErr) {
    await recordFailure({
      route: "contact",
      stage: "supabase-insert",
      code: insertErr.code,
      message: insertErr.message,
      email: lead.email,
      payload: {
        first_name: lead.first_name,
        last_name: lead.last_name,
        phone: lead.phone,
        message: lead.message,
      },
    });
  }

  const ghl = await postToGhl(GHL_WEBHOOKS.contact, ghlPayload);
  if (!ghl.ok) {
    await recordFailure({
      route: "contact",
      stage: "ghl-webhook",
      code: ghl.status,
      message: ghl.error ?? "non-ok response",
      email: lead.email,
      payload: ghlPayload,
    });
  }

  // The inbound webhook above has no workflow listening (found 10/9/2026), so
  // it never created the contact. Upsert directly so the contact exists and
  // the tag fires "RSS: New lead alert". The tag comes from the client, so
  // only website-contact* values are accepted.
  const safeTag = /^website-contact[a-z0-9-]*$/.test(tag) ? tag : "website-contact-form";
  try {
    const up = await upsertGhlContactWithTags(
      {
        email: lead.email,
        firstName: lead.first_name,
        lastName: lead.last_name,
        phone: lead.phone,
        source,
        attribution: sanitizeAttribution(body.attribution),
      },
      [safeTag, "stage-new-lead"]
    );
    if (!up.ok) {
      await recordFailure({
        route: "contact",
        stage: "ghl-upsert",
        code: up.status,
        message: up.error,
        email: lead.email,
        payload: ghlPayload,
      });
    } else if (lead.message) {
      const note = await callGhlProxy({
        action: "post",
        path: `/contacts/${encodeURIComponent(up.contactId)}/notes`,
        body: { body: `Website contact form (${source}):\n\n${lead.message}` },
        injectLocation: false,
      });
      if (!note.ok) {
        await recordFailure({
          route: "contact",
          stage: "ghl-upsert",
          code: note.status,
          message: `note: ${note.error}`,
          email: lead.email,
          payload: ghlPayload,
        });
      }
    }
  } catch (err) {
    await recordFailure({
      route: "contact",
      stage: "ghl-upsert",
      message: err instanceof Error ? err.message : "threw",
      email: lead.email,
      payload: ghlPayload,
    });
  }

  return SUCCESS;
}
