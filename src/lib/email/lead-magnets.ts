import { Resend } from "resend";
import {
  type LeadMagnet,
  magnetAbsoluteUrl,
} from "@/lib/lead-magnets";
import { ORGANIZATION } from "@/lib/site";

/**
 * Resend-backed lead-magnet email delivery.
 *
 * Per-magnet templates derive subject + body from the LeadMagnet entry —
 * no hardcoded magnet-specific copy here. When magnet #2 ships, this
 * file does not change.
 *
 * Gracefully no-ops when RESEND_API_KEY is missing (logs a warning so
 * Vercel logs surface it). The inline "Download Now" button on the
 * /guides success state means a missing API key never blocks the user
 * from getting the PDF — it just skips the email.
 *
 * Same env conventions as blueprint-site's email/resend.ts so the
 * RESEND_API_KEY value can be the same Vercel-encrypted secret.
 */

// FROM address is the verified sender on the rigginsstrategicsolutions.com
// Resend domain (same as blueprint-site uses).
const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ??
  "Ryan Riggins <ryan@rigginsstrategicsolutions.com>";

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || /PLACEHOLDER/i.test(key)) return null;
  return new Resend(key);
}

export type LeadMagnetEmailResult =
  | { ok: true; id: string }
  | { ok: false; reason: string };

/**
 * Send the delivery email for a given lead magnet. Subject is templated
 * with the recipient's first name; body contains the verified PDF URL +
 * Ryan's plain-text signoff + NCREC compliance footer.
 *
 * Best-effort: any failure (no API key, Resend error, network) is logged
 * and returned as a non-throwing result. Callers should not gate user
 * response on this — the inline download button covers the user need.
 */
export async function sendLeadMagnetEmail(args: {
  to: string;
  firstName: string | null;
  magnet: LeadMagnet;
}): Promise<LeadMagnetEmailResult> {
  const client = getClient();
  if (!client) {
    console.warn(
      `[lead-magnet-email] RESEND_API_KEY missing, skipping send to ${args.to} (magnet=${args.magnet.slug})`
    );
    return { ok: false, reason: "no_api_key" };
  }

  const firstName = args.firstName?.trim() || "there";
  const subject = `Your ${args.magnet.title} guide is here, ${firstName}`;
  const pdfUrl = magnetAbsoluteUrl(args.magnet);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.5;max-width:600px;margin:0 auto;padding:24px;">

  <p>Hi ${escapeHtml(firstName)},</p>

  <p>Here is your free copy of <strong>${escapeHtml(args.magnet.title)}</strong> — ${escapeHtml(args.magnet.subtitle)}. Plain-English, ${args.magnet.pageCount} pages, no fluff.</p>

  <p style="text-align:center;margin:32px 0;">
    <a href="${pdfUrl}" style="background:#1F3A5F;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;font-size:16px;">Download the PDF</a>
  </p>

  <p style="font-size:13px;color:#666;">
    If the button does not work, paste this link into your browser:<br>
    <a href="${pdfUrl}" style="word-break:break-all;color:#1F3A5F;">${pdfUrl}</a>
  </p>

  <p>${escapeHtml(args.magnet.description)}</p>

  <p>If anything in the guide raises a question about your family's specific situation, hit reply to this email. I read every one.</p>

  <p style="margin-top:32px;">
    Ryan Riggins<br>
    Senior Transition Advisor<br>
    Riggins Strategic Solutions<br>
    (336) 553-8933
  </p>

  <hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0;">

  <p style="font-size:11px;color:#888;">
    Ryan Riggins | NC Real Estate License #361546 | eXp Realty<br>
    This guide is educational and not a substitute for legal or financial advice.
  </p>

</body>
</html>
  `;

  const text = `Hi ${firstName},

Here is your free copy of ${args.magnet.title} — ${args.magnet.subtitle}. Plain-English, ${args.magnet.pageCount} pages, no fluff.

Download the PDF: ${pdfUrl}

${args.magnet.description}

If anything in the guide raises a question about your family's specific situation, hit reply to this email. I read every one.

Ryan Riggins
Senior Transition Advisor
Riggins Strategic Solutions
(336) 553-8933

---
Ryan Riggins | NC Real Estate License #361546 | eXp Realty
This guide is educational and not a substitute for legal or financial advice.
`;

  try {
    const { data, error } = await client.emails.send({
      from: FROM_ADDRESS,
      to: args.to,
      subject,
      html,
      text,
      replyTo: ORGANIZATION.email,
    });
    if (error) {
      console.warn(
        `[lead-magnet-email] Resend error sending to ${args.to} (magnet=${args.magnet.slug}): ${error.message}`
      );
      return { ok: false, reason: error.message };
    }
    return { ok: true, id: data?.id ?? "unknown" };
  } catch (err) {
    console.warn(
      `[lead-magnet-email] threw sending to ${args.to} (magnet=${args.magnet.slug}): ${err instanceof Error ? err.message : "unknown"}`
    );
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "unknown",
    };
  }
}

// Minimal HTML escaping for safe interpolation into the template above.
// Only escapes the 5 chars that matter for HTML body context.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
