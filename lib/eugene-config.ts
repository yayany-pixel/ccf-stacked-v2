import type { SectionConfig } from "./config";
import { sections as baseSections, giftCardUrl, PRIVATE_EVENT_EMAIL } from "./config";

const placeholderVideo = "/videos/placeholder.mp4";

/**
 * Eugene-specific section ordering with category groupings
 * Order: Private Party, Date Night, Bonsai, Turkish Mosaic Lamp, 
 * Handbuilding Pottery (grouped), Pigment Lab (grouped), Aroma (grouped), Etc (grouped)
 */

// Helper to find base section by ID
const getBaseSection = (id: string): SectionConfig | undefined => 
  baseSections.find(s => s.id === id);

// Create grouped section for Handbuilding Pottery
const handbuildingGroup: SectionConfig = {
  id: "handbuilding-group",
  anchorId: "handbuilding",
  navLabel: "Handbuilding Pottery",
  slug: "handbuilding",
  videoSrc: placeholderVideo,
  overlayClass: "bg-gradient-to-br from-amber-900/55 via-slate-900/30 to-rose-900/45",

  scheduleLabel: "POPULAR CLASSES",
  scheduleTitle: "Handbuilding Pottery",
  schedulePill: "POTTERY",
  scheduleRows: [
    { time: "Multiple techniques available", note: "Choose your style" }
  ],

  badge: "CLAY · HANDS · CREATE",
  heroTitle: "Handbuilding Pottery",
  heroDescription:
    "Explore various handbuilding techniques from Kurinuki to sculptural forms. No wheel needed - just your hands and creativity.",
  primaryCta: { label: "Browse Classes", kind: "booking" },
  secondaryCta: { label: "Details + FAQs", kind: "detail" },
  tags: ["Handbuilding", "Sculptural", "Beginner-friendly", "Creative freedom"],
  valueCards: [
    { label: "STYLE", title: "Multiple techniques", body: "From carving to building, find your method." },
    { label: "RESULT", title: "Unique pieces", body: "Functional art you'll treasure." },
    { label: "VIBE", title: "Hands-on zen", body: "Meditative and rewarding." }
  ],
  booking: { term: "handbuilding" },
  faqs: [
    { q: "Do I need wheel experience?", a: "No - handbuilding uses different techniques." },
    { q: "What can I make?", a: "Cups, bowls, vases, sculptural pieces, and more." },
    { q: "How long does it take?", a: "Most classes are 2-3 hours." }
  ],
  relatedSlugs: ["date-night-wheel", "gift-cards"],
  
  // Sub-classes for handbuilding
  subClasses: [
    { label: "Kurinuki", slug: "kurinuki" },
    { label: "Bunny Cup", slug: "bunny-cup" },
    { label: "Cat Vase", slug: "cat-vase" },
    { label: "Pipe & Ashtray", slug: "pipe-ashtray" },
    { label: "Dildos", slug: "dildos" },
    { label: "Vulva Cup", slug: "vulva-cup" },
    { label: "Cup & Bowl", slug: "cup-bowl" },
    { label: "Sake Set", slug: "sake-set" },
    { label: "Heart Bowl", slug: "heart-bowl" }
  ]
};

