import type { BlogPost } from "../blogPosts";
import { DEFAULT_AUTHOR_SLUG } from "../authors";
import type { LocalFeature } from "./types";
import { localFeatureWordCount, LOCAL_FEATURE_PUBLISHED_AT } from "./types";
import { chicagoNeighborhoodFeatures } from "./chicagoNeighborhoods";
import { chicagoSocialFeatures } from "./chicagoSocial";
import { privateEventFeatures } from "./privateEvents";
import { eugeneFeatures } from "./eugene";
import { seasonalAndBuyerFeatures } from "./seasonalBuyer";

export type { LocalFeature, LocalArticleIdea, LocalArticleLink, LocalArticleSection } from "./types";

export const localFeatures: LocalFeature[] = [
  ...chicagoNeighborhoodFeatures,
  ...chicagoSocialFeatures,
  ...privateEventFeatures,
  ...eugeneFeatures,
  ...seasonalAndBuyerFeatures,
];

const featuresBySlug = new Map(localFeatures.map(feature => [feature.slug, feature]));
if (featuresBySlug.size !== localFeatures.length || localFeatures.length !== 25) {
  throw new Error("The 25 local SEO editorials must have unique article slugs");
}

export function getLocalFeatureBySlug(slug: string): LocalFeature | undefined {
  return featuresBySlug.get(slug);
}

export function getLocalFeaturesForActivity(activitySlug: string): LocalFeature[] {
  return localFeatures.filter(feature => feature.relatedActivitySlugs.includes(activitySlug));
}

export const localFeaturePosts: BlogPost[] = localFeatures.map(feature => {
  const words = localFeatureWordCount(feature);
  return {
    slug: feature.slug,
    title: feature.title,
    seoTitle: feature.title.length > 67
      ? feature.title.slice(0, 64).replace(/\s+\S*$/, "").trim()
      : feature.title,
    description: feature.description,
    authorSlug: DEFAULT_AUTHOR_SLUG,
    author: "Yahya Moosavi",
    date: LOCAL_FEATURE_PUBLISHED_AT,
    publishedAt: LOCAL_FEATURE_PUBLISHED_AT,
    updatedAt: LOCAL_FEATURE_PUBLISHED_AT,
    category: feature.category,
    readTime: `${Math.max(3, Math.ceil(words / 200))} min read`,
    keywords: feature.keywords,
    city: feature.city,
    relatedActivitySlugs: feature.relatedActivitySlugs,
    relatedPostSlugs: feature.relatedPostSlugs,
  };
});
