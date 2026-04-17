import { NextResponse } from "next/server";
import { validateLead } from "@/lib/lead-validation";
import { getServiceSupabase } from "@/lib/supabase-server";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rate-limit";
import { GHL_WEBHOOKS, postToGhl } from "@/lib/ghl-webhooks";

export const runtime = "nodejs";

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
    console.error("[contact] supabase insert failed", insertErr);
  }

  const ghl = await postToGhl(GHL_WEBHOOKS.contact, ghlPayload);
  if (!ghl.ok) {
    console.error(
      `[contact] GHL POST failed status=${ghl.status} error=${ghl.error ?? ""}`
    );
  }

  return SUCCESS;
}
