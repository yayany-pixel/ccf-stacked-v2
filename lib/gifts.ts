import type { CityParam } from "@/lib/config";
import { PRICING } from "@/lib/constants";
import { STUDIO_LOCATIONS } from "@/lib/locations";

export const ACUITY_OWNER_ID = 35932879;
export const ACUITY_OWNER_KEY = "a8dfb300";
export const ACUITY_CATALOG_BASE_URL = `https://app.acuityscheduling.com/catalog.php?owner=${ACUITY_OWNER_ID}`;
export const ACUITY_GIFT_CARDS_CATALOG_URL = `${ACUITY_CATALOG_BASE_URL}&category=Gift+Cards`;

export function buildAcuityProductPurchaseUrl(productId: number): string {
  return `${ACUITY_CATALOG_BASE_URL}&action=addCart&clear=1&id=${productId}`;
}

export type GiftExperienceId =
  | "pottery-date-night-for-two"
  | "their-first-pottery-class"
  | "let-them-choose";

export type AcuityRawProduct = {
  id: number;
  name: string;
  description: string;
  price: string;
  type: "value" | "counts" | "minutes" | string;
  kind: "certificate" | "package" | "subscription" | string;
  hidden: boolean;
  expires: number | null;
  appointmentTypeIDs: number[];
  counts: number | null;
  minutes: number | null;
  value: number | null;
  group: string;
  isGiftCertificate: boolean;
};

/**
 * Verified active public Chicago appointment types included in the existing
 * Acuity Gift Card products (2119866, 2119869, 2119870, 2119872, 2119873).
 * Note: 79003717 and 79003968 are also in the raw Acuity array, but have
 * calendarIDs=[] and 0 scheduled sessions, so they are never advertised as
 * bookable public workshops.
 */
export const VERIFIED_CHICAGO_GIFT_WORKSHOPS: ReadonlyArray<{
  appointmentTypeId: number;
  acuityName: string;
  title: string;
  slug: string;
  price: number;
  priceUnit: "per person" | "for two";
  guestsCovered: 1 | 2;
  isPottery: boolean;
}> = [
  {
    appointmentTypeId: 79006071,
    acuityName: "Date Night on the Pottery Wheel - Chicago",
    title: "Date Night on the Wheel",
    slug: "date-night-wheel",
    price: 55,
    priceUnit: "for two",
    guestsCovered: 2,
    isPottery: true,
  },
  {
    appointmentTypeId: 79006616,
    acuityName: "Wheel Throwing for Beginners - Chicago",
    title: "Wheel Throwing for Beginners",
    slug: "beginner-wheel",
    price: 45,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: true,
  },
  {
    appointmentTypeId: 79186725,
    acuityName: "Ceramic Mug and a Bowl - Chicago",
    title: "Ceramic Mug & Bowl Handbuilding",
    slug: "mug-and-bowl",
    price: 55,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: true,
  },
  {
    appointmentTypeId: 79181599,
    acuityName: "Cat Vase Making - Chicago",
    title: "Cat Vase Making",
    slug: "cat-vase",
    price: 45,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: true,
  },
  {
    appointmentTypeId: 79183668,
    acuityName: "Paint Pottery - Chicago",
    title: "Paint Your Own Pottery",
    slug: "paint-pottery",
    price: 39,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: false,
  },
  {
    appointmentTypeId: 79186489,
    acuityName: "Ceramic Bunny Cup - Chicago",
    title: "Ceramic Bunny Cup",
    slug: "ceramic-bunny-cup",
    price: 45,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: true,
  },
  {
    appointmentTypeId: 79188019,
    acuityName: "Mushroom Pottery - Chicago",
    title: "Mushroom Pottery",
    slug: "mushroom-pottery",
    price: 45,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: true,
  },
  {
    appointmentTypeId: 79182319,
    acuityName: "Mosaic Creations - Chicago",
    title: "Mosaic Art Workshop",
    slug: "mosaic",
    price: 55,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: false,
  },
  {
    appointmentTypeId: 79183146,
    acuityName: "Glass Fusion - Chicago",
    title: "Glass Fusion",
    slug: "glass-fusion",
    price: 55,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: false,
  },
  {
    appointmentTypeId: 79374537,
    acuityName: "Hanging Turkish Mosaic Lamp - Chicago",
    title: "Hanging Turkish Mosaic Lamp",
    slug: "turkish-lamp",
    price: 45,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: false,
  },
  {
    appointmentTypeId: 79374003,
    acuityName: "Wine Glass Painting - Chicago",
    title: "Wine Glass Painting",
    slug: "wine-glass-painting",
    price: 40,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: false,
  },
  {
    appointmentTypeId: 79188910,
    acuityName: "Bonsai for Beginners: Hands-On Workshop - Chicago",
    title: "Bonsai for Beginners",
    slug: "bonsai",
    price: 85,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: false,
  },
  {
    appointmentTypeId: 79189013,
    acuityName: "Terrarium Workshop - Chicago",
    title: "Terrarium Workshop",
    slug: "terrarium",
    price: 45,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: false,
  },
  {
    appointmentTypeId: 79185767,
    acuityName: "Candle Making - Chicago",
    title: "Candle Making",
    slug: "candle-making",
    price: 45,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: false,
  },
  {
    appointmentTypeId: 79274876,
    acuityName: "Soap Making - Chicago",
    title: "Artisan Soap Making",
    slug: "soap-making",
    price: 45,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: false,
  },
  {
    appointmentTypeId: 79188421,
    acuityName: "Pipe and Ashtray Making Class - Chicago",
    title: "Pipe & Ashtray Pottery (18+)",
    slug: "pipe-and-ashtray",
    price: 55,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: true,
  },
  {
    appointmentTypeId: 79186927,
    acuityName: "Dildos and Bottles - Chicago",
    title: "Novelty Sculptural Pottery (18+)",
    slug: "dildos-and-bottles",
    price: 45,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: true,
  },
  {
    appointmentTypeId: 79187550,
    acuityName: "Boobs Coffee Mug - Chicago",
    title: "Body-Positive Mug Sculpting (18+)",
    slug: "boobs-mug",
    price: 45,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: true,
  },
  {
    appointmentTypeId: 79188691,
    acuityName: "Pussy Pottery - Chicago",
    title: "Anatomical Sculpting Workshop (18+)",
    slug: "pussy-pottery",
    price: 45,
    priceUnit: "per person",
    guestsCovered: 1,
    isPottery: true,
  },
];

export const CHICAGO_ELIGIBLE_GIFT_APPOINTMENT_TYPE_IDS = new Set<number>(
  VERIFIED_CHICAGO_GIFT_WORKSHOPS.map((w) => w.appointmentTypeId),
);

const EXISTING_GIFT_CARD_APPOINTMENT_TYPE_IDS = [
  79006616, 79006071, 79186725, 79188421, 79181599, 79183668, 79186489,
  79186927, 79187550, 79188019, 79188691, 79182319, 79183146, 79374537,
  79374003, 79188910, 79189013, 79185767, 79274876, 79003717, 79003968,
];