// Create grouped section for Pigment Lab
const pigmentLabGroup: SectionConfig = {
  id: "pigment-lab-group",
  anchorId: "pigment-lab",
  navLabel: "Pigment Lab",
  slug: "paper-pigment",
  videoSrc: placeholderVideo,
  overlayClass: "bg-gradient-to-br from-sky-900/45 via-indigo-900/25 to-amber-900/35",

  scheduleLabel: "PAINTING & COLOR",
  scheduleTitle: "Pigment Lab",
  schedulePill: "ART",
  scheduleRows: [
    { time: "Various painting classes", note: "All mediums welcome" }
  ],

  badge: "PAINT · COLOR · EXPRESS",
  heroTitle: "Pigment Lab",
  heroDescription:
    "Explore color and technique across watercolor, oil, acrylics, and more. From traditional painting to creative experiments.",
  primaryCta: { label: "Browse Classes", kind: "booking" },
  secondaryCta: { label: "Details + FAQs", kind: "detail" },
  tags: ["Painting", "Watercolor", "Oil", "Beginner-friendly", "Online options"],
  valueCards: [
    { label: "STYLE", title: "Multiple mediums", body: "Watercolor, oil, acrylic, and specialty techniques." },
    { label: "RESULT", title: "Your artwork", body: "Take home finished paintings." },
    { label: "VIBE", title: "Creative exploration", body: "Experiment and express." }
  ],
  booking: { term: "painting" },
  faqs: [
    { q: "Do I need experience?", a: "No - we welcome all skill levels." },
    { q: "What supplies do I need?", a: "All supplies provided in class." },
    { q: "Are there online options?", a: "Yes - check listings for virtual sessions." }
  ],
  relatedSlugs: ["wine-glass-painting", "gift-cards"],
  
  // Sub-classes for Pigment Lab
  subClasses: [
    { label: "Wax Painting", slug: "wax-painting" },
    { label: "Watercolor", slug: "watercolor" },
    { label: "Online Painting Sessions", slug: "online-painting" },
    { label: "Oil Painting Class", slug: "oil-painting" },
    { label: "Paint Pottery", slug: "paint-pottery" },
    { label: "Wine Glass Painting", slug: "wine-glass-painting" },
    { label: "Rock Painting", slug: "rock-painting" },
    { label: "Paint Your Own Pet", slug: "paint-your-pet" },
    { label: "Egg Tempera Painting", slug: "egg-tempera" },
    { label: "Tie Dye", slug: "tie-dye" }
  ]
};

// Create grouped section for Aroma
const aromaGroup: SectionConfig = {
  id: "aroma-group",
  anchorId: "aroma",
  navLabel: "Aroma",
  slug: "candle-making",
  videoSrc: placeholderVideo,
  overlayClass: "bg-gradient-to-br from-amber-900/50 via-rose-900/25 to-slate-900/40",

  scheduleLabel: "SCENT & CRAFT",
  scheduleTitle: "Aroma",
  schedulePill: "COZY",
  scheduleRows: [
    { time: "Various crafting classes", note: "Scent-focused experiences" }
  ],

  badge: "SCENT · CRAFT · GLOW",
  heroTitle: "Aroma",
  heroDescription:
    "Create scented experiences: from hand-poured candles to artisan soaps and fizzy bath bombs. Take home your cozy creations.",
  primaryCta: { label: "Browse Classes", kind: "booking" },
  secondaryCta: { label: "Details + FAQs", kind: "detail" },
  tags: ["Candles", "Soaps", "Bath", "Cozy", "Take-home"],
  valueCards: [
    { label: "STYLE", title: "Scent design", body: "Create your signature blend." },
    { label: "RESULT", title: "Handmade products", body: "Candles, soaps, and bath bombs to use or gift." },
    { label: "VIBE", title: "Relaxing craft", body: "Cozy and creative." }
  ],
  booking: { term: "candle" },
  faqs: [
    { q: "Can I choose my scents?", a: "Yes - you design your own blends." },
    { q: "Do I take them home same day?", a: "Yes, after a short cooling/setting period." },
    { q: "Is this good for groups?", a: "Absolutely - perfect for parties." }
  ],
  relatedSlugs: ["wine-glass-painting", "gift-cards"],
  
  // Sub-classes for Aroma
  subClasses: [
    { label: "Candle Making", slug: "candle-making" },
    { label: "Soap Making", slug: "soap-making" },
    { label: "Bath Bomb Making", slug: "bath-bombs" }
  ]
};

