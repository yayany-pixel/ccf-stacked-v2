import { currentPrivacyPreferences } from "./privacy";

// Public installation identifier, not a secret or account credential.
export const CLARITY_PROJECT_ID = "z6g09sfgcy";
type ClarityCommand = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window { clarity?: ClarityCommand }
}

export function clarityPageAllowed(hostname: string, pathname: string) {
  return /^(www\.)?colorcocktailfactory\.com$/.test(hostname) &&
    !/^\/(analytics|api|thanks|book|teach)(\/|$)/.test(pathname);
}

/** One controller per document; route/consent changes never inject a second tag. */
export function createClarityController() {
  let installed = false;
  let active = false;
  let lastConsent = "";

  return function syncClarity() {
    const preferences = currentPrivacyPreferences();
    const allowed = preferences.analytics &&
      clarityPageAllowed(window.location.hostname, window.location.pathname);

    if (!allowed) {
      if (installed && active) {
        window.clarity?.("consentv2", { analytics_Storage: "denied", ad_Storage: "denied" });
        // Consent denial alone permits cookieless tracking. Stop capture too.
        window.clarity?.("stop");
        active = false;
        lastConsent = "";
      }
      return;
    }

    if (!window.clarity) {
      const queue: ClarityCommand = (...args) => { (queue.q ||= []).push(args); };
      window.clarity = queue;
    }
    if (installed && !active) window.clarity("start");
    const consent = `${preferences.analytics}:${preferences.marketing}`;
    if (consent !== lastConsent) {
      window.clarity("consentv2", {
        analytics_Storage: "granted",
        ad_Storage: preferences.marketing ? "granted" : "denied",
      });
      lastConsent = consent;
    }
    active = true;
    if (!installed) {
      installed = true;
      const script = document.createElement("script");
      script.id = "microsoft-clarity";
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
      document.head.appendChild(script);
    }
  };
}
