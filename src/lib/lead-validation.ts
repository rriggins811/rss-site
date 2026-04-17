const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(s: unknown): s is string {
  return typeof s === "string" && s.length <= 320 && EMAIL_RE.test(s);
}

export function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function cleanString(s: unknown, max = 500): string | null {
  if (typeof s !== "string") return null;
  const trimmed = s.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

/**
 * Minimal E.164-style phone normalizer. Keeps digits and a leading +.
 * Returns null if nothing usable remains.
 */
export function normalizePhone(s: unknown): string | null {
  const cleaned = cleanString(s, 40);
  if (!cleaned) return null;
  const digits = cleaned.replace(/[^\d+]/g, "");
  if (digits.replace(/\D/g, "").length < 7) return null;
  return digits.slice(0, 20);
}

export type LeadInput = {
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  message: string | null;
};

export type ValidationResult =
  | { ok: true; value: LeadInput }
  | { ok: false; error: string };

type RawInput = {
  first_name?: unknown;
  last_name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
};

export function validateLead(
  raw: RawInput,
  opts: { requireMessage?: boolean } = {}
): ValidationResult {
  const first_name = cleanString(raw.first_name, 80);
  if (!first_name) return { ok: false, error: "First name is required." };

  const emailRaw = cleanString(raw.email, 320);
  if (!emailRaw || !isValidEmail(emailRaw)) {
    return { ok: false, error: "A valid email is required." };
  }

  const last_name = cleanString(raw.last_name, 80);
  const phone = normalizePhone(raw.phone);

  let message: string | null = null;
  const messageRaw = cleanString(raw.message, 4000);
  if (messageRaw) message = stripHtml(messageRaw).slice(0, 4000);

  if (opts.requireMessage && !message) {
    return { ok: false, error: "A message is required." };
  }

  return {
    ok: true,
    value: { first_name, last_name, email: emailRaw.toLowerCase(), phone, message },
  };
}
