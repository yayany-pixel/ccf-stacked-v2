import { getDatabase } from "@netlify/database";

export interface HourlyVisitorData {
  hour: number;
  label: string;
  today: number;
  yesterday: number;
}

export interface DayTrendData {
  date: string;
  label: string;
  visitors: number;
  analyticsOptIn: number;
  optInRate: number;
}

export interface VisitorComparisonSummary {
  timezone: "America/Chicago" | "UTC";
  asOf: string;
  todayTotal: number;
  yesterdaySameTime: number;
  yesterdayFullDay: number;
  paceChangeNumber: number;
  paceChangePercent: number;
  todayAnalyticsOptIn: number;
  todayMarketingOptIn: number;
  todayOptInRate: number;
  yesterdayAnalyticsOptIn: number;
  yesterdayMarketingOptIn: number;
  yesterdayOptInRate: number;
  todayChatRequests: number;
  yesterdayChatRequests: number;
  hourly: HourlyVisitorData[];
  dailyTrend: DayTrendData[];
  peakHourToday?: {
    hour: number;
    label: string;
    count: number;
  };
}

function formatHour(hour24: number): string {
  if (hour24 === 0) return "12 AM";
  if (hour24 < 12) return `${hour24} AM`;
  if (hour24 === 12) return "12 PM";
  return `${hour24 - 12} PM`;
}

function emptyFallback(timezone: "America/Chicago" | "UTC"): VisitorComparisonSummary {
  const hourly: HourlyVisitorData[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: formatHour(i),
    today: 0,
    yesterday: 0,
  }));

  return {
    timezone,
    asOf: new Date().toISOString(),
    todayTotal: 0,
    yesterdaySameTime: 0,
    yesterdayFullDay: 0,
    paceChangeNumber: 0,
    paceChangePercent: 0,
    todayAnalyticsOptIn: 0,
    todayMarketingOptIn: 0,
    todayOptInRate: 0,
    yesterdayAnalyticsOptIn: 0,
    yesterdayMarketingOptIn: 0,
    yesterdayOptInRate: 0,
    todayChatRequests: 0,
    yesterdayChatRequests: 0,
    hourly,
    dailyTrend: [],
  };
}

