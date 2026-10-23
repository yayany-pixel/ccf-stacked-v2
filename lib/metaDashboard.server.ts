import { analyzeCampaignPerformance, fetchMetaCampaignInsights, fetchMetaCampaigns, MetaReportingError } from "./metaAds";

export async function getMetaDashboard(env: Record<string, string | undefined> = process.env) {
  const token = env.META_ACCESS_TOKEN;
  const account = env.META_AD_ACCOUNT_ID;
  if (!token || !account) return { state: "unconfigured" as const, report: null };
  if (!/^(act_)?\d+$/.test(account.trim())) return { state: "unconfigured" as const, report: null };
  try {
    const [insights, campaigns] = await Promise.all([
      fetchMetaCampaignInsights(token, account, "last_30d"),
      fetchMetaCampaigns(token, account),
    ]);
    const rows = insights.map(row => {
      const campaign = campaigns.find(c => c.id === row.campaignId);
      const objective = campaign?.objective || row.objective;
      return { ...row, objective, status: campaign?.status || "UNKNOWN",
        conversions: objective === "OUTCOME_LEADS" ? row.leads || 0 : row.purchases || 0 };
    });
    const report = analyzeCampaignPerformance(rows);
    return { state: report.totalSpend === 0 ? "zero_spend" as const : "live" as const, report };
  } catch (error) {
    // Never serialize provider messages, access tokens, or raw response bodies.
    return { state: error instanceof MetaReportingError && error.reason === "permission"
      ? "permission" as const : "unavailable" as const, report: null };
  }
}
