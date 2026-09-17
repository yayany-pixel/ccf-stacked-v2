/**
 * Ask CCF — durable state (Netlify Database / Postgres).
 *
 * Rate limits, usage counters, private-party inquiries and the staff pottery
 * pickup tracker all live here. Hourly limits can fall back to memory, but
 * model calls and inquiry submission stop if their durable controls are
 * unavailable. The UI then offers booking and staff contact links.
 */
import { and, eq, sql } from "drizzle-orm";
import { createHash } from "node:crypto";
import { connectionString, getDb } from "../../db/index";
import {
  askCcfInquiries,
  askCcfPickupOrders,
  askCcfRateLimits,
  askCcfUsage,
} from "../../db/schema";

export function hashId(value: string): string {
  const salt = process.env.CCF_AI_HASH_SALT ?? "ask-ccf";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex").slice(0, 32);
}

export function databaseConfigured(): boolean {
  return Boolean(connectionString());
}

export type DatabaseStatus = {
  configured: boolean;
  reachable: boolean;
  /** Whether the connected role may write. Reads alone cannot persist a lead. */
  writable: boolean;
};

let statusCache: DatabaseStatus | null = null;

/**
 * Probe Postgres once per server instance.
 *
 * `databaseConfigured()` only proves a connection string exists, and a
 * successful read proves nothing about persistence: build-time connection
 * strings use a read-only role. `writable` is checked with a privilege lookup
 * rather than a trial insert, so the probe never leaves rows behind.
 */
export async function databaseStatus(): Promise<DatabaseStatus> {
  if (statusCache) return statusCache;
  if (!databaseConfigured()) {
    statusCache = { configured: false, reachable: false, writable: false };
    return statusCache;
  }
  try {
    const rows: any = await getDb().execute(
      sql`select has_table_privilege('ask_ccf_inquiries', 'INSERT') as writable`,
    );
    const writable = Boolean((rows.rows ?? rows)[0]?.writable);
    statusCache = { configured: true, reachable: true, writable };
  } catch (error) {
    console.error("[AskCCF] database probe failed:", describe(error));
    statusCache = { configured: true, reachable: false, writable: false };
  }
  return statusCache;
}

/* ------------------------------------------------------------------ *
 * Rate limiting
 * ------------------------------------------------------------------ */

/** Non-durable last resort, used only when Postgres is unreachable. */
const memoryWindows = new Map<string, { count: number; expiresAt: number }>();

export type RateLimitResult = {
  allowed: boolean;
  count: number;
  limit: number;
  /** True when the durable store was unavailable and memory was used. */
  degraded: boolean;
  retryAfterSeconds: number;
};

export async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const expiresAt = new Date(Date.now() + windowMs);
  const retryAfterSeconds = Math.ceil(windowMs / 1000);

  if (databaseConfigured()) {
    try {
      const [row] = await getDb()
        .insert(askCcfRateLimits)
        .values({ bucket: key, count: 1, expiresAt })
        .onConflictDoUpdate({
          target: askCcfRateLimits.bucket,
          set: {
            // Expired window → start over; otherwise increment.
            count: sql`case when ${askCcfRateLimits.expiresAt} < now() then 1 else ${askCcfRateLimits.count} + 1 end`,
            expiresAt: sql`case when ${askCcfRateLimits.expiresAt} < now() then ${expiresAt.toISOString()}::timestamp else ${askCcfRateLimits.expiresAt} end`,
          },
        })
        .returning({ count: askCcfRateLimits.count });

      const count = row?.count ?? 1;
      return { allowed: count <= limit, count, limit, degraded: false, retryAfterSeconds };
    } catch (error) {
      console.error("[AskCCF] rate limit store unavailable:", describe(error));
    }
  }

  const now = Date.now();
  const existing = memoryWindows.get(key);
  if (!existing || existing.expiresAt < now) {
    memoryWindows.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, count: 1, limit, degraded: true, retryAfterSeconds };
  }
  existing.count += 1;
  return {
    allowed: existing.count <= limit,
    count: existing.count,
    limit,
    degraded: true,
    retryAfterSeconds,
  };
}

/* ------------------------------------------------------------------ *
 * Usage accounting (aggregate only — no message text, no identifiers)
 * ------------------------------------------------------------------ */