const EXISTING_GIFT_CARD_DESCRIPTION =
  "Give the gift of creativity at Color Cocktail Factory. This gift card can be used toward any CCF class, workshop, or experience. After purchase, you’ll receive a code by email—enter it at checkout to redeem. If your booking costs more than the gift card, you can pay the difference. If it costs less, the remaining balance stays on the code for next time. Link to redeem your gift certificate: https://colorcocktailfactory.as.me/";

/**
 * Snapshot of verified live Acuity Gift Certificate products from GET /api/v1/products.
 * Used as fallback if live Acuity API is unreachable at request time.
 */
export const VERIFIED_ACUITY_PRODUCTS: ReadonlyArray<AcuityRawProduct> = [
  {
    id: 2119866,
    name: "$50 Gift Card",
    description: EXISTING_GIFT_CARD_DESCRIPTION,
    price: "50.00",
    type: "value",
    kind: "certificate",
    hidden: false,
    expires: null,
    appointmentTypeIDs: EXISTING_GIFT_CARD_APPOINTMENT_TYPE_IDS,
    counts: null,
    minutes: null,
    value: 50,
    group: "Gift Cards",
    isGiftCertificate: true,
  },
  {
    id: 2119869,
    name: "$100 Gift Card",
    description: EXISTING_GIFT_CARD_DESCRIPTION,
    price: "100.00",
    type: "value",
    kind: "certificate",
    hidden: false,
    expires: null,
    appointmentTypeIDs: EXISTING_GIFT_CARD_APPOINTMENT_TYPE_IDS,
    counts: null,
    minutes: null,
    value: 100,
    group: "Gift Cards",
    isGiftCertificate: true,
  },
  {
    id: 2119870,
    name: "$150 Gift Card",
    description: EXISTING_GIFT_CARD_DESCRIPTION,
    price: "150.00",
    type: "value",
    kind: "certificate",
    hidden: false,
    expires: null,
    appointmentTypeIDs: EXISTING_GIFT_CARD_APPOINTMENT_TYPE_IDS,
    counts: null,
    minutes: null,
    value: 150,
    group: "Gift Cards",
    isGiftCertificate: true,
  },
  {
    id: 2119872,
    name: "$200 Gift Card",
    description: EXISTING_GIFT_CARD_DESCRIPTION,
    price: "200.00",
    type: "value",
    kind: "certificate",
    hidden: false,
    expires: null,
    appointmentTypeIDs: EXISTING_GIFT_CARD_APPOINTMENT_TYPE_IDS,
    counts: null,
    minutes: null,
    value: 200,
    group: "Gift Cards",
    isGiftCertificate: true,
  },
  {
    id: 2119873,
    name: "$250 Gift Card",
    description: EXISTING_GIFT_CARD_DESCRIPTION,
    price: "250.00",
    type: "value",
    kind: "certificate",
    hidden: false,
    expires: null,
    appointmentTypeIDs: EXISTING_GIFT_CARD_APPOINTMENT_TYPE_IDS,
    counts: null,
    minutes: null,
    value: 250,
    group: "Gift Cards",
    isGiftCertificate: true,
  },
];

export type GiftDenominationOption = {
  productId: number;
  amount: number;
  formattedPrice: string;
  name: string;
  purchaseUrl: string;
  coverageSummary: string;
  coversCompleteClass: boolean;
};

export type GiftExperienceCityOffering = {
  city: CityParam;
  studioLabel: string;
  studioAddress: string;
  price: number;
  formattedPrice: string;
  priceUnitLabel: string;
  guestsCovered: number;
  guestsCoveredLabel: string;
  eligibleAppointmentTypes: ReadonlyArray<{
    id: number;
    name: string;
    calendarId: number;
    price: number;
    unit: string;
  }>;
  photo: {
    path: string;
    width: number;
    height: number;
    alt: string;
    focalPosition: string;
  };
  included: ReadonlyArray<string>;
  finishingDisclosure: string;
  bookingModelNote: string;
  /**
   * "active" ONLY when a real Acuity product exists in GET /api/v1/products
   * that matches this exact offering and studio eligibility.
   * "pending_acuity_setup" when manual product creation in Acuity Admin is required.
   */
  status: "active" | "pending_acuity_setup";
  acuityProductId: number | null;
  purchaseUrl: string | null;
  pendingSetupReason: string | null;
  /**
   * For Chicago experience cards where a dedicated $55 or $45 experience certificate
   * is pending creation in Acuity Admin, we also surface the verified live Chicago
   * dollar-value certificate that covers that exact appointment type today.
   */
  verifiedDollarAlternative?: {
    productId: number;
    name: string;
    amount: number;
    purchaseUrl: string;
    remainingBalance: number;
    explanation: string;
  };
  denominations?: ReadonlyArray<GiftDenominationOption>;
};

export type GiftExperienceCardData = {
  id: GiftExperienceId;
  title: string;
  supportingCopy: string;
  buttonLabel: string;
  isExperienceCard: boolean;
  offerings: Record<CityParam, GiftExperienceCityOffering>;
};

export type ManualAcuityProductSpec = {
  key: string;
  city: CityParam;
  productName: string;
  categoryGroup: string;
  verifiedPrice: string;
  redemptionModel: string;
  redemptionValue: string;
  expiration: string;
  eligibleAppointmentTypes: ReadonlyArray<{
    id: number;
    name: string;
    calendarId: number;
    price: string;
  }>;
  imagePath: string;
  imageUrl: string;
  description: string;
  requiredPurchaseLinkPattern: string;
};

export const POTTERY_FINISHING_DISCLOSURE = "Finishing varies by workshop. Check the selected class description for included glazing, optional add-ons, and pickup timing. A gift card applies to eligible class bookings; confirm any finishing charges before purchasing.";

