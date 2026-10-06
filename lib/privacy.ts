export type PrivacyPreferences = { analytics: boolean; marketing: boolean };

export const PRIVACY_EVENT = "ccf-privacy-consent";
export const OPEN_PRIVACY_EVENT = "ccf-open-privacy";
export const DENIED_PREFERENCES: PrivacyPreferences = { analytics: false, marketing: false };

declare global {
  interface Window {
    ccfPrivacyPreferences?: PrivacyPreferences;
  }
}

export function parsePrivacyPreferences(value: unknown): PrivacyPreferences | null {
  if (!value || typeof value !== "object") return null;
  const preferences = value as Record<string, unknown>;
  if (typeof preferences.analytics !== "boolean" || typeof preferences.marketing !== "boolean") return null;
  return { analytics: preferences.analytics, marketing: preferences.marketing };
}

export function privacySignalDenied(): boolean {
  return typeof navigator !== "undefined" && (
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true ||
    navigator.doNotTrack === "1"
  );
}

export function currentPrivacyPreferences(): PrivacyPreferences {
  if (typeof window === "undefined" || privacySignalDenied()) return { ...DENIED_PREFERENCES };
  return parsePrivacyPreferences(window.ccfPrivacyPreferences) ?? { ...DENIED_PREFERENCES };
}

export function googleConsentState(preferences: PrivacyPreferences) {
  const analytics = preferences.analytics ? "granted" : "denied";
  const marketing = preferences.marketing ? "granted" : "denied";
  return {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  } as const;
}
