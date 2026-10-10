import fs from "fs";
import { ACTIVITY_MANIFEST, APPROVED_PHOTOS } from "../lib/homepage/manifest";
import { sections } from "../lib/config";

const ready = ACTIVITY_MANIFEST.filter(a => a.eligibility === "ready");

function getSlug(a: typeof ready[0]): string {
  const t = a.title.toLowerCase();
  if (a.mode === "online") return "online-cauldron";
  if (t.includes("cauldron")) return "cauldron-pottery";
  if (t.includes("date night") && t.includes("wheel")) return "date-night-wheel";
  if (t.includes("wheel throwing for beginners") || t.includes("cup creations on the wheel") || (t.includes("cup creations") && a.city === "eugene") || (t.includes("matcha") && a.city === "eugene")) {
    return "beginner-wheel";
  }
  if (t.includes("matcha bowl on the wheel")) return "matcha-bowl";
  if (t.includes("turkish mosaic lamp") || t.includes("hanging turkish") || t.includes("date night turkish")) {
    return "turkish-lamp";
  }
  if (t.includes("ceramic mug and a bowl")) return "mug-and-bowl";
  if (t.includes("date night terrarium")) return "date-night-terrarium";
  if (t.includes("terrarium")) return "terrarium";
  if (t.includes("mosaic creations")) return "mosaic";
  if (t.includes("date night candle")) return "date-night-candle";
  if (t.includes("candle making")) return "candle-making";
  if (t.includes("vip date night painting")) return "vip-date-night-painting";
  if (t.includes("cat vase")) return "cat-vase";
  if (t.includes("clay pumpkin")) return "clay-pumpkin";
  if (t.includes("glass fusion")) return "glass-fusion";
  if (t.includes("vip date night bonsai")) return "vip-date-night-bonsai";
  if (t.includes("bonsai")) return "bonsai";
  if (t.includes("date night on fire")) return "date-night-on-fire";
  if (t.includes("paint your own pottery")) return "paint-pottery";
  if (t.includes("wine glass painting")) return "wine-glass-painting";
  if (t.includes("mushroom pottery")) return "mushroom-pottery";
  if (t.includes("watercolor for beginners")) return "watercolor";
  if (t.includes("ghost pottery")) return "ghost";
  if (t.includes("oogie boogie")) return "oogie-boogie";
  if (t.includes("monster lantern")) return "monster-lantern";
  if (t.includes("charcuterie board")) return "charcuterie-board";
  if (t.includes("handbuilt vase")) return "handbuilt-vase";
  if (t.includes("duck soap")) return "duck-soap-holder";
  if (t.includes("soap making")) return "soap";
  if (t.includes("open studio")) return "open-studio";
  if (t.includes("pumpkin on the wheel")) return "wheel-pumpkin";
  if (t.includes("ceramic chess")) return "ceramic-chess";
  if (t.includes("date night watercolor")) return "date-night-watercolor";
  if (t.includes("vase making on the wheel")) return "wheel-vase";
  if (t.includes("make & paint on the wheel")) return "make-and-paint-wheel";
  if (t.includes("pipe & ashtray")) return "pipe-and-ashtray";
  if (t.includes("boobs coffee")) return "boobs-mug";
  if (t.includes("dildos pottery")) return "dildos-and-bottles";
  if (t.includes("pussy pottery")) return "pussy-pottery";
  return a.key.replace(/^(chicago|eugene|online)-/, "");
}

// Group ready items by slug
const groupedManifest = new Map<string, typeof ready>();
for (const a of ready) {
  const s = getSlug(a);
  if (!groupedManifest.has(s)) groupedManifest.set(s, []);
  groupedManifest.get(s)!.push(a);
}

// Map existing section config by slug
const sectionBySlug = new Map(sections.map(s => [s.slug, s]));

// Construct all entries
const registryEntries: Record<string, any> = {};

