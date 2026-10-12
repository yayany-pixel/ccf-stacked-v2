#!/usr/bin/env node

/**
 * CLI tool to fetch and analyze Meta Ads performance and optimization metrics.
 * Reads META_ACCESS_TOKEN and META_AD_ACCOUNT_ID from environment.
 * Evaluates machine learning phase, cost per conversion, and scaling readiness.
 *
 * Usage:
 *   node scripts/meta-ads-report.cjs [date_preset]
 *   e.g. node scripts/meta-ads-report.cjs last_7d
 *        node scripts/meta-ads-report.cjs last_30d
 */

const token = process.env.META_ACCESS_TOKEN || process.env.META_CAPI_ACCESS_TOKEN;
const rawAccountId = process.env.META_AD_ACCOUNT_ID;
const datePreset = process.argv[2] || "last_7d";

if (!token || !rawAccountId) {
  console.log("\n================================================================================");
  console.log("             COLOR COCKTAIL FACTORY - META ADS INTELLIGENCE MONITOR");
  console.log("================================================================================");
  console.log("\nStatus: Meta Marketing API credentials not connected.\n");
  console.log("To connect your live ad account to this monitor, configure these environment variables:");
  console.log("  1. META_ACCESS_TOKEN (or META_CAPI_ACCESS_TOKEN) - System User Token with `ads_read` permission");
  console.log("  2. META_AD_ACCOUNT_ID - Ad Account ID (e.g., act_123456789 or 123456789)\n");
  console.log("Quick setup in Meta Business Manager:");
  console.log("  1. Visit: https://business.facebook.com/settings/system-users");
  console.log("  2. Create or select a System User, assign your Ad Account, and generate a token.");
  console.log("  3. Copy your Ad Account ID from Meta Ads Manager (act_XXXXXXXXX).");
  console.log("\nTip: To view ready-to-use ad copy, targeting specs, and budget plans right now, run:");
  console.log("  node scripts/meta-campaign-planner.cjs\n");
  console.log("================================================================================\n");
  process.exit(0);
}

const accountId = rawAccountId.startsWith("act_") ? rawAccountId : `act_${rawAccountId}`;
const fields = "campaign_id,campaign_name,objective,spend,impressions,clicks,cpc,cpm,ctr,actions,date_start,date_stop";
const url = `https://graph.facebook.com/v19.0/${accountId}/insights?level=campaign&fields=${fields}&date_preset=${datePreset}&access_token=${token}`;

