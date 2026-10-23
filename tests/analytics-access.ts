import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";

async function main() {
  const previous = process.env.ANALYTICS_REPORT_PASSWORD;
  const req = (credential?: string) => new NextRequest("https://example.invalid/analytics", {
    headers: credential ? { Authorization: `Basic ${btoa(credential)}` } : {},
  });
  try {
    delete process.env.ANALYTICS_REPORT_PASSWORD;
    assert.equal((await middleware(req())).status, 503);
    process.env.ANALYTICS_REPORT_PASSWORD = "fixture-password";
    assert.equal((await middleware(req())).status, 401);
    assert.equal((await middleware(req("admin:incorrect"))).status, 401);
    const response = await middleware(req("admin:fixture-password"));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  } finally {
    if (previous === undefined) delete process.env.ANALYTICS_REPORT_PASSWORD;
    else process.env.ANALYTICS_REPORT_PASSWORD = previous;
  }
  console.log("Analytics access fails closed and authenticates without public caching.");
}
main();
