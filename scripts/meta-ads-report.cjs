#!/usr/bin/env node
/** Read-only Meta reporting. A separate ads_read token is required. */
const token = process.env.META_ACCESS_TOKEN;
const raw = process.env.META_AD_ACCOUNT_ID || '';
const accountId = raw.startsWith('act_') ? raw : `act_${raw}`;
const version = process.env.META_REPORTING_API_VERSION || 'v26.0';
const datePreset = process.argv[2] || 'last_7d';
if (!token || !raw) {
  console.log('Reporting is not configured. Set META_ACCESS_TOKEN (ads_read) and META_AD_ACCOUNT_ID. CAPI authorization is independent.');
  process.exit(0);
}
if (!/^act_\d+$/.test(accountId) || !/^v\d+\.0$/.test(version) || !/^[a-z0-9_]+$/.test(datePreset)) {
  console.error('Invalid reporting configuration.'); process.exit(1);
}
async function main() {
  const fields = 'campaign_id,campaign_name,objective,spend,impressions,clicks,actions,date_start,date_stop';
  let url = new URL(`https://graph.facebook.com/${version}/${accountId}/insights`);
  url.search = new URLSearchParams({ level:'campaign', fields, date_preset:datePreset, limit:'100' }).toString();
  const rows = [];
  for (let page = 0; url && page < 100; page++) {
    if (url.origin !== 'https://graph.facebook.com') throw new Error('Unexpected reporting host');
    url.searchParams.delete('access_token');
    const response = await fetch(url, {headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(10000)});
    if (!response.ok) { console.error(`Meta reporting failed: HTTP ${response.status}. Check the separate reporting token and ads_read access. CAPI delivery is unverified.`); process.exitCode=1;return; }
    const result = await response.json(); rows.push(...(result.data || []));
    url = result.paging?.next ? new URL(result.paging.next) : null;
  }
  if (url) throw new Error('Reporting pagination limit reached');
  const count = (actions, names) => {
    for (const name of names) { const a=actions.find(x=>x.action_type===name); if(a) return Number(a.value)||0; }
    return 0;
  };
  console.log(`Account ${accountId}; period ${datePreset}; API ${version}`);
  console.table(rows.map(r=>{
    const actions=r.actions||[], spend=Number(r.spend)||0;
    // Aliases are alternatives, never added together; funnel stages can overlap.
    const leads=count(actions,['lead','offsite_conversion.fb_pixel_lead']);
    const purchases=count(actions,['omni_purchase','purchase','offsite_conversion.fb_pixel_purchase']);
    return {campaign:r.campaign_name, spend, clicks:Number(r.clicks)||0,
      checkout_intent:count(actions,['initiate_checkout','offsite_conversion.fb_pixel_initiate_checkout']),
      leads, purchases, lead_CPA:leads?+(spend/leads).toFixed(2):null,
      purchase_CPA:purchases?+(spend/purchases).toFixed(2):null};
  }));
  console.log('Meta-attributed actions may overlap across funnel stages and sources. These figures do not verify Acuity payment receipt, revenue, or ad-set learning status.');
}
main().catch(()=>{console.error('Reporting failed; check configuration, authorization and network access.');process.exitCode=1});
