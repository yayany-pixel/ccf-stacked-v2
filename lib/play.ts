import { localDateAndTime, validDate } from "./askccf/schedule";

export const LOCATIONS = { chicago: "Chicago", eugene: "Eugene", online: "Online" } as const;
export type PlayLocation = keyof typeof LOCATIONS;
export const MATCHES = {
  wheel: { name: "The Delightful Mess-Makers", craft: "Pottery wheel", note: "A little spin, a lot of laughter. You’re here for the process, the muddy hands, and the story you’ll tell afterward.", mark: "◎" },
  handbuilding: { name: "The Wonderfully Wonky Ones", craft: "Handbuilding", note: "You see a lump of clay and a hundred possibilities. A crooked handle? That’s a signature. Make something only you could make.", mark: "〰" },
  mosaic: { name: "The Color Collectors", craft: "Mosaics", note: "One little piece at a time, you turn a handful of colors into something bright. Your kind of magic is in the details.", mark: "✳" },
  bonsai: { name: "The Little-World Makers", craft: "Bonsai", note: "Slow down, find a little green, and make room for wonder. You’re happiest bringing a tiny world to life.", mark: "❋" },
} as const;
export type MatchKey = keyof typeof MATCHES;
export const isMatchKey = (value: unknown): value is MatchKey => typeof value === "string" && Object.hasOwn(MATCHES, value);
export type PlayFilters = { location: PlayLocation; when: "month" | "weekend" | "custom"; groupSize: number; budget: number | null; activity: MatchKey | "any"; dateFrom?: string; dateTo?: string };

export function dateBounds(location: PlayLocation, now = new Date()) {
  const today = localDateAndTime(now.toISOString(), location).date;
  const add = (days: number) => new Date(new Date(`${today}T12:00:00Z`).getTime() + days * 86_400_000).toISOString().slice(0, 10);
  return { today, lastDay: add(59), add };
}

export function parsePlayFilters(body: Record<string, unknown>, now = new Date()): PlayFilters & { dateFrom: string; dateTo: string } {
  if (typeof body.location !== "string" || !Object.hasOwn(LOCATIONS, body.location)) throw new Error("Choose Chicago, Eugene, or Online.");
  const location = body.location as PlayLocation;
  if (!["month", "weekend", "custom"].includes(String(body.when))) throw new Error("Choose a date range.");
  if (!Number.isInteger(body.groupSize) || Number(body.groupSize) < 1 || Number(body.groupSize) > 8) throw new Error("Choose a group of 1–8 people. For larger groups, explore private events.");
  if (body.budget !== null && ![35, 50, 75, 100, 150].includes(Number(body.budget))) throw new Error("Choose one of the available budgets.");
  if (body.budget !== null && typeof body.budget !== "number") throw new Error("Choose a valid budget.");
  if (body.activity !== "any" && !isMatchKey(body.activity)) throw new Error("Choose a creative activity.");
  const { today, lastDay, add } = dateBounds(location, now);
  let dateFrom = today;
  let dateTo = add(29);
  if (body.when === "weekend") {
    const day = new Date(`${today}T12:00:00Z`).getUTCDay();
    dateFrom = add(day === 0 || day >= 5 ? 0 : 5 - day);
    dateTo = add((7 - day) % 7);
  }
  if (body.when === "custom") {
    const from = validDate(body.dateFrom);
    const to = validDate(body.dateTo);
    if (!from || !to || from < today || from > to || to > lastDay) throw new Error("Choose a start and end date within the next 60 days.");
    dateFrom = from;
    dateTo = to;
  }
  return { location, when: body.when as PlayFilters["when"], groupSize: Number(body.groupSize), budget: body.budget as number | null, activity: body.activity as PlayFilters["activity"], dateFrom, dateTo };
}

/** Odd-sized groups still need whole tickets. Unknown coverage is never guessed. */
export function groupPricing(price: number | null, covers: number | null, groupSize: number) {
  if (price == null || covers == null || covers < 1) return null;
  const tickets = Math.ceil(groupSize / covers);
  return { tickets, total: Math.round(tickets * price * 100) / 100, perPerson: tickets * price / groupSize };
}

export function resolveMatch(answers: string[]): MatchKey {
  const material = answers[0];
  if (material === "color") return "mosaic";
  if (material === "green") return "bonsai";
  return answers[1] === "slow" ? "handbuilding" : "wheel";
}

export type PlayClass = {
  id: string; title: string; locationLabel: string; craft: string;
  priceUsd: number | null; ticketCovers: number | null; durationMinutes: number | null;
  nextLocaleTime: string | null; enrollmentNotes: string[]; isSeries: boolean;
  bookingUrl: string; groupPrice: ReturnType<typeof groupPricing>;
};