for (const [slug, items] of groupedManifest.entries()) {
  const primary = items[0];
  const sec = sectionBySlug.get(slug);

  const chicagoItem = items.find(i => i.city === "chicago");
  const eugeneItem = items.find(i => i.city === "eugene");
  const onlineItem = items.find(i => i.city === "online");

  const hasChicago = Boolean(chicagoItem);
  const hasEugene = Boolean(eugeneItem);
  const isOnline = Boolean(onlineItem);

  let locationsOffered: "Chicago & Eugene" | "Chicago only" | "Eugene only" | "Live online" = "Chicago & Eugene";
  if (isOnline) locationsOffered = "Live online";
  else if (hasChicago && hasEugene) locationsOffered = "Chicago & Eugene";
  else if (hasChicago) locationsOffered = "Chicago only";
  else if (hasEugene) locationsOffered = "Eugene only";

  const isPottery = !isOnline && /pottery|wheel|clay|mug|bowl|vase|dildo|pussy|ashtray|cauldron|chess|pumpkin|lantern|ceramic/i.test(primary.title);
  const coversTwo = /two|couple|for two|date night/i.test(primary.title + " " + primary.description);

  let category: any = "mud-room";
  let categoryLabel = "Mud Room";
  let categoryIcon = "🏺";
  let categoryColorClass = "category-mud";
  let overlayClass = "gradient-overlay-mud";

  if (coversTwo || /date night/i.test(primary.title)) {
    category = "romance-room";
    categoryLabel = "Romance Room";
    categoryIcon = "💕";
    categoryColorClass = "category-romance";
    overlayClass = "gradient-overlay-romance";
  } else if (/glass|mosaic|lamp/i.test(primary.title)) {
    category = "glass-room";
    categoryLabel = "Glass Room";
    categoryIcon = "✨";
    categoryColorClass = "category-glass";
    overlayClass = "gradient-overlay-glass";
  } else if (/bonsai|terrarium/i.test(primary.title)) {
    category = "roots-room";
    categoryLabel = "Roots Room";
    categoryIcon = "🌱";
    categoryColorClass = "category-roots";
    overlayClass = "gradient-overlay-roots";
  } else if (/candle|wine glass|soap/i.test(primary.title)) {
    category = "crush-create";
    categoryLabel = "Crush & Create";
    categoryIcon = "🕯️";
    categoryColorClass = "category-crush";
    overlayClass = "gradient-overlay-crush";
  } else if (/watercolor|painting/i.test(primary.title)) {
    category = "paper-pigment";
    categoryLabel = "Paper & Pigment";
    categoryIcon = "🎨";
    categoryColorClass = "category-paper";
    overlayClass = "gradient-overlay-paper";
  }

  let ticketUnit = "per person";
  if (coversTwo) {
    ticketUnit = "for two";
  } else if (isOnline) {
    ticketUnit = "per ticket";
  }

  const destinations: Record<string, any> = {};
  if (chicagoItem) {
    destinations.chicago = {
      city: "chicago",
      appointmentTypeId: chicagoItem.appointmentTypeId,
      calendarIds: chicagoItem.calendarIds,
      bookingUrl: chicagoItem.bookingUrl,
      priceUnit: coversTwo ? "for two" : "per person",
      verifiedTitle: chicagoItem.acuityTitle,
    };
  }
  if (eugeneItem) {
    destinations.eugene = {
      city: "eugene",
      appointmentTypeId: eugeneItem.appointmentTypeId,
      calendarIds: eugeneItem.calendarIds,
      bookingUrl: eugeneItem.bookingUrl,
      priceUnit: coversTwo ? "for two" : "per person",
      verifiedTitle: eugeneItem.acuityTitle,
    };
  }
  if (onlineItem) {
    destinations.online = {
      city: "online",
      appointmentTypeId: onlineItem.appointmentTypeId,
      calendarIds: onlineItem.calendarIds,
      bookingUrl: onlineItem.bookingUrl,
      priceUnit: "per ticket",
      verifiedTitle: onlineItem.acuityTitle,
    };
  }

  const title = sec ? sec.heroTitle : primary.title;
  const navLabel = sec ? sec.navLabel : primary.title.split(" - ")[0].split(":")[0];
  const heroDescription = sec ? sec.heroDescription : primary.description;
  const shortDescription = primary.description;

  const experienceList = [
    {
      title: "Guided Instruction & Atmosphere",
      body: `Join our instructors for an engaging, hands-on session creating ${title.toLowerCase()}. Our studio provides a welcoming, low-pressure atmosphere where everyone can explore their creative side.`
    },
    {
      title: "Materials & Equipment Provided",
      body: `All materials, tools, and personalized artist coaching are provided for the duration of the workshop. ${isPottery ? "For wheel throwing, this class focuses on the craft and attempt of shaping clay without guaranteeing a finished piece on your first try." : ""}`
    }
  ];

  const practicalInfoList = [
    { label: "BYOB Friendly", text: isOnline ? "Enjoy your favorite drinks from the comfort of your home." : "Feel free to bring your favorite drinks. Must be 21+ for alcohol. Cups and openers are available in the studio." },
    { label: "Location", text: isOnline ? "Live online—join from home via video call with materials kit delivered." : (hasChicago && hasEugene ? "Offered in Chicago (1142 W. 18th St) and Eugene (3295 Cross St)." : (hasChicago ? "Studio located at 1142 W. 18th Street, Chicago, IL 60608." : "Studio located at 3295 Cross Street, Eugene, OR 97402.")) }
  ];

  const faqsList = sec ? sec.faqs.map(f => ({
    q: f.q,
    // Replace obsolete $5 firing references
    a: f.a.replace(/\$5\/item|\$5 per item/g, "optional bisque firing starts at $10/piece and glazing at $20/piece (approx. three-week turnaround)")
  })) : [
    { q: "Do I need any previous experience?", a: "No! All of our workshops are structured to be beginner-friendly with step-by-step guidance from our resident artists." },
    { q: "What should I wear?", a: isPottery ? "Wear comfortable clothes you don't mind getting dusty or splashed with clay. Clay washes out of most fabrics." : "Comfortable casual clothes are perfect." },
    { q: "Can I bring my own drinks?", a: "Yes, our adult evening sessions are BYOB friendly (21+ for alcohol)." }
  ];

  registryEntries[slug] = {
    slug,
    title,
    navLabel,
    heroTitle: title,
    heroDescription,
    shortDescription,
    category,
    categoryLabel,
    categoryIcon,
    categoryColorClass,
    overlayClass,
    isPottery,
    coversTwo,
    coversNote: coversTwo ? "One ticket covers two people" : undefined,
    duration: sec?.scheduleRows?.[0]?.time?.includes("min") ? sec.scheduleRows[0].time : "90–120 minutes",
    ticketUnit,
    beginnerFriendly: true,
    locationsOffered,
    image: primary.image,
    whatYouMake: title,
    theExperience: experienceList,
    included: ["All required tools and materials", "Step-by-step artist instruction", "Studio cleanup handled by CCF staff"],
    practicalInfo: practicalInfoList,
    faqs: faqsList,
    tags: sec ? sec.tags : [title, "Workshop", "Hands-on", "BYOB"],
    valueCards: sec ? sec.valueCards : [
      { label: "GUIDED", title: "Expert Support", body: "Hands-on coaching throughout the workshop." },
      { label: "ALL-INCLUSIVE", title: "Materials Provided", body: "All studio tools and supplies ready for you." },
      { label: "RELAXED", title: "BYOB Friendly", body: "Unwind with your favorite drinks and playlist." }
    ],
    scheduleRows: sec ? sec.scheduleRows : [],
    destinations
  };
}

