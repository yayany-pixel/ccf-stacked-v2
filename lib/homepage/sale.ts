export type WorkshopSaleConfig = {
  mode: string;
  deadline: string;
  offerId: string;
  visitorSpecific: boolean;
  minHours: number;
  maxHours: number;
};

export const WORKSHOP_SALE_CONFIG: WorkshopSaleConfig = {
  mode: process.env.NEXT_PUBLIC_WORKSHOP_SALE_MODE || "campaign",
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

export function resolveSaleDeadline(
  config: WorkshopSaleConfig,
  now: number,
  getStorage: () => DeadlineStorage = () => window.localStorage,
  random: () => number = Math.random,
): number | null {
  if (config.mode === "campaign" || (config.mode === "random-start" && !config.visitorSpecific)) {
    const parts = config.deadline.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/);
    if (!parts) return null;
    const [year, month, day, hours, minutes, seconds] = parts.slice(1).map(Number);
    const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1] || hours > 23 || minutes > 59 || seconds > 59) return null;
    const deadline = Date.parse(config.deadline);
    return Number.isFinite(deadline) ? deadline : null;
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

export function saleTimeParts(seconds: number, hourDigits = 2): string[] {
  return [
    String(Math.floor(seconds / 3600)).padStart(hourDigits, "0"),
    String(Math.floor(seconds / 60) % 60).padStart(2, "0"),
    String(seconds % 60).padStart(2, "0"),
  ];
}
