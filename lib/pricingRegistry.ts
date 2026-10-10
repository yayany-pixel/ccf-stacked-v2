/**
 * Centralized Single Source of Truth for Activity Pricing & Ticket Units
 * Complies with Color Cocktail Factory Phase 2 requirements.
 */

export interface ActivityPricingItem {
  /** Unique activity identifier across CCF */
  activityId: string;
  /** Activity display name */
  name: string;
  /** City location */
  city: "chicago" | "eugene" | "online";
  /** Category taxonomy */
  category: string;
  /** Ticket type (e.g. Standard Workshop, Date Night Couples Ticket) */
  ticketType: string;
  /** Ticket unit strictly distinguished: per person, per couple, or per group */
  ticketUnit: "per person" | "for two" | "per couple" | "per group" | "per ticket";
  /** Regular studio price (non-promotional) */
  regularPrice: number;
  /** Current selling price */
  currentPrice: number;
  /** Verified promotional price if active */
  promotionalPrice: number | null;
  /** Promotion start ISO timestamp if active */
  promotionStart: string | null;
  /** Promotion end ISO timestamp if active */
  promotionEnd: string | null;
  /** Currency code */
  currency: "USD";
  /** Primary booking provider */
  bookingProvider: "acuity" | "eventbrite";
  /** Booking provider activity/appointment type ID */
  bookingProviderId: number | string;
  /** Authoritative booking destination URL */
  bookingUrl: string;
  /** Activity detail page URL */
  detailUrl: string;
  /** Availability state */
  availabilityStatus: "available" | "active" | "empty-window" | "limited";
  /** Timestamp when price was verified against booking provider */
  lastVerified: string;
  /** Human-readable price label */
  displayPrice: string;
}

