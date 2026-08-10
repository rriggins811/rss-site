import { Resend } from "resend";
import { ORGANIZATION } from "@/lib/site";
import type { ReadinessBand } from "@/lib/ghl-proxy";

/**
 * Resend-backed delivery for the Family Readiness Score results email.
 *
 * The tool's opt-in says "email me my results", so this sends the actual
 * results: the score, the band, the pillar breakdown, and the weakest area to
 * work on. It does NOT depend on a GHL workflow existing, because the promise
 * on screen is made the moment they hit submit.
 *
 * Same conventions as email/lead-magnets.ts: shared FROM address on the
 * verified Resend domain, CAN-SPAM postal line, List-Unsubscribe header, and
 * a best-effort contract that logs and returns rather than throwing. Callers
 * must not gate the user's response on the send.
 */

const MAILING_ADDRESS = "Riggins Strategic Solutions, LLC, Greensboro, NC";
const BLUEPRINT_URL = "https://rigginsstrategicsolutions.com/the-blueprint";
const CALL_URL = "https://rigginsstrategicsolutions.com/work-with-ryan";

const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ??
  "Ryan Riggins <ryan@rigginsstrategicsolutions.com>";

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || /PLACEHOLDER/i.test(key)) return null;
  return new Resend(key);
}

export type ReadinessEmailResult =
  | { ok: true; id: string }
  | { ok: false; reason: string };

/** Plain-English headline per band. Mirrors what the tool shows on screen. */
const BAND_COPY: Record<ReadinessBand, { label: string; line: string }> = {
  high: {
    label: "Well prepared",
    line: "Your family has done real preparation. The gaps that are left can be handled with targeted planning rather than a scramble.",
  },
  moderate: {
    label: "On the right track",
    line: "Good progress in some areas, but the gaps that are left are the kind that cost time and money later. Start with your weakest pillar.",
  },
  low: {
    label: "Needs real planning",
    line: "Several areas need attention. Without a plan, families in this position are the ones who end up making expensive decisions under a clock.",
  },
  critical: {
    label: "Critical gaps",
    line: "There are major gaps here. That is not unusual, and it is not a judgement. Most families do not know what they do not know until something forces the issue.",
  },
};

/** Human labels for the five pillar ids the tool scores. */
const PILLAR_LABELS: Record<string, string> = {
  home: "Home and property",
  financial: "Financial and legal",
  family: "Family communication",
  senior: "Senior readiness",
  exit: "Exit strategy",
};

const PILLAR_MAX = 20;

function weakestPillar(
  pillars: Record<string, number> | null
): { label: string; score: number } | null {
  if (!pillars) return null;
  let worst: { label: string; score: number } | null = null;
  for (const [id, score] of Object.entries(pillars)) {
    const label = PILLAR_LABELS[id] ?? id;
    if (!worst || score < worst.score) worst = { label, score };
  }
  return worst;
}

