/**
 * GHL API access via the `ghl-proxy` Supabase Edge Function.
 *
 * Per memory/sop_ghl_operations.md (locked May 14, 2026), all GHL writes
 * go through this proxy. The real GHL Private Integration Token lives as
 * a Supabase Edge Function secret (`GHL_PIT_TOKEN`) and never sits in
 * any sandbox, repo, or Vercel env. The proxy call is authenticated with
 * the Supabase service-role key (server-side only, never shipped to the
 * client). The proxy rejects any other key (2026-05-29 security audit).
 *
 * Allowed write paths (enforced by the proxy):
 *   /contacts, /contacts/upsert, /contacts/tags,
 *   /conversations/messages, /calendars, /opportunities,
 *   contact-scoped /contacts/{id}/{tags|notes|workflow}
 *
 * Reads (`get`) are unrestricted by path. The proxy auto-injects
 * locationId on `get`/`post` unless `inject_location: false` is passed.
 */

const GHL_PROXY_TIMEOUT_MS = 10_000;

type GhlProxyAction = "get" | "post" | "put" | "delete";

type GhlProxyResult<T = unknown> =
  | { ok: true; status: number; body: T }
  | { ok: false; status: number; error: string; body?: unknown };

function getProxyEndpoint(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL not set");
  return `${url}/functions/v1/ghl-proxy`;
}

function getProxyAuthKey(): string {
  // Server-side only. The ghl-proxy Edge Function authenticates callers by
  // the Supabase service-role key (2026-05-29 security audit: the proxy was
  // previously an open relay that accepted the public anon key, exposing the
  // CRM). This module is imported only by server routes, so the key never
  // reaches the client bundle.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
  return key;
}

/**
 * Low-level proxy call. Most callers should use the higher-level helpers
 * below (upsertContact, addTagToContact) which encode the SOP-locked tag
 * taxonomy and contact-shape conventions.
 */
export async function callGhlProxy<T = unknown>(args: {
  action: GhlProxyAction;
  path: string;
  body?: unknown;
  /** Set false to suppress the proxy's auto-injection of locationId. */
  injectLocation?: boolean;
}): Promise<GhlProxyResult<T>> {
  let endpoint: string;
  let authKey: string;
  try {
    endpoint = getProxyEndpoint();
    authKey = getProxyAuthKey();
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: args.action,
        path: args.path,
        body: args.body,
        ...(args.injectLocation === false ? { inject_location: false } : {}),
      }),
      signal: AbortSignal.timeout(GHL_PROXY_TIMEOUT_MS),
    });

    // The proxy always returns { status, body } when it reaches GHL;
    // on its own internal errors it returns { error }.
    type ProxyEnvelope =
      | { status: number; body: unknown }
      | { error: string };
    const payload = (await res.json().catch(() => ({}))) as ProxyEnvelope;

    if (!res.ok || "error" in payload) {
      return {
        ok: false,
        status: res.status,
        error: "error" in payload ? payload.error : `proxy http ${res.status}`,
      };
    }

    const ghlOk = payload.status >= 200 && payload.status < 300;
    return ghlOk
      ? { ok: true, status: payload.status, body: payload.body as T }
      : {
          ok: false,
          status: payload.status,
          error: `ghl http ${payload.status}`,
          body: payload.body,
        };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------
// Higher-level helpers — encode the SOP conventions so callers don't
// have to remember the exact GHL endpoint shapes.
// ---------------------------------------------------------------------

/**
 * The locked tag taxonomy (sop_ghl_operations.md, May 14 2026).
 *
 * IMPORTANT: `seniorsafe trial - active` has preserved spaces — do NOT
 * normalize. The GHL workflow trigger is listening for that exact string.
 */
