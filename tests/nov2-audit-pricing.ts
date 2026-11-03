import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getCatalog } from "../lib/askccf/catalog";
import { buildHomepageData } from "../lib/homepage/data";
import { getActivityDetailBySlug } from "../lib/activityRegistry";
import { getActivityBySlug, getAllActivitySlugs, getActivitiesByCategory } from "../lib/activities";
import { getActivityPricing, getLivePrice } from "../lib/pricing";
import { getVerifiedPromotion, PROMOTIONAL_WORKSHOPS, PROMOTION_START_ISO } from "../lib/promotions";
import HomepageStructuredData from "../components/HomepageStructuredData";
import PricingDisplay from "../components/PricingDisplay";

async function main() {
  const fetchBefore = globalThis.fetch;
  const userBefore = process.env.ACUITY_USER_ID;
  const keyBefore = process.env.ACUITY_API_KEY;
  const entries = [
    { id: 94782668, name: "Renamed Cup Workshop on the Wheel", calendarIDs: [12216179] },
    { id: 94782880, name: "Vase Making on the Wheel", calendarIDs: [12216179] },
    { id: 95911163, name: "Open Studio Wheel", calendarIDs: [12216179] },
    { id: 93539343, name: "Eugene Cup Creations on the Wheel", calendarIDs: [13582962] },
    { id: 89287658, name: "Eugene Matcha Bowl on the Wheel", calendarIDs: [13582962] },
    { id: 79189013, name: "Renamed Offering", calendarIDs: [12216179] },
  ].map(entry => ({ ...entry, active: true, price: "25.00" }));
  process.env.ACUITY_USER_ID = "test";
  process.env.ACUITY_API_KEY = "test";
  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), "https://acuityscheduling.com/api/v1/appointment-types");
    assert.ok(!init?.method || init.method === "GET", "Acuity is read-only");
    return Response.json(entries);
  };
  try {
    const catalog = await getCatalog();
    assert.equal(catalog.length, entries.length);
    for (const item of catalog) {
      assert.equal(item.pricing.price, 25, `${item.id}: never rewrite live wheel prices`);
      const price = await getLivePrice(item.id, item.location, catalog, item.calendarIds);
      assert.equal(price.currentPrice, item.pricing.price);
      assert.equal(price.wasPrice, null);
    }
    const data = buildHomepageData(catalog, [{
      appointmentTypeID: 79189013, calendarID: 12216179,
      time: "2026-11-04T18:00:00-0600", duration: 90, slotsAvailable: 4,
    }], new Date("2026-11-03T12:00:00Z"));
    const terrarium = data.activities.find(item => item.appointmentTypeId === 79189013)!;
    assert.equal(terrarium.offeringState, "active");
    assert.equal(terrarium.availabilityState, "available");
    assert.equal(terrarium.title, "Terrarium Workshop");
    assert.equal(terrarium.currentPrice, 25);
    assert.equal((await getLivePrice(79189013, "eugene", catalog)).currentPrice, null);
    assert.equal((await getLivePrice(79189013, "chicago", catalog, [13582962])).currentPrice, null);
    assert.equal((await getLivePrice(79189013, "chicago", catalog.map(item => ({ ...item, calendarIds: [] })), [12216179])).currentPrice, null);
    const catVase = getActivityDetailBySlug("cat-vase")!;
    const unavailable = await getActivityPricing(catVase, []);
    assert.equal(unavailable.displayPrice, "See price at checkout");
    assert.equal(unavailable.hasSaleBadge, false);
    assert.equal(unavailable.isFlashSale, false);
    assert.equal(getActivityDetailBySlug("private-parties"), undefined);
    assert.equal(getActivityBySlug("private-parties"), undefined);
    assert.ok(!getAllActivitySlugs().includes("private-parties"));
    assert.ok(![...getActivitiesByCategory().values()].flat().some(activity => activity.slug === "private-parties"));

    Object.assign(globalThis, { React });
    const courseMarkup = renderToStaticMarkup(React.createElement(PricingDisplay, { price: 37.13 }));
    assert.match(courseMarkup, /\$37\.13/);
    assert.doesNotMatch(courseMarkup, /\$150/);
    assert.match(renderToStaticMarkup(React.createElement(PricingDisplay)), /See price at checkout/);
    const unpriced = { ...data, activities: [{ ...terrarium, currentPrice: null }] };
    const markup = renderToStaticMarkup(React.createElement(HomepageStructuredData, { data: unpriced }));
    assert.doesNotMatch(markup, /"price":/);
    assert.match(markup, /"@type":"Event"/);

    const promo = PROMOTIONAL_WORKSHOPS[0];
    const regularBefore = promo.regularPrice;
    try {
      promo.regularPrice = promo.promoPrice + 10;
      const active = Date.parse(PROMOTION_START_ISO) + 3600000;
      assert.equal(getVerifiedPromotion(promo.appointmentTypeId, promo.promoPrice, active), promo);
      assert.equal(getVerifiedPromotion(promo.appointmentTypeId, promo.promoPrice + 1, active), null);
      assert.equal(getVerifiedPromotion(promo.appointmentTypeId, null, active), null);
      assert.equal(getVerifiedPromotion(promo.appointmentTypeId, promo.promoPrice, Date.parse("2026-11-03")), null);
      promo.regularPrice = promo.promoPrice;
      assert.equal(getVerifiedPromotion(promo.appointmentTypeId, promo.promoPrice, active), null);
    } finally {
      promo.regularPrice = regularBefore;
    }
  } finally {
    globalThis.fetch = fetchBefore;
    if (userBefore === undefined) delete process.env.ACUITY_USER_ID;
    else process.env.ACUITY_USER_ID = userBefore;
    if (keyBefore === undefined) delete process.env.ACUITY_API_KEY;
    else process.env.ACUITY_API_KEY = keyBefore;
  }
  console.log("Nov 2 pricing audit: fetched price parity, renamed IDs, city/calendar isolation, promotion verification, and unpriced JSON-LD passed.");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
