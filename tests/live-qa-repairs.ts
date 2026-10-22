import assert from "node:assert/strict";
import { getAllActivityDetails, getActivityDetailBySlug } from "../lib/activityRegistry";
import { ACTIVITY_MANIFEST } from "../lib/homepage/manifest";
import { buildHomepageData } from "../lib/homepage/data";
import { eventBookingUrl, withBookingCalendar } from "../lib/booking";
import { getActivityPricing } from "../lib/pricing";
import { normalize } from "../lib/askccf/catalog";
import { getClassGiftingContext } from "../lib/gifts";

async function run() {
  for (const card of ACTIVITY_MANIFEST.filter(card => card.eligibility === "ready" && card.detailUrl?.startsWith("/activities/"))) {
    const detail = getActivityDetailBySlug(card.detailUrl!.split("/").pop()!);
    assert.ok(detail, `${card.key} must lead to a real activity page`);
    const dest = detail.destinations[card.city as keyof typeof detail.destinations];
    assert.ok(dest, `${card.key} must offer the same city on its detail page`);
    if (!card.key.includes("turkish-lamp")) assert.equal(dest.appointmentTypeId, card.appointmentTypeId, `${card.key} must book the same class`);
  }
  for (const activity of getAllActivityDetails()) {
    if (activity.bookingAlternative) assert.deepEqual(activity.destinations, {}, `${activity.slug}: no invented $45 booking`);
    for (const dest of Object.values(activity.destinations)) {
      const url = new URL(dest.bookingUrl);
      assert.equal(url.searchParams.get("appointmentType"), String(dest.appointmentTypeId));
      if (dest.calendarIds.length === 1) assert.equal(url.searchParams.get("calendarID"), String(dest.calendarIds[0]));
    }
  }
  const cards = buildHomepageData(null, null).activities;
  for (const card of cards.filter(card => card.bookingUrl && card.calendarIds.length === 1)) {
    assert.equal(new URL(card.bookingUrl!).searchParams.get("calendarID"), String(card.calendarIds[0]));
  }
  // Same instant, correctly represented in the studio timezone before and after DST.
  for (const [instant, expected] of [
    ["2026-10-23T21:00:00-05:00", "2026-10-23T19:00:00-07:00"],
    ["2026-11-03T21:00:00-06:00", "2026-11-03T19:00:00-08:00"],
  ]) {
    const url = new URL(eventBookingUrl(93539343, instant, 13582962));
    const selected = decodeURIComponent(url.pathname.split("/datetime/")[1]);
    assert.equal(selected, expected);
    assert.equal(new Date(selected).getTime(), new Date(instant).getTime());
    assert.equal(url.searchParams.get("calendarIds"), "13582962");
  }
  assert.equal(withBookingCalendar("https://colorcocktailfactory.as.me/?appointmentType=1", []), "https://colorcocktailfactory.as.me/?appointmentType=1");
  const catalog = [
    normalize({ active: true, id: 94782793, name: "Wheel Throwing for Beginners -Make Your Own Matcha Bowl", price: "45", calendarIDs: [12216179], description: "One ticket covers one person." }),
    normalize({ active: true, id: 89287658, name: "Eugene Wheel Throwing for Beginners: Matcha Bowl", price: "25", calendarIDs: [13582962], description: "One ticket covers one person." }),
  ];
  const pricing = await getActivityPricing(getActivityDetailBySlug("matcha-bowl")!, catalog);
  assert.equal(pricing.destinations.chicago?.currentPrice, 45);
  assert.equal(pricing.destinations.eugene?.currentPrice, 25);
  assert.equal(pricing.displayPrice, "From $25");
  assert.equal(pricing.wasPrice, null);
  assert.equal(getClassGiftingContext("mug-and-bowl", "eugene", ["chicago", "eugene"]), null, "Never silently switch Eugene gifts to Chicago");
  console.log("Live QA repairs: homepage/detail mapping, booking IDs/calendars, unavailable activities, prices, gifts, and DST passed.");
}
run().catch(error => { console.error(error); process.exitCode = 1; });
