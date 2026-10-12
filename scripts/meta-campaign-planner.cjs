#!/usr/bin/env node

/**
 * Meta Ads Campaign Planner & Creative Architect for Color Cocktail Factory.
 * Generates structured ad blueprints, creative copy variants, audience parameters,
 * and dynamic budget allocation models for low-budget algorithmic optimization.
 *
 * Usage:
 *   node scripts/meta-campaign-planner.cjs
 *   node scripts/meta-campaign-planner.cjs --budget 15
 *   node scripts/meta-campaign-planner.cjs --export
 *   node scripts/meta-campaign-planner.cjs --json
 */

const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);
let dailyBudget = 10;
const budgetIdx = args.indexOf("--budget");
if (budgetIdx !== -1 && args[budgetIdx + 1]) {
  const parsed = parseFloat(args[budgetIdx + 1]);
  if (!isNaN(parsed) && parsed > 0) dailyBudget = parsed;
}

const isJson = args.includes("--json");
const isExport = args.includes("--export");

const BLUEPRINTS = [
  {
    id: "date-night-pottery",
    title: "Date Night Pottery on the Wheel",
    classSlug: "date-night-wheel",
    category: "Pottery",
    targetCity: "both",
    priceText: "$50/person",
    primaryTexts: [
      "Tired of the usual dinner and drinks? Switch up date night with hands-on wheel throwing at Color Cocktail Factory. BYOB friendly, step-by-step guidance, and real clay bowls you make together. Rated 5 stars in Pilsen & Eugene! 🏺🍷",
      "Make something you can keep forever. Share a pottery wheel, get your hands dirty, and enjoy a creative night out together. No experience necessary—our instructors guide you every step of the way.",
      "Weekend plans? Friday & Saturday pottery wheel sessions fill up fast. Reserve your wheel at Color Cocktail Factory before this weekend's spots are gone!",
    ],
    headlines: [
      "Hands-On Pottery Date Night 🏺",
      "Skip Boring Dates — Throw Clay Together",
      "BYOB Wheel Throwing for Two",
    ],
    descriptions: [
      "Rated 5 Stars • BYOB Friendly • Chicago & Eugene",
      "Beginner Friendly • Real Stoneware Ceramics",
      "Limited Wheels Available Per Session",
    ],
    callToAction: "BOOK_TRAVEL",
    destinationUrl: "https://colorcocktailfactory.com/activities/date-night-wheel?utm_source=meta&utm_medium=cpc&utm_campaign=date_night_wheel",
    imageAsset: "/images/classes/approved-07-Go6xn9-08daf172fdf1.webp",
    recommendedDailyBudget: 4.0,
    optimizationGoal: "INITIATE_CHECKOUT",
    audience: {
      minAge: 21,
      maxAge: 45,
      geoRadiusMiles: 8,
      locations: [
        { city: "Chicago", state: "IL", lat: 41.8579, lng: -87.6558 },
        { city: "Eugene", state: "OR", lat: 44.0521, lng: -123.0868 },
      ],
      interests: ["Date night", "Pottery", "Craft", "BYOB", "Ceramics"],
    },
  },
  {
    id: "turkish-mosaic-lamp",
    title: "Turkish Mosaic Lamp Workshop",
    classSlug: "turkish-lamp",
    category: "Glass Art",
    targetCity: "chicago",
    priceText: "$65/person",
    primaryTexts: [
      "Create a stunning glowing Turkish mosaic lamp with hand-cut stained glass tiles and beads. Zero art experience needed—you leave with a functional heirloom piece for your home! ✨",
      "Looking for a uniquely relaxing evening in Chicago? Assemble vibrant geometric mosaic glass into an illuminated bedside lamp. Perfect for friends' night out or solo mindfulness.",
      "Our most requested workshop! Turkish mosaic lamp making at Color Cocktail Factory in Pilsen. Bring your favorite beverage and craft something unforgettable.",
    ],
    headlines: [
      "Craft a Glowing Mosaic Lamp ✨",
      "Authentic Turkish Glass Workshop",
      "Chicago's Most Unique Craft Night",
    ],
    descriptions: [
      "Complete Kit & Lamp Base Included • BYOB",
      "Rated 5 Stars in Pilsen • Zero Experience Needed",
      "Take Home a Real Working Lamp",
    ],
    callToAction: "BOOK_TRAVEL",
    destinationUrl: "https://colorcocktailfactory.com/activities/turkish-lamp?utm_source=meta&utm_medium=cpc&utm_campaign=turkish_mosaic_lamp",
    imageAsset: "/images/classes/approved-42-9vzaFl-cda788618ed1.webp",
    recommendedDailyBudget: 3.5,
    optimizationGoal: "INITIATE_CHECKOUT",
    audience: {
      minAge: 22,
      maxAge: 55,
      geoRadiusMiles: 10,
      locations: [
        { city: "Chicago", state: "IL", lat: 41.8579, lng: -87.6558 },
      ],
      interests: ["Mosaic", "Stained glass", "Home decor", "Interior design", "Handicraft"],
    },
  },
  {
    id: "matcha-bowl-wheel",
    title: "Beginner Wheel: Matcha Bowl Workshop",
    classSlug: "matcha-bowl",
    category: "Pottery",
    targetCity: "both",
    priceText: "$25/person",
    primaryTexts: [
      "Always wanted to try the pottery wheel without committing to an expensive 6-week course? Craft your very own ceramic matcha bowl for just $25! 🍵",
      "Learn centering, opening, and shaping on the wheel in a fun 90-minute workshop. Perfect for beginners who want a quick, affordable taste of wheel throwing.",
      "Try the pottery wheel for $25. Spots in Eugene and Chicago are open now—grab yours before they're booked!",
    ],
    headlines: [
      "Wheel Throwing for $25 🍵",
      "Beginner Wheel: Craft a Matcha Bowl",
      "Try the Pottery Wheel for Under $30",
    ],
    descriptions: [
      "90-Min Beginner Workshop • Clay Included",
      "No Experience Needed • Fun & Relaxing",
      "Chicago & Eugene Studios",
    ],
    callToAction: "BOOK_TRAVEL",
    destinationUrl: "https://colorcocktailfactory.com/activities/matcha-bowl?utm_source=meta&utm_medium=cpc&utm_campaign=matcha_bowl_intro",
    imageAsset: "/images/classes/wheel-throwing-for-beginners-color-cocktail-factory-acuity-600x600.jpg",
    recommendedDailyBudget: 3.0,
    optimizationGoal: "INITIATE_CHECKOUT",
    audience: {
      minAge: 18,
      maxAge: 35,
      geoRadiusMiles: 7,
      locations: [
        { city: "Eugene", state: "OR", lat: 44.0521, lng: -123.0868 },
        { city: "Chicago", state: "IL", lat: 41.8579, lng: -87.6558 },
      ],
      interests: ["Pottery", "Matcha", "Ceramics", "Student lifestyle", "DIY"],
    },
  },
  {
    id: "private-events-parties",
    title: "Private Parties & Team Building",
    classSlug: "private-events",
    category: "Group Events",
    targetCity: "both",
    priceText: "Custom Group Packages",
    primaryTexts: [
      "Planning a bachelorette party, milestone birthday, or corporate team outing? Color Cocktail Factory hosts hands-on creative events for groups of 8 to 50+ guests! 🥂🎉",
      "Ditch awkward corporate mixers. Bring your team together over pottery throwing, mosaic lamp crafting, or wine glass painting. Full studio buyouts available.",
      "Host an unforgettable private celebration in Pilsen or Eugene. Choose your craft, bring your favorite drinks & food, and let our instructors run the show.",
    ],
    headlines: [
      "Host an Unforgettable Private Party 🎉",
      "Creative Team Outings & Bachelorettes",
      "Private Studio Buyouts for Groups",
    ],
    descriptions: [
      "Pottery, Mosaics & Painting • BYOB Studio",
      "Dedicated Private Instructor • Fast Quote",
      "Groups from 8 to 50+ Guests",
    ],
    callToAction: "GET_QUOTE",
    destinationUrl: "https://colorcocktailfactory.com/private-events?utm_source=meta&utm_medium=cpc&utm_campaign=private_events_leads",
    imageAsset: "/images/classes/approved-01-HsW-Hv-48dba9a4f983.webp",
    recommendedDailyBudget: 4.0,
    optimizationGoal: "LEAD",
    audience: {
      minAge: 24,
      maxAge: 60,
      geoRadiusMiles: 12,
      locations: [
        { city: "Chicago", state: "IL", lat: 41.8579, lng: -87.6558 },
        { city: "Eugene", state: "OR", lat: 44.0521, lng: -123.0868 },
      ],
      interests: ["Team building", "Event planning", "Bachelorette party", "Corporate event", "Birthday party"],
    },
  },
];

