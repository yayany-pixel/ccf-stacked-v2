/**
 * Weekend-based dynamic pricing for 3-Month Pottery Membership
 * Promo: $179 (Friday 9:00 AM CT - Sunday 11:59 PM CT)
 * Regular: $219 (Monday 12:00 AM CT - Friday 8:59 AM CT)
 * Timezone: America/Chicago (Central Time)
 */

import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';
import { addDays, addHours, differenceInMilliseconds, startOfDay, setHours, setMinutes } from 'date-fns';

const CHICAGO_TZ = 'America/Chicago';
const PROMO_PRICE = 179;
const REGULAR_PRICE = 219;

export interface PromoStatus {
  isPromo: boolean;
  price: number;
  regularPrice: number;
  nextStart: Date; // Next Friday 9:00 AM CT (in UTC)
  promoEnd: Date; // Next/Current Sunday 11:59 PM CT (in UTC)
  hoursRemaining?: number; // Hours until promo ends (if active)
  hoursUntilStart?: number; // Hours until promo starts (if inactive)
}

/**
 * Get current promotion status based on Central Time
 * @param now - Current time (defaults to new Date())
 * @returns PromoStatus object with pricing and timing details
 */
export function getPromoStatus(now: Date = new Date()): PromoStatus {
  // Convert current time to Chicago timezone
  const chicagoNow = toZonedTime(now, CHICAGO_TZ);
  
  const dayOfWeek = chicagoNow.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
  const hour = chicagoNow.getHours();
  
  // Determine if we're in promo window
  let isPromo = false;
  
  if (dayOfWeek === 5) {
    // Friday
    isPromo = hour >= 9; // 9:00 AM or later
  } else if (dayOfWeek === 6) {
    // Saturday
    isPromo = true; // All day
  } else if (dayOfWeek === 0) {
    // Sunday
    isPromo = true; // Until 11:59 PM (which is all day for our purposes)
  }
  
  // Calculate next Friday 9:00 AM CT
  let nextFriday: Date;
  if (dayOfWeek === 5 && hour < 9) {
    // It's Friday before 9 AM - promo starts today
    nextFriday = setMinutes(setHours(startOfDay(chicagoNow), 9), 0);
  } else if (dayOfWeek < 5) {
    // Monday-Thursday - next Friday
    const daysUntilFriday = 5 - dayOfWeek;
    nextFriday = setMinutes(setHours(startOfDay(addDays(chicagoNow, daysUntilFriday)), 9), 0);
  } else {
    // Friday after 9 AM, Saturday, or Sunday - next week's Friday
    const daysUntilFriday = dayOfWeek === 5 ? 7 : (dayOfWeek === 6 ? 6 : 5);
    nextFriday = setMinutes(setHours(startOfDay(addDays(chicagoNow, daysUntilFriday)), 9), 0);
  }
  
  // Calculate Sunday 11:59 PM CT for this or next weekend
  let sundayEnd: Date;
  if (dayOfWeek === 0) {
    // It's Sunday - promo ends today at 11:59 PM
    sundayEnd = setMinutes(setHours(startOfDay(chicagoNow), 23), 59);
  } else if (dayOfWeek === 5 || dayOfWeek === 6) {
    // Friday or Saturday - promo ends upcoming Sunday
    const daysUntilSunday = 7 - dayOfWeek;
    sundayEnd = setMinutes(setHours(startOfDay(addDays(chicagoNow, daysUntilSunday)), 23), 59);
  } else {
    // Monday-Thursday - next promo's Sunday
    const daysUntilSunday = 7 - dayOfWeek;
    sundayEnd = setMinutes(setHours(startOfDay(addDays(chicagoNow, daysUntilSunday)), 23), 59);
  }
  
  // Convert Chicago times to UTC for consistent comparison
  const nextStartUTC = fromZonedTime(nextFriday, CHICAGO_TZ);
  const promoEndUTC = fromZonedTime(sundayEnd, CHICAGO_TZ);
  
  // Calculate hours remaining or until start
  let hoursRemaining: number | undefined;
  let hoursUntilStart: number | undefined;
  
  if (isPromo) {
    const msRemaining = differenceInMilliseconds(promoEndUTC, now);
    const hoursExact = msRemaining / (1000 * 60 * 60);
    hoursRemaining = Math.max(1, Math.ceil(hoursExact)); // Ceil, minimum 1 hour
  } else {
    const msUntilStart = differenceInMilliseconds(nextStartUTC, now);
    const hoursExact = msUntilStart / (1000 * 60 * 60);
    hoursUntilStart = Math.max(1, Math.ceil(hoursExact)); // Ceil, minimum 1 hour
  }
  
  return {
    isPromo,
    price: isPromo ? PROMO_PRICE : REGULAR_PRICE,
    regularPrice: REGULAR_PRICE,
    nextStart: nextStartUTC,
    promoEnd: promoEndUTC,
    hoursRemaining,
    hoursUntilStart,
  };
}

/**
 * Format a date in Chicago timezone for display
 */
export function formatChicagoTime(date: Date, formatString: string = 'EEEE, MMMM d \'at\' h:mm a zzz'): string {
  return format(toZonedTime(date, CHICAGO_TZ), formatString, { timeZone: CHICAGO_TZ });
}
