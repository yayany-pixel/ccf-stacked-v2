import assert from "node:assert/strict";
import { getCityByParam, buildBookingLink, swapCityInPath } from "../lib/links";
import { sections, giftCardUrl, PRIVATE_EVENT_EMAIL } from "../lib/config";

const chicago = getCityByParam("chicago");
const eugene = getCityByParam("eugene");

assert.equal(chicago.param, "chicago");
assert.equal(eugene.param, "eugene");

const gift = sections.find((s) => s.slug === "gift-cards");
assert.ok(gift, "gift-cards section exists");
assert.equal(buildBookingLink(chicago, gift!), giftCardUrl, "gift uses custom gift card URL");

const mosaic = sections.find((s) => s.slug === "mosaic");
assert.ok(mosaic, "mosaic section exists");
assert.ok(buildBookingLink(chicago, mosaic!).includes("term="), "booking links include term=");
assert.ok(swapCityInPath("/chicago/mosaic", "eugene") === "/eugene/mosaic", "swap city preserves path");

const privateSection = sections.find((s) => s.slug === "private-parties");
assert.ok(privateSection, "private-parties section exists");
assert.ok(PRIVATE_EVENT_EMAIL.includes("@"), "PRIVATE_EVENT_EMAIL looks like an email");

const glassBlowing = sections.find((s) => s.slug === "glass-blowing");
assert.ok(glassBlowing, "glass-blowing section exists");
assert.ok(buildBookingLink(chicago, glassBlowing!).startsWith("mailto:"), "glass blowing uses waitlist mailto");
