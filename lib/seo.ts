import type { Metadata } from "next";
import type { City, SectionConfig } from "@/lib/config";

export function buildCityMetadata(city: City): Metadata {
  const isChicago = city.param === "chicago";
  const neighborhood = isChicago ? "Pilsen" : "downtown Eugene";
  const state = isChicago ? "Illinois" : "Oregon";
  const nearbyAreas = isChicago 
    ? "West Loop, South Loop, Bridgeport, Chinatown"
    : "Whiteaker, Downtown, University District";
  
  return {
    title: `${city.label} Creative Workshops & Pottery Classes | Color Cocktail Factory`,
    description: `Top-rated creative workshops in ${neighborhood}, ${city.label}, ${state}. Expert pottery classes, wheel throwing, Turkish lamps, glass fusion, mosaics. Perfect for date nights, birthdays, team building. Walk-ins welcome! Serving ${nearbyAreas}. Book online today.`,
    openGraph: {
      title: `Color Cocktail Factory — Creative Workshops in ${city.label}`,
      description: `Join us in ${neighborhood} for pottery, glass art, and creative workshops. Perfect for beginners, couples, and groups. Book today!`,
      url: `https://colorcocktailfactory.com/${city.param}`,
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
  const title = `${section.heroTitle} in ${city.label} | Color Cocktail Factory`;
  
  // Enhanced description with call-to-action
  const enhancedDescription = `${section.heroDescription} Located in ${city.label}. Beginner-friendly. Book your spot today! ${section.tags.slice(0, 3).join(", ")}.`;
  
  return {
    title,
    description: enhancedDescription,
    openGraph: {
      title,
      description: enhancedDescription,
      url: `https://colorcocktailfactory.com/${city.param}/${section.slug}`,
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
