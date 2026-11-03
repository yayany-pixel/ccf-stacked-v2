import type { Metadata } from "next";
import type { City, SectionConfig } from "@/lib/config";

export function buildCityMetadata(city: City): Metadata {
  const isChicago = city.param === "chicago";
  const locationText = isChicago ? "Pilsen, Chicago" : "Eugene, Oregon";
  const fullTitle = `${city.label} Creative Workshops & Pottery Classes | Color Cocktail Factory`;
  const description = `Explore pottery and creative workshops in ${locationText} at ${city.address}. Choose a class, check the current schedule and plan a creative outing with Color Cocktail Factory.`;
  
  return {
    title: { absolute: fullTitle },
    description,
    openGraph: {
      title: `Color Cocktail Factory — Creative Workshops in ${city.label}`,
      description,
      url: `https://colorcocktailfactory.com/${city.param}`,
      type: "website",
      locale: "en_US",
      siteName: "Color Cocktail Factory",
      images: ["/og-image.jpg"]
    },
    twitter: {
      card: "summary_large_image",
      title: `Creative Workshops in ${city.label}`,
      description
    },
    alternates: {
      canonical: `https://colorcocktailfactory.com/${city.param}`
    }
  };
}

export function buildActivityMetadata(city: City, section: SectionConfig): Metadata {
  const fullTitle = `${section.heroTitle} in ${city.label} | Color Cocktail Factory`;
  
  // Enhanced description with call-to-action
  const enhancedDescription = `${section.heroDescription} Located in ${city.label}. Beginner-friendly. Book your spot today! ${section.tags.slice(0, 3).join(", ")}.`;
  
  return {
    title: { absolute: fullTitle },
    description: enhancedDescription,
    openGraph: {
      title: fullTitle,
      description: enhancedDescription,
      url: `https://colorcocktailfactory.com/${city.param}/${section.slug}`,
      type: "website",
      locale: "en_US",
      siteName: "Color Cocktail Factory",
      images: ["/og-image.jpg"]
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