export async function recordUsage(input: {
  model: string;
  promptTokens: number;
  completionTokens: number;
  viaGateway: boolean;
  failed?: boolean;
}): Promise<void> {
  if (!databaseConfigured()) return;
  const day = new Date().toISOString().slice(0, 10);
  try {
    await getDb()
      .insert(askCcfUsage)
      .values({
        day,
        model: input.model,
        requests: 1,
        promptTokens: input.promptTokens,
        completionTokens: input.completionTokens,
        errors: input.failed ? 1 : 0,
        viaGateway: input.viaGateway,
      })
      .onConflictDoUpdate({
        target: [askCcfUsage.day, askCcfUsage.model],
        set: {
          requests: sql`${askCcfUsage.requests} + 1`,
          promptTokens: sql`${askCcfUsage.promptTokens} + ${input.promptTokens}`,
          completionTokens: sql`${askCcfUsage.completionTokens} + ${input.completionTokens}`,
          errors: sql`${askCcfUsage.errors} + ${input.failed ? 1 : 0}`,
        },
      });
  } catch (error) {
    console.error("[AskCCF] usage log failed:", describe(error));
  }
}

/** Requests recorded today across all models — backs the daily spend cap. */
export async function requestsToday(): Promise<number | null> {
  if (!databaseConfigured()) return null;
  const day = new Date().toISOString().slice(0, 10);
  try {
    const rows = await getDb()
      .select({ requests: askCcfUsage.requests })
      .from(askCcfUsage)
      .where(eq(askCcfUsage.day, day));
    return rows.reduce((total, row) => total + (row.requests ?? 0), 0);
  } catch (error) {
    console.error("[AskCCF] usage read failed:", describe(error));
    return null;
  }
}

/** Reserve before calling the model, atomically across every function instance.
 * Seed from existing usage when deployed mid-day. Database failure fails closed.
 */
export async function reserveDailyRequest(limit: number): Promise<"allowed" | "limited" | "unavailable"> {
  if (!databaseConfigured()) return "unavailable";
  const day = new Date().toISOString().slice(0, 10);
  const bucket = `daily-chat:${day}`;
  try {
    const result: any = await getDb().execute(sql`
      insert into ask_ccf_rate_limits (bucket, count, expires_at)
      select ${bucket}, coalesce(sum(requests), 0)::integer + 1, now() + interval '2 days'
      from ask_ccf_usage where day = ${day}::date
      having coalesce(sum(requests), 0) < ${limit}
      on conflict (bucket) do update set count = ask_ccf_rate_limits.count + 1
      where ask_ccf_rate_limits.count < ${limit}
      returning count
    `);
    return (result.rows ?? result).length > 0 ? "allowed" : "limited";
  } catch (error) {
    console.error("[AskCCF] request reservation unavailable:", describe(error));
    return "unavailable";
  }
}

/* ------------------------------------------------------------------ *
 * Private-party inquiries
 * ------------------------------------------------------------------ */

export type InquiryInput = {
  sessionId: string;
  name: string;
  email: string;
  phone?: string | null;
  city: string;
  preferredDate?: string | null;
  groupSize?: string | null;
  activity?: string | null;
  budget?: string | null;
  notes?: string | null;
};

export function inquiryDedupeKey(input: InquiryInput): string {
  return hashId(
    [
      input.email.trim().toLowerCase(),
      input.city.trim().toLowerCase(),
      (input.preferredDate ?? "").trim(),
      (input.groupSize ?? "").trim(),
      (input.activity ?? "").trim().toLowerCase(),
    ].join("|"),
  );
}

export type SaveInquiryResult =
  | { outcome: "saved"; id: number }
  | { outcome: "duplicate" }
  | { outcome: "busy" }
  | { outcome: "unavailable"; reason: string };

