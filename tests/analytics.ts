import assert from "node:assert/strict";
import {
  sanitize,
  safeUrl,
  currentCity,
  trackBeginCheckout,
  trackCardView,
  trackCardSelect,
  trackCitySelection,
  trackShowMore,
  trackLead,
  trackSignup,
  trackPageView,
} from "../lib/analytics";
process.env.NEXT_PUBLIC_GA_ID_1 = "G-TESTONLY";
const calls: any[] = [];
Object.assign(globalThis, {
  location: new URL(
    "https://colorcocktailfactory.com/?email=private@example.com&utm_source=test",
  ),
  document: { referrer: "https://example.com/?email=private@example.com" },
  localStorage: { getItem: () => null },
  window: {
    ccfPrivacyPreferences: { analytics: true, marketing: true },
    location: new URL("https://colorcocktailfactory.com/"),
    gtag: (...args: any[]) => calls.push(args),
  },
});
const card = {
  city: "chicago",
  class_name: "Pottery",
  class_id: "123",
  card_position: 2,
  item_list_name: "Homepage - Chicago Workshops",
};
trackBeginCheckout({
  ...card,
  link_url:
    "https://app.acuityscheduling.com/schedule.php?appointmentType=123&email=private@example.com",
});
assert.equal(calls.length, 1);
assert.equal(calls[0][1], "begin_checkout");
assert.equal(calls[0][2].appointment_type_id, "123");
assert.equal(calls[0][2].booking_provider, "acuity");
assert.equal(calls[0][2].class_name, "Pottery");
assert.equal(calls[0][2].city, "chicago");
trackCardView(card);
trackCardSelect({ ...card, click_target: "choose_date" });
trackShowMore({
  city: "chicago",
  previous_visible_count: 10,
  new_visible_count: 20,
  batch_number: 2,
  total_available_classes: 25,
});
trackCitySelection({
  city: "eugene",
  previous_city: "chicago",
  placement: "homepage",
  selection_source: "homepage_toggle",
});
trackLead({ form_name: "private-party", lead_type: "private_party" });
trackSignup("footer");
trackPageView(
  "https://colorcocktailfactory.com/?email=private@example.com&utm_source=test",
);
trackPageView(
  "https://colorcocktailfactory.com/?email=private@example.com&utm_source=test",
);
assert.equal(calls.filter((x) => x[1] === "page_view").length, 1);
assert(!JSON.stringify(calls).includes("private@example.com"));
const adLanding = "https://colorcocktailfactory.com/activities/date-night-wheel" +
  "?city=eugene&gclid=click-id&gbraid=ios-app-id&wbraid=ios-web-id" +
  "&gad_source=1&gad_campaignid=24414775834&email=private@example.com" +
  "&ccf_booking_ref=private-reference&field:19375784=private-reference";
trackPageView(adLanding);
const adPageView = calls.filter((x) => x[1] === "page_view").at(-1);
const reportedLanding = new URL(adPageView[2].page_location);
assert.equal(reportedLanding.searchParams.get("gbraid"), "ios-app-id");
assert.equal(reportedLanding.searchParams.get("wbraid"), "ios-web-id");
assert.equal(reportedLanding.searchParams.get("gad_source"), "1");
assert.equal(reportedLanding.searchParams.get("gad_campaignid"), "24414775834");
assert.equal(reportedLanding.searchParams.get("gclid"), "click-id");
assert.equal(reportedLanding.searchParams.get("city"), "eugene");
assert(!adPageView[2].page_location.includes("private"));
assert.equal(new URL(safeUrl(adLanding)).searchParams.has("gclid"), false);
assert.equal(new URL(safeUrl(adLanding)).searchParams.has("gbraid"), false);
assert.equal(new URL(safeUrl(adLanding)).searchParams.has("gad_campaignid"), false);
(globalThis as any).window.location = new URL(adLanding);
(globalThis as any).localStorage = { getItem: () => "chicago" };
assert.equal(currentCity(), "eugene", "the ad's selected city overrides an older saved city");
(globalThis as any).window.location = new URL("https://colorcocktailfactory.com/chicago?city=eugene");
assert.equal(currentCity(), "chicago", "a city-specific page retains its own city");
assert.deepEqual(
  sanitize({
    name: "Person",
    email: "private@example.com",
    phone: "1234567890",
    message: "hello",
    address: "Street",
    items: [{ item_id: "1", email: "private@example.com" }],
  }),
  { items: [{ item_id: "1" }] },
);
delete (globalThis as any).window.gtag;
assert.doesNotThrow(() =>
  trackBeginCheckout({ ...card, link_url: "/book/chicago/pottery" }),
);
console.log(
  "Analytics unit checks passed: payloads, booking ID, PII removal, page-view deduplication, absent tag safety.",
);