// Create grouped section for Etc
const etcGroup: SectionConfig = {
  id: "etc-group",
  anchorId: "etc",
  navLabel: "Etc",
  slug: "terrarium",
  videoSrc: placeholderVideo,
  overlayClass: "bg-gradient-to-br from-lime-900/40 via-emerald-900/20 to-sky-900/45",

  scheduleLabel: "SATURDAY WORKSHOP",
  scheduleTitle: "Terrarium & Crafts",
  schedulePill: "NATURE",
  scheduleRows: [
    { time: "Sat · 3:30–5:00 PM", note: "$35 / person" }
  ],

  badge: "CREATE · EXPLORE · UNIQUE",
  heroTitle: "Terrarium & Specialty Crafts",
  heroDescription:
    "Build a living miniature garden inside glass! Learn how ecosystems work, layer plants and decorative stones, and take home your living creation.",
  primaryCta: { label: "Book Terrarium", kind: "booking" },
  secondaryCta: { label: "Details + FAQs", kind: "detail" },
  tags: ["Nature", "Plants", "Beginner-friendly", "Home decor"],
  valueCards: [
    { label: "STYLE", title: "Living garden", body: "Design your miniature ecosystem inside glass." },
    { label: "RESULT", title: "Same-day take home", body: "Low-maintenance plants that thrive with ease." },
    { label: "VIBE", title: "Relaxing zen", body: "Soothing, social, and creative." }
  ],
  booking: { term: "terrarium" },
  bookingLinks: {
    eventbrite: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161151929",
    acuity: "https://colorcocktailfactory.as.me/terrarium",
  },
  upcomingTimes: [
    { label: "Sat Oct 10 · 3:30 PM", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161151929" },
    { label: "Sat Oct 17 · 3:30 PM", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161155941" },
    { label: "Sat Oct 24 · 3:30 PM", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161165971" },
    { label: "Sat Oct 31 · 3:30 PM", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161170986" },
    { label: "Sat Nov 7 · 3:30 PM", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161176001" },
    { label: "Sat Nov 14 · 3:30 PM", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161183022" },
    { label: "Sat Nov 21 · 3:30 PM", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161186031" },
    { label: "Sat Nov 28 · 3:30 PM", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161192049" },
    { label: "Sat Dec 5 · 3:30 PM", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161198067" },
    { label: "Sat Dec 12 · 3:30 PM", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161208097" },
    { label: "Sat Dec 19 · 3:30 PM", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161214115" },
  ],
  faqs: [
    { q: "Are these beginner-friendly?", a: "Yes - we guide you through each technique." },
    { q: "What's included?", a: "All materials and instruction provided." },
    { q: "Can I book privately?", a: "Yes - see Private Events for group options." }
  ],
  relatedSlugs: ["private-parties", "gift-cards"],
  
  // Sub-classes for Etc
  subClasses: [
    { label: "Terrarium", slug: "terrarium" },
    { label: "Glass Fusion", slug: "glass-fusion" },
    { label: "Glass Blowing", slug: "glass-blowing" }
  ]
};

const getEugeneBonsaiSection = (): SectionConfig => {
  const baseBonsai = getBaseSection("bonsai")!;
  return {
    ...baseBonsai,
    scheduleRows: [
      { time: "Sat · 4:30–6:30 PM", note: "$75 / person · $150 / couple" },
    ],
    bookingLinks: {
      eventbrite: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159600288",
      acuity: "https://colorcocktailfactory.as.me/?appointmentType=94058299",
    },
    upcomingTimes: [
      { label: "Sat Oct 10 · 4:30 PM", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159600288" },
      { label: "Sat Oct 17 · 4:30 PM", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159555153" },
      { label: "Sat Oct 24 · 4:30 PM", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159607309" },
      { label: "Sat Oct 31 · 4:30 PM", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159613327" },
      { label: "Sat Nov 7 · 4:30 PM", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159619345" },
      { label: "Sat Nov 14 · 4:30 PM", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159625363" },
      { label: "Sat Nov 21 · 4:30 PM", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159630378" },
      { label: "Sat Nov 28 · 4:30 PM", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159638402" },
    ],
  };
};

/**
 * Eugene-specific section order
 */
export const eugeneSections: SectionConfig[] = [
  getBaseSection("private")!,       // 1. Private Party
  getBaseSection("date-night")!,    // 2. Date Night
  getEugeneBonsaiSection(),         // 3. Bonsai
  getBaseSection("turkish")!,       // 4. Turkish Mosaic Lamp
  handbuildingGroup,                // 5. Handbuilding Pottery (with sub-classes)
  pigmentLabGroup,                  // 6. Pigment Lab (with sub-classes)
  aromaGroup,                       // 7. Aroma (with sub-classes)
  etcGroup                          // 8. Etc (with sub-classes)
].filter(Boolean); // Filter out any undefined sections
