/**
 * GoHighLevel v2 API client. Uses the Private Integration Token (PIT) flow,
 * not OAuth. Every request carries `Authorization: Bearer <token>` and the
 * `Version: 2021-07-28` header per GHL's pinning convention.
 *
 * Token + location id come from env. Each helper is best-effort: callers
 * should wrap calls in try/catch since GHL filter shapes occasionally drift
 * and a degraded report is better than a thrown cron.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

export type Contact = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  source?: string;
  tags?: string[];
  dateAdded?: string;
  dateUpdated?: string;
};

export type Conversation = {
  id: string;
  contactId?: string;
  /** TYPE_SMS, TYPE_EMAIL, TYPE_LIVE_CHAT, TYPE_PHONE, TYPE_FB, TYPE_IG, ... */
  type?: string;
  lastMessageType?: string;
  lastMessageDate?: string;
  unreadCount?: number;
};

export type Workflow = {
  id: string;
  name: string;
  status?: string;
  locationId?: string;
};

export type CalendarEvent = {
  id: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  appointmentStatus?: string;
};

export const CONVERSION_TAGS = [
  "seniorsafe-premium",
  "seniorsafe-premium-plus",
  "blueprint-core-customer",
  "blueprint-premium-customer",
] as const;

export type ConversionTag = (typeof CONVERSION_TAGS)[number];

function getToken(): string {
  const t = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
  if (!t) throw new Error("GHL_PRIVATE_INTEGRATION_TOKEN is not set");
  return t;
}

export function getLocationId(): string {
  const id = process.env.GHL_LOCATION_ID;
  if (!id) throw new Error("GHL_LOCATION_ID is not set");
  return id;
}

async function ghlFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${getToken()}`);
  headers.set("Version", GHL_VERSION);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${GHL_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `GHL ${init.method ?? "GET"} ${path} ${res.status}: ${body.slice(0, 300)}`
    );
  }
  return (await res.json()) as T;
}

// --- Date helpers (UTC) ---

export function getYesterdayUTCRange(): { start: string; end: string } {
  const now = new Date();
  const y = new Date(now);
  y.setUTCDate(now.getUTCDate() - 1);
  const start = new Date(
    Date.UTC(y.getUTCFullYear(), y.getUTCMonth(), y.getUTCDate(), 0, 0, 0)
  );
  const end = new Date(
    Date.UTC(y.getUTCFullYear(), y.getUTCMonth(), y.getUTCDate(), 23, 59, 59)
  );
  return { start: start.toISOString(), end: end.toISOString() };
}

export function getTodayUTCRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
  );
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59)
  );
  return { start: start.toISOString(), end: end.toISOString() };
}

/** Day 1 = trial start day. Returns null if outside the 1-14 trial window. */
export function trialDayFromDateAdded(dateAdded?: string): number | null {
  if (!dateAdded) return null;
  const added = new Date(dateAdded).getTime();
  if (Number.isNaN(added)) return null;
  const days = Math.floor((Date.now() - added) / (24 * 60 * 60 * 1000)) + 1;
  return days >= 1 && days <= 14 ? days : null;
}

// --- Search helpers ---

type ContactsSearchResponse = {
  contacts?: Contact[];
  total?: number;
};

export async function searchContactsAddedYesterday(): Promise<Contact[]> {
  const { start, end } = getYesterdayUTCRange();
  const body = {
    locationId: getLocationId(),
    pageLimit: 100,
    filters: [
      { field: "dateAdded", operator: "between", value: [start, end] },
    ],
  };
  const res = await ghlFetch<ContactsSearchResponse>("/contacts/search", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.contacts ?? [];
}

export async function searchActiveTrialContacts(): Promise<Contact[]> {
  const body = {
    locationId: getLocationId(),
    pageLimit: 100,
    filters: [
      { field: "tags", operator: "contains", value: "seniorsafe trial - active" },
    ],
  };
  const res = await ghlFetch<ContactsSearchResponse>("/contacts/search", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.contacts ?? [];
}

/**
 * Approximation: GHL doesn't expose "tag added on date" as a filter, so we
 * pull contacts with each conversion tag whose dateUpdated is yesterday.
 * Some noise is possible if a contact's record was touched yesterday for
 * an unrelated reason. Acceptable for a daily summary email.
 */
export async function searchConversionsYesterday(): Promise<Contact[]> {
  const { start, end } = getYesterdayUTCRange();
  const out: Contact[] = [];
  for (const tag of CONVERSION_TAGS) {
    const body = {
      locationId: getLocationId(),
      pageLimit: 100,
      filters: [
        { field: "tags", operator: "contains", value: tag },
        { field: "dateUpdated", operator: "between", value: [start, end] },
      ],
    };
    const res = await ghlFetch<ContactsSearchResponse>("/contacts/search", {
      method: "POST",
      body: JSON.stringify(body),
    }).catch((e: unknown) => {
      console.error(`[ghl] conversion search for tag=${tag} failed:`, e);
      return { contacts: [] as Contact[] };
    });
    for (const c of res.contacts ?? []) {
      if (!out.find((x) => x.id === c.id)) out.push(c);
    }
  }
  return out;
}

type ConversationsSearchResponse = {
  conversations?: Conversation[];
};

export async function searchRecentConversations(): Promise<Conversation[]> {
  const params = new URLSearchParams({
    locationId: getLocationId(),
    lastMessageType: "any",
    limit: "50",
  });
  const res = await ghlFetch<ConversationsSearchResponse>(
    `/conversations/search?${params.toString()}`
  );
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return (res.conversations ?? []).filter((c) => {
    if (!c.lastMessageDate) return true;
    const t = new Date(c.lastMessageDate).getTime();
    return Number.isNaN(t) ? true : t >= cutoff;
  });
}

type WorkflowsResponse = {
  workflows?: Workflow[];
};

export async function getWorkflows(): Promise<Workflow[]> {
  const params = new URLSearchParams({ locationId: getLocationId() });
  const res = await ghlFetch<WorkflowsResponse>(
    `/workflows/?${params.toString()}`
  );
  return res.workflows ?? [];
}

type CalendarEventsResponse = {
  events?: CalendarEvent[];
};

export async function getTodaysAppointments(): Promise<CalendarEvent[]> {
  const { start, end } = getTodayUTCRange();
  const params = new URLSearchParams({
    locationId: getLocationId(),
    startTime: String(new Date(start).getTime()),
    endTime: String(new Date(end).getTime()),
  });
  const res = await ghlFetch<CalendarEventsResponse>(
    `/calendars/events?${params.toString()}`
  );
  return res.events ?? [];
}
