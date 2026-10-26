import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { processAcuityWebhook, type WebhookDependencies } from "../netlify/functions/ga4-webhook.mjs";
import { ACTIVITY_MANIFEST } from "../lib/homepage/manifest";

async function main() {
  const activity = ACTIVITY_MANIFEST.find(a => a.city !== "unknown")!;
  const env: Record<string, string> = {
    ACUITY_API_KEY: "fixture", ACUITY_USER_ID: "fixture", ACUITY_CURRENCY: "USD",
    GA4_PURCHASES_ENABLED: "true", GA4_MEASUREMENT_ID: "G-FIXTURE", GA4_API_SECRET: "fixture",
    META_CAPI_ENABLED: "true", META_CAPI_PURCHASES_ENABLED: "true", META_CAPI_ACCESS_TOKEN: "fixture",
    META_GRAPH_API_VERSION: "v26.0", META_CAPI_VALIDATED_PIXEL_ID: "315271500363564",
    ACUITY_META_CONSENT_FIELD_ID: "1", ACUITY_META_FBP_FIELD_ID: "2", ACUITY_META_USER_AGENT_FIELD_ID: "3",
  };
  let appointment: any = { id: 123, paid: "yes", canceled: false, amountPaid: "50",
    appointmentTypeID: activity.appointmentTypeId, calendarID: activity.calendarIds[0],
    forms: [{ values: [{ fieldID: 1, value: "granted" }, { fieldID: 2, value: "fb.1.1700000000000.123456789" }, { fieldID: 3, value: "Fixture browser" }] }] };
  let ga = 0, meta = 0, claimed = false, failMeta = false, failGa = false;
  const deps: WebhookDependencies = {
    env: key => env[key],
    db: () => ({ execute: async () => {
      if (claimed) return { rows: [] };
      claimed = true; return { rows: [{ transaction_id: "acuity:123" }] };
    } }) as any,
    sendMeta: async event => {
      meta++; assert.equal(event.eventId, "purchase:acuity:123");
      assert.equal(event.data.currency, "USD"); assert.equal(event.data.value, 50);
      assert.deepEqual(event.data.content_ids, [String(activity.appointmentTypeId)]);
      if (failMeta) throw new Error("fixture failure"); return "sent";
    },
    fetch: async (input, init) => {
      const url = String(input);
      if (url.includes("/payments")) return Response.json([{ transactionID: "fixture", amount: "50", created: new Date().toISOString() }]);
      if (url.includes("/appointments/")) return Response.json(appointment);
      ga++;
      const body = JSON.parse(String(init?.body));
      assert.equal(body.events[0].params.currency, "USD");
      assert.equal(body.events[0].params.transaction_id, "acuity:123");
      assert.equal(body.events[0].params.class_id, String(activity.appointmentTypeId));
      if (failGa) throw new Error("fixture failure");
      return new Response(null, { status: 204 });
    },
  };
  const request = (body = "action=changed&id=123", signed = true) => new Request("https://fixture.invalid", {
    method: "POST", body, headers: { "x-acuity-signature": signed ? createHmac("sha256", "fixture").update(body).digest("base64") : "bad" },
  });
  assert.equal((await processAcuityWebhook(request(undefined, false), deps)).status, 401);
  assert.equal((await processAcuityWebhook(request("action=unknown&id=123"), deps)).status, 400);
  for (const change of [{ paid: "no" }, { amountPaid: "0" }, { canceled: true }]) {
    const saved = appointment; appointment = { ...appointment, ...change };
    assert.equal((await processAcuityWebhook(request(), deps)).status, 202); appointment = saved;
  }
  assert.equal(ga + meta, 0);
  failMeta = true;
  assert.equal((await processAcuityWebhook(request(), deps)).status, 200);
  assert.equal(ga, 1); assert.equal(meta, 1);
  failMeta = false;
  await processAcuityWebhook(request(), deps);
  assert.equal(ga, 1); assert.equal(meta, 2); // Meta independently reaches its own ledger.
  claimed = false; failGa = true;
  assert.equal((await processAcuityWebhook(request(), deps)).status, 502);
  assert.equal(meta, 3);
  env.GA4_PURCHASES_ENABLED = "false";
  assert.equal((await processAcuityWebhook(request(), deps)).status, 200);
  assert.equal(meta, 4);
  console.log("Acuity signed purchase tests: paid-state checks, canonical IDs, independent destinations, and GA deduplication passed.");
}
main();
