import type { CatalogClass, PublicClassSlot } from "@/lib/askccf/catalog";
import { STUDIO_LOCATIONS } from "@/lib/locations";
import { ACTIVITY_MANIFEST } from "./manifest";
import type { HomepageActivity, HomepageCity, HomepageData } from "./types";

export const AVAILABILITY_WINDOW_DAYS = 30;

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
    return {
      ...definition,
      currentPrice: typeof price === "number" && Number.isFinite(price) && price >= 0 ? price : null,
      priceUnit: matches && live.pricing.covers === 2 ? "for two" :
        matches && live.pricing.covers === 1 ? "per person" : "per ticket",
      priceEvidence: matches ? live.pricing.evidence : null,
      formerPrice: null,
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
  return activities.filter(activity =>
    (activity.city === city || activity.city === "online") &&
    activity.eligibility === "ready" && activity.image && activity.bookingUrl &&
    activity.offeringState !== "inactive",
  ).sort((left, right) => left.priority - right.priority || left.key.localeCompare(right.key));
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
  if (activity.currentPrice === null) return "See price at checkout";
  const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(activity.currentPrice).replace(/\.00$/, "");
  return `${amount} ${activity.priceUnit}`;
}
