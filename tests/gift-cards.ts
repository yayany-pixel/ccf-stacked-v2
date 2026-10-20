import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  buildAcuityProductPurchaseUrl,
  getClassGiftingContext,
  GIFT_FAQS,
  MANUAL_ACUITY_SETUP_SPECS,
  resolveGiftExperiences,
  VERIFIED_ACUITY_PRODUCTS,
  VERIFIED_CHICAGO_GIFT_WORKSHOPS,
} from "../lib/gifts";
import { safeUrl, trackBeginCheckout, trackCardSelect } from "../lib/analytics";
import { contentIdentity, classCategory } from "../lib/analyticsIdentity";

function runGiftCardTests() {
  console.log("=== Running Gift Card Storefront & Acuity Verification Tests ===");

  // 1. Experience cards precede dollar-value cards & match exact copy
  const cards = resolveGiftExperiences(VERIFIED_ACUITY_PRODUCTS);
  assert.equal(cards.length, 3);
  assert.equal(cards[0].id, "pottery-date-night-for-two");
  assert.equal(cards[0].title, "Pottery Date Night for Two");
  assert.equal(
    cards[0].supportingCopy,
    "Give your favorite couple a little clay, a little laughter, and time together.",
  );
  assert.equal(cards[0].buttonLabel, "Gift a Date Night");
  assert.equal(cards[0].isExperienceCard, true);

  assert.equal(cards[1].id, "their-first-pottery-class");
  assert.equal(cards[1].title, "Their First Pottery Class");
  assert.equal(
    cards[1].supportingCopy,
    "For the person who keeps saying, ‘I’ve always wanted to try that.’",
  );
  assert.equal(cards[1].buttonLabel, "Gift Their First Spin");
  assert.equal(cards[1].isExperienceCard, true);

  assert.equal(cards[2].id, "let-them-choose");
  assert.equal(cards[2].title, "Let Them Choose");
  assert.equal(
    cards[2].supportingCopy,
    "Know they’ll love making something, but unsure what? Give them the choice.",
  );
  assert.equal(cards[2].buttonLabel, "Choose a Gift Amount");
  assert.equal(cards[2].isExperienceCard, false);

  // 2. Verified prices, guest counts, studio eligibility, and photos exist on disk
  const dnChi = cards[0].offerings.chicago;
  const dnEug = cards[0].offerings.eugene;
  assert.equal(dnChi.price, 55);
  assert.equal(dnChi.guestsCovered, 2);
  assert.equal(dnChi.eligibleAppointmentTypes[0].id, 79006071);
  assert.equal(dnEug.price, 50);
  assert.equal(dnEug.guestsCovered, 2);
  assert.equal(dnEug.eligibleAppointmentTypes[0].id, 91935746);

  const fpChi = cards[1].offerings.chicago;
  const fpEug = cards[1].offerings.eugene;
  assert.equal(fpChi.price, 45);
  assert.equal(fpChi.guestsCovered, 1);
  assert.equal(fpChi.eligibleAppointmentTypes[0].id, 79006616);
  assert.equal(fpEug.price, 25);
  assert.equal(fpEug.guestsCovered, 1);
  assert.deepEqual(
    fpEug.eligibleAppointmentTypes.map((a) => a.id),
    [93539343, 89287658],
  );

  for (const card of cards) {
    for (const city of ["chicago", "eugene"] as const) {
      const photoPath = card.offerings[city].photo.path;
      const diskPath = path.join(process.cwd(), "public", photoPath);
      assert.ok(
        existsSync(diskPath),
        `Studio photo must exist on disk: ${photoPath}`,
      );
    }
  }

  // 3. Uncreated experience products and Eugene gift cards do NOT expose a primary purchaseUrl
  assert.equal(dnChi.status, "pending_acuity_setup");
  assert.equal(dnChi.purchaseUrl, null);
  assert.equal(dnEug.status, "pending_acuity_setup");
  assert.equal(dnEug.purchaseUrl, null);
  assert.equal(fpChi.status, "pending_acuity_setup");
  assert.equal(fpChi.purchaseUrl, null);
  assert.equal(fpEug.status, "pending_acuity_setup");
  assert.equal(fpEug.purchaseUrl, null);

  // Chicago dollar-value gift cards ARE active and link to exact Acuity product IDs
  const ltcChi = cards[2].offerings.chicago;
  const ltcEug = cards[2].offerings.eugene;
  assert.equal(ltcChi.status, "active");
  assert.equal(ltcChi.denominations?.length, 5);
  assert.deepEqual(
    ltcChi.denominations?.map((d) => d.productId),
    [2119866, 2119869, 2119870, 2119872, 2119873],
  );
  assert.equal(
    ltcChi.denominations?.[0].purchaseUrl,
    "https://app.acuityscheduling.com/catalog.php?owner=35932879&action=addCart&clear=1&id=2119866",
  );
  // Eugene dollar-value gift cards are pending until Eugene appointmentTypeIDs are added in Acuity
  assert.equal(ltcEug.status, "pending_acuity_setup");
  assert.equal(ltcEug.purchaseUrl, null);

  // 4. Dynamic activation when experience products ARE added to Acuity GET /products
  const withNewProducts = resolveGiftExperiences([
    ...VERIFIED_ACUITY_PRODUCTS,
    {
      id: 9900001,
      name: "Pottery Date Night for Two — Chicago",
      description: "Covers 2 guests sharing 1 wheel in Chicago Date Night.",
      price: "55.00",
      type: "value",
      kind: "certificate",
      hidden: false,
      expires: null,
      appointmentTypeIDs: [79006071],
      counts: null,
      minutes: null,
      value: 55,
      group: "Gift Cards",
      isGiftCertificate: true,
    },
    {
      id: 9900002,
      name: "Pottery Date Night for Two — Eugene",
      description: "Covers 2 guests sharing 1 wheel in Eugene Date Night.",
      price: "50.00",
      type: "value",
      kind: "certificate",
      hidden: false,
      expires: null,
      appointmentTypeIDs: [91935746],
      counts: null,
      minutes: null,
      value: 50,
      group: "Gift Cards",
      isGiftCertificate: true,
    },
  ]);
  assert.equal(withNewProducts[0].offerings.chicago.status, "active");
  assert.equal(
    withNewProducts[0].offerings.chicago.purchaseUrl,
    buildAcuityProductPurchaseUrl(9900001),
  );
  assert.equal(withNewProducts[0].offerings.eugene.status, "active");
  assert.equal(
    withNewProducts[0].offerings.eugene.purchaseUrl,
    buildAcuityProductPurchaseUrl(9900002),
  );

  // 5. Context-preserving class gifting links
  const dnGiftChi = getClassGiftingContext("date-night-wheel", "chicago", [
    "chicago",
    "eugene",
  ]);
  assert.ok(dnGiftChi);
  assert.equal(dnGiftChi.label, "Give this class as a gift");
  assert.equal(
    dnGiftChi.href,
    "/gift-cards?city=chicago&gift=pottery-date-night-for-two&workshop=date-night-wheel#pottery-date-night-for-two",
  );

  const dnGiftEug = getClassGiftingContext("date-night-wheel", "eugene", [
    "chicago",
    "eugene",
  ]);
  assert.ok(dnGiftEug);
  assert.equal(
    dnGiftEug.href,
    "/gift-cards?city=eugene&gift=pottery-date-night-for-two&workshop=date-night-wheel#pottery-date-night-for-two",
  );

  const bwGiftChi = getClassGiftingContext("beginner-wheel", "chicago", [
    "chicago",
    "eugene",
  ]);
  assert.ok(bwGiftChi);
  assert.equal(
    bwGiftChi.href,
    "/gift-cards?city=chicago&gift=their-first-pottery-class&workshop=beginner-wheel#their-first-pottery-class",
  );

  const mugGiftChi = getClassGiftingContext("mug-and-bowl", "chicago", [
    "chicago",
    "eugene",
  ]);
  assert.ok(mugGiftChi);
  assert.equal(
    mugGiftChi.href,
    "/gift-cards?city=chicago&gift=let-them-choose&workshop=mug-and-bowl&amount=100#let-them-choose",
  );

  // Online and private classes must not advertise gift redemption
  assert.equal(getClassGiftingContext("online-cauldron", "chicago"), null);
  assert.equal(getClassGiftingContext("private-parties", "chicago"), null);

  // 6. Manual setup specs & FAQs completeness
  assert.equal(MANUAL_ACUITY_SETUP_SPECS.length, 5);
  assert.ok(GIFT_FAQS.length >= 6);
  assert.equal(VERIFIED_CHICAGO_GIFT_WORKSHOPS.length, 19);

  // 7. Analytics & URL sanitization for Acuity gift card checkout links (never fires purchase on click)
  const giftCheckoutUrl = buildAcuityProductPurchaseUrl(2119869);
  const cleaned = safeUrl(giftCheckoutUrl);
  assert.ok(cleaned.includes("id=2119869"), "safeUrl preserves product ID");
  assert.ok(cleaned.includes("owner=35932879"), "safeUrl preserves owner ID");
  const identity = contentIdentity("2119869", giftCheckoutUrl);
  assert.equal(identity.id, "2119869");
  assert.equal(identity.type, "product");
  assert.equal(classCategory("$100 Gift Card"), "gift_card");

  process.env.NEXT_PUBLIC_GA_ID_1 = "G-TESTONLY";
  const events: Array<{ name: string; params: Record<string, any> }> = [];
  Object.assign(globalThis, {
    location: new URL("https://colorcocktailfactory.com/gift-cards?city=chicago"),
    document: { referrer: "" },
    localStorage: { getItem: () => null },
    window: {
      ccfPrivacyPreferences: { analytics: true, marketing: true },
      location: new URL("https://colorcocktailfactory.com/gift-cards?city=chicago"),
      innerWidth: 1280,
      dataLayer: [],
      gtag: (_cmd: string, name: string, params: Record<string, any>) => {
        events.push({ name, params });
      },
    },
  });
  trackCardSelect({
    city: "chicago",
    class_name: "$100 Gift Card",
    class_id: "2119869",
    class_category: "gift_card",
    displayed_price: 100,
    click_target: "select_denomination",
  });
  trackBeginCheckout({
    city: "chicago",
    class_name: "$100 Gift Card",
    class_id: "2119869",
    displayed_price: 100,
    link_url: giftCheckoutUrl,
  });
  assert.ok(events.some((e) => e.name === "select_item"));
  assert.ok(events.some((e) => e.name === "begin_checkout"));
  assert.ok(
    !events.some((e) => e.name === "purchase"),
    "Clicks and checkout starts must NEVER emit a purchase event",
  );

  console.log("✓ All Gift Card Storefront & Acuity verification tests passed!");
}

runGiftCardTests();
