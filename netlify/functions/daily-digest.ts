/**
 * Netlify Scheduled Function: Daily Operations Email Digest
 * 
 * Runs every 15 minutes (UTC cron)
 * Internally gates to send only at:
 * - 08:00 America/Chicago
 * - 13:30 America/Chicago
 * - 17:00 America/Chicago
 * 
 * Pulls today's bookings from Acuity + Eventbrite
 * Sends formatted digest to support@colorcocktailfactory.com
 */

import { schedule } from "@netlify/functions";
import { getAcuityDigestItems } from "../../lib/acuityAdminDigest";
import { getEventbriteDigestItems } from "../../lib/eventbriteDigest";
import { formatDigestSubject, formatDigestBody } from "../../lib/formatDigest";
import { sendEmail } from "../../lib/email";
import { DIGEST_SEND_TIMES } from "../../lib/digestTypes";
import type { DigestConfig } from "../../lib/digestTypes";

/**
 * Check if current time in target timezone matches a send time
 */
function shouldSendNow(timezone: string = "America/Chicago"): boolean {
  const now = new Date();
  
  // Get current time in target timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  
  const timeStr = formatter.format(now); // Returns "HH:MM"
  
  return DIGEST_SEND_TIMES.includes(timeStr as any);
}

/**
 * Get deduplication key for current minute window
 */
function getDeduplicationKey(): string {
  const now = new Date();
  const timezone = process.env.DIGEST_TIMEZONE || "America/Chicago";
  
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  
  // Returns "MM/DD/YYYY, HH:MM"
  return formatter.format(now);
}

/**
 * Main digest handler
 */
async function dailyDigestHandler() {
  const timezone = process.env.DIGEST_TIMEZONE || "America/Chicago";
  
  console.log(`[Digest Check] Current time check for ${timezone}`);
  
  // Gate: Only proceed if it's a send time
  if (!shouldSendNow(timezone)) {
    console.log("[Digest Skip] Not a send time, exiting");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Not a send time" }),
    };
  }

  console.log("[Digest Send] Send time detected, generating digest");

  // Simple duplication guard (log-based)
  // In production, use Netlify Blobs or KV for persistent storage
  const dedupKey = getDeduplicationKey();
  console.log(`[Digest Dedup] Key: ${dedupKey}`);
  
  // TODO: Check if we already sent for this key (requires persistent store)
  // For now, accepting potential duplicates in the 15-min window

  try {
    // Fetch data from both sources
    console.log("[Digest Fetch] Pulling Acuity data...");
    const acuityItems = await getAcuityDigestItems();
    
    console.log("[Digest Fetch] Pulling Eventbrite data...");
    const eventbriteItems = await getEventbriteDigestItems();
    
    const allItems = [...acuityItems, ...eventbriteItems];
    
    console.log(`[Digest Data] Found ${allItems.length} items (${acuityItems.length} Acuity, ${eventbriteItems.length} Eventbrite)`);

    // Format email
    const config: DigestConfig = {
      lowEnrollmentThreshold: parseInt(process.env.LOW_ENROLLMENT_THRESHOLD || "5"),
      timezone,
    };

    const today = new Date();
    const subject = formatDigestSubject(allItems, today);
    const body = formatDigestBody(allItems, config);

    // Send email
    const to = process.env.DIGEST_TO || "support@colorcocktailfactory.com";
    const from = process.env.DIGEST_FROM || "info@colorcocktailfactory.com";

    console.log(`[Digest Email] Sending to ${to}`);
    
    await sendEmail({
      to,
      from,
      subject,
      text: body,
    });

    console.log("[Digest Success] Email sent successfully");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Digest sent successfully",
        itemCount: allItems.length,
        dedupKey,
      }),
    };
  } catch (error) {
    console.error("[Digest Error]", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to send digest",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}

/**
 * Netlify scheduled function
 * Runs every 15 minutes (cron pattern)
 */
export const handler = schedule("*/15 * * * *", dailyDigestHandler);
