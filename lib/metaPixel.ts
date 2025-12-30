/**
 * Meta Pixel tracking helpers
 * Provides safe wrappers for fbq() calls with TypeScript support
 */

// Get Meta Pixel ID from environment
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// TypeScript declarations for Meta Pixel
declare global {
  interface Window {
    fbq: (
      command: 'track' | 'trackCustom' | 'init',
      eventName: string,
      params?: Record<string, any>
    ) => void;
    _fbq: any;
  }
}

/**
 * Check if Meta Pixel is available
 */
export function isPixelAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
}

/**
 * Track a standard Meta event
 * @param eventName - Standard event name (e.g., 'PageView', 'InitiateCheckout')
 * @param params - Optional event parameters
 */
export function track(eventName: string, params?: Record<string, any>): void {
  if (!isPixelAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Meta Pixel] track:', eventName, params);
    }
    return;
  }

  try {
    window.fbq('track', eventName, params);
  } catch (error) {
    console.error('[Meta Pixel] Error tracking event:', error);
  }
}

/**
 * Track a custom Meta event
 * @param eventName - Custom event name
 * @param params - Optional event parameters
 */
export function trackCustom(eventName: string, params?: Record<string, any>): void {
  if (!isPixelAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Meta Pixel] trackCustom:', eventName, params);
    }
    return;
  }

  try {
    window.fbq('trackCustom', eventName, params);
  } catch (error) {
    console.error('[Meta Pixel] Error tracking custom event:', error);
  }
}

/**
 * Track RezClick outbound booking click
 * @param destination - RezClick URL
 * @param activityName - Activity name/slug
 * @param city - Chicago or Eugene
 */
export function trackRezClickBooking(
  destination: string,
  activityName: string,
  city: string
): void {
  // Track standard InitiateCheckout event
  track('InitiateCheckout', {
    content_name: activityName,
    content_category: 'Booking',
    city: city,
    destination: destination,
  });

  // Track custom RezClickOutbound event
  trackCustom('RezClickOutbound', {
    destination: destination,
    activity: activityName,
    city: city,
    timestamp: new Date().toISOString(),
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[Meta Pixel] RezClick booking tracked:', {
      destination,
      activityName,
      city,
    });
  }
}
