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
  const state = isChicago ? "Illinois" : "Oregon";
  const stateAbbr = isChicago ? "IL" : "OR";
  const nearbyAreas = isChicago 
    ? "West Loop, South Loop, Bridgeport, Chinatown"
    : "Whiteaker, Downtown, University District";
  
  return {
    title: `${city.label} Creative Workshops & Pottery Classes | ${neighborhood} Art Studio`,
    description: `Top-rated creative workshops in ${neighborhood}, ${city.label}, ${state}. Expert pottery classes, wheel throwing, Turkish lamps, glass fusion, mosaics. Perfect for date nights, birthdays, team building. Walk-ins welcome! Serving ${nearbyAreas}. Book online today.`,
    keywords: [
      // Core local keywords
      `pottery classes ${city.label}`,
      `pottery classes ${city.label} ${stateAbbr}`,
      `art classes ${city.label}`,
      `pottery studio ${city.label}`,
      `pottery wheel ${city.label}`,
      `${neighborhood} pottery classes`,
      `${neighborhood} art studio`,
      // Specific activities
      `wheel throwing ${city.label}`,
      `beginner pottery ${city.label}`,
      `handbuilding pottery ${city.label}`,
      `ceramic classes ${city.label}`,
      `glass art ${city.label}`,
      `glass fusion ${city.label}`,
      `mosaic classes ${city.label}`,
      `mosaic art ${city.label}`,
      `Turkish lamp making ${city.label}`,
      `candle making ${city.label}`,
      `bonsai class ${city.label}`,
      // Intent keywords
      `creative workshops ${city.label}`,
      `art workshops ${city.label}`,
      `date night ideas ${city.label}`,
      `things to do in ${city.label}`,
      `couples activities ${city.label}`,
      `team building ${city.label}`,
      `corporate events ${city.label}`,
      `private workshops ${city.label}`,
      `birthday party ${city.label}`,
      `bachelorette party ${city.label}`,
      // Experience gifts
      `gift experience ${city.label}`,
      `art class gift certificate`,
      "pottery class gift card",
      // Near me variations
      "pottery classes near me",
      "art classes near me",
      "creative workshops near me"
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
