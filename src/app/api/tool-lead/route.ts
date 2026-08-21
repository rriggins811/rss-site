import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rate-limit";
import { upsertGhlContactWithTags } from "@/lib/ghl-proxy";
import { recordFailure } from "@/lib/failure-log";

// Optional capture from the free tools (first: the Net Proceeds Calculator).
//
// The tools promise "no email required" and that promise holds: this endpoint
// only ever receives the people who chose the optional "email me this
// breakdown" step. It creates no pipeline card; a tool lead is interest, not
// an agent request. The GHL tag pair is what routes the follow-up:
// stage-new-lead surfaces them to Ryan, tool-<slug> drives the nurture email.

export const runtime = "nodejs";

const KNOWN_TOOLS = new Set([
  "net-proceeds-calculator",
  "strategic-exit-engine",
  "smart-prep-budget-calculator",
]);

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
  const email = str(b.email, 160).toLowerCase();
  const tool = str(b.tool, 60);
  const inputs =
    b.inputs && typeof b.inputs === "object" ? (b.inputs as Record<string, unknown>) : {};

  if (!firstName) {
    return NextResponse.json({ ok: false, error: "First name is required." }, { status: 400 });
  }
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }
  if (!KNOWN_TOOLS.has(tool)) {
    return NextResponse.json({ ok: false, error: "Unknown tool." }, { status: 400 });
  }

  // Persist first, same rule as agent-request: never lose a lead to a
  // downstream timeout.
  try {
    const sb = getServiceSupabase();
    const { error } = await sb.from("leads").insert({
      first_name: firstName,
      last_name: null,
      email,
      phone: null,
      form_type: "tool-lead",
      source: tool,
      raw_payload: { tool, inputs, ip },
    });
    if (error) {
      await recordFailure({
        route: "tool-lead",
        stage: "supabase-insert",
        code: error.code,
        message: error.message,
        email,
        payload: { firstName, tool },
      });
    }
  } catch (err) {
    await recordFailure({
      route: "tool-lead",
      stage: "supabase-insert",
      message: err instanceof Error ? err.message : "threw",
      email,
      payload: { firstName, tool },
    });
  }

  try {
    const res = await upsertGhlContactWithTags(
      { email, firstName, source: tool },
      ["tool-" + tool.replace("-calculator", ""), "stage-new-lead"]
    );
    if (!res.ok) {
      await recordFailure({
        route: "tool-lead",
        stage: "ghl-upsert",
        code: res.status,
        message: res.error,
        email,
        payload: { firstName, tool },
      });
    }
  } catch (err) {
    await recordFailure({
      route: "tool-lead",
      stage: "ghl-upsert",
      message: err instanceof Error ? err.message : "threw",
      email,
      payload: { firstName, tool },
    });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