export const CENTRALIZED_PRICING: Record<string, ActivityPricingItem> = {
  // --- Beginner Wheel Throwing ---
  "chicago-beginner-wheel": {
    activityId: "chicago-beginner-wheel",
    name: "Wheel Throwing for Beginners",
    city: "chicago",
    category: "mud-room",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 50,
    currentPrice: 25,
    promotionalPrice: 25,
    promotionStart: "2026-10-01T00:00:00-0500",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 79006616,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=79006616",
    detailUrl: "/activities/beginner-wheel",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "Starting at $25 per ticket",
  },
  "eugene-beginner-wheel": {
    activityId: "eugene-beginner-wheel",
    name: "Wheel Throwing for Beginners",
    city: "eugene",
    category: "mud-room",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 50,
    currentPrice: 25,
    promotionalPrice: 25,
    promotionStart: "2026-10-01T00:00:00-0700",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 93539343,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=93539343",
    detailUrl: "/activities/beginner-wheel",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "Starting at $25 per ticket",
  },

  // --- Cup Creations on the Wheel ---
  "chicago-cup-creations": {
    activityId: "chicago-cup-creations",
    name: "Cup Creations on the Wheel",
    city: "chicago",
    category: "mud-room",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 50,
    currentPrice: 25,
    promotionalPrice: 25,
    promotionStart: "2026-10-01T00:00:00-0500",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 94782668,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=94782668",
    detailUrl: "/activities/cup-creations",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "Starting at $25 per ticket",
  },
  "eugene-cup-creations": {
    activityId: "eugene-cup-creations",
    name: "Beginner Wheel: Cup Creations",
    city: "eugene",
    category: "mud-room",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 50,
    currentPrice: 25,
    promotionalPrice: 25,
    promotionStart: "2026-10-01T00:00:00-0700",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 93539343,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=93539343",
    detailUrl: "/activities/cup-creations",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "Starting at $25 per ticket",
  },

  // --- Date Night Pottery ---
  "chicago-date-night-wheel": {
    activityId: "chicago-date-night-wheel",
    name: "Date Night on the Pottery Wheel",
    city: "chicago",
    category: "mud-room",
    ticketType: "Couples Ticket (admits 2)",
    ticketUnit: "for two",
    regularPrice: 110,
    currentPrice: 55,
    promotionalPrice: 55,
    promotionStart: "2026-10-01T00:00:00-0500",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 79006071,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=79006071",
    detailUrl: "/activities/date-night-wheel",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$55 for two ($27.50/person)",
  },
  "eugene-date-night-wheel": {
    activityId: "eugene-date-night-wheel",
    name: "Date Night on the Pottery Wheel",
    city: "eugene",
    category: "mud-room",
    ticketType: "Couples Ticket (admits 2)",
    ticketUnit: "for two",
    regularPrice: 100,
    currentPrice: 50,
    promotionalPrice: 50,
    promotionStart: "2026-10-01T00:00:00-0700",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 91935746,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=91935746",
    detailUrl: "/activities/date-night-wheel",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$50 for two ($25/person)",
  },

  // --- Cauldron Pottery (Spin A Spell) ---
  "chicago-cauldron": {
    activityId: "chicago-cauldron",
    name: "Spin A Spell - Make your Own Clay Cauldron",
    city: "chicago",
    category: "mud-room",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 55,
    currentPrice: 45,
    promotionalPrice: 45,
    promotionStart: "2026-10-01T00:00:00-0500",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 95588506,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=95588506",
    detailUrl: "/activities/cauldron-pottery",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$45 per ticket",
  },
  "eugene-cauldron": {
    activityId: "eugene-cauldron",
    name: "Spin A Spell - Make your Own Clay Cauldron",
    city: "eugene",
    category: "mud-room",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 50,
    currentPrice: 45,
    promotionalPrice: 45,
    promotionStart: "2026-10-01T00:00:00-0700",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 96657402,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=96657402",
    detailUrl: "/activities/cauldron-pottery",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$45 per ticket",
  },

  // --- Turkish Mosaic Lamp ---
  "chicago-turkish-lamp": {
    activityId: "chicago-turkish-lamp",
    name: "Turkish Mosaic Lamp",
    city: "chicago",
    category: "glass-glow",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 70,
    currentPrice: 70,
    promotionalPrice: null,
    promotionStart: null,
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 95416771,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=95416771",
    detailUrl: "/activities/turkish-lamp",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$70 per ticket",
  },

  // --- Handbuilding Mug & Bowl ---
  "chicago-mug-and-bowl": {
    activityId: "chicago-mug-and-bowl",
    name: "Mug & Bowl Handbuilding",
    city: "chicago",
    category: "mud-room",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 55,
    currentPrice: 35,
    promotionalPrice: 35,
    promotionStart: "2026-10-01T00:00:00-0500",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 95793448,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=95793448",
    detailUrl: "/activities/mug-and-bowl",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$35 per ticket",
  },
  "eugene-mug-and-bowl": {
    activityId: "eugene-mug-and-bowl",
    name: "Mug & Bowl Handbuilding",
    city: "eugene",
    category: "mud-room",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 55,
    currentPrice: 35,
    promotionalPrice: 35,
    promotionStart: "2026-10-01T00:00:00-0700",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 90210214,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=90210214",
    detailUrl: "/activities/mug-and-bowl",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$35 per ticket",
  },

  // --- Mosaics ---
  "chicago-mosaic": {
    activityId: "chicago-mosaic",
    name: "Beginner Mosaic Workshop",
    city: "chicago",
    category: "crush-create",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 45,
    currentPrice: 30,
    promotionalPrice: 30,
    promotionStart: "2026-10-01T00:00:00-0500",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 97804473,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=97804473",
    detailUrl: "/activities/mosaic",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$30 per ticket",
  },

  // --- Duck Soap Holder (Eugene) ---
  "eugene-duck-soap-holder": {
    activityId: "eugene-duck-soap-holder",
    name: "Duck Soap Holder",
    city: "eugene",
    category: "mud-room",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 50,
    currentPrice: 30,
    promotionalPrice: 30,
    promotionStart: "2026-10-01T00:00:00-0700",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 98334198,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=98334198",
    detailUrl: "/activities/duck-soap-holder",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$30 per ticket",
  },

  // --- Terrarium Making ---
  "chicago-terrarium": {
    activityId: "chicago-terrarium",
    name: "Terrarium Making",
    city: "chicago",
    category: "roots-shoots",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 55,
    currentPrice: 35,
    promotionalPrice: 35,
    promotionStart: "2026-10-01T00:00:00-0500",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 97804568,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=97804568",
    detailUrl: "/activities/terrarium",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$35 per ticket",
  },

  // --- Candle Making ---
  "chicago-candle": {
    activityId: "chicago-candle",
    name: "Soy Candle Making Workshop",
    city: "chicago",
    category: "roots-shoots",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 55,
    currentPrice: 35,
    promotionalPrice: 35,
    promotionStart: "2026-10-01T00:00:00-0500",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 97804523,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=97804523",
    detailUrl: "/activities/candle-making",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$35 per ticket",
  },

  // --- Bonsai ---
  "chicago-bonsai": {
    activityId: "chicago-bonsai",
    name: "Bonsai Styling & Care",
    city: "chicago",
    category: "roots-shoots",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 110,
    currentPrice: 65,
    promotionalPrice: 65,
    promotionStart: "2026-10-01T00:00:00-0500",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 97804618,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=97804618",
    detailUrl: "/activities/bonsai",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$65 per ticket",
  },

  // --- Glass Fusion ---
  "chicago-glass-fusion": {
    activityId: "chicago-glass-fusion",
    name: "Glass Fusion Art",
    city: "chicago",
    category: "crush-create",
    ticketType: "Standard Admission",
    ticketUnit: "per ticket",
    regularPrice: 75,
    currentPrice: 50,
    promotionalPrice: 50,
    promotionStart: "2026-10-01T00:00:00-0500",
    promotionEnd: null,
    currency: "USD",
    bookingProvider: "acuity",
    bookingProviderId: 97804432,
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=97804432",
    detailUrl: "/activities/glass-fusion",
    availabilityStatus: "available",
    lastVerified: "2026-10-10",
    displayPrice: "$50 per ticket",
  },
};

/** Get verified pricing by activity ID or slug and city */
export function getVerifiedPricing(key: string): ActivityPricingItem | undefined {
  return CENTRALIZED_PRICING[key];
}

/** Format customer-facing price with ticket unit */
export function formatAuthoritativePrice(item: ActivityPricingItem): string {
  return item.displayPrice;
}