export const MANUAL_ACUITY_SETUP_SPECS: ReadonlyArray<ManualAcuityProductSpec> = [
  {
    key: "chicago-pottery-date-night-for-two",
    city: "chicago",
    productName: "Pottery Date Night for Two — Chicago",
    categoryGroup: "Gift Cards",
    verifiedPrice: "$55.00",
    redemptionModel:
      "Gift Certificate — Dollar Value ($55.00) or 1 Appointment Count (covers 1 booking slot = 2 guests sharing 1 wheel)",
    redemptionValue: "$55.00 (covers full $55.00 Date Night ticket for two)",
    expiration: "Never expires (null)",
    eligibleAppointmentTypes: [
      {
        id: 79006071,
        name: "Date Night on the Pottery Wheel - Chicago",
        calendarId: 12216179,
        price: "$55.00 (for 2 guests sharing 1 wheel)",
      },
    ],
    imagePath: "/images/classes/approved-07-Go6xn9-08daf172fdf1.webp",
    imageUrl:
      "https://colorcocktailfactory.com/images/classes/approved-07-Go6xn9-08daf172fdf1.webp",
    description:
      "Gift Certificate for Pottery Date Night for Two at Color Cocktail Factory Chicago (1142 W. 18th Street, Pilsen). Covers 1 Date Night reservation for two guests sharing one pottery wheel ($55.00 value), including 90 minutes of guided wheel throwing, clay, tools, aprons, and cleanup. Recipient chooses their preferred date at https://colorcocktailfactory.as.me/?appointmentType=79006071 and enters their 8-character code at checkout. Optional kiln firing and glazing are paid separately.",
    requiredPurchaseLinkPattern:
      "https://app.acuityscheduling.com/catalog.php?owner=35932879&action=addCart&clear=1&id=<NEW_PRODUCT_ID>",
  },
  {
    key: "chicago-their-first-pottery-class",
    city: "chicago",
    productName: "Their First Pottery Class — Chicago",
    categoryGroup: "Gift Cards",
    verifiedPrice: "$45.00",
    redemptionModel:
      "Gift Certificate — Dollar Value ($45.00) or 1 Appointment Count (covers 1 guest at an individual wheel)",
    redemptionValue: "$45.00 (covers full $45.00 Beginner Wheel ticket for one)",
    expiration: "Never expires (null)",
    eligibleAppointmentTypes: [
      {
        id: 79006616,
        name: "Wheel Throwing for Beginners - Chicago",
        calendarId: 12216179,
        price: "$45.00 (for 1 guest)",
      },
      {
        id: 94782668,
        name: "Wheel Throwing for Beginners -Cup Creations",
        calendarId: 12216179,
        price: "$45.00 (for 1 guest)",
      },
      {
        id: 94782793,
        name: "Wheel Throwing for Beginners -Make Your Own Matcha Bowl",
        calendarId: 12216179,
        price: "$45.00 (for 1 guest)",
      },
      {
        id: 94782610,
        name: "Wheel Throwing for Beginners -Make Your Own Plate Set",
        calendarId: 12216179,
        price: "$45.00 (for 1 guest)",
      },
      {
        id: 94782880,
        name: "Wheel Throwing for Beginners -Vase Making",
        calendarId: 12216179,
        price: "$45.00 (for 1 guest)",
      },
    ],
    imagePath:
      "/images/classes/wheel-throwing-for-beginners-color-cocktail-factory-acuity-600x600.jpg",
    imageUrl:
      "https://colorcocktailfactory.com/images/classes/wheel-throwing-for-beginners-color-cocktail-factory-acuity-600x600.jpg",
    description:
      "Gift Certificate for Their First Pottery Class at Color Cocktail Factory Chicago (1142 W. 18th Street, Pilsen). Covers 1 guest in Wheel Throwing for Beginners ($45.00 value), including 90 minutes of guided instruction at an individual pottery wheel, clay, tools, apron, and cleanup. Recipient chooses their preferred date at https://colorcocktailfactory.as.me/?appointmentType=79006616 and enters their 8-character code at checkout. Optional kiln firing and glazing are paid separately.",
    requiredPurchaseLinkPattern:
      "https://app.acuityscheduling.com/catalog.php?owner=35932879&action=addCart&clear=1&id=<NEW_PRODUCT_ID>",
  },
  {
    key: "eugene-pottery-date-night-for-two",
    city: "eugene",
    productName: "Pottery Date Night for Two — Eugene",
    categoryGroup: "Gift Cards",
    verifiedPrice: "$50.00",
    redemptionModel:
      "Gift Certificate — Dollar Value ($50.00) or 1 Appointment Count (covers 1 booking slot = 2 guests sharing 1 wheel)",
    redemptionValue: "$50.00 (covers full $50.00 Eugene Date Night ticket for two)",
    expiration: "Never expires (null)",
    eligibleAppointmentTypes: [
      {
        id: 91935746,
        name: "Eugene Date Night On The Wheel",
        calendarId: 13582962,
        price: "$50.00 (for 2 guests sharing 1 wheel)",
      },
    ],
    imagePath: "/images/classes/approved-17-h_HdFG-66253a9801df.webp",
    imageUrl:
      "https://colorcocktailfactory.com/images/classes/approved-17-h_HdFG-66253a9801df.webp",
    description:
      "Gift Certificate for Pottery Date Night for Two at Color Cocktail Factory Eugene (3295 Cross Street, Eugene, OR 97402). Covers 1 Date Night reservation for two guests sharing one pottery wheel ($50.00 value), including 90 minutes of guided wheel throwing, clay, tools, and cleanup. Recipient chooses their preferred date at https://colorcocktailfactory.as.me/?appointmentType=91935746 and enters their 8-character code at checkout. Optional kiln firing and glazing are paid separately.",
    requiredPurchaseLinkPattern:
      "https://app.acuityscheduling.com/catalog.php?owner=35932879&action=addCart&clear=1&id=<NEW_PRODUCT_ID>",
  },
  {
    key: "eugene-their-first-pottery-class",
    city: "eugene",
    productName: "Their First Pottery Class — Eugene",
    categoryGroup: "Gift Cards",
    verifiedPrice: "$25.00",
    redemptionModel:
      "Gift Certificate — Dollar Value ($25.00) or 1 Appointment Count (covers 1 guest at an individual wheel)",
    redemptionValue: "$25.00 (covers full $25.00 Eugene Beginner Wheel ticket for one)",
    expiration: "Never expires (null)",
    eligibleAppointmentTypes: [
      {
        id: 93539343,
        name: "Eugene Wheel Throwing for Beginners: Cup creations",
        calendarId: 13582962,
        price: "$25.00 (for 1 guest)",
      },
      {
        id: 89287658,
        name: "Eugene Wheel Throwing for Beginners: Matcha Bowl",
        calendarId: 13582962,
        price: "$25.00 (for 1 guest)",
      },
    ],
    imagePath: "/images/classes/approved-21-e-GdkT-20ed285cc994.webp",
    imageUrl:
      "https://colorcocktailfactory.com/images/classes/approved-21-e-GdkT-20ed285cc994.webp",
    description:
      "Gift Certificate for Their First Pottery Class at Color Cocktail Factory Eugene (3295 Cross Street, Eugene, OR 97402). Covers 1 guest in Eugene Wheel Throwing for Beginners: Cup Creations or Matcha Bowl ($25.00 value), including 90 minutes of guided instruction at an individual pottery wheel, clay, tools, and cleanup. Recipient chooses their preferred date at https://colorcocktailfactory.as.me/?appointmentType=93539343 and enters their 8-character code at checkout. Optional kiln firing and glazing are paid separately.",
    requiredPurchaseLinkPattern:
      "https://app.acuityscheduling.com/catalog.php?owner=35932879&action=addCart&clear=1&id=<NEW_PRODUCT_ID>",
  },
  {
    key: "eugene-let-them-choose",
    city: "eugene",
    productName:
      "Eugene Dollar-Value Gift Cards ($25, $50, $75, $100, $150) — or add Eugene appointment types to existing $50–$250 Gift Cards",
    categoryGroup: "Gift Cards",
    verifiedPrice: "$25.00 / $50.00 / $75.00 / $100.00 / $150.00",
    redemptionModel:
      "Gift Certificate — Dollar Value (retains unused balance on code; recipient pays difference if workshop exceeds balance)",
    redemptionValue: "Face value ($25 / $50 / $75 / $100 / $150)",
    expiration: "Never expires (null)",
    eligibleAppointmentTypes: [
      {
        id: 91935746,
        name: "Eugene Date Night On The Wheel",
        calendarId: 13582962,
        price: "$50.00 (for 2 guests)",
      },
      {
        id: 93539343,
        name: "Eugene Wheel Throwing for Beginners: Cup creations",
        calendarId: 13582962,
        price: "$25.00 (per person)",
      },
      {
        id: 89287658,
        name: "Eugene Wheel Throwing for Beginners: Matcha Bowl",
        calendarId: 13582962,
        price: "$25.00 (per person)",
      },
      {
        id: 90210750,
        name: "Eugene: Ceramic Mug and a Bowl",
        calendarId: 13582962,
        price: "$45.00 (per person)",
      },
      {
        id: 96657402,
        name: "Spin A Spell- Make your Own Clay Cauldron",
        calendarId: 13582962,
        price: "$45.00 (per person)",
      },
      {
        id: 95909935,
        name: "Wine Glass Painting",
        calendarId: 13582962,
        price: "$35.00 (per person)",
      },
      {
        id: 98845998,
        name: "Eugene : Make Your Own Charcuterie Board",
        calendarId: 13582962,
        price: "$55.00 (per person)",
      },
      {
        id: 90532757,
        name: "Eugene Mushroom Pottery",
        calendarId: 13582962,
        price: "$35.00 (per person)",
      },
      {
        id: 90211026,
        name: "Eugene Pipe and Ashtray Making Class",
        calendarId: 13582962,
        price: "$45.00 (per person, 18+)",
      },
      {
        id: 94932997,
        name: "Date Night Watercolor Painting for Two - Eugene",
        calendarId: 13582962,
        price: "$75.00 (for 2 guests)",
      },
      {
        id: 97861588,
        name: "Date Night: Make Your Own Ceramic Chess Set",
        calendarId: 13582962,
        price: "$85.00 (for 2 guests)",
      },
      {
        id: 89290193,
        name: "Eugene Date Night Terrarium Workshop",
        calendarId: 13582962,
        price: "$50.00 (per ticket)",
      },
      {
        id: 94058109,
        name: "VIP Date Night Paint Night",
        calendarId: 13582962,
        price: "$100.00 (for 2 guests)",
      },
      {
        id: 94058299,
        name: "Date Night Bonsai VIP",
        calendarId: 13582962,
        price: "$120.00 (for 2 guests)",
      },
    ],
    imagePath: "/images/classes/approved-23-oFSphW-833640afcace.webp",
    imageUrl:
      "https://colorcocktailfactory.com/images/classes/approved-23-oFSphW-833640afcace.webp",
    description:
      "Flexible dollar-value gift certificate redeemable toward active Color Cocktail Factory Eugene workshops (3295 Cross Street, Eugene, OR 97402). Unused balance stays on the certificate code; if a workshop exceeds the certificate balance, the recipient can pay the difference at checkout.",
    requiredPurchaseLinkPattern:
      "https://app.acuityscheduling.com/catalog.php?owner=35932879&action=addCart&clear=1&id=<NEW_PRODUCT_ID>",
  },
];

