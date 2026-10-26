import { getMetaDashboard } from "@/lib/metaDashboard.server";
import { CCF_AD_BLUEPRINTS } from "@/lib/metaAds";

export default async function MetaPerformance() {
  const { state, report } = await getMetaDashboard();
  const messages = {
    unconfigured: "Connect META_ACCESS_TOKEN and META_AD_ACCOUNT_ID to load reporting.",
    permission: "Meta reporting access is unavailable. The reporting token needs ads_read and access to this ad account.",
    unavailable: "Meta reporting is temporarily unavailable. No performance figures are being estimated.",
    zero_spend: "Meta returned zero spend for the last 30 days. Suggested campaign plans are shown below.",
    live: "Meta campaign reporting · Last 30 days · Account reporting timezone",
  };
  const metrics = [
    ["Total spend (account currency)", report?.totalSpend.toFixed(2)],
    ["Clicks", report?.totalClicks], ["Impressions", report?.totalImpressions],
    ["Average CPC (account currency)", report?.averageCpc.toFixed(2)],
    ["Average CTR", report ? `${report.averageCtr.toFixed(2)}%` : undefined],
    ["Total primary conversions", report?.totalConversions],
  ];
  return <section className="mt-14 rounded-2xl border border-white/20 bg-white/5 p-6 text-white" aria-labelledby="meta-performance">
    <h2 id="meta-performance" className="text-2xl font-bold">Meta advertising performance</h2>
    <p className="mt-2 text-white/75">{messages[state]}</p>
    <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{metrics.map(([label, value]) =>
      <div key={label} className="rounded-xl bg-white/10 p-4"><dt className="text-sm text-white/70">{label}</dt><dd className="mt-2 text-2xl">{value ?? "Unavailable"}</dd></div>
    )}</dl>
    <p className="mt-4 text-sm text-white/70">Primary conversions count leads for lead campaigns and purchases for other campaigns. Checkout actions and overlapping action aliases are excluded. CPC and CTR are weighted across the account.</p>
    <h3 className="mt-6 font-semibold">AI learning status: {report ? "Assessment only" : "Awaiting data"}</h3>
    <p className="mt-2 text-sm text-white/70">{report?.learningSummary || "No verified reporting data is available."} This dashboard does not train a model or change campaign budgets.</p>
    {state !== "live" && <><h3 className="mt-8 text-xl font-semibold">Four recommended campaign blueprints</h3>
      <p className="mt-2 text-sm text-white/70">Plans, not verified active ads. Budgets are recommendations in USD; confirm current class availability before launch.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{CCF_AD_BLUEPRINTS.map(b => <article key={b.id} className="rounded-xl border border-white/15 p-4">
        <h4 className="font-semibold">{b.title}</h4><p className="mt-2">${b.recommendedDailyBudget.toFixed(2)}/day · {b.optimizationGoal.replaceAll("_", " ")}</p>
        <p className="mt-2 text-sm text-white/70">{b.audience.locations.map(l => l.city).join(" & ")} · Ages {b.audience.minAge}–{b.audience.maxAge} · {b.audience.geoRadiusMiles}-mile radius</p>
        <p className="mt-2 text-sm text-white/70">Interests: {b.audience.interests.join(", ")}</p>
      </article>)}</div></>}
  </section>;
}
