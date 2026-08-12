import { NextResponse } from "next/server";
import { validateLead } from "@/lib/lead-validation";
import { getServiceSupabase } from "@/lib/supabase-server";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rate-limit";
import { GHL_WEBHOOKS, postToGhl } from "@/lib/ghl-webhooks";
import { upsertGhlContactWithTags, GHL_TAGS } from "@/lib/ghl-proxy";
import { getLeadMagnet, magnetAbsoluteUrl } from "@/lib/lead-magnets";
import { recordFailure } from "@/lib/failure-log";

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

// Whitelisted attribution keys we accept from the client-side capture. Any
// other keys on the inbound `attribution` blob are dropped. Caps each value
// at 500 chars to keep raw_payload bounded — UTM values are normally <100,
// referrer URLs occasionally longer, but 500 is comfortable headroom without
// risking pathological payloads.
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
    if (typeof v === "string" && v.length > 0) {
      out[key] = v.slice(0, 500);
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

async function postToBlueprint(payload: {
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  source: string;
  /**
   * Optional lead-magnet slug. When present, blueprint-site routes the
   * welcome email through the magnet-aware template (adds a direct PDF
   * link to whichever magnet the user signed up for). When absent, the
   * standard Simple Blueprint activation email fires unchanged.
   */
  magnet?: string;
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

  // Lead-magnet branch detection. When body.magnet is a known LEAD_MAGNETS
  // slug, this is a NON-Blueprint-signup lead capture (just contact info
  // + PDF delivery). Skips postToBlueprint + the legacy starter-guide GHL
  // webhook, swaps in the magnet-specific GHL tag set, fires Resend email
  // with the PDF link. When body.magnet is undefined or "starter-guide",
  // behavior is unchanged from the original starter-guide flow.
  const requestedMagnetSlug =
    typeof body.magnet === "string" && body.magnet !== "starter-guide"
      ? body.magnet
      : null;
  const magnet = requestedMagnetSlug ? getLeadMagnet(requestedMagnetSlug) : null;
  if (requestedMagnetSlug && !magnet) {
    // Unknown magnet slug — reject so we don't silently mishandle.
    return NextResponse.json(
      { ok: false, error: `Unknown magnet: ${requestedMagnetSlug}` },
      { status: 400 }
    );
  }
  const isLeadMagnetFlow = magnet !== null;

  // UTM / ad attribution captured client-side from URL params + referrer at
  // /freeguide page load (see StarterGuideForm useEffect). Defensively keep
  // only string values, drop everything else (no XSS surface — this never
  // hits the rendered DOM, but keeps the JSONB column tidy and bounded).
  const attribution = sanitizeAttribution(body.attribution);

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
  // raw_payload includes the full GHL payload (for parity with the legacy
  // GHL fan-out) plus client IP and the optional ad-attribution blob from
  // the form submit (utm_*, fbclid, gclid, referrer, landing_url). Any
  // missing fields on the attribution blob are simply absent — never empty
  // strings — so organic leads are visually distinct from ad-driven leads
  // when querying raw_payload->>'attribution'.
  const formType = isLeadMagnetFlow
    ? `lead-magnet-${magnet!.slug}`
    : "starter-guide";

  // Idempotency guard. The endpoint gets hit twice per signup (a ~2s retry
  // on the slow downstream fan-out below), which previously wrote two leads
  // rows AND fired two Twilio "new signup" texts. A unique index on
  // (lower(email), form_type, dedupe_hour) backs this: upsert with
  // ignoreDuplicates returns the row on a genuine first insert and an EMPTY
  // result on a same-hour duplicate. We then ONLY run the Blueprint + GHL +
  // Twilio fan-out when a new row was actually created, so a retry/double-
  // submit produces exactly one row and one notification. A real re-signup
  // in a later hour still flows normally.
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
  const sb = getServiceSupabase();
  const { data: insertedRows, error: insertErr } = await sb
    .from("leads")
    .insert({
        // form_type distinguishes "starter-guide" (Blueprint signup flow)
        // from "lead-magnet-<slug>" (PDF-only capture). Same leads table,
        // different downstream nurture sequences depending on form_type.
        form_type: formType,
        email: lead.email,
        first_name: lead.first_name,
        last_name: lead.last_name,
        phone: lead.phone,
        message: null,
        source,
        raw_payload: {
          ...ghlPayload,
          ip,
          ...(attribution ? { attribution } : {}),
          ...(magnet ? { magnet: magnet.slug } : {}),
        },
    })
    .select("id");
  // A same-hour duplicate is normal traffic, not a failure. Alerting on it
  // would page Ryan every time someone double-submits a form.
  if (insertErr && insertErr.code !== "23505") {
    await recordFailure({
      route: isLeadMagnetFlow ? `lead-magnet:${magnet!.slug}` : "starter-guide",
      stage: "supabase-insert",
      code: insertErr.code,
      message: insertErr.message,
      email: lead.email,
      payload: {
        first_name: lead.first_name,
        last_name: lead.last_name,
        phone: lead.phone,
        form_type: formType,
        source,
      },
    });
  }

  // A same-hour duplicate returns zero rows. Skip the entire downstream
  // fan-out (Blueprint signup, GHL webhook, ghl-proxy tag, and the Twilio
  // SMS that fires inside Blueprint's notifyFreeSignup) so the duplicate is
  // silently absorbed: no second row, no second text. Still return success
  // so the user's form shows the normal confirmation.
  // 23505 = unique_violation from leads_dedupe_email_formtype_hour_idx, i.e.
  // this email already submitted this form inside the same hour. With a
  // plain insert that arrives as an error rather than as zero rows.
  const isDuplicate = insertErr?.code === "23505";
  if (isDuplicate) {
    console.info(
      `[${isLeadMagnetFlow ? `lead-magnet:${magnet!.slug}` : "starter-guide"}] duplicate within the hour for ${lead.email} — skipping fan-out`
    );
    if (isLeadMagnetFlow) {
      return NextResponse.json(
        {
          ok: true,
          message: "Check your inbox in the next minute.",
          magnet: magnet!.slug,
          downloadUrl: magnetAbsoluteUrl(magnet!),
        },
        { status: 200 }
      );
    }
    return SUCCESS;
  }

  // Branch fan-out. BOTH branches now run the full Blueprint signup
  // pipeline (postToBlueprint → /api/freeguide-signup creates the
  // activation token, sends the welcome email, fires Kit + Twilio +
  // legacy GHL webhook). Lead-magnet branch DIFFERENCES from starter-
  // guide branch:
  //   1. magnet slug propagated to blueprint-site so welcome email
  //      template adds a direct PDF link for the bonus magnet
  //   2. ghl-proxy upsert uses magnet.ghlTags (which include
  //      `freeguide` so the Free Guide nurture workflow fires the
  //      same as for /freeguide signups) PLUS `meta-lead`,
  //      `lead-source-rss-guides`, and the magnet slug for funnel-
  //      attribution segmentation
  //   3. rss-site's standalone GHL_WEBHOOKS.starterGuide is SKIPPED
  //      for the magnet flow — blueprint-site's legacy webhook fires
  //      from inside notifyFreeSignup, that's sufficient and avoids
  //      double-firing starter-guide-specific workflow tags onto a
  //      magnet contact.
  //
  // Each result variable is typed by inference from its source helper.

  type ProxyResult = Awaited<ReturnType<typeof upsertGhlContactWithTags>>;
  type BlueprintResult = Awaited<ReturnType<typeof postToBlueprint>>;
  type WebhookResult = Awaited<ReturnType<typeof postToGhl>>;

  let blueprintRes: PromiseSettledResult<BlueprintResult>;
  let ghlWebhookRes: PromiseSettledResult<WebhookResult> | null = null;
  let ghlProxyRes: PromiseSettledResult<ProxyResult>;

  if (isLeadMagnetFlow) {
    // Lead-magnet flow: Blueprint signup (with magnet hint for email
    // template) + ghl-proxy with the 4 magnet tags. No standalone
    // starter-guide webhook (avoids mistagging).
    const [bpResult, ghlProxyResult] = await Promise.allSettled([
      postToBlueprint({ ...blueprintPayload, magnet: magnet!.slug }),
      upsertGhlContactWithTags(
        {
          email: lead.email,
          firstName: lead.first_name,
          lastName: lead.last_name,
          phone: lead.phone,
          source,
        },
        magnet!.ghlTags
      ),
    ]);
    blueprintRes = bpResult;
    ghlProxyRes = ghlProxyResult;
  } else {
    // Original starter-guide flow — full Blueprint signup fan-out.
    // ghl-proxy is the future-state GHL write path per
    // memory/sop_ghl_operations.md; legacy webhook stays in parallel
    // during the May-15 migration verification window.
    const [bpResult, ghlWebhookResult, ghlProxyResult] =
      await Promise.allSettled([
        postToBlueprint(blueprintPayload),
        postToGhl(GHL_WEBHOOKS.starterGuide, ghlPayload),
        upsertGhlContactWithTags(
          {
            email: lead.email,
            firstName: lead.first_name,
            lastName: lead.last_name,
            phone: lead.phone,
            source,
          },
          [GHL_TAGS.LEAD_STARTER_GUIDE]
        ),
      ]);
    blueprintRes = bpResult;
    ghlWebhookRes = ghlWebhookResult;
    ghlProxyRes = ghlProxyResult;
  }

  // Log prefix differs per flow so Vercel grep separates the two cleanly.
  const logPrefix = isLeadMagnetFlow
    ? `lead-magnet:${magnet!.slug}`
    : "starter-guide";

  if (
    blueprintRes &&
    (blueprintRes.status === "rejected" ||
      (blueprintRes.status === "fulfilled" && !blueprintRes.value.ok))
  ) {
    const detail =
      blueprintRes.status === "fulfilled"
        ? `status=${blueprintRes.value.status} error=${blueprintRes.value.error ?? ""}`
        : `rejected=${String(blueprintRes.reason)}`;
    await recordFailure({
      route: logPrefix,
      stage: "blueprint-signup",
      message: detail,
      email: lead.email,
      payload: { first_name: lead.first_name, source },
    });
  }
  if (
    ghlWebhookRes &&
    (ghlWebhookRes.status === "rejected" ||
      (ghlWebhookRes.status === "fulfilled" && !ghlWebhookRes.value.ok))
  ) {
    const detail =
      ghlWebhookRes.status === "fulfilled"
        ? `status=${ghlWebhookRes.value.status} error=${ghlWebhookRes.value.error ?? ""}`
        : `rejected=${String(ghlWebhookRes.reason)}`;
    await recordFailure({
      route: logPrefix,
      stage: "ghl-webhook",
      message: detail,
      email: lead.email,
      payload: { first_name: lead.first_name, source },
    });
  }
  if (ghlProxyRes.status === "rejected") {
    await recordFailure({
      route: logPrefix,
      stage: "ghl-upsert",
      message: String(ghlProxyRes.reason),
      email: lead.email,
      payload: { first_name: lead.first_name, source },
    });
  } else if (!ghlProxyRes.value.ok) {
    await recordFailure({
      route: logPrefix,
      stage: "ghl-upsert",
      code: ghlProxyRes.value.status,
      message: ghlProxyRes.value.error,
      email: lead.email,
      payload: { first_name: lead.first_name, source },
    });
  } else {
    // Success path — log contactId so we can correlate with GHL UI when
    // verifying. Drop this log line after Phase 5 verification.
    console.info(
      `[${logPrefix}] ghl-proxy upsert+tag ok contactId=${ghlProxyRes.value.contactId}`
    );
  }

  // Lead-magnet flow returns a magnet-specific success payload so the
  // form can surface the canonical PDF URL on the "Download Now" button.
  // (The client form already has magnet.pdfPath from the registry, but
  // returning the absolute URL here means future surfaces — e.g. an
  // external embed — don't need their own registry lookup.)
  if (isLeadMagnetFlow) {
    return NextResponse.json(
      {
        ok: true,
        message: "Check your inbox in the next minute.",
        magnet: magnet!.slug,
        downloadUrl: magnetAbsoluteUrl(magnet!),
      },
      { status: 200 }
    );
  }

  return SUCCESS;
}