function buildChicagoDenominationCoverage(amount: number): {
  coverageSummary: string;
  coversCompleteClass: boolean;
} {
  switch (amount) {
    case 50:
      return {
        coverageSummary:
          "Covers 1 guest in any $39–$45 Chicago workshop (including Wheel Throwing for Beginners at $45, Paint Pottery at $39, Wine Glass Painting at $40, Candle Making, Terrarium, Soap Making, Cat Vase, or Hanging Turkish Lamp at $45) with $5–$11 remaining balance. Does not cover a $55 workshop (such as Date Night for Two, Mug & Bowl, Mosaic, or Glass Fusion) or $85 Bonsai without paying the difference at checkout.",
        coversCompleteClass: true,
      };
    case 100:
      return {
        coverageSummary:
          "Covers Pottery Date Night for Two in Chicago ($55 for two, leaving $45 credit), two $45 per-person Chicago workshops ($90 total, leaving $10 credit), or one $85 Bonsai workshop (leaving $15 credit).",
        coversCompleteClass: true,
      };
    case 150:
      return {
        coverageSummary:
          "Covers two $55 Chicago workshops plus a $39–$40 session, or three $45 per-person Chicago workshops ($135 total, leaving $15 credit).",
        coversCompleteClass: true,
      };
    case 200:
      return {
        coverageSummary:
          "Covers up to four $45–$50 Chicago workshop spots or multiple Date Night and handbuilding sessions for a pair.",
        coversCompleteClass: true,
      };
    case 250:
      return {
        coverageSummary:
          "Covers a full creative series or small-group outing across five $45–$50 Chicago workshop spots.",
        coversCompleteClass: true,
      };
    default:
      return {
        coverageSummary:
          amount >= 45
            ? `Applies $${amount} toward eligible Chicago workshops ($39–$85). Unused balance stays on the code; if a booking costs more, the recipient pays the difference at checkout.`
            : `Applies $${amount} toward eligible Chicago workshops ($39–$85). A balance under $39 requires paying the remaining difference at checkout.`,
        coversCompleteClass: amount >= 39,
      };
  }
}

/**
 * Fetches active products from Acuity Scheduling API (GET /api/v1/products).
 * Falls back to VERIFIED_ACUITY_PRODUCTS if credentials are missing or the network call fails.
 */
