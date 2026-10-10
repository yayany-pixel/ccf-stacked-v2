import assert from "node:assert/strict";
import {
  getAllActivityDetails,
  getActivityDetailBySlug,
  getAllActivitySlugs,
  getBookingDestinations,
  type ActivityDetail
} from "../lib/activityRegistry";
import { STUDIO_LOCATIONS } from "../lib/locations";
import { ACTIVITY_MANIFEST } from "../lib/homepage/manifest";

function testActivityPagesAndBookingFlow() {
  console.log("Starting verification of activity pages and location-safe booking flow...\n");

  const activities = getAllActivityDetails();
  const slugs = getAllActivitySlugs();
  const readyManifest = ACTIVITY_MANIFEST.filter(a => a.eligibility === "ready");

  // 1. Check registry inventory & slug coverage
  console.log("1. Checking workshop inventory and slug mappings...");
  assert.ok(activities.length >= 40, `Expected at least 40 workshops, got ${activities.length}`);
  assert.equal(slugs.length, activities.length);
  for (const slug of slugs) {
    const detail = getActivityDetailBySlug(slug);
    assert.ok(detail, `Activity ${slug} must be retrievable`);
    assert.equal(detail.slug, slug);
    assert.ok(detail.title.length > 0, `Activity ${slug} must have a title`);
    assert.ok(detail.heroDescription.length > 0, `Activity ${slug} must have a description`);
    assert.ok(detail.image?.path, `Activity ${slug} must have an image path`);
  }
  console.log(`✓ All ${activities.length} distinct workshops are valid and fully defined.\n`);

  // 2. Test dual-city workshop exact Acuity destinations
  console.log("2. Checking dual-city workshops and Acuity destinations...");
  const dualCitySlugs = [
    "cauldron-pottery",
    "date-night-wheel",
    "beginner-wheel",
    "mug-and-bowl",
    "wine-glass-painting",
    "mushroom-pottery",
    "pipe-and-ashtray",
    "charcuterie-board",
    "date-night-watercolor",
    "vip-date-night-painting"
  ];

  for (const slug of dualCitySlugs) {
    const detail = getActivityDetailBySlug(slug)!;
    assert.equal(detail.locationsOffered, "Chicago & Eugene", `${slug} should be offered in Chicago & Eugene`);
    assert.ok(detail.destinations.chicago, `${slug} must have Chicago destination`);
    assert.ok(detail.destinations.eugene, `${slug} must have Eugene destination`);
    assert.ok(!detail.destinations.online, `${slug} in-person must not have online destination`);

    // Chicago checks
    assert.equal(detail.destinations.chicago.city, "chicago");
    assert.ok(detail.destinations.chicago.appointmentTypeId > 0);
    assert.ok(detail.destinations.chicago.bookingUrl.includes(String(detail.destinations.chicago.appointmentTypeId)));
    assert.ok(detail.destinations.chicago.bookingUrl.startsWith("https://colorcocktailfactory.as.me/"));
    assert.deepEqual(detail.destinations.chicago.calendarIds, [12216179]);

    // Eugene checks
    assert.equal(detail.destinations.eugene.city, "eugene");
    assert.ok(detail.destinations.eugene.appointmentTypeId > 0);
    assert.ok(detail.destinations.eugene.bookingUrl.includes(String(detail.destinations.eugene.appointmentTypeId)));
    assert.ok(detail.destinations.eugene.bookingUrl.startsWith("https://colorcocktailfactory.as.me/"));
    assert.deepEqual(detail.destinations.eugene.calendarIds, [13582962]);

    // Destination isolation: Chicago and Eugene must never point to the same appointment type
    assert.notEqual(
      detail.destinations.chicago.appointmentTypeId,
      detail.destinations.eugene.appointmentTypeId,
      `${slug} Chicago and Eugene must have isolated appointment types`
    );
  }
  console.log(`✓ Verified ${dualCitySlugs.length} dual-city workshops have exact, city-isolated Acuity schedules.\n`);

  // 3. Test single-city workshops never offer the other city
  console.log("3. Checking single-city workshops isolation...");
  const chicagoOnlySlugs = ["turkish-lamp", "glass-fusion", "bonsai", "terrarium", "candle-making", "mosaic"];
  for (const slug of chicagoOnlySlugs) {
    const detail = getActivityDetailBySlug(slug)!;
    assert.equal(detail.locationsOffered, "Chicago only", `${slug} must be Chicago only`);
    assert.ok(detail.destinations.chicago, `${slug} must have Chicago destination`);
    assert.equal(detail.destinations.eugene, undefined, `${slug} must NOT offer Eugene`);
    assert.equal(detail.destinations.online, undefined, `${slug} must NOT offer Online`);
  }

  const eugeneOnlySlugs = ["date-night-terrarium", "ceramic-chess", "vip-date-night-bonsai", "duck-soap-holder"];
  for (const slug of eugeneOnlySlugs) {
    const detail = getActivityDetailBySlug(slug)!;
    assert.equal(detail.locationsOffered, "Eugene only", `${slug} must be Eugene only`);
    assert.ok(detail.destinations.eugene, `${slug} must have Eugene destination`);
    assert.equal(detail.destinations.chicago, undefined, `${slug} must NOT offer Chicago`);
  }
  console.log("✓ Single-city workshops strictly isolate their studio location.\n");

  // 4. Test online workshop
  console.log("4. Checking online workshop behavior...");
  const onlineCauldron = getActivityDetailBySlug("online-cauldron")!;
  assert.equal(onlineCauldron.locationsOffered, "Live online");
  assert.ok(onlineCauldron.destinations.online);
  assert.equal(onlineCauldron.destinations.chicago, undefined);
  assert.equal(onlineCauldron.destinations.eugene, undefined);
  assert.equal(onlineCauldron.destinations.online.appointmentTypeId, 98770334);
  assert.equal(onlineCauldron.isPottery, false, "Online air-dry workshop must not be classified as kiln pottery");
  console.log("✓ Online workshop correctly routes without Chicago/Eugene options.\n");

  // 5. Test verified studio addresses
  console.log("5. Checking verified studio addresses...");
  assert.equal(STUDIO_LOCATIONS.chicago.address, "1142 W. 18th Street, Chicago, IL 60608");
  assert.equal(STUDIO_LOCATIONS.eugene.address, "3295 Cross Street, Eugene, OR 97402");
  console.log("✓ Studio addresses match verified business configuration.\n");

  // 6. Test pottery classification & finishing rules
  console.log("6. Checking pottery classification and finishing rules...");
  const potterySlugs = [
    "beginner-wheel",
    "date-night-wheel",
    "cauldron-pottery",
    "mug-and-bowl",
    "mushroom-pottery",
    "pipe-and-ashtray",
    "cat-vase",
    "clay-pumpkin"
  ];
  for (const slug of potterySlugs) {
    const detail = getActivityDetailBySlug(slug)!;
    assert.equal(detail.isPottery, true, `${slug} must have isPottery=true`);
  }

  const nonPotterySlugs = [
    "turkish-lamp",
    "glass-fusion",
    "bonsai",
    "terrarium",
    "candle-making",
    "mosaic",
    "wine-glass-painting",
    "online-cauldron",
    "charcuterie-board"
  ];
  for (const slug of nonPotterySlugs) {
    const detail = getActivityDetailBySlug(slug)!;
    assert.equal(detail.isPottery, false, `${slug} must have isPottery=false`);
  }
  console.log("✓ Pottery and non-pottery activities strictly separated for kiln finishing.\n");

  // 7. Test tickets covering two participants
  console.log("7. Checking couples and date night coverage notes...");
  const couplesSlugs = ["date-night-wheel", "vip-date-night-painting", "date-night-watercolor", "ceramic-chess"];
  for (const slug of couplesSlugs) {
    const detail = getActivityDetailBySlug(slug)!;
    assert.equal(detail.coversTwo, true, `${slug} must have coversTwo=true`);
    assert.equal(detail.ticketUnit, "for two", `${slug} ticketUnit must be 'for two'`);
    assert.ok(detail.coversNote, `${slug} must have explicit note for two`);
  }
  console.log("✓ Pairs and date-night workshops explicitly state ticket coverage for two.\n");

  // 8. Test Beginner Wheel throwing realistic expectation copy
  console.log("8. Checking beginner wheel throwing experience copy...");
  const beginnerWheel = getActivityDetailBySlug("beginner-wheel")!;
  const experienceText = beginnerWheel.theExperience.map(e => e.body).join(" ");
  assert.ok(
    experienceText.includes("attempt") && (experienceText.includes("without guaranteeing") || experienceText.includes("not guaranteed")),
    "Beginner wheel throwing must encourage learning and attempt without guaranteeing finished pieces"
  );
  console.log("✓ Beginner wheel throwing contains realistic, supportive craft copy.\n");

  // 9. Test Manifest detailUrls point to /activities/
  console.log("9. Checking manifest detailUrls...");
  for (const item of readyManifest) {
    assert.ok(
      item.detailUrl?.startsWith("/activities/"),
      `Manifest item ${item.key} detailUrl must point to /activities/, got ${item.detailUrl}`
    );
  }
  console.log(`✓ All ${readyManifest.length} ready manifest activities lead to activity detail pages.\n`);

  console.log("=================================================");
  console.log("ALL ACTIVITY PAGES & BOOKING FLOW CHECKS PASSED!");
  console.log("=================================================");
}

testActivityPagesAndBookingFlow();
