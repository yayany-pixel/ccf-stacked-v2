import assert from "node:assert/strict";
import { sanitizeMeta } from "../lib/metaEvents";
import { contentIdentity } from "../lib/analyticsIdentity";
import {
  verifiedPaymentTime,
  sendMetaConversion,
  type CapiDependencies,
  type VerifiedMetaConversion,
} from "../lib/metaCapi.server";
async function main() {
  process.env.NEXT_PUBLIC_META_PIXEL_ID = "123456789";
  const pixel = await import("../lib/metaPixel");
  const commands: any[] = [];
  const target = new EventTarget();
  Object.assign(globalThis, {
    window: {
      fbq: (...args: any[]) => commands.push(args),
      dispatchEvent: target.dispatchEvent.bind(target),
    },
    location: new URL("https://colorcocktailfactory.com/"),
    document: { cookie: "" },
  });
  pixel.initializeMetaPixel();
  pixel.initializeMetaPixel();
  assert.equal(commands.filter((x) => x[0] === "init").length, 1);
  pixel.trackMetaPageView();
  assert.equal(commands.filter((command) => command[0] === "track").length, 0);
  pixel.updateMetaConsent("granted");
  pixel.trackMetaPageView();
  pixel.trackMetaPageView();
  assert.equal(commands.filter((x) => x[1] === "PageView").length, 1);
  const card = {
    content_ids: ["79006071"],
    content_name: "Date Night Pottery",
    city: "chicago",
    placement: "homepage_card",
    value: 80,
  };
  pixel.trackMetaViewContent(card);
  pixel.trackMetaViewContent(card);
  assert.equal(commands.filter((x) => x[1] === "ViewContent").length, 1);
  pixel.trackMetaInitiateCheckout(card);
  assert.equal(commands.filter((x) => x[1] === "InitiateCheckout").length, 1);
  assert.equal(
    commands.find((x) => x[1] === "InitiateCheckout")[2].currency,
    "USD",
  );
  assert.deepEqual(
    contentIdentity(
      "date-night",
      "https://colorcocktailfactory.as.me/?appointmentType=79006071",
    ),
    { id: "79006071", type: "product", appointmentTypeId: "79006071" },
  );
  assert.equal(
    contentIdentity(
      "anything",
      "https://colorcocktailfactory.as.me/schedule/a/appointment/123/calendar/456/datetime/x",
    ).id,
    "123",
  );
  assert.equal(
    contentIdentity("beginner-wheel", "/book/chicago/beginner-wheel").id,
    "activity:beginner-wheel",
  );
  assert.deepEqual(
    sanitizeMeta({
      email: "private@example.invalid",
      phone: "3125551234",
      content_name: "private@example.invalid",
      notes: "private",
      value: NaN,
    } as any),
    {},
  );
  const leadId = "askccf:lead:test-123";
  pixel.trackMetaLead({ lead_type: "ask_ccf_private_party" }, leadId);
  assert.equal(commands.find((x) => x[1] === "Lead")[3].eventID, leadId);
  const consentBefore = commands.filter((x) => x[0] === "track").length;
  pixel.updateMetaConsent("denied");
  pixel.trackMetaInitiateCheckout(card);
  assert.equal(commands.filter((x) => x[0] === "track").length, consentBefore);
  delete (globalThis as any).window.fbq;
  assert.doesNotThrow(() => pixel.trackMetaLead({}));
  const keys = new Set<string>();
  const delivered: any[] = [];
  const env: Record<string, string> = {
    META_CAPI_ENABLED: "true",
    META_CAPI_ACCESS_TOKEN: "unit-test-only",
    NEXT_PUBLIC_META_PIXEL_ID: "123456789",
    META_GRAPH_API_VERSION: "v99.0",
  };
  const deps: CapiDependencies = {
    env: (k) => env[k],
    fetch: async (_url, options) => {
      delivered.push(JSON.parse(options!.body as string));
      return new Response(JSON.stringify({ events_received: 1 }), {
        status: 200,
      });
    },
    claim: async (key) => {
      if (keys.has(key)) return false;
      keys.add(key);
      return true;
    },
    finish: async () => {},
  };
  assert.equal(
    verifiedPaymentTime(
      [
        {
          transactionID: "payment-1",
          created: "2026-10-06T12:00:00-0700",
          amount: "80.00",
        },
      ],
      80,
    ),
    Date.parse("2026-10-06T19:00:00Z") / 1000,
  );
  assert.equal(
    verifiedPaymentTime(
      [
        {
          transactionID: "payment-1",
          created: "2026-10-06T12:00:00",
          amount: "80.00",
        },
      ],
      80,
    ),
    null,
  );
  assert.equal(
    verifiedPaymentTime(
      [
        {
          transactionID: "payment-1",
          created: "2026-10-06T12:00:00-0700",
          amount: "20.00",
        },
      ],
      80,
    ),
    null,
  );
  const event: VerifiedMetaConversion = {
    name: "Lead",
    eventId: leadId,
    eventTime: Math.floor(Date.now() / 1000),
    sourceUrl:
      "https://colorcocktailfactory.com/?email=private@example.invalid",
    match: {
      consent: "granted",
      fbp: "fb.1.1700000000000.12345",
      client_user_agent: "MetaUnitTest/1.0",
    },
    data: { content_name: "Private Party Inquiry", city: "chicago" },
  };
  assert.equal(await sendMetaConversion(event, deps), "sent");
  assert.equal(delivered[0].data[0].event_id, leadId);
  assert(!JSON.stringify(delivered).includes("private@example.invalid"));
  assert.equal(
    await sendMetaConversion(
      { ...event, eventId: "no-consent", match: { consent: "denied" } },
      deps,
    ),
    "no_match",
  );
  const purchase = {
    ...event,
    name: "Purchase" as const,
    eventId: "purchase:acuity:123",
    data: { ...card, currency: "USD" as const, num_items: 1 },
  };
  const outcomes = await Promise.all([
    sendMetaConversion(purchase, deps),
    sendMetaConversion(purchase, deps),
  ]);
  assert.deepEqual(outcomes.sort(), ["duplicate", "sent"]);
  assert.equal(delivered.length, 2);
  assert.equal(
    await sendMetaConversion(
      {
        ...purchase,
        eventId: "invalid-purchase",
        data: { ...card, value: -1 },
      },
      deps,
    ),
    "invalid",
  );
  delete env.META_CAPI_ACCESS_TOKEN;
  assert.equal(await sendMetaConversion(purchase, deps), "disabled");
  console.log(
    "Meta checks passed: initialization, views, consent, payload privacy, IDs, browser/server deduplication, concurrent purchase delivery, and absent credentials.",
  );
}
main();
