import type { SectionConfig } from "./config";
import { sections as baseSections, giftCardUrl, PRIVATE_EVENT_EMAIL } from "./config";

const placeholderVideo = "/videos/placeholder.mp4";

/**
 * Eugene-specific section ordering with category groupings
 * Order: Private Party, Date Night (all formats), Beginner Wheel, Handbuilding Pottery, Bonsai,
 * Terrarium & Specialty Crafts, Pigment Lab, Aroma, Mosaic Art & Lamps
 */

// Helper to find base section by ID
const getBaseSection = (id: string): SectionConfig | undefined => 
  baseSections.find(s => s.id === id);

// Date Night on the Wheel with real Eugene booking links and upcoming slots
const getEugeneDateNightSection = (): SectionConfig => {
  const base = getBaseSection("date-night")!;
  return {
    ...base,
    scheduleRows: [
      { time: "Daily & weekend sessions", note: "$50 / ticket · 28+ sessions scheduled" },
    ],
    bookingLinks: {
      eventbrite: "https://www.eventbrite.com/e/eugene-date-night-on-the-wheel-tickets-1991520757195",
      acuity: "https://colorcocktailfactory.as.me/DatenightEugene",
    },
    upcomingTimes: [
      { label: "Fri Oct 9 · 5:00 PM", url: "https://www.eventbrite.com/e/eugene-date-night-on-the-wheel-tickets-1991520757195" },
      { label: "Fri Oct 9 · 7:00 PM", url: "https://www.eventbrite.com/e/eugene-date-night-on-the-wheel-tickets-2002772291838" },
      { label: "Fri Oct 9 · 7:30 PM", url: "https://www.eventbrite.com/e/eugene-date-night-on-the-wheel-tickets-1991520758198" },
      { label: "Sat Oct 10 · 2:30 PM", url: "https://www.eventbrite.com/e/eugene-date-night-on-the-wheel-tickets-1991520892600" },
      { label: "Sat Oct 10 · 7:30 PM", url: "https://www.eventbrite.com/e/eugene-date-night-on-the-wheel-tickets-1991520893603" },
      { label: "Sun Oct 11 · 2:30 PM", url: "https://www.eventbrite.com/e/eugene-date-night-on-the-wheel-tickets-1991521027003" },
      { label: "Mon Oct 12 · 7:00 PM", url: "https://www.eventbrite.com/e/eugene-date-night-on-the-wheel-tickets-1991521028006" },
      { label: "Tue Oct 13 · 7:00 PM", url: "https://www.eventbrite.com/e/eugene-date-night-on-the-wheel-tickets-1991521029009" },
    ],
    subClasses: [
      { label: "Wheel Date Night", slug: "date-night-wheel" },
      { label: "Date Night Terrarium", slug: "terrarium" },
      { label: "Watercolor for Two", slug: "paper-pigment" },
      { label: "VIP Bonsai Date Night", slug: "bonsai" },
      { label: "VIP Paint Night", slug: "paper-pigment" },
      { label: "Ceramic Chess Set", slug: "handbuilding" },
      { label: "Mosaic Date Night", slug: "mosaic" },
    ],
  };
};