// Add remaining legacy sections if not yet added
for (const sec of sections) {
  if (!registryEntries[sec.slug]) {
    const isPottery = sec.id === "handbuilding";
    const coversTwo = sec.id === "date-night";
    registryEntries[sec.slug] = {
      slug: sec.slug,
      title: sec.heroTitle,
      navLabel: sec.navLabel,
      heroTitle: sec.heroTitle,
      heroDescription: sec.heroDescription,
      shortDescription: sec.heroDescription,
      category: "special",
      categoryLabel: "Special Events",
      categoryIcon: "🎉",
      categoryColorClass: "category-private",
      overlayClass: sec.overlayClass || "gradient-overlay-private",
      isPottery,
      coversTwo,
      coversNote: coversTwo ? "One ticket covers two people" : undefined,
      duration: "90–120 minutes",
      ticketUnit: coversTwo ? "for two" : "per person",
      beginnerFriendly: true,
      locationsOffered: "Chicago & Eugene",
      image: APPROVED_PHOTOS[0],
      whatYouMake: sec.heroTitle,
      theExperience: [
        { title: "Creative Experience", body: sec.heroDescription }
      ],
      included: ["All required materials", "Expert instruction"],
      practicalInfo: [
        { label: "Locations", text: "Offered in Chicago and Eugene studios." }
      ],
      faqs: sec.faqs.map(f => ({
        q: f.q,
        a: f.a.replace(/\$5\/item|\$5 per item/g, "optional bisque firing starts at $10/piece and glazing at $20/piece (approx. three-week turnaround)")
      })),
      tags: sec.tags,
      valueCards: sec.valueCards,
      scheduleRows: sec.scheduleRows,
      destinations: {
        chicago: {
          city: "chicago",
          appointmentTypeId: 79006616,
          calendarIds: [12216179],
          bookingUrl: "https://colorcocktailfactory.as.me/",
          priceUnit: "per person",
          verifiedTitle: sec.heroTitle
        }
      }
    };
  }
}

