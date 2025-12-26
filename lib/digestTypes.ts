/**
 * Normalized digest item type for daily operations email
 * Used by both Acuity and Eventbrite digest fetchers
 */
export type DigestItem = {
  city: "Chicago" | "Eugene" | "Unknown";
  title: string;
  startISO: string;
  registered: number;
  capacity?: number;
  remaining?: number;
  source: "acuity" | "eventbrite";
  adminLink?: string; // Staff-only admin panel link
};

/**
 * Email digest configuration
 */
export type DigestConfig = {
  lowEnrollmentThreshold: number; // Flag items with fewer registrations
  timezone: string; // e.g., "America/Chicago"
};

/**
 * Send times in 24-hour format (HH:MM)
 */
export const DIGEST_SEND_TIMES = ["08:00", "13:30", "17:00"] as const;
