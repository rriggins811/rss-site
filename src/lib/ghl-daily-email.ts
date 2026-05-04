/**
 * Composes and sends the GHL daily summary email via Resend's HTTP API
 * (no SDK; just fetch). Subject + body format are locked to the spec in
 * Marketing & Growth/SEO_AEO/CODE_PROMPT_GHL_Daily_Summary_FINAL.md.
 */

import {
  type Contact,
  type Conversation,
  type Workflow,
  type CalendarEvent,
  CONVERSION_TAGS,
  type ConversionTag,
  trialDayFromDateAdded,
} from "@/lib/ghl";

export type SummaryData = {
  newContacts: Contact[];
  activeTrials: Contact[];
  conversions: Contact[];
  conversations: Conversation[];
  workflows: Workflow[];
  appointments: CalendarEvent[];
};

export type ComposedEmail = {
  subject: string;
  text: string;
};

const MRR_BY_TAG: Partial<Record<ConversionTag, number>> = {
  "seniorsafe-premium": 14.99,
  "seniorsafe-premium-plus": 39.99,
  "blueprint-core-customer": 0,
  "blueprint-premium-customer": 0,
};

function firstNamesOf(contacts: Contact[]): string {
  const names = contacts
    .map((c) => c.firstName?.trim() || "(no name)")
    .filter(Boolean);
  if (names.length === 0) return "";
  if (names.length <= 5) return names.join(", ");
  return `${names.slice(0, 5).join(", ")} +${names.length - 5} more`;
}

function tagsOf(contact: Contact): string {
  return (contact.tags ?? []).join(", ") || "no tags";
}

function classifyConversation(c: Conversation): "sms" | "email" | "chat" | "other" {
  const t = (c.type ?? c.lastMessageType ?? "").toUpperCase();
  if (t.includes("SMS")) return "sms";
  if (t.includes("EMAIL")) return "email";
  if (t.includes("CHAT")) return "chat";
  return "other";
}

function hasConversionTag(c: Contact, target: ConversionTag): boolean {
  return (c.tags ?? []).some((t) => t.toLowerCase() === target.toLowerCase());
}

