/**
 * The site has exactly two GHL webhooks. No more, no less.
 * See CLAUDE_CODE_KICKOFF for the contract.
 */

export const GHL_WEBHOOKS = {
  starterGuide:
    "https://services.leadconnectorhq.com/hooks/qvSvBqNwvDLyqkKoZXl2/webhook-trigger/2f44fd02-cc81-4e6f-9f54-dcce9ec89fe5",
  contact:
    "https://services.leadconnectorhq.com/hooks/qvSvBqNwvDLyqkKoZXl2/webhook-trigger/6bb7634b-af7a-45dd-8989-953bab224412",
} as const;

export async function postToGhl(
  url: string,
  payload: Record<string, unknown>
): Promise<{ ok: boolean; status: number; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Keep it quick — we're server-side and can't block the user's response.
      signal: AbortSignal.timeout(5000),
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
