export type WorkshopSaleConfig = {
  mode: string;
  deadline: string;
  offerId: string;
  visitorSpecific: boolean;
  minHours: number;
  maxHours: number;
};

export const WORKSHOP_SALE_CONFIG: WorkshopSaleConfig = {
  mode: process.env.NEXT_PUBLIC_WORKSHOP_SALE_MODE || "cycle",
  deadline: process.env.NEXT_PUBLIC_WORKSHOP_SALE_DEADLINE || "",
  offerId: process.env.NEXT_PUBLIC_WORKSHOP_SALE_OFFER_ID || "",
  visitorSpecific: process.env.NEXT_PUBLIC_WORKSHOP_SALE_VISITOR_SPECIFIC === "true",
  minHours: Number(process.env.NEXT_PUBLIC_WORKSHOP_SALE_MIN_HOURS || "3"),
  maxHours: Number(process.env.NEXT_PUBLIC_WORKSHOP_SALE_MAX_HOURS || "12"),
};

type DeadlineStorage = Pick<Storage, "getItem" | "setItem">;

export function saleStorageKey(offerId: string): string {
  return `ccf:workshop-sale:${encodeURIComponent(offerId.trim())}:deadline`;
}

// Countdown cycle parameters matching public/countdown.html
export const CYCLE_ZONE = "America/Chicago";
export const CYCLE_ANCHOR = [2026, 10, 11] as const;
export const CYCLE_DAYS = 3;

const cycleFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: CYCLE_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

function cycleParts(ms: number): Record<string, number> {
  const o: Record<string, number> = {};
  cycleFormatter.formatToParts(new Date(ms)).forEach(p => {
    o[p.type] = Number(p.value);
  });
  return o;
}

function cycleOffsetAt(ms: number): number {
  const p = cycleParts(ms);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ms / 1000) * 1000;
}

function cycleZoneMidnight(y: number, m: number, d: number): number {
  const guess = Date.UTC(y, m - 1, d);
  const t = guess - cycleOffsetAt(guess);
  const off2 = cycleOffsetAt(t);
  return guess - off2 !== t ? guess - off2 : t;
}

export function calculateCycleDeadline(nowMs: number): number {
  const p = cycleParts(nowMs);
  const days = Math.round((Date.UTC(p.year, p.month - 1, p.day) - Date.UTC(CYCLE_ANCHOR[0], CYCLE_ANCHOR[1] - 1, CYCLE_ANCHOR[2])) / 86400000);
  const cycle = Math.floor(days / CYCLE_DAYS);
  return cycleZoneMidnight(CYCLE_ANCHOR[0], CYCLE_ANCHOR[1], CYCLE_ANCHOR[2] + (cycle + 1) * CYCLE_DAYS);
}

export function parseCampaignDeadline(rawDeadline: string): number | null {
  const parts = rawDeadline.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/);
  if (!parts) return null;
  const [year, month, day, hours, minutes, seconds] = parts.slice(1).map(Number);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1] || hours > 23 || minutes > 59 || seconds > 59) return null;
  const parsed = Date.parse(rawDeadline);
  return Number.isFinite(parsed) ? parsed : null;
}

export function resolveSaleDeadline(
  config: WorkshopSaleConfig,
  now: number,
  getStorage: () => DeadlineStorage = () => window.localStorage,
  random: () => number = Math.random,
): number | null {
  if (config.mode === "cycle") {
    return calculateCycleDeadline(now);
  }

  if (config.mode === "campaign" || (config.mode === "random-start" && !config.visitorSpecific)) {
    if (!config.deadline) {
      // Default to cycle if no campaign deadline was explicitly provided
      return calculateCycleDeadline(now);
    }
    return parseCampaignDeadline(config.deadline);
  }

  if (config.mode !== "random-start" || !config.visitorSpecific || !config.offerId.trim()) return null;
  if (!Number.isFinite(config.minHours) || !Number.isFinite(config.maxHours) || config.minHours <= 0 || config.maxHours < config.minHours) return null;

  try {
    const storage = getStorage();
    const key = saleStorageKey(config.offerId);
    const saved = storage.getItem(key);
    if (saved !== null) {
      const deadline = Number(saved);
      return saved.trim() && Number.isSafeInteger(deadline) && deadline > 0 ? deadline : null;
    }
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) return null;
    const deadline = Math.round(now + (config.minHours + sample * (config.maxHours - config.minHours)) * 3_600_000);
    if (!Number.isSafeInteger(deadline) || deadline <= 0) return null;
    storage.setItem(key, String(deadline));
    return storage.getItem(key) === String(deadline) ? deadline : null;
  } catch {
    return null;
  }
}

export function saleSecondsRemaining(deadline: number, now: number): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

export type SaleTimeUnit = {
  label: string;
  value: string;
};

export function saleTimeUnits(seconds: number): SaleTimeUnit[] {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) {
    return [
      { label: "DAYS", value: String(days).padStart(2, "0") },
      { label: "HOURS", value: String(hours).padStart(2, "0") },
      { label: "MINUTES", value: String(minutes).padStart(2, "0") },
      { label: "SECONDS", value: String(secs).padStart(2, "0") },
    ];
  }

  return [
    { label: "HOURS", value: String(hours).padStart(2, "0") },
    { label: "MINUTES", value: String(minutes).padStart(2, "0") },
    { label: "SECONDS", value: String(secs).padStart(2, "0") },
  ];
}

export function saleTimeParts(seconds: number, hourDigits = 2): string[] {
  return [
    String(Math.floor(seconds / 3600)).padStart(hourDigits, "0"),
    String(Math.floor(seconds / 60) % 60).padStart(2, "0"),
    String(seconds % 60).padStart(2, "0"),
  ];
}
