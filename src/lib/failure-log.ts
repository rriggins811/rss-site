import { Resend } from "resend";
import { getServiceSupabase } from "@/lib/supabase-server";
import { ORGANIZATION } from "@/lib/site";

/**
 * Durable failure recording + alerting for the lead routes.
 *
 * Every lead route deliberately swallows downstream errors so a visitor's form
 * never breaks because GHL timed out. That is the right call for the visitor
 * and the wrong one for the business, because until now "swallowed" also meant
 * "invisible": Vercel keeps runtime logs for about a day, so a CHECK
 * constraint silently dropped every /need-an-agent database row for months
 * with nothing left to find.
 *
 * recordFailure() closes that gap. It does two things, both best-effort:
 *
 *   1. Writes the failure to public.integration_failures with enough payload
 *      to replay the lost write by hand.
 *   2. Emails Ryan, throttled, so a systemic outage produces a handful of
 *      alerts instead of hundreds.
 *
 * It NEVER throws. A monitoring path that can break the thing it monitors is
 * worse than no monitoring, so every step is wrapped and the last resort is
 * console.error.
 */

const ALERT_TO = ORGANIZATION.email;
const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ??
  "Ryan Riggins <ryan@rigginsstrategicsolutions.com>";

/**
 * Minutes between alert emails for the same route+stage pair. A broken
 * downstream fires on every submission; one alert per window is enough to
 * know, and stops a bad afternoon from flooding the inbox.
 */
const ALERT_THROTTLE_MINUTES = 30;

export type FailureStage =
  | "supabase-insert"
  | "ghl-upsert"
  | "ghl-webhook"
  | "ghl-opportunity"
  | "notify-email"
  | "lead-sms-schedule"
  | "email-send"
  | "blueprint-signup";

export type FailureInput = {
  /** Route identifier, e.g. "agent-request". */
  route: string;
  stage: FailureStage;
  /** Postgres SQLSTATE or an HTTP status, when there is one. */
  code?: string | number | null;
  message: string;
  /** Who the record was about, so the lead can be matched to a person. */
  email?: string | null;
  /** Everything needed to replay the write. Keep it small and non-sensitive. */
  payload?: Record<string, unknown>;
};

/**
 * True when an alert for this route+stage has NOT gone out inside the throttle
 * window. Fails open: if the check itself errors we would rather send a
 * duplicate alert than stay quiet.
 */
async function shouldAlert(route: string, stage: string): Promise<boolean> {
  try {
    const since = new Date(
      Date.now() - ALERT_THROTTLE_MINUTES * 60 * 1000
    ).toISOString();
    const sb = getServiceSupabase();
    const { data, error } = await sb
      .from("integration_failures")
      .select("id")
      .eq("route", route)
      .eq("stage", stage)
      .not("alerted_at", "is", null)
      .gte("alerted_at", since)
      .limit(1);
    if (error) return true;
    return !data || data.length === 0;
  } catch {
    return true;
  }
}

async function sendAlert(input: FailureInput, failureId: string | null) {
  const key = process.env.RESEND_API_KEY;
  if (!key || /PLACEHOLDER/i.test(key)) {
    console.error(
      `[failure-log] cannot alert, RESEND_API_KEY missing. ${input.route}/${input.stage}: ${input.message}`
    );
    return false;
  }

  const subject = `RSS alert: ${input.route} ${input.stage} is failing`;
  const payloadJson = input.payload
    ? JSON.stringify(input.payload, null, 2).slice(0, 4000)
    : "(none)";

  const text = `A downstream write failed on rigginsstrategicsolutions.com.

Route:   ${input.route}
Stage:   ${input.stage}
Code:    ${input.code ?? "(none)"}
Message: ${input.message}
Person:  ${input.email ?? "(unknown)"}
Time:    ${new Date().toISOString()}

The visitor still saw a success message, which is intended. The record below
did NOT make it to its destination and needs recovering.

Failure id: ${failureId ?? "(not recorded)"}

Payload:
${payloadJson}

Further alerts for this same route and stage are muted for ${ALERT_THROTTLE_MINUTES} minutes.
Everything is logged in the integration_failures table regardless, including
the muted ones.
`;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: ALERT_TO,
      subject,
      text,
    });
    if (error) {
      console.error(`[failure-log] alert send failed: ${error.message}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(
      `[failure-log] alert threw: ${err instanceof Error ? err.message : "unknown"}`
    );
    return false;
  }
}

/**
 * Record a downstream failure and, subject to throttling, alert Ryan.
 *
 * Always safe to await: never throws, and returns nothing the caller needs to
 * branch on. Call it and carry on serving the visitor.
 */
export async function recordFailure(input: FailureInput): Promise<void> {
  // Console first, so the detail exists even if everything below fails.
  console.error(
    `[${input.route}] ${input.stage} failed`,
    input.code ?? "",
    input.message
  );

  let failureId: string | null = null;

  try {
    const sb = getServiceSupabase();
    const { data, error } = await sb
      .from("integration_failures")
      .insert({
        route: input.route,
        stage: input.stage,
        error_code: input.code == null ? null : String(input.code),
        error_message: input.message.slice(0, 2000),
        email: input.email ?? null,
        payload: input.payload ?? null,
      })
      .select("id")
      .single();
    if (error) {
      console.error("[failure-log] could not persist failure", error.message);
    } else {
      failureId = data?.id ?? null;
    }
  } catch (err) {
    console.error(
      `[failure-log] persist threw: ${err instanceof Error ? err.message : "unknown"}`
    );
  }

  try {
    if (!(await shouldAlert(input.route, input.stage))) return;
    const sent = await sendAlert(input, failureId);
    if (sent && failureId) {
      const sb = getServiceSupabase();
      await sb
        .from("integration_failures")
        .update({ alerted_at: new Date().toISOString() })
        .eq("id", failureId);
    }
  } catch (err) {
    console.error(
      `[failure-log] alert stage threw: ${err instanceof Error ? err.message : "unknown"}`
    );
  }
}
