import { currentPrivacyPreferences } from "./privacy";
import { openAIAttribution, type OpenAIAttribution } from "./openaiEvents";

export const OPENAI_PIXEL_ID = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID;
export const OPENAI_READY = "ccf-openai-ready";
const STORAGE = "ccf_openai_click";
const MAX_AGE = 7 * 86400 * 1000;
type Queue = ((...args: unknown[]) => void) & { q?: unknown[][] };
declare global { interface Window { oaiq?: Queue } }

export function openAIMeasurementAllowed(): boolean {
  return typeof window !== "undefined" && currentPrivacyPreferences().marketing &&
    !!OPENAI_PIXEL_ID && (window.location.hostname === "colorcocktailfactory.com" ||
      window.location.hostname === "www.colorcocktailfactory.com" ||
      process.env.NODE_ENV === "development");
}

/** No identifiers are read or stored before advertising permission. */
export function browserOpenAIAttribution(): OpenAIAttribution | undefined {
  if (!openAIMeasurementAllowed()) return undefined;
  let oppref = openAIAttribution({ oppref: new URLSearchParams(window.location.search).get("oppref") })?.oppref;
  try {
    if (oppref) sessionStorage.setItem(STORAGE, JSON.stringify({ value: oppref, expires: Date.now() + MAX_AGE }));
    else {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE) || "null");
      if (saved && saved.expires > Date.now() && saved.expires <= Date.now() + MAX_AGE)
        oppref = openAIAttribution({ oppref: saved.value })?.oppref;
    }
  } catch { /* Optional storage cannot block checkout. */ }
  const cookie = document.cookie.split(";").map(p => p.trim()).find(p => p.startsWith("__obref="));
  return openAIAttribution({ oppref, obref: cookie?.slice("__obref=".length) });
}

export function syncOpenAIConsent(): boolean {
  const allowed = openAIMeasurementAllowed();
  if (!allowed) {
    try { sessionStorage.removeItem(STORAGE); } catch {}
    if (window.oaiq?.q) window.oaiq.q.length = 0;
    window.oaiq?.("consent", false);
    return false;
  }
  if (!window.oaiq) {
    const q: Queue = (...args) => { q.q!.push(args); };
    q.q = [];
    window.oaiq = q;
  }
  window.oaiq("consent", false);
  window.oaiq("init", { pixelId: OPENAI_PIXEL_ID });
  window.oaiq("consent", true);
  browserOpenAIAttribution();
  return true;
}

export function trackOpenAIPage(): void {
  if (!openAIMeasurementAllowed()) return;
  window.oaiq?.("measure", "page_viewed", {
    type: "contents", contents: [{ id: window.location.pathname, content_type: "page" }],
  }, { opt_out: true });
}
