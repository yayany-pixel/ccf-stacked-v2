import type { Metadata } from "next";
import type { City, SectionConfig } from "@/lib/config";

export function buildCityMetadata(city: City): Metadata {
  const isChicago = city.param === "chicago";
  const neighborhood = isChicago ? "Pilsen, Chicago" : "Eugene, Oregon";
  const fullTitle = `${city.label} Pottery & Art Classes | Color Cocktail Factory`;
  const description = `Explore pottery, glass art and creative workshops in ${neighborhood}. Find class details, location information and upcoming dates. Book online.`;

  return {
    title: { absolute: fullTitle },
    description,
    openGraph: {
      title: `Color Cocktail Factory — Creative Workshops in ${city.label}`,
      description: `Join us in ${neighborhood} for pottery, glass art, and creative workshops. Perfect for beginners, couples, and groups. Book today!`,
      url: `https://colorcocktailfactory.com/${city.param}`,
      type: "website",
      locale: "en_US",
      siteName: "Color Cocktail Factory",
      images: ["/og-image.jpg"]
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
  const fullTitle = buildSearchTitle(`${section.heroTitle} in ${city.label}`);
  const enhancedDescription = `${CITY_ACTIVITY_SUMMARIES[section.slug] || section.heroDescription} Explore ${city.label} class details and availability.`;

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

// Keep the activity and city intact; abbreviate only the brand on long titles.
export function buildSearchTitle(subject: string): string {
  const full = `${subject} | Color Cocktail Factory`;
  return full.length <= 60 ? full : `${subject} | CCF`;
}

export function buildActivityDescription(description: string): string {
  // Short hero copy serves the card UI. Search snippets can offer more context
  // without changing that visible copy or claiming specific class inclusions.
  return description.length < 70
    ? `${description} View class details, location options and upcoming dates at Color Cocktail Factory.`
    : description;
}

const CITY_ACTIVITY_SUMMARIES: Record<string, string> = {
  "private-parties": "Plan a private creative workshop for your group. Request options, pricing and available dates.",
  "date-night-wheel": "Share a pottery wheel for a creative date with guided instruction.",
  "beginner-wheel": "Try pottery wheel throwing with guidance on centering, pulling and shaping clay.",
  "handbuilding": "Build pottery by hand using slab and pinch techniques, without a wheel.",
  "mosaic": "Arrange colorful pieces into your own mosaic artwork with guided instruction.",
  "turkish-lamp": "Design a Turkish mosaic lamp using colorful glass pieces.",
  "glass-fusion": "Compose colorful glass pieces for a kiln-fired glass artwork.",
  "glass-blowing": "Glass blowing is coming soon. Find updates about this planned workshop.",
  "bonsai": "Learn bonsai styling, pruning, wiring basics and tree care.",
  "terrarium": "Layer plants and decorative details to create a miniature garden in glass.",
  "candle-making": "Explore scents and candle pouring in a creative studio workshop.",
  "wine-glass-painting": "Paint your own design on a wine glass in a creative workshop.",
  "paper-pigment": "Explore watercolor, paint-making and creative painting sessions.",
  "painting": "Discover acrylic painting nights, themed sessions and guided art projects.",
  "parent-and-me": "Make art together in a guided creative session for parents and children.",
  "gift-cards": "Give a creative workshop experience. Explore gift cards and booking options.",
};

// Event feeds may have blank or full-length descriptions. Prefer a complete
// opening sentence; never cut a search snippet in the middle of a word.
export function summarizeSearchDescription(value: string | undefined, fallback: string): string {
  const text = (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || fallback;
  if (text.length <= 160) return text;
  const opening = text.match(/^.{70,155}?[.!?](?=\s|$)/)?.[0];
  return opening || `${text.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

export const BLOG_SEARCH_TITLES: Record<string, string> = {
  "pottery-101-beginners-guide": "Pottery 101: A Beginner's Guide",
  "chicago-date-night-ideas": "10 Creative Date Night Ideas in Chicago",
  "eugene-date-night-ideas": "10 Creative Date Night Ideas in Eugene",
  "pilsen-student-guide": "A Student's Guide to Chicago's Pilsen",
  "art-classes-near-me": "Art Classes Near Me: Find Your Workshop",
  "pottery-classes-chicago-guide": "Trying the Pottery Wheel in Pilsen",
  "chicago-pottery-classes-beginners-guide": "Chicago Pottery Classes: A Beginner's Guide",
};
