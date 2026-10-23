import assert from "node:assert/strict";
import { getMetaDashboard } from "../lib/metaDashboard.server";
import { resolveMetaDatasetId } from "../lib/metaConfig";
import { fetchMetaCampaignInsights } from "../lib/metaAds";

async function main() {
  assert.equal(resolveMetaDatasetId(), "315271500363564");
  assert.equal(resolveMetaDatasetId(" "), "315271500363564");
  assert.equal(resolveMetaDatasetId("123"), "123");
  assert.equal((await getMetaDashboard({})).state, "unconfigured");
  const oldFetch = globalThis.fetch;
  const env = { META_ACCESS_TOKEN: "fixture", META_AD_ACCOUNT_ID: "123" };
  let calls = 0;
  try {
    globalThis.fetch = async (input, init) => {
      calls++;
      const url = new URL(String(input));
      assert(url.pathname.startsWith("/v26.0/act_123/"));
      assert(!url.searchParams.has("access_token"));
      assert.equal(init?.cache, "no-store");
      return Response.json({ error: { code: 200, message: "must not escape" } }, { status: 403 });
    };
    assert.deepEqual(await getMetaDashboard(env), { state: "permission", report: null });
    globalThis.fetch = async () => Response.json({ data: [] });
    assert.equal((await getMetaDashboard(env)).state, "zero_spend");
    globalThis.fetch = async input => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/campaigns")) return Response.json({ data: [{ id: "1", objective: "OUTCOME_LEADS", status: "PAUSED" }] });
      const after = url.searchParams.get("after");
      return Response.json({ data: [{ campaign_id: after ? "2" : "1", campaign_name: "Fixture", objective: "OUTCOME_SALES", spend: "10", clicks: "20", impressions: "1000", actions: [
        { action_type: "initiate_checkout", value: "99" },
        { action_type: "purchase", value: "2" },
        { action_type: "omni_purchase", value: "2" },
        { action_type: "lead", value: "3" },
      ] }], ...(!after ? { paging: { next: "https://untrusted.invalid/?access_token=never-follow", cursors: { after: "page2" } } } : {}) });
    };
    const result = await getMetaDashboard(env);
    assert.equal(result.state, "live");
    assert.equal(result.report?.totalConversions, 5);
    assert.equal(result.report?.totalSpend, 20);
    assert.equal(result.report?.averageCpc, 0.5);
    assert.equal(result.report?.averageCtr, 2);
    assert.equal(result.report?.learningStatus, "INSUFFICIENT_DATA");
    globalThis.fetch = async () => Response.json({ data: [{ actions: [{ action_type: "initiate_checkout", value: "5" }], spend: "NaN" }] });
    const rows = await fetchMetaCampaignInsights("fixture", "123");
    assert.equal(rows[0].conversions, 0);
    assert.equal(rows[0].spend, 0);
    globalThis.fetch = async () => { throw new Error("private provider detail"); };
    assert.deepEqual(await getMetaDashboard(env), { state: "unavailable", report: null });
  } finally { globalThis.fetch = oldFetch; }
  console.log("Meta dashboard: permissions, zero spend, pagination, conversion aliases, weighted KPIs, and dataset defaults passed.");
}
main();
