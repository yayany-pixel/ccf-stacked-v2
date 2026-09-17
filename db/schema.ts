/**
 * Ask CCF — database schema (Netlify Database / Postgres)
 *
 * Tables are namespaced `ask_ccf_*` so they never collide with anything the
 * marketing site adds later. All customer-facing writes go through
 * lib/askccf/store.ts, never directly from UI code.
 */
import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  date,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/**
 * Private-party inquiries captured by the assistant.
 * A copy is also pushed into the existing Netlify `private-party` form so the
 * studio's configured notifications fire; this table is the durable record.
 */
export const askCcfInquiries = pgTable(
  "ask_ccf_inquiries",
  {
    id: serial().primaryKey(),
    // Hashed session id — never the raw one, so rows cannot be joined back to a browser.
    sessionHash: text("session_hash").notNull(),
    name: text().notNull(),
    email: text().notNull(),
    phone: text(),
    city: text().notNull(),
    preferredDate: text("preferred_date"),
    groupSize: text("group_size"),
    activity: text(),
    budget: text(),
    notes: text(),
    // "received" | "notifying" | "notified" | "notify_failed"
    status: text().notNull().default("received"),
    notifyError: text("notify_error"),
    notifyStartedAt: timestamp("notify_started_at"),
    // Stable hash of the inquiry content; blocks accidental double submits.
    dedupeKey: text("dedupe_key").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [uniqueIndex("ask_ccf_inquiries_dedupe_key_idx").on(t.dedupeKey)],
);

/**
 * Staff-maintained pottery pickup tracker.
 * Empty by design until the studio imports records — the assistant falls back
 * to clearly-labelled estimates when there is no verified row.
 */
export const askCcfPickupOrders = pgTable(
  "ask_ccf_pickup_orders",
  {
    id: serial().primaryKey(),
    // Lowercased email, used together with last name as the verification pair.
    customerEmail: text("customer_email").notNull(),
    customerLastName: text("customer_last_name").notNull(),
    orderRef: text("order_ref"),
    className: text("class_name").notNull(),
    city: text().notNull(),
    classDate: date("class_date"),
    // "in_studio" | "firing" | "glazing" | "ready" | "picked_up"
    status: text().notNull().default("in_studio"),
    readyOn: date("ready_on"),
    pieceCount: integer("piece_count"),
    note: text(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [index("ask_ccf_pickup_email_idx").on(t.customerEmail)],
);

/**
 * Durable fixed-window rate limiting and usage caps.
 * One row per (key, window) — survives function cold starts and instances.
 */
export const askCcfRateLimits = pgTable(
  "ask_ccf_rate_limits",
  {
    id: serial().primaryKey(),
    // e.g. "chat:ip:<hash>:2026-09-12T14", "pickup:session:<hash>:2026-09-12T14"
    bucket: text().notNull(),
    count: integer().notNull().default(0),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => [uniqueIndex("ask_ccf_rate_limits_bucket_idx").on(t.bucket)],
);

/**
 * Aggregate, non-personal usage log for cost visibility.
 * No message text, no customer identifiers.
 */
export const askCcfUsage = pgTable(
  "ask_ccf_usage",
  {
    id: serial().primaryKey(),
    day: date().notNull(),
    model: text().notNull(),
    requests: integer().notNull().default(0),
    promptTokens: integer("prompt_tokens").notNull().default(0),
    completionTokens: integer("completion_tokens").notNull().default(0),
    errors: integer().notNull().default(0),
    viaGateway: boolean("via_gateway").notNull().default(true),
  },
  (t) => [uniqueIndex("ask_ccf_usage_day_model_idx").on(t.day, t.model)],
);
