#!/usr/bin/env node

/**
 * CLI script to fetch and print Meta Ads performance and metrics.
 * Reads META_ACCESS_TOKEN and META_AD_ACCOUNT_ID from environment.
 *
 * Usage:
 *   node scripts/meta-ads-report.cjs [date_preset]
 *   e.g. node scripts/meta-ads-report.cjs last_30d
 *        node scripts/meta-ads-report.cjs this_month
 */

const token = process.env.META_ACCESS_TOKEN;
const rawAccountId = process.env.META_AD_ACCOUNT_ID;
const datePreset = process.argv[2] || "last_30d";

if (!token || !rawAccountId) {
  console.log("\n=======================================================");
  console.log("             META ADS REPORTING TOOL");
  console.log("=======================================================");
  console.log("\nStatus: Missing Meta Marketing API credentials.\n");
  console.log("To connect your Meta Ad data, configure these environment variables:");
  console.log("  1. META_ACCESS_TOKEN  - System User or User Access Token with ads_read");
  console.log("  2. META_AD_ACCOUNT_ID - Your Ad Account ID (e.g., act_123456789 or 123456789)\n");
  console.log("How to get them in Meta Business Manager:");
  console.log("  1. Go to https://business.facebook.com/settings/system-users");
  console.log("  2. Create or select a System User, assign Assets (your Ad Account), and generate token with `ads_read`");
  console.log("  3. Find your Ad Account ID in Meta Ads Manager URL or Settings (act_XXXXXXXXX)");
  console.log("=======================================================\n");
  process.exit(0);
}

const accountId = rawAccountId.startsWith("act_") ? rawAccountId : `act_${rawAccountId}`;
const fields = "campaign_id,campaign_name,objective,spend,impressions,clicks,cpc,cpm,ctr,actions,date_start,date_stop";
const url = `https://graph.facebook.com/v19.0/${accountId}/insights?level=campaign&fields=${fields}&date_preset=${datePreset}&access_token=${token}`;

async function runReport() {
  console.log(`\nFetching Meta Ads performance for account ${accountId} (${datePreset})...\n`);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.text();
      console.error(`Meta API Error (${res.status}):\n${err}`);
      process.exit(1);
    }

    const json = await res.json();
    const rows = json.data || [];

    if (rows.length === 0) {
      console.log(`No active ad spend or campaign data found for period: ${datePreset}`);
      return;
    }

    console.log("------------------------------------------------------------------------------------------------");
    console.log(
      "Campaign Name".padEnd(35) +
      "Spend".padStart(10) +
      "Impressions".padStart(13) +
      "Clicks".padStart(10) +
      "CPC".padStart(9) +
      "CTR".padStart(9) +
      "Conv".padStart(8)
    );
    console.log("------------------------------------------------------------------------------------------------");

    let totalSpend = 0;
    let totalImpressions = 0;
    let totalClicks = 0;

    for (const r of rows) {
      const spend = parseFloat(r.spend || "0");
      const imps = parseInt(r.impressions || "0", 10);
      const clicks = parseInt(r.clicks || "0", 10);
      const cpc = parseFloat(r.cpc || "0");
      const ctr = parseFloat(r.ctr || "0");
      const actions = r.actions || [];
      const convAction = actions.find(a => a.action_type === "omni_purchase" || a.action_type === "lead" || a.action_type === "purchase");
      const conv = convAction ? convAction.value : "0";

      totalSpend += spend;
      totalImpressions += imps;
      totalClicks += clicks;

      const name = (r.campaign_name || "Unnamed").slice(0, 33).padEnd(35);
      console.log(
        name +
        `$${spend.toFixed(2)}`.padStart(10) +
        imps.toLocaleString().padStart(13) +
        clicks.toLocaleString().padStart(10) +
        `$${cpc.toFixed(2)}`.padStart(9) +
        `${ctr.toFixed(2)}%`.padStart(9) +
        String(conv).padStart(8)
      );
    }

    console.log("------------------------------------------------------------------------------------------------");
    console.log(
      "TOTAL".padEnd(35) +
      `$${totalSpend.toFixed(2)}`.padStart(10) +
      totalImpressions.toLocaleString().padStart(13) +
      totalClicks.toLocaleString().padStart(10) +
      (totalClicks > 0 ? `$${(totalSpend / totalClicks).toFixed(2)}` : "$0.00").padStart(9) +
      (totalImpressions > 0 ? `${((totalClicks / totalImpressions) * 100).toFixed(2)}%` : "0.00%").padStart(9)
    );
    console.log("------------------------------------------------------------------------------------------------\n");
  } catch (error) {
    console.error("Failed to fetch Meta Ads insights:", error);
    process.exit(1);
  }
}

runReport();
