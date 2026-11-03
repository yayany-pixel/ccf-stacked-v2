import { expandedWorkshopGuides } from "./workshopGuides/expanded";

// These local features repeat generic activity lists rather than adding a
// distinct, city-specific itinerary or researched visitor guidance.
export const boilerplateLocalGuideSlugs = [
  "chicago-without-alcohol-sober-night-out-ideas",
  "double-date-ideas-chicago-15-activities",
  "how-to-make-friends-adult-chicago-creative-activities",
  "creative-chicago-introverts-low-pressure-outings",
  "chicago-things-to-do-visiting-parents",
  "small-company-holiday-party-ideas-chicago",
  "creative-bridal-shower-ideas-chicago",
  "chicago-baby-shower-creative-activities",
  "employee-appreciation-day-ideas-chicago",
  "family-reunion-art-workshops-chicago-eugene",
  "winter-date-night-ideas-chicago-cozy-experiences",
  "indoor-things-to-do-chicago-bad-weather",
  "holiday-gift-exchange-experiences-not-clutter",
] as const;

const noindexSlugs = new Set<string>([
  ...expandedWorkshopGuides.map(guide => guide.slug),
  ...boilerplateLocalGuideSlugs,
]);

export function isBlogPostIndexable(slug: string): boolean {
  return !noindexSlugs.has(slug);
}
