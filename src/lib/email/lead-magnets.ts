import { Resend } from "resend";
import {
  type LeadMagnet,
  magnetAbsoluteUrl,
  guideDeliveryUrl,
} from "@/lib/lead-magnets";
import { ORGANIZATION } from "@/lib/site";

// Soft next-step in the delivery email: the free Blueprint Map page.
// One mention, never a hard sell (brand voice).
const MAP_SALES_URL = "https://rigginsstrategicsolutions.com/blueprint-preview";

// Physical mailing address for the CAN-SPAM footer. A real postal address is
// legally required on commercial email AND is a positive deliverability signal
// (its absence reads as a spam marker). TODO(ryan): append your PO Box or
// street for full compliance — a PO Box is recommended for a home-based
// business, e.g. "Riggins Strategic Solutions, LLC, PO Box 1234, Greensboro, NC 27401".
const MAILING_ADDRESS = "Riggins Strategic Solutions, LLC, Greensboro, NC";

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
  const readUrl = guideDeliveryUrl(args.magnet);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.5;max-width:600px;margin:0 auto;padding:24px;">

  <p>Hi ${escapeHtml(firstName)},</p>

  <p>Here is your free copy of <strong>${escapeHtml(args.magnet.title)}</strong>, ${escapeHtml(args.magnet.subtitle)}. Plain-English, ${args.magnet.pageCount} pages, no fluff.</p>

  <p style="text-align:center;margin:32px 0;">
    <a href="${readUrl}" style="background:#1F3A5F;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;font-size:16px;">Read your guide</a>
  </p>

  <p style="font-size:13px;color:#666;">
    Prefer the file directly? <a href="${pdfUrl}" style="color:#1F3A5F;">Download the PDF here</a>.
  </p>

  <p>${escapeHtml(args.magnet.description)}</p>

  <p>If anything in the guide raises a question about your family's specific situation, hit reply to this email. I read every one.</p>

  <div style="margin:32px 0;padding:20px 24px;background:#FAF8F3;border:1px solid #e7e2d6;border-radius:8px;">
    <p style="margin:0 0 8px;font-weight:600;color:#1C3A52;">When one piece isn't the whole picture</p>
    <p style="margin:0 0 14px;font-size:14px;color:#444;">The Blueprint Map walks every step of a senior transition in order, on one screen, with a short video for each. It's part of the full Senior Transition Blueprint, and the whole thing is free with a free account. The calm shortcut when everything feels like too much.</p>
    <a href="${MAP_SALES_URL}" style="font-weight:600;color:#1C3A52;text-decoration:underline;">See the Blueprint Map &rarr;</a>
  </div>

  <p style="margin-top:32px;">
    Ryan Riggins<br>
    Senior Transition Advisor<br>
    Riggins Strategic Solutions<br>
    (336) 553-8933
  </p>

  <hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0;">

  <p style="font-size:11px;color:#888;">
    Ryan Riggins | NC Real Estate License #361546 | eXp Realty<br>
    ${escapeHtml(MAILING_ADDRESS)}<br>
    This guide is educational and not a substitute for legal or financial advice.<br>
    You're receiving this because you requested this guide at rigginsstrategicsolutions.com. To stop receiving emails, reply with "unsubscribe."
  </p>

</body>
</html>
  `;

  const text = `Hi ${firstName},

Here is your free copy of ${args.magnet.title}, ${args.magnet.subtitle}. Plain-English, ${args.magnet.pageCount} pages, no fluff.

Read your guide: ${readUrl}
Prefer the file directly? Download the PDF: ${pdfUrl}

${args.magnet.description}

If anything in the guide raises a question about your family's specific situation, hit reply to this email. I read every one.

When one piece isn't the whole picture: the Blueprint Map walks every step of a senior transition in order, on one screen, with a short video for each. It's part of the full Senior Transition Blueprint, and the whole thing is free with a free account. See it here: ${MAP_SALES_URL}

Ryan Riggins
Senior Transition Advisor
Riggins Strategic Solutions
(336) 553-8933

---
Ryan Riggins | NC Real Estate License #361546 | eXp Realty
${MAILING_ADDRESS}
This guide is educational and not a substitute for legal or financial advice.
You're receiving this because you requested this guide at rigginsstrategicsolutions.com. To stop receiving emails, reply with "unsubscribe."
`;

  try {
    const { data, error } = await client.emails.send({
      from: FROM_ADDRESS,
      to: args.to,
      subject,
      html,
      text,
      replyTo: ORGANIZATION.email,
      headers: {
        // List-Unsubscribe is a strong inbox-placement signal for Gmail/Yahoo
        // and surfaces a one-tap unsubscribe link next to the sender. mailto
        // points at a monitored inbox; a hosted one-click (https) endpoint can
        // be added later for full bulk-sender compliance.
        "List-Unsubscribe": `<mailto:${ORGANIZATION.email}?subject=Unsubscribe>`,
      },
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
