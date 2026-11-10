import { Resend } from "resend";
import { ORGANIZATION } from "@/lib/site";
import { recordFailure } from "@/lib/failure-log";

/**
 * Every website form emails the lead straight to Ryan (GHL wind-down,
 * 2026-11-10). This is the path that does not depend on GHL: the routes call
 * it BEFORE any GHL write, so a GHL outage or shutdown can never cost a lead.
 *
 * Uses the same Resend key and verified sender as the guide and alert emails.
 * Never throws. A failed send is recorded through recordFailure (which keeps
 * the payload in integration_failures) and the visitor still sees success.
 */

const LEAD_TO = ORGANIZATION.email;
const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ??
  "Ryan Riggins <ryan@rigginsstrategicsolutions.com>";

export type LeadField = [label: string, value: unknown];

function show(v: unknown): string {
  if (v === null || v === undefined || v === "") return "(blank)";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function easternTime(d: Date): string {
  return d.toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Email one form submission to Ryan.
 *
 * formName: human name of the form, e.g. "Contact form".
 * name:     the person's name (or email when no name was given).
 * fields:   every field submitted, in display order.
 * source:   the page or source tag the form reported.
 * replyTo:  the lead's email, so Ryan can answer with one reply.
 */
export async function emailLeadToRyan(args: {
  route: string;
  formName: string;
  name: string;
  fields: LeadField[];
  source?: string | null;
  replyTo?: string | null;
  urgent?: boolean;
}): Promise<{ ok: boolean }> {
  const now = new Date();
  const subject = `${args.urgent ? "URGENT " : ""}New website lead: ${args.formName} - ${args.name}`;
  const rows: LeadField[] = [
    ...args.fields,
    ["Page / source", args.source],
    ["Time", `${easternTime(now)} Eastern (${now.toISOString()})`],
  ];

  const text = [
    `New lead from ${args.formName} on rigginsstrategicsolutions.com.`,
    "",
    ...rows.map(([label, value]) => `${label}: ${show(value)}`),
    "",
    args.replyTo ? "Reply to this email to reach them directly." : "",
  ]
    .join("\n")
    .trim();

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#222;">
<p style="margin:0 0 12px 0;">New lead from <b>${esc(args.formName)}</b> on rigginsstrategicsolutions.com.</p>
<table style="border-collapse:collapse;">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top;white-space:nowrap;">${esc(label)}</td><td style="padding:4px 0;white-space:pre-wrap;">${esc(show(value))}</td></tr>`
  )
  .join("\n")}
</table>
${args.replyTo ? `<p style="margin:16px 0 0 0;color:#555;">Reply to this email to reach them directly.</p>` : ""}
</div>`;

  const key = process.env.RESEND_API_KEY;
  if (!key || /PLACEHOLDER/i.test(key)) {
    console.error(`[lead-notify] RESEND_API_KEY missing; lead email NOT sent: ${subject}`);
    await recordFailure({
      route: args.route,
      stage: "notify-email",
      message: "RESEND_API_KEY missing, lead email to Ryan not sent",
      email: args.replyTo ?? null,
      payload: { subject, text },
    });
    return { ok: false };
  }

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: LEAD_TO,
      subject,
      text,
      html,
      ...(args.replyTo ? { replyTo: args.replyTo } : {}),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  } catch (err) {
    await recordFailure({
      route: args.route,
      stage: "notify-email",
      message: `lead email to Ryan failed: ${err instanceof Error ? err.message : String(err)}`,
      email: args.replyTo ?? null,
      payload: { subject, text },
    });
    return { ok: false };
  }
}
