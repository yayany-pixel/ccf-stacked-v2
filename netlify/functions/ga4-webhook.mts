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

/** Acuity native webhook: authenticate exact body, then verify payment via API.
 * Never accept client-submitted purchase values, names, or arbitrary events.
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405 });
  const env = (key: string) => Netlify.env.get(key);
  const apiKey = env("ACUITY_API_KEY");
  const user = env("ACUITY_USER_ID");
  const measurement = env("GA4_MEASUREMENT_ID") || env("NEXT_PUBLIC_GA_ID_1");
  const secret = env("GA4_API_SECRET");
  const gaEnabled =
    env("GA4_PURCHASES_ENABLED") === "true" && !!measurement && !!secret;
  const metaEnabled =
    env("META_CAPI_ENABLED") === "true" &&
    !!env("META_CAPI_ACCESS_TOKEN") &&
    !!env("META_GRAPH_API_VERSION") &&
    !!env("NEXT_PUBLIC_META_PIXEL_ID");
  if (
    (!gaEnabled && !metaEnabled) ||
    env("ACUITY_CURRENCY") !== "USD" ||
    !apiKey ||
    !user
  )
    return new Response("Verified purchase integration is not enabled", {
      status: 503,
    });
  const body = await req.text();
  if (body.length > 10000)
    return new Response("Payload too large", { status: 413 });
  const signature = req.headers.get("x-acuity-signature") || "";
  const expected = createHmac("sha256", apiKey).update(body).digest("base64");
  if (
    Buffer.byteLength(signature) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  )
    return new Response("Unauthorized", { status: 401 });
  const payload = new URLSearchParams(body);
  const id = payload.get("id");
  if (!id || !/^\d+$/.test(id))
    return new Response("Invalid appointment ID", { status: 400 });
  try {
    const response = await fetch(
      `https://acuityscheduling.com/api/v1/appointments/${id}`,
      {
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${user}:${apiKey}`).toString("base64"),
        },
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok)
      return new Response("Booking verification unavailable", { status: 502 });
    const appointment = await response.json();
    // Only fully paid, non-cancelled appointments; no inferred or quoted revenue.
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
    const transactionId = `acuity:${id}`;
    let metaResult = metaEnabled ? "no_match" : "disabled";
    const match = acuityMetaMatch(appointment, env);
    if (metaEnabled && match?.client_user_agent) {
      try {
        const paymentsResponse = await fetch(
          `https://acuityscheduling.com/api/v1/appointments/${id}/payments`,
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
            capiDependencies(env),
          );
        } else {
          metaResult = "review";
        }
      } catch {
        metaResult = "review";
      } // Meta must not suppress verified GA4 delivery.
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
    const db = getDb();
    // Atomic insert prevents concurrent deliveries. Ambiguous sends are held for
    // operator reconciliation, never automatically replayed into double revenue.
    const claimed: any = await db.execute(
      sql`insert into analytics_purchases(transaction_id,status) values(${transactionId},'sending') on conflict do nothing returning transaction_id`,
    );
    if (!(claimed.rows ?? claimed).length)
      return new Response("Already recorded or awaiting reconciliation", {
        status: 200,
      });
    const result = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurement!)}&api_secret=${encodeURIComponent(secret!)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          client_id: `${createHmac("sha256", apiKey).update(transactionId).digest("hex").slice(0, 16)}.1`,
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
  } catch {
    return new Response(
      "Verification or delivery unavailable; inspect ledger before retry",
      { status: 502 },
    );
  }
}
