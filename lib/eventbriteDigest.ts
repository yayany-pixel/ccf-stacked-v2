/**
 * Eventbrite digest data fetcher
 * Pulls TODAY's events and attendee counts for staff operations email
 */

import type { DigestItem } from "./digestTypes";

/**
 * Fetch today's Eventbrite events for digest
 * Returns normalized DigestItem[] for email formatting
 */
export async function getEventbriteDigestItems(): Promise<DigestItem[]> {
  const token = process.env.EVENTBRITE_TOKEN;
  const orgId = process.env.EVENTBRITE_ORG_ID;

  if (!token || !orgId) {
    console.warn("Eventbrite credentials not configured, skipping Eventbrite digest");
    return [];
  }

  try {
    // Get organization events
    const events = await fetchOrganizationEvents(token, orgId);
    
    // Filter to today's events
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
    
    const todaysEvents = events.filter((event: any) => {
      const eventDate = event.start?.local?.split("T")[0];
      return eventDate === todayStr;
    });

    // Fetch attendee counts for each event
    const digestItems: DigestItem[] = [];
    
    for (const event of todaysEvents) {
      const attendeeCount = await fetchEventAttendeeCount(token, event.id);
      const capacity = event.capacity || undefined;
      
      // Extract city from venue
      const city = extractCity(event.venue?.address?.city || "");
      
      digestItems.push({
        city,
        title: event.name?.text || "Untitled Event",
        startISO: event.start?.utc || event.start?.local || new Date().toISOString(),
        registered: attendeeCount,
        capacity,
        remaining: capacity ? capacity - attendeeCount : undefined,
        source: "eventbrite",
        adminLink: `https://www.eventbrite.com/myevent?eid=${event.id}`,
      });
    }

    return digestItems.sort((a, b) => a.startISO.localeCompare(b.startISO));
  } catch (error) {
    console.error("Error fetching Eventbrite digest:", error);
    return [];
  }
}

/**
 * Fetch organization events from Eventbrite
 */
async function fetchOrganizationEvents(token: string, orgId: string): Promise<any[]> {
  const response = await fetch(
    `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?status=live&order_by=start_asc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Eventbrite API error: ${response.status}`);
  }

  const data = await response.json();
  return data.events || [];
}

/**
 * Fetch attendee count for a specific event
 */
async function fetchEventAttendeeCount(token: string, eventId: string): Promise<number> {
  try {
    const response = await fetch(
      `https://www.eventbriteapi.com/v3/events/${eventId}/attendees/?status=attending`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.warn(`Could not fetch attendees for event ${eventId}`);
      return 0;
    }

    const data = await response.json();
    return data.pagination?.object_count || 0;
  } catch (error) {
    console.warn(`Error fetching attendees for event ${eventId}:`, error);
    return 0;
  }
}

/**
 * Extract city from venue city string
 */
function extractCity(cityStr: string): "Chicago" | "Eugene" | "Unknown" {
  const lower = cityStr.toLowerCase();
  if (lower.includes("chicago")) return "Chicago";
  if (lower.includes("eugene")) return "Eugene";
  return "Unknown";
}
