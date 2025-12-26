/**
 * Server-side Eventbrite API client
 * Fetches live and upcoming events for Color Cocktail Factory
 * 
 * IMPORTANT: This file runs server-side only.
 * Never import this in client components.
 */

export interface EventbriteEvent {
  id: string;
  url: string;
  name: {
    text: string;
  };
  start: {
    local: string;
    timezone: string;
  };
  logo?: {
    url: string;
  } | null;
}

interface EventbriteResponse {
  events: EventbriteEvent[];
  pagination: {
    page_count: number;
    page_number: number;
  };
}

/**
 * Fetches live and upcoming events from Eventbrite
 * Cached for 60 seconds to reduce API calls
 * 
 * @throws {Error} If environment variables are missing or API request fails
 */
export async function getCCFEvents(): Promise<EventbriteEvent[]> {
  // Strict runtime checks for required environment variables
  const token = process.env.EVENTBRITE_TOKEN;
  const orgId = process.env.EVENTBRITE_ORG_ID;

  if (!token) {
    throw new Error(
      "EVENTBRITE_TOKEN is not set. Please add it to your .env.local file."
    );
  }

  if (!orgId) {
    throw new Error(
      "EVENTBRITE_ORG_ID is not set. Please check your .env.local file."
    );
  }

  // Build API URL
  const url = `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?status=live&order_by=start_asc&time_filter=current_future`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Cache for 60 seconds to reduce API calls
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Eventbrite API error (${response.status}): ${errorText}`
      );
    }

    const data: EventbriteResponse = await response.json();
    return data.events || [];
  } catch (error) {
    // Re-throw with context but don't leak token
    if (error instanceof Error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
    throw new Error("Failed to fetch events from Eventbrite");
  }
}
