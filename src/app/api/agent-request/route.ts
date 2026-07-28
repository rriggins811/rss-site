import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rate-limit";
import { upsertGhlContactWithTags } from "@/lib/ghl-proxy";

// "I just need an agent" request, from /need-an-agent.
//
// This is the highest-intent form on the site. It is the only page that
// leads directly to a paid referral, so the ordering matters: Supabase
// insert FIRST so a request can never be lost, then the GHL tag.
//
// Anyone answering "yes, an offer is on the table" is time-critical. That
// flag rides through on the tag so the GHL workflow can treat them
// differently from someone who is a year out.

export const runtime = "nodejs";

const OFFER_VALUES = ["none", "letters", "pushing", "signed"] as const;
const TIMELINE_VALUES = ["now", "3-6", "6-12", "exploring"] as const;

function str(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
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
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const b = raw as Record<string, unknown>;
  const firstName = str(b.first_name, 80);
  const lastName = str(b.last_name, 80);
  const email = str(b.email, 160).toLowerCase();
  const phone = str(b.phone, 40);
  const location = str(b.location, 120);
  const timeline = str(b.timeline, 40);
  const offer = str(b.offer, 40);
  const notes = str(b.notes, 2000);

  if (!firstName) {
    return NextResponse.json({ ok: false, error: "First name is required." }, { status: 400 });
  }
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }

  const urgent = offer === "pushing" || offer === "signed";

  // 1. Persist first. A referral request is worth too much to lose to a
  //    downstream timeout.
  try {
    const sb = getServiceSupabase();
    const { error } = await sb.from("leads").insert({
      first_name: firstName,
      last_name: lastName || null,
      email,
      phone: phone || null,
      form_type: "agent-request",
      source: "need-an-agent",
      raw_payload: {
        location,
        timeline: TIMELINE_VALUES.includes(timeline as never) ? timeline : null,
        offer: OFFER_VALUES.includes(offer as never) ? offer : null,
        notes,
        urgent,
        ip,
      },
    });
    if (error) console.error("[agent-request] supabase insert failed", error);
  } catch (err) {
    console.error("[agent-request] supabase threw", err);
  }

  // 2. Tag in GHL. `agent-request-urgent` is what makes an offer-on-the-table
  //    request reachable in hours instead of days.
  const tags = ["in-your-corner-request", "stage-new-lead"];
  if (urgent) tags.push("agent-request-urgent");

  try {
    const res = await upsertGhlContactWithTags(
      { email, firstName, lastName, phone, source: "need-an-agent" },
      tags
    );
    if (!res.ok) console.error("[agent-request] ghl upsert failed", res.status, res.error);
  } catch (err) {
    console.error("[agent-request] ghl threw", err);
  }

  return NextResponse.json(
    {
      ok: true,
      message: urgent
        ? "Got it, and I saw that someone is pushing you. I'll reach out today."
        : "Got it. I'll be in touch within one business day.",
    },
    { status: 200 }
  );
}
