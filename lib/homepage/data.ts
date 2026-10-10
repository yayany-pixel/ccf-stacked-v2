import type { CatalogClass, PublicClassSlot } from "@/lib/askccf/catalog";
import { STUDIO_LOCATIONS } from "@/lib/locations";
import { ACTIVITY_MANIFEST } from "./manifest";
import type { HomepageActivity, HomepageCity, HomepageData } from "./types";

export const AVAILABILITY_WINDOW_DAYS = 30;

export const EXPLICIT_FORMER_PRICES: Record<string, number> = {
  "chicago-beginner-wheel": 50,
  "eugene-cup-creations": 50,
  "chicago-mug-and-bowl": 55,
  "eugene-mug-and-bowl": 55,
  "chicago-cat-vase": 55,
  "chicago-cauldron": 55,
  "eugene-cauldron": 55,
  "chicago-date-night-wheel": 110,
  "eugene-date-night-wheel": 110,
  "chicago-matcha-bowl": 55,
  "eugene-matcha-bowl": 55,
  "chicago-charcuterie-board": 95,
  "eugene-charcuterie-board": 95,
  "chicago-wheel-pumpkin": 75,
  "chicago-cup-creations": 55,
  "chicago-mushroom": 55,
  "eugene-mushroom": 55,
  "chicago-pipe-and-ashtray": 55,
  "eugene-pipe-and-ashtray": 55,
  "chicago-clay-pumpkin": 55,
  "chicago-oogie-boogie": 55,
  "eugene-oogie-boogie": 55,
  "chicago-bonsai": 110,
  "chicago-terrarium": 55,
  "eugene-date-night-terrarium": 55,
  "chicago-date-night-on-fire": 295,
  "chicago-candle": 55,
  "chicago-date-night-candle": 55,
  "chicago-mosaic": 55,
  "chicago-paint-pottery": 55,
  "chicago-boobs-mug": 55,
  "chicago-glass-fusion": 75,
  "chicago-watercolor": 55,
  "eugene-watercolor": 55,
  "eugene-ceramic-chess": 110,
  "chicago-wheel-vase": 55,
  "chicago-ghost": 55,
  "chicago-handbuilt-vase": 75,
  "chicago-monster-lantern": 55,
  "chicago-make-and-paint-wheel": 180,
  "chicago-dildos-and-bottles": 55,
};

export function buildHomepageData(
  catalog: CatalogClass[] | null,
  slots: PublicClassSlot[] | null,
  now = new Date(),
): HomepageData {
  const classes = new Map(catalog?.map(item => [Number(item.id), item]));
  const windowEnd = now.getTime() + AVAILABILITY_WINDOW_DAYS * 86400000;
  const activities: HomepageActivity[] = ACTIVITY_MANIFEST.map(definition => {
    const live = classes.get(definition.appointmentTypeId);
    const matches = live && live.location === definition.city && live.title === definition.acuityTitle &&
      (!live.calendarIds?.length || definition.calendarIds.every(calendar => live.calendarIds?.includes(calendar)));
    const upcoming = (slots ?? []).filter(slot =>
      slot.appointmentTypeID === definition.appointmentTypeId &&
      definition.calendarIds.includes(slot.calendarID) &&
      slot.slotsAvailable > 0 &&
      new Date(slot.time).getTime() > now.getTime() &&
      new Date(slot.time).getTime() <= windowEnd,
    ).sort((left, right) => new Date(left.time).getTime() - new Date(right.time).getTime());
    const price = matches ? live.pricing.price : null;
    const currentPrice = typeof price === "number" && Number.isFinite(price) && price >= 0 ? price : null;
    const formerAmount: number | null = EXPLICIT_FORMER_PRICES[definition.key] ?? null;
    const formerPrice = formerAmount !== null && currentPrice !== null && formerAmount > currentPrice
      ? { amount: formerAmount, evidence: "Regular studio price" }
      : null;
    return {
      ...definition,
      durationMinutes: matches && live.durationMinutes && live.durationMinutes > 0 ? live.durationMinutes : null,
      listingDescription: matches ? live.description : null,
      pickupNotes: matches ? live.pickupNotes : [],
      upcomingSessions: matches ? [...new Set(upcoming.map(slot => slot.time))].slice(0, 3) : [],
      currentPrice,
      priceUnit: matches && live.pricing.covers === 2 ? "for two" :
        matches && live.pricing.covers === 1 ? "per person" : "per ticket",
      priceEvidence: matches ? live.pricing.evidence : null,
      formerPrice,
      nextAvailability: matches ? upcoming[0]?.time ?? null : null,
      availabilityState: !slots || !matches ? "unavailable" : upcoming.length ? "available" : "empty-window",
      offeringState: catalog === null ? "unverified" : matches ? "active" : "inactive",
      beginnerFriendly: matches ? /beginner|no (?:prior )?experience (?:is )?(?:needed|necessary|required)/i.test(live.title + " " + live.description) || null : null,
      byob: matches ? live.byob || null : null,
    };
  });
  return {
    activities,
    checkedAt: now.toISOString(),
    catalogState: catalog ? "verified" : "unavailable",
    availabilityState: slots ? "verified" : "unavailable",
    availabilityWindowDays: AVAILABILITY_WINDOW_DAYS,
  };
}

