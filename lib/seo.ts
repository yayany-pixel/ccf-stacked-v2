import type { Metadata } from "next";
import type { City, SectionConfig } from "@/lib/config";

/**
 * Generate location-specific keywords based on activity and city
 */
function generateLocalKeywords(city: City, activityType: string): string[] {
  const baseKeywords = [
    `${activityType} ${city.label}`,
    `${activityType} classes ${city.label}`,
    `${activityType} workshop ${city.label}`,
    `${activityType} near me`,
    `learn ${activityType} ${city.label}`,
    `${activityType} lessons ${city.label}`,
    `beginner ${activityType} ${city.label}`
  ];
  
  if (city.param === "chicago") {
    return [...baseKeywords, `${activityType} Pilsen`, `${activityType} West Loop`];
  }
  
  return baseKeywords;
}

export function buildCityMetadata(city: City): Metadata {
  const isChicago = city.param === "chicago";
  const neighborhood = isChicago ? "Pilsen" : "downtown Eugene";
  
  return {
    title: `Creative Workshops in ${city.label} | Pottery, Glass Art & More`,
    description: `Book hands-on creative workshops in ${neighborhood}. Expert-led pottery, Turkish lamp making, glass fusion, mosaics, and more. Perfect for date nights, team building, and gifts. Same-day bookings available. Beginner-friendly classes.`,
    keywords: [
      `pottery classes ${city.label}`,
      `art classes ${city.label}`,
      `creative workshops ${city.label}`,
      `date night ideas ${city.label}`,
      `things to do in ${city.label}`,
      `team building ${city.label}`,
      `glass art ${city.label}`,
      `mosaic classes ${city.label}`,
      `Turkish lamp making ${city.label}`,
      "gift experience",
      "bachelorette party ideas",
      "corporate events",
      "private workshops"
    ],
    openGraph: {
      title: `Color Cocktail Factory — Creative Workshops in ${city.label}`,
      description: `Join us in ${neighborhood} for pottery, glass art, and creative workshops. Perfect for beginners, couples, and groups. Book today!`,
      type: "website",
      locale: "en_US",
      siteName: "Color Cocktail Factory"
    },
    twitter: {
      card: "summary_large_image",
      title: `Creative Workshops in ${city.label}`,
      description: `Pottery, glass art & more in ${neighborhood}`
    },
    alternates: {
      canonical: `https://colorcocktailfactory.com/${city.param}`
    }
  };
}

export function buildActivityMetadata(city: City, section: SectionConfig): Metadata {
  const activityKeywords = generateLocalKeywords(city, section.navLabel.toLowerCase());
  const title = `${section.heroTitle} in ${city.label} | Color Cocktail Factory`;
  
  // Enhanced description with call-to-action
  const enhancedDescription = `${section.heroDescription} Located in ${city.label}. Beginner-friendly. Book your spot today! ${section.tags.slice(0, 3).join(", ")}.`;
  
  return {
    title,
    description: enhancedDescription,
    keywords: [
      ...activityKeywords,
      ...section.tags,
      "hands-on workshop",
      "creative class",
      "art experience"
    ],
    openGraph: {
      title,
      description: enhancedDescription,
      type: "website",
      locale: "en_US",
      siteName: "Color Cocktail Factory"
    },
    twitter: {
      card: "summary_large_image",
      title: section.heroTitle,
      description: section.heroDescription
    },
    alternates: {
      canonical: `https://colorcocktailfactory.com/${city.param}/${section.slug}`
    }
  };
}
