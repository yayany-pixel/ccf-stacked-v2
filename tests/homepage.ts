import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { normalize, type PublicClassSlot } from "../lib/askccf/catalog";
import { ACTIVITY_MANIFEST, APPROVED_PHOTOS } from "../lib/homepage/manifest";
import { activitiesForCity, buildHomepageData, formatNextSession, priceLabel, matchesHomepageFilter } from "../lib/homepage/data";

const now = new Date("2026-10-05T12:00:00Z");
const catalog = ACTIVITY_MANIFEST.map(activity => normalize({
  id: activity.appointmentTypeId,
  name: activity.acuityTitle,
  calendarIDs: activity.calendarIds,
  category: activity.city === "online" ? "Online" : activity.city === "eugene" ? "Eugene Classes" : "Chicago Classes",
  active: true,
  price: activity.city === "eugene" ? "50" : "55",
  description: activity.key.includes("date-night-wheel") ? "One ticket covers two people." : "",
}));
const slots: PublicClassSlot[] = [
  { appointmentTypeID: 95588506, calendarID: 12216179, time: "2026-10-06T18:00:00-0500", duration: 90, slotsAvailable: 5 },
  { appointmentTypeID: 96657402, calendarID: 13582962, time: "2026-10-07T18:00:00-0700", duration: 90, slotsAvailable: 3 },
  { appointmentTypeID: 95588506, calendarID: 13582962, time: "2026-10-05T13:00:00-0700", duration: 90, slotsAvailable: 3 },
  { appointmentTypeID: 95588506, calendarID: 12216179, time: "2026-10-05T13:00:00-0500", duration: 90, slotsAvailable: 0 },
  { appointmentTypeID: 95588506, calendarID: 12216179, time: "2026-10-04T18:00:00-0500", duration: 90, slotsAvailable: 5 },
];
const data = buildHomepageData(catalog, slots, now);
const chicago = activitiesForCity(data.activities, "chicago");
const eugene = activitiesForCity(data.activities, "eugene");
assert.deepEqual(chicago.slice(0, 10).map(activity => activity.appointmentTypeId), [95588506, 79006071, 79006616, 95416771, 79186725, 79189013, 79182319, 79185767, 97020385, 79181599]);
assert.deepEqual(eugene.slice(0, 3).map(activity => activity.appointmentTypeId), [96657402, 91935746, 93539343]);
assert.ok(eugene.some(activity => activity.appointmentTypeId === 89287658));
assert.ok(!eugene.some(activity => activity.appointmentTypeId === 92719951));
assert.ok(!eugene.some(activity => activity.city === "chicago"));
assert.ok(!chicago.some(activity => activity.appointmentTypeId === 96113161));
assert.equal(new Set(ACTIVITY_MANIFEST.map(activity => activity.key)).size, ACTIVITY_MANIFEST.length);
assert.equal(new Set(ACTIVITY_MANIFEST.map(activity => activity.appointmentTypeId)).size, ACTIVITY_MANIFEST.length);
assert.equal(APPROVED_PHOTOS.length, 50);
for (const photo of APPROVED_PHOTOS) {
  assert.ok(existsSync(`public${photo.path}`), photo.filename);
  assert.ok(photo.width > 0 && photo.height > 0 && photo.alt && photo.focalPosition && photo.driveFileId);
}
for (const activity of [...chicago, ...eugene]) {
  const destination = new URL(activity.bookingUrl!);
  assert.equal(destination.hostname, "colorcocktailfactory.as.me");
  if (activity.bookingVariantIds && activity.bookingVariantIds.length > 1) {
    assert.deepEqual(destination.searchParams.getAll("appointmentType[]"), activity.bookingVariantIds.map(String));
  } else {
    assert.equal(destination.searchParams.get("appointmentType"), String(activity.appointmentTypeId));
    assert.equal(destination.searchParams.size, 1);
  }
  assert.ok(activity.calendarIds.length > 0);
  assert.equal(activity.formerPrice, null);
}
assert.equal(priceLabel(chicago[1]), "$55 for two");
assert.equal(priceLabel(eugene[1]), "$50 for two");
assert.equal(priceLabel(chicago[0]), "$55 per ticket");
assert.equal(chicago[0].nextAvailability, "2026-10-06T18:00:00-0500");
assert.equal(eugene[0].nextAvailability, "2026-10-07T18:00:00-0700");
assert.match(formatNextSession(chicago[0], now), /Oct 6.*6:00 PM CDT/);
assert.match(formatNextSession(eugene[0], now), /Oct 7.*6:00 PM PDT/);
assert.match(formatNextSession({ ...chicago[0], nextAvailability: "2026-11-01T06:30:00Z" }, now), /1:30 AM CDT/);
assert.match(formatNextSession({ ...chicago[0], nextAvailability: "2026-11-01T07:30:00Z" }, now), /1:30 AM CST/);
assert.equal(formatNextSession(chicago[0], new Date("2026-10-20")), "View upcoming dates");
const offline = buildHomepageData(null, null, now);
assert.equal(activitiesForCity(offline.activities, "chicago")[0].bookingUrl, chicago[0].bookingUrl);
assert.ok(offline.activities.every(activity => activity.currentPrice === null && activity.nextAvailability === null));
const unavailable = buildHomepageData(catalog, null, now);
assert.equal(unavailable.activities.find(activity => activity.appointmentTypeId === 95588506)?.availabilityState, "unavailable");
const empty = buildHomepageData(catalog, [], now);
assert.equal(empty.activities.find(activity => activity.appointmentTypeId === 95588506)?.availabilityState, "empty-window");
assert.equal(formatNextSession(empty.activities[0], now), "View upcoming dates");
const removed = buildHomepageData(catalog.filter(activity => activity.id !== "95588506"), slots, now);
assert.ok(!activitiesForCity(removed.activities, "chicago").some(activity => activity.appointmentTypeId === 95588506));
const wrongCity = buildHomepageData(catalog.map(activity => activity.id === "95588506" ? { ...activity, location: "eugene" as const } : activity), slots, now);
assert.ok(!activitiesForCity(wrongCity.activities, "chicago").some(activity => activity.appointmentTypeId === 95588506));
assert.notEqual(ACTIVITY_MANIFEST.find(activity => activity.key === "chicago-date-night-wheel")?.appointmentTypeId, ACTIVITY_MANIFEST.find(activity => activity.key === "chicago-date-night-handbuilding")?.appointmentTypeId);
assert.equal(ACTIVITY_MANIFEST.find(activity => activity.appointmentTypeId === 97020385)?.title, "VIP Date Night Painting");
assert.equal(chicago.find(activity => activity.mode === "online")?.appointmentTypeId, 98770334);
console.log("Homepage checks passed: complete image inventory, exact mappings, city isolation, ticket units, timezone/DST, inactive offerings, outages, and empty availability.");