// Beginner Wheel Throwing (Matcha Bowl and Cup Creations)
const getEugeneBeginnerWheelSection = (): SectionConfig => {
  const base = getBaseSection("beginner-wheel")!;
  return {
    ...base,
    scheduleLabel: "BEGINNER WORKSHOP",
    scheduleTitle: "Wheel Throwing for Beginners",
    schedulePill: "POTTERY",
    scheduleRows: [
      { time: "Evenings & weekends · 7:00 PM", note: "$25 / person · Matcha Bowls & Cup Creations" },
    ],
    heroTitle: "Wheel Throwing for Beginners",
    heroDescription:
      "Your first spin on the wheel! Learn centering, pulling, and shaping with hands-on coaching in Eugene. Create functional matcha bowls or custom cup creations.",
    bookingLinks: {
      eventbrite: "https://www.eventbrite.com/e/eugene-wheel-throwing-for-beginners-cup-creations-tickets-2002688256486",
      acuity: "https://colorcocktailfactory.as.me/eugenewheelthrowing",
    },
    upcomingTimes: [
      { label: "Fri Oct 9 · 7:00 PM · Cup Creations", url: "https://www.eventbrite.com/e/eugene-wheel-throwing-for-beginners-cup-creations-tickets-2002688256486" },
      { label: "Sat Oct 10 · 7:00 PM · Matcha Bowl", url: "https://www.eventbrite.com/e/eugene-wheel-throwing-for-beginners-matcha-bowl-tickets-2002689633605" },
      { label: "Mon Oct 12 · 7:00 PM · Matcha Bowl", url: "https://colorcocktailfactory.as.me/eugenewheelthrowing" },
      { label: "Tue Oct 13 · 7:00 PM · Cup Creations", url: "https://colorcocktailfactory.as.me/?appointmentType=93539343" },
      { label: "Fri Oct 16 · 7:00 PM · Cup Creations", url: "https://colorcocktailfactory.as.me/?appointmentType=93539343" },
      { label: "Sat Oct 17 · 7:00 PM · Matcha Bowl", url: "https://colorcocktailfactory.as.me/eugenewheelthrowing" },
    ],
    subClasses: [
      { label: "Matcha Bowl", slug: "beginner-wheel" },
      { label: "Cup Creations", slug: "beginner-wheel" },
    ],
  };
};

// Create grouped section for Handbuilding Pottery with real Eugene classes
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
    { time: "Daily 6:00–8:45 PM slots", note: "$25–$85 · Multiple popular projects" }
  ],

  badge: "CLAY · HANDS · CREATE",
  heroTitle: "Handbuilding Pottery",
  heroDescription:
    "Explore diverse handbuilding techniques in Eugene. Sculpt ceramic mugs and bowls, pipes & ashtrays, whimsical mushrooms, charcuterie boards, ceramic chess sets, cauldrons, duck soap holders, and festive candle holders.",
  primaryCta: { label: "Browse Classes", kind: "booking" },
  secondaryCta: { label: "Details + FAQs", kind: "detail" },
  tags: ["Handbuilding", "Sculptural", "Beginner-friendly", "Creative freedom"],
  valueCards: [
    { label: "STYLE", title: "Multiple techniques", body: "From pinch and coil to slab-building, find your method." },
    { label: "RESULT", title: "Unique pieces", body: "Functional art you'll treasure." },
    { label: "VIBE", title: "Hands-on zen", body: "Meditative and rewarding." }
  ],
  booking: { term: "handbuilding" },
  bookingLinks: {
    eventbrite: "https://www.eventbrite.com/e/eugene-ceramic-mug-and-a-bowl-tickets-2002688244450",
    acuity: "https://colorcocktailfactory.as.me/Handbuilding101",
  },
  upcomingTimes: [
    { label: "Fri Oct 9 · 6:00 PM · Mug & Bowl", url: "https://www.eventbrite.com/e/eugene-ceramic-mug-and-a-bowl-tickets-2002688244450" },
    { label: "Fri Oct 9 · 6:10 PM · Pipe & Ashtray", url: "https://www.eventbrite.com/e/eugene-pipe-and-ashtray-making-class-tickets-2002688245453" },
    { label: "Fri Oct 9 · 6:15 PM · Clay Cauldron", url: "https://www.eventbrite.com/e/spin-a-spell-make-your-own-clay-cauldron-tickets-2002688249465" },
    { label: "Fri Oct 9 · 6:20 PM · Mushroom Pottery", url: "https://www.eventbrite.com/e/eugene-mushroom-pottery-tickets-2002688250468" },
    { label: "Fri Oct 9 · 6:35 PM · Charcuterie Board", url: "https://www.eventbrite.com/e/eugene-make-your-own-charcuterie-board-tickets-2002688251471" },
    { label: "Fri Oct 9 · 6:45 PM · Ceramic Chess Set", url: "https://www.eventbrite.com/e/date-night-make-your-own-ceramic-chess-set-tickets-2002688253477" },
    { label: "Sat Oct 10 · 6:00 PM · Mug & Bowl", url: "https://www.eventbrite.com/e/eugene-ceramic-mug-and-a-bowl-tickets-2002689619563" },
    { label: "Sat Oct 10 · 6:15 PM · Halloween Candle Holder", url: "https://www.eventbrite.com/e/oogie-boogie-inspired-candle-holder-halloween-pottery-tickets-2002689627587" },
    { label: "Sat Oct 10 · 6:20 PM · Mushroom Pottery", url: "https://www.eventbrite.com/e/eugene-mushroom-pottery-tickets-2002689629593" },
    { label: "Sat Oct 10 · 6:35 PM · Charcuterie Board", url: "https://www.eventbrite.com/e/eugene-make-your-own-charcuterie-board-tickets-2002689630596" },
    { label: "Sat Oct 10 · 6:45 PM · Ceramic Chess Set", url: "https://www.eventbrite.com/e/date-night-make-your-own-ceramic-chess-set-tickets-2002689632602" },
  ],
  faqs: [
    { q: "Do I need wheel experience?", a: "No - handbuilding uses different techniques." },
    { q: "What can I make?", a: "Cups, bowls, vases, sculptural pieces, and more." },
    { q: "How long does it take?", a: "Most classes are 2-3 hours." }
  ],
  relatedSlugs: ["date-night-wheel", "gift-cards"],
  
  // Sub-classes for Eugene handbuilding
  subClasses: [
    { label: "Ceramic Mug & Bowl", slug: "cup-bowl" },
    { label: "Pipe & Ashtray", slug: "pipe-ashtray" },
    { label: "Mushroom Pottery", slug: "mushroom-pottery" },
    { label: "Charcuterie Board", slug: "charcuterie-board" },
    { label: "Ceramic Chess Set", slug: "chess-set" },
    { label: "Clay Cauldron", slug: "clay-cauldron" },
    { label: "Duck Soap Holder", slug: "duck-soap-holder" },
    { label: "Halloween Candle Holder", slug: "oogie-boogie" },
  ]
};

