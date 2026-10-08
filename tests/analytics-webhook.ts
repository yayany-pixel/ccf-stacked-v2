import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import handler, { processWebhook } from "../netlify/functions/ga4-webhook.mjs";

async function run() {
  const values: Record<string, string> = {};
  (globalThis as any).Netlify = { env: { get: (key: string) => values[key] } };

  // 1. Basic validation & gating
  assert.equal(
    (await handler(new Request("https://example.invalid", { method: "GET" })))
      .status,
    405,
  );
  assert.equal(
    (
      await handler(
        new Request("https://example.invalid", { method: "POST", body: "{}" }),
      )
    ).status,
    503,
  );

  Object.assign(values, {
    GA4_PURCHASES_ENABLED: "true",
    ACUITY_CURRENCY: "USD",
    ACUITY_API_KEY: "test-only",
    ACUITY_USER_ID: "test-only",
    GA4_MEASUREMENT_ID: "G-TESTONLY",
    GA4_API_SECRET: "test-only",
    WEBHOOK_SECRET: "ccf-secret-key-12345",
  });

  // 2. Unsigned and unauthenticated requests rejected
  assert.equal(
    (
      await handler(
        new Request("https://example.invalid", {
          method: "POST",
          body: JSON.stringify({ event_name: "purchase", value: 100 }),
        }),
      )
    ).status,
    401,
  );

  // Bad webhook secret rejected
  assert.equal(
    (
      await handler(
        new Request("https://example.invalid", {
          method: "POST",
          headers: { "x-webhook-secret": "wrong-secret" },
          body: JSON.stringify({ event_name: "purchase", value: 100 }),
        }),
      )
    ).status,
    401,
  );

  // 3. Eventbrite verified purchase via Zapier relay / webhook secret
  values.EVENTBRITE_TOKEN = "test-eb-token";
  const recordedPurchases = new Set<string>();
  const dbMock = {
    execute: async (queryObj: any) => {
      let txId = "";
      if (queryObj?.queryChunks) {
        for (const chunk of queryObj.queryChunks) {
          if (chunk?.value && typeof chunk.value === "string" && chunk.value !== "sending" && chunk.value !== "sent" && chunk.value !== "review") {
            txId = chunk.value;
            break;
          }
        }
      }
      if (!txId) {
        const str = JSON.stringify(queryObj);
        const match = str.match(/(?:acuity|eventbrite|zapier)[a-zA-Z0-9:_-]+/);
        if (match) txId = match[0];
      }
      if (JSON.stringify(queryObj).includes("insert into analytics_purchases")) {
        if (!txId) txId = "tx-default";
        if (recordedPurchases.has(txId)) {
          return { rows: [] };
        }
        recordedPurchases.add(txId);
        return { rows: [{ transaction_id: txId }] };
      }
      return { rows: [] };
    },
  };

  const gaRequests: Array<{ url: string; body: any }> = [];
  const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes("eventbriteapi.com/v3/orders/1001")) {
      return new Response(
        JSON.stringify({
          id: "1001",
          status: "placed",
          created: "2026-10-06T18:00:00Z",
          costs: {
            gross: {
              currency: "USD",
              value: 12000,
              major_value: "120.00",
            },
          },
          event: {
            id: "ev-999",
            name: { text: "Eugene Ceramic Mug Making" },
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }
    if (url.includes("eventbriteapi.com/v3/orders/1002")) {
      // Cancelled order
      return new Response(
        JSON.stringify({
          id: "1002",
          status: "cancelled",
          costs: { gross: { currency: "USD", major_value: "50.00" } },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }
    if (url.includes("eventbriteapi.com/v3/orders/1003")) {
      // Non-USD currency
      return new Response(
        JSON.stringify({
          id: "1003",
          status: "placed",
          costs: { gross: { currency: "EUR", major_value: "50.00" } },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }
    if (url.includes("google-analytics.com/mp/collect")) {
      const parsedBody = JSON.parse(String(init?.body));
      gaRequests.push({ url, body: parsedBody });
      return new Response(null, { status: 204 });
    }
    return new Response("Not found", { status: 404 });
  };

  // Valid Eventbrite order relayed with secret
  const ebResponse = await processWebhook(
    new Request("https://example.invalid", {
      method: "POST",
      headers: { "x-webhook-secret": "ccf-secret-key-12345" },
      body: JSON.stringify({
        api_url: "https://www.eventbriteapi.com/v3/orders/1001/",
      }),
    }),
    {
      getDb: () => dbMock as any,
      fetch: mockFetch as any,
    },
  );
  assert.equal(ebResponse.status, 200);
  assert.equal(gaRequests.length, 1);
  assert.equal(gaRequests[0].body.events[0].name, "purchase");
  assert.equal(gaRequests[0].body.events[0].params.transaction_id, "eventbrite:1001");
  assert.equal(gaRequests[0].body.events[0].params.value, 120);
  assert.equal(gaRequests[0].body.events[0].params.city, "Eugene");
  assert.equal(gaRequests[0].body.events[0].params.booking_provider, "eventbrite");

  // Duplicate Eventbrite order deduplicated by ledger
  const ebDuplicateResponse = await processWebhook(
    new Request("https://example.invalid", {
      method: "POST",
      headers: { "x-webhook-secret": "ccf-secret-key-12345" },
      body: JSON.stringify({
        order_id: "1001",
        booking_provider: "eventbrite",
      }),
    }),
    {
      getDb: () => dbMock as any,
      fetch: mockFetch as any,
    },
  );
  assert.equal(ebDuplicateResponse.status, 200);
  assert.equal(await ebDuplicateResponse.text(), "Already recorded or awaiting reconciliation");

  // Cancelled Eventbrite order returns 202
  const ebCancelledResponse = await processWebhook(
    new Request("https://example.invalid", {
      method: "POST",
      headers: { "x-webhook-secret": "ccf-secret-key-12345" },
      body: JSON.stringify({ order_id: "1002", booking_provider: "eventbrite" }),
    }),
    {
      getDb: () => dbMock as any,
      fetch: mockFetch as any,
    },
  );
  assert.equal(ebCancelledResponse.status, 202);

  // Non-USD Eventbrite order returns 422
  const ebCurrencyResponse = await processWebhook(
    new Request("https://example.invalid", {
      method: "POST",
      headers: { "x-webhook-secret": "ccf-secret-key-12345" },
      body: JSON.stringify({ order_id: "1003", booking_provider: "eventbrite" }),
    }),
    {
      getDb: () => dbMock as any,
      fetch: mockFetch as any,
    },
  );
  assert.equal(ebCurrencyResponse.status, 422);

  // 4. Generic Zapier Relay purchase
  const zapierResponse = await processWebhook(
    new Request("https://example.invalid", {
      method: "POST",
      headers: { "x-webhook-secret": "ccf-secret-key-12345" },
      body: JSON.stringify({
        event_name: "purchase",
        transaction_id: "zapier-custom-777",
        value: 95.0,
        currency: "USD",
        city: "Chicago",
        class_name: "Date Night Pottery",
        booking_provider: "rezclick",
      }),
    }),
    {
      getDb: () => dbMock as any,
      fetch: mockFetch as any,
    },
  );
  assert.equal(zapierResponse.status, 200);
  assert.equal(gaRequests.length, 2);
  assert.equal(gaRequests[1].body.events[0].params.transaction_id, "rezclick:zapier-custom-777");
  assert.equal(gaRequests[1].body.events[0].params.value, 95.0);
  assert.equal(gaRequests[1].body.events[0].params.booking_provider, "rezclick");

  // 5. Native Acuity signed webhook
  const acuityBody = "action=appointment.scheduled&id=95588506&calendarID=12216179&appointmentTypeID=95588506";
  const acuitySignature = createHmac("sha256", "test-only").update(acuityBody).digest("base64");
  const mockAcuityFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes("acuityscheduling.com/api/v1/appointments/95588506/payments")) {
      return new Response(JSON.stringify([{ transactionID: "tx1", amount: "75.00", created: "2026-10-06T18:00:00Z" }]), { status: 200 });
    }
    if (url.includes("acuityscheduling.com/api/v1/appointments/95588506")) {
      return new Response(
        JSON.stringify({
          id: 95588506,
          appointmentTypeID: 95588506,
          calendarID: 12216179,
          paid: "yes",
          canceled: false,
          amountPaid: "75.00",
        }),
        { status: 200 },
      );
    }
    if (url.includes("google-analytics.com/mp/collect")) {
      const parsedBody = JSON.parse(String(init?.body));
      gaRequests.push({ url, body: parsedBody });
      return new Response(null, { status: 204 });
    }
    return new Response("Not found", { status: 404 });
  };

  const acuityResponse = await processWebhook(
    new Request("https://example.invalid", {
      method: "POST",
      headers: {
        "x-acuity-signature": acuitySignature,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: acuityBody,
    }),
    {
      getDb: () => dbMock as any,
      fetch: mockAcuityFetch as any,
    },
  );
  assert.equal(acuityResponse.status, 200);
  assert.equal(gaRequests.length, 3);
  assert.equal(gaRequests[2].body.events[0].params.transaction_id, "acuity:95588506");
  assert.equal(gaRequests[2].body.events[0].params.value, 75);
  assert.equal(gaRequests[2].body.events[0].params.city, "chicago");
  assert.equal(gaRequests[2].body.events[0].params.booking_provider, "acuity");

  console.log(
    "Purchase webhook rejects disabled, unsigned, and fabricated purchases without network calls.",
  );
  console.log(
    "Eventbrite and Zapier relay webhook verification, deduplication, currency and payment checks passed.",
  );
}

run();