async function runReport() {
  console.log("\n================================================================================");
  console.log("             COLOR COCKTAIL FACTORY - META ADS INTELLIGENCE MONITOR");
  console.log("================================================================================");
  console.log(`Account ID:  ${accountId}`);
  console.log(`Time Period: ${datePreset}\n`);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json();
      if (res.status === 403 || (err.error && err.error.message && err.error.message.includes("ads_read"))) {
        console.log("⚠️  PERMISSION DENIED (403)");
        console.log("The script successfully reached Meta, but the provided token does not have permission to read ad performance.");
        console.log("\nHOW TO FIX IN META BUSINESS SETTINGS:");
        console.log("1. Go to Business Settings -> Users -> System Users");
        console.log("2. Click on 'Netlify CAPI'");
        console.log("3. Ensure your Ad Account ('Naughty Things') is listed under 'Assigned Assets'. If not, click 'Assign Assets' and add it.");
        console.log("4. Click 'Generate new token', select your App, and MUST check 'ads_read' and 'ads_management'.");
        console.log("5. Paste the new token into Netlify as META_CAPI_ACCESS_TOKEN and deploy.\n");
        console.log("Note: Your website tracking (Conversions API) is still fully active and working with the current token!\n");
        return;
      }
      console.error(`Meta API Error (${res.status}):\n${JSON.stringify(err, null, 2)}`);
      process.exit(1);
    }

    const json = await res.json();
    const rows = json.data || [];

    if (rows.length === 0) {
      console.log(`No active ad spend or campaign data found for period: ${datePreset}`);
      console.log("\nReady to launch? Plan campaigns and review blueprints with:");
      console.log("  node scripts/meta-campaign-planner.cjs\n");
      return;
    }

    console.log("---------------------------------------------------------------------------------------------------------");
    console.log(
      "Campaign Name".padEnd(32) +
      "Spend".padStart(9) +
      "Clicks".padStart(8) +
      "CPC".padStart(8) +
      "CTR".padStart(8) +
      "Checkouts".padStart(11) +
      "Leads".padStart(8) +
      "Purchases".padStart(11) +
      "CPA".padStart(9)
    );
    console.log("---------------------------------------------------------------------------------------------------------");

    let totalSpend = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalCheckouts = 0;
    let totalLeads = 0;
    let totalPurchases = 0;

    const recommendations = [];

    for (const r of rows) {
      const spend = parseFloat(r.spend || "0");
      const imps = parseInt(r.impressions || "0", 10);
      const clicks = parseInt(r.clicks || "0", 10);
      const cpc = parseFloat(r.cpc || "0");
      const ctr = parseFloat(r.ctr || "0");
      const actions = r.actions || [];

      const findAction = (type) => {
        const found = actions.find(a => a.action_type === type);
        return found ? parseInt(found.value, 10) : 0;
      };

      const checkouts = findAction("initiate_checkout");
      const leads = findAction("lead");
      const purchases = findAction("omni_purchase") || findAction("purchase");
      const totalConvs = checkouts + leads + purchases;

      totalSpend += spend;
      totalImpressions += imps;
      totalClicks += clicks;
      totalCheckouts += checkouts;
      totalLeads += leads;
      totalPurchases += purchases;

      const cpa = totalConvs > 0 ? `$${(spend / totalConvs).toFixed(2)}` : "-";
      const name = (r.campaign_name || "Unnamed").slice(0, 30).padEnd(32);

      console.log(
        name +
        `$${spend.toFixed(2)}`.padStart(9) +
        clicks.toLocaleString().padStart(8) +
        `$${cpc.toFixed(2)}`.padStart(8) +
        `${ctr.toFixed(2)}%`.padStart(8) +
        String(checkouts).padStart(11) +
        String(leads).padStart(8) +
        String(purchases).padStart(11) +
        cpa.padStart(9)
      );

      // Algorithmic evaluation rules
      if (ctr < 1.0 && imps > 400) {
        recommendations.push(`[Creative Fatigue] "${r.campaign_name}": Low CTR (${ctr.toFixed(2)}%). Refresh ad creative or headline.`);
      }
      if (cpc > 1.60 && clicks > 15) {
        recommendations.push(`[High Friction] "${r.campaign_name}": High CPC ($${cpc.toFixed(2)}). Broaden geo-radius by 2-3 miles.`);
      }
      if (purchases >= 5 && (spend / purchases) < 20) {
        recommendations.push(`[Scaling Winner] "${r.campaign_name}": Strong Purchase CPA ($${(spend / purchases).toFixed(2)}). Scale daily budget by 20%.`);
      }
    }

    console.log("---------------------------------------------------------------------------------------------------------");
    const avgCpc = totalClicks > 0 ? `$${(totalSpend / totalClicks).toFixed(2)}` : "$0.00";
    const avgCtr = totalImpressions > 0 ? `${((totalClicks / totalImpressions) * 100).toFixed(2)}%` : "0.00%";
    const totalConversions = totalCheckouts + totalLeads + totalPurchases;
    const overallCpa = totalConversions > 0 ? `$${(totalSpend / totalConversions).toFixed(2)}` : "-";

    console.log(
      "TOTAL".padEnd(32) +
      `$${totalSpend.toFixed(2)}`.padStart(9) +
      totalClicks.toLocaleString().padStart(8) +
      avgCpc.padStart(8) +
      avgCtr.padStart(8) +
      String(totalCheckouts).padStart(11) +
      String(totalLeads).padStart(8) +
      String(totalPurchases).padStart(11) +
      overallCpa.padStart(9)
    );
    console.log("---------------------------------------------------------------------------------------------------------\n");

    console.log("================================================================================");
    console.log("                    ALGORITHM LEARNING PHASE DIAGNOSTIC");
    console.log("================================================================================");
    console.log(`Total Conversion Signals Recorded: ${totalConversions}`);

    if (totalConversions < 15) {
      console.log("Status: [LEARNING LIMITED]");
      console.log("Analysis: Meta requires ~50 conversions/week per ad set for algorithm stabilization.");
      console.log("Advice:   Keep optimization goal on 'InitiateCheckout' or 'Leads' rather than Purchase");
      console.log("          to feed the pixel enough event volume on a limited daily budget.");
    } else if (totalConversions < 50) {
      console.log("Status: [IN LEARNING PHASE]");
      console.log(`Progress: ${totalConversions}/50 conversions towards exit.`);
      console.log("Advice:   Maintain steady daily budgets ($5-$10/day). Avoid major edits for 3-5 days.");
    } else {
      console.log("Status: [READY TO SCALE]");
      console.log("Analysis: Sufficient conversion volume achieved! Meta has mapped your customer profile.");
      console.log("Advice:   Create an Advantage+ Purchase Campaign and scale daily budget by 20% every 3 days.");
    }
    console.log("================================================================================\n");

    if (recommendations.length > 0) {
      console.log("================================================================================");
      console.log("                        AI OPTIMIZATION DIRECTIVES");
      console.log("================================================================================");
      recommendations.forEach((rec, idx) => {
        console.log(`${idx + 1}. ${rec}`);
      });
      console.log("================================================================================\n");
    }
  } catch (error) {
    console.error("Failed to fetch Meta Ads insights:", error);
    process.exit(1);
  }
}

runReport();
