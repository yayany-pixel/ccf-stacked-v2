/**
 * Events API - Fetch and normalize events from Eventbrite and Acuity
 * Server-side only - API credentials never exposed to client
 */

export type NormalizedEvent = {
  id: string;
  source: "eventbrite" | "acuity";
  title: string;
  description: string;
  startDate: string; // ISO 8601 with timezone
  endDate: string;   // ISO 8601 with timezone
  city: "Chicago" | "Eugene" | "Virtual" | "Other";
  venueName: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  imageUrl: string | null;
  price: number | null;
  currency: string;
  bookingUrl: string;
  category: string;
  status: "scheduled" | "cancelled";
  lastUpdated: string;
  slug: string; // URL-friendly identifier
};

// Environment variables
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN || '';
const EVENTBRITE_ORG_ID = process.env.EVENTBRITE_ORG_ID || '';
const ACUITY_USER_ID = process.env.ACUITY_USER_ID || '35932879';
const ACUITY_API_KEY = process.env.ACUITY_API_KEY || '';
const DEFAULT_TIMEZONE = process.env.DEFAULT_TIMEZONE || 'America/Chicago';

/**
 * Fetch events from Eventbrite API
 */
async function fetchEventbriteEvents(): Promise<NormalizedEvent[]> {
  if (!EVENTBRITE_TOKEN) {
    console.warn('EVENTBRITE_TOKEN not configured, skipping Eventbrite events');
    return [];
  }

  try {
    // Fetch organization events
    const url = EVENTBRITE_ORG_ID 
      ? `https://www.eventbriteapi.com/v3/organizations/${EVENTBRITE_ORG_ID}/events/?status=live&order_by=start_asc&page_size=50`
      : `https://www.eventbriteapi.com/v3/users/me/events/?status=live&order_by=start_asc&page_size=50`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${EVENTBRITE_TOKEN}`,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Eventbrite API error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    const events = data.events || [];

    return events.map((event: any) => {
      // Determine city from venue
      const venueName = event.venue?.name || 'Color Cocktail Factory';
      let city: NormalizedEvent['city'] = 'Other';
      if (venueName.toLowerCase().includes('chicago') || venueName.toLowerCase().includes('pilsen')) {
        city = 'Chicago';
      } else if (venueName.toLowerCase().includes('eugene')) {
        city = 'Eugene';
      }

      // Generate slug from event ID and name
      const slug = `eventbrite-${event.id}-${event.name.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50)}`;

      return {
        id: `eventbrite-${event.id}`,
        source: 'eventbrite' as const,
        title: event.name.text,
        description: event.description?.text || event.summary || '',
        startDate: event.start.utc,
        endDate: event.end.utc,
        city,
        venueName: venueName,
        streetAddress: event.venue?.address?.address_1 || '',
        addressLocality: event.venue?.address?.city || '',
        addressRegion: event.venue?.address?.region || '',
        postalCode: event.venue?.address?.postal_code || '',
        addressCountry: event.venue?.address?.country || 'US',
        imageUrl: event.logo?.url || null,
        price: event.is_free ? 0 : null, // Eventbrite doesn't always expose ticket price in list
        currency: event.currency || 'USD',
        bookingUrl: event.url,
        category: extractCategory(event.name.text),
        status: event.status === 'live' ? 'scheduled' : 'cancelled',
        lastUpdated: new Date().toISOString(),
        slug
      };
    });
  } catch (error) {
    console.error('Error fetching Eventbrite events:', error);
    return [];
  }
}

/**
 * Fetch events from Acuity Scheduling API
 */
async function fetchAcuityEvents(daysAhead = 60): Promise<NormalizedEvent[]> {
  if (!ACUITY_USER_ID || !ACUITY_API_KEY) {
    console.warn('Acuity credentials not configured, skipping Acuity events');
    return [];
  }

  try {
    // First, fetch appointment types
    const typesUrl = `https://acuityscheduling.com/api/v1/appointment-types`;
    const auth = Buffer.from(`${ACUITY_USER_ID}:${ACUITY_API_KEY}`).toString('base64');
    
    const typesResponse = await fetch(typesUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      next: { revalidate: 3600 }
    });

    if (!typesResponse.ok) {
      console.error('Acuity appointment types API error:', typesResponse.status);
      return [];
    }

    const appointmentTypes = await typesResponse.json();

    // Fetch availability for each appointment type
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const events: NormalizedEvent[] = [];

    for (const type of appointmentTypes) {
      try {
        // Get availability (dates with open slots)
        const availUrl = `https://acuityscheduling.com/api/v1/availability/dates?appointmentTypeID=${type.id}&month=${now.toISOString().substring(0, 7)}`;
        
        const availResponse = await fetch(availUrl, {
          headers: {
            'Authorization': `Basic ${auth}`,
          },
          next: { revalidate: 3600 }
        });

        if (!availResponse.ok) continue;

        const availDates = await availResponse.json();
        
        // For each available date, get specific times
        for (const dateObj of availDates.slice(0, 10)) { // Limit to avoid too many API calls
          const timesUrl = `https://acuityscheduling.com/api/v1/availability/times?appointmentTypeID=${type.id}&date=${dateObj.date}`;
          
          const timesResponse = await fetch(timesUrl, {
            headers: {
              'Authorization': `Basic ${auth}`,
            },
            next: { revalidate: 3600 }
          });

          if (!timesResponse.ok) continue;

          const times = await timesResponse.json();

          // Create an event for each available time slot
          for (const time of times.slice(0, 3)) { // Limit per date
            const startDate = new Date(time.time);
            const endDate = new Date(startDate.getTime() + (type.duration || 120) * 60000);

            // Determine city from calendar name or type description
            let city: NormalizedEvent['city'] = 'Chicago'; // Default
            if (type.name.toLowerCase().includes('eugene')) {
              city = 'Eugene';
            } else if (type.calendar?.toLowerCase().includes('eugene')) {
              city = 'Eugene';
            }

            const slug = `acuity-${type.id}-${startDate.toISOString().substring(0, 10)}-${time.time.replace(/[^0-9]/g, '').substring(8, 12)}`;

            events.push({
              id: `acuity-${type.id}-${time.time}`,
              source: 'acuity',
              title: type.name,
              description: type.description || `Join us for ${type.name} at Color Cocktail Factory.`,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              city,
              venueName: city === 'Chicago' ? 'Color Cocktail Factory - Pilsen' : 'Color Cocktail Factory - Eugene',
              streetAddress: city === 'Chicago' ? '1850 W 21st St' : '454 Willamette St',
              addressLocality: city === 'Chicago' ? 'Chicago' : 'Eugene',
              addressRegion: city === 'Chicago' ? 'IL' : 'OR',
              postalCode: city === 'Chicago' ? '60608' : '97401',
              addressCountry: 'US',
              imageUrl: null,
              price: type.price ? parseFloat(type.price) : null,
              currency: 'USD',
              bookingUrl: `https://colorcocktailfactory.acuityscheduling.com/schedule.php?appointmentType=${type.id}`,
              category: extractCategory(type.name),
              status: 'scheduled',
              lastUpdated: new Date().toISOString(),
              slug
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching availability for type ${type.id}:`, error);
      }
    }

    return events;
  } catch (error) {
    console.error('Error fetching Acuity events:', error);
    return [];
  }
}

/**
 * Extract category from event title
 */
function extractCategory(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('date night') && lower.includes('wheel')) return 'Date Night Wheel';
  if (lower.includes('wheel') || lower.includes('pottery')) return 'Wheel Throwing';
  if (lower.includes('turkish') || lower.includes('lamp')) return 'Turkish Lamp';
  if (lower.includes('glass fusion')) return 'Glass Fusion';
  if (lower.includes('mosaic')) return 'Mosaics';
  if (lower.includes('bonsai')) return 'Bonsai';
  if (lower.includes('terrarium')) return 'Terrarium';
  if (lower.includes('candle')) return 'Candle Making';
  if (lower.includes('paint')) return 'Painting';
  if (lower.includes('watercolor')) return 'Watercolor';
  return 'Creative Workshop';
}

/**
 * Check if two events are likely duplicates
 */
function areDuplicates(event1: NormalizedEvent, event2: NormalizedEvent): boolean {
  // Same source = not duplicate
  if (event1.source === event2.source) return false;

  // Check title similarity (simple contains check)
  const title1 = event1.title.toLowerCase();
  const title2 = event2.title.toLowerCase();
  const titleSimilar = title1.includes(title2.substring(0, 15)) || title2.includes(title1.substring(0, 15));

  // Check if start times are within 10 minutes
  const time1 = new Date(event1.startDate).getTime();
  const time2 = new Date(event2.startDate).getTime();
  const timeDiff = Math.abs(time1 - time2);
  const withinTenMinutes = timeDiff < 10 * 60 * 1000;

  // Same city
  const sameCity = event1.city === event2.city;

  return titleSimilar && withinTenMinutes && sameCity;
}

/**
 * Deduplicate events, preferring Eventbrite over Acuity
 */
function deduplicateEvents(events: NormalizedEvent[]): NormalizedEvent[] {
  const deduplicated: NormalizedEvent[] = [];
  const seen = new Set<string>();

  // Sort to prioritize Eventbrite
  const sorted = [...events].sort((a, b) => {
    if (a.source === 'eventbrite' && b.source !== 'eventbrite') return -1;
    if (a.source !== 'eventbrite' && b.source === 'eventbrite') return 1;
    return 0;
  });

  for (const event of sorted) {
    // Check if this event is a duplicate of any already added
    const isDuplicate = deduplicated.some(existing => areDuplicates(event, existing));
    
    if (!isDuplicate) {
      deduplicated.push(event);
      seen.add(event.id);
    }
  }

  return deduplicated;
}

/**
 * Main function to fetch all events from all sources
 */
export async function getAllEvents(daysAhead = 60): Promise<NormalizedEvent[]> {
  try {
    // Fetch from both sources in parallel
    const [eventbriteEvents, acuityEvents] = await Promise.all([
      fetchEventbriteEvents(),
      fetchAcuityEvents(daysAhead)
    ]);

    // Combine and deduplicate
    const allEvents = [...eventbriteEvents, ...acuityEvents];
    const deduplicated = deduplicateEvents(allEvents);

    // Sort by start date ascending
    deduplicated.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Filter to only upcoming events
    const now = new Date();
    const upcoming = deduplicated.filter(event => 
      new Date(event.startDate) > now
    );

    return upcoming;
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    return [];
  }
}

/**
 * Get a single event by slug
 */
export async function getEventBySlug(slug: string): Promise<NormalizedEvent | null> {
  const allEvents = await getAllEvents();
  return allEvents.find(event => event.slug === slug) || null;
}
