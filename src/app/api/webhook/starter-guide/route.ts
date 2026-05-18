import { NextResponse } from "next/server";
import { validateLead } from "@/lib/lead-validation";
import { getServiceSupabase } from "@/lib/supabase-server";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rate-limit";
import { GHL_WEBHOOKS, postToGhl } from "@/lib/ghl-webhooks";
import { upsertGhlContactWithTags, GHL_TAGS } from "@/lib/ghl-proxy";
import { getLeadMagnet, magnetAbsoluteUrl } from "@/lib/lead-magnets";
import { sendLeadMagnetEmail } from "@/lib/email/lead-magnets";

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
  const sb = getServiceSupabase();
  const { error: insertErr } = await sb.from("leads").insert({
    // form_type distinguishes "starter-guide" (Blueprint signup flow) from
    // "lead-magnet-<slug>" (PDF-only capture). Same leads table, different
    // downstream nurture sequences depending on form_type.
    form_type: isLeadMagnetFlow ? `lead-magnet-${magnet!.slug}` : "starter-guide",
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
  });
  if (insertErr) {
    console.error(
      `[${isLeadMagnetFlow ? "lead-magnet" : "starter-guide"}] supabase insert failed`,
      insertErr
    );
  }

  // Branch fan-out based on whether this is a Blueprint starter-guide
  // signup (full auth-user creation + Kit + Twilio + magic link flow) or
  // a simpler PDF lead-magnet capture (contact + tag + PDF email only).
  //
  // Lead-magnet branch is intentionally NARROWER: no Blueprint signup
  // (the user didn't sign up for a course), no Kit fan-out (Kit is in
  // teardown per the May-15 GHL pivot — Phase 6 still gated on Monday),
  // and uses the magnet's own GHL tag set so downstream nurture
  // workflows can segment per magnet.
  //
  // Each result variable is typed by inference from its source helper —
  // a single unified shape would require either an awkward common
  // discriminated union or `unknown`, both worse than per-branch infer.

  type ProxyResult = Awaited<ReturnType<typeof upsertGhlContactWithTags>>;
  type EmailResult = Awaited<ReturnType<typeof sendLeadMagnetEmail>>;
  type BlueprintResult = Awaited<ReturnType<typeof postToBlueprint>>;
  type WebhookResult = Awaited<ReturnType<typeof postToGhl>>;

  let blueprintRes: PromiseSettledResult<BlueprintResult> | null = null;
  let ghlWebhookRes: PromiseSettledResult<WebhookResult> | null = null;
  let ghlProxyRes: PromiseSettledResult<ProxyResult>;
  let emailRes: PromiseSettledResult<EmailResult> | null = null;

  if (isLeadMagnetFlow) {
    // PDF lead-magnet flow: ghl-proxy with magnet-specific tags + Resend
    // delivery email. Best-effort, fire-and-forget Promise.allSettled.
    const [proxyResult, emailResult] = await Promise.allSettled([
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
      sendLeadMagnetEmail({
        to: lead.email,
        firstName: lead.first_name,
        magnet: magnet!,
      }),
    ]);
    ghlProxyRes = proxyResult;
    emailRes = emailResult;
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
    console.error(`[${logPrefix}] Blueprint POST failed ${detail}`);
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
    console.error(`[${logPrefix}] GHL legacy webhook POST failed ${detail}`);
  }
  if (emailRes) {
    if (emailRes.status === "rejected") {
      console.error(
        `[${logPrefix}] resend email rejected=${String(emailRes.reason)}`
      );
    } else if (!emailRes.value.ok) {
      console.warn(
        `[${logPrefix}] resend email skipped/failed reason=${emailRes.value.reason}`
      );
    } else {
      console.info(
        `[${logPrefix}] resend email ok id=${emailRes.value.id ?? "?"}`
      );
    }
  }
  if (ghlProxyRes.status === "rejected") {
    console.error(
      `[${logPrefix}] ghl-proxy upsert+tag rejected=${String(ghlProxyRes.reason)}`
    );
  } else if (!ghlProxyRes.value.ok) {
    console.error(
      `[${logPrefix}] ghl-proxy upsert+tag failed status=${ghlProxyRes.value.status} error=${ghlProxyRes.value.error}`
    );
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
