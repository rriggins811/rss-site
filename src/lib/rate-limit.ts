import { getServiceSupabase } from "@/lib/supabase-server";

const WINDOW_HOURS = 1;
const MAX_PER_WINDOW = 5;
const CLEANUP_HOURS = 24;

/**
 * Checks the count of rate-limit rows for this IP in the last WINDOW_HOURS.
 * If under the cap, records a new row and returns { ok: true }.
 * Also opportunistically prunes rows older than CLEANUP_HOURS.
 */
export async function checkAndRecordRateLimit(
  ip: string
): Promise<{ ok: true } | { ok: false; retryAfterSeconds: number }> {
  const sb = getServiceSupabase();
  const now = Date.now();
  const windowStart = new Date(now - WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const cleanupBefore = new Date(now - CLEANUP_HOURS * 60 * 60 * 1000).toISOString();

  // Best-effort cleanup of old rows. Fire and forget.
  sb.from("lead_rate_limit").delete().lt("created_at", cleanupBefore).then(
    () => {},
    () => {}
  );

  const { count, error: countErr } = await sb
    .from("lead_rate_limit")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", windowStart);

  if (countErr) {
    // Fail open — don't block a legit lead because Supabase hiccuped.
    // Still record the hit so future checks see it.
    await sb.from("lead_rate_limit").insert({ ip });
    return { ok: true };
  }

  if ((count ?? 0) >= MAX_PER_WINDOW) {
    return { ok: false, retryAfterSeconds: WINDOW_HOURS * 60 * 60 };
  }

  const { error: insertErr } = await sb.from("lead_rate_limit").insert({ ip });
  if (insertErr) {
    // Again, fail open rather than drop a legit lead.
    return { ok: true };
  }

  return { ok: true };
}

/**
 * Pulls client IP from standard proxy headers (Vercel sets x-forwarded-for).
 * Falls back to "unknown" so rate-limiting still functions during local dev.
 */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
