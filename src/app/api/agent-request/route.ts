import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rate-limit";
import { upsertGhlContact, upsertGhlContactWithTags, callGhlProxy } from "@/lib/ghl-proxy";
import { recordFailure } from "@/lib/failure-log";

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

// Live Referral Pipeline (verified 2026-09-02). New form cards land in
// Conversation; Ryan moves to Ask made when he actually asks about an agent.
const GHL_LOCATION_ID = "qvSvBqNwvDLyqkKoZXl2";
const REFERRAL_PIPELINE_ID = "sz73r9OshVDdLxy3bEVc";
const STAGE_CONVERSATION_ID = "0675a5ad-cd1b-45cb-b37c-ecaf3858530b";

function str(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** ASCII-only card title. Em dashes broke voice rules and showed up in the
 *  2026-08-21 failing payloads; keep GHL names plain. */
function opportunityName(who: string, urgent: boolean): string {
  return urgent
    ? `${who} - Agent request (OFFER ON TABLE)`
    : `${who} - Agent request`;
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
    if (error) {
      await recordFailure({
        route: "agent-request",
        stage: "supabase-insert",
        code: error.code,
        message: error.message,
        email,
        payload: { firstName, lastName, phone, location, timeline, offer, urgent },
      });
    }
  } catch (err) {
    await recordFailure({
      route: "agent-request",
      stage: "supabase-insert",
      message: err instanceof Error ? err.message : "threw",
      email,
      payload: { firstName, lastName, phone, location, timeline, offer, urgent },
    });
  }

  // 2. Tag in GHL. `agent-request-urgent` is what makes an offer-on-the-table
  //    request reachable in hours instead of days.
  const tags = ["in-your-corner-request", "stage-new-lead"];
  if (urgent) tags.push("agent-request-urgent");

  let contactId: string | null = null;
  try {
    const res = await upsertGhlContactWithTags(
      { email, firstName, lastName, phone, source: "need-an-agent" },
      tags
    );
    if (!res.ok) {
      await recordFailure({
        route: "agent-request",
        stage: "ghl-upsert",
        code: res.status,
        message: res.error,
        email,
        payload: { firstName, lastName, phone, tags },
      });
    } else {
      contactId = res.contactId;
    }
  } catch (err) {
    await recordFailure({
      route: "agent-request",
      stage: "ghl-upsert",
      message: err instanceof Error ? err.message : "threw",
      email,
      payload: { firstName, lastName, phone, tags },
    });
  }

  // 3. Referral Pipeline card. Same board as other family referral work.
  //    Partner Pipeline is the other direction (pros sending Ryan leads).
  const who = [firstName, lastName].filter(Boolean).join(" ") || email;
  const cardName = opportunityName(who, urgent);

  try {
    // The opportunity API requires a real contactId; without one GHL rejects
    // the card and the request only ever existed as a tagged contact.
    if (!contactId) throw new Error("no contactId from upsert; skipping pipeline card");

    const oppBody = {
      locationId: GHL_LOCATION_ID,
      pipelineId: REFERRAL_PIPELINE_ID,
      pipelineStageId: STAGE_CONVERSATION_ID,
      name: cardName,
      status: "open" as const,
      contactId,
      monetaryValue: 0,
    };

    const opp = await callGhlProxy({
      action: "post",
      // Trailing slash matches LeadConnector create-opportunity docs.
      path: "/opportunities/",
      body: oppBody,
    });
    if (!opp.ok) {
      await recordFailure({
        route: "agent-request",
        stage: "ghl-opportunity",
        code: String(opp.status),
        message: String(opp.error),
        email,
        payload: {
          cardName,
          urgent,
          contactId,
          pipelineId: REFERRAL_PIPELINE_ID,
          pipelineStageId: STAGE_CONVERSATION_ID,
          locationId: GHL_LOCATION_ID,
          // Surface GHL's validation body; Aug 21 alerts only had "ghl http 400".
          ghlBody: "body" in opp ? opp.body : undefined,
        },
      });
    }
  } catch (err) {
    await recordFailure({
      route: "agent-request",
      stage: "ghl-opportunity",
      message: err instanceof Error ? err.message : "threw",
      email,
      payload: {
        cardName,
        urgent,
        contactId,
        pipelineId: REFERRAL_PIPELINE_ID,
        pipelineStageId: STAGE_CONVERSATION_ID,
      },
    });
  }

  // 4. Rich notification email to Ryan. The existing GHL workflow already
  //    texts his cell on the tags; this carries the detail the texts lack.
  try {
    const notif = await upsertGhlContact({
      email: "ryan@rigginsstrategicsolutions.com",
      firstName: "RSS",
      lastName: "Notifications",
      source: "internal-notifications",
    });
    if (notif.ok) {
      const lines = [
        `Name: ${who}`,
        `Email: ${email}`,
        `Phone: ${phone || "(none given)"}`,
        `Location: ${location || "(blank)"}`,
        `Timeline: ${timeline || "(blank)"}`,
        `Offer status: ${offer || "(blank)"}${urgent ? "  <b>*** OFFER ON THE TABLE ***</b>" : ""}`,
        `Notes: ${notes || "(none)"}`,
      ];
      await callGhlProxy({
        action: "post",
        path: "/conversations/messages",
        body: {
          type: "Email",
          contactId: notif.contactId,
          subject: urgent
            ? `AGENT REQUEST (OFFER ON TABLE): ${who}`
            : `Agent request: ${who}`,
          html: `<p>New request from /need-an-agent.</p><p>${lines.join("<br/>")}</p><p>Card is on the Referral Pipeline (Conversation stage).${phone ? " They get an automatic text from your GHL number in 10 minutes; beat it with a call if you can." : ""}</p>`,
        },
        injectLocation: false,
      });
    }
  } catch (err) {
    await recordFailure({
      route: "agent-request",
      stage: "notify-email",
      message: err instanceof Error ? err.message : "threw",
      email,
    });
  }

  // 5. The 10-minute text to the lead, scheduled through GHL so it sends
  //    even if this server never hears from them again. Only when they gave
  //    a phone number on a form whose promise is that Ryan will reach out.
  if (contactId && phone) {
    try {
      const first = firstName || "there";
      const leadText = urgent
        ? `Hi ${first}, Ryan Riggins with Riggins Strategic Solutions. I got your note from my website and saw someone is pushing you on the house. Please don't sign anything yet. I'm looking at it now and will call you shortly. You can call or text me right here anytime.`
        : `Hi ${first}, Ryan Riggins with Riggins Strategic Solutions. I got your note from my website about finding the right agent. I'm on it and will reach out within one business day. If anything changes in the meantime, call or text me right here.`;
      await callGhlProxy({
        action: "post",
        path: "/conversations/messages",
        body: {
          type: "SMS",
          contactId,
          message: leadText,
          scheduledTimestamp: Math.floor(Date.now() / 1000) + 10 * 60,
        },
        injectLocation: false,
      });
    } catch (err) {
      await recordFailure({
        route: "agent-request",
        stage: "lead-sms-schedule",
        message: err instanceof Error ? err.message : "threw",
        email,
      });
    }
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
