import type { BlogPost } from "../blogPosts";
import { DEFAULT_AUTHOR_SLUG } from "../authors";
import { getActivityDetailBySlug } from "../activityRegistry";
import type { DiscoveryGuide } from "./types";
import { chicagoDiscoveryPartOne } from "./chicagoOne";
import { chicagoDiscoveryPartTwo } from "./chicagoTwo";
import { eugeneDiscovery } from "./eugene";
import { holidayDiscovery } from "./holiday";
import { correctedEugeneDateNightGuide } from "./legacyEugene";

export type { DiscoveryCity, DiscoveryGuide, DiscoveryLink, DiscoverySection, DiscoveryCTA } from "./types";

export const localDiscoveryGuides: DiscoveryGuide[] = [
  ...chicagoDiscoveryPartOne,
  ...chicagoDiscoveryPartTwo,
  ...eugeneDiscovery,
  ...holidayDiscovery,
];

const bySlug = new Map(localDiscoveryGuides.map((post) => [post.slug, post]));

if (localDiscoveryGuides.length !== 10 || bySlug.size !== 10) {
  throw new Error("Expected exactly 10 unique local discovery articles.");
}

export function getLocalDiscoveryGuideBySlug(slug: string): DiscoveryGuide | undefined {
  return bySlug.get(slug) ?? (slug === "eugene-date-night-ideas" ? correctedEugeneDateNightGuide : undefined);
}

export function getLocalDiscoveryGuidesForActivity(slug: string): DiscoveryGuide[] {
  const newGuides = localDiscoveryGuides.filter((guide) => guide.relatedActivitySlugs.includes(slug));
  return correctedEugeneDateNightGuide.relatedActivitySlugs.includes(slug)
    ? [...newGuides, correctedEugeneDateNightGuide]
    : newGuides;
}

function articleWords(post: DiscoveryGuide): number {
  return [
    ...post.intro,
    ...post.sections.flatMap((s) => [s.heading, ...s.paragraphs,
      ...(s.picks?.flatMap((p) => [p.title, p.description]) ?? []), ...(s.tips ?? [])]),
    ...post.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ").trim().split(/\s+/).length;
}

function relatedLocalArticles(post: DiscoveryGuide): string[] {
  if (post.city === "eugene") {
    return [
      ...localDiscoveryGuides.filter((other) => other.city === "eugene" && other.slug !== post.slug)
        .map((other) => other.slug),
      "eugene-date-night-ideas",
    ];
  }
  if (post.city === "chicago") {
    return [
      ...localDiscoveryGuides.filter((other) => other.city === "chicago" && other.slug !== post.slug)
        .slice(0, 4).map((other) => other.slug),
      "pilsen-student-guide",
    ];
  }
  return [
    "eugene-bachelorette-party-ideas-8-to-20",
    "pilsen-restaurants-before-after-pottery",
    "chicago-team-building-cost-10-20-50",
    "rainy-day-things-to-do-eugene-oregon",
  ];
}

export const localDiscoveryBlogPosts: BlogPost[] = localDiscoveryGuides.map((guide) => {
  const cover = guide.heroActivitySlug
    ? getActivityDetailBySlug(guide.heroActivitySlug)
    : getActivityDetailBySlug(guide.relatedActivitySlugs[0] ?? "");
  const date = "2026-10-23";
  return {
    slug: guide.slug,
    title: guide.title,
    seoTitle: guide.seoTitle,
    description: guide.description,
    authorSlug: DEFAULT_AUTHOR_SLUG,
    author: "Yahya Moosavi",
    publishedAt: date,
    updatedAt: date,
    date,
    image: cover?.image.path || undefined,
    imageAlt: cover ? `Example of ${cover.title.toLowerCase()} art and workshop materials at Color Cocktail Factory` : undefined,
    category: guide.category,
    readTime: `${Math.max(4, Math.round(articleWords(guide) / 190))} min read`,
    keywords: guide.keywords,
    city: guide.city,
    relatedActivitySlugs: guide.relatedActivitySlugs,
    relatedPostSlugs: relatedLocalArticles(guide),
  };
});
