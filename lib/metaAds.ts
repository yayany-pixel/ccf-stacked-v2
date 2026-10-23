/**
 * Meta Marketing API integration for ad campaign insights, spend, and conversion reporting.
 * Reads campaigns, ad sets, ads, and daily insights from Meta Graph API.
 * Provides ad creative blueprints, budget allocation models, and intelligent performance optimization.
 */

export interface MetaCampaignInsight {
  campaignId: string;
  campaignName: string;
  status: string;
  objective: string;
  spend: number;
  impressions: number;
  clicks: number;
  cpc: number;
  cpm: number;
  ctr: number;
  conversions: number;
  leads?: number;
  purchases?: number;
  checkouts?: number;
  dateStart?: string;
  dateStop?: string;
}

export interface MetaAdAccountOverview {
  accountId: string;
  accountName?: string;
  currency?: string;
  amountSpent?: number;
  campaigns: MetaCampaignInsight[];
}

export interface MetaAdCreativeBlueprint {
  id: string;
  title: string;
  classSlug: string;
  category: string;
  targetCity: "chicago" | "eugene" | "both";
  priceText: string;
  primaryTexts: string[];
  headlines: string[];
  descriptions: string[];
  callToAction: "BOOK_TRAVEL" | "LEARN_MORE" | "SIGN_UP" | "GET_QUOTE";
  destinationUrl: string;
  imageAsset: string;
  recommendedDailyBudget: number;
  optimizationGoal: "INITIATE_CHECKOUT" | "LEAD" | "LANDING_PAGE_VIEWS" | "PURCHASE";
  audience: {
    minAge: number;
    maxAge: number;
    geoRadiusMiles: number;
    locations: Array<{ city: string; state: string; lat: number; lng: number }>;
    interests: string[];
  };
}

export interface OptimizationRecommendation {
  priority: "HIGH" | "MEDIUM" | "LOW";
  action: "SCALE_BUDGET" | "PAUSE_UNDERPERFORMER" | "REFRESH_CREATIVE" | "SWITCH_OPTIMIZATION_EVENT" | "CONTINUE_LEARNING";
  target: string;
  reason: string;
  suggestedBudget?: number;
}

export interface OptimizationReport {
  totalSpend: number;
  totalClicks: number;
  totalImpressions: number;
  averageCpc: number;
  averageCtr: number;
  totalConversions: number;
  learningStatus: "LEARNING" | "LEARNING_LIMITED" | "OPTIMIZED" | "INSUFFICIENT_DATA";
  learningSummary: string;
  campaignEvaluations: Array<{
    campaignId: string;
    campaignName: string;
    spend: number;
    clicks: number;
    cpc: number;
    ctr: number;
    conversions: number;
    costPerConversion: number;
    status: "HEALTHY" | "WATCH" | "NEEDS_ATTENTION";
  }>;
  recommendations: OptimizationRecommendation[];
}

const GRAPH_API_VERSION = process.env.META_REPORTING_API_VERSION || "v26.0";
const BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Curated high-converting creative blueprints tested specifically for
 * Color Cocktail Factory's top workshops, margin drivers, and lead forms.
 */