export async function fetchLiveAcuityProducts(): Promise<AcuityRawProduct[]> {
  const userId = process.env.ACUITY_USER_ID;
  const apiKey = process.env.ACUITY_API_KEY;
  if (!userId || !apiKey) {
    return [...VERIFIED_ACUITY_PRODUCTS];
  }
  try {
    const auth =
      "Basic " + Buffer.from(`${userId}:${apiKey}`).toString("base64");
    const res = await fetch("https://acuityscheduling.com/api/v1/products", {
      headers: { Authorization: auth, Accept: "application/json" },
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [...VERIFIED_ACUITY_PRODUCTS];
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return [...VERIFIED_ACUITY_PRODUCTS];
    }
    return data as AcuityRawProduct[];
  } catch {
    return [...VERIFIED_ACUITY_PRODUCTS];
  }
}

/**
 * Resolves the 3 experience-first gift cards and their studio-specific offerings
 * against the active Acuity product catalog.
 *
 * - Never displays a working primary purchase button for an experience or studio
 *   certificate that does not yet exist in Acuity.
 * - Immediately activates the direct Acuity checkout button if the corresponding
 *   product exists in the live Acuity catalog.
 */
export function resolveGiftExperiences(
  rawProducts: ReadonlyArray<AcuityRawProduct> = VERIFIED_ACUITY_PRODUCTS,
): GiftExperienceCardData[] {
  const activeCerts = rawProducts.filter(
    (p) => !p.hidden && (p.isGiftCertificate || p.kind === "certificate"),
  );

  // Detect dedicated experience certificates if created in Acuity
  const chicagoDateNightCert = activeCerts.find(
    (p) =>
      Array.isArray(p.appointmentTypeIDs) &&
      p.appointmentTypeIDs.includes(79006071) &&
      ((Number(p.price) === 55 &&
        (p.value === 55 || p.counts === 1 || p.appointmentTypeIDs.length <= 3)) ||
        (/date night/i.test(p.name) && !/eugene/i.test(p.name))),
  );

  const eugeneDateNightCert = activeCerts.find(
    (p) =>
      Array.isArray(p.appointmentTypeIDs) &&
      p.appointmentTypeIDs.includes(91935746) &&
      ((Number(p.price) === 50 &&
        (p.value === 50 || p.counts === 1 || p.appointmentTypeIDs.length <= 3)) ||
        (/date night/i.test(p.name) && /eugene/i.test(p.name))),
  );

  const chicagoBeginnerCert = activeCerts.find(
    (p) =>
      Array.isArray(p.appointmentTypeIDs) &&
      p.appointmentTypeIDs.includes(79006616) &&
      ((Number(p.price) === 45 &&
        (p.value === 45 || p.counts === 1 || p.appointmentTypeIDs.length <= 6)) ||
        (/first pottery|beginner.*wheel/i.test(p.name) &&
          !/eugene/i.test(p.name))),
  );

  const eugeneBeginnerCert = activeCerts.find(
    (p) =>
      Array.isArray(p.appointmentTypeIDs) &&
      (p.appointmentTypeIDs.includes(93539343) ||
        p.appointmentTypeIDs.includes(89287658)) &&
      ((Number(p.price) === 25 &&
        (p.value === 25 || p.counts === 1 || p.appointmentTypeIDs.length <= 4)) ||
        (/first pottery|beginner.*wheel/i.test(p.name) &&
          /eugene/i.test(p.name))),
  );

  // Value-based gift certificates for Chicago vs Eugene
  const chicagoValueCerts = activeCerts
    .filter(
      (p) =>
        p.type === "value" &&
        Array.isArray(p.appointmentTypeIDs) &&
        p.appointmentTypeIDs.includes(79006616) &&
        p.appointmentTypeIDs.includes(79006071) &&
        !/date night|first pottery/i.test(p.name),
    )
    .sort((a, b) => Number(a.price) - Number(b.price));

  const eugeneValueCerts = activeCerts
    .filter(
      (p) =>
        p.type === "value" &&
        Array.isArray(p.appointmentTypeIDs) &&
        (p.appointmentTypeIDs.includes(91935746) ||
          p.appointmentTypeIDs.includes(93539343) ||
          p.appointmentTypeIDs.includes(89287658) ||
          p.appointmentTypeIDs.includes(90210750)) &&
        !/date night|first pottery/i.test(p.name),
    )
    .sort((a, b) => Number(a.price) - Number(b.price));

  const chicagoDenominations: GiftDenominationOption[] = chicagoValueCerts.map(
    (p) => {
      const amount = Math.round(Number(p.price));
      const cov = buildChicagoDenominationCoverage(amount);
      return {
        productId: p.id,
        amount,
        formattedPrice: `$${amount}`,
        name: p.name,
        purchaseUrl: buildAcuityProductPurchaseUrl(p.id),
        coverageSummary: cov.coverageSummary,
        coversCompleteClass: cov.coversCompleteClass,
      };
    },
  );

  const eugeneDenominations: GiftDenominationOption[] = eugeneValueCerts.map(
    (p) => {
      const amount = Math.round(Number(p.price));
      return {
        productId: p.id,
        amount,
        formattedPrice: `$${amount}`,
        name: p.name,
        purchaseUrl: buildAcuityProductPurchaseUrl(p.id),
        coverageSummary:
          amount >= 50
            ? `Covers Eugene Date Night on the Wheel ($50 for two) or two $25 Eugene Beginner Wheel classes.`
            : `Covers one $25 Eugene Beginner Wheel class (Cup Creations or Matcha Bowl).`,
        coversCompleteClass: amount >= 25,
      };
    },
  );

  const chicago100Cert = chicagoDenominations.find((d) => d.amount === 100);
  const chicago50Cert = chicagoDenominations.find((d) => d.amount === 50);

  return [
    {
      id: "pottery-date-night-for-two",
      title: "Pottery Date Night for Two",
      supportingCopy:
        "Give your favorite couple a little clay, a little laughter, and time together.",
      buttonLabel: "Gift a Date Night",
      isExperienceCard: true,
      offerings: {
        chicago: {
          city: "chicago",
          studioLabel: "Chicago — Pilsen",
          studioAddress: STUDIO_LOCATIONS.chicago.address,
          price: 55,
          formattedPrice: "$55",
          priceUnitLabel: "for two guests (shared wheel)",
          guestsCovered: 2,
          guestsCoveredLabel: "2 guests sharing 1 wheel",
          eligibleAppointmentTypes: [
            {
              id: 79006071,
              name: "Date Night on the Pottery Wheel - Chicago",
              calendarId: 12216179,
              price: 55,
              unit: "for two",
            },
          ],
          photo: {
            path: "/images/classes/approved-07-Go6xn9-08daf172fdf1.webp",
            width: 680,
            height: 510,
            alt: "A couple working together on clay at a pottery wheel",
            focalPosition: "48% 55%",
          },
          included: [
            "90-minute guided pottery wheel session for 2 guests sharing 1 wheel",
            "All clay, pottery tools, studio aprons, and cleanup included",
            "1 booking reservation covers both guests (recipient books 1 slot, not quantity 2)",
            "BYOB friendly for guests 21+ with valid ID",
            "Recipient chooses any available Chicago Date Night date when redeeming",
          ],
          finishingDisclosure: POTTERY_FINISHING_DISCLOSURE,
          bookingModelNote:
            "In Acuity, each Date Night on the Pottery Wheel - Chicago (ID 79006071) booking slot already includes two seats sharing one wheel ($55 total for the couple).",
          status: chicagoDateNightCert ? "active" : "pending_acuity_setup",
          acuityProductId: chicagoDateNightCert?.id ?? null,
          purchaseUrl: chicagoDateNightCert
            ? buildAcuityProductPurchaseUrl(chicagoDateNightCert.id)
            : null,
          pendingSetupReason: chicagoDateNightCert
            ? null
            : "Unfinished Acuity Setup: A dedicated $55 'Pottery Date Night for Two — Chicago' gift certificate product has not yet been created in Acuity Admin (Acuity's REST API only exposes read-only GET /products). Purchase button is disabled until the $55 certificate product exists in Acuity.",
          verifiedDollarAlternative: chicago100Cert
            ? {
                productId: chicago100Cert.productId,
                name: chicago100Cert.name,
                amount: chicago100Cert.amount,
                purchaseUrl: chicago100Cert.purchaseUrl,
                remainingBalance: 45,
                explanation:
                  "Active today in Acuity: Our $100 Chicago Gift Card (#2119869) is verified redeemable for Date Night on the Pottery Wheel - Chicago ($55 for two) and leaves $45 in studio credit on the code for a future workshop or second visit.",
              }
            : undefined,
        },
        eugene: {
          city: "eugene",
          studioLabel: "Eugene, OR",
          studioAddress: STUDIO_LOCATIONS.eugene.address,
          price: 50,
          formattedPrice: "$50",
          priceUnitLabel: "for two guests (shared wheel)",
          guestsCovered: 2,
          guestsCoveredLabel: "2 guests sharing 1 wheel",
          eligibleAppointmentTypes: [
            {
              id: 91935746,
              name: "Eugene Date Night On The Wheel",
              calendarId: 13582962,
              price: 50,
              unit: "for two",
            },
          ],
          photo: {
            path: "/images/classes/approved-17-h_HdFG-66253a9801df.webp",
            width: 1200,
            height: 900,
            alt: "Two guests shaping clay together at a pottery wheel",
            focalPosition: "50% 58%",
          },
          included: [
            "90-minute guided pottery wheel session for 2 guests sharing 1 wheel",
            "All clay, pottery tools, and studio cleanup included",
            "1 booking reservation covers both guests ('One ticket per couple. Will share a wheel')",
            "Recipient chooses any available Eugene Date Night date when redeeming",
          ],
          finishingDisclosure: POTTERY_FINISHING_DISCLOSURE,
          bookingModelNote:
            "In Acuity, each Eugene Date Night On The Wheel (ID 91935746) booking slot covers two guests sharing one wheel ($50 total for the couple).",
          status: eugeneDateNightCert ? "active" : "pending_acuity_setup",
          acuityProductId: eugeneDateNightCert?.id ?? null,
          purchaseUrl: eugeneDateNightCert
            ? buildAcuityProductPurchaseUrl(eugeneDateNightCert.id)
            : null,
          pendingSetupReason: eugeneDateNightCert
            ? null
            : "Unfinished Acuity Setup: No active Acuity gift certificate currently includes Eugene Date Night On The Wheel (ID 91935746) in its eligible appointment types. Purchase button is disabled until the $50 Eugene Date Night certificate is created in Acuity Admin.",
        },
      },
    },
    {
      id: "their-first-pottery-class",
      title: "Their First Pottery Class",
      supportingCopy:
        "For the person who keeps saying, ‘I’ve always wanted to try that.’",
      buttonLabel: "Gift Their First Spin",
      isExperienceCard: true,
      offerings: {
        chicago: {
          city: "chicago",
          studioLabel: "Chicago — Pilsen",
          studioAddress: STUDIO_LOCATIONS.chicago.address,
          price: 45,
          formattedPrice: "$45",
          priceUnitLabel: "for 1 guest (individual wheel)",
          guestsCovered: 1,
          guestsCoveredLabel: "1 guest (individual wheel)",
          eligibleAppointmentTypes: [
            {
              id: 79006616,
              name: "Wheel Throwing for Beginners - Chicago",
              calendarId: 12216179,
              price: 45,
              unit: "per person",
            },
          ],
          photo: {
            path: "/images/classes/wheel-throwing-for-beginners-color-cocktail-factory-acuity-600x600.jpg",
            width: 600,
            height: 600,
            alt: "Students shaping clay on pottery wheels during a beginner workshop",
            focalPosition: "50% 50%",
          },
          included: [
            "90-minute beginner wheel-throwing workshop for 1 guest at an individual wheel",
            "Step-by-step artist instruction on wedging, centering, and shaping a small vessel",
            "All clay, pottery tools, studio apron, and cleanup included",
            "Supportive first-timer experience focused on trying the wheel (finished pieces are not guaranteed; unfired greenware can go home same day)",
            "Recipient chooses any available Chicago Beginner Wheel date when redeeming",
          ],
          finishingDisclosure: POTTERY_FINISHING_DISCLOSURE,
          bookingModelNote:
            "Redeemable for 1 guest in Wheel Throwing for Beginners - Chicago (ID 79006616, $45.00 on Chicago Calendar 12216179).",
          status: chicagoBeginnerCert ? "active" : "pending_acuity_setup",
          acuityProductId: chicagoBeginnerCert?.id ?? null,
          purchaseUrl: chicagoBeginnerCert
            ? buildAcuityProductPurchaseUrl(chicagoBeginnerCert.id)
            : null,
          pendingSetupReason: chicagoBeginnerCert
            ? null
            : "Unfinished Acuity Setup: A dedicated $45 'Their First Pottery Class — Chicago' gift certificate product has not yet been created in Acuity Admin (Acuity's REST API only exposes read-only GET /products). Purchase button is disabled until the $45 certificate product exists in Acuity.",
          verifiedDollarAlternative: chicago50Cert
            ? {
                productId: chicago50Cert.productId,
                name: chicago50Cert.name,
                amount: chicago50Cert.amount,
                purchaseUrl: chicago50Cert.purchaseUrl,
                remainingBalance: 5,
                explanation:
                  "Active today in Acuity: Our $50 Chicago Gift Card (#2119866) is verified redeemable for Wheel Throwing for Beginners - Chicago ($45 per person) and leaves $5 in studio credit on the code.",
              }
            : undefined,
        },
        eugene: {
          city: "eugene",
          studioLabel: "Eugene, OR",
          studioAddress: STUDIO_LOCATIONS.eugene.address,
          price: 25,
          formattedPrice: "$25",
          priceUnitLabel: "for 1 guest (individual wheel)",
          guestsCovered: 1,
          guestsCoveredLabel: "1 guest (individual wheel)",
          eligibleAppointmentTypes: [
            {
              id: 93539343,
              name: "Eugene Wheel Throwing for Beginners: Cup creations",
              calendarId: 13582962,
              price: 25,
              unit: "per person",
            },
            {
              id: 89287658,
              name: "Eugene Wheel Throwing for Beginners: Matcha Bowl",
              calendarId: 13582962,
              price: 25,
              unit: "per person",
            },
          ],
          photo: {
            path: "/images/classes/approved-21-e-GdkT-20ed285cc994.webp",
            width: 1200,
            height: 900,
            alt: "A smiling workshop guest holding a freshly made clay cup",
            focalPosition: "50% 42%",
          },
          included: [
            "90-minute beginner wheel-throwing workshop for 1 guest (Cup Creations or Matcha Bowl)",
            "Individual pottery wheel, clay, tools, guided instruction, and cleanup",
            "Supportive first-timer experience focused on centering and shaping clay",
            "Recipient chooses any available Eugene Beginner Wheel date when redeeming",
          ],
          finishingDisclosure: POTTERY_FINISHING_DISCLOSURE,
          bookingModelNote:
            "Covers 1 guest in Eugene Wheel Throwing for Beginners: Cup creations (ID 93539343, $25.00) or Matcha Bowl (ID 89287658, $25.00) on Eugene Calendar 13582962.",
          status: eugeneBeginnerCert ? "active" : "pending_acuity_setup",
          acuityProductId: eugeneBeginnerCert?.id ?? null,
          purchaseUrl: eugeneBeginnerCert
            ? buildAcuityProductPurchaseUrl(eugeneBeginnerCert.id)
            : null,
          pendingSetupReason: eugeneBeginnerCert
            ? null
            : "Unfinished Acuity Setup: No active Acuity gift certificate currently includes Eugene Beginner Wheel (IDs 93539343 & 89287658) in its eligible appointment types. Purchase button is disabled until the $25 Eugene Beginner Pottery certificate is created in Acuity Admin.",
        },
      },
    },
    {
      id: "let-them-choose",
      title: "Let Them Choose",
      supportingCopy:
        "Know they’ll love making something, but unsure what? Give them the choice.",
      buttonLabel: "Choose a Gift Amount",
      isExperienceCard: false,
      offerings: {
        chicago: {
          city: "chicago",
          studioLabel: "Chicago — Pilsen",
          studioAddress: STUDIO_LOCATIONS.chicago.address,
          price: chicagoDenominations[0]?.amount ?? 50,
          formattedPrice:
            chicagoDenominations.length > 0
              ? `$${chicagoDenominations[0].amount}–$${chicagoDenominations[chicagoDenominations.length - 1].amount}`
              : "$50–$250",
          priceUnitLabel: "flexible studio credit ($50, $100, $150, $200, $250)",
          guestsCovered: 1,
          guestsCoveredLabel:
            "1, 2, or more guests depending on chosen denomination & workshop price ($39–$85)",
          eligibleAppointmentTypes: VERIFIED_CHICAGO_GIFT_WORKSHOPS.map(
            (w) => ({
              id: w.appointmentTypeId,
              name: w.acuityName,
              calendarId: 12216179,
              price: w.price,
              unit: w.priceUnit,
            }),
          ),
          photo: {
            path: "/images/classes/approved-42-9vzaFl-cda788618ed1.webp",
            width: 1200,
            height: 900,
            alt: "Two workshop guests with colorful mosaic lamps",
            focalPosition: "50% 50%",
          },
          included: [
            "Dollar-value certificate ($50, $100, $150, $200, or $250) redeemable across 19 verified Chicago workshops",
            "Monetary credit vs. complete class: $50 covers one $39–$45 class ($5–$11 left over), while $55 classes (Date Night for Two, Mug & Bowl, Mosaic, Glass Fusion) or $85 Bonsai require either a $100+ card or paying the $5–$35 difference at checkout",
            "Unused balance stays on the 8-character code for a future booking; never expires",
            "Note: Acuity checkout supports fixed denominations ($50–$250) rather than custom arbitrary dollar entries",
          ],
          finishingDisclosure:
            "For glass, mosaic, bonsai, terrarium, candle, and soap workshops, all take-home materials are included in the class price. For pottery workshops, kiln firing and glazing are optional and paid separately ($10 bisque, $20 solid glaze, $35 specialty glaze, $50 gold glaze per piece in studio, or $25/piece via Acuity checkout add-on).",
          bookingModelNote:
            "Verified active in Acuity: Product IDs 2119866 ($50), 2119869 ($100), 2119870 ($150), 2119872 ($200), and 2119873 ($250).",
          status:
            chicagoDenominations.length > 0 ? "active" : "pending_acuity_setup",
          acuityProductId: chicagoDenominations[0]?.productId ?? 2119866,
          purchaseUrl:
            chicagoDenominations[0]?.purchaseUrl ??
            buildAcuityProductPurchaseUrl(2119866),
          pendingSetupReason: null,
          denominations: chicagoDenominations,
        },
        eugene: {
          city: "eugene",
          studioLabel: "Eugene, OR",
          studioAddress: STUDIO_LOCATIONS.eugene.address,
          price: eugeneDenominations[0]?.amount ?? 25,
          formattedPrice:
            eugeneDenominations.length > 0
              ? `$${eugeneDenominations[0].amount}–$${eugeneDenominations[eugeneDenominations.length - 1].amount}`
              : "$25–$150",
          priceUnitLabel: "flexible Eugene studio credit",
          guestsCovered: 1,
          guestsCoveredLabel:
            "1 or 2+ guests depending on denomination (Eugene classes range from $25 to $120)",
          eligibleAppointmentTypes: [
            {
              id: 91935746,
              name: "Eugene Date Night On The Wheel",
              calendarId: 13582962,
              price: 50,
              unit: "for two",
            },
            {
              id: 93539343,
              name: "Eugene Wheel Throwing for Beginners: Cup creations",
              calendarId: 13582962,
              price: 25,
              unit: "per person",
            },
            {
              id: 89287658,
              name: "Eugene Wheel Throwing for Beginners: Matcha Bowl",
              calendarId: 13582962,
              price: 25,
              unit: "per person",
            },
            {
              id: 90210750,
              name: "Eugene: Ceramic Mug and a Bowl",
              calendarId: 13582962,
              price: 45,
              unit: "per person",
            },
            {
              id: 96657402,
              name: "Spin A Spell- Make your Own Clay Cauldron",
              calendarId: 13582962,
              price: 45,
              unit: "per person",
            },
            {
              id: 95909935,
              name: "Wine Glass Painting",
              calendarId: 13582962,
              price: 35,
              unit: "per person",
            },
            {
              id: 98845998,
              name: "Eugene : Make Your Own Charcuterie Board",
              calendarId: 13582962,
              price: 55,
              unit: "per person",
            },
          ],
          photo: {
            path: "/images/classes/approved-23-oFSphW-833640afcace.webp",
            width: 1084,
            height: 813,
            alt: "A participant handbuilding pottery at a clay-covered studio table",
            focalPosition: "60% 50%",
          },
          included: [
            "Flexible dollar credit toward Eugene pottery, handbuilding, painting, and wood workshops ($25–$120)",
            "Monetary credit vs. complete class: $25 covers one Eugene Beginner Wheel class; $50 covers Eugene Date Night for Two ($50) or one $45 handbuilding class with $5 left over",
            "Unused balance stays on the certificate code; if a workshop costs more, the recipient pays the difference at checkout",
          ],
          finishingDisclosure: POTTERY_FINISHING_DISCLOSURE,
          bookingModelNote:
            "Existing Acuity Gift Cards (2119866–2119873) currently only include Chicago appointment types and reject Eugene appointment IDs with HTTP 400 invalid_certificate_type.",
          status:
            eugeneDenominations.length > 0 ? "active" : "pending_acuity_setup",
          acuityProductId: eugeneDenominations[0]?.productId ?? null,
          purchaseUrl: eugeneDenominations[0]?.purchaseUrl ?? null,
          pendingSetupReason:
            eugeneDenominations.length > 0
              ? null
              : "Unfinished Acuity Setup: Existing $50–$250 Acuity Gift Cards are currently configured only for Chicago appointment types (verified via GET /api/v1/certificates/check). Purchase buttons for Eugene are disabled until Eugene appointment types or Eugene gift card products are added in Acuity Admin.",
          denominations: eugeneDenominations,
        },
      },
    },
  ];
}

export type ClassGiftingContext = {
  href: string;
  label: string;
  giftId: GiftExperienceId;
  giftTitle: string;
  city: CityParam;
  workshopSlug: string;
  workshopTitle: string;
  recommendedDenomination?: number;
};

/**
 * Maps an activity slug (from ACTIVITY_REGISTRY or config.ts sections) and studio city
 * to its specific gift experience or gift-card page section, preserving both the
 * selected gift and studio location.
 *
 * Returns null for online, private, retired, or non-gift-eligible activities.
 */
export function getClassGiftingContext(
  slug: string,
  preferredCity: CityParam = "chicago",
  availableCities: ReadonlyArray<CityParam> = ["chicago", "eugene"],
): ClassGiftingContext | null {
  // Never advertise online, private, or coming-soon classes as redeemable gift experiences
  if (
    slug === "online-cauldron" ||
    slug === "private-parties" ||
    slug === "gift-cards"
  ) {
    return null;
  }

  const resolvedCity: CityParam = availableCities.includes(preferredCity)
    ? preferredCity
    : availableCities[0] ?? "chicago";

  // 1. Pottery Date Night for Two
  if (slug === "date-night-wheel") {
    return {
      href: `/gift-cards?city=${resolvedCity}&gift=pottery-date-night-for-two&workshop=${encodeURIComponent(slug)}#pottery-date-night-for-two`,
      label: "Give this class as a gift",
      giftId: "pottery-date-night-for-two",
      giftTitle: "Pottery Date Night for Two",
      city: resolvedCity,
      workshopSlug: slug,
      workshopTitle: "Date Night on the Wheel",
      recommendedDenomination: resolvedCity === "chicago" ? 100 : 50,
    };
  }

  // 2. Their First Pottery Class (Beginner Wheel)
  if (
    slug === "beginner-wheel" ||
    slug === "cup-creations" ||
    slug === "matcha-bowl"
  ) {
    return {
      href: `/gift-cards?city=${resolvedCity}&gift=their-first-pottery-class&workshop=${encodeURIComponent(slug)}#their-first-pottery-class`,
      label: "Give this class as a gift",
      giftId: "their-first-pottery-class",
      giftTitle: "Their First Pottery Class",
      city: resolvedCity,
      workshopSlug: slug,
      workshopTitle:
        slug === "cup-creations"
          ? "Beginner Wheel: Cup Creations"
          : slug === "matcha-bowl"
            ? "Beginner Wheel: Matcha Bowl"
            : "Wheel Throwing for Beginners",
      recommendedDenomination: resolvedCity === "chicago" ? 50 : 25,
    };
  }

  // Normalize legacy section slugs (e.g., "handbuilding" -> "mug-and-bowl")
  const normalizedSlug = slug === "handbuilding" ? "mug-and-bowl" : slug;

  // 3. Verified Chicago workshops included in the active $50–$250 Gift Cards
  const chicagoMatch = VERIFIED_CHICAGO_GIFT_WORKSHOPS.find(
    (w) => w.slug === normalizedSlug,
  );
  if (chicagoMatch && resolvedCity === "chicago" && availableCities.includes("chicago")) {
    const recommendedDenomination =
      chicagoMatch.price <= 50 ? 50 : chicagoMatch.price <= 100 ? 100 : 150;
    return {
      href: `/gift-cards?city=chicago&gift=let-them-choose&workshop=${encodeURIComponent(slug)}&amount=${recommendedDenomination}#let-them-choose`,
      label: "Give this class as a gift",
      giftId: "let-them-choose",
      giftTitle: `Let Them Choose ($${recommendedDenomination} Gift Card for ${chicagoMatch.title})`,
      city: "chicago",
      workshopSlug: slug,
      workshopTitle: chicagoMatch.title,
      recommendedDenomination,
    };
  }

  return null;
}

export const GIFT_FAQS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "Do I need to choose a class date when buying a gift?",
    a: "No. You never have to guess their schedule. When you purchase a gift certificate, Acuity generates an 8-character redemption code with no pre-selected date. Your recipient browses our live calendar and books a session date and time that works for them.",
  },
  {
    q: "How does the recipient redeem their gift certificate?",
    a: "They visit our booking calendar (colorcocktailfactory.as.me or any workshop page on our site), choose their studio and an open class date, click 'Redeem Coupon, Package, or Gift Certificate' at checkout, and enter their 8-character code. Acuity applies the certificate balance directly to their reservation.",
  },
  {
    q: "Which studio and classes are covered?",
    a: "Choose the recipient’s studio first. Available gift cards and eligible workshops are listed on this page. Chicago gift cards cover the listed Chicago workshops. If your selected gift or studio is unavailable online, contact support@colorcocktailfactory.com before purchasing.",
  },
  {
    q: "Does a dollar-value gift card guarantee a full class, or might there be a balance due?",
    a: "Dollar-value certificates apply their exact dollar amount as monetary credit toward eligible workshops. In Chicago, a $50 Gift Card covers one $39–$45 per-person class (such as Paint Pottery at $39, Wine Glass Painting at $40, or Beginner Wheel, Candle Making, Terrarium, or Hanging Turkish Lamp at $45) with $5–$11 remaining on the code. Workshops priced at $55 (such as Date Night on the Pottery Wheel for Two, Ceramic Mug & Bowl, Mosaic, or Glass Fusion) or $85 (Bonsai) require either a $100+ gift card or paying the $5–$35 difference at checkout.",
  },
  {
    q: "What is included in a pottery class, and what costs extra?",
    a: POTTERY_FINISHING_DISCLOSURE,
  },
  {
    q: "Does Pottery Date Night cover one guest or two?",
    a: "Pottery Date Night for Two covers two guests sharing one pottery wheel ($55 for two in Chicago; $50 for two in Eugene). In Acuity, a single Date Night reservation slot automatically admits two people—your recipient books just 1 appointment slot for the couple, not a quantity of 2.",
  },
  {
    q: "How is the gift certificate delivered? Can I print a card or add a personal message?",
    a: "Immediately after checkout via Square or PayPal, Acuity displays your 8-character certificate code on the confirmation screen (with a 'View gift certificate' printable view) and emails the receipt and code to the buyer's email address. Because Acuity does not automatically schedule future email delivery to a separate recipient address, you can forward the code directly or use our Printable Gift Certificate & Personal Message builder right on this page to print or save a personalized studio gift card.",
  },
  {
    q: "Do gift certificates expire, and what happens to unused balances?",
    a: "Our Acuity gift certificates do not expire (expiration is unset/null in Acuity). For dollar-value certificates, if a recipient books a workshop that costs less than their certificate value, the unused dollar balance automatically remains on the same 8-character code for future bookings.",
  },
];