function todayDateString(): string {
  // Format: "May 4, 2026". Renders in en-US regardless of server locale.
  return new Date().toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function composeEmail(data: SummaryData): ComposedEmail {
  // --- Counts ---
  const newCount = data.newContacts.length;
  const conversionCount = data.conversions.length;

  // Conversion breakdown
  const seniorsafePremium = data.conversions.filter((c) =>
    hasConversionTag(c, "seniorsafe-premium")
  );
  const seniorsafePremiumPlus = data.conversions.filter((c) =>
    hasConversionTag(c, "seniorsafe-premium-plus")
  );
  const blueprintCore = data.conversions.filter((c) =>
    hasConversionTag(c, "blueprint-core-customer")
  );
  const blueprintPremium = data.conversions.filter((c) =>
    hasConversionTag(c, "blueprint-premium-customer")
  );

  const mrrAdded =
    seniorsafePremium.length * (MRR_BY_TAG["seniorsafe-premium"] ?? 0) +
    seniorsafePremiumPlus.length * (MRR_BY_TAG["seniorsafe-premium-plus"] ?? 0);

  // Trial buckets
  const trialDays = data.activeTrials.map((c) => ({
    contact: c,
    day: trialDayFromDateAdded(c.dateAdded),
  }));
  const early = trialDays.filter((t) => t.day !== null && t.day <= 3);
  const middle = trialDays.filter((t) => t.day !== null && t.day >= 4 && t.day <= 10);
  const decision = trialDays.filter((t) => t.day !== null && t.day >= 11 && t.day <= 14);

  // Conversation buckets
  const sms = data.conversations.filter((c) => classifyConversation(c) === "sms");
  const emails = data.conversations.filter((c) => classifyConversation(c) === "email");
  const chat = data.conversations.filter((c) => classifyConversation(c) === "chat");
  const unread = data.conversations.filter((c) => (c.unreadCount ?? 0) > 0);
  const unreadSms = sms.filter((c) => (c.unreadCount ?? 0) > 0).length;

  // Workflow health
  const wfActive = data.workflows.filter(
    (w) => (w.status ?? "").toLowerCase() === "published"
  );
  const wfHealthy = data.workflows.length === 0 || wfActive.length === data.workflows.length;

  // --- Subject ---
  const hasMoneyEvent = mrrAdded > 0 || conversionCount > 0;
  const hasAttention = unread.length > 0 || decision.length > 0 || !wfHealthy;

  let emoji = "⚪";
  if (hasAttention) emoji = "🟡";
  else if (hasMoneyEvent) emoji = "🟢";

  const subjectParts: string[] = [];
  if (newCount > 0) {
    subjectParts.push(`${newCount} new signup${newCount === 1 ? "" : "s"}`);
  }
  if (conversionCount > 0) {
    subjectParts.push(`${conversionCount} conversion${conversionCount === 1 ? "" : "s"}`);
  }
  if (mrrAdded > 0) {
    subjectParts.push(`$${mrrAdded.toFixed(2)} MRR added`);
  }
  if (unread.length > 0) {
    subjectParts.push(
      `${unread.length} unread conversation${unread.length === 1 ? "" : "s"}`
    );
  }
  if (decision.length > 0) {
    subjectParts.push(
      `${decision.length} trial${decision.length === 1 ? "" : "s"} hit Day 11-14`
    );
  }
  const summary =
    subjectParts.length > 0 ? subjectParts.join(", ") : "no new activity in last 24h";
  const subject = `${emoji} GHL daily: ${summary}`;

  // --- Body ---
  const lines: string[] = [];
  lines.push(`RSS Daily Summary for ${todayDateString()}`);
  lines.push("");

  lines.push(`NEW CONTACTS YESTERDAY: ${newCount}`);
  for (const c of data.newContacts) {
    const name = c.firstName?.trim() || "(no name)";
    const source = c.source?.trim() || "unknown source";
    lines.push(`- ${name} (${source}, tagged: ${tagsOf(c)})`);
  }
  lines.push("");

  lines.push(`ACTIVE TRIALS: ${data.activeTrials.length} total`);
  lines.push(
    `- Day 1-3 (early): ${early.length}${
      early.length > 0 ? ` (${firstNamesOf(early.map((t) => t.contact))})` : ""
    }`
  );
  lines.push(
    `- Day 4-10 (middle): ${middle.length}${
      middle.length > 0 ? " (focus on these)" : ""
    }`
  );
  lines.push(
    `- Day 11-14 (decision day): ${decision.length}${
      decision.length > 0 ? ` ⚠️ (${firstNamesOf(decision.map((t) => t.contact))})` : ""
    }`
  );
  lines.push("");

  lines.push(`CONVERSIONS YESTERDAY: ${conversionCount}`);
  if (seniorsafePremium.length > 0) {
    lines.push(
      `- ${seniorsafePremium.length} trial → premium ($${(seniorsafePremium.length * 14.99).toFixed(2)}/mo MRR added)`
    );
  }
  if (seniorsafePremiumPlus.length > 0) {
    lines.push(
      `- ${seniorsafePremiumPlus.length} lead → premium-plus ($${(seniorsafePremiumPlus.length * 39.99).toFixed(2)}/mo MRR added)`
    );
  }
  if (blueprintCore.length > 0) {
    lines.push(`- ${blueprintCore.length} Blueprint Core ($47 one-time, no MRR)`);
  }
  if (blueprintPremium.length > 0) {
    lines.push(`- ${blueprintPremium.length} Blueprint Premium ($297 one-time, no MRR)`);
  }
  lines.push(`- Total MRR delta: +$${mrrAdded.toFixed(2)}`);
  lines.push("");

  lines.push(`CONVERSATIONS LAST 24H: ${data.conversations.length} messages`);
  lines.push(`- ${sms.length} SMS (${unreadSms} unread)`);
  lines.push(`- ${emails.length} emails`);
  lines.push(`- ${chat.length} live chat`);
  lines.push("");

  lines.push(
    `WORKFLOW HEALTH: ${wfActive.length}/${data.workflows.length} workflows active ${
      wfHealthy ? "✅" : "⚠️"
    }`
  );
  if (!wfHealthy) {
    const inactive = data.workflows.filter(
      (w) => (w.status ?? "").toLowerCase() !== "published"
    );
    for (const w of inactive) {
      lines.push(`  - ${w.name} (${w.status ?? "unknown"})`);
    }
  }
  lines.push("");

  lines.push(`TODAY'S APPOINTMENTS: ${data.appointments.length}`);
  for (const a of data.appointments) {
    const t = a.startTime ? new Date(a.startTime) : null;
    const time = t
      ? t.toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour: "numeric",
          minute: "2-digit",
        })
      : "time unknown";
    lines.push(`- ${time} ${a.title ?? "(no title)"}`);
  }
  lines.push("");
  lines.push("");
  lines.push("--");
  lines.push("GHL daily summary");
  lines.push("Full GHL dashboard: https://app.gohighlevel.com");

  return { subject, text: lines.join("\n") };
}

/**
 * Sends the composed email via Resend's HTTP API.
 * Required env: RESEND_API_KEY, RYAN_EMAIL.
 * Optional env: RESEND_FROM_EMAIL (defaults to updates@rigginsstrategicsolutions.com).
 */
export async function sendDailySummary(data: SummaryData): Promise<{
  ok: true;
  id: string;
  subject: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const to = process.env.RYAN_EMAIL || "ryan.riggins@gmail.com";
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "RSS Daily <updates@rigginsstrategicsolutions.com>";

  const { subject, text } = composeEmail(data);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${body.slice(0, 300)}`);
  }

  const json = (await res.json()) as { id?: string };
  return { ok: true, id: json.id ?? "", subject };
}
