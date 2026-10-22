import { formatInTimeZone } from "date-fns-tz";
import { STUDIO_LOCATIONS } from "@/lib/locations";
import type { CatalogClass } from "@/lib/askccf/catalog";

export const ACUITY_BOOKING_URL = "https://colorcocktailfactory.as.me/";
export const ONLINE_CAULDRON_URL = `${ACUITY_BOOKING_URL}?appointmentType=98770334`;

export function withBookingCalendar(bookingUrl: string, calendarIds?: number[]): string {
  if (calendarIds?.length !== 1) return bookingUrl;
  const url = new URL(bookingUrl);
  url.searchParams.set("calendarID", String(calendarIds[0]));
  return url.toString();
}

export function cityBookingUrl(city: string): string {
  const category = city === "eugene" ? "Eugene Classes" : city === "online" ? "Online Class Series" : "Chicago Classes";
  return withBookingCalendar(`${ACUITY_BOOKING_URL}?appointmentType=${encodeURIComponent(`category:${category}`)}`, city === "eugene" ? [13582962] : city === "chicago" ? [12216179] : undefined);
}

export function activityBookingUrl(city: string, activity: string): string {
  return `/book/${city}/${encodeURIComponent(activity)}`;
}

// Match activity pages to the current public catalog, retaining the selected city.
const ACTIVITY_PATTERNS: Record<string, RegExp> = {
  "date-night-wheel": /date night.*(?:pottery|wheel)/i,
  "beginner-wheel": /wheel throwing for beginners|beginners wheel throwing/i,
  "cup-creations": /cup creation/i,
  "matcha-bowl": /matcha/i,
  handbuilding: /handbuilding|ceramic mug|bunny cup|cat vase|mushroom pottery|pipe.*ashtray|pussy pottery|boobs coffee|dildos/i,
  mosaic: /mosaic(?! lamp)|mosaic creations/i,
  "turkish-lamp": /turkish.*lamp/i,
  "glass-fusion": /glass fusion/i,
  "glass-blowing": /glass blowing/i,
  bonsai: /bonsai/i,
  terrarium: /terrarium/i,
  "candle-making": /candle making/i,
  "wine-glass-painting": /wine glass painting/i,
  "paper-pigment": /water ?color|paint night|painting/i,
  painting: /water ?color|paint night|painting/i,
  "paint-pottery": /paint pottery/i,
  "parent-and-me": /kids|parent|family/i,
  "online-cauldron": /cauldron/i,
  "online-pottery": /(?:6.week|six.week|online).*pottery|online.*wheel/i,
};

export function catalogBookingUrl(catalog: CatalogClass[], city: string, activity: string): string {
  const normalized = activity.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const key = ACTIVITY_PATTERNS[normalized] ? normalized :
    normalized.includes("date-night") ? "date-night-wheel" :
    normalized.includes("cauldron") ? "online-cauldron" :
    normalized.includes("wheel") ? "beginner-wheel" :
    Object.keys(ACTIVITY_PATTERNS).find((name) => normalized.includes(name));
  const pattern = key ? ACTIVITY_PATTERNS[key] : null;
  const matches = pattern ? catalog.filter((item) => item.location === city && pattern.test(item.title)) : [];
  if (!matches.length) return cityBookingUrl(city);
  const url = new URL(ACUITY_BOOKING_URL);
  for (const item of matches) url.searchParams.append(matches.length === 1 ? "appointmentType" : "appointmentType[]", item.id);
  const calendars = [...new Set(matches.flatMap(item => item.calendarIds ?? []))];
  return withBookingCalendar(url.toString(), calendars);
}

export function eventBookingUrl(typeId: string | number, startISO: string, calendarID: number): string {
  // The current Acuity scheduler drops legacy `datetime` query parameters on
  // redirect. Use its verified session URL so checkout retains the chosen time.
  const normalized = startISO.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
  const timeZone = calendarID === 13582962 ? STUDIO_LOCATIONS.eugene.timeZone :
    calendarID === 12216179 ? STUDIO_LOCATIONS.chicago.timeZone : null;
  const time = timeZone ? formatInTimeZone(new Date(normalized), timeZone, normalized.includes(".") ? "yyyy-MM-dd'T'HH:mm:ss.SSSXXX" : "yyyy-MM-dd'T'HH:mm:ssXXX") : normalized;
  const url = new URL(`schedule/a8dfb300/appointment/${typeId}/calendar/${calendarID}/datetime/${encodeURIComponent(time)}`, ACUITY_BOOKING_URL);
  url.searchParams.set("appointmentTypeIds[]", String(typeId));
  url.searchParams.set("calendarIds", String(calendarID));
  return url.toString();
}
