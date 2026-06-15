import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET /api/blueprint-access?token=<uuid>
//
// Validates a Blueprint Map buyer's access token and returns the tier
// ("map" | "map_book" | "full") or null. Calls the SECURITY DEFINER RPC
// blueprint_access_tier() with the public anon key, server-side. The token is
// the only secret (an unguessable uuid minted by the Stripe webhook), so a
// match returns just the tier; nothing enumerable is exposed.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token || !UUID_RE.test(token)) {
    return NextResponse.json({ tier: null });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json(
      { tier: null, error: "supabase env missing" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${url}/rest/v1/rpc/blueprint_access_tier`, {
      method: "POST",
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_token: token }),
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ tier: null });
    const tier = await res.json(); // RPC returns the scalar text value or null
    const valid =
      tier === "map" || tier === "map_book" || tier === "full" ? tier : null;
    return NextResponse.json({ tier: valid });
  } catch {
    return NextResponse.json({ tier: null });
  }
}
