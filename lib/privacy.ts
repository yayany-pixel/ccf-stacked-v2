export type PrivacyPreferences = { analytics: boolean; marketing: boolean };

export const PRIVACY_EVENT = "ccf-privacy-consent";
export const OPEN_PRIVACY_EVENT = "ccf-open-privacy";
// Applied only after successfully checking for an existing saved choice.
export const DEFAULT_PREFERENCES: PrivacyPreferences = { analytics: true, marketing: false };
export const DENIED_PREFERENCES: PrivacyPreferences = { analytics: false, marketing: false };

/** Draft checkbox values only; these must never be applied as tracking consent. */
export function cookieSettingsChoices(saved: PrivacyPreferences | null | undefined, blocked: boolean): PrivacyPreferences {
  if (blocked || saved === undefined) return { ...DENIED_PREFERENCES };
  return saved === null ? { analytics: true, marketing: true } : { ...saved };
}

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

/**
 * Detects whether the visitor arrived directly via an advertising link
 * (e.g., Meta fbclid, Google gclid, or paid campaign UTM parameters).
 */
export function hasAdClickSignal(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const search = window.location.search;
    return /[?&](fbclid|gclid|utm_medium=(?:cpc|paid|ad)|utm_source=(?:facebook|instagram|meta))[&=]/i.test(search);
  } catch {
    return false;
  }
}

/** An advertising click is attribution context, never consent. */
export function defaultVisitorPreferences(): PrivacyPreferences {
  if (privacySignalDenied()) return { ...DENIED_PREFERENCES };
  return { ...DEFAULT_PREFERENCES };
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