export async function getVisitorComparisonData(
  tz: "America/Chicago" | "UTC" = "America/Chicago"
): Promise<VisitorComparisonSummary> {
  const timezone = tz === "UTC" ? "UTC" : "America/Chicago";

  try {
    const db = getDatabase();

    // 1. High-level totals & same-time pace
    const summaryRows = await db.sql`
      WITH bounds AS (
        SELECT 
          date_trunc('day', now() AT TIME ZONE ${timezone}) AS today_start,
          (date_trunc('day', now() AT TIME ZONE ${timezone}) - interval '1 day') AS yesterday_start,
          (now() AT TIME ZONE ${timezone} - interval '1 day') AS yesterday_same_time,
          (now() AT TIME ZONE ${timezone}) AS current_time
      )
      SELECT
        count(CASE WHEN (p.updated_at AT TIME ZONE ${timezone}) >= b.today_start THEN 1 END)::int AS today_total,
        count(CASE WHEN (p.updated_at AT TIME ZONE ${timezone}) >= b.yesterday_start AND (p.updated_at AT TIME ZONE ${timezone}) <= b.yesterday_same_time THEN 1 END)::int AS yesterday_same_time,
        count(CASE WHEN (p.updated_at AT TIME ZONE ${timezone}) >= b.yesterday_start AND (p.updated_at AT TIME ZONE ${timezone}) < b.today_start THEN 1 END)::int AS yesterday_full_day,
        count(CASE WHEN (p.updated_at AT TIME ZONE ${timezone}) >= b.today_start AND p.analytics THEN 1 END)::int AS today_analytics_opt_in,
        count(CASE WHEN (p.updated_at AT TIME ZONE ${timezone}) >= b.today_start AND p.marketing THEN 1 END)::int AS today_marketing_opt_in,
        count(CASE WHEN (p.updated_at AT TIME ZONE ${timezone}) >= b.yesterday_start AND (p.updated_at AT TIME ZONE ${timezone}) < b.today_start AND p.analytics THEN 1 END)::int AS yesterday_analytics_opt_in,
        count(CASE WHEN (p.updated_at AT TIME ZONE ${timezone}) >= b.yesterday_start AND (p.updated_at AT TIME ZONE ${timezone}) < b.today_start AND p.marketing THEN 1 END)::int AS yesterday_marketing_opt_in
      FROM bounds b
      CROSS JOIN privacy_preferences p
      WHERE (p.updated_at AT TIME ZONE ${timezone}) >= b.yesterday_start
    `;

    const s = summaryRows[0] || {};
    const todayTotal = Number(s.today_total || 0);
    const yesterdaySameTime = Number(s.yesterday_same_time || 0);
    const yesterdayFullDay = Number(s.yesterday_full_day || 0);

    const todayAnalyticsOptIn = Number(s.today_analytics_opt_in || 0);
    const todayMarketingOptIn = Number(s.today_marketing_opt_in || 0);
    const todayOptInRate = todayTotal > 0 ? Math.round((todayAnalyticsOptIn / todayTotal) * 100) : 0;

    const yesterdayAnalyticsOptIn = Number(s.yesterday_analytics_opt_in || 0);
    const yesterdayMarketingOptIn = Number(s.yesterday_marketing_opt_in || 0);
    const yesterdayOptInRate = yesterdayFullDay > 0 ? Math.round((yesterdayAnalyticsOptIn / yesterdayFullDay) * 100) : 0;

    const paceChangeNumber = todayTotal - yesterdaySameTime;
    const paceChangePercent = yesterdaySameTime > 0
      ? Math.round(((todayTotal - yesterdaySameTime) / yesterdaySameTime) * 1000) / 10
      : (todayTotal > 0 ? 100 : 0);

    // 2. Hourly breakdown (0-23 hours)
    const hourlyRows = await db.sql`
      WITH bounds AS (
        SELECT 
          date_trunc('day', now() AT TIME ZONE ${timezone}) AS today_start,
          (date_trunc('day', now() AT TIME ZONE ${timezone}) - interval '1 day') AS yesterday_start
      )
      SELECT
        extract(hour from p.updated_at AT TIME ZONE ${timezone})::int AS hour,
        count(CASE WHEN (p.updated_at AT TIME ZONE ${timezone}) >= b.today_start THEN 1 END)::int AS today_count,
        count(CASE WHEN (p.updated_at AT TIME ZONE ${timezone}) >= b.yesterday_start AND (p.updated_at AT TIME ZONE ${timezone}) < b.today_start THEN 1 END)::int AS yesterday_count
      FROM bounds b
      CROSS JOIN privacy_preferences p
      WHERE (p.updated_at AT TIME ZONE ${timezone}) >= b.yesterday_start
      GROUP BY hour
      ORDER BY hour ASC
    `;

    const hourlyMap = new Map<number, { today: number; yesterday: number }>();
    for (const row of hourlyRows) {
      hourlyMap.set(Number(row.hour), {
        today: Number(row.today_count || 0),
        yesterday: Number(row.yesterday_count || 0),
      });
    }

    let peakHourToday: { hour: number; label: string; count: number } | undefined;
    const hourly: HourlyVisitorData[] = Array.from({ length: 24 }, (_, h) => {
      const data = hourlyMap.get(h) || { today: 0, yesterday: 0 };
      if (!peakHourToday || data.today > peakHourToday.count) {
        if (data.today > 0) {
          peakHourToday = { hour: h, label: formatHour(h), count: data.today };
        }
      }
      return {
        hour: h,
        label: formatHour(h),
        today: data.today,
        yesterday: data.yesterday,
      };
    });

    // 3. 7-Day Trend
    const trendRows = await db.sql`
      SELECT
        to_char(updated_at AT TIME ZONE ${timezone}, 'YYYY-MM-DD') AS day_str,
        to_char(updated_at AT TIME ZONE ${timezone}, 'Dy, Mon DD') AS formatted_date,
        count(*)::int AS visitors,
        count(CASE WHEN analytics THEN 1 END)::int AS analytics_opt_in
      FROM privacy_preferences
      WHERE (updated_at AT TIME ZONE ${timezone}) >= (date_trunc('day', now() AT TIME ZONE ${timezone}) - interval '6 days')
      GROUP BY day_str, formatted_date
      ORDER BY day_str ASC
    `;

    const dailyTrend: DayTrendData[] = trendRows.map((r: any) => {
      const visitors = Number(r.visitors || 0);
      const optIn = Number(r.analytics_opt_in || 0);
      return {
        date: String(r.day_str),
        label: String(r.formatted_date),
        visitors,
        analyticsOptIn: optIn,
        optInRate: visitors > 0 ? Math.round((optIn / visitors) * 100) : 0,
      };
    });

    // 4. AI Chat Assistant requests
    const chatRows = await db.sql`
      SELECT
        to_char(day, 'YYYY-MM-DD') AS day_str,
        sum(requests)::int AS total_requests
      FROM ask_ccf_usage
      WHERE day >= (CURRENT_DATE - interval '1 day')
      GROUP BY day_str
    `;

    let todayChatRequests = 0;
    let yesterdayChatRequests = 0;
    for (const row of chatRows) {
      const dayStr = String(row.day_str);
      const requests = Number(row.total_requests || 0);
      const todayStr = new Date().toISOString().slice(0, 10);
      if (dayStr === todayStr) {
        todayChatRequests += requests;
      } else {
        yesterdayChatRequests += requests;
      }
    }

    return {
      timezone,
      asOf: new Date().toISOString(),
      todayTotal,
      yesterdaySameTime,
      yesterdayFullDay,
      paceChangeNumber,
      paceChangePercent,
      todayAnalyticsOptIn,
      todayMarketingOptIn,
      todayOptInRate,
      yesterdayAnalyticsOptIn,
      yesterdayMarketingOptIn,
      yesterdayOptInRate,
      todayChatRequests,
      yesterdayChatRequests,
      hourly,
      dailyTrend,
      peakHourToday,
    };
  } catch (error) {
    console.error("[VisitorMetrics] Error querying visitor comparison:", error);
    return emptyFallback(timezone);
  }
}
