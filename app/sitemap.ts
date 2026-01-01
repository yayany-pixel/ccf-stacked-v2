import type { MetadataRoute } from "next";
import { sections } from "@/lib/config";
import { getAllActivitySlugs } from "@/lib/activities";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://colorcocktailfactory.com";
  const cities = ["chicago", "eugene"] as const;
  const now = new Date();

  // Homepage - highest priority
  const homepage: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0
    }
  ];

  // City pages - high priority
  const cityHomes: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${base}/${c}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9
  }));

  // Gift cards - high priority (conversion page)
  const giftCards: MetadataRoute.Sitemap = [
    {
      url: `${base}/gift-cards`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9
    }
  ];

  // Private events - high priority (conversion page)
  const privateEvents: MetadataRoute.Sitemap = [
    {
      url: `${base}/private-events`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95
    }
  ];

  // Events page - high priority (frequently updated)
  const eventsPage: MetadataRoute.Sitemap = [
    {
      url: `${base}/events`,
      lastModified: now,
      changeFrequency: "daily", // Events change frequently
      priority: 0.95
    }
  ];

  // Activities index - high priority
  const activitiesIndex: MetadataRoute.Sitemap = [
    {
      url: `${base}/activities`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95
    }
  ];

  // Individual activity pages - high priority for SEO
  const activitySlugs = getAllActivitySlugs();
  const activityPages: MetadataRoute.Sitemap = activitySlugs.map((slug) => ({
    url: `${base}/activities/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85
  }));

  // City-specific activity pages - medium-high priority
  const cityActivityPages: MetadataRoute.Sitemap = cities.flatMap((c) =>
    sections.map((s) => ({
      url: `${base}/${c}/${s.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    }))
  );

  return [
    ...homepage, 
    ...cityHomes, 
    ...giftCards,
    ...privateEvents,
    ...eventsPage, // Add events page to sitemap
    ...activitiesIndex,
    ...activityPages,
    ...cityActivityPages
  ];
}
