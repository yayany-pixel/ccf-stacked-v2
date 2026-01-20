"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "./analytics";

/**
 * WEEK 2: ENHANCED ANALYTICS HOOKS
 * 
 * Client-side hooks for scroll depth and section visibility tracking
 * All events sent to GA4 via existing trackEvent() utility
 */

/**
 * Scroll Depth Tracking Hook
 * Fires events at 25%, 50%, 75%, 90% thresholds
 * 
 * Usage:
 * useScrollDepth(); // In page component
 */
export function useScrollDepth() {
  const thresholdsReached = useRef(new Set<number>());
  
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const percentScrolled = Math.round((scrolled / scrollHeight) * 100);

      // Check thresholds: 25%, 50%, 75%, 90%
      const thresholds = [25, 50, 75, 90];
      
      thresholds.forEach((threshold) => {
        if (percentScrolled >= threshold && !thresholdsReached.current.has(threshold)) {
          thresholdsReached.current.add(threshold);
          
          trackEvent('scroll_depth', {
            event_category: 'Engagement',
            scroll_depth: threshold,
            page_path: window.location.pathname,
            non_interaction: false,
          });

          if (process.env.NODE_ENV === 'development') {
            console.log('[Scroll Depth]', `${threshold}% reached`);
          }
        }
      });
    };

    // Throttle scroll events (max once per 200ms)
    let throttleTimeout: NodeJS.Timeout | null = null;
    const throttledScroll = () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        handleScroll();
        throttleTimeout = null;
      }, 200);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, []);
}

/**
 * Section Visibility Tracking Hook
 * Tracks when key sections enter the viewport using IntersectionObserver
 * 
 * Usage:
 * const ref = useSectionVisibility('Hero Section');
 * <section ref={ref}>...</section>
 */
export function useSectionVisibility(sectionName: string) {
  const ref = useRef<HTMLElement>(null);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (!ref.current || hasTracked || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Fire event when section becomes 50% visible
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !hasTracked) {
            setHasTracked(true);
            
            trackEvent('section_view', {
              event_category: 'Engagement',
              section_name: sectionName,
              page_path: window.location.pathname,
              non_interaction: true,
            });

            if (process.env.NODE_ENV === 'development') {
              console.log('[Section Visibility]', sectionName, 'viewed');
            }
          }
        });
      },
      {
        threshold: [0, 0.5, 1.0], // Track at 0%, 50%, 100% visibility
        rootMargin: '0px',
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [sectionName, hasTracked]);

  return ref;
}

/**
 * CTA Click Tracking Helper
 * Enhances existing begin_checkout tracking with additional context
 * 
 * Usage:
 * const trackCTA = useCTATracking();
 * trackCTA({ location: 'Hero', text: 'Book Now', type: 'primary' });
 */
export function useCTATracking() {
  return (ctaContext: {
    location: string;   // e.g., 'Hero', 'Date Night Section', 'Footer'
    text: string;       // e.g., 'Book Now', 'Reserve Your Spot'
    type: 'primary' | 'secondary' | 'text-link';
  }) => {
    trackEvent('cta_click', {
      event_category: 'CTA',
      cta_location: ctaContext.location,
      cta_text: ctaContext.text,
      cta_type: ctaContext.type,
      page_path: window.location.pathname,
      non_interaction: false,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[CTA Click]', ctaContext);
    }
  };
}
