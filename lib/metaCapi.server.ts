/** SERVER ONLY. Never imported by the browser analytics layer. */
import { sql } from "drizzle-orm";
import { getDb } from "../db/index";
import {
  sanitizeMeta,
  parseMetaMatch,
  validEventId,
  type MetaParameters,
} from "./metaEvents";
export interface VerifiedMetaConversion {
  name: "Lead" | "Purchase";
  eventId: string;
  eventTime: number;
  sourceUrl: string;
  match: unknown;
  data: MetaParameters;
}
export interface CapiDependencies {
  env: (key: string) => string | undefined;
  fetch: typeof fetch;
  claim: (key: string) => Promise<boolean>;
  finish: (key: string, status: "sent" | "review") => Promise<void>;
}
export function capiDependencies(
  env: (key: string) => string | undefined,
): CapiDependencies {
  return {
    env,
    fetch: globalThis.fetch,
    claim: async (key) => {
      const result: any = await getDb().execute(
        sql`insert into meta_event_deliveries(event_key,status) values(${key},'sending') on conflict do nothing returning event_key`,
      );
      return (result.rows ?? result).length > 0;
    },
    finish: async (key, status) => {
      await getDb().execute(
        sql`update meta_event_deliveries set status=${status},updated_at=now() where event_key=${key}`,
      );
    },
  };
}
/** Only invoke from a server-confirmed lead or verified provider payment handler.
 * There is deliberately no public endpoint accepting arbitrary client events.
 */
export async function sendMetaConversion(
  event: VerifiedMetaConversion,
  deps: CapiDependencies,
): Promise<
  "disabled" | "no_match" | "invalid" | "duplicate" | "sent" | "review"
> {
  const { env } = deps;
  const token = env("META_CAPI_ACCESS_TOKEN");
  const pixel = env("NEXT_PUBLIC_META_PIXEL_ID");
  const version = env("META_GRAPH_API_VERSION");
  if (
    env("META_CAPI_ENABLED") !== "true" ||
    !token ||
    !pixel ||
    !/^\d+$/.test(pixel) ||
    !version ||
    !/^v\d+\.\d+$/.test(version)
  )
    return "disabled";
  const match = parseMetaMatch(event.match);
  if (!match?.client_user_agent) return "no_match";
  const now = Math.floor(Date.now() / 1000);
  if (
    !["Lead", "Purchase"].includes(event.name) ||
    !validEventId(event.eventId) ||
    !Number.isInteger(event.eventTime) ||
    event.eventTime > now + 60 ||
    event.eventTime < now - 7 * 86400
  )
    return "invalid";
  const data = sanitizeMeta(event.data);
  if (
    event.name === "Purchase" &&
    (typeof data.value !== "number" ||
      data.value <= 0 ||
      !data.content_ids?.length ||
      data.currency !== "USD" ||
      event.data.currency !== "USD")
  )
    return "invalid";
  let source: string;
  try {
    const url = new URL(event.sourceUrl);
    if (url.origin !== "https://colorcocktailfactory.com") return "invalid";
    source = url.origin + url.pathname;
  } catch {
    return "invalid";
  }
  const key = `${pixel}:${event.name}:${event.eventId}`;
  try {
    if (!(await deps.claim(key))) return "duplicate";
    const response = await deps.fetch(
      `https://graph.facebook.com/${version}/${pixel}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({
          data: [
            {
              event_name: event.name,
              event_time: event.eventTime,
              event_id: event.eventId,
              action_source: "website",
              event_source_url: source,
              user_data: {
                client_user_agent: match.client_user_agent,
                ...(match.fbp ? { fbp: match.fbp } : {}),
                ...(match.fbc ? { fbc: match.fbc } : {}),
              },
              custom_data: data,
            },
          ],
          ...(env("META_CAPI_TEST_EVENT_CODE")
            ? { test_event_code: env("META_CAPI_TEST_EVENT_CODE") }
            : {}),
        }),
      },
    );
    const result = await response.json().catch(() => null);
    const status =
      response.ok && result?.events_received === 1 ? "sent" : "review";
    await deps.finish(key, status);
    return status;
  } catch {
    // Ambiguous sends remain held for reconciliation, never silently replayed.
    // Do not log provider response bodies, payloads, or credential-bearing URLs.
    return "review";
  }
}
/** Optional provider intake fields must be configured and consented explicitly.
 * Existing forms/booking URLs are not changed or decorated by this integration.
 */
export function acuityMetaMatch(
  appointment: unknown,
  env: (key: string) => string | undefined,
) {
  const forms =
    appointment && typeof appointment === "object"
      ? (appointment as { forms?: unknown }).forms
      : null;
  const fields: Array<{ fieldID?: number; value?: unknown }> = Array.isArray(
    forms,
  )
    ? forms.flatMap((f) =>
        f && Array.isArray(f.values)
          ? f.values.filter((v: unknown) => v && typeof v === "object")
          : [],
      )
    : [];
  const get = (key: string) => {
    const id = env(key);
    return id && /^\d+$/.test(id)
      ? fields.find((f) => String(f.fieldID) === id)?.value
      : undefined;
  };
  return parseMetaMatch({
    consent: get("ACUITY_META_CONSENT_FIELD_ID"),
    fbp: get("ACUITY_META_FBP_FIELD_ID"),
    fbc: get("ACUITY_META_FBC_FIELD_ID"),
    client_user_agent: get("ACUITY_META_USER_AGENT_FIELD_ID"),
  });
}

/** Acuity /appointments/{id}/payments: corroborate amountPaid and use the final
 * actual payment timestamp. Never treat a later edit/redelivery as new revenue.
 */
export function verifiedPaymentTime(
  payments: unknown,
  amountPaid: number,
): number | null {
  if (
    !Array.isArray(payments) ||
    !payments.length ||
    payments.length > 100 ||
    !Number.isFinite(amountPaid) ||
    amountPaid <= 0
  )
    return null;
  let cents = 0;
  let latest = 0;
  const ids = new Set<string>();
  for (const payment of payments) {
    if (
      !payment ||
      typeof payment.transactionID !== "string" ||
      !payment.transactionID ||
      ids.has(payment.transactionID)
    )
      return null;
    ids.add(payment.transactionID);
    if (
      typeof payment.created !== "string" ||
      !/(?:Z|[+-]\d{2}:?\d{2})$/.test(payment.created)
    )
      return null;
    const time = Date.parse(payment.created);
    const amount = Number(payment.amount);
    if (!Number.isFinite(time) || !Number.isFinite(amount) || amount <= 0)
      return null;
    cents += Math.round(amount * 100);
    latest = Math.max(latest, Math.floor(time / 1000));
  }
  return cents === Math.round(amountPaid * 100) ? latest : null;
}
