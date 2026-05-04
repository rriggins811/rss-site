/**
 * Daily 7am EDT cron. Pulls 6 buckets from GoHighLevel, composes the plain
 * text summary, and emails Ryan via Resend.
 *
 * Auth: if CRON_SECRET is set in env, requires Authorization: Bearer <secret>.
 * Vercel Cron auto-injects that header when CRON_SECRET is configured. With
 * the env unset, the endpoint is callable without auth so manual curl works
 * during initial setup.
 *
 * Per-bucket failures don't crash the report. Each fetch is wrapped so a
 * GHL filter shape change downgrades that section to zero rather than
 * killing the whole email.
 */

import { NextResponse } from "next/server";
import {
  searchContactsAddedYesterday,
  searchActiveTrialContacts,
  searchConversionsYesterday,
  searchRecentConversations,
  getWorkflows,
  getTodaysAppointments,
  type Contact,
  type Conversation,
  type Workflow,
  type CalendarEvent,
} from "@/lib/ghl";
import { sendDailySummary } from "@/lib/ghl-daily-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error(`[ghl-daily-summary] ${label} failed:`, e);
    return fallback;
  }
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const [
    newContacts,
    activeTrials,
    conversions,
    conversations,
    workflows,
    appointments,
  ] = await Promise.all([
    safe<Contact[]>("newContacts", searchContactsAddedYesterday, []),
    safe<Contact[]>("activeTrials", searchActiveTrialContacts, []),
    safe<Contact[]>("conversions", searchConversionsYesterday, []),
    safe<Conversation[]>("conversations", searchRecentConversations, []),
    safe<Workflow[]>("workflows", getWorkflows, []),
    safe<CalendarEvent[]>("appointments", getTodaysAppointments, []),
  ]);

  try {
    const result = await sendDailySummary({
      newContacts,
      activeTrials,
      conversions,
      conversations,
      workflows,
      appointments,
    });

    return NextResponse.json({
      ok: true,
      emailId: result.id,
      subject: result.subject,
      counts: {
        newContacts: newContacts.length,
        activeTrials: activeTrials.length,
        conversions: conversions.length,
        conversations: conversations.length,
        workflows: workflows.length,
        appointments: appointments.length,
      },
    });
  } catch (e) {
    console.error("[ghl-daily-summary] email send failed:", e);
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "email send failed",
        counts: {
          newContacts: newContacts.length,
          activeTrials: activeTrials.length,
          conversions: conversions.length,
          conversations: conversations.length,
          workflows: workflows.length,
          appointments: appointments.length,
        },
      },
      { status: 500 }
    );
  }
}
