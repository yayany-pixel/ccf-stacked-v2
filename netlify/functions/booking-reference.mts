import type { Config } from "@netlify/functions";
import { privacyStore } from "../../lib/privacy.server";
import { payloadError, readPayload } from "../../lib/askccf/security";
import { referencePreferenceId, sealBookingReference, validGoogleIds } from "../../lib/bookingReference.server";

/** Issues an opaque reference only. It cannot report purchases or accept revenue. */
export default async function handler(request: Request): Promise<Response> {
  const headers = { "Cache-Control": "private, no-store", "Vary": "Cookie", "X-Content-Type-Options": "nosniff" };
  const json = (value: unknown, status = 200) => Response.json(value, { status, headers });
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  // Unlike the general API helpers, this browser-only endpoint requires an Origin.
  if (request.headers.get("origin") !== new URL(request.url).origin ||
    request.headers.get("sec-fetch-site") === "cross-site") return json({ error: "forbidden_origin" }, 403);
  const secret = Netlify.env.get("ACUITY_API_KEY");
  const fieldId = Netlify.env.get("ACUITY_GA4_REFERENCE_FIELD_ID");
  if (!secret || !fieldId || !/^\d+$/.test(fieldId)) return json({ error: "reference_unavailable" }, 503);
  const preferenceId = referencePreferenceId(request);
  if (!preferenceId) return json({ reference: null });
  try {
    const data = await readPayload(request);
    const now = Math.floor(Date.now() / 1000);
    if (!validGoogleIds(data.clientId, data.sessionId, now)) return json({ error: "invalid_identifiers" }, 400);
    // Check the saved first-party choice, not a client-supplied consent assertion.
    const preferences = await privacyStore.read(preferenceId);
    if (!preferences?.analytics) return json({ reference: null });
    const reference = sealBookingReference({
      clientId: data.clientId as string, sessionId: data.sessionId as string,
      preferenceId, marketing: preferences.marketing && data.marketing === true, issuedAt: now,
    }, secret);
    return json({ reference, fieldId, refreshAt: (now + 20 * 60) * 1000 });
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: "invalid_json" }, 400);
    if (error instanceof Error && ["invalid_json", "body_too_large", "invalid_content_type", "forbidden_origin"].includes(error.message)) {
      const failure = payloadError(error); return json({ error: failure.reason }, failure.status);
    }
    return json({ error: "reference_unavailable" }, 503);
  }
}

export const config: Config = {
  rateLimit: { action: "rate_limit", aggregateBy: ["domain", "ip"], windowSize: 60, windowLimit: 60 },
};