export async function saveInquiry(input: InquiryInput): Promise<SaveInquiryResult> {
  if (!databaseConfigured()) {
    return { outcome: "unavailable", reason: "database_not_configured" };
  }
  try {
    const rows = await getDb()
      .insert(askCcfInquiries)
      .values({
        sessionHash: hashId(input.sessionId),
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        city: input.city,
        preferredDate: input.preferredDate ?? null,
        groupSize: input.groupSize ?? null,
        activity: input.activity ?? null,
        budget: input.budget ?? null,
        notes: input.notes ?? null,
        dedupeKey: inquiryDedupeKey(input),
        status: "notifying",
        notifyStartedAt: new Date(),
      })
      .onConflictDoNothing({ target: askCcfInquiries.dedupeKey })
      .returning({ id: askCcfInquiries.id });

    if (rows.length === 0) {
      // Claim a failed attempt or an expired lease. Only one concurrent retry
      // may notify; a saved row alone is never treated as proof of delivery.
      const [retry] = await getDb().update(askCcfInquiries).set({
        status: "notifying", notifyStartedAt: new Date(), notifyError: null,
        name: input.name, phone: input.phone ?? null, budget: input.budget ?? null, notes: input.notes ?? null,
      }).where(and(
        eq(askCcfInquiries.dedupeKey, inquiryDedupeKey(input)),
        sql`(${askCcfInquiries.status} in ('received', 'notify_failed') or (${askCcfInquiries.status} = 'notifying' and ${askCcfInquiries.notifyStartedAt} < now() - interval '2 minutes'))`,
      )).returning({ id: askCcfInquiries.id });
      if (retry) return { outcome: "saved", id: retry.id };
      const [existing] = await getDb().select({ status: askCcfInquiries.status }).from(askCcfInquiries)
        .where(eq(askCcfInquiries.dedupeKey, inquiryDedupeKey(input))).limit(1);
      return { outcome: existing?.status === "notified" ? "duplicate" : "busy" };
    }
    return { outcome: "saved", id: rows[0].id };
  } catch (error) {
    return { outcome: "unavailable", reason: describe(error) };
  }
}

export async function markInquiryNotified(
  id: number,
  status: "notified" | "notify_failed",
  notifyError?: string,
): Promise<void> {
  if (!databaseConfigured()) return;
  try {
    await getDb()
      .update(askCcfInquiries)
      .set({ status, notifyError: notifyError?.slice(0, 500) ?? null })
      .where(eq(askCcfInquiries.id, id));
  } catch (error) {
    console.error("[AskCCF] inquiry status update failed:", describe(error));
  }
}

/* ------------------------------------------------------------------ *
 * Pottery pickup tracker (staff-maintained)
 * ------------------------------------------------------------------ */

export type PickupRecord = {
  className: string;
  city: string;
  classDate: string | null;
  status: string;
  readyOn: string | null;
  pieceCount: number | null;
  note: string | null;
  updatedAt: string | null;
};

export type PickupLookupResult =
  | { outcome: "found"; records: PickupRecord[] }
  | { outcome: "no_records" }
  | { outcome: "unavailable"; reason: string };

/**
 * Look up pickup records. Requires BOTH the email on the booking and the
 * customer's last name — a single field is never enough to reveal a record.
 * Only pickup-relevant fields are returned: no other customers, no order
 * totals, no contact details.
 */
export async function lookupPickup(
  email: string,
  lastName: string,
): Promise<PickupLookupResult> {
  if (!databaseConfigured()) {
    return { outcome: "unavailable", reason: "tracker_not_configured" };
  }
  try {
    const rows = await getDb()
      .select({
        className: askCcfPickupOrders.className,
        city: askCcfPickupOrders.city,
        classDate: askCcfPickupOrders.classDate,
        status: askCcfPickupOrders.status,
        readyOn: askCcfPickupOrders.readyOn,
        pieceCount: askCcfPickupOrders.pieceCount,
        note: askCcfPickupOrders.note,
        updatedAt: askCcfPickupOrders.updatedAt,
      })
      .from(askCcfPickupOrders)
      .where(
        and(
          eq(sql`lower(${askCcfPickupOrders.customerEmail})`, email.trim().toLowerCase()),
          eq(sql`lower(${askCcfPickupOrders.customerLastName})`, lastName.trim().toLowerCase()),
        ),
      )
      .limit(10);

    if (rows.length === 0) return { outcome: "no_records" };

    return {
      outcome: "found",
      records: rows.map((row) => ({
        className: row.className,
        city: row.city,
        classDate: row.classDate ?? null,
        status: row.status,
        readyOn: row.readyOn ?? null,
        pieceCount: row.pieceCount ?? null,
        note: row.note ?? null,
        updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString().slice(0, 10) : null,
      })),
    };
  } catch (error) {
    return { outcome: "unavailable", reason: describe(error) };
  }
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
