import type { BlogPost } from "../blogPosts";
import { DEFAULT_AUTHOR_SLUG } from "../authors";
import { getActivityDetailBySlug } from "../activityRegistry";
import { wineGlassGuides } from "./wineGlass";
import { mosaicGuides } from "./mosaic";
import { catVaseGuides } from "./catVase";
import { mushroomGuides } from "./mushroom";
import { cupGuides } from "./cup";
import { dildosGuides } from "./dildos";
import { pussyGuides } from "./pussy";
import type { WorkshopGuide } from "./types";

export type { WorkshopGuide, WorkshopGuideSection, WorkshopGuideFAQ } from "./types";

export const workshopGuides: WorkshopGuide[] = [
  ...wineGlassGuides,
  ...mosaicGuides,
  ...catVaseGuides,
  ...mushroomGuides,
  ...cupGuides,
  ...dildosGuides,
  ...pussyGuides,
];

const guidesBySlug = new Map(workshopGuides.map((guide) => [guide.slug, guide]));

export function getWorkshopGuideBySlug(slug: string): WorkshopGuide | undefined {
  return guidesBySlug.get(slug);
}

export function getWorkshopGuidesForActivity(activitySlug: string): WorkshopGuide[] {
  return workshopGuides.filter((guide) => guide.activitySlug === activitySlug);
}

function wordCount(guide: WorkshopGuide): number {
  const text = [
    ...guide.intro,
    ...guide.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.tips ?? [])]),
    ...guide.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ");
  return text.trim().split(/\s+/).length;
}

/** These posts reuse the existing blog registry, metadata, sitemap and article schema. */
export const workshopGuidePosts: BlogPost[] = workshopGuides.map((guide) => {
  const activity = getActivityDetailBySlug(guide.activitySlug);
  const date = "2026-10-22";
  return {
    slug: guide.slug,
    title: guide.title,
    seoTitle: guide.title.length > 65 ? guide.title.slice(0, 62).replace(/\s+\S*$/, "") : guide.title,
    description: guide.description,
    authorSlug: DEFAULT_AUTHOR_SLUG,
    author: "Yahya Moosavi",
    publishedAt: date,
    updatedAt: date,
    date,
    image: activity?.image.path || undefined,
    imageAlt: activity?.image.alt || undefined,
    category: guide.category,
    readTime: `${Math.max(3, Math.round(wordCount(guide) / 200))} min read`,
    keywords: guide.keywords,
    city: guide.city,
    relatedActivitySlugs: [guide.activitySlug],
    relatedPostSlugs: getWorkshopGuidesForActivity(guide.activitySlug)
      .filter((other) => other.slug !== guide.slug)
      .map((other) => other.slug),
  };
});