console.log("Total entries in registry:", Object.keys(registryEntries).length);

// Generate typescript code
const fileContent = `/**
 * Centralized Activity Registry
 * Authoritative source of truth for all active workshops, descriptions, verified Acuity destinations,
 * and location routing.
 */

export type ActivityDestination = {
  city: "chicago" | "eugene" | "online";
  appointmentTypeId: number;
  calendarIds: number[];
  bookingUrl: string;
  priceUnit?: string;
  verifiedTitle?: string;
};

export type ActivityDetail = {
  slug: string;
  title: string;
  navLabel: string;
  heroTitle: string;
  heroDescription: string;
  shortDescription: string;
  category: "mud-room" | "glass-room" | "roots-room" | "crush-create" | "paper-pigment" | "romance-room" | "family" | "special";
  categoryLabel: string;
  categoryIcon: string;
  categoryColorClass: string;
  overlayClass: string;
  isPottery: boolean;
  coversTwo: boolean;
  coversNote?: string;
  duration: string;
  ticketUnit: string;
  beginnerFriendly: boolean;
  locationsOffered: "Chicago & Eugene" | "Chicago only" | "Eugene only" | "Live online";
  image: {
    path: string;
    alt: string;
    width: number;
    height: number;
    focalPosition?: string;
    filename?: string;
    driveFileId?: string;
  };
  whatYouMake: string;
  theExperience: { title: string; body: string }[];
  included: string[];
  practicalInfo: { label: string; text: string }[];
  faqs: { q: string; a: string }[];
  tags: string[];
  valueCards: { label: string; title: string; body: string }[];
  scheduleRows?: { time: string; note?: string; href?: string }[];
  destinations: {
    chicago?: ActivityDestination;
    eugene?: ActivityDestination;
    online?: ActivityDestination;
  };
};

export const ACTIVITY_REGISTRY: Record<string, ActivityDetail> = ${JSON.stringify(registryEntries, null, 2)};

export function getAllActivityDetails(): ActivityDetail[] {
  return Object.values(ACTIVITY_REGISTRY);
}

export function getActivityDetailBySlug(slug: string): ActivityDetail | undefined {
  return ACTIVITY_REGISTRY[slug];
}

export function getAllActivitySlugs(): string[] {
  return Object.keys(ACTIVITY_REGISTRY);
}

export function getBookingDestinations(slug: string): ActivityDetail["destinations"] | undefined {
  return ACTIVITY_REGISTRY[slug]?.destinations;
}
`;

fs.writeFileSync("lib/activityRegistry.ts", fileContent);
console.log("Successfully wrote lib/activityRegistry.ts!");