export async function sendReadinessResultsEmail(args: {
  to: string;
  firstName: string | null;
  score: number;
  band: ReadinessBand;
  pillars: Record<string, number> | null;
}): Promise<ReadinessEmailResult> {
  const client = getClient();
  if (!client) {
    console.warn(
      `[readiness-email] RESEND_API_KEY missing, skipping send to ${args.to}`
    );
    return { ok: false, reason: "no_api_key" };
  }

  const firstName = args.firstName?.trim() || "there";
  const band = BAND_COPY[args.band];
  const subject = `Your Family Readiness Score: ${args.score} out of 100`;
  const weakest = weakestPillar(args.pillars);

  const pillarRows = args.pillars
    ? Object.entries(args.pillars)
        .map(([id, score]) => {
          const label = PILLAR_LABELS[id] ?? id;
          return `<tr>
      <td style="padding:6px 0;color:#1a1a1a;">${escapeHtml(label)}</td>
      <td style="padding:6px 0;text-align:right;color:#555;font-weight:600;">${score} / ${PILLAR_MAX}</td>
    </tr>`;
        })
        .join("\n")
    : "";

  const pillarText = args.pillars
    ? Object.entries(args.pillars)
        .map(
          ([id, score]) =>
            `  ${PILLAR_LABELS[id] ?? id}: ${score} / ${PILLAR_MAX}`
        )
        .join("\n")
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.5;max-width:600px;margin:0 auto;padding:24px;">

  <p>Hi ${escapeHtml(firstName)},</p>

  <p>Here are your Family Readiness Score results.</p>

  <div style="margin:24px 0;padding:24px;background:#4A1E2B;border-radius:8px;text-align:center;">
    <div style="font-size:44px;font-weight:700;color:#ffffff;line-height:1;">${args.score}</div>
    <div style="font-size:13px;color:#E7C86A;margin-top:4px;">out of 100</div>
    <div style="font-size:17px;color:#ffffff;margin-top:12px;font-weight:600;">${escapeHtml(band.label)}</div>
  </div>

  <p>${escapeHtml(band.line)}</p>

  ${
    pillarRows
      ? `<h3 style="font-size:16px;margin:28px 0 8px;">Where you stand, pillar by pillar</h3>
  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    ${pillarRows}
  </table>`
      : ""
  }

  ${
    weakest
      ? `<p style="margin-top:24px;">Your weakest area is <strong>${escapeHtml(weakest.label)}</strong> at ${weakest.score} out of ${PILLAR_MAX}. That is the one to start on. Fixing the weakest pillar moves the whole picture more than polishing the strong ones.</p>`
      : ""
  }

  <h3 style="font-size:16px;margin:28px 0 8px;">What to do next</h3>
  <p style="margin:0 0 12px;">The Senior Transition Blueprint covers every pillar above in detail, at no cost. All 20 modules and 69 tools.</p>
  <p style="text-align:center;margin:24px 0;">
    <a href="${BLUEPRINT_URL}" style="background:#4A1E2B;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;font-size:16px;">Open the free Blueprint</a>
  </p>
  <p style="font-size:14px;color:#555;">If you would rather talk it through, a <a href="${CALL_URL}" style="color:#4A1E2B;">free 20-minute call</a> is open. No pressure and no pitch, and if the right move is to wait, you will hear that too.</p>

  <p>Hit reply if anything here raises a question about your family's specific situation. I read every one.</p>

  <p style="margin-top:32px;">
    Ryan Riggins<br>
    Senior Transition Advisor and Advocate<br>
    Riggins Strategic Solutions<br>
    (336) 553-8933
  </p>

  <hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0;">

  <p style="font-size:11px;color:#888;">
    Ryan Riggins | NC Real Estate License #361546 | eXp Realty<br>
    ${escapeHtml(MAILING_ADDRESS)}<br>
    These results are educational and not a substitute for legal, financial, tax, or medical advice.<br>
    You're receiving this because you asked for your results at rigginsstrategicsolutions.com. To stop receiving emails, reply with "unsubscribe."
  </p>

</body>
</html>
  `;

  const text = `Hi ${firstName},

Here are your Family Readiness Score results.

YOUR SCORE: ${args.score} out of 100
${band.label}

${band.line}
${pillarText ? `\nWhere you stand, pillar by pillar:\n${pillarText}\n` : ""}${
    weakest
      ? `\nYour weakest area is ${weakest.label} at ${weakest.score} out of ${PILLAR_MAX}. That is the one to start on. Fixing the weakest pillar moves the whole picture more than polishing the strong ones.\n`
      : ""
  }
What to do next

The Senior Transition Blueprint covers every pillar above in detail, at no cost. All 20 modules and 69 tools: ${BLUEPRINT_URL}

If you would rather talk it through, a free 20-minute call is open. No pressure and no pitch, and if the right move is to wait, you will hear that too: ${CALL_URL}

Hit reply if anything here raises a question about your family's specific situation. I read every one.

Ryan Riggins
Senior Transition Advisor and Advocate
Riggins Strategic Solutions
(336) 553-8933

---
Ryan Riggins | NC Real Estate License #361546 | eXp Realty
${MAILING_ADDRESS}
These results are educational and not a substitute for legal, financial, tax, or medical advice.
You're receiving this because you asked for your results at rigginsstrategicsolutions.com. To stop receiving emails, reply with "unsubscribe."
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
        "List-Unsubscribe": `<mailto:${ORGANIZATION.email}?subject=Unsubscribe>`,
      },
    });
    if (error) {
      console.warn(
        `[readiness-email] Resend error sending to ${args.to}: ${error.message}`
      );
      return { ok: false, reason: error.message };
    }
    return { ok: true, id: data?.id ?? "unknown" };
  } catch (err) {
    console.warn(
      `[readiness-email] threw sending to ${args.to}: ${err instanceof Error ? err.message : "unknown"}`
    );
    return { ok: false, reason: err instanceof Error ? err.message : "unknown" };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
