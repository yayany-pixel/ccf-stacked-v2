/**
 * Acuity admin digest data fetcher
 * Pulls TODAY's appointments for staff operations email
 * 
 * SECURITY NOTES:
 * - This fetches booking counts for admin purposes only
 * - Does NOT use confirmation URLs
 * - Does NOT expose customer PII in digest
 * - Returns aggregated counts per time slot
 */

import type { DigestItem } from "./digestTypes";

/**
 * Fetch today's Acuity appointments for digest
 * Returns normalized DigestItem[] for email formatting
 */
export async function getAcuityDigestItems(): Promise<DigestItem[]> {
  const userId = process.env.ACUITY_USER_ID;
  const apiKey = process.env.ACUITY_API_KEY;

  if (!userId || !apiKey) {
    console.warn("Acuity credentials not configured, skipping Acuity digest");
    return [];
  }

  try {
    // Get all appointment types first
    const types = await fetchAppointmentTypes(userId, apiKey);
    
    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch appointments for today
    const appointments = await fetchTodaysAppointments(
      userId,
      apiKey,
      startOfDay.toISOString(),
      endOfDay.toISOString()
    );

    // Group by appointment type ID and time slot
    const grouped = new Map<string, DigestItem>();

    for (const apt of appointments) {
      const type = types.find((t) => t.id === apt.appointmentTypeID);
      if (!type) continue;

      const key = `${apt.appointmentTypeID}-${apt.datetime}`;
      
      if (!grouped.has(key)) {
        // Extract city from calendar or location
        const city = extractCity(apt.calendar || type.name || "");
        
        grouped.set(key, {
          city,
          title: type.name || apt.type || "Unknown Class",
          startISO: apt.datetime,
          registered: 1,
          capacity: type.duration ? undefined : undefined, // Acuity doesn't expose capacity in appointments endpoint
          source: "acuity",
          adminLink: `https://acuityscheduling.com/appointments.php?date=${apt.date}`,
        });
      } else {
        grouped.get(key)!.registered += 1;
      }
    }

    return Array.from(grouped.values()).sort((a, b) => 
      a.startISO.localeCompare(b.startISO)
    );
  } catch (error) {
    console.error("Error fetching Acuity digest:", error);
    return [];
  }
}

/**
 * Fetch appointment types from Acuity
 */
async function fetchAppointmentTypes(userId: string, apiKey: string): Promise<any[]> {
  const auth = Buffer.from(`${userId}:${apiKey}`).toString("base64");
  
  const response = await fetch(
    `https://acuityscheduling.com/api/v1/appointment-types`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Acuity API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch today's appointments from Acuity (admin endpoint)
 */
async function fetchTodaysAppointments(
  userId: string,
  apiKey: string,
  minDate: string,
  maxDate: string
): Promise<any[]> {
  const auth = Buffer.from(`${userId}:${apiKey}`).toString("base64");
  
  const params = new URLSearchParams({
    minDate,
    maxDate,
    max: "1000", // Pull up to 1000 appointments for the day
  });

  const response = await fetch(
    `https://acuityscheduling.com/api/v1/appointments?${params}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Acuity appointments API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Extract city from calendar name or location string
 */
function extractCity(text: string): "Chicago" | "Eugene" | "Unknown" {
  const lower = text.toLowerCase();
  if (lower.includes("chicago")) return "Chicago";
  if (lower.includes("eugene")) return "Eugene";
  return "Unknown";
}
