/**
 * Meta Marketing API integration for ad campaign insights, spend, and conversion reporting.
 * Reads campaigns, ad sets, ads, and daily insights from Meta Graph API.
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

const GRAPH_API_VERSION = "v19.0";
const BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Normalizes Meta Ad Account ID to the expected `act_<ID>` format.
 */
export function formatAdAccountId(rawId: string): string {
  const trimmed = rawId.trim();
  return trimmed.startsWith("act_") ? trimmed : `act_${trimmed}`;
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
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("level", "campaign");
  url.searchParams.set("fields", fields);
  url.searchParams.set("date_preset", datePreset);

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Meta API error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  const data = json.data || [];

  return data.map((item: any) => {
    // Actions array holds various conversion types (e.g., omni_purchase, lead, link_click)
    const actions: Array<{ action_type: string; value: string }> = item.actions || [];
    const purchaseOrLead = actions.find(
      a => a.action_type === "omni_purchase" || a.action_type === "lead" || a.action_type === "purchase"
    );
    const conversions = purchaseOrLead ? parseFloat(purchaseOrLead.value) : 0;

    return {
      campaignId: item.campaign_id,
      campaignName: item.campaign_name,
      status: item.status || "ACTIVE",
      objective: item.objective || "UNKNOWN",
      spend: parseFloat(item.spend || "0"),
      impressions: parseInt(item.impressions || "0", 10),
      clicks: parseInt(item.clicks || "0", 10),
      cpc: parseFloat(item.cpc || "0"),
      cpm: parseFloat(item.cpm || "0"),
      ctr: parseFloat(item.ctr || "0"),
      conversions,
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
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("fields", fields);
  url.searchParams.set("limit", "100");

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Meta API error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  return json.data || [];
}
