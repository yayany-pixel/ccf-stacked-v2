import assert from "node:assert/strict";
import {
  resolveSaleDeadline,
  calculateCycleDeadline,
  saleSecondsRemaining,
  saleStorageKey,
  saleTimeParts,
  saleTimeUnits,
  type WorkshopSaleConfig,
} from "../lib/homepage/sale";

const now = Date.parse("2026-10-11T18:00:00Z");
const config: WorkshopSaleConfig = { mode: "campaign", deadline: "", offerId: "test-offer", visitorSpecific: false, minHours: 3, maxHours: 12 };

// Campaign mode with empty deadline falls back to cycle deadline
const cycleExpected = calculateCycleDeadline(now);
assert.equal(typeof cycleExpected, "number");
assert.ok(cycleExpected > now);
assert.equal(resolveSaleDeadline(config, now), cycleExpected);

// Campaign mode with invalid deadlines
for (const deadline of ["invalid", "2026-10-11T21:00:00", "2026-10-11", "2026-02-30T12:00:00Z", "2026-02-29T12:00:00Z", "2026-10-11T24:00:00Z", "2026-13-11T12:00:00Z"]) {
  assert.equal(resolveSaleDeadline({ ...config, deadline }, now), null);
}
assert.equal(resolveSaleDeadline({ ...config, deadline: "2026-10-11T16:00:00-05:00" }, now), now + 3 * 3_600_000);
assert.equal(resolveSaleDeadline({ ...config, deadline: "2028-02-29T12:00:00Z" }, now), Date.parse("2028-02-29T12:00:00Z"));
assert.equal(resolveSaleDeadline({ ...config, deadline: "2026-10-11T17:00:00Z" }, now), now - 3_600_000);
assert.equal(resolveSaleDeadline({ ...config, mode: "unknown" }, now), null);
assert.equal(resolveSaleDeadline({ ...config, mode: "cycle" }, now), cycleExpected);

assert.equal(saleSecondsRemaining(now - 1000, now), 0);
assert.equal(saleSecondsRemaining(now, now), 0);
assert.equal(saleSecondsRemaining(now + 1, now), 1);
assert.equal(saleSecondsRemaining(now + 10_000, now + 9000), 1);
assert.deepEqual(saleTimeParts(7 * 3600 + 42 * 60 + 18), ["07", "42", "18"]);
assert.deepEqual(saleTimeParts(0), ["00", "00", "00"]);
assert.deepEqual(saleTimeParts(99 * 3600, 3), ["099", "00", "00"]);

// saleTimeUnits tests (supporting days when >= 24h)
assert.deepEqual(saleTimeUnits(7 * 3600 + 42 * 60 + 18), [
  { label: "HOURS", value: "07" },
  { label: "MINUTES", value: "42" },
  { label: "SECONDS", value: "18" },
]);
assert.deepEqual(saleTimeUnits(2 * 86400 + 9 * 3600 + 26 * 60 + 31), [
  { label: "DAYS", value: "02" },
  { label: "HOURS", value: "09" },
  { label: "MINUTES", value: "26" },
  { label: "SECONDS", value: "31" },
]);

const values = new Map<string, string>();
const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
const randomConfig = { ...config, mode: "random-start", visitorSpecific: true };
const deadline = now + 7.5 * 3_600_000;
assert.equal(resolveSaleDeadline({ ...randomConfig, visitorSpecific: false }, now, () => storage), cycleExpected);
assert.equal(resolveSaleDeadline({ ...randomConfig, visitorSpecific: false, deadline: "2026-10-11T21:00:00Z" }, now, () => storage), now + 3 * 3_600_000);
assert.equal(resolveSaleDeadline({ ...randomConfig, offerId: " " }, now, () => storage), null);
for (const [minHours, maxHours] of [[0, 12], [-1, 12], [12, 3], [NaN, 12], [3, Infinity]]) {
  assert.equal(resolveSaleDeadline({ ...randomConfig, minHours, maxHours }, now, () => storage), null);
}
assert.equal(values.size, 0);
assert.equal(resolveSaleDeadline(randomConfig, now, () => storage, () => 0.5), deadline);
assert.equal(resolveSaleDeadline(randomConfig, now + 1000, () => storage, () => { throw new Error("Must not randomize again"); }), deadline);
assert.equal(resolveSaleDeadline({ ...randomConfig, minHours: 4, maxHours: 5 }, now + 1000, () => storage), deadline);
assert.equal(resolveSaleDeadline(randomConfig, deadline + 1000, () => storage), deadline);
assert.equal(saleSecondsRemaining(deadline, deadline + 1000), 0);
assert.equal(resolveSaleDeadline({ ...randomConfig, offerId: "different-offer" }, now, () => storage, () => 0), now + 3 * 3_600_000);
assert.equal(resolveSaleDeadline({ ...randomConfig, offerId: "maximum-test" }, now, () => storage, () => 0.999999), Math.round(now + (3 + 0.999999 * 9) * 3_600_000));
assert.equal(resolveSaleDeadline(randomConfig, now, () => { throw new Error("Storage blocked"); }), null);
assert.equal(resolveSaleDeadline(randomConfig, now, () => ({ getItem: () => null, setItem: () => { throw new Error("Quota exceeded"); } })), null);
assert.equal(resolveSaleDeadline(randomConfig, now, () => ({ getItem: () => null, setItem: () => {} })), null);
for (const saved of ["", "corrupt", "Infinity", "-1", "0", "1.5"]) {
  values.set(saleStorageKey(randomConfig.offerId), saved);
  assert.equal(resolveSaleDeadline(randomConfig, now, () => storage), null);
  assert.equal(values.get(saleStorageKey(randomConfig.offerId)), saved);
}
console.log("Workshop sale configuration, absolute timing, offer-scoped persistence, expiry, cycle calculations, and failure checks passed.");
