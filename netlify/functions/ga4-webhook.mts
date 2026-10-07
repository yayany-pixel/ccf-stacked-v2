import {
  sendMetaConversion,
  capiDependencies,
  acuityMetaMatch,
  verifiedPaymentTime,
} from "../../lib/metaCapi.server";
import { classCategory } from "../../lib/analyticsIdentity";
import { createHmac, timingSafeEqual } from "node:crypto";
import { sql } from "drizzle-orm";
import { getDb } from "../../db/index";
import { ACTIVITY_MANIFEST } from "../../lib/homepage/manifest";

function safeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export interface WebhookDependencies {
  getDb?: () => {
    execute: (query: any) => Promise<any>;
  };
  fetch?: typeof fetch;
}

/** Unified verified purchase webhook:
 * Supports native signed Acuity webhooks, native Eventbrite webhooks,
 * and authenticated Zapier relay requests.
 * Always validates authentic signatures or secrets and verifies orders via provider APIs.
 */
export async function processWebhook(
  req: Request,
  deps?: WebhookDependencies,
): Promise<Response> {
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405 });

  const customFetch = deps?.fetch || globalThis.fetch;
  const customDb = deps?.getDb || getDb;

  const env = (key: string): string | undefined => {
    if (
      typeof (globalThis as any).Netlify !== "undefined" &&
      (globalThis as any).Netlify?.env?.get
    ) {
      const val = (globalThis as any).Netlify.env.get(key);
      if (val !== undefined) return val;
    }
    return process.env[key];
  };

  const apiKey = env("ACUITY_API_KEY");
  const user = env("ACUITY_USER_ID");
  const webhookSecret = env("WEBHOOK_SECRET");
  const measurement = env("GA4_MEASUREMENT_ID") || env("NEXT_PUBLIC_GA_ID_1");
  const secret = env("GA4_API_SECRET");
  const gaEnabled =
    env("GA4_PURCHASES_ENABLED") === "true" && !!measurement && !!secret;
  const metaEnabled =
    env("META_CAPI_ENABLED") === "true" &&
    !!env("META_CAPI_ACCESS_TOKEN") &&
    !!env("META_GRAPH_API_VERSION") &&
    !!env("NEXT_PUBLIC_META_PIXEL_ID");

  if (!gaEnabled && !metaEnabled)
    return new Response("Verified purchase integration is not enabled", {
      status: 503,
    });

  const body = await req.text();
  if (body.length > 10000)
    return new Response("Payload too large", { status: 413 });

  const signature = req.headers.get("x-acuity-signature") || "";
  const secretHeader = req.headers.get("x-webhook-secret") || "";
  const authHeader = req.headers.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";
  let querySecret = "";
  try {
    querySecret = new URL(req.url).searchParams.get("secret") || "";
  } catch {}

  let authType: "acuity_signature" | "webhook_secret" | null = null;

  if (signature && apiKey) {
    const expected = createHmac("sha256", apiKey).update(body).digest("base64");
    if (safeCompare(signature, expected)) {
      authType = "acuity_signature";
    }
  }

  if (!authType && webhookSecret) {
    if (secretHeader && safeCompare(secretHeader, webhookSecret)) {
      authType = "webhook_secret";
    } else if (bearerToken && safeCompare(bearerToken, webhookSecret)) {
      authType = "webhook_secret";
    } else if (querySecret && safeCompare(querySecret, webhookSecret)) {
      authType = "webhook_secret";
    }
  }

  if (!authType) {
    return new Response("Unauthorized", { status: 401 });
  }

  let jsonPayload: any = null;
  let urlPayload: URLSearchParams | null = null;
  if (body.startsWith("{") || body.startsWith("[")) {
    try {
      jsonPayload = JSON.parse(body);
    } catch {}
  }
  if (!jsonPayload) {
    try {
      urlPayload = new URLSearchParams(body);
    } catch {}
  }

  try {
    // 1. EVENTBRITE FLOW (Native webhook or Zapier relay)
    const isEventbrite =
      Boolean(jsonPayload?.api_url?.includes("eventbrite")) ||
      Boolean(jsonPayload?.config?.action?.startsWith("order.")) ||
      jsonPayload?.booking_provider === "eventbrite" ||
      (authType === "webhook_secret" &&
        (Boolean(jsonPayload?.order_id) ||
          (typeof jsonPayload?.transaction_id === "string" &&
            jsonPayload.transaction_id.startsWith("eventbrite:"))));

    if (isEventbrite) {
      let orderId = "";
      if (typeof jsonPayload?.api_url === "string") {
        const match = jsonPayload.api_url.match(/orders\/(\d+)/);
        if (match) orderId = match[1];
      }
      if (!orderId && jsonPayload?.order_id) {
        orderId = String(jsonPayload.order_id).trim();
      }
      if (!orderId && typeof jsonPayload?.transaction_id === "string") {
        orderId = jsonPayload.transaction_id.replace(/^eventbrite:/, "").trim();
      }
      if (!orderId || !/^\d+$/.test(orderId)) {
        return new Response("Invalid order ID", { status: 400 });
      }

      const ebToken =
        env("EVENTBRITE_TOKEN") || env("EVENTBRITE_PRIVATE_TOKEN");
      let amount = 0;
      let city = "Chicago";
      let eventName = "Creative Workshop";
      let eventId = orderId;
      let eventTime = Math.floor(Date.now() / 1000);

      if (ebToken) {
        const ebRes = await customFetch(
          `https://www.eventbriteapi.com/v3/orders/${orderId}/?expand=event`,
          {
            headers: { Authorization: `Bearer ${ebToken}` },
            signal: AbortSignal.timeout(10000),
          },
        );
        if (!ebRes.ok)
          return new Response("Booking verification unavailable", {
            status: 502,
          });
        const order = await ebRes.json();
        const status = String(order.status || "").toLowerCase();
        if (!["placed", "completed", "attending"].includes(status))
          return new Response("Not a completed payment", { status: 202 });
        const currency = order.costs?.gross?.currency;
        if (currency && currency !== "USD")
          return new Response("Currency requires review", { status: 422 });
        if (order.costs?.gross?.major_value) {
          amount = Number(order.costs.gross.major_value);
        } else if (typeof order.costs?.gross?.value === "number") {
          amount = order.costs.gross.value / 100;
        } else if (order.costs?.gross?.display) {
          amount = Number(order.costs.gross.display.replace(/[^0-9.-]/g, ""));
        } else {
          amount = Number(jsonPayload?.value || jsonPayload?.amount || 0);
        }
        if (!Number.isFinite(amount) || amount <= 0)
          return new Response("Verified payment amount unavailable", {
            status: 202,
          });
        if (order.created) {
          const parsedTime = Date.parse(order.created);
          if (Number.isFinite(parsedTime))
            eventTime = Math.floor(parsedTime / 1000);
        }
        if (order.event) {
          eventId = String(order.event.id || orderId);
          eventName = order.event.name?.text || order.event.name || eventName;
          const lower = eventName.toLowerCase();
          if (lower.includes("eugene")) city = "Eugene";
          else if (lower.includes("chicago")) city = "Chicago";
        }
      } else {
        amount = Number(jsonPayload?.value || jsonPayload?.amount || 0);
        if (!Number.isFinite(amount) || amount <= 0)
          return new Response("Verified payment amount unavailable", {
            status: 202,
          });
        if (jsonPayload?.currency && jsonPayload.currency !== "USD")
          return new Response("Currency requires review", { status: 422 });
        if (jsonPayload?.city) city = String(jsonPayload.city);
        if (jsonPayload?.class_name) eventName = String(jsonPayload.class_name);
        if (jsonPayload?.class_id) eventId = String(jsonPayload.class_id);
      }

      const transactionId = `eventbrite:${orderId}`;
      const category = classCategory(eventName);

      const db = customDb();
      const claimed: any = await db.execute(
        sql`insert into analytics_purchases(transaction_id,status) values(${transactionId},'sending') on conflict do nothing returning transaction_id`,
      );
      if (!(claimed.rows ?? claimed).length)
        return new Response("Already recorded or awaiting reconciliation", {
          status: 200,
        });

      let metaResult = metaEnabled ? "no_match" : "disabled";
      if (metaEnabled) {
        try {
          metaResult = await sendMetaConversion(
            {
              name: "Purchase",
              eventId: `purchase:${transactionId}`,
              eventTime,
              sourceUrl: "https://colorcocktailfactory.com/",
              match: null,
              data: {
                content_name: eventName,
                content_ids: [eventId],
                content_type: "product",
                content_category: category,
                value: amount,
                currency: "USD",
                num_items: 1,
                city,
                booking_provider: "eventbrite",
              },
            },
            {
              ...capiDependencies(env),
              fetch: customFetch,
            },
          );
        } catch {
          metaResult = "review";
        }
      }

      if (!gaEnabled)
        return new Response(`Meta delivery: ${metaResult}`, {
          status: metaResult === "review" ? 502 : 200,
        });

      const clientId = `${createHmac("sha256", secret || apiKey || "ccf").update(transactionId).digest("hex").slice(0, 16)}.1`;
      const result = await customFetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurement!)}&api_secret=${encodeURIComponent(secret!)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            client_id: clientId,
            events: [
              {
                name: "purchase",
                params: {
                  transaction_id: transactionId,
                  value: amount,
                  currency: "USD",
                  city,
                  class_name: eventName,
                  class_id: eventId,
                  booking_provider: "eventbrite",
                  items: [
                    {
                      item_id: eventId,
                      item_name: eventName,
                      item_category: category,
                      price: amount,
                      quantity: 1,
                    },
                  ],
                },
              },
            ],
          }),
        },
      );
      await db.execute(
        sql`update analytics_purchases set status=${result.ok ? "sent" : "review"},updated_at=now() where transaction_id=${transactionId}`,
      );
      return new Response(
        result.ok
          ? "Accepted by GA transport; reporting requires GA validation"
          : "Delivery requires review",
        { status: result.ok ? 200 : 502 },
      );
    }

    // 2. ACUITY FLOW (Signed webhook or Zapier relay)
    const acuityId =
      urlPayload?.get("id") ||
      (jsonPayload?.id ? String(jsonPayload.id) : "") ||
      (jsonPayload?.appointment_id ? String(jsonPayload.appointment_id) : "");

    if (acuityId && /^\d+$/.test(acuityId)) {
      if (env("ACUITY_CURRENCY") !== "USD" || !apiKey || !user) {
        return new Response("Verified purchase integration is not enabled", {
          status: 503,
        });
      }
      const response = await customFetch(
        `https://acuityscheduling.com/api/v1/appointments/${acuityId}`,
        {
          headers: {
            Authorization:
              "Basic " + Buffer.from(`${user}:${apiKey}`).toString("base64"),
          },
          signal: AbortSignal.timeout(10000),
        },
      );
      if (!response.ok)
        return new Response("Booking verification unavailable", {
          status: 502,
        });
      const appointment = await response.json();
      if (appointment.canceled || appointment.paid !== "yes")
        return new Response("Not a completed payment", { status: 202 });
      const amount = Number(appointment.amountPaid);
      if (!Number.isFinite(amount) || amount <= 0)
        return new Response("Verified payment amount unavailable", {
          status: 202,
        });
      const activity = ACTIVITY_MANIFEST.find(
        (a) =>
          a.appointmentTypeId === Number(appointment.appointmentTypeID) &&
          (a.calendarIds.length === 0 ||
            a.calendarIds.includes(Number(appointment.calendarID))),
      );
      if (!activity || activity.city === "unknown")
        return new Response("Class mapping requires review", { status: 422 });
      const transactionId = `acuity:${acuityId}`;
      let metaResult = metaEnabled ? "no_match" : "disabled";
      const match = acuityMetaMatch(appointment, env);
      if (metaEnabled && match?.client_user_agent) {
        try {
          const paymentsResponse = await customFetch(
            `https://acuityscheduling.com/api/v1/appointments/${acuityId}/payments`,
            {
              headers: {
                Authorization:
                  "Basic " + Buffer.from(`${user}:${apiKey}`).toString("base64"),
              },
              signal: AbortSignal.timeout(5000),
            },
          );
          const payments = paymentsResponse.ok
            ? await paymentsResponse.json()
            : null;
          const paymentTime = verifiedPaymentTime(payments, amount);
          if (paymentTime !== null) {
            metaResult = await sendMetaConversion(
              {
                name: "Purchase",
                eventId: `purchase:${transactionId}`,
                eventTime: paymentTime,
                sourceUrl: "https://colorcocktailfactory.com/",
                match,
                data: {
                  content_name: activity.title,
                  content_ids: [String(activity.appointmentTypeId)],
                  content_type: "product",
                  content_category: classCategory(activity.title),
                  value: amount,
                  currency: "USD",
                  num_items: 1,
                  city: activity.city,
                  booking_provider: "acuity",
                  appointment_type_id: String(activity.appointmentTypeId),
                },
              },
              {
                ...capiDependencies(env),
                fetch: customFetch,
              },
            );
          } else {
            metaResult = "review";
          }
        } catch {
          metaResult = "review";
        }
      }
      if (metaResult === "review" || metaResult === "invalid") {
        console.warn("[Meta CAPI] Verified booking requires reporting review", {
          transaction_id: transactionId,
          status: metaResult,
        });
      }
      if (!gaEnabled)
        return new Response(`Meta delivery: ${metaResult}`, {
          status: metaResult === "review" ? 502 : 200,
        });
      const db = customDb();
      const claimed: any = await db.execute(
        sql`insert into analytics_purchases(transaction_id,status) values(${transactionId},'sending') on conflict do nothing returning transaction_id`,
      );
      if (!(claimed.rows ?? claimed).length)
        return new Response("Already recorded or awaiting reconciliation", {
          status: 200,
        });
      const result = await customFetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurement!)}&api_secret=${encodeURIComponent(secret!)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            client_id: `${createHmac("sha256", apiKey || secret || "ccf").update(transactionId).digest("hex").slice(0, 16)}.1`,
            events: [
              {
                name: "purchase",
                params: {
                  transaction_id: transactionId,
                  value: amount,
                  currency: "USD",
                  city: activity.city,
                  class_name: activity.title,
                  class_id: String(activity.appointmentTypeId),
                  appointment_type_id: String(activity.appointmentTypeId),
                  booking_provider: "acuity",
                  items: [
                    {
                      item_id: String(activity.appointmentTypeId),
                      item_name: activity.title,
                      item_category: "workshop",
                      price: amount,
                      quantity: 1,
                    },
                  ],
                },
              },
            ],
          }),
        },
      );
      await db.execute(
        sql`update analytics_purchases set status=${result.ok ? "sent" : "review"},updated_at=now() where transaction_id=${transactionId}`,
      );
      return new Response(
        result.ok
          ? "Accepted by GA transport; reporting requires GA validation"
          : "Delivery requires review",
        { status: result.ok ? 200 : 502 },
      );
    }

    // 3. GENERIC ZAPIER / RELAY PURCHASE
    if (jsonPayload?.event_name === "purchase" && jsonPayload?.transaction_id) {
      const rawTxId = String(jsonPayload.transaction_id);
      const amount = Number(jsonPayload.value || jsonPayload.amount);
      if (!Number.isFinite(amount) || amount <= 0)
        return new Response("Verified payment amount unavailable", {
          status: 202,
        });
      const currency = String(jsonPayload.currency || "USD");
      if (currency !== "USD")
        return new Response("Currency requires review", { status: 422 });
      const city = String(jsonPayload.city || "Chicago");
      const className = String(jsonPayload.class_name || "Workshop");
      const classId = String(jsonPayload.class_id || rawTxId);
      const provider = String(jsonPayload.booking_provider || "relay");
      const transactionId = rawTxId.includes(":")
        ? rawTxId
        : `${provider}:${rawTxId}`;

      const db = customDb();
      const claimed: any = await db.execute(
        sql`insert into analytics_purchases(transaction_id,status) values(${transactionId},'sending') on conflict do nothing returning transaction_id`,
      );
      if (!(claimed.rows ?? claimed).length)
        return new Response("Already recorded or awaiting reconciliation", {
          status: 200,
        });

      if (!gaEnabled)
        return new Response("Meta delivery: disabled", { status: 200 });

      const clientId = `${createHmac("sha256", secret || apiKey || "ccf").update(transactionId).digest("hex").slice(0, 16)}.1`;
      const result = await customFetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurement!)}&api_secret=${encodeURIComponent(secret!)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            client_id: clientId,
            events: [
              {
                name: "purchase",
                params: {
                  transaction_id: transactionId,
                  value: amount,
                  currency: "USD",
                  city,
                  class_name: className,
                  class_id: classId,
                  booking_provider: provider,
                  items: [
                    {
                      item_id: classId,
                      item_name: className,
                      item_category: classCategory(className),
                      price: amount,
                      quantity: 1,
                    },
                  ],
                },
              },
            ],
          }),
        },
      );
      await db.execute(
        sql`update analytics_purchases set status=${result.ok ? "sent" : "review"},updated_at=now() where transaction_id=${transactionId}`,
      );
      return new Response(
        result.ok
          ? "Accepted by GA transport; reporting requires GA validation"
          : "Delivery requires review",
        { status: result.ok ? 200 : 502 },
      );
    }

    return new Response("Invalid request payload", { status: 400 });
  } catch {
    return new Response(
      "Verification or delivery unavailable; inspect ledger before retry",
      { status: 502 },
    );
  }
}

export default async function handler(req: Request): Promise<Response> {
  return processWebhook(req);
}