export function activitiesForCity(activities: HomepageActivity[], city: HomepageCity): HomepageActivity[] {
  const visible = activities.filter(activity =>
    (activity.city === city || activity.city === "online") &&
    activity.eligibility === "ready" && activity.image && activity.bookingUrl &&
    activity.offeringState !== "inactive",
  );
  const lampKeys = new Set(["chicago-turkish-lamp", "chicago-hanging-turkish-lamp", "chicago-date-night-turkish-lamp"]);
  const lamps = visible.filter(activity => lampKeys.has(activity.key));
  if (lamps.length) {
    const primary = lamps.find(activity => activity.key === "chicago-turkish-lamp") ?? lamps[0];
    const booking = new URL("https://colorcocktailfactory.as.me/");
    for (const lamp of lamps) booking.searchParams.append(lamps.length === 1 ? "appointmentType" : "appointmentType[]", String(lamp.appointmentTypeId));
    const nextAvailability = lamps.map(lamp => lamp.nextAvailability).filter((time): time is string => Boolean(time))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0] ?? null;
    const validPrices = lamps.map(l => l.currentPrice).filter((p): p is number => typeof p === "number" && Number.isFinite(p) && p >= 0);
    const minPrice = validPrices.length ? Math.min(...validPrices) : null;
    const combined: HomepageActivity = {
      ...primary,
      key: "chicago-turkish-lamp",
      title: "Turkish Mosaic Lamp",
      description: "Create a colorful glass mosaic lamp. Explore available standard, hanging, and date-night workshops at booking.",
      priority: ACTIVITY_MANIFEST.find(activity => activity.key === "chicago-turkish-lamp")!.priority,
      detailUrl: "/activities/turkish-lamp",
      bookingUrl: booking.toString(),
      bookingVariantIds: lamps.map(lamp => lamp.appointmentTypeId),
      bookingVariants: lamps,
      durationMinutes: lamps.every(lamp => lamp.durationMinutes === primary.durationMinutes) ? primary.durationMinutes : null,
      listingDescription: null,
      pickupNotes: [],
      beginnerFriendly: lamps.every(lamp => lamp.beginnerFriendly) || null,
      byob: lamps.every(lamp => lamp.byob) || null,
      upcomingSessions: [...new Set(lamps.flatMap(lamp => lamp.upcomingSessions ?? []))].sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).slice(0, 3),
      analyticsContentId: lamps.length > 1 ? "activity:turkish-lamp" : String(primary.appointmentTypeId),
      currentPrice: minPrice,
      formerPrice: null,
      nextAvailability,
      availabilityState: nextAvailability ? "available" : lamps.every(lamp => lamp.availabilityState === "empty-window") ? "empty-window" : "unavailable",
    };
    return [...visible.filter(activity => !lampKeys.has(activity.key)), combined]
      .sort((left, right) => left.priority - right.priority || left.key.localeCompare(right.key));
  }
  return visible.sort((left, right) => left.priority - right.priority || left.key.localeCompare(right.key));
}

export function formatNextSession(activity: HomepageActivity, now = new Date()): string {
  if (!activity.nextAvailability || new Date(activity.nextAvailability) <= now) return "View upcoming dates";
  const timeZone = activity.city === "eugene" ? STUDIO_LOCATIONS.eugene.timeZone : STUDIO_LOCATIONS.chicago.timeZone;
  const date = new Date(activity.nextAvailability);
  const day = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", month: "short", day: "numeric" }).format(date);
  const time = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(date);
  return `Next: ${day} · ${time}`;
}

export function priceLabel(activity: HomepageActivity): string {
  if (activity.bookingVariants && activity.bookingVariants.length > 1) {
    const valid = activity.bookingVariants
      .map(v => v.currentPrice)
      .filter((p): p is number => typeof p === "number" && Number.isFinite(p) && p >= 0);
    if (valid.length > 0) {
      return `From $${Math.min(...valid)}`;
    }
    return "See price at checkout";
  }
  if (activity.currentPrice === null) return "See price at checkout";
  const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(activity.currentPrice).replace(/\.00$/, "");
  return `${amount} ${activity.priceUnit}`;
}

export const HOMEPAGE_FILTERS = ["All workshops", "Date night", "Pottery", "Glass & lamps", "Online"] as const;
export type HomepageFilter = typeof HOMEPAGE_FILTERS[number];
export function matchesHomepageFilter(activity: HomepageActivity, filter: HomepageFilter): boolean {
  const title = [activity.title, ...(activity.bookingVariants ?? []).map(variant => variant.title)].join(" ");
  switch (filter) {
    case "Date night": return /date night/i.test(title);
    case "Pottery": return /pottery|ceramic|clay|wheel|handbuild|mug|vase/i.test(title);
    case "Glass & lamps": return /glass|mosaic|lamp/i.test(title);
    case "Online": return activity.mode === "online";
    default: return true;
  }
}
