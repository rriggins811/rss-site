import { NextResponse } from "next/server";
import { validateLead } from "@/lib/lead-validation";
import { getServiceSupabase } from "@/lib/supabase-server";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rate-limit";
import { GHL_WEBHOOKS, postToGhl } from "@/lib/ghl-webhooks";

export const runtime = "nodejs";

// Per SYSTEM_ARCHITECTURE.md, RSS form submissions now flow primarily to the
// Blueprint freeguide-signup endpoint (creates Supabase auth user with free
// course_access, sends magic link, fires Kit + Twilio). The legacy GHL POST
// runs in parallel as redundancy for the transition window (sunsets June 22).
const BLUEPRINT_FREESIGNUP_URL =
  "https://blueprint.rigginsstrategicsolutions.com/api/freeguide-signup";

const SUCCESS = NextResponse.json(
  { ok: true, message: "Thanks. Check your inbox in the next minute." },
  { status: 200 }
);

async function postToBlueprint(payload: {
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  source: string;
}): Promise<{ ok: boolean; status: number; error?: string }> {
  try {
    const res = await fetch(BLUEPRINT_FREESIGNUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

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
  const source = typeof body.source === "string" ? body.source : "website-freeguide";

  const result = validateLead(body);
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
    source,
    tag: "simple-blueprint-requested",
    timestamp,
  };

  const blueprintPayload = {
    email: lead.email,
    firstName: lead.first_name,
    lastName: lead.last_name ?? "",
    phone: lead.phone ?? undefined,
    source,
  };

  // Durable backup row in Supabase (same project as Blueprint, shared leads
  // table). Even if both downstreams fail, we don't lose the lead.
  const sb = getServiceSupabase();
  const { error: insertErr } = await sb.from("leads").insert({
    form_type: "starter-guide",
    email: lead.email,
    first_name: lead.first_name,
    last_name: lead.last_name,
    phone: lead.phone,
    message: null,
    source,
    raw_payload: { ...ghlPayload, ip },
  });
  if (insertErr) {
    console.error("[starter-guide] supabase insert failed", insertErr);
  }

  // Fan out to Blueprint (primary) + GHL (legacy redundancy) in parallel.
  // Promise.allSettled so one failure never blocks the other.
  const [blueprintRes, ghlRes] = await Promise.allSettled([
    postToBlueprint(blueprintPayload),
    postToGhl(GHL_WEBHOOKS.starterGuide, ghlPayload),
  ]);

  if (
    blueprintRes.status === "rejected" ||
    (blueprintRes.status === "fulfilled" && !blueprintRes.value.ok)
  ) {
    const detail =
      blueprintRes.status === "fulfilled"
        ? `status=${blueprintRes.value.status} error=${blueprintRes.value.error ?? ""}`
        : `rejected=${String(blueprintRes.reason)}`;
    console.error(`[starter-guide] Blueprint POST failed ${detail}`);
  }
  if (
    ghlRes.status === "rejected" ||
    (ghlRes.status === "fulfilled" && !ghlRes.value.ok)
  ) {
    const detail =
      ghlRes.status === "fulfilled"
        ? `status=${ghlRes.value.status} error=${ghlRes.value.error ?? ""}`
        : `rejected=${String(ghlRes.reason)}`;
    console.error(`[starter-guide] GHL POST failed ${detail}`);
  }

  return SUCCESS;
}
