import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  CCF_AD_BLUEPRINTS,
  generateDailyBudgetPlan,
  analyzeCampaignPerformance,
  formatAdAccountId,
} from "../lib/metaAds";
import {
  hasAdClickSignal,
  defaultVisitorPreferences,
  DEFAULT_PREFERENCES,
  DENIED_PREFERENCES,
} from "../lib/privacy";

async function main() {
  console.log("Running Meta Ads & Campaign Intelligence Verification Suite...");

  // 1. Verify Ad Creative Blueprints
  assert(CCF_AD_BLUEPRINTS.length >= 4, "Expected at least 4 ad creative blueprints");
  for (const bp of CCF_AD_BLUEPRINTS) {
    assert(bp.title && bp.title.length > 5, `Invalid blueprint title: ${bp.title}`);
    assert(bp.primaryTexts.length >= 2, `Expected multiple primary text variants for ${bp.id}`);
    assert(bp.headlines.length >= 2, `Expected multiple headline variants for ${bp.id}`);
    assert(bp.destinationUrl.startsWith("https://colorcocktailfactory.com"), `Invalid destination URL: ${bp.destinationUrl}`);
    assert(bp.destinationUrl.includes("utm_source=meta"), `Missing Meta UTM in ${bp.destinationUrl}`);
    assert(bp.audience.minAge >= 18 && bp.audience.maxAge <= 65, `Invalid audience age range in ${bp.id}`);
    assert(bp.audience.geoRadiusMiles >= 5, `Geo radius too small in ${bp.id}`);

    // Verify image asset file actually exists in public directory
    const imagePath = path.join(process.cwd(), "public", bp.imageAsset);
    assert(fs.existsSync(imagePath), `Ad image asset not found on disk: ${imagePath}`);
  }
  console.log("✓ All 4 Ad Creative Blueprints verified with valid copy, URLs, and real image assets.");

  // 2. Verify Dynamic Budget Allocation Models
  const plan10 = generateDailyBudgetPlan(10);
  assert.equal(plan10.totalDailyBudget, 10);
  const sum10 = plan10.allocations.reduce((acc, a) => acc + a.dailyBudget, 0);
  assert(Math.abs(sum10 - 10) < 0.05, `Budget allocation mismatch: expected 10, got ${sum10}`);

  const plan5 = generateDailyBudgetPlan(5);
  assert.equal(plan5.totalDailyBudget, 5);
  assert(plan5.allocations.length >= 3, "Low budget should still cover primary workshops");

  const plan25 = generateDailyBudgetPlan(25);
  assert.equal(plan25.totalDailyBudget, 25);
  assert(plan25.allocations.some(a => a.optimizationGoal === "LEAD"), "Larger budget should include private party leads");
  console.log("✓ Dynamic Daily Budget Planning ($5, $10, $25) verified.");

  // 3. Verify Account ID Normalization
  assert.equal(formatAdAccountId("123456789"), "act_123456789");
  assert.equal(formatAdAccountId("act_987654321"), "act_987654321");
  assert.equal(formatAdAccountId("  act_555  "), "act_555");

  // 4. Verify AI Performance Analyzer & Learning Diagnostics
  const emptyReport = analyzeCampaignPerformance([], 10);
  assert.equal(emptyReport.learningStatus, "INSUFFICIENT_DATA");

  const lowConvReport = analyzeCampaignPerformance([
    {
      campaignId: "c1",
      campaignName: "Date Night Pottery",
      status: "ACTIVE",
      objective: "OUTCOME_SALES",
      spend: 45.0,
      impressions: 2500,
      clicks: 80,
      cpc: 0.56,
      cpm: 18.0,
      ctr: 3.2,
      conversions: 3,
    },
  ], 10);
  assert.equal(lowConvReport.learningStatus, "LEARNING_LIMITED");
  assert(lowConvReport.recommendations.some(r => r.action === "SWITCH_OPTIMIZATION_EVENT"));

  const fatigueReport = analyzeCampaignPerformance([
    {
      campaignId: "c2",
      campaignName: "Turkish Lamp",
      status: "ACTIVE",
      objective: "OUTCOME_TRAFFIC",
      spend: 30.0,
      impressions: 1200,
      clicks: 8,
      cpc: 3.75,
      cpm: 25.0,
      ctr: 0.66,
      conversions: 0,
    },
  ], 10);
  assert(fatigueReport.recommendations.some(r => r.action === "REFRESH_CREATIVE"));
  assert(fatigueReport.recommendations.some(r => r.action === "PAUSE_UNDERPERFORMER"));

  const scaledReport = analyzeCampaignPerformance([
    {
      campaignId: "c3",
      campaignName: "Matcha Bowl",
      status: "ACTIVE",
      objective: "OUTCOME_SALES",
      spend: 120.0,
      impressions: 8000,
      clicks: 350,
      cpc: 0.34,
      cpm: 15.0,
      ctr: 4.37,
      conversions: 55,
    },
  ], 10);
  assert.equal(scaledReport.learningStatus, "OPTIMIZED");
  console.log("✓ Meta Ad Machine Learning Phase and Optimization Engine verified.");

  // 5. Verify Ad Click Signal & Privacy Precedence
  function setTestEnv(search: string, gpc: boolean) {
    (globalThis as any).window = { location: { search } };
    Object.defineProperty(globalThis, "navigator", {
      value: { globalPrivacyControl: gpc, doNotTrack: "0" },
      configurable: true,
      writable: true,
    });
  }

  // Case A: Organic visitor without ad click or GPC
  setTestEnv("", false);
  assert.equal(hasAdClickSignal(), false);
  assert.deepEqual(defaultVisitorPreferences(), DEFAULT_PREFERENCES);

  // Case B: Visitor from Facebook/Instagram ad click (fbclid)
  setTestEnv("?fbclid=IwAR1234567890abcdef", false);
  assert.equal(hasAdClickSignal(), true);
  assert.deepEqual(defaultVisitorPreferences(), { analytics: true, marketing: false });

  // Case C: Visitor with GPC signal enabled (must override ad click)
  setTestEnv("?fbclid=IwAR1234567890abcdef", true);
  assert.deepEqual(defaultVisitorPreferences(), DENIED_PREFERENCES);
  console.log("✓ Ad click attribution does not grant marketing consent; privacy signal precedence verified.");

  console.log("\n=======================================================");
  console.log("ALL META AD INTELLIGENCE & TRACKING TESTS PASSED!");
  console.log("=======================================================\n");
}

main();