const lamp = chicago.filter(activity => /Turkish.*Lamp/i.test(activity.title));
assert.equal(lamp.length, 1);
assert.deepEqual(lamp[0].bookingVariantIds, [95416771, 79374537, 95894050]);
assert.equal(lamp[0].analyticsContentId, "activity:turkish-lamp");
const varied = data.activities.map(activity => activity.appointmentTypeId === 95894050 ? { ...activity, currentPrice: 110, priceUnit: "for two" as const } : activity);
assert.equal(priceLabel(activitiesForCity(varied, "chicago").find(activity => activity.key === "chicago-turkish-lamp")!), "See price at checkout");
const remainingLamp = activitiesForCity(data.activities.map(activity => [95416771, 79374537].includes(activity.appointmentTypeId) ? { ...activity, offeringState: "inactive" as const } : activity), "chicago").find(activity => activity.key === "chicago-turkish-lamp")!;
assert.equal(new URL(remainingLamp.bookingUrl!).searchParams.get("appointmentType"), "95894050");
assert.equal(remainingLamp.analyticsContentId, "95894050");
assert.equal(activitiesForCity(offline.activities, "chicago").filter(activity => /Turkish.*Lamp/i.test(activity.title)).length, 1);

// Enrichment uses verified catalog fields, keeps all-order intact, and filters groups.
const enriched = buildHomepageData(catalog.map(item => ({...item, durationMinutes: 90, description: 'Materials for this workshop are included.', pickupNotes: ['Collect fired pieces later.']})), slots, now);
assert.equal(enriched.activities[0].durationMinutes, 90);
assert.equal(enriched.activities[0].listingDescription, 'Materials for this workshop are included.');
assert.equal(offline.activities[0].listingDescription, null);
assert.deepEqual(offline.activities[0].upcomingSessions, []);
assert.deepEqual(enriched.activities[0].upcomingSessions, ['2026-10-06T18:00:00-0500']);
assert.equal(lamp[0].bookingVariants?.length, 3);
assert.equal(lamp[0].listingDescription, null);
assert.ok(matchesHomepageFilter(lamp[0], 'Date night'));
assert.ok(matchesHomepageFilter(lamp[0], 'Glass & lamps'));
assert.ok(!matchesHomepageFilter(lamp[0], 'Pottery'));
assert.ok(chicago.filter(activity => matchesHomepageFilter(activity, 'Online')).every(activity => activity.mode === 'online'));
assert.deepEqual(chicago.filter(activity => matchesHomepageFilter(activity, 'All workshops')), chicago);
