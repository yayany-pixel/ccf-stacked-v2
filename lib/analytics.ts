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
