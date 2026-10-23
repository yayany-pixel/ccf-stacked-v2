import { buildActivityEditorialGuides, type ActivityEditorialSeries } from "./factory";
import { foundationSeries } from "./foundations";
import { glassAndNatureSeries } from "./glassNature";
import { dateSeriesA } from "./dateNightsA";
import { dateSeriesB } from "./dateNightsB";
import { seasonalClaySeries } from "./seasonalClay";
import { functionalClaySeries } from "./functionalClay";
import { creativeClaySeries } from "./creativeClay";
import { paintingAndCraftSeries } from "./paintingCrafts";
import { programsSeries } from "./programs";

/**
 * Five guides for each of the 41 remaining activity/catalog pages.
 * The previous seven class series remain in their original modules.
 */
export const expandedEditorialSeries: ActivityEditorialSeries[] = [
  ...foundationSeries,
  ...glassAndNatureSeries,
  ...dateSeriesA,
  ...dateSeriesB,
  ...seasonalClaySeries,
  ...functionalClaySeries,
  ...creativeClaySeries,
  ...paintingAndCraftSeries,
  ...programsSeries,
];

export const expandedWorkshopGuides = expandedEditorialSeries.flatMap(buildActivityEditorialGuides);

if (expandedEditorialSeries.length !== 41 || expandedWorkshopGuides.length !== 205) {
  throw new Error(
    `Expected 41 activity series and 205 articles, got ${expandedEditorialSeries.length} and ${expandedWorkshopGuides.length}`,
  );
}
const slugs = expandedWorkshopGuides.map((post) => post.slug);
if (new Set(slugs).size !== slugs.length) {
  throw new Error("Duplicate slugs in expanded workshop guide collection");
}
