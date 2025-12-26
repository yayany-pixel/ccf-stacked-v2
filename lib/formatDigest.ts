/**
 * Format digest items into email subject and body
 */

import type { DigestItem, DigestConfig } from "./digestTypes";

/**
 * Generate email subject line
 */
export function formatDigestSubject(items: DigestItem[], date: Date): string {
  const cities = new Set(items.map((item) => item.city).filter((c) => c !== "Unknown"));
  const cityStr = cities.size > 0 ? Array.from(cities).join(" + ") : "All Locations";
  
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const monthDay = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  
  return `CCF Today — ${cityStr} — ${weekday}, ${monthDay}`;
}

/**
 * Generate email body (plain text)
 */
export function formatDigestBody(items: DigestItem[], config: DigestConfig): string {
  if (items.length === 0) {
    return "No events or classes scheduled for today.\n\nColorCocktailFactory.com";
  }

  // Group by city
  const byCity: Record<string, DigestItem[]> = {
    Chicago: [],
    Eugene: [],
    Unknown: [],
  };

  for (const item of items) {
    byCity[item.city].push(item);
  }

  // Group Eventbrite separately
  const eventbriteItems = items.filter((i) => i.source === "eventbrite");
  const acuityItems = items.filter((i) => i.source === "acuity");

  let body = "";

  // Chicago section
  if (byCity.Chicago.length > 0) {
    body += "CHICAGO\n";
    body += formatCitySection(byCity.Chicago, config);
    body += "\n";
  }

  // Eugene section
  if (byCity.Eugene.length > 0) {
    body += "EUGENE\n";
    body += formatCitySection(byCity.Eugene, config);
    body += "\n";
  }

  // Eventbrite exclusives section (if any cross-location events)
  if (eventbriteItems.length > 0) {
    body += "EVENTBRITE EXCLUSIVES\n";
    body += formatCitySection(eventbriteItems, config);
    body += "\n";
  }

  // Summary
  const totalRegistered = items.reduce((sum, item) => sum + item.registered, 0);
  body += `\nTotal registrations today: ${totalRegistered}\n`;
  body += "\n—\n";
  body += "ColorCocktailFactory.com\n";

  return body;
}

/**
 * Format a section for one city
 */
function formatCitySection(items: DigestItem[], config: DigestConfig): string {
  let section = "";

  for (const item of items) {
    const time = formatTime(item.startISO);
    const flags = getFlags(item, config);
    const seats = formatSeats(item);
    
    section += `• ${time} — ${item.title} — ${item.registered} registered`;
    if (seats) {
      section += ` (${seats})`;
    }
    if (flags) {
      section += ` ${flags}`;
    }
    section += "\n";
  }

  return section;
}

/**
 * Format time from ISO string
 */
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format seat availability
 */
function formatSeats(item: DigestItem): string {
  if (item.remaining !== undefined) {
    if (item.remaining === 0) return "";
    return `${item.remaining} seats left`;
  }
  if (item.capacity !== undefined) {
    return `${item.capacity} capacity`;
  }
  return "";
}

/**
 * Get flag indicators
 */
function getFlags(item: DigestItem, config: DigestConfig): string {
  const flags: string[] = [];

  if (item.remaining === 0) {
    flags.push("🔴 FULL");
  }

  if (item.registered < config.lowEnrollmentThreshold) {
    flags.push("⚠️ LOW ENROLLMENT");
  }

  return flags.join(" ");
}
