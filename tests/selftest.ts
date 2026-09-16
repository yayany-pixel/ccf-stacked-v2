import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

/* ---------------------------------------------------------------- *
 * Ask CCF assistant
 * ---------------------------------------------------------------- */
import { derivePricing } from "../lib/askccf/catalog";
import { knowledgeBase, searchKnowledge } from "../lib/askccf/knowledge";
import { extractClassTag, OPENING_MESSAGE, SUGGESTED_ACTIONS } from "../lib/askccf/prompt";

// Ticket coverage is only claimed when the studio's own words say so.
const couple = derivePricing(
  "Date Night Pottery Wheel",
  "One ticket per couple — you'll share a wheel and make one piece each.",
  "95.00",
);
assert.equal(couple.unit, "per_couple", "explicit couple wording yields per_couple");
assert.equal(couple.covers, 2, "per_couple tickets cover two people");
assert.ok(couple.evidence, "per_couple pricing quotes the listing as evidence");

const perTicket = derivePricing("Handbuilding Workshop", "Make a mug and a bowl.", "65.00");
assert.equal(perTicket.unit, "per_ticket", "silent listings stay per_ticket");
assert.equal(perTicket.covers, null, "per_ticket coverage is not guessed");
assert.ok(
  perTicket.summary.toLowerCase().includes("per ticket"),
  "per_ticket summary states the unit",
);

// The knowledge base records provenance and flags disagreements.
assert.ok(knowledgeBase.length >= 15, "knowledge base has entries");
for (const entry of knowledgeBase) {
  assert.ok(entry.source.length > 0, `${entry.id} records a source`);
  assert.match(entry.verifiedOn, /^\d{4}-\d{2}-\d{2}$/, `${entry.id} records a verification date`);
}
assert.ok(
  knowledgeBase.some((entry) => entry.conflict),
  "conflicting site information is flagged rather than resolved silently",
);
const pickupInfo = searchKnowledge("when is my pottery ready for pickup", "chicago", 3);
assert.ok(pickupInfo.length > 0, "pickup questions match the knowledge base");
assert.ok(
  pickupInfo.some((entry) => entry.id.startsWith("pickup")),
  "pickup search surfaces pickup entries",
);
const spinASpell = knowledgeBase.find((entry) => entry.id === "spin-a-spell");
assert.ok(
  spinASpell?.content.includes("colorcocktailfactory.as.me/spinaspell"),
  "the verified Spin a Spell link is recorded",
);

// Class cards render only from ids the server validated, so the tag must parse.
const tagged = extractClassTag("Two good options.\n\n[[classes: 95588506, 12345]]");
assert.deepEqual(tagged.ids, ["95588506", "12345"], "class tag ids are extracted in order");
assert.ok(!tagged.text.includes("[[classes"), "class tag is stripped from customer-facing text");
assert.deepEqual(
  extractClassTag("No cards here.").ids,
  [],
  "messages without a tag produce no cards",
);
assert.deepEqual(
  extractClassTag("[[classes: drop tables; 42]]").ids,
  ["42"],
  "only numeric ids survive tag parsing",
);

assert.equal(
  OPENING_MESSAGE,
  "Hi there! What can I help you with today?",
  "opening message matches the approved copy",
);
assert.deepEqual(
  SUGGESTED_ACTIONS.map((action) => action.label),
  [
    "Find my class",
    "Plan a date night",
    "Book a party",
    "Pick up my pottery",
    "Something else",
  ],
  "suggested actions match the approved list",
);

// The widget renders the greeting itself and the chat route filters that exact
// string out of the history, so the two copies must not drift apart.
const widgetSource = readFileSync(new URL("../components/askccf/AskCCFWidget.tsx", import.meta.url), "utf8");
assert.ok(
  widgetSource.includes(`const OPENING_MESSAGE = ${JSON.stringify(OPENING_MESSAGE)};`),
  "widget greeting matches OPENING_MESSAGE",
);
for (const action of SUGGESTED_ACTIONS) {
  assert.ok(
    widgetSource.includes(`{ label: ${JSON.stringify(action.label)}, message: ${JSON.stringify(action.message)} }`),
    `widget offers the ${action.label} quick action`,
  );
}

import { tidyReply } from "../lib/askccf/prompt";
assert.equal(
  tidyReply("Which city do you mean?\nWhich city do you mean?"),
  "Which city do you mean?",
  "a verbatim repeated line is collapsed",
);
assert.equal(
  tidyReply("First line.\nSecond line.\nFirst line."),
  "First line.\nSecond line.\nFirst line.",
  "non-adjacent repeats are left alone",
);

/* Durable-store behaviour that must hold even without a database linked. */
import { consumeRateLimit, inquiryDedupeKey } from "../lib/askccf/store";

async function askCcfStoreChecks() {
  const bucket = `selftest:${Math.random().toString(36).slice(2)}`;
  const first = await consumeRateLimit(bucket, 2, 60_000);
  const second = await consumeRateLimit(bucket, 2, 60_000);
  const third = await consumeRateLimit(bucket, 2, 60_000);
  assert.ok(first.allowed && second.allowed, "requests inside the window are allowed");
  assert.equal(third.allowed, false, "the in-memory fallback still enforces the limit");

  const base = {
    sessionId: "selftestsession001",
    name: "Sam Rivera",
    email: "Sam.Rivera@example.com",
    city: "Chicago",
    preferredDate: "2026-10-17",
    groupSize: "14",
    activity: "Mosaics",
  };
  assert.equal(
    inquiryDedupeKey(base),
    inquiryDedupeKey({ ...base, email: "sam.rivera@example.com", activity: "mosaics" }),
    "dedupe keys ignore case so a resend is caught",
  );
  assert.notEqual(
    inquiryDedupeKey(base),
    inquiryDedupeKey({ ...base, preferredDate: "2026-10-18" }),
    "a different date is a different inquiry",
  );
}

askCcfStoreChecks().catch((error) => {
  console.error(error);
  process.exit(1);
});
