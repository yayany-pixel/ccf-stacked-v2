/**
 * Acuity Scheduling PUBLIC availability integration
 * NEVER uses confirmation URLs or customer data
 * Only fetches appointment types and their PUBLIC availability
 */

export type AcuityTimeSlot = {
  datetime: Date;
  startISO: string;
  bookingUrl: string;
  remainingSeats?: number; // If Acuity provides it
  capacity?: number; // Total capacity if available
};

export type AcuitySeries = {
  id: string;
  title: string;
  location?: string;
  category: string;
  bookingUrl: string; // Base URL for the appointment type
  times: AcuityTimeSlot[];
};

export type AcuityListing = {
  id: string;
  title: string;
  startISO: string;
  endISO?: string;
  location?: string;
  bookingUrl: string; // PUBLIC scheduling URL only
  source: "acuity";
  category?: string;
  remainingSeats?: number;
  capacity?: number;
};

/**
 * Normalize Acuity appointment type name to a category
 */
function inferCategory(title: string): string {
  const lower = title.toLowerCase();
  
  if (lower.includes("pottery") || lower.includes("wheel") || lower.includes("clay")) {
    return "Pottery";
  }
  if (lower.includes("mosaic")) {
    return "Mosaic";
  }
  if (lower.includes("glass") && (lower.includes("fusion") || lower.includes("fusing"))) {
    return "Glass Fusion";
  }
  if (lower.includes("lamp") || lower.includes("turkish")) {
    return "Mosaic";
  }
  if (lower.includes("candle")) {
    return "Candle";
  }
  if (lower.includes("bonsai") || lower.includes("terrarium")) {
    return "Terrarium & Bonsai";
  }
  if (lower.includes("paint")) {
    return "Painting";
  }
  if (lower.includes("kid") || lower.includes("family") || lower.includes("parent")) {
    return "Kids & Family";
  }
  if (lower.includes("private")) {
    return "Private";
  }
  
  return "Other";
}

/**
 * Server-side function to fetch upcoming Acuity PUBLIC availability
 * SECURITY: Never exposes customer data or confirmation URLs
 * Returns series grouped by appointment type with all available times
 */
export async function getAcuitySeries(): Promise<AcuitySeries[]> {
  const userId = process.env.ACUITY_USER_ID;
  const apiKey = process.env.ACUITY_API_KEY;

  if (!userId || !apiKey) {
    console.warn("[Acuity] Credentials not configured - returning empty series array");
    return [];
  }

  try {
    return await fetchPublicAvailability(userId, apiKey);
  } catch (error) {
    console.error("[Acuity] Failed to fetch availability:", error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Fetch PUBLIC appointment types and their availability
 * Returns series grouped by appointment type
 * NOTE: Seat counts not currently exposed by Acuity availability endpoints.
 * The /availability/times endpoint returns available slots but not remaining capacity.
 * Capacity tracking would require appointment-types endpoint or class-specific settings.
 */
async function fetchPublicAvailability(userId: string, apiKey: string): Promise<AcuitySeries[]> {
  const auth = Buffer.from(`${userId}:${apiKey}`).toString("base64");
  const baseHeaders = {
    Authorization: `Basic ${auth}`,
    Accept: "application/json",
  };

  // Step 1: Fetch all active appointment types
  const typesResponse = await fetch("https://acuityscheduling.com/api/v1/appointment-types", {
    headers: baseHeaders,
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!typesResponse.ok) {
    throw new Error(`Acuity API error: ${typesResponse.status}`);
  }

  const appointmentTypes = await typesResponse.json();
  
  if (!Array.isArray(appointmentTypes)) {
    throw new Error("Unexpected appointment types response");
  }

  // Step 2: For each appointment type, fetch availability for next 60 days
  const now = new Date();
  const endDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days
  
  const allSeries: AcuitySeries[] = [];

  for (const type of appointmentTypes) {
    if (!type.active) continue; // Skip inactive types
    
    const times: AcuityTimeSlot[] = [];
    
    try {
      // Use the dates endpoint for better availability data
      const month = now.toISOString().slice(0, 7); // YYYY-MM format
      const availabilityUrl = `https://acuityscheduling.com/api/v1/availability/dates?appointmentTypeID=${type.id}&month=${month}`;
      
      const availResponse = await fetch(availabilityUrl, {
        headers: baseHeaders,
        next: { revalidate: 300 },
      });

      if (!availResponse.ok) {
        // Silently skip types without availability
        continue;
      }

      const dates = await availResponse.json();
      
      if (Array.isArray(dates) && dates.length > 0) {
        // For dates with availability, fetch actual times
        for (const dateObj of dates.slice(0, 10)) { // Fetch more dates per type
          if (!dateObj.date) continue;
          
          const timesUrl = `https://acuityscheduling.com/api/v1/availability/times?appointmentTypeID=${type.id}&date=${dateObj.date}`;
          
          const timesResponse = await fetch(timesUrl, {
            headers: baseHeaders,
            next: { revalidate: 300 },
          });

          if (!timesResponse.ok) continue;
          
          const timeSlots = await timesResponse.json();
          
          if (Array.isArray(timeSlots)) {
            for (const slot of timeSlots) {
              if (!slot.time) continue;
              
              const timeDate = new Date(slot.time);
              if (timeDate < now || timeDate > endDate) continue;

              // Build PUBLIC booking URL (never confirmation URL)
              const bookingUrl = `https://app.acuityscheduling.com/schedule.php?owner=${userId}&appointmentType=${type.id}`;
              
              // Extract seat information if available
              // Note: Current endpoint may not expose this - check slot.slotsAvailable, slot.capacity, etc.
              const remainingSeats = slot.slotsAvailable ?? slot.spotsRemaining ?? slot.remaining;
              const capacity = slot.capacity ?? type.paddingAfter; // type.capacity if exists
              
              times.push({
                datetime: timeDate,
                startISO: slot.time,
                bookingUrl,
                remainingSeats: remainingSeats !== undefined ? Number(remainingSeats) : undefined,
                capacity: capacity !== undefined ? Number(capacity) : undefined,
              });
            }
          }
        }
      }
    } catch (error) {
      // Silently skip types that fail
      continue;
    }

    // Only add series if it has available times
    if (times.length > 0) {
      const bookingUrl = `https://app.acuityscheduling.com/schedule.php?owner=${userId}&appointmentType=${type.id}`;
      
      allSeries.push({
        id: String(type.id),
        title: type.name,
        location: type.location || undefined,
        category: inferCategory(type.name),
        bookingUrl,
        times: times.sort((a, b) => a.datetime.getTime() - b.datetime.getTime()),
      });
    }
  }

  return allSeries;
}
