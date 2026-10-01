// Server-side POS API adapter based on GrouponConnect Redemption API (2025-09-25).
// Intentionally NOT wired into MCP: Groupon's separate Request Signing contract,
// merchant-scoped credentials, certification, and durable approval/audit handling
// are still required. Do not replace the signer with a guessed bearer token.
import { randomUUID } from "node:crypto";

type Json = Record<string, unknown>;
const statuses = ["available", "redeemed", "cancelled", "refunded", "expired"] as const;
type VoucherStatus = typeof statuses[number];
type Money = { amount: number; currencyCode: string };

export type GrouponVoucher = {
  id: string;
  grouponCode: string;
  redemptionCode: string;
  status: VoucherStatus;
  redeemedAt?: string;
  value?: Money;
  price?: Money;
  attributes: { dealId: string; dealTitle?: string; optionId?: string; optionTitle?: string };
};

export type GrouponSigningRequest = Readonly<{
  method: "GET" | "PATCH";
  url: string;
  headers: Readonly<Record<string, string>>;
  body?: string;
}>;

type Config = {
  partner: string;
  clientID: string;
  // Explicit merchant deal scope, verified during provider onboarding.
  allowedDealIDs: readonly string[];
  // Must implement Groupon's verified signing specification. No default exists.
  signRequest: (request: GrouponSigningRequest) => Promise<Record<string, string>>;
};

type RedemptionApproval = {
  unitID: string;
  redemptionCode: string;
  dealID: string;
  attendanceConfirmed: true;
  redemptionConfirmed: true;
};

export type RedemptionResult = {
  outcome: "verified_redeemed" | "unconfirmed";
  requestID: string;
  retrySafe: false;
  voucherStatus?: VoucherStatus;
  note: string;
};

function object(value: unknown): value is Json {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function string(value: unknown, max = 500): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= max &&
    value === value.trim() && !/[\u0000-\u001f\u007f]/.test(value);
}

function code(value: unknown): value is string {
  // POS updates require <99 characters; commas would alter the lookup list.
  return string(value, 98) && !value.includes(",");
}

function money(value: unknown): Money | undefined {
  if (value === undefined || value === null) return undefined;
  if (!object(value) || !Number.isSafeInteger(value.amount) ||
      typeof value.currencyCode !== "string" || !/^[A-Z]{3}$/.test(value.currencyCode)) {
    throw new Error("Groupon returned invalid monetary fields.");
  }
  return { amount: value.amount as number, currencyCode: value.currencyCode };
}

function parseVoucher(value: unknown, allowedDeals: Set<string>, requestedCodes: readonly string[]): GrouponVoucher {
  if (!object(value) || !string(value.id) || !code(value.grouponCode) || !code(value.redemptionCode) ||
      !statuses.includes(value.status as VoucherStatus) || !object(value.attributes) ||
      !string(value.attributes.dealId) || !allowedDeals.has(value.attributes.dealId) ||
      !requestedCodes.some(c => c === value.grouponCode || c === value.redemptionCode)) {
    throw new Error("Groupon returned an unexpected voucher or an unverified deal scope.");
  }
  const attributes: GrouponVoucher["attributes"] = { dealId: value.attributes.dealId };
  for (const key of ["dealTitle", "optionId", "optionTitle"] as const) {
    const item = value.attributes[key];
    if (item !== undefined && item !== null) {
      if (!string(item)) throw new Error("Groupon returned invalid deal details.");
      attributes[key] = item;
    }
  }
  let redeemedAt: string | undefined;
  if (value.redeemedAt !== undefined && value.redeemedAt !== null) {
    if (!string(value.redeemedAt, 100) || !Number.isFinite(Date.parse(value.redeemedAt))) {
      throw new Error("Groupon returned an invalid redemption timestamp.");
    }
    redeemedAt = value.redeemedAt;
  }
  // Copy only documented fields; never return an arbitrary upstream payload.
  return {
    id: value.id, grouponCode: value.grouponCode, redemptionCode: value.redemptionCode,
    status: value.status as VoucherStatus, attributes, redeemedAt,
    value: money(value.value), price: money(value.price),
  };
}