export const GHL_TAGS = {
  // Lead magnets
  LEAD_STARTER_GUIDE: "lead-starter-guide",
  LEAD_STARTER_GUIDE_COMPLETE: "lead-starter-guide-complete",
  LEAD_NURTURE_COMPLETE: "lead-nurture-complete",

  // Stage / lifecycle
  STAGE_NEW_LEAD: "stage-new-lead",

  // SeniorSafe (preserved formats — workflow triggers depend on these)
  SENIORSAFE_FREE: "seniorsafe-free",
  SENIORSAFE_TRIAL_ACTIVE: "seniorsafe trial - active",
  SENIORSAFE_PAID: "seniorsafe-paid",

  // Blueprint product tags (defined in SOP as "future" — OK to use now)
  PRODUCT_BLUEPRINT_CORE: "product-blueprint-core",
  PRODUCT_BLUEPRINT_PREMIUM: "product-blueprint-premium",

  // Family Readiness Score email capture. Every opt-in gets the LEAD_ tag;
  // exactly one band tag rides along with it, derived from the score
  // SERVER-side in api/webhook/readiness-results (never from the client).
  // Band cutoffs mirror the four result messages the tool already shows,
  // so the tag always matches the words the family just read on screen.
  LEAD_FAMILY_READINESS_SCORE: "lead-family-readiness-score",
  READINESS_CRITICAL: "readiness-critical",
  READINESS_LOW: "readiness-low",
  READINESS_MODERATE: "readiness-moderate",
  READINESS_HIGH: "readiness-high",
} as const;

/** Readiness band for a 0-100 assessment score. */
export type ReadinessBand = "critical" | "low" | "moderate" | "high";

/**
 * Score to band. Cutoffs match the tool's on-screen result copy exactly:
 *   80-100 "well-prepared", 60-79 "on the right track",
 *   40-59  "needs significant planning", 0-39 "critical gaps".
 */
export function readinessBand(score: number): ReadinessBand {
  if (score >= 80) return "high";
  if (score >= 60) return "moderate";
  if (score >= 40) return "low";
  return "critical";
}

const READINESS_BAND_TAGS: Record<ReadinessBand, string> = {
  critical: GHL_TAGS.READINESS_CRITICAL,
  low: GHL_TAGS.READINESS_LOW,
  moderate: GHL_TAGS.READINESS_MODERATE,
  high: GHL_TAGS.READINESS_HIGH,
};

/** The full tag set for a readiness opt-in: the lead tag plus one band tag. */
export function readinessTags(band: ReadinessBand): readonly string[] {
  return [GHL_TAGS.LEAD_FAMILY_READINESS_SCORE, READINESS_BAND_TAGS[band]];
}

export type GhlContactInput = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  source?: string;
  tags?: readonly string[];
};

type UpsertedContact = {
  contact?: { id?: string; locationId?: string };
  // GHL also returns `new`/`traceId` etc — we don't need them.
  [k: string]: unknown;
};

/**
 * Upsert a contact (idempotent — by email). Returns the GHL contact id
 * on success, which can be used for follow-up tag/note/workflow ops.
 *
 * locationId is auto-injected by the proxy.
 */
export async function upsertGhlContact(
  input: GhlContactInput
): Promise<
  | { ok: true; contactId: string }
  | { ok: false; status: number; error: string }
> {
  const body: Record<string, unknown> = { email: input.email };
  if (input.firstName) body.firstName = input.firstName;
  if (input.lastName) body.lastName = input.lastName;
  if (input.phone) body.phone = input.phone;
  if (input.source) body.source = input.source;
  if (input.tags && input.tags.length > 0) body.tags = input.tags;

  const res = await callGhlProxy<UpsertedContact>({
    action: "post",
    path: "/contacts/upsert",
    body,
  });

  if (!res.ok) return { ok: false, status: res.status, error: res.error };

  const id = res.body?.contact?.id;
  if (!id) {
    return {
      ok: false,
      status: res.status,
      error: "GHL upsert succeeded but no contact.id returned",
    };
  }
  return { ok: true, contactId: id };
}

/**
 * Add one or more tags to an existing contact. Idempotent — GHL silently
 * dedupes when a tag is already present.
 */
export async function addTagsToGhlContact(
  contactId: string,
  tags: readonly string[]
): Promise<{ ok: boolean; status: number; error?: string }> {
  if (tags.length === 0) return { ok: true, status: 200 };
  const res = await callGhlProxy({
    action: "post",
    path: `/contacts/${encodeURIComponent(contactId)}/tags`,
    body: { tags },
    injectLocation: false, // contact-scoped — locationId not needed
  });
  return res.ok
    ? { ok: true, status: res.status }
    : { ok: false, status: res.status, error: res.error };
}

/**
 * Convenience: upsert + tag in a single call. The most common flow.
 */
export async function upsertGhlContactWithTags(
  input: Omit<GhlContactInput, "tags">,
  tags: readonly string[]
): Promise<
  | { ok: true; contactId: string }
  | { ok: false; status: number; error: string }
> {
  // Pass tags on the upsert directly — GHL accepts them in the body
  // and applies them atomically with the upsert. Faster than two hops.
  return upsertGhlContact({ ...input, tags });
}
