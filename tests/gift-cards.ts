import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import GiftCardsStorefront from "../components/GiftCardsStorefront";
import {
  ACUITY_GIFT_CARDS_CATALOG_URL,
  buildAcuityProductPurchaseUrl,
  fetchLiveAcuityProducts,
  getClassGiftingContext,
  resolveGiftCatalog,
  type AcuityRawProduct,
} from "../lib/gifts";
import { safeUrl } from "../lib/analytics";
import { contentIdentity } from "../lib/analyticsIdentity";

Object.assign(globalThis, { React });

function product(
  id: number,
  overrides: Partial<AcuityRawProduct> = {},
): AcuityRawProduct {
  return {
    id,
    name: `Live gift ${id}`,
    description: `Live description ${id}`,
    price: "67.43",
    group: "Chicago",
    hidden: false,
    ...overrides,
  };
}

function render(products: AcuityRawProduct[], initialCity?: "chicago" | "eugene") {
  return renderToStaticMarkup(
    React.createElement(GiftCardsStorefront, {
      groups: resolveGiftCatalog(products),
      initialCity,
    }),
  );
}

async function runGiftCardTests() {
  const live = [
    product(90001),
    product(90002, { group: "Eugene experiences", kind: "package" }),
    product(90003, { group: "Online", kind: "subscription" }),
    product(90004, {
      group: "Gift Cards",
      name: "Flexible Gift Card",
      type: "value",
      price: "103.29",
    }),
    product(90005, { group: "New category", name: "A brand new gift" }),
    product(90006, { hidden: true }),
    product(90007, { active: false }),
    product(90008, { status: "inactive" }),
  ];
  const groups = resolveGiftCatalog(live);
  assert.deepEqual(groups.map((group) => group.category), [
    "Chicago", "Eugene", "Online", "Dollar-value gift cards", "More gifts",
  ]);
  assert.deepEqual(
    groups.flatMap((group) => group.products.map((item) => item.id)),
    live.slice(0, 5).map((item) => item.id),
    "Every active public product is shown, including packages, online, and unknown categories",
  );
  assert.equal(groups[0].products[0].name, live[0].name);
  assert.equal(groups[0].products[0].description, live[0].description);
  assert.equal(groups[0].products[0].formattedPrice, "$67.43");
  assert.equal(groups[3].products[0].formattedPrice, "$103.29");
  assert.equal(
    groups[0].products[0].purchaseUrl,
    "https://app.acuityscheduling.com/catalog.php?owner=35932879&action=addCart&clear=1&id=90001",
  );

  const markup = render(live);
  for (const item of live.slice(0, 5)) {
    assert.ok(markup.includes(item.name));
    assert.ok(markup.includes(`id=${item.id}`));
  }
  for (const id of [90006, 90007, 90008, 2119866, 2119869]) {
    assert.ok(!markup.includes(`id=${id}`), `No checkout for absent/hidden product ${id}`);
  }
  assert.equal((markup.match(/>Buy gift<\/a>/g) ?? []).length, 5);
  assert.doesNotMatch(markup, /pending|Acuity Admin|manual-acuity-setup|VERIFIED|19 workshops/i);
  assert.doesNotMatch(markup, />Buy[^<]*9000/);
  assert.ok(render(live, "eugene").indexOf("Eugene experiences") < render(live, "eugene").indexOf("Live gift 90001"));

  const changed = render([product(90001, { price: "218.76" })]);
  assert.ok(changed.includes("$218.76"));
  assert.ok(!changed.includes("$67.43"), "Price updates come exclusively from the response");
  assert.ok(!changed.includes("$55") && !changed.includes("$45") && !changed.includes("$50"));
  const removed = render(live.slice(1));
  assert.ok(!removed.includes("Live gift 90001"));
  assert.ok(!removed.includes("id=90001"), "Removed products cannot survive the next response");
  assert.deepEqual(resolveGiftCatalog([]), []);
  assert.deepEqual(resolveGiftCatalog([
    product(1, { price: "" }),
    product(2, { price: "NaN" }),
    product(3, { price: "-1" }),
    product(4, { price: "Infinity" }),
    product(-1),
    product(5, { name: "" }),
  ]), []);
  assert.equal(resolveGiftCatalog([product(1), product(1)])[0].products.length, 1);
  assert.equal(resolveGiftCatalog([product(1, { price: "0" })])[0].products[0].price, 0);
  assert.equal((render(live.slice(5)).match(/<a\b/g) ?? []).length, 1);
  const unsafeDescription = render([product(1, { description: "<script>alert(1)</script>" })]);
  assert.ok(!unsafeDescription.includes("<script>"), "API copy must not execute HTML");

  const oldFetch = globalThis.fetch;
  const oldUserId = process.env.ACUITY_USER_ID;
  const oldApiKey = process.env.ACUITY_API_KEY;
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  let response = new Response(JSON.stringify(live));
  let throwNetworkError = false;
  globalThis.fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    if (throwNetworkError) throw new Error("network unavailable");
    return response;
  };
  try {
    delete process.env.ACUITY_USER_ID;
    delete process.env.ACUITY_API_KEY;
    assert.deepEqual(await fetchLiveAcuityProducts(), []);
    assert.equal(requests.length, 0, "Missing credentials cannot use a canned catalog");
    process.env.ACUITY_USER_ID = "test-user";
    process.env.ACUITY_API_KEY = "test-key";
    assert.deepEqual(await fetchLiveAcuityProducts(), live);
    response = new Response(JSON.stringify([product(90003, { price: "312.18" })]));
    const refreshedMarkup = render(await fetchLiveAcuityProducts());
    assert.ok(refreshedMarkup.includes("$312.18"));
    assert.ok(!refreshedMarkup.includes("id=90001"), "A fetched subset cannot reuse earlier products");
    for (response of [
      new Response("[]"),
      new Response('{"error":"unavailable"}'),
      new Response("invalid JSON"),
      new Response("denied", { status: 401 }),
      new Response("unavailable", { status: 503 }),
    ]) {
      const products = await fetchLiveAcuityProducts();
      assert.deepEqual(products, [], "Empty and failed responses never resurrect historical products");
      const emptyMarkup = render(products);
      assert.equal((emptyMarkup.match(/<a\b/g) ?? []).length, 1);
      assert.ok(emptyMarkup.includes(ACUITY_GIFT_CARDS_CATALOG_URL.replaceAll("&", "&amp;")));
      assert.doesNotMatch(emptyMarkup, /action=addCart|\$\d|>Buy gift</);
    }
    throwNetworkError = true;
    assert.deepEqual(await fetchLiveAcuityProducts(), []);
    for (const request of requests) {
      assert.equal(request.url, "https://acuityscheduling.com/api/v1/products");
      assert.equal(request.init?.method, "GET", "Acuity access must be read only");
      assert.equal(request.init?.cache, "no-store", "No stale products after an outage");
      assert.ok(request.init?.signal);
    }
  } finally {
    globalThis.fetch = oldFetch;
    if (oldUserId === undefined) delete process.env.ACUITY_USER_ID;
    else process.env.ACUITY_USER_ID = oldUserId;
    if (oldApiKey === undefined) delete process.env.ACUITY_API_KEY;
    else process.env.ACUITY_API_KEY = oldApiKey;
  }

  assert.equal(getClassGiftingContext("beginner-wheel", "eugene")?.href, "/gift-cards?city=eugene");
  assert.equal(getClassGiftingContext("private-parties"), null);
  assert.equal(getClassGiftingContext("online-cauldron"), null);
  const href = buildAcuityProductPurchaseUrl(90001);
  assert.ok(safeUrl(href).includes("id=90001"));
  assert.equal(contentIdentity("90001", href).type, "product");

  for (const file of ["app/gift-cards/page.tsx", "app/[city]/[slug]/page.tsx"]) {
    const source = readFileSync(file, "utf8");
    assert.match(source, /fetchLiveAcuityProducts\(\)/);
    assert.match(source, /resolveGiftCatalog\(rawProducts\)/);
    assert.match(source, /absolute:/, "Gift titles must not duplicate the layout's brand suffix");
    assert.doesNotMatch(source, /\$50|\$250|resolveGiftExperiences/);
  }
  for (const file of ["lib/gifts.ts", "components/GiftCardsStorefront.tsx"]) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /VERIFIED_|pending_acuity_setup|MANUAL_ACUITY_SETUP|\$\d/);
  }
  console.log("✓ Live gift catalog grouping, rendering, prices, removals, failure states, and read-only GET tests passed");
}

runGiftCardTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
