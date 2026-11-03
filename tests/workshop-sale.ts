import assert from "node:assert/strict";
import { resolveSaleDeadline, saleSecondsRemaining, saleTimeParts, saleTimeUnits } from "../lib/homepage/sale";
import { buildHomepageData } from "../lib/homepage/data";
import { normalize } from "../lib/askccf/catalog";
import { PROMOTIONAL_WORKSHOPS, PROMOTION_START_ISO, PROMOTION_END_ISO } from "../lib/promotions";

const now = Date.parse(PROMOTION_START_ISO) + 3600000;
const promotion = PROMOTIONAL_WORKSHOPS[0];
const originalRegularPrice = promotion.regularPrice;
try {
  promotion.regularPrice = promotion.promoPrice + 10;
  const live = normalize({ id: promotion.appointmentTypeId, name: promotion.workshopName,
    price: String(promotion.promoPrice), active: true, calendarIDs: [12216179] });
  const data = buildHomepageData([live], [], new Date(now));
  assert.equal(resolveSaleDeadline(data.activities, now), Date.parse(PROMOTION_END_ISO));
  assert.equal(resolveSaleDeadline(data.activities, Date.parse(PROMOTION_END_ISO) + 1), null);
  assert.equal(resolveSaleDeadline(data.activities, Date.parse(PROMOTION_START_ISO) - 1), null);
  assert.equal(resolveSaleDeadline([], now), null);
  assert.equal(resolveSaleDeadline(data.activities.map(activity => ({ ...activity, currentPrice: null })), now), null);
  assert.equal(resolveSaleDeadline(data.activities.map(activity => ({ ...activity, currentPrice: 999 })), now), null);
  assert.equal(resolveSaleDeadline(data.activities.map(activity => ({ ...activity, offeringState: "inactive" })), now), null);
  promotion.regularPrice = promotion.promoPrice;
  assert.equal(resolveSaleDeadline(data.activities, now), null, "Equal was/current is not a promotion");
} finally {
  promotion.regularPrice = originalRegularPrice;
}

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

console.log("Workshop sale checks passed: live-price verification, fixed promotion deadline, expiry, no recurring timer, and time formatting.");
