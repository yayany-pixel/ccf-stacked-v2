/**
 * Acuity appointment type image mappings
 * Maps normalized title strings to local image paths
 * Fallback to category images if no exact match
 */

export type CategoryImageMap = {
  [key: string]: string;
};

/**
 * Category fallback images (stored in /public/images/categories/)
 * Using placeholder.com temporarily - replace with actual photos later
 */
export const categoryImages: CategoryImageMap = {
  "Pottery": "https://placehold.co/800x450/8b4513/fff?text=Pottery+Workshop",
  "Mosaic": "https://placehold.co/800x450/4169e1/fff?text=Mosaic+Art",
  "Glass Fusion": "https://placehold.co/800x450/87ceeb/000?text=Glass+Fusion",
  "Candle": "https://placehold.co/800x450/ffd700/000?text=Candle+Making",
  "Terrarium & Bonsai": "https://placehold.co/800x450/228b22/fff?text=Terrarium+%26+Bonsai",
  "Painting": "https://placehold.co/800x450/ff6347/fff?text=Painting",
  "Kids & Family": "https://placehold.co/800x450/ff69b4/fff?text=Kids+%26+Family",
  "Private": "https://placehold.co/800x450/9370db/fff?text=Private+Event",
  "Other": "https://placehold.co/800x450/808080/fff?text=Workshop",
};

/**
 * Specific appointment type image mappings
 * Add entries here to override category fallbacks
 * Format: normalize title to lowercase, remove special chars
 * Using placeholder.com temporarily - replace with actual photos later
 */
export const appointmentImages: CategoryImageMap = {
  // Pottery
  "date night on the wheel": "https://placehold.co/800x450/8b4513/fff?text=Date+Night+Pottery",
  "beginner wheel throwing": "https://placehold.co/800x450/8b4513/fff?text=Beginner+Wheel",
  "pottery wheel": "https://placehold.co/800x450/8b4513/fff?text=Pottery+Wheel",
  "handbuilding": "https://placehold.co/800x450/a0522d/fff?text=Hand+Building",
  "clay workshop": "https://placehold.co/800x450/8b4513/fff?text=Clay+Workshop",
  
  // Mosaics
  "mosaic workshop": "https://placehold.co/800x450/4169e1/fff?text=Mosaic+Workshop",
  "turkish lamp": "https://placehold.co/800x450/daa520/000?text=Turkish+Lamp",
  "mosaic mirror": "https://placehold.co/800x450/4682b4/fff?text=Mosaic+Mirror",
  
  // Glass
  "glass fusion": "https://placehold.co/800x450/87ceeb/000?text=Glass+Fusion",
  "fused glass": "https://placehold.co/800x450/87ceeb/000?text=Fused+Glass",
  "glass blowing": "https://placehold.co/800x450/add8e6/000?text=Glass+Blowing",
  
  // Other
  "candle making": "https://placehold.co/800x450/ffd700/000?text=Candle+Making",
  "bonsai": "https://placehold.co/800x450/2e8b57/fff?text=Bonsai",
  "terrarium": "https://placehold.co/800x450/228b22/fff?text=Terrarium",
  "painting": "https://placehold.co/800x450/ff6347/fff?text=Painting",
  "wine glass painting": "https://placehold.co/800x450/ff4500/fff?text=Wine+Glass+Painting",
  
  // Add more mappings as needed
};

/**
 * Normalize title for image lookup
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars
    .trim();
}

/**
 * Get image path for an Acuity appointment type
 * Priority: exact match > partial match > category fallback
 */
export function getAcuityImage(title: string, category: string = "Other"): string {
  const normalized = normalizeTitle(title);
  
  // Priority 1: Exact match
  if (appointmentImages[normalized]) {
    return appointmentImages[normalized];
  }
  
  // Priority 2: Partial match (check if title contains key)
  for (const [key, imagePath] of Object.entries(appointmentImages)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return imagePath;
    }
  }
  
  // Priority 3: Category fallback
  return categoryImages[category] || categoryImages["Other"];
}
