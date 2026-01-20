"use client";

import { trackEvent } from './analytics';

/**
 * WEEK 2: A/B TESTING FRAMEWORK
 * 
 * Lightweight client-side A/B testing using cookies
 * Feature-flagged by NEXT_PUBLIC_AB_TESTS (1 = enabled, 0 = disabled)
 * 
 * Usage:
 * const variant = useABTest('hero_cta_test');
 * 
 * {variant === 'A' ? <p>Original Copy</p> : <p>Test Copy</p>}
 */

export type Variant = 'A' | 'B';

const COOKIE_NAME = 'ccf_ab';
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Check if A/B testing is enabled via feature flag
 */
function isABTestingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AB_TESTS === '1';
}

/**
 * Get all cookies as a key-value object
 */
function getCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};
  
  return document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Set a cookie with expiration
 */
function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get variant from cookie
 */
function getVariantFromCookie(): Variant | null {
  const cookies = getCookies();
  const value = cookies[COOKIE_NAME];
  
  if (value === 'A' || value === 'B') {
    return value;
  }
  
  return null;
}

/**
 * Get variant from URL parameter (?ab=A or ?ab=B)
 * Used for QA and preview purposes
 */
function getVariantFromURL(): Variant | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const value = params.get('ab');
  
  if (value === 'A' || value === 'B') {
    return value;
  }
  
  return null;
}

/**
 * Assign a random variant (50/50 split)
 */
function assignRandomVariant(): Variant {
  return Math.random() < 0.5 ? 'A' : 'B';
}

/**
 * Get or assign A/B test variant
 * Priority: URL param > Cookie > Random assignment
 */
export function getVariant(testName: string): Variant {
  // If A/B testing is disabled, always return variant A (control)
  if (!isABTestingEnabled()) {
    return 'A';
  }

  // 1. Check URL parameter (for QA)
  const urlVariant = getVariantFromURL();
  if (urlVariant) {
    setVariant(urlVariant, testName);
    return urlVariant;
  }

  // 2. Check existing cookie
  const cookieVariant = getVariantFromCookie();
  if (cookieVariant) {
    return cookieVariant;
  }

  // 3. Assign random variant and save to cookie
  const newVariant = assignRandomVariant();
  setVariant(newVariant, testName);
  
  return newVariant;
}

/**
 * Set variant in cookie and track exposure event
 */
export function setVariant(variant: Variant, testName: string): void {
  if (typeof document === 'undefined') return;
  
  setCookie(COOKIE_NAME, variant, COOKIE_EXPIRY_DAYS);
  
  // Track exposure event to GA4
  trackEvent('ab_test_exposure', {
    event_category: 'A/B Testing',
    test_name: testName,
    variant: variant,
    page_path: window.location.pathname,
    non_interaction: true,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[A/B Test]', testName, 'Variant:', variant);
  }
}

/**
 * React hook for A/B testing
 * Returns variant ('A' or 'B')
 */
export function useABTest(testName: string): Variant {
  if (typeof window === 'undefined') {
    // SSR: always return control variant to prevent hydration mismatch
    return 'A';
  }

  // Client-side: get variant (will track exposure on first call)
  return getVariant(testName);
}

/**
 * Track A/B test conversion event
 * Call when user completes desired action (e.g., clicks CTA, completes booking)
 */
export function trackConversion(testName: string, variant: Variant): void {
  trackEvent('ab_test_conversion', {
    event_category: 'A/B Testing',
    test_name: testName,
    variant: variant,
    page_path: window.location.pathname,
    non_interaction: false,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[A/B Test] Conversion:', testName, variant);
  }
}
