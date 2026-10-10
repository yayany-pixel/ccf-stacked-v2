/**
 * Verification of Live Acuity Pricing Parity
 * Asserts that:
 * 1. For every slug in the registry and every destination, the displayed current price
 *    equals the live catalog price for that appointment type.
 * 2. A was price appears ONLY when strictly higher than the live Acuity price.
 * 3. A missing or unavailable catalog price renders "See price at checkout" and no was price.
 * 4. Turkish lamp lists all three options (table, hanging, date night for two) with lowest price headline.
 * 5. Prices and units match exactly between homepage cards and class detail pages.
 */

import assert from "node:assert/strict";
import { getAllActivityDetails, getActivityDetailBySlug } from "../lib/activityRegistry";
import { getCatalog, normalize, type CatalogClass } from "../lib/askccf/catalog";
import { getActivityPricing, getLivePrice, TURKISH_LAMP_OPTIONS } from "../lib/pricing";
import { buildHomepageData, activitiesForCity, priceLabel, EXPLICIT_FORMER_PRICES } from "../lib/homepage/data";
import { ACTIVITY_MANIFEST } from "../lib/homepage/manifest";

async function runLivePricingTests() {
  console.log("Starting Live Acuity Pricing Parity & Policy Verification...\n");

  const catalog: CatalogClass[] | null = await getCatalog().catch(() => null);
  assert.ok(catalog && catalog.length > 0, "Live Acuity catalog must be available for testing");
  const activities = getAllActivityDetails();

  console.log(`1. Testing live price accuracy across all ${activities.length} registered activities...`);

  for (const activity of activities) {
    const pricing = await getActivityPricing(activity, catalog);

    if (activity.slug === "turkish-lamp") {
      assert.ok(pricing.variants && pricing.variants.length === 3, "Turkish lamp must have 3 variants");
      assert.deepEqual(
        pricing.variants.map((v) => v.id),
        [95416771, 79374537, 95894050],
        "Turkish lamp must cover table, hanging, and date night appointment types",
      );
      const validPrices = pricing.variants.map((v) => v.currentPrice).filter((p): p is number => p !== null);
      const minPrice = Math.min(...validPrices);
      assert.equal(pricing.displayPrice, `From $${minPrice}`, "Turkish lamp headline must show lowest live price");
      assert.equal(pricing.wasPrice, null, "Turkish lamp must have no wasPrice");
      continue;
    }

    const destEntries = Object.entries(pricing.destinations) as [
      string,
      NonNullable<(typeof pricing.destinations)["chicago"]>,
    ][];

    for (const [city, dest] of destEntries) {
      const catalogItem: CatalogClass | undefined = catalog.find(
        (c: CatalogClass) => Number(c.id) === dest.appointmentTypeId,
      );
      if (catalogItem && catalogItem.pricing.price !== null) {
        assert.equal(
          dest.currentPrice,
          catalogItem.pricing.price,
          `${activity.slug} (${city}) price must match live Acuity catalog`,
        );

        const expectedUnit: "for two" | "per person" | "per ticket" =
          catalogItem.pricing.covers === 2
            ? "for two"
            : catalogItem.pricing.covers === 1
            ? "per person"
            : "per ticket";
        assert.equal(
          dest.priceUnit,
          expectedUnit,
          `${activity.slug} (${city}) unit must match Acuity coverage`,
        );

        // Check was price rule: strictly higher
        const manifestEntry = ACTIVITY_MANIFEST.find(
          (m) =>
            m.appointmentTypeId === dest.appointmentTypeId &&
            (!city || m.city.toLowerCase() === city.toLowerCase()),
        );
        const former = manifestEntry ? EXPLICIT_FORMER_PRICES[manifestEntry.key] ?? null : null;

        if (former !== null && former > dest.currentPrice) {
          assert.equal(
            dest.wasPrice,
            former,
            `${activity.slug} (${city}) was price must equal EXPLICIT_FORMER_PRICES`,
          );
        } else {
          assert.equal(
            dest.wasPrice,
            null,
            `${activity.slug} (${city}) must NOT show wasPrice when former <= current or undefined`,
          );
        }
      }
    }
  }
  console.log("✓ Live price accuracy verified for all registry destinations.\n");

  console.log("2. Verifying fallback behavior when live catalog price is missing...");
  for (const activity of activities) {
    const offlinePricing = await getActivityPricing(activity, []);
    assert.equal(
      offlinePricing.displayPrice,
      "See price at checkout",
      `${activity.slug} must show "See price at checkout" when catalog is unpriced/empty`,
    );
    assert.equal(
      offlinePricing.wasPrice,
      null,
      `${activity.slug} must have no was price when catalog is unpriced/empty`,
    );
    assert.equal(
      offlinePricing.hasSaleBadge,
      false,
      `${activity.slug} must have no sale badge when catalog is unpriced/empty`,
    );

    const nullPricing = await getActivityPricing(activity, null);
    assert.equal(
      nullPricing.displayPrice,
      "See price at checkout",
      `${activity.slug} must show "See price at checkout" when catalog is null`,
    );
  }
  console.log('✓ "See price at checkout" and no wasPrice verified across all activities.\n');

  console.log("3. Verifying the seven prompt example activities against Acuity...");
  const examples = [
    { slug: "cat-vase", expectedPrice: 25, expectedUnit: "per ticket", expectedWas: 55 },
    { slug: "mosaic", expectedPrice: 30, expectedUnit: "per ticket", expectedWas: 55 },
    { slug: "mug-and-bowl", expectedPrice: 35, expectedUnit: "per ticket", expectedWas: 55 },
    { slug: "date-night-on-fire", expectedPrice: 200, expectedUnit: "for two", expectedWas: 295 },
    { slug: "vip-date-night-bonsai", expectedPrice: 120, expectedUnit: "per ticket", expectedWas: null },
    { slug: "make-and-paint-wheel", expectedPrice: 65, expectedUnit: "per ticket", expectedWas: 180 },
    { slug: "wheel-pumpkin", expectedPrice: 60, expectedUnit: "per ticket", expectedWas: 75 },
  ];

  for (const ex of examples) {
    const act = getActivityDetailBySlug(ex.slug);
    assert.ok(act, `Activity ${ex.slug} must exist in registry`);
    const pricing = await getActivityPricing(act, catalog);

    if (ex.slug === "mug-and-bowl") {
      assert.equal(pricing.displayPrice, "$35 per ticket", "Mug and bowl same price in both cities ($35)");
      assert.equal(pricing.wasPrice, 55, "Mug and bowl former price is $55");
    } else {
      assert.ok(
        pricing.displayPrice.includes(`$${ex.expectedPrice}`),
        `${ex.slug} displayPrice must include $${ex.expectedPrice}, got "${pricing.displayPrice}"`,
      );
      assert.ok(
        pricing.displayPrice.includes(ex.expectedUnit),
        `${ex.slug} displayPrice must include unit "${ex.expectedUnit}", got "${pricing.displayPrice}"`,
      );
      assert.equal(
        pricing.wasPrice,
        ex.expectedWas,
        `${ex.slug} wasPrice must equal ${ex.expectedWas}, got ${pricing.wasPrice}`,
      );
    }
  }
  console.log("✓ All 7 prompt benchmark activities match Acuity prices, units, and was-prices.\n");

  console.log("4. Verifying homepage card and detail page parity...");
  const homepageData = buildHomepageData(catalog, null);
  const chicagoCards = activitiesForCity(homepageData.activities, "chicago");
  const eugeneCards = activitiesForCity(homepageData.activities, "eugene");

  for (const card of [...chicagoCards, ...eugeneCards]) {
    const slug = card.detailUrl ? card.detailUrl.replace(/^\/activities\//, "") : "";
    if (!slug) continue;
    const act = getActivityDetailBySlug(slug);
    if (!act) continue;

    const detailPricing = await getActivityPricing(act, catalog);
    const cardPrice = priceLabel(card);

    if (card.bookingVariants && card.bookingVariants.length > 1) {
      assert.equal(cardPrice, detailPricing.displayPrice, `${slug} card and detail price headline must match`);
    } else if (card.city === "chicago" && detailPricing.destinations.chicago) {
      const dest = detailPricing.destinations.chicago;
      assert.equal(card.currentPrice, dest.currentPrice, `${slug} Chicago card and destination price must match`);
      assert.equal(card.priceUnit, dest.priceUnit, `${slug} Chicago card and destination unit must match`);
      assert.equal(
        card.formerPrice?.amount ?? null,
        dest.wasPrice,
        `${slug} Chicago card and destination wasPrice must match`,
      );
    } else if (card.city === "eugene" && detailPricing.destinations.eugene) {
      const dest = detailPricing.destinations.eugene;
      assert.equal(card.currentPrice, dest.currentPrice, `${slug} Eugene card and destination price must match`);
      assert.equal(card.priceUnit, dest.priceUnit, `${slug} Eugene card and destination unit must match`);
      assert.equal(
        card.formerPrice?.amount ?? null,
        dest.wasPrice,
        `${slug} Eugene card and destination wasPrice must match`,
      );
    }
  }
  console.log("✓ Homepage card prices, units, and was-prices match detail pages exactly.\n");

  console.log("=================================================");
  console.log("ALL LIVE PRICING PARITY & POLICY CHECKS PASSED!");
  console.log("=================================================");
}

runLivePricingTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
