"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Anon-key Supabase client for browser-side auth flows (e.g. Google SSO from
 * /freeguide). Reuses the existing Supabase project — same auth tenant as the
 * Blueprint dashboard and the SeniorSafe app, so the OAuth handshake lands the
 * user in a session those products recognize.
 */
export function getBrowserSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase env missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required."
    );
  }

  cached = createClient(url, key);
  return cached;
}
