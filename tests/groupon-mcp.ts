import assert from "node:assert/strict";
import { POST } from "../app/api/acuity-mcp/[token]/mcp/route";

const savedEnv = {
  CCF_MCP_TOKEN: process.env.CCF_MCP_TOKEN,
  ACUITY_USER_ID: process.env.ACUITY_USER_ID,
  ACUITY_API_KEY: process.env.ACUITY_API_KEY,
};
const savedFetch = globalThis.fetch;
const requests: Array<{ url: URL; init?: RequestInit }> = [];
let upstream: unknown = [];
let upstreamStatus = 200;
const args = { voucherCode: "Voucher-EXAMPLE", minDate: "2026-09-30", maxDate: "2026-09-30" };

async function call(name: string, arguments_: unknown = {}, token = "groupon-test-token") {
  return POST(new Request("http://localhost/mcp", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: arguments_ } }),
  }), { params: { token } });
}

async function result(arguments_: unknown) {
  const response = await call("groupon_find_acuity_bookings", arguments_);
  assert.equal(response.status, 200);
  return (await response.json()).result;
}

async function main() {
  process.env.CCF_MCP_TOKEN = "groupon-test-token";
  process.env.ACUITY_USER_ID = "groupon-test-acuity-user";
  process.env.ACUITY_API_KEY = "groupon-test-acuity-key";
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    requests.push({ url: new URL(String(input)), init });
    return Response.json(upstream, { status: upstreamStatus });
  }) as typeof fetch;
  try {
    // Private tools cannot be called with a missing or wrong MCP credential.
    assert.equal((await call("groupon_connection_status", {}, "wrong")).status, 404);
    assert.equal((await call("groupon_find_acuity_bookings", args, "")).status, 404);
    assert.equal(requests.length, 0);

    const status = (await (await call("groupon_connection_status")).json()).result.structuredContent.data;
    assert.equal(status.grouponApiConnected, false);
    assert.equal(status.grouponApiChecked, false);
    assert.equal(status.posSpecificationReviewed, true);
    assert.equal(status.apiAdapterImplemented, true);
    assert.equal(status.productionAuthenticationImplemented, false);
    assert.equal(status.capabilities.liveVoucherLookup, false);
    assert.equal(status.capabilities.redemption, false);
    assert.equal(requests.length, 0, "Status must not pretend to test the provider");

    upstream = [
      { id: 1, certificate: " Voucher-EXAMPLE ", firstName: "Example", canceled: false, noShow: false,
        email: "private@example.test", phone: "private-phone", notes: "private-note", amountPaid: "999.00" },
      { id: 2, certificate: "Voucher-EXAMPLE-extra" },
      { id: 3, certificate: "voucher-example" },
      { id: 4, notes: "Voucher-EXAMPLE" },
    ];
    let output = await result(args);
    let data = output.structuredContent.data;
    assert.equal(data.matchCount, 1);
    assert.equal(data.matches[0].appointmentID, 1);
    assert.deepEqual(data.matches[0].matchedSources, ["certificate"]);
    assert.equal(data.grouponVoucherStatus, "not_checked");
    assert.equal(data.attendanceConfirmed, false);
    assert.equal(data.redeemedByThisTool, false);
    for (const secret of ["Voucher-EXAMPLE", "private@example.test", "private-phone", "private-note", "999.00"]) {
      assert.ok(!JSON.stringify(output).includes(secret), "Unneeded source data must not be returned");
    }
    let request = requests.at(-1)!;
    assert.equal(request.init?.method, "GET");
    assert.equal(request.url.origin, "https://acuityscheduling.com");
    assert.equal(request.url.pathname, "/api/v1/appointments");
    assert.equal(request.url.searchParams.get("showall"), "true");
    assert.equal(request.url.searchParams.get("excludeForms"), "true");
    assert.equal(request.url.searchParams.get("max"), "100");
    assert.ok(!request.url.toString().includes(args.voucherCode));

    upstream = [
      { id: 8, canceled: true, noShow: false, forms: [{ values: [{ fieldID: 55, value: args.voucherCode }, { fieldID: 90, value: "unrelated secret" }] }] },
      { id: 9, canceled: false, noShow: false, forms: [{ values: [{ fieldID: 66, value: args.voucherCode }] }] },
    ];
    data = (await result({ ...args, formFieldIDs: [55], calendarID: 7, appointmentTypeID: 12 })).structuredContent.data;
    assert.equal(data.matchCount, 1);
    assert.equal(data.matches[0].appointmentID, 8);
    assert.equal(data.matches[0].canceled, true);
    assert.equal(data.requiresReview, true);
    request = requests.at(-1)!;
    assert.equal(request.url.searchParams.get("excludeForms"), "false");
    assert.equal(request.url.searchParams.get("calendarID"), "7");
    assert.equal(request.url.searchParams.get("appointmentTypeID"), "12");
    assert.ok(!JSON.stringify(data).includes("unrelated secret"));

    upstream = [1, 2].map(id => ({ id, certificate: args.voucherCode, canceled: false, noShow: false }));
    data = (await result(args)).structuredContent.data;
    assert.equal(data.matchCount, 2);
    assert.equal(data.requiresReview, true, "Duplicate voucher records must remain ambiguous");

    upstream = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, canceled: false, noShow: false, certificate: i === 0 ? args.voucherCode : "other" }));
    data = (await result(args)).structuredContent.data;
    assert.equal(data.matchCount, 1);
    assert.equal(data.resultLimitReached, true);
    assert.equal(data.requiresReview, true, "One match in a capped search is not a unique-match conclusion");

    for (const invalid of [
      null, [], { ...args, voucherCode: "  " }, { ...args, voucherCode: "a\nb" },
      { ...args, voucherCode: "x".repeat(161) }, { ...args, minDate: "2026-02-30" },
      { ...args, maxDate: "2026-09-29" }, { ...args, maxDate: "2026-10-31" },
      { ...args, calendarID: "7" }, { ...args, formFieldIDs: [55, 55] },
      { ...args, formFieldIDs: [0] }, { ...args, formFieldIDs: "55" },
      { ...args, formFieldIDs: Array.from({ length: 21 }, (_, i) => i + 1) },
      { ...args, url: "https://untrusted.example" }, { voucherCode: "x" },
    ]) {
      const before: number = requests.length;
      assert.equal((await result(invalid)).isError, true);
      assert.equal(requests.length, before, "Reject invalid input before any external call");
    }

    upstream = [];
    data = (await result({ ...args, minDate: "2026-09-01" })).structuredContent.data;
    assert.equal(data.matchCount, 0);
    assert.equal(data.requiresReview, true);
    assert.equal(data.grouponVoucherStatus, "not_checked");
    assert.equal((await result({ ...args, minDate: "2026-09-01", maxDate: "2026-10-01" })).isError, undefined);

    upstream = { unexpected: "private response" };
    assert.equal((await result(args)).isError, true);
    upstream = [{ id: "wrong-type" }];
    assert.equal((await result(args)).isError, true);
    upstreamStatus = 401;
    upstream = { error: "upstream-private-body" };
    output = await result(args);
    assert.equal(output.isError, true);
    assert.ok(!JSON.stringify(output).includes("upstream-private-body"));

    const before = requests.length;
    const redeem = (await (await call("groupon_redeem_voucher", { voucherCode: "anything" })).json()).result;
    assert.equal(redeem.isError, true, "No redemption tool is implemented or advertised");
    assert.equal(requests.length, before);
    console.log("Groupon preparation tests passed: auth, exact matching, privacy, ambiguity, bounds, and failures.");
  } finally {
    globalThis.fetch = savedFetch;
    for (const [key, value] of Object.entries(savedEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
