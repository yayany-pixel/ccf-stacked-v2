import type { CityParam } from "@/lib/config";

export type HomepageCity = CityParam;
export type ActivityCity = HomepageCity | "online" | "unknown";
export type TicketUnit = "per person" | "for two" | "per ticket";

export type ApprovedPhoto = {
  filename: string;
  driveFileId: string;
  path: string;
  width: number;
  height: number;
  alt: string;
  focalPosition: string;
};

export type ActivityDefinition = {
  key: string;
  title: string;
  description: string;
  acuityTitle: string;
  appointmentTypeId: number;
  calendarIds: number[];
  city: ActivityCity;
  mode: "in-person" | "online";
  image: ApprovedPhoto | null;
  detailUrl: string | null;
  bookingUrl: string | null;
  priority: number;
  adultThemed: boolean;
  ageRestriction: string | null;
  beginnerFriendly: boolean | null;
  byob: boolean | null;
  eligibility: "ready" | "needs-photo" | "needs-review" | "promotion-unconfirmed";
  reviewNote: string | null;
  verifiedAt: string;
};

export type HomepageActivity = ActivityDefinition & {
  /** Exact bookable variants represented by a consolidated homepage card. */
  bookingVariantIds?: number[];
  bookingVariants?: HomepageActivity[];
  durationMinutes?: number | null;
  listingDescription?: string | null;
  pickupNotes?: string[];
  upcomingSessions?: string[];
  analyticsContentId?: string;
  currentPrice: number | null;
  priceUnit: TicketUnit;
  priceEvidence: string | null;
  formerPrice: { amount: number; evidence: string } | null;
  nextAvailability: string | null;
  availabilityState: "available" | "empty-window" | "unavailable";
  offeringState: "active" | "inactive" | "unverified";
};

export type HomepageData = {
  activities: HomepageActivity[];
  checkedAt: string;
  catalogState: "verified" | "unavailable";
  availabilityState: "verified" | "unavailable";
  availabilityWindowDays: number;
};
