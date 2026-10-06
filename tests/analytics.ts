import assert from "node:assert/strict";
import {
  sanitize,
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
