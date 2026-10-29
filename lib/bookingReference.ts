import { currentPrivacyPreferences, PRIVACY_EVENT } from "./privacy";

type Reference = { reference: string; fieldId: string; refreshAt: number; marketing: boolean };
let reference: Reference | null = null;
let knownFieldId: string | undefined;
let revision = 0;
let generation = 0;
let pending: Promise<void> | null = null;
const listeners = new Set<() => void>();
export const referenceRevision = () => revision;
export const subscribeBookingReference = (listener: () => void) => {
  listeners.add(listener); return () => { listeners.delete(listener); };
};
function changed() { revision++; listeners.forEach(listener => listener()); }

/** Only our Acuity scheduler and our server booking redirect may carry a reference. */
export function decorateBookingUrl(raw: string, value: Reference | null, origin: string, fieldId = value?.fieldId): string {
  try {
    const url = new URL(raw, origin);
    const internal = url.origin === origin && /^\/book\/(chicago|eugene|online)\//.test(url.pathname);
    const acuity = url.protocol === "https:" && url.hostname === "colorcocktailfactory.as.me";
    if (!internal && !acuity) return raw;
    url.searchParams.delete("ccf_booking_ref");
    if (fieldId) url.searchParams.delete(`field:${fieldId}`);
    if (value) url.searchParams.set(internal ? "ccf_booking_ref" : `field:${value.fieldId}`, value.reference);
    return raw.startsWith("/") && !raw.startsWith("//")
      ? url.pathname + url.search + url.hash : url.toString();
  } catch { return raw; }
}

export function bookingReferenceHref(raw: string): string {
  if (typeof window === "undefined") return raw;
  const preferences = currentPrivacyPreferences();
  const active = preferences.analytics && reference && reference.marketing === preferences.marketing &&
    reference.refreshAt > Date.now() ? reference : null;
  return decorateBookingUrl(raw, active, window.location.origin, knownFieldId);
}

function googleValue(field: "client_id" | "session_id"): Promise<string | null> {
  return new Promise(resolve => {
    const ga = process.env.NEXT_PUBLIC_GA_ID_1;
    if (!ga || !window.gtag || !currentPrivacyPreferences().analytics) return resolve(null);
    let finished = false;
    const finish = (value: unknown) => {
      if (finished) return; finished = true; clearTimeout(timeout);
      resolve(typeof value === "string" || typeof value === "number" ? String(value) : null);
    };
    const timeout = window.setTimeout(() => finish(null), 1200);
    try {
      const get = window.gtag as unknown as
        (command: "get", id: string, field: string, callback: (value: unknown) => void) => void;
      get("get", ga, field, finish);
    } catch { finish(null); }
  });
}

export async function refreshBookingReference(): Promise<void> {
  if (typeof window === "undefined" || !currentPrivacyPreferences().analytics) return;
  const preferences = currentPrivacyPreferences();
  if (reference && reference.refreshAt > Date.now() && reference.marketing === preferences.marketing) return;
  if (pending) return pending;
  const version = generation;
  pending = (async () => {
    const [clientId, sessionId] = await Promise.all([googleValue("client_id"), googleValue("session_id")]);
    if (!clientId || !sessionId || version !== generation || !currentPrivacyPreferences().analytics) return;
    const response = await fetch("/.netlify/functions/booking-reference", {
      method: "POST", credentials: "same-origin", cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, sessionId, marketing: preferences.marketing }),
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return;
    const data = await response.json();
    const current = currentPrivacyPreferences();
    if (version !== generation || !current.analytics || current.marketing !== preferences.marketing ||
      typeof data.reference !== "string" || !/^ccf1\.[A-Za-z0-9_-]{80,700}$/.test(data.reference) ||
      typeof data.fieldId !== "string" || !/^\d+$/.test(data.fieldId) ||
      !Number.isFinite(data.refreshAt) || data.refreshAt <= Date.now()) return;
    knownFieldId = data.fieldId;
    reference = { reference: data.reference, fieldId: data.fieldId,
      refreshAt: Math.min(data.refreshAt, Date.now() + 20 * 60 * 1000), marketing: preferences.marketing };
    changed();
  })().catch(() => {}).finally(() => { pending = null; });
  return pending;
}

/** Prepares links without delaying checkout or replacing existing click/age guards. */
export function startBookingReferences(): () => void {
  let active = true;
  const decorate = () => {
    if (!active) return;
    document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(link => {
      const raw = link.getAttribute("href");
      if (!raw) return;
      const href = bookingReferenceHref(raw);
      if (href !== raw) link.setAttribute("href", href);
    });
  };
  const consent = () => {
    generation++; reference = null; changed(); decorate();
    void refreshBookingReference();
  };
  const prepare = () => { decorate(); void refreshBookingReference(); };
  const unsubscribe = subscribeBookingReference(decorate);
  const observer = new MutationObserver(decorate);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
  window.addEventListener(PRIVACY_EVENT, consent);
  document.addEventListener("pointerover", prepare, { passive: true });
  document.addEventListener("focusin", prepare);
  // The Google tag loads lazily; retry while it starts, then refresh on interaction.
  let attempts = 0;
  const retry = window.setInterval(() => { prepare(); if (++attempts >= 12) clearInterval(retry); }, 1000);
  prepare();
  return () => {
    active = false; generation++; reference = null; changed();
    clearInterval(retry); observer.disconnect(); unsubscribe();
    window.removeEventListener(PRIVACY_EVENT, consent);
    document.removeEventListener("pointerover", prepare);
    document.removeEventListener("focusin", prepare);
  };
}