function calculateAllocations(totalBudget) {
  const budget = Math.max(totalBudget, 3);
  const activeProspecting = BLUEPRINTS.slice(0, 3);
  const leadBlueprint = BLUEPRINTS[3];

  const prospectingPool = budget >= 10 ? budget * 0.75 : budget;
  const leadPool = budget >= 10 ? budget * 0.25 : 0;

  const perAd = Number((prospectingPool / activeProspecting.length).toFixed(2));
  const allocations = activeProspecting.map(bp => ({
    id: bp.id,
    title: bp.title,
    city: bp.targetCity,
    dailyBudget: perAd,
    optimizationGoal: bp.optimizationGoal,
    destinationUrl: bp.destinationUrl,
  }));

  if (leadPool > 0) {
    allocations.push({
      id: leadBlueprint.id,
      title: leadBlueprint.title,
      city: leadBlueprint.targetCity,
      dailyBudget: Number(leadPool.toFixed(2)),
      optimizationGoal: leadBlueprint.optimizationGoal,
      destinationUrl: leadBlueprint.destinationUrl,
    });
  }

  return { totalDailyBudget: budget, allocations };
}

const plan = calculateAllocations(dailyBudget);

if (isJson) {
  console.log(JSON.stringify({ plan, blueprints: BLUEPRINTS }, null, 2));
  process.exit(0);
}

