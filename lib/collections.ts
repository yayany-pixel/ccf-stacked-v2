import { sections, type SectionConfig } from "@/lib/config";
import { STUDIO_LOCATIONS } from "@/lib/locations";

export interface EventCollection {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  longDescription: string;
  icon: string;
  coverImage: string;
  benefits: string[];
  filterPattern: RegExp;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

export const COLLECTIONS: EventCollection[] = [
  {
    slug: "beginners",
    title: "Beginner Workshops & First-Timer Experiences",
    subtitle: "No prior experience required — hands-on coaching, all tools and materials included.",
    badge: "BEGINNER-FRIENDLY",
    icon: "🌱",
    coverImage: "/images/classes/approved-01-HsW-Hv.webp",
    description:
      "Step into the studio with zero experience and leave with handmade art! Our instructors guide you through foundational techniques step-by-step in a fun, relaxed, and welcoming environment.",
    longDescription:
      "Whether you've never touched a pottery wheel, never cut stained glass, or never blended essential oils, our beginner workshops are built specifically for curious first-timers. Every ticket includes hands-on coaching, premium artist-grade materials, protective aprons, and same-day take-home or optional kiln finishing. All studio locations welcome BYOB drinks and snacks.",
    benefits: [
      "Zero experience necessary — 100% guided by experienced studio artists",
      "All workshop clay, glass, plants, wax, and craft tools provided",
      "BYOB-friendly studios with complimentary glassware and chill vibes",
      "Take home same-day creations or choose optional professional kiln finishing for pottery"
    ],
    filterPattern: /beginner|for beginners|101|first spin|cup creations|matcha bowl|candle making|terrarium|mosaic|wine glass/i,
    seo: {
      metaTitle: "Beginner Art & Pottery Classes in Chicago & Eugene | Color Cocktail Factory",
      metaDescription: "Looking for beginner-friendly creative classes? Explore wheel throwing, handbuilding pottery, mosaic lamps, terrariums, and candle making with hands-on coaching."
    }
  },
  {
    slug: "online",
    title: "Live Online Classes & Virtual Workshops",
    subtitle: "Interactive, real-time live craft sessions from the comfort of home.",
    badge: "LIVE VIRTUAL",
    icon: "💻",
    coverImage: "/images/classes/approved-15-oM08kA.webp",
    description:
      "Join our live virtual studio sessions led by Color Cocktail Factory master artisans. Perfect for remote teams, friends across cities, or cozy creative nights at home.",
    longDescription:
      "Experience the vibrant energy of Color Cocktail Factory from anywhere! Our live virtual workshops connect you in real-time with passionate instructors who demonstrate techniques up-close, answer questions live, and troubleshoot your projects step-by-step. Kit delivery options and digital supply lists ensure you have everything needed for a seamless creative experience.",
    benefits: [
      "Real-time interactive instruction with live Q&A",
      "Available anywhere — connect across states for family & team gatherings",
      "Complete materials kit options shipped directly to your door",
      "High-definition camera setups showing up-close technique demonstrations"
    ],
    filterPattern: /online|virtual|live online/i,
    seo: {
      metaTitle: "Live Online Pottery & Art Classes | Color Cocktail Factory",
      metaDescription: "Join live virtual workshops in pottery, clay sculpting, and watercolor painting. Guided in real time with interactive instruction from anywhere."
    }
  },
  {
    slug: "date-night",
    title: "Date Night & Couples Creative Experiences",
    subtitle: "Romantic, memorable evenings designed for two with BYOB and candlelight.",
    badge: "COUPLES & DATES",
    icon: "💕",
    coverImage: "/images/classes/approved-05-9e_v3A.webp",
    description:
      "Skip the standard dinner and a movie. Spend quality time creating custom pottery, glowing mosaic art, living terrariums, or custom canvases together.",
    longDescription:
      "Celebrate your connection with an unforgettable shared creative experience. Our signature date night workshops feature mood lighting, romantic music, BYOB-friendly tables, and projects designed specifically for couples to make together — from side-by-side wheel throwing and collaborative pottery chess sets to candlelit mosaic coaster crafting.",
    benefits: [
      "Couples-ticket pricing covering two people with all supplies",
      "Intimate studio atmosphere with candlelight and playlist vibes",
      "BYOB welcome — bring your favorite wine, beer, or mocktails",
      "Create lasting keepsakes together to display at home"
    ],
    filterPattern: /date night|couples|for two|vip date night|mosaicvip/i,
    seo: {
      metaTitle: "Creative Date Night Ideas & Classes in Chicago & Eugene | Color Cocktail Factory",
      metaDescription: "Plan a romantic date night in Chicago (Pilsen) or Eugene. Pottery date night on the wheel, candlelit mosaic art, wine glass painting, and couples terrariums."
    }
  },
  {
    slug: "pottery",
    title: "Pottery & Wheel Throwing Collection",
    subtitle: "Centering, throwing, trimming, handbuilding, and sculptural ceramics.",
    badge: "CLAY & WHEEL",
    icon: "🏺",
    coverImage: "/images/classes/wheel-throwing-for-beginners-color-cocktail-factory-acuity-600x600.jpg",
    description:
      "Immerse yourself in clay. From high-energy wheel throwing sessions to detailed sculptural handbuilding, master foundational ceramic art in our studios.",
    longDescription:
      "Our ceramics collection spans the full spectrum of pottery. Feel the rhythm of the pottery wheel as you center and pull clay into cups, matcha bowls, vases, and plates. Or explore sculptural handbuilding techniques like slab, coil, and pinch-forming to sculpt ceramic mugs, pipes & ashtrays, whimsical mushrooms, Halloween cauldrons, charcuterie boards, and custom pottery chess sets.",
    benefits: [
      "Individual wheel stations with dedicated instructor feedback",
      "Professional non-toxic ceramic clay and studio pottery tools",
      "Optional kiln firing ($10) and professional glazing (from $20) for durable food-safe finishes (~3-week turnaround)",
      "Both single-session intro workshops and open studio options"
    ],
    filterPattern: /pottery|wheel|ceramic|handbuild|clay|cauldron|mug|bowl|vase|ashtray|plate/i,
    seo: {
      metaTitle: "Pottery & Wheel Throwing Classes in Chicago & Eugene | Color Cocktail Factory",
      metaDescription: "Master wheel throwing and ceramic handbuilding. Beginner wheel classes, matcha bowls, ceramic mugs, charcuterie boards, and clay sculpture."
    }
  },
  {
    slug: "glass-and-mosaics",
    title: "Glass Art, Mosaics & Turkish Lamps",
    subtitle: "Vibrant stained glass, handcrafted lamps, and fused glass design.",
    badge: "GLASS & LIGHT",
    icon: "✨",
    coverImage: "/images/classes/approved-09-58b9f7.webp",
    description:
      "Craft with light and color! Design radiant Turkish mosaic lamps, stained glass coasters, and vibrant fused glass jewelry in a dazzling hands-on workshop.",
    longDescription:
      "Discover the ancient art of glass mosaic craft. Arrange geometric glass tiles, glass beads, and mirrored tesserae to construct glowing Turkish lamps, personalized candle holders, or ornamental wall pieces. Our instructors share traditional mosaic patterns and techniques to help you design a radiant centerpiece that illuminates your living space.",
    benefits: [
      "Authentic brass lamp fixtures, handblown glass globes, and LED bulbs included",
      "Hundreds of vibrant glass tile colors, shapes, and bead varieties",
      "Take your lamp or mosaic home the very same day",
      "Relaxing, meditative pattern-making suitable for all skill levels"
    ],
    filterPattern: /mosaic|lamp|turkish|glass fusion|stained glass|fused glass/i,
    seo: {
      metaTitle: "Turkish Lamp & Glass Mosaic Classes in Chicago & Eugene | Color Cocktail Factory",
      metaDescription: "Create custom Turkish mosaic lamps, stained glass art, and glass fusion pieces. Guided craft workshops in Chicago and Eugene."
    }
  },
  {
    slug: "nature-and-aroma",
    title: "Living Plants, Bonsai & Custom Scent Crafts",
    subtitle: "Terrariums, Japanese bonsai styling, organic candle making, and botanical crafts.",
    badge: "BOTANICAL & SCENT",
    icon: "🌿",
    coverImage: "/images/classes/approved-01-HsW-Hv.webp",
    description:
      "Bring the calming energy of nature into your home. Style living bonsai trees, build miniature glass ecosystems, and pour signature organic soy candles.",
    longDescription:
      "Connect with organic materials through botanical styling and artisan fragrance blending. Learn soil composition, humidity balance, and pruning techniques to care for living bonsai trees and moss terrariums. In our aroma workshops, experiment with pure essential oils and botanical toppings to pour clean-burning organic soy candles.",
    benefits: [
      "Live tropical plants, mosses, decorative stones, and glassware provided",
      "Real bonsai trees, ceramic pots, training wire, and pruning tools included",
      "Custom essential oil fragrance blending with 100% natural soy wax",
      "Comprehensive plant and candle care guides to ensure long-lasting beauty"
    ],
    filterPattern: /bonsai|terrarium|candle|aroma|soap|bath/i,
    seo: {
      metaTitle: "Bonsai, Terrarium & Candle Making Classes | Color Cocktail Factory",
      metaDescription: "Hands-on botanical and aroma workshops. Style your own bonsai tree, construct a miniature glass terrarium, or pour custom scented soy candles."
    }
  }
];

export function getCollectionBySlug(slug: string): EventCollection | undefined {
  return COLLECTIONS.find(c => c.slug === slug);
}

export function getSectionsForCollection(collection: EventCollection): SectionConfig[] {
  return sections.filter(section => {
    // Explicitly prevent non-pottery craft sections from leaking into the pottery collection
    if (collection.slug === "pottery") {
      const nonPotteryIds = ["mosaic", "turkish", "candle", "bonsai", "terrarium", "painting", "glass-blowing", "glass-fusion", "wine-glass", "paper-pigment"];
      if (nonPotteryIds.includes(section.id)) return false;
    }
    const text = `${section.id} ${section.navLabel} ${section.heroTitle} ${section.heroDescription} ${section.slug} ${(section.tags || []).join(" ")}`;
    return collection.filterPattern.test(text);
  });
}
