/**
 * Promotional Pricing Configuration
 *
 * Defines promotional test prices for October 23 - November 1, 2026.
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

// Promotional test window: October 23, 2026 to November 1, 2026 (Central Time)
export const PROMOTION_START_ISO = "2026-10-23T00:00:00-05:00";
export const PROMOTION_END_ISO = "2026-11-01T23:59:59-05:00";

export const PROMOTIONAL_WORKSHOPS: PromotionalWorkshop[] = [
  {
    slug: "wine-glass-painting",
    workshopName: "Wine Glass Painting",
    appointmentTypeId: 79374003,
    city: "chicago",
    promoPrice: 25,
    regularPrice: 40,
    priceUnit: "per person",
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=79374003",
  },
  {
    slug: "wine-glass-painting",
    workshopName: "Wine Glass Painting",
    appointmentTypeId: 95909935,
    city: "eugene",
    promoPrice: 25,
    regularPrice: 35,
    priceUnit: "per person",
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=95909935",
  },
  {
    slug: "mosaic",
    workshopName: "Mosaic Creations",
    appointmentTypeId: 79182319,
    city: "chicago",
    promoPrice: 25,
    regularPrice: 55,
    priceUnit: "per person",
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=79182319",
  },
  {
    slug: "cat-vase",
    workshopName: "Cat Vase — Flash Sale",
    appointmentTypeId: 79181599,
    city: "chicago",
    promoPrice: 25,
    regularPrice: 45,
    priceUnit: "per person",
    flashSale: true,
    flashSaleLabel: "Flash Sale — $25",
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=79181599",
  },
  {
    slug: "mushroom-pottery",
    workshopName: "Mushroom Bowl",
    appointmentTypeId: 79188019,
    city: "chicago",
    promoPrice: 35,
    regularPrice: 45,
    priceUnit: "per person",
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=79188019",
  },
  {
    slug: "mushroom-pottery",
    workshopName: "Mushroom Bowl",
    appointmentTypeId: 90532757,
    city: "eugene",
    promoPrice: 35,
    regularPrice: 35,
    priceUnit: "per person",
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=90532757",
  },
  {
    slug: "cup-creations",
    workshopName: "Cup Creations on the Wheel",
    appointmentTypeId: 94782668,
    city: "chicago",
    promoPrice: 35,
    regularPrice: 45,
    priceUnit: "per person",
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=94782668",
  },
  {
    slug: "cup-creations",
    workshopName: "Cup Creations on the Wheel",
    appointmentTypeId: 93539343,
    city: "eugene",
    promoPrice: 35,
    regularPrice: 25,
    priceUnit: "per person",
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=93539343",
  },
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
