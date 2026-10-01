import assert from "node:assert/strict";
import { createGrouponClient, type GrouponSigningRequest } from "../lib/groupon-api";

const voucher = {
  id: "unit-example", grouponCode: "GRPN-example", redemptionCode: "redemption-example",
  status: "available", attributes: { dealId: "deal-example", dealTitle: "Example workshop" },
  value: { amount: 2000, currencyCode: "USD" }, price: { amount: 1500, currencyCode: "USD" },
};
const approval = {
  unitID: voucher.id, redemptionCode: voucher.redemptionCode, dealID: voucher.attributes.dealId,
  attendanceConfirmed: true as const, redemptionConfirmed: true as const,
};
type Reply = { payload: unknown; status?: number } | Error;
const replies: Reply[] = [];
const requests: Array<{ url: string; init?: RequestInit }> = [];
const signatures: GrouponSigningRequest[] = [];
const config = {
  partner: "example-partner", clientID: "dummy-client", allowedDealIDs: ["deal-example"],
  signRequest: async (request: GrouponSigningRequest) => {
    signatures.push(request);
    return { Authorization: "TEST-ONLY-NOT-A-REAL-SIGNATURE" };
  },
};
const fetcher = (async (input: string | URL | Request, init?: RequestInit) => {
  requests.push({ url: String(input), init });
  const reply = replies.shift();
  assert.ok(reply, "Unexpected external request");
  if (reply instanceof Error) throw reply;
  return Response.json(reply.payload, { status: reply.status ?? 200 });
}) as typeof fetch;
const client = createGrouponClient(config, fetcher);
const read = (row: unknown = voucher): Reply => ({ payload: { data: [row] } });
const patched: Reply = { payload: { data: [{ redemptionCode: voucher.redemptionCode, status: "redeemed" }] } };
function reset(...next: Reply[]) { replies.splice(0, replies.length, ...next); requests.length = 0; signatures.length = 0; }