// Create grouped section for Pigment Lab with real Eugene painting offerings
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
    { time: "Evenings 5:00–7:45 PM", note: "$35–$100 · All supplies included" }
  ],

  badge: "PAINT · COLOR · EXPRESS",
  heroTitle: "Pigment Lab",
  heroDescription:
    "Explore color and technique across watercolor painting for two, wine glass painting, and VIP paint nights. All supplies and guided instruction included.",
  primaryCta: { label: "Browse Classes", kind: "booking" },
  secondaryCta: { label: "Details + FAQs", kind: "detail" },
  tags: ["Painting", "Watercolor", "Wine Glass", "Beginner-friendly", "Date Night"],
  valueCards: [
    { label: "STYLE", title: "Multiple mediums", body: "Watercolor for couples, wine glass design, and VIP canvases." },
    { label: "RESULT", title: "Your artwork", body: "Take home finished paintings and glassware." },
    { label: "VIBE", title: "Creative exploration", body: "Experiment, sip, and express." }
  ],
  booking: { term: "painting" },
  bookingLinks: {
    eventbrite: "https://www.eventbrite.com/e/date-night-watercolor-painting-for-two-eugene-tickets-1992527967789",
    acuity: "https://colorcocktailfactory.as.me/?appointmentType=94932997",
  },
  upcomingTimes: [
    { label: "Fri Oct 9 · 5:00 PM · Watercolor for Two", url: "https://www.eventbrite.com/e/date-night-watercolor-painting-for-two-eugene-tickets-1992527967789" },
    { label: "Fri Oct 9 · 5:30 PM · VIP Paint Night", url: "https://www.eventbrite.com/e/vip-date-night-paint-night-tickets-2002688236426" },
    { label: "Fri Oct 9 · 5:45 PM · Wine Glass Painting", url: "https://www.eventbrite.com/e/wine-glass-painting-tickets-2002688241441" },
    { label: "Sat Oct 10 · 5:00 PM · Watercolor for Two", url: "https://www.eventbrite.com/e/date-night-watercolor-painting-for-two-eugene-tickets-1992527968792" },
    { label: "Sat Oct 10 · 5:30 PM · VIP Paint Night", url: "https://www.eventbrite.com/e/vip-date-night-paint-night-tickets-2002689153168" },
    { label: "Sat Oct 10 · 5:45 PM · Wine Glass Painting", url: "https://www.eventbrite.com/e/wine-glass-painting-tickets-2002689618560" },
    { label: "Sun Oct 11 · 5:00 PM · Watercolor for Two", url: "https://www.eventbrite.com/e/date-night-watercolor-painting-for-two-eugene-tickets-1992527969795" },
    { label: "Mon Oct 12 · 5:00 PM · Watercolor for Two", url: "https://www.eventbrite.com/e/date-night-watercolor-painting-for-two-eugene-tickets-1992527970798" },
    { label: "Mon Oct 12 · 5:30 PM · VIP Paint Night", url: "https://www.eventbrite.com/e/vip-date-night-paint-night-tickets-2002689738920" },
    { label: "Mon Oct 12 · 5:45 PM · Wine Glass Painting", url: "https://www.eventbrite.com/e/wine-glass-painting-tickets-2002689739923" },
  ],
  faqs: [
    { q: "Do I need experience?", a: "No - we welcome all skill levels." },
    { q: "What supplies do I need?", a: "All supplies provided in class." },
    { q: "Are glasses food-safe?", a: "Yes, once cured according to provided instructions." }
  ],
  relatedSlugs: ["wine-glass-painting", "gift-cards"],
  
  // Sub-classes for Eugene Pigment Lab
  subClasses: [
    { label: "Watercolor for Two", slug: "watercolor" },
    { label: "Wine Glass Painting", slug: "wine-glass-painting" },
    { label: "VIP Date Night Paint Night", slug: "paint-night" },
  ]
};

