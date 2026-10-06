/**
 * Global type declarations for Color Cocktail Factory
 */

// Google Analytics gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set' | 'js' | 'consent',
      targetIdOrDate: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

export {};
