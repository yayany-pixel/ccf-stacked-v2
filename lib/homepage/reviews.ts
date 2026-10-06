import type { HomepageCity } from "./types";

/** Publish only customer-approved quotes or verifiable public reviews, with a source. */
export type HomepageReview = {
  quote: string;
  attribution: string;
  city: HomepageCity;
  workshop: string;
  sourceUrl: string;
  sourceLabel: string;
};

// No verified customer reviews were supplied. Never substitute placeholder praise.
export const HOMEPAGE_REVIEWS: HomepageReview[] = [];
