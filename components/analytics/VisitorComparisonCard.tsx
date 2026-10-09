"use client";

import { useState, useTransition } from "react";
import GlassCard from "@/components/ui/GlassCard";
import type { VisitorComparisonSummary, HourlyVisitorData } from "@/lib/analyticsVisitorMetrics";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Calendar,
  Zap,
  BarChart2
} from "lucide-react";

interface VisitorComparisonCardProps {
  initialData: VisitorComparisonSummary;
}

export default function VisitorComparisonCard({ initialData }: VisitorComparisonCardProps) {
  const [data, setData] = useState<VisitorComparisonSummary>(initialData);
  const [timezone, setTimezone] = useState<"America/Chicago" | "UTC">(initialData.timezone || "America/Chicago");
  const [isPending, startTransition] = useTransition();
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  const fetchMetrics = (tz: "America/Chicago" | "UTC") => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/analytics/visitor-comparison?tz=${encodeURIComponent(tz)}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch metrics");
        const json: VisitorComparisonSummary = await response.json();
        setData(json);
        setTimezone(tz);
      } catch (err) {
        console.error("Error refreshing visitor comparison:", err);
      }
    });
  };

  const handleTimezoneChange = (newTz: "America/Chicago" | "UTC") => {
    if (newTz === timezone) return;
    fetchMetrics(newTz);
  };

  const handleRefresh = () => {
    fetchMetrics(timezone);
  };

  // Find max value for hourly bars scaling
  const maxHourlyVal = Math.max(
    1,
    ...data.hourly.map((h) => Math.max(h.today, h.yesterday))
  );

  const isPositivePace = data.paceChangeNumber >= 0;
  const activeHoverHour: HourlyVisitorData | undefined =
    hoveredHour !== null ? data.hourly[hoveredHour] : undefined;

  const formattedAsOf = new Date(data.asOf).toLocaleTimeString("en-US", {
    timeZone: data.timezone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <GlassCard className="p-6 md:p-8 border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-purple-950/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                Real-Time Site Activity
              </span>
              <span className="text-white/40 text-xs">•</span>
              <span className="text-xs text-white/60">Updated {formattedAsOf}</span>
            </div>
            <h2 className="mt-2 text-2xl md:text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-2.5">
              <Users className="w-7 h-7 text-purple-400 inline-block" />
              Today vs. Yesterday Visitors
            </h2>
            <p className="mt-1 text-sm text-white/70 max-w-2xl">
              Live comparison of unique visitor sessions recorded across the studio website and cookie preferences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Timezone Switcher */}
            <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/10 backdrop-blur-md">
              <button
                type="button"
                onClick={() => handleTimezoneChange("America/Chicago")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  timezone === "America/Chicago"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                Chicago (CDT)
              </button>
              <button
                type="button"
                onClick={() => handleTimezoneChange("UTC")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  timezone === "UTC"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                UTC
              </button>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isPending}
              aria-label="Refresh visitor metrics"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin text-purple-400" : ""}`} />
              <span>{isPending ? "Syncing..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* Primary KPI Scorecards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Today's Visitors */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="font-semibold uppercase tracking-wider">Today So Far</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {data.todayTotal.toLocaleString()}
              </span>
              <span className="text-xs text-white/50">visitors</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold ${
                  isPositivePace
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}
              >
                {isPositivePace ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {`${isPositivePace ? "+" : ""}${data.paceChangePercent}%`}
              </span>
              <span className="text-xs text-white/60">vs. yesterday same time</span>
            </div>
          </div>

          {/* Card 2: Yesterday's Baseline */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="font-semibold uppercase tracking-wider">Yesterday Baseline</span>
              <Calendar className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {data.yesterdaySameTime.toLocaleString()}
              </span>
              <span className="text-xs text-white/50">at this exact hour</span>
            </div>
            <div className="mt-3 text-xs text-white/60">
              Full day finished at{" "}
              <strong className="text-white/90 font-semibold">
                {data.yesterdayFullDay.toLocaleString()}
              </strong>{" "}
              visitors
            </div>
          </div>

          {/* Card 3: Consent Opt-In */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="font-semibold uppercase tracking-wider">Analytics Consent</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-emerald-400 tracking-tight">
                {`${data.todayOptInRate}%`}
              </span>
              <span className="text-xs text-white/50">opted-in</span>
            </div>
            <div className="mt-3 text-xs text-white/60">
              {data.todayAnalyticsOptIn} consented vs {data.todayTotal - data.todayAnalyticsOptIn} restricted
            </div>
          </div>

          {/* Card 4: AI Concierge Engagements */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="font-semibold uppercase tracking-wider">AI Assistant Chats</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-amber-300 tracking-tight">
                {data.todayChatRequests}
              </span>
              <span className="text-xs text-white/50">sessions</span>
            </div>
            <div className="mt-3 text-xs text-white/60">
              Yesterday had <strong className="text-white/90">{data.yesterdayChatRequests}</strong> chat sessions
            </div>
          </div>
        </div>

        {/* Pace Insight Banner */}
        <div className="mt-6 rounded-2xl border border-purple-500/30 bg-purple-900/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                {isPositivePace
                  ? `Pacing Ahead: +${data.paceChangeNumber} Visitors (${data.paceChangePercent > 0 ? "+" : ""}${data.paceChangePercent}%)`
                  : `Pacing Behind: ${data.paceChangeNumber} Visitors (${data.paceChangePercent}%)`}
              </div>
              <div className="text-xs text-white/70">
                {isPositivePace
                  ? `Traffic today is tracking higher than yesterday's benchmark at the identical time of day.`
                  : `Traffic is currently tracking behind yesterday's volume.`}
                {data.peakHourToday && (
                  <span className="ml-1 text-purple-300 font-medium">
                    Peak surge occurred at {data.peakHourToday.label} with {data.peakHourToday.count} visitors.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Hourly Comparison Chart */}
      <GlassCard className="p-6 md:p-8 border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg md:text-xl font-serif font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              24-Hour Traffic Comparison ({timezone === "America/Chicago" ? "CDT" : "UTC"})
            </h3>
            <p className="text-xs text-white/60 mt-1">
              Hover over any hour to compare visitor volumes between today and yesterday
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-purple-500 shadow-sm shadow-purple-500/50" />
              <span className="text-white/80 font-medium">Today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-600/70 border border-white/20" />
              <span className="text-white/60">Yesterday</span>
            </div>
          </div>
        </div>

        {/* Selected / Hovered Hour Callout */}
        <div className="mb-4 min-h-[36px] px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs flex items-center justify-between">
          {activeHoverHour ? (
            <div className="flex items-center gap-4 w-full justify-between">
              <span className="font-semibold text-white">
                Hour: {activeHoverHour.label} ({timezone === "America/Chicago" ? "Studio Time" : "UTC"})
              </span>
              <div className="flex items-center gap-4">
                <span className="text-purple-300">
                  Today: <strong>{activeHoverHour.today} visitors</strong>
                </span>
                <span className="text-white/60">
                  Yesterday: <strong>{activeHoverHour.yesterday} visitors</strong>
                </span>
                <span className={`font-semibold ${
                  activeHoverHour.today >= activeHoverHour.yesterday ? "text-emerald-400" : "text-amber-400"
                }`}>
                  Diff: {activeHoverHour.today - activeHoverHour.yesterday >= 0 ? "+" : ""}
                  {activeHoverHour.today - activeHoverHour.yesterday}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-white/50 italic">
              Tip: Hover or tap any hour bar below for detailed numbers
            </span>
          )}
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-12 md:grid-cols-24 gap-1.5 items-end h-44 pt-6 pb-2 border-b border-white/10">
          {data.hourly.map((item) => {
            const todayHeight = Math.max(4, Math.round((item.today / maxHourlyVal) * 120));
            const yesterdayHeight = Math.max(4, Math.round((item.yesterday / maxHourlyVal) * 120));
            const isHovered = hoveredHour === item.hour;

            return (
              <div
                key={item.hour}
                onMouseEnter={() => setHoveredHour(item.hour)}
                onMouseLeave={() => setHoveredHour(null)}
                className={`relative flex flex-col justify-end items-center h-full group cursor-pointer transition-all ${
                  isHovered ? "opacity-100 scale-105" : "opacity-90 hover:opacity-100"
                }`}
              >
                <div className="flex items-end gap-0.5 w-full justify-center">
                  {/* Yesterday Bar */}
                  <div
                    style={{ height: `${yesterdayHeight}px` }}
                    className={`w-2 md:w-2.5 rounded-t-sm transition-all ${
                      isHovered
                        ? "bg-slate-400"
                        : "bg-slate-600/80 group-hover:bg-slate-500"
                    }`}
                    title={`Yesterday ${item.label}: ${item.yesterday} visitors`}
                  />
                  {/* Today Bar */}
                  <div
                    style={{ height: `${todayHeight}px` }}
                    className={`w-2 md:w-2.5 rounded-t-sm transition-all ${
                      item.today > 0
                        ? isHovered
                          ? "bg-purple-400 shadow-md shadow-purple-500/50"
                          : "bg-purple-600 group-hover:bg-purple-500"
                        : "bg-purple-900/30"
                    }`}
                    title={`Today ${item.label}: ${item.today} visitors`}
                  />
                </div>
                <div className="mt-2 text-[10px] text-white/50 font-mono">
                  {item.hour % 3 === 0 ? item.hour : ""}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-white/40 font-mono">
          <span>12 AM (Midnight)</span>
          <span>6 AM</span>
          <span>12 PM (Noon)</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
      </GlassCard>

      {/* Recent 7-Day Trend */}
      {data.dailyTrend.length > 0 && (
        <GlassCard className="p-6 md:p-8 border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                7-Day Historical Daily Trend
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Progression of tracked visitors and analytics consent rates across recent days
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {data.dailyTrend.map((day, idx) => {
              const isToday = idx === data.dailyTrend.length - 1;
              return (
                <div
                  key={day.date}
                  className={`rounded-2xl border p-4 text-center transition-all ${
                    isToday
                      ? "border-purple-500/50 bg-purple-900/30 shadow-lg shadow-purple-900/20 ring-1 ring-purple-500/30"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <div className="text-xs font-semibold text-white/70">
                    {day.label}
                  </div>
                  {isToday && (
                    <span className="inline-block mt-1 px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded bg-purple-500/30 text-purple-300">
                      In Progress
                    </span>
                  )}
                  <div className="mt-3 text-2xl font-bold text-white">
                    {day.visitors}
                  </div>
                  <div className="text-[11px] text-white/50 mt-0.5">visitors</div>
                  <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-emerald-400">
                    {`${day.optInRate}% consent`}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
