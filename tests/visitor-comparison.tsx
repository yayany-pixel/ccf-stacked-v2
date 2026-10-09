import React from "react";
import { renderToString } from "react-dom/server";
import assert from "node:assert/strict";
import VisitorComparisonCard from "../components/analytics/VisitorComparisonCard";
import { getVisitorComparisonData, type VisitorComparisonSummary } from "../lib/analyticsVisitorMetrics";
import { GET as visitorComparisonApi } from "../app/api/analytics/visitor-comparison/route";

(globalThis as any).React = React;

async function runTests() {
  console.log("Running visitor comparison tests...");

  // 1. Test data retrieval in America/Chicago timezone
  const chicagoData = await getVisitorComparisonData("America/Chicago");
  assert.equal(chicagoData.timezone, "America/Chicago");
  assert.equal(typeof chicagoData.todayTotal, "number");
  assert.equal(typeof chicagoData.yesterdaySameTime, "number");
  assert.equal(typeof chicagoData.yesterdayFullDay, "number");
  assert.equal(typeof chicagoData.paceChangeNumber, "number");
  assert.equal(typeof chicagoData.paceChangePercent, "number");
  assert.equal(chicagoData.hourly.length, 24);
  assert.equal(chicagoData.hourly[0].hour, 0);
  assert.equal(chicagoData.hourly[23].hour, 23);
  assert.ok(Array.isArray(chicagoData.dailyTrend));

  // 2. Test data retrieval in UTC timezone
  const utcData = await getVisitorComparisonData("UTC");
  assert.equal(utcData.timezone, "UTC");
  assert.equal(utcData.hourly.length, 24);

  // 3. Test mock summary calculation & edge cases
  const mockData: VisitorComparisonSummary = {
    timezone: "America/Chicago",
    asOf: new Date().toISOString(),
    todayTotal: 150,
    yesterdaySameTime: 125,
    yesterdayFullDay: 180,
    paceChangeNumber: 25,
    paceChangePercent: 20.0,
    todayAnalyticsOptIn: 85,
    todayMarketingOptIn: 80,
    todayOptInRate: 57,
    yesterdayAnalyticsOptIn: 90,
    yesterdayMarketingOptIn: 88,
    yesterdayOptInRate: 50,
    todayChatRequests: 5,
    yesterdayChatRequests: 12,
    hourly: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: `${i}:00`,
      today: i === 9 ? 25 : 5,
      yesterday: 6,
    })),
    dailyTrend: [
      { date: "2026-10-07", label: "Wed, Oct 07", visitors: 160, analyticsOptIn: 80, optInRate: 50 },
      { date: "2026-10-08", label: "Thu, Oct 08", visitors: 180, analyticsOptIn: 90, optInRate: 50 },
      { date: "2026-10-09", label: "Fri, Oct 09", visitors: 150, analyticsOptIn: 85, optInRate: 57 },
    ],
    peakHourToday: { hour: 9, label: "9 AM", count: 25 },
  };

  // 4. Test SSR of VisitorComparisonCard
  const html = renderToString(<VisitorComparisonCard initialData={mockData} />);
  assert.ok(html.includes("Today vs. Yesterday Visitors"), "Renders main title");
  assert.ok(html.includes("150"), "Renders today total");
  assert.ok(html.includes("125"), "Renders yesterday same time");
  assert.ok(html.includes("20%"), "Renders pace percentage");
  assert.ok(html.includes("57%"), "Renders consent opt-in rate");
  assert.ok(html.includes("24-Hour Traffic Comparison"), "Renders hourly chart header");
  assert.ok(html.includes("7-Day Historical Daily Trend"), "Renders daily trend section");

  // 5. Test SSR with live database data
  assert.doesNotThrow(() => {
    const liveHtml = renderToString(<VisitorComparisonCard initialData={chicagoData} />);
    assert.ok(liveHtml.length > 0);
  });

  // 6. Test API route handler
  const apiReq = new Request("https://colorcocktailfactory.com/api/analytics/visitor-comparison?tz=America/Chicago");
  const apiRes = await visitorComparisonApi(apiReq);
  assert.equal(apiRes.status, 200);
  const apiJson = await apiRes.json();
  assert.equal(apiJson.timezone, "America/Chicago");
  assert.equal(typeof apiJson.todayTotal, "number");
  assert.equal(apiJson.hourly.length, 24);

  console.log("All visitor comparison tests passed successfully!");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