// Create grouped section for Aroma with real Eugene candle classes
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
    { time: "Evenings 6:15–8:30 PM", note: "$25–$35 · Scent design + craft" }
  ],

  badge: "SCENT · CRAFT · GLOW",
  heroTitle: "Aroma",
  heroDescription:
    "Pour custom scented organic candles and ceramic candle holders. Design your own fragrance blend and take home your cozy creation.",
  primaryCta: { label: "Browse Classes", kind: "booking" },
  secondaryCta: { label: "Details + FAQs", kind: "detail" },
  tags: ["Candles", "Scent Design", "Cozy", "Take-home", "Halloween"],
  valueCards: [
    { label: "STYLE", title: "Scent design", body: "Create your signature blend." },
    { label: "RESULT", title: "Handmade products", body: "Candles and ceramic holders to enjoy or gift." },
    { label: "VIBE", title: "Relaxing craft", body: "Cozy, warm, and creative." }
  ],
  booking: { term: "candle" },
  bookingLinks: {
    eventbrite: "https://www.eventbrite.com/e/candle-making-workshop-eugene-tickets-2003168355475",
    acuity: "https://colorcocktailfactory.as.me/candle",
  },
  upcomingTimes: [
    { label: "Sat Oct 10 · 6:15 PM · Halloween Candle Holder", url: "https://www.eventbrite.com/e/oogie-boogie-inspired-candle-holder-halloween-pottery-tickets-2002689627587" },
    { label: "Mon Oct 12 · 6:30 PM · Candle Making", url: "https://www.eventbrite.com/e/candle-making-workshop-eugene-tickets-2003168355475" },
    { label: "Tue Oct 13 · 6:15 PM · Halloween Candle Holder", url: "https://www.eventbrite.com/e/oogie-boogie-inspired-candle-holder-halloween-pottery-tickets-2002730175868" },
    { label: "Tue Oct 13 · 7:00 PM · Candle Making", url: "https://www.eventbrite.com/e/candle-making-workshop-eugene-tickets-2003168397601" },
    { label: "Mon Oct 19 · 6:30 PM · Candle Making", url: "https://www.eventbrite.com/e/candle-making-workshop-eugene-tickets-2003168461793" },
    { label: "Tue Oct 20 · 7:00 PM · Candle Making", url: "https://www.eventbrite.com/e/candle-making-workshop-eugene-tickets-2003168464802" },
    { label: "Mon Oct 26 · 6:30 PM · Candle Making", url: "https://www.eventbrite.com/e/candle-making-workshop-eugene-tickets-2003168467811" },
    { label: "Tue Oct 27 · 7:00 PM · Candle Making", url: "https://www.eventbrite.com/e/candle-making-workshop-eugene-tickets-2003168470820" },
  ],
  faqs: [
    { q: "Can I choose my scents?", a: "Yes - you design your own blends." },
    { q: "Do I take them home same day?", a: "Yes, after a short cooling/setting period." },
    { q: "Is this good for groups?", a: "Absolutely - perfect for dates and friends." }
  ],
  relatedSlugs: ["gift-cards"],
  
  // Sub-classes for Aroma
  subClasses: [
    { label: "Candle Making", slug: "candle-making" },
    { label: "Halloween Candle Holder", slug: "candle-holder" },
  ]
};

