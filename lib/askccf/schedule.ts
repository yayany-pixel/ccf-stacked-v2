export type StudioLocation = "chicago" | "eugene" | "online" | "unknown";

export function studioTimeZone(location: StudioLocation): string {
  return location === "eugene" ? "America/Los_Angeles" : "America/Chicago";
}

export function formatClassTime(iso: string, location: StudioLocation): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: studioTimeZone(location), weekday: "long", month: "long", day: "numeric",
    year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short",
  }).format(new Date(iso));
}

export function localDateAndTime(iso: string, location: StudioLocation) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: studioTimeZone(location), year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (name: string) => parts.find((part) => part.type === name)?.value ?? "";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}

export function validDate(value: unknown): string | undefined {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().startsWith(value) ? value : undefined;
}

/** Correct weekday labels only for dates actually returned by the booking tools. */
export function correctScheduleWeekdays(text: string, dates: Array<{ startISO: string; location: StudioLocation }>): string {
  let result = text;
  for (const { startISO, location } of dates) {
    const date = localDateAndTime(startISO, location).date;
    const instant = new Date(`${date}T12:00:00Z`);
    const month = instant.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
    const weekday = instant.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
    const day = Number(date.slice(8));
    const monthPattern = month === "September" ? "Sep(?:t(?:ember)?)?" : `${month.slice(0, 3)}(?:${month.slice(3)})?`;
    const pattern = new RegExp(`\\b(?:Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?)\\.?[,]?\\s+(${monthPattern}\\.?\\s+${day}(?:st|nd|rd|th)?)(?!\\d)`, "gi");
    result = result.replace(pattern, `${weekday}, $1`);
  }
  return result;
}