export function createGrouponClient(config: Config, fetcher: typeof fetch = fetch) {
  if (!config || !string(config.partner, 98) || !/^[A-Za-z0-9_-]+$/.test(config.partner) ||
      !string(config.clientID, 500) || !/^[\x20-\x7e]+$/.test(config.clientID) || typeof config.signRequest !== "function" ||
      !Array.isArray(config.allowedDealIDs) || !config.allowedDealIDs.length ||
      config.allowedDealIDs.some(id => !string(id))) {
    throw new Error("Groupon requires a partner, client ID, verified signer, and approved deal IDs.");
  }
  const allowedDeals = new Set(config.allowedDealIDs);
  const endpoint = `https://offer-api.groupon.com/partners/${config.partner}/v1/units`;
  const clientID = config.clientID;
  const signRequest = config.signRequest;

  async function send(method: "GET" | "PATCH", url: string, body?: string, requestID = randomUUID()) {
    const headers = Object.freeze({
      "Content-Type": "application/json", "X-Client-ID": clientID, "X-Request-ID": requestID,
    });
    let extra: Record<string, string>;
    try {
      extra = await signRequest(Object.freeze({ method, url, headers, body }));
    } catch {
      throw new Error("Groupon request signing failed; no API request was sent.");
    }
    const signed = new Headers(headers);
    if (!object(extra)) throw new Error("Groupon request signer returned invalid headers.");
    const names = new Set<string>();
    for (const [key, value] of Object.entries(extra)) {
      const lower = key.toLowerCase();
      if (!/^[A-Za-z0-9-]+$/.test(key) || !string(value, 8192) || !/^[\x20-\x7e]+$/.test(value) || names.has(lower) ||
          ["content-type", "x-client-id", "x-request-id", "host", "cookie", "content-length"].includes(lower)) {
        throw new Error("Groupon request signer returned invalid headers.");
      }
      names.add(lower);
      signed.set(key, value);
    }
    if (!signed.has("Authorization")) throw new Error("Groupon request signature is missing.");
    try {
      // No retries, redirects, shared cache, browser cookies, or caller-selected host.
      const response = await fetcher(url, {
        method, headers: signed, body, cache: "no-store", redirect: "error", credentials: "omit",
        signal: AbortSignal.timeout(15000),
      });
      const text = await response.text();
      if (text.length > 65536) throw new Error("Response too large");
      const payload: unknown = JSON.parse(text);
      return { status: response.status, payload, requestID };
    } catch {
      // Fetch errors often include request URLs (and therefore voucher codes).
      throw new Error("Groupon request failed or returned an unreadable response. Do not automatically retry a redemption.");
    }
  }

  async function lookup(codes: readonly string[]): Promise<GrouponVoucher[]> {
    if (!Array.isArray(codes) || codes.length < 1 || codes.length > 10 ||
        codes.some(c => !code(c)) || new Set(codes).size !== codes.length) {
      throw new Error("Provide 1–10 unique codes, each 1–98 characters without commas or control characters.");
    }
    const requested = [...codes];
    const url = new URL(endpoint);
    url.searchParams.set("redemptionCodes", requested.join(","));
    url.searchParams.set("show", "deal_info,option_info");
    const { status, payload } = await send("GET", url.toString());
    if (status !== 200 || !object(payload) || !Array.isArray(payload.data) || payload.data.length > 10 ||
        (payload.errors !== undefined && (!Array.isArray(payload.errors) || payload.errors.length))) {
      throw new Error("Groupon voucher lookup was not successful; no validity conclusion is available.");
    }
    return payload.data.map(row => parseVoucher(row, allowedDeals, requested));
  }

  async function redeem(approval: RedemptionApproval): Promise<RedemptionResult> {
    if (!approval || approval.attendanceConfirmed !== true || approval.redemptionConfirmed !== true ||
        !string(approval.unitID) || !code(approval.redemptionCode) || !allowedDeals.has(approval.dealID)) {
      throw new Error("Redemption requires explicit attendance and redemption approval for one verified unit and deal.");
    }
    // Snapshot approval before awaiting; a caller cannot mutate its intended target.
    const target = { ...approval };
    const before = await lookup([target.redemptionCode]);
    const matchesTarget = (unit: GrouponVoucher) => unit.id === target.unitID &&
      unit.redemptionCode === target.redemptionCode && unit.attributes.dealId === target.dealID;
    if (before.length !== 1 || !matchesTarget(before[0]) || before[0].status !== "available") {
      throw new Error("Fresh Groupon lookup did not identify exactly one approved, available voucher. No redemption request was sent.");
    }
    const requestID = randomUUID();
    const unconfirmed: RedemptionResult = {
      outcome: "unconfirmed", requestID, retrySafe: false,
      note: "Redemption is unconfirmed. Check Groupon's current status before any further action; do not retry automatically.",
    };
    try {
      const body = JSON.stringify({ data: [{
        redemptionCode: target.redemptionCode, status: "redeemed", updatedAt: new Date().toISOString(),
      }] });
      const { status, payload } = await send("PATCH", endpoint, body, requestID);
      // HTTP 200 and 207 can contain failures. Require the one exact success row.
      if (![200, 207].includes(status) || !object(payload) || !Array.isArray(payload.data) ||
          payload.data.length !== 1 || !object(payload.data[0]) ||
          payload.data[0].redemptionCode !== target.redemptionCode || payload.data[0].status !== "redeemed" ||
          (payload.errors !== undefined && (!Array.isArray(payload.errors) || payload.errors.length))) return unconfirmed;
      const after = await lookup([target.redemptionCode]);
      if (after.length !== 1 || !matchesTarget(after[0])) return unconfirmed;
      if (after[0].status !== "redeemed") return { ...unconfirmed, voucherStatus: after[0].status };
      return {
        outcome: "verified_redeemed", requestID, retrySafe: false, voucherStatus: "redeemed",
        note: "Groupon acknowledged the update and a fresh lookup reports redeemed. This does not independently establish attendance or identify which actor caused the status change.",
      };
    } catch {
      return unconfirmed;
    }
  }

  return { lookup, redeem };
}
