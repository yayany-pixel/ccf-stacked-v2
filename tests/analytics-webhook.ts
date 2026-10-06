import assert from "node:assert/strict";
import handler from "../netlify/functions/ga4-webhook.mjs";
async function run() {
  const values: Record<string, string> = {};
  (globalThis as any).Netlify = { env: { get: (key: string) => values[key] } };
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
  });
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
  console.log(
    "Purchase webhook rejects disabled, unsigned, and fabricated purchases without network calls.",
  );
}
run();