export const CCF_AD_BLUEPRINTS: MetaAdCreativeBlueprint[] = [
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
    recommendedDailyBudget: 4.00,
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
    recommendedDailyBudget: 3.50,
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
    imageAsset: "/images/classes/wheel-throwing-for-beginners-90d2f8c6bb29.jpeg",
    recommendedDailyBudget: 3.00,
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
    recommendedDailyBudget: 4.00,
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

/**
 * Normalizes Meta Ad Account ID to the expected `act_<ID>` format.
 */
export function formatAdAccountId(rawId: string): string {
  const trimmed = rawId.trim();
  return trimmed.startsWith("act_") ? trimmed : `act_${trimmed}`;
}

/**
 * Dynamically computes a daily budget distribution plan across the blueprints
 * according to the provided daily budget (e.g. $5, $10, $15, $25).
 */
export function generateDailyBudgetPlan(totalDailyBudget: number = 10) {
  const budget = Math.max(totalDailyBudget, 3);
  // Allocate 70% to cold prospecting micro-conversions, 30% to retargeting or lead generation
  const activeBlueprints = CCF_AD_BLUEPRINTS.slice(0, 3);
  const leadBlueprint = CCF_AD_BLUEPRINTS[3];

  const prospectingPool = budget >= 10 ? budget * 0.75 : budget;
  const leadPool = budget >= 10 ? budget * 0.25 : 0;

  const perAd = Number((prospectingPool / activeBlueprints.length).toFixed(2));
  const allocations = activeBlueprints.map(bp => ({
    blueprintId: bp.id,
    title: bp.title,
    city: bp.targetCity,
    dailyBudget: perAd,
    optimizationGoal: bp.optimizationGoal,
  }));

  if (leadPool > 0) {
    allocations.push({
      blueprintId: leadBlueprint.id,
      title: leadBlueprint.title,
      city: leadBlueprint.targetCity,
      dailyBudget: Number(leadPool.toFixed(2)),
      optimizationGoal: leadBlueprint.optimizationGoal,
    });
  }

  return {
    totalDailyBudget: budget,
    allocations,
    recommendedStrategy:
      budget < 15
        ? "Micro-Conversion Strategy: Optimize for InitiateCheckout / Leads rather than final Purchase to ensure Meta receives 50+ conversion signals weekly on a limited budget."
        : "Hybrid Strategy: 70% InitiateCheckout / Lead prospecting + 30% Purchase Retargeting pool.",
  };
}

/**
 * Analyzes campaign metrics and delivers concrete AI optimization directives
 * to guide learning, avoid wasted spend, and signal when to scale.
 */
export function analyzeCampaignPerformance(
  insights: MetaCampaignInsight[],
  targetDailyBudget: number = 10
): OptimizationReport {
  let totalSpend = 0;
  let totalClicks = 0;
  let totalImpressions = 0;
  let totalConversions = 0;

  const evaluations: OptimizationReport["campaignEvaluations"] = [];
  const recommendations: OptimizationRecommendation[] = [];

  for (const item of insights) {
    totalSpend += item.spend;
    totalClicks += item.clicks;
    totalImpressions += item.impressions;
    totalConversions += item.conversions;

    const costPerConversion = item.conversions > 0 ? Number((item.spend / item.conversions).toFixed(2)) : 0;
    let status: "HEALTHY" | "WATCH" | "NEEDS_ATTENTION" = "HEALTHY";

    if (item.ctr < 0.9 && item.impressions > 500) {
      status = "NEEDS_ATTENTION";
      recommendations.push({
        priority: "HIGH",
        action: "REFRESH_CREATIVE",
        target: item.campaignName,
        reason: `CTR is low (${item.ctr.toFixed(2)}%). The audience is experiencing creative fatigue or the headline lacks urgency. Test Variant B copy.`,
      });
    }

    if ((item.cpc > 1.75 && item.clicks >= 8) || (item.spend > 25 && item.conversions === 0)) {
      status = "NEEDS_ATTENTION";
      recommendations.push({
        priority: "MEDIUM",
        action: "PAUSE_UNDERPERFORMER",
        target: item.campaignName,
        reason: `CPC is high ($${item.cpc.toFixed(2)}) with $${item.spend.toFixed(2)} spent and 0 conversions. Consider pausing this underperformer or broadening the geo-radius.`,
      });
    }

    if (item.conversions >= 15 && costPerConversion > 0 && costPerConversion <= 12) {
      recommendations.push({
        priority: "HIGH",
        action: "SCALE_BUDGET",
        target: item.campaignName,
        reason: `Strong cost per conversion ($${costPerConversion.toFixed(2)}) with ${item.conversions} conversions. Ready to scale daily budget by 20-30%.`,
        suggestedBudget: Number((targetDailyBudget * 1.25).toFixed(2)),
      });
    }

    evaluations.push({
      campaignId: item.campaignId,
      campaignName: item.campaignName,
      spend: item.spend,
      clicks: item.clicks,
      cpc: item.cpc,
      ctr: item.ctr,
      conversions: item.conversions,
      costPerConversion,
      status,
    });
  }

  const averageCpc = totalClicks > 0 ? Number((totalSpend / totalClicks).toFixed(2)) : 0;
  const averageCtr = totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0;

  // Campaign totals cannot establish Meta's per-ad-set learning phase.
  const learningStatus: OptimizationReport["learningStatus"] = "INSUFFICIENT_DATA";
  const learningSummary = totalSpend === 0
    ? "No spend recorded. AI assessment is awaiting delivery data."
    : "AI assessment uses campaign totals only. Meta learning status is unavailable; inspect ad-set delivery status in Ads Manager.";

  return {
    totalSpend: Number(totalSpend.toFixed(2)),
    totalClicks,
    totalImpressions,
    averageCpc,
    averageCtr,
    totalConversions,
    learningStatus,
    learningSummary,
    campaignEvaluations: evaluations,
    recommendations,
  };
}

export function finiteMetric(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export class MetaReportingError extends Error {
  constructor(public readonly reason: "permission" | "unavailable") {
    super(`Meta reporting ${reason}`);
  }
}

async function fetchMetaPages(url: URL, accessToken: string): Promise<any[]> {
  const rows: any[] = [];
  const cursors = new Set<string>();
  url.searchParams.set("limit", "100");
  for (let page = 0; page < 50; page++) {
    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store", signal: AbortSignal.timeout(10000),
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || json?.error) {
      const permission = [10, 190, 200, 294].includes(json?.error?.code) || [401, 403].includes(response.status);
      throw new MetaReportingError(permission ? "permission" : "unavailable");
    }
    if (!Array.isArray(json?.data)) throw new MetaReportingError("unavailable");
    rows.push(...json.data);
    if (!json.paging?.next) return rows;
    const cursor = json.paging?.cursors?.after;
    if (typeof cursor !== "string" || cursors.has(cursor)) throw new MetaReportingError("unavailable");
    cursors.add(cursor);
    // Rebuild trusted URL instead of following a credential-bearing paging URL.
    url.searchParams.set("after", cursor);
  }
  throw new MetaReportingError("unavailable"); // Never display a truncated total.
}

/**
 * Fetches campaign-level insights and performance metrics for a specified date range.
 * Defaults to the last 30 days if datePreset is not specified.
 */
export async function fetchMetaCampaignInsights(
  accessToken: string,
  rawAccountId: string,
  datePreset: string = "last_30d"
): Promise<MetaCampaignInsight[]> {
  const accountId = formatAdAccountId(rawAccountId);
  const fields = [
    "campaign_id",
    "campaign_name",
    "objective",
    "spend",
    "impressions",
    "clicks",
    "cpc",
    "cpm",
    "ctr",
    "actions",
    "date_start",
    "date_stop"
  ].join(",");

  const url = new URL(`${BASE_URL}/${accountId}/insights`);
  url.searchParams.set("level", "campaign");
  url.searchParams.set("fields", fields);
  url.searchParams.set("date_preset", datePreset);

  const data = await fetchMetaPages(url, accessToken);

  return data.map((item: any) => {
    const actions: Array<{ action_type: string; value: string }> = item.actions || [];
    const count = (...names: string[]) => {
      // Aliases overlap; choose one canonical count, never sum aliases.
      for (const name of names) {
        const value = actions.find(a => a.action_type === name)?.value;
        if (value !== undefined) return finiteMetric(value);
      }
      return 0;
    };
    const purchases = count("omni_purchase", "purchase", "offsite_conversion.fb_pixel_purchase");
    const leads = count("lead", "onsite_conversion.lead_grouped", "offsite_conversion.fb_pixel_lead");
    const checkouts = count("omni_initiated_checkout", "initiate_checkout", "offsite_conversion.fb_pixel_initiate_checkout");
    // Primary business outcome only; checkout is intent, never a purchase/lead.
    const conversions = item.objective === "OUTCOME_LEADS" ? leads : purchases;

    return {
      campaignId: item.campaign_id,
      campaignName: item.campaign_name,
      status: item.status || "UNKNOWN",
      objective: item.objective || "UNKNOWN",
      spend: finiteMetric(item.spend),
      impressions: finiteMetric(item.impressions),
      clicks: finiteMetric(item.clicks),
      cpc: finiteMetric(item.cpc),
      cpm: finiteMetric(item.cpm),
      ctr: finiteMetric(item.ctr),
      conversions, leads, purchases, checkouts,
      dateStart: item.date_start,
      dateStop: item.date_stop
    };
  });
}

/**
 * Fetches active campaigns overview with their budget and status.
 */
export async function fetchMetaCampaigns(
  accessToken: string,
  rawAccountId: string
): Promise<any[]> {
  const accountId = formatAdAccountId(rawAccountId);
  const fields = "id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time";
  const url = new URL(`${BASE_URL}/${accountId}/campaigns`);
  url.searchParams.set("fields", fields);
  url.searchParams.set("limit", "100");

  return fetchMetaPages(url, accessToken);
}

/**
 * Programmatic creation of a Meta Campaign via Marketing API.
 * Requires META_ACCESS_TOKEN with `ads_management` permission.
 */
export async function createMetaCampaign(
  accessToken: string,
  rawAccountId: string,
  options: {
    name: string;
    objective: "OUTCOME_SALES" | "OUTCOME_LEADS" | "OUTCOME_TRAFFIC";
    status?: "ACTIVE" | "PAUSED";
    specialAdCategories?: string[];
  }
): Promise<{ id: string }> {
  const accountId = formatAdAccountId(rawAccountId);
  const url = `${BASE_URL}/${accountId}/campaigns`;

  const payload = {
    name: options.name,
    objective: options.objective,
    status: options.status || "PAUSED",
    special_ad_categories: options.specialAdCategories || ["NONE"],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Meta createCampaign failed (${response.status}): ${err}`);
  }

  return response.json();
}

/**
 * Programmatic creation of a Meta Ad Set via Marketing API.
 */
export async function createMetaAdSet(
  accessToken: string,
  rawAccountId: string,
  options: {
    campaignId: string;
    name: string;
    dailyBudgetInCents: number;
    billingEvent?: "IMPRESSIONS";
    optimizationGoal: "OFFSITE_CONVERSIONS" | "LANDING_PAGE_VIEWS" | "LEAD_GENERATION";
    targeting: Record<string, any>;
    status?: "ACTIVE" | "PAUSED";
  }
): Promise<{ id: string }> {
  const accountId = formatAdAccountId(rawAccountId);
  const url = `${BASE_URL}/${accountId}/adsets`;

  const payload = {
    campaign_id: options.campaignId,
    name: options.name,
    daily_budget: options.dailyBudgetInCents,
    billing_event: options.billingEvent || "IMPRESSIONS",
    optimization_goal: options.optimizationGoal,
    targeting: options.targeting,
    status: options.status || "PAUSED",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Meta createAdSet failed (${response.status}): ${err}`);
  }

  return response.json();
}
