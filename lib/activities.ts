import { sections, type SectionConfig } from "@/lib/config";

/**
 * Activity categorization by department/room
 * Used for grouping in the activities index page
 */
export const ACTIVITY_CATEGORIES = {
  "mud-room": {
    label: "Mud Room",
    description: "Pottery, wheel throwing, and ceramic creation",
    icon: "🏺",
    colorClass: "category-mud"
  },
  "glass-room": {
    label: "Glass Room",
    description: "Mosaics, Turkish lamps, fusion, and glass blowing",
    icon: "✨",
    colorClass: "category-glass"
  },
  "roots-room": {
    label: "Roots Room",
    description: "Bonsai and terrarium workshops",
    icon: "🌱",
    colorClass: "category-roots"
  },
  "crush-create": {
    label: "Crush & Create",
    description: "Candles and wine glass painting",
    icon: "🕯️",
    colorClass: "category-crush"
  },
  "paper-pigment": {
    label: "Paper & Pigment",
    description: "Watercolor, painting, and paper arts",
    icon: "🎨",
    colorClass: "category-paper"
  },
  "romance-room": {
    label: "Romance Room",
    description: "Date nights and couples experiences",
    icon: "💕",
    colorClass: "category-romance"
  },
  "family": {
    label: "Family Fun",
    description: "Parent & Me and kid-friendly workshops",
    icon: "👨‍👩‍👧",
    colorClass: "category-family"
  },
  "special": {
    label: "Special Events",
    description: "Private parties and gift cards",
    icon: "🎉",
    colorClass: "category-private"
  }
} as const;

export type CategoryKey = keyof typeof ACTIVITY_CATEGORIES;

/**
 * Map each section to its primary category/room
 */
export function getCategoryForSection(section: SectionConfig): CategoryKey {
  const id = section.id;
  
  // Pottery activities
  if (["date-night", "beginner-wheel", "handbuilding"].includes(id)) {
    return "mud-room";
  }
  
  // Glass activities
  if (["mosaic", "turkish", "glass-fusion", "glass-blowing"].includes(id)) {
    return "glass-room";
  }
  
  // Nature activities
  if (["bonsai", "terrarium"].includes(id)) {
    return "roots-room";
  }
  
  // Craft activities
  if (["candle", "wine-glass"].includes(id)) {
    return "crush-create";
  }
  
  // Painting activities
  if (["paper-pigment", "painting"].includes(id)) {
    return "paper-pigment";
  }
  
  // Family
  if (id === "parent-and-me") {
    return "family";
  }
  
  // Date night also goes to romance
  if (id === "date-night") {
    return "romance-room";
  }
  
  // Special
  if (["private", "gift"].includes(id)) {
    return "special";
  }
  
  return "special";
}

/**
 * Get all activities grouped by category
 */
export function getActivitiesByCategory() {
  const grouped = new Map<CategoryKey, SectionConfig[]>();
  
  // Initialize all categories
  Object.keys(ACTIVITY_CATEGORIES).forEach(key => {
    grouped.set(key as CategoryKey, []);
  });
  
  // Group sections by category
  sections.forEach(section => {
    // Skip duplicate private events entry
    if (section.id === "private" && grouped.get("special")?.some(s => s.id === "private")) {
      return;
    }
    
    const category = getCategoryForSection(section);
    const existing = grouped.get(category) || [];
    grouped.set(category, [...existing, section]);
  });
  
  return grouped;
}

/**
 * Get related activities based on category and tags
 * Returns 3-6 related activities, prioritizing same category
 */
export function getRelatedActivities(section: SectionConfig, limit = 5): SectionConfig[] {
  // Use explicit related slugs if provided
  if (section.relatedSlugs && section.relatedSlugs.length > 0) {
    const related = section.relatedSlugs
      .map(slug => sections.find(s => s.slug === slug))
      .filter((s): s is SectionConfig => s !== undefined)
      .slice(0, limit);
    
    if (related.length >= 3) {
      return related;
    }
  }
  
  const category = getCategoryForSection(section);
  const sameCategory = sections.filter(s => 
    s.id !== section.id && 
    getCategoryForSection(s) === category &&
    s.id !== "private" // Exclude private events from related
  );
  
  // Add activities with shared tags
  const sharedTags = sections.filter(s => 
    s.id !== section.id &&
    s.id !== "private" &&
    s.tags.some(tag => section.tags.includes(tag)) &&
    !sameCategory.includes(s)
  );
  
  const combined = [...sameCategory, ...sharedTags];
  const unique = Array.from(new Map(combined.map(s => [s.id, s])).values());
  
  return unique.slice(0, limit);
}

/**
 * Get activity by slug
 */
export function getActivityBySlug(slug: string): SectionConfig | undefined {
  return sections.find(s => s.slug === slug);
}

/**
 * Get all activity slugs (for static generation)
 */
export function getAllActivitySlugs(): string[] {
  // Remove duplicates
  const unique = new Map<string, SectionConfig>();
  sections.forEach(s => {
    if (!unique.has(s.slug)) {
      unique.set(s.slug, s);
    }
  });
  return Array.from(unique.keys());
}

/**
 * Generate anchor text variety for internal linking
 */
export function getLinkAnchorText(section: SectionConfig, variant: "default" | "short" | "action" = "default"): string {
  switch (variant) {
    case "short":
      return section.navLabel;
    case "action":
      if (section.id === "gift") return "Shop gift cards";
      if (section.id === "private") return "Plan a private event";
      return `Book ${section.navLabel}`;
    default:
      return section.heroTitle;
  }
}
