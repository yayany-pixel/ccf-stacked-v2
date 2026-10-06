import type { MetadataRoute } from "next";
import { sections } from "@/lib/config";
import { getAllActivitySlugs } from "@/lib/activities";
import { blogPosts, getPostUpdatedAt } from "@/lib/blogPosts";
import { getAllAuthors } from "@/lib/authors";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://colorcocktailfactory.com";
  const cities = ["chicago", "eugene"] as const;

  // Homepage - highest priority
  const homepage: MetadataRoute.Sitemap = [
    {
      url: base,
      changeFrequency: "monthly",
      priority: 1.0
    }
  ];

  // City pages - high priority
  const cityHomes: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${base}/${c}`,
    changeFrequency: "weekly",
    priority: 0.9
  }));

  // Gift cards - high priority (conversion page)
  const giftCards: MetadataRoute.Sitemap = [
    {
      url: `${base}/gift-cards`,
      changeFrequency: "weekly",
      priority: 0.9
    }
  ];

  // Private events - high priority (conversion page)
  const privateEvents: MetadataRoute.Sitemap = [
    {
      url: `${base}/private-events`,
      changeFrequency: "weekly",
      priority: 0.95
    }
  ];

  // Events page - high priority (frequently updated)
  const eventsPage: MetadataRoute.Sitemap = [
    {
      url: `${base}/events`,
      changeFrequency: "daily", // Events change frequently
      priority: 0.95
    }
  ];

  // Individual event session pages are intentionally excluded: they are
  // date-stamped, short-lived URLs that churn constantly. The /events index
  // (crawled daily) links to all current sessions.

  // Activities index - high priority
  const activitiesIndex: MetadataRoute.Sitemap = [
    {
      url: `${base}/activities`,
      changeFrequency: "weekly",
      priority: 0.95
    }
  ];

  // Individual activity pages - high priority for SEO
  const activitySlugs = getAllActivitySlugs();
  const activityPages: MetadataRoute.Sitemap = activitySlugs.map((slug) => ({
    url: `${base}/activities/${slug}`,
    changeFrequency: "weekly",
    priority: 0.85
  }));

  // City-specific activity pages - medium-high priority
  const cityActivityPages: MetadataRoute.Sitemap = cities.flatMap((c) =>
    sections.map((s) => ({
      url: `${base}/${c}/${s.slug}`,
      changeFrequency: "weekly",
      priority: 0.8
    }))
  );

  // Blog pages - medium-high priority for SEO
  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${base}/blog`,
      changeFrequency: "weekly",
      priority: 0.8
    }
  ];

  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(getPostUpdatedAt(post)),
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  // Author profile pages
  const authorPages: MetadataRoute.Sitemap = getAllAuthors().map((author) => ({
    url: `${base}/author/${author.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5
  }));

  // Audience/customer-type landing pages - high priority (conversion pages)
  const audiencePages: MetadataRoute.Sitemap = [
    {
      url: `${base}/team-building`,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${base}/birthday-parties`,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${base}/bachelorette-parties`,
      changeFrequency: "monthly",
      priority: 0.9
    }
  ];

  return [
    ...homepage, 
    ...cityHomes, 
    ...giftCards,
    ...privateEvents,
    ...eventsPage,
    ...activitiesIndex,
    ...activityPages,
    ...cityActivityPages,
    ...blogIndex,
    ...blogPostPages,
    ...authorPages,
    ...audiencePages
  ];
}