async function main() {
  // Inputs, target host, and signing must be validated before any network access.
  for (const bad of [
    { ...config, partner: "../escape" }, { ...config, clientID: "bad\nheader" },
    { ...config, allowedDealIDs: [] }, { ...config, signRequest: undefined },
  ]) assert.throws(() => createGrouponClient(bad as typeof config, fetcher));
  for (const codes of [[], Array.from({ length: 11 }, (_, i) => `x${i}`), ["x", "x"],
    ["x,y"], ["x\ny"], [" x"], ["x".repeat(99)]]) {
    await assert.rejects(() => client.lookup(codes));
  }
  assert.equal(requests.length, 0);
  for (const headers of [{}, { Authorization: "bad\nvalue" },
    { Authorization: "dummy", "X-Client-ID": "override" },
    { Authorization: "dummy", Cookie: "browser-session" }]) {
    const invalidSigner = createGrouponClient({ ...config, signRequest: async () => headers as Record<string, string> }, fetcher);
    await assert.rejects(() => invalidSigner.lookup([voucher.grouponCode]));
    assert.equal(requests.length, 0);
  }
  const throwingSigner = createGrouponClient({ ...config, signRequest: async () => { throw new Error("secret-signing-key"); } }, fetcher);
  await assert.rejects(() => throwingSigner.lookup([voucher.grouponCode]), e => !String(e).includes("secret-signing-key"));

  reset(read({ ...voucher, customerEmail: "private@example.test" }));
  const result = await client.lookup([voucher.grouponCode]);
  assert.equal(result[0].value?.amount, 2000, "Money must remain in minor units");
  assert.ok(!JSON.stringify(result).includes("private@example.test"));
  const url = new URL(requests[0].url);
  assert.equal(url.origin, "https://offer-api.groupon.com");
  assert.equal(url.pathname, "/partners/example-partner/v1/units");
  assert.equal(url.searchParams.get("redemptionCodes"), voucher.grouponCode);
  assert.equal(url.searchParams.get("show"), "deal_info,option_info");
  assert.equal(requests[0].init?.redirect, "error");
  assert.equal(requests[0].init?.cache, "no-store");
  assert.equal(requests[0].init?.credentials, "omit");
  const headers = new Headers(requests[0].init?.headers);
  assert.equal(headers.get("Authorization"), "TEST-ONLY-NOT-A-REAL-SIGNATURE");
  assert.equal(headers.get("X-Client-ID"), config.clientID);
  assert.equal(headers.get("Content-Type"), "application/json");
  assert.ok(headers.get("X-Request-ID"));
  assert.equal(signatures[0].url, requests[0].url);
  assert.ok(Object.isFrozen(signatures[0]) && Object.isFrozen(signatures[0].headers));

  for (const row of [
    { ...voucher, status: "unknown" }, { ...voucher, id: null },
    { ...voucher, attributes: { dealId: "other-merchant" } }, { ...voucher, attributes: undefined },
    { ...voucher, grouponCode: "GRPN-example-extra", redemptionCode: "unrelated" },
    { ...voucher, price: { amount: 1.5, currencyCode: "USD" } },
  ]) {
    reset(read(row));
    await assert.rejects(() => client.lookup([voucher.grouponCode]));
    assert.equal(requests.length, 1);
  }
  for (const reply of [
    { status: 401, payload: { private: "secret-upstream-body" } },
    { payload: { data: [voucher], errors: [{ code: "UNKNOWN_ERROR" }] } },
    new Error(`network failure at ?redemptionCodes=${voucher.redemptionCode}`),
  ]) {
    reset(reply);
    await assert.rejects(() => client.lookup([voucher.grouponCode]), e =>
      !String(e).includes(voucher.redemptionCode) && !String(e).includes("secret-upstream-body"));
    assert.equal(requests.length, 1, "No automatic retry");
  }
  reset({ payload: { data: [] } });
  assert.deepEqual(await client.lookup([voucher.grouponCode]), []);

  // Approval is not inferred from an Acuity booking or from an available status.
  for (const bad of [
    { ...approval, attendanceConfirmed: false }, { ...approval, redemptionConfirmed: false },
    { ...approval, dealID: "other-merchant" },
  ]) {
    reset();
    await assert.rejects(() => client.redeem(bad as typeof approval));
    assert.equal(requests.length, 0);
  }
  for (const row of [
    ...["redeemed", "cancelled", "refunded", "expired"].map(status => ({ ...voucher, status })),
    { ...voucher, id: "different-unit" },
  ]) {
    reset(read(row));
    await assert.rejects(() => client.redeem(approval));
    assert.equal(requests.length, 1, "Ineligible voucher must never be patched");
  }
  reset({ payload: { data: [voucher, voucher] } });
  await assert.rejects(() => client.redeem(approval));
  assert.equal(requests.length, 1, "Ambiguous voucher must not be patched");

  for (const status of [200, 207]) {
    reset(read(), { ...patched, status } as Reply, read({ ...voucher, status: "redeemed" }));
    const output = await client.redeem(approval);
    assert.equal(output.outcome, "verified_redeemed");
    assert.equal(output.retrySafe, false);
    assert.deepEqual(requests.map(r => r.init?.method), ["GET", "PATCH", "GET"]);
    const patch = requests[1];
    const body = JSON.parse(String(patch.init?.body));
    assert.deepEqual(Object.keys(body), ["data"]);
    assert.equal(body.data.length, 1);
    assert.equal(body.data[0].redemptionCode, voucher.redemptionCode);
    assert.equal(body.data[0].status, "redeemed");
    assert.equal(new Date(body.data[0].updatedAt).toISOString(), body.data[0].updatedAt);
    assert.equal(signatures[1].body, patch.init?.body, "Sign the exact serialized request body");
    assert.equal(output.requestID, new Headers(patch.init?.headers).get("X-Request-ID"));
    assert.equal(new Set(requests.map(r => new Headers(r.init?.headers).get("X-Request-ID"))).size, 3);
    assert.ok(!JSON.stringify(output).includes(voucher.redemptionCode));
  }
  // A 2xx status, provider error, timeout, or changed post-read never means success.
  for (const reply of [
    { payload: { data: [{ redemptionCode: voucher.redemptionCode, status: "cancelled" }] } },
    { status: 207, payload: { data: [{ redemptionCode: voucher.redemptionCode, status: "redeemed" }], errors: [{ code: "UNKNOWN_ERROR" }] } },
    { status: 400, payload: { errors: [{ code: "INVALID_STATE_TRANSITION" }] } },
    { payload: { data: [{ redemptionCode: "other-code", status: "redeemed" }] } },
    new Error("timeout after write with secret URL"),
  ]) {
    reset(read(), reply);
    assert.equal((await client.redeem(approval)).outcome, "unconfirmed");
    assert.equal(requests.length, 2, "Never retry an uncertain PATCH");
  }
  for (const after of [read(), read({ ...voucher, status: "redeemed", id: "different-unit" }), new Error("lookup timed out")]) {
    reset(read(), patched, after);
    assert.equal((await client.redeem(approval)).outcome, "unconfirmed");
    assert.equal(requests.length, 3);
  }
  console.log("Groupon API adapter tests passed: signing boundary, scope, contracts, approvals, partial failures, verification, and no retries. Live authentication is not tested.");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
