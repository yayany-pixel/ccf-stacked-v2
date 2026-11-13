/** Server-confirmed bookings only; this module has no public event ingestion API. */
import { createHmac, timingSafeEqual } from "node:crypto";
import { appointmentReference, resolveBookingReference, type ReferencePreferences } from "./bookingReference.server";
import { verifiedPaymentTime } from "./metaCapi.server";
import { openAIAttribution } from "./openaiEvents";

export type OpenAIConversionDependencies = {
  env: (key: string) => string | undefined;
  fetch: typeof fetch;
  now: () => number;
  preferences: (id: string) => Promise<ReferencePreferences | null>;
  claim: (key: string) => Promise<"claimed" | "sent" | "busy">;
  finish: (key: string, status: "sent" | "retry") => Promise<void>;
};

export async function receiveOpenAIBooking(req: Request, deps: OpenAIConversionDependencies): Promise<Response> {
  const reply = (message: string, status = 200) => new Response(message, {
    status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
  if (req.method !== "POST") return reply("Method not allowed", 405);
  const { env } = deps;
  const apiKey = env("ACUITY_API_KEY"), user = env("ACUITY_USER_ID");
  const pixel = env("NEXT_PUBLIC_OPENAI_PIXEL_ID"), token = env("OPENAI_CONVERSIONS_API_KEY");
  if (env("CONTEXT") !== "production" || env("OPENAI_CONVERSIONS_ENABLED") !== "true" ||
    !apiKey || !user || !pixel || !token || env("ACUITY_CURRENCY") !== "USD")
    return reply("Booking measurement is not enabled", 500);
  const body = await req.text();
  if (body.length > 10000) return reply("Payload too large", 413);
  const signature = req.headers.get("x-acuity-signature") || "";
  const expected = createHmac("sha256", apiKey).update(body).digest("base64");
  if (Buffer.byteLength(signature) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected)))
    return reply("Unauthorized", 401);
  const payload = new URLSearchParams(body), id = payload.get("id");
  if (!id || !/^\d+$/.test(id)) return reply("Invalid appointment", 400);
  if (!["scheduled", "changed"].includes(payload.get("action") || "")) return reply("Event not applicable", 202);
  const auth = { Authorization: "Basic " + Buffer.from(`${user}:${apiKey}`).toString("base64") };
  try {
    const bookingRes = await deps.fetch(`https://acuityscheduling.com/api/v1/appointments/${id}`, {
      headers: auth, signal: AbortSignal.timeout(8000),
    });
    if (!bookingRes.ok) return reply("Booking verification unavailable", 500);
    const booking = await bookingRes.json();
    const amount = Number(booking.amountPaid);
    if (booking.canceled || booking.paid !== "yes" || !Number.isFinite(amount) || amount <= 0 || !Number.isSafeInteger(Math.round(amount * 100)))
      return reply("Not a completed paid booking", 202);
    const now = Math.floor(deps.now() / 1000);
    let preferenceUnavailable = false;
    const reference = await resolveBookingReference(
      appointmentReference(booking, env("ACUITY_GA4_REFERENCE_FIELD_ID")), apiKey, now, async preferenceId => {
        try { return await deps.preferences(preferenceId); }
        catch { preferenceUnavailable = true; throw new Error("preferences_unavailable"); }
      },
    );
    if (preferenceUnavailable) return reply("Consent verification unavailable", 500);
    const match = reference?.marketing ? openAIAttribution(reference.openai) : undefined;
    if (!match) return reply("No consented advertising reference", 202);
    const paymentsRes = await deps.fetch(`https://acuityscheduling.com/api/v1/appointments/${id}/payments`, {
      headers: auth, signal: AbortSignal.timeout(8000),
    });
    if (!paymentsRes.ok) return reply("Payment verification unavailable", 500);
    const paidAt = verifiedPaymentTime(await paymentsRes.json(), amount);
    if (paidAt === null || paidAt > now + 60 || paidAt < now - 7 * 86400 || paidAt < reference!.issuedAt - 60)
      return reply("Payment time is not eligible", 202);
    const eventId = `acuity:appointment:${id}`;
    const key = `${pixel}:appointment_scheduled:${eventId}`;
    const claimed = await deps.claim(key);
    if (claimed === "sent") return reply("Already accepted");
    // Keep provider retries alive if an earlier invocation stopped after claiming.
    if (claimed === "busy") return reply("Delivery still in progress", 500);
    let accepted = false;
    try {
      const result = await deps.fetch(`https://bzr.openai.com/v1/events?pid=${encodeURIComponent(pixel)}`, {
        method: "POST", signal: AbortSignal.timeout(8000),
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ events: [{
          id: eventId, type: "appointment_scheduled", timestamp_ms: paidAt * 1000,
          action_source: "web", source_url: "https://colorcocktailfactory.as.me/",
          ...(match.oppref ? { oppref: match.oppref } : {}),
          ...(match.obref ? { user: { obref: match.obref } } : {}),
          opt_out: true,
          data: { type: "customer_action", amount: Math.round(amount * 100), currency: "USD" },
        }] }),
      });
      accepted = result.ok;
    } catch { /* The same event ID makes a retry safe after ambiguous transport. */ }
    await deps.finish(key, accepted ? "sent" : "retry");
    return reply(accepted ? "Booking accepted by conversion transport" : "Conversion delivery will retry", accepted ? 200 : 500);
  } catch {
    // Acuity retries HTTP 500; never return provider payloads or private booking data.
    return reply("Booking verification or delivery unavailable", 500);
  }
}
