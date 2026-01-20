/**
 * Google Analytics 4 Tracking Helpers
 * Safe wrappers for gtag() calls with TypeScript support
 */

// TypeScript declarations for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Check if Google Analytics is available
 */
export function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * Track a custom event
 * @param eventName - GA4 event name (e.g., 'button_click', 'form_submit')
 * @param params - Event parameters
 */
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  if (!isGtagAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA] trackEvent (gtag not available):', eventName, params);
    }
    return;
  }

  try {
    window.gtag!('event', eventName, params);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA] Event tracked:', eventName, params);
    }
  } catch (error) {
    console.error('[GA] Error tracking event:', error);
  }
}

/**
 * Track a page view manually
 * @param pagePath - Path of the page (e.g., '/about')
 * @param pageTitle - Optional page title
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (!isGtagAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA] trackPageView (gtag not available):', pagePath);
    }
    return;
  }

  try {
    window.gtag!('event', 'page_view', {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: pageTitle || document.title
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA] Page view tracked:', pagePath);
    }
  } catch (error) {
    console.error('[GA] Error tracking page view:', error);
  }
}

/**
 * Set user properties
 * @param properties - User properties to set
 */
export function setUserProperties(properties: Record<string, any>): void {
  if (!isGtagAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA] setUserProperties (gtag not available):', properties);
    }
    return;
  }

  try {
    window.gtag!('set', 'user_properties', properties);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA] User properties set:', properties);
    }
  } catch (error) {
    console.error('[GA] Error setting user properties:', error);
  }
}

/**
 * Track outbound link click
 * @param url - Destination URL
 * @param label - Optional label for the link
 */
export function trackOutboundLink(url: string, label?: string): void {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: label || url,
    link_url: url
  });
}

/**
 * Track form submission
 * @param formName - Name/ID of the form
 * @param formDestination - Optional destination after submission
 */
export function trackFormSubmit(formName: string, formDestination?: string): void {
  trackEvent('form_submit', {
    form_name: formName,
    form_destination: formDestination
  });
}

/**
 * Track search query
 * @param searchTerm - The search term used
 */
export function trackSearch(searchTerm: string): void {
  trackEvent('search', {
    search_term: searchTerm
  });
}

/**
 * Track video interaction
 * @param action - Video action (play, pause, complete, etc.)
 * @param videoTitle - Title of the video
 * @param videoUrl - URL of the video
 */
export function trackVideo(action: string, videoTitle: string, videoUrl?: string): void {
  trackEvent('video_' + action, {
    video_title: videoTitle,
    video_url: videoUrl
  });
}

/**
 * Booking provider types
 */
export type BookingProvider = 'rezclick' | 'eventbrite' | 'acuity' | 'unknown';

/**
 * Detect booking provider from URL
 */
export function detectBookingProvider(url: string): BookingProvider {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('rezclick.com')) return 'rezclick';
  if (lowerUrl.includes('eventbrite.com')) return 'eventbrite';
  if (lowerUrl.includes('acuityscheduling.com')) return 'acuity';
  return 'unknown';
}

/**
 * Track booking click as begin_checkout event (GA4 e-commerce event)
 */
export interface BookingTrackingParams {
  city: string;
  class_category?: string;
  class_name: string;
  class_id: string; // slug
  booking_provider?: BookingProvider;
  link_url: string;
}

export function trackBeginCheckout(params: BookingTrackingParams): void {
  if (!isGtagAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA] trackBeginCheckout (gtag not available):', params);
    }
    return;
  }

  const provider = params.booking_provider || detectBookingProvider(params.link_url);

  try {
    window.gtag!('event', 'begin_checkout', {
      city: params.city,
      class_category: params.class_category || 'workshop',
      class_name: params.class_name,
      class_id: params.class_id,
      booking_provider: provider,
      link_url: params.link_url,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[GA4] begin_checkout:', { ...params, booking_provider: provider });
    }
  } catch (error) {
    console.error('[GA] Error tracking begin_checkout:', error);
  }
}

/**
 * WEEK 2: PERFORMANCE MONITORING
 * Core Web Vitals tracking with Next.js web-vitals
 */

/**
 * Detect device type from user agent
 */
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof navigator === 'undefined') return 'desktop';
  
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|opera mobi|iemobile/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Detect connection type from Network Information API
 */
function getConnectionType(): string {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown';
  }
  
  const connection = (navigator as any).connection;
  return connection?.effectiveType || 'unknown';
}

/**
 * Extract city from pathname (e.g., /chicago → chicago)
 */
function getCityFromPath(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const path = window.location.pathname;
  const cityMatch = path.match(/^\/(chicago|eugene)/);
  return cityMatch ? cityMatch[1] : 'global';
}

/**
 * Report Web Vitals to GA4
 * Compatible with web-vitals v4
 * Note: FID is deprecated in web-vitals v4, replaced by INP
 */
export function reportWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  navigationType?: string;
}): void {
  if (!isGtagAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals] gtag not available:', metric);
    }
    return;
  }

  // Only track actual web vitals (not custom metrics)
  const validMetrics = ['CLS', 'FCP', 'LCP', 'TTFB', 'INP'];
  if (!validMetrics.includes(metric.name)) {
    return;
  }

  try {
    // Round value for cleaner reporting
    const value = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value);
    
    window.gtag!('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: value,
      metric_value: value,
      metric_id: metric.id,
      metric_rating: metric.rating || 'unknown',
      page_path: window.location.pathname,
      city: getCityFromPath(),
      device_type: getDeviceType(),
      connection_type: getConnectionType(),
      non_interaction: true,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric.name, {
        value,
        rating: metric.rating,
        city: getCityFromPath(),
        device: getDeviceType(),
      });
    }
  } catch (error) {
    console.error('[GA] Error reporting web vital:', error);
  }
}

