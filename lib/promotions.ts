/**
 * Promotional Pricing Configuration
 *
 * Defines promotional test prices for October 23, 2026 onwards.
 * Keeps confirmed, verified regular prices in configuration so discounts
 * can be safely reversed after the promotional period expires.
 * Never invents an original price.
 */

export type PromotionalWorkshop = {
  slug: string;
  workshopName: string;
  appointmentTypeId: number;
  city: "chicago" | "eugene";
  promoPrice: number;
  regularPrice: number; // Verified Acuity regular price
  priceUnit: "per person" | "for two" | "per ticket";
  flashSale?: boolean;
  flashSaleLabel?: string;
  bookingUrl: string;
};

// Promotional test window: October 23, 2026 onwards (Central Time)
export const PROMOTION_START_ISO = "2026-10-23T00:00:00-05:00";
export const PROMOTION_END_ISO = "2027-12-31T23:59:59-05:00";

export const PROMOTIONAL_WORKSHOPS: PromotionalWorkshop[] = [
  {
    "slug": "wine-glass-painting",
    "workshopName": "Wine Glass Painting",
    "appointmentTypeId": 79374003,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 40,
    "priceUnit": "per person",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79374003"
  },
  {
    "slug": "wine-glass-painting",
    "workshopName": "Wine Glass Painting",
    "appointmentTypeId": 95909935,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 35,
    "priceUnit": "per person",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=95909935"
  },
  {
    "slug": "mosaic",
    "workshopName": "Mosaic Creations",
    "appointmentTypeId": 79182319,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 55,
    "priceUnit": "per person",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79182319"
  },
  {
    "slug": "cauldron-pottery",
    "workshopName": "Cauldron Pottery",
    "appointmentTypeId": 95588506,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=95588506"
  },
  {
    "slug": "cauldron-pottery",
    "workshopName": "Cauldron Pottery",
    "appointmentTypeId": 96657402,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=96657402"
  },
  {
    "slug": "date-night-wheel",
    "workshopName": "Date Night Pottery on the Wheel",
    "appointmentTypeId": 79006071,
    "city": "chicago",
    "promoPrice": 55,
    "regularPrice": 55,
    "priceUnit": "for two",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79006071"
  },
  {
    "slug": "date-night-wheel",
    "workshopName": "Date Night Pottery on the Wheel",
    "appointmentTypeId": 91935746,
    "city": "eugene",
    "promoPrice": 55,
    "regularPrice": 50,
    "priceUnit": "for two",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=91935746"
  },
  {
    "slug": "beginner-wheel",
    "workshopName": "Wheel Throwing for Beginners",
    "appointmentTypeId": 79006616,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79006616"
  },
  {
    "slug": "cup-creations",
    "workshopName": "Beginner Wheel: Cup Creations",
    "appointmentTypeId": 93539343,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 25,
    "priceUnit": "per person",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=93539343"
  },
  {
    "slug": "mug-and-bowl",
    "workshopName": "Ceramic Mug and a Bowl",
    "appointmentTypeId": 79186725,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 55,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79186725"
  },
  {
    "slug": "mug-and-bowl",
    "workshopName": "Ceramic Mug and a Bowl",
    "appointmentTypeId": 90210750,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=90210750"
  },
  {
    "slug": "cat-vase",
    "workshopName": "Cat Vase Making",
    "appointmentTypeId": 79181599,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per person",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79181599",
    "flashSale": true,
    "flashSaleLabel": "Flash Sale — $25"
  },
  {
    "slug": "clay-pumpkin",
    "workshopName": "Clay Pumpkin Lantern",
    "appointmentTypeId": 96889121,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=96889121"
  },
  {
    "slug": "paint-pottery",
    "workshopName": "Paint Your Own Pottery",
    "appointmentTypeId": 79183668,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 39,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79183668"
  },
  {
    "slug": "mushroom-pottery",
    "workshopName": "Mushroom Pottery",
    "appointmentTypeId": 79188019,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per person",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79188019"
  },
  {
    "slug": "mushroom-pottery",
    "workshopName": "Mushroom Pottery",
    "appointmentTypeId": 90532757,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 35,
    "priceUnit": "per person",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=90532757"
  },
  {
    "slug": "matcha-bowl",
    "workshopName": "Matcha Bowl on the Wheel",
    "appointmentTypeId": 94782793,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=94782793"
  },
  {
    "slug": "matcha-bowl",
    "workshopName": "Beginner Wheel: Matcha Bowl",
    "appointmentTypeId": 89287658,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 25,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=89287658"
  },
  {
    "slug": "ghost",
    "workshopName": "Ghost Pottery",
    "appointmentTypeId": 98180179,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 20,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98180179"
  },
  {
    "slug": "oogie-boogie",
    "workshopName": "Oogie Boogie Candle Holder",
    "appointmentTypeId": 97524789,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=97524789"
  },
  {
    "slug": "oogie-boogie",
    "workshopName": "Oogie Boogie Candle Holder",
    "appointmentTypeId": 98908868,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 25,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98908868"
  },
  {
    "slug": "monster-lantern",
    "workshopName": "Monster Lantern Pottery",
    "appointmentTypeId": 97573448,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 50,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=97573448"
  },
  {
    "slug": "date-night-handbuilding",
    "workshopName": "Date Night Handbuilding",
    "appointmentTypeId": 94930972,
    "city": "chicago",
    "promoPrice": 55,
    "regularPrice": 75,
    "priceUnit": "for two",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=94930972"
  },
  {
    "slug": "handbuilt-vase",
    "workshopName": "Handbuilt Vase Making",
    "appointmentTypeId": 96491249,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 55,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=96491249"
  },
  {
    "slug": "duck-soap-holder",
    "workshopName": "Duck Soap Holder",
    "appointmentTypeId": 98334198,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 30,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98334198"
  },
  {
    "slug": "open-studio",
    "workshopName": "Open Studio Wheel Throwing",
    "appointmentTypeId": 95911163,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 25,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=95911163"
  },
  {
    "slug": "cup-creations",
    "workshopName": "Cup Creations on the Wheel",
    "appointmentTypeId": 94782668,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per person",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=94782668"
  },
  {
    "slug": "wheel-pumpkin",
    "workshopName": "Pumpkin on the Wheel",
    "appointmentTypeId": 98548612,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 60,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98548612"
  },
  {
    "slug": "ceramic-chess",
    "workshopName": "Date Night Ceramic Chess",
    "appointmentTypeId": 97861588,
    "city": "eugene",
    "promoPrice": 55,
    "regularPrice": 85,
    "priceUnit": "for two",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=97861588"
  },
  {
    "slug": "wheel-vase",
    "workshopName": "Vase Making on the Wheel",
    "appointmentTypeId": 94782880,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=94782880"
  },
  {
    "slug": "make-and-paint-wheel",
    "workshopName": "Make & Paint on the Wheel",
    "appointmentTypeId": 95806344,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 75,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=95806344"
  },
  {
    "slug": "flash-sale-wheel",
    "workshopName": "Flash Sale Beginner Wheel",
    "appointmentTypeId": 96113161,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 35,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=96113161"
  },
  {
    "slug": "acuity-79186489",
    "workshopName": "Ceramic Bunny Cup - Chicago",
    "appointmentTypeId": 79186489,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79186489"
  },
  {
    "slug": "beginner-wheel",
    "workshopName": "Wheel Throwing for Beginners -Make Your Own Plate Set",
    "appointmentTypeId": 94782610,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=94782610"
  },
  {
    "slug": "beginner-wheel",
    "workshopName": "Wheel Throwing for Beginners - Fat Belly Mugs",
    "appointmentTypeId": 96474464,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 55,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=96474464"
  },
  {
    "slug": "acuity-97799262",
    "workshopName": "Touch-n-Clay PlayDay",
    "appointmentTypeId": 97799262,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 55,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=97799262"
  },
  {
    "slug": "acuity-97904101",
    "workshopName": "Date Night Chix",
    "appointmentTypeId": 97904101,
    "city": "chicago",
    "promoPrice": 55,
    "regularPrice": 50,
    "priceUnit": "for two",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=97904101"
  },
  {
    "slug": "acuity-98139196",
    "workshopName": "Make a Jar! — Wheel Throwing + Lid Workshop.",
    "appointmentTypeId": 98139196,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 80,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98139196"
  },
  {
    "slug": "acuity-98323116",
    "workshopName": "MAKE YOUR PET  IN CLAY",
    "appointmentTypeId": 98323116,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98323116"
  },
  {
    "slug": "beginner-wheel",
    "workshopName": "Eugene Make Your Own Matcha Bowl",
    "appointmentTypeId": 91154739,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=91154739"
  },
  {
    "slug": "acuity-92719840",
    "workshopName": "Mothers Day Wheel Share",
    "appointmentTypeId": 92719840,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=92719840"
  },
  {
    "slug": "beginner-wheel",
    "workshopName": "Mothers Day Wheel Throwing for Beginners",
    "appointmentTypeId": 92719951,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 25,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=92719951"
  },
  {
    "slug": "acuity-92720069",
    "workshopName": "Eugene: Mothers Day Pottery Hand-building",
    "appointmentTypeId": 92720069,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 50,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=92720069"
  },
  {
    "slug": "unknown-acuity-79003968",
    "workshopName": "Private Appointment for One (Pottery Wheel)",
    "appointmentTypeId": 79003968,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 90,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79003968"
  },
  {
    "slug": "pipe-and-ashtray",
    "workshopName": "Pipe & Ashtray Making",
    "appointmentTypeId": 79188421,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 55,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79188421"
  },
  {
    "slug": "pipe-and-ashtray",
    "workshopName": "Pipe & Ashtray Making",
    "appointmentTypeId": 90211026,
    "city": "eugene",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=90211026"
  },
  {
    "slug": "boobs-mug",
    "workshopName": "Boobs Coffee Mug",
    "appointmentTypeId": 79187550,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79187550"
  },
  {
    "slug": "dildos-and-bottles",
    "workshopName": "Dildos Pottery",
    "appointmentTypeId": 79186927,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79186927"
  },
  {
    "slug": "pussy-pottery",
    "workshopName": "Pussy Pottery",
    "appointmentTypeId": 79188691,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 45,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=79188691"
  },
  {
    "slug": "acuity-96857633",
    "workshopName": "The Royal Mold Dildo Making Workshop",
    "appointmentTypeId": 96857633,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 35,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=96857633"
  },
  {
    "slug": "online-cauldron",
    "workshopName": "Live Online Cauldron Pottery",
    "appointmentTypeId": 98770334,
    "city": "chicago",
    "promoPrice": 25,
    "regularPrice": 29,
    "priceUnit": "per ticket",
    "bookingUrl": "https://colorcocktailfactory.as.me/?appointmentType=98770334"
  }
];

/**
 * Checks whether the promotional pricing test is currently active.
 */
export function isPromotionActive(timestamp: number = Date.now()): boolean {
  const start = Date.parse(PROMOTION_START_ISO);
  const end = Date.parse(PROMOTION_END_ISO);
  return timestamp >= start && timestamp <= end;
}

/**
 * Returns promotional pricing override for an Acuity appointment type ID,
 * if active during the promotional window.
 */
export function getPromotionalOverride(
  appointmentTypeId: number | string,
  timestamp: number = Date.now(),
): PromotionalWorkshop | null {
  if (!isPromotionActive(timestamp)) return null;
  const numId = Number(appointmentTypeId);
  return PROMOTIONAL_WORKSHOPS.find((p) => p.appointmentTypeId === numId) ?? null;
}

/**
 * Returns promotional pricing override for an activity slug and city.
 */
export function getPromotionalOverrideBySlug(
  slug: string,
  city?: string,
  timestamp: number = Date.now(),
): PromotionalWorkshop | null {
  if (!isPromotionActive(timestamp)) return null;
  return PROMOTIONAL_WORKSHOPS.find(
    (p) => p.slug === slug && (!city || p.city === city),
  ) ?? null;
}