if (isExport) {
  const exportPath = path.join(__dirname, "../docs/meta-campaign-export.json");
  fs.writeFileSync(exportPath, JSON.stringify({ plan, blueprints: BLUEPRINTS }, null, 2));
  console.log(`\nExported campaign blueprint to: ${exportPath}`);
  process.exit(0);
}

console.log("\n================================================================================");
console.log("            COLOR COCKTAIL FACTORY - META AD CAMPAIGN & CREATIVE PLANNER");
console.log("================================================================================\n");
console.log(`Planned Daily Budget: $${dailyBudget.toFixed(2)}/day`);
console.log("Target Channels:      Instagram (Feed, Stories, Reels) & Facebook Feed");
console.log("Optimization Logic:   Micro-Conversions (InitiateCheckout / Leads) for fast learning\n");

console.log("--------------------------------------------------------------------------------");
console.log("                        DAILY BUDGET ALLOCATION MATRIX");
console.log("--------------------------------------------------------------------------------");
console.log(
  "Campaign / Workshop".padEnd(38) +
  "City".padEnd(10) +
  "Goal".padEnd(20) +
  "Daily Budget".padStart(12)
);
console.log("--------------------------------------------------------------------------------");

for (const a of plan.allocations) {
  console.log(
    a.title.slice(0, 36).padEnd(38) +
    a.city.padEnd(10) +
    a.optimizationGoal.padEnd(20) +
    `$${a.dailyBudget.toFixed(2)}`.padStart(12)
  );
}

console.log("--------------------------------------------------------------------------------");
console.log(
  "TOTAL DAILY INVESTMENT".padEnd(68) +
  `$${dailyBudget.toFixed(2)}`.padStart(12)
);
console.log("--------------------------------------------------------------------------------\n");

console.log("================================================================================");
console.log("                       CREATIVE BLUEPRINTS & COPY VARIANTS");
console.log("================================================================================\n");

BLUEPRINTS.forEach((bp, idx) => {
  console.log(`[BLUEPRINT ${idx + 1}] ${bp.title.toUpperCase()} (${bp.priceText})`);
  console.log(`Category:        ${bp.category} | Target: ${bp.targetCity.toUpperCase()}`);
  console.log(`Optimization:    ${bp.optimizationGoal}`);
  console.log(`Landing Page:    ${bp.destinationUrl}`);
  console.log(`Image Asset:     ${bp.imageAsset}`);
  console.log(`Target Audience: Age ${bp.audience.minAge}-${bp.audience.maxAge}, ${bp.audience.geoRadiusMiles}-mile radius`);
  console.log(`Interests:       ${bp.audience.interests.join(", ")}`);
  console.log("\nPrimary Text Variations:");
  bp.primaryTexts.forEach((txt, vIdx) => {
    console.log(`  Option ${String.fromCharCode(65 + vIdx)}: "${txt}"`);
  });
  console.log("\nHeadlines:");
  bp.headlines.forEach((h, hIdx) => {
    console.log(`  Headline ${hIdx + 1}: "${h}"`);
  });
  console.log(`CTA Button:      ${bp.callToAction}\n`);
  console.log("--------------------------------------------------------------------------------\n");
});

console.log("================================================================================");
console.log("                    LOW-BUDGET ALGORITHMIC LEARNING ROADMAP");
console.log("================================================================================");
console.log("1. Days 1-7 (Data Seeding):");
console.log("   - Run 3 ad sets at $3-$4/day targeting InitiateCheckout.");
console.log("   - Meta's pixel trains on high-intent clickers who engage with the scheduler.");
console.log("   - Target CPC: < $1.20 | Target CTR: > 1.5%");
console.log("\n2. Days 8-14 (Creative Elimination & Retargeting):");
console.log("   - Review results using: node scripts/meta-ads-report.cjs");
console.log("   - Pause the lowest-performing ad variant.");
console.log("   - Launch warm retargeting pool ($3/day) for past 14-day site visitors.");
console.log("\n3. Days 15-30 (Scaling Readiness):");
console.log("   - Once 50+ conversion signals are reached, switch main campaign to Purchase.");
console.log("   - Scale daily budget by 20-30% on winning angles.");
console.log("================================================================================\n");
