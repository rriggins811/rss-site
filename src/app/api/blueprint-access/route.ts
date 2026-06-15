import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validTier(t: unknown): "map" | "map_book" | "full" | null {
  return t === "map" || t === "map_book" || t === "full" ? t : null;
}

async function callRpc(
  fn: string,
  body: Record<string, string>
): Promise<"map" | "map_book" | "full" | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  try {
    const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return validTier(await res.json());
  } catch {
    return null;
  }
}

// GET /api/blueprint-access?token=<uuid>   (returning buyer, from the email link)
// GET /api/blueprint-access?session_id=<cs_...>  (just-purchased, instant access;
//     polled by the success page until the webhook has written the row)
//
// Returns the access tier ("map" | "map_book" | "full") or null. Both lookups go
// through SECURITY DEFINER RPCs with the public anon key; the token/session id is
// the only secret, so a match returns just the tier, nothing enumerable.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (token) {
    if (!UUID_RE.test(token)) return NextResponse.json({ tier: null });
    return NextResponse.json({
      tier: await callRpc("blueprint_access_tier", { p_token: token }),
    });
  }

  if (sessionId) {
    // Stripe Checkout session ids look like cs_live_… / cs_test_…
    if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
      return NextResponse.json({ tier: null });
    }
    return NextResponse.json({
      tier: await callRpc("blueprint_access_tier_by_session", {
        p_session_id: sessionId,
      }),
    });
  }

  return NextResponse.json({ tier: null });
}