// Create grouped section for Etc / Terrarium
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
    { time: "Sat · 3:30–5:00 PM & Evenings", note: "$35–$50 / person · Solo & Date Night formats" }
  ],

  badge: "CREATE · EXPLORE · UNIQUE",
  heroTitle: "Terrarium & Specialty Crafts",
  heroDescription:
    "Build a living miniature garden inside glass! Learn how ecosystems work, layer plants and decorative stones, and take home your living creation. Available as daytime workshops and romantic date nights.",
  primaryCta: { label: "Book Terrarium", kind: "booking" },
  secondaryCta: { label: "Details + FAQs", kind: "detail" },
  tags: ["Nature", "Plants", "Beginner-friendly", "Home decor", "Date Night"],
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
    { label: "Fri Oct 9 · 6:10 PM · Date Night Terrarium", url: "https://www.eventbrite.com/e/eugene-date-night-terrarium-workshop-tickets-2002688246456" },
    { label: "Sat Oct 10 · 3:30 PM · Terrarium Workshop", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161151929" },
    { label: "Sat Oct 10 · 6:10 PM · Date Night Terrarium", url: "https://www.eventbrite.com/e/eugene-date-night-terrarium-workshop-tickets-2002689623575" },
    { label: "Mon Oct 12 · 6:15 PM · Date Night Terrarium", url: "https://www.eventbrite.com/e/eugene-date-night-terrarium-workshop-tickets-2002689743935" },
    { label: "Sat Oct 17 · 3:30 PM · Terrarium Workshop", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161155941" },
    { label: "Sat Oct 24 · 3:30 PM · Terrarium Workshop", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161165971" },
    { label: "Sat Oct 31 · 3:30 PM · Terrarium Workshop", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161170986" },
    { label: "Sat Nov 7 · 3:30 PM · Terrarium Workshop", url: "https://www.eventbrite.com/e/terrarium-workshop-eugene-tickets-2003161176001" },
  ],
  faqs: [
    { q: "Are these beginner-friendly?", a: "Yes - we guide you through each technique." },
    { q: "What's included?", a: "All materials and instruction provided." },
    { q: "Can I book privately?", a: "Yes - see Private Events for group options." }
  ],
  relatedSlugs: ["private-parties", "gift-cards"],
  
  // Sub-classes for Etc
  subClasses: [
    { label: "Terrarium Workshop", slug: "terrarium" },
    { label: "Date Night Terrarium", slug: "terrarium" },
  ]
};

const getEugeneBonsaiSection = (): SectionConfig => {
  const baseBonsai = getBaseSection("bonsai")!;
  return {
    ...baseBonsai,
    scheduleRows: [
      { time: "Sat · 4:30–6:30 PM & 7:20 PM", note: "$75 / person · $150 / couple · VIP formats" },
    ],
    bookingLinks: {
      eventbrite: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159600288",
      acuity: "https://colorcocktailfactory.as.me/?appointmentType=94058299",
    },
    upcomingTimes: [
      { label: "Fri Oct 9 · 7:20 PM · Date Night Bonsai VIP", url: "https://www.eventbrite.com/e/date-night-bonsai-vip-tickets-2002688258492" },
      { label: "Sat Oct 10 · 4:30 PM · Bonsai Workshop", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159600288" },
      { label: "Sat Oct 10 · 7:20 PM · Date Night Bonsai VIP", url: "https://www.eventbrite.com/e/date-night-bonsai-vip-tickets-2002689635611" },
      { label: "Sat Oct 17 · 4:30 PM · Bonsai Workshop", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159555153" },
      { label: "Sat Oct 24 · 4:30 PM · Bonsai Workshop", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159607309" },
      { label: "Sat Oct 31 · 4:30 PM · Bonsai Workshop", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159613327" },
      { label: "Sat Nov 7 · 4:30 PM · Bonsai Workshop", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159619345" },
      { label: "Sat Nov 14 · 4:30 PM · Bonsai Workshop", url: "https://www.eventbrite.com/e/bonsai-for-beginners-hands-on-workshop-eugene-tickets-2003159625363" },
    ],
    subClasses: [
      { label: "Bonsai Workshop", slug: "bonsai" },
      { label: "Date Night Bonsai VIP", slug: "bonsai" },
    ],
  };
};

// Mosaic & Stained Glass Section for Eugene
const getEugeneMosaicSection = (): SectionConfig => {
  const baseTurkish = getBaseSection("turkish")!;
  return {
    ...baseTurkish,
    scheduleLabel: "MOSAIC & GLASS",
    scheduleTitle: "Mosaic Art & Candlelit Date Night",
    schedulePill: "GLASS",
    scheduleRows: [
      { time: "Sat · 6:30–8:00 PM", note: "$90 / couple · Candlelit studio experience" },
    ],
    heroTitle: "Mosaic Art & Candlelit Date Night",
    heroDescription:
      "Step into an intimate, candlelit Eugene studio and craft custom mosaic art together. Create 4 custom coasters per couple with vibrant glass tiles, gems, and guided instruction.",
    bookingLinks: {
      eventbrite: "https://www.eventbrite.com/e/date-night-by-candlelight-mosaic-art-experience-eugene-tickets-2003168524982",
      acuity: "https://colorcocktailfactory.as.me/MosaicVIP",
    },
    upcomingTimes: [
      { label: "Sat Oct 10 · 6:30 PM", url: "https://www.eventbrite.com/e/date-night-by-candlelight-mosaic-art-experience-eugene-tickets-2003168524982" },
      { label: "Sat Oct 17 · 6:30 PM", url: "https://www.eventbrite.com/e/date-night-by-candlelight-mosaic-art-experience-eugene-tickets-2003168537018" },
      { label: "Sat Oct 24 · 6:30 PM", url: "https://www.eventbrite.com/e/date-night-by-candlelight-mosaic-art-experience-eugene-tickets-2003168542033" },
      { label: "Sat Oct 31 · 6:30 PM", url: "https://www.eventbrite.com/e/date-night-by-candlelight-mosaic-art-experience-eugene-tickets-2003168546045" },
    ],
    subClasses: [
      { label: "Date Night Mosaic", slug: "mosaic" },
      { label: "Turkish Mosaic Lamp", slug: "turkish-lamp" },
    ],
  };
};

/**
 * Eugene-specific section order:
 * Features all active Eugene crafts with direct Acuity and Eventbrite booking drawers
 */
export const eugeneSections: SectionConfig[] = [
  getBaseSection("private")!,          // 1. Private Party
  getEugeneDateNightSection(),         // 2. Date Night on the Wheel & All Date Night Formats
  getEugeneBeginnerWheelSection(),     // 3. Beginner Wheel Throwing (Matcha Bowl & Cup Creations)
  handbuildingGroup,                   // 4. Handbuilding Pottery (Mug/Bowl, Pipe/Ashtray, Mushroom, Charcuterie, Chess, Cauldron, Duck, Oogie Boogie)
  getEugeneBonsaiSection(),            // 5. Bonsai Workshop & VIP Date Night Bonsai
  etcGroup,                            // 6. Terrarium & Specialty Crafts
  pigmentLabGroup,                     // 7. Pigment Lab (Watercolor for Two, Wine Glass, VIP Paint Night)
  aromaGroup,                          // 8. Aroma (Candle Making & Candle Holders)
  getEugeneMosaicSection(),            // 9. Mosaic Art & Candlelit Date Night
].filter(Boolean); // Filter out any undefined sections
