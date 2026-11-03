export type PartyAttribution = {
  source: string;
  utm_source: string;
  utm_medium: string;
  campaign: string;
};

const KEY = "ccf-party-first-touch";
let firstTouch: Omit<PartyAttribution, "source"> | undefined;

/** Keep session-first campaign tags; source always identifies the submitting page. */
export function capturePartyAttribution(): PartyAttribution {
  if (typeof window === "undefined") return { source: "", utm_source: "", utm_medium: "", campaign: "" };
  if (!firstTouch) {
    try {
      const saved = JSON.parse(window.sessionStorage.getItem(KEY) || "null");
      if (saved && ["utm_source", "utm_medium", "campaign"].every(key => typeof saved[key] === "string")) {
        firstTouch = { utm_source: saved.utm_source, utm_medium: saved.utm_medium, campaign: saved.campaign };
      }
    } catch {
      // Storage may be unavailable in private browsing; keep this visit in memory.
    }
  }
  if (!firstTouch) {
    const query = new URLSearchParams(window.location.search);
    const tag = (name: string) => (query.get(name) || "").slice(0, 200);
    firstTouch = { utm_source: tag("utm_source"), utm_medium: tag("utm_medium"), campaign: tag("utm_campaign") };
    try { window.sessionStorage.setItem(KEY, JSON.stringify(firstTouch)); } catch {}
  }
  const tags = new URLSearchParams();
  if (firstTouch.utm_source) tags.set("utm_source", firstTouch.utm_source);
  if (firstTouch.utm_medium) tags.set("utm_medium", firstTouch.utm_medium);
  return { ...firstTouch, source: window.location.pathname + (tags.size ? `?${tags}` : "") };
}

export function appendPartyAttribution(data: FormData | URLSearchParams) {
  Object.entries(capturePartyAttribution()).forEach(([key, value]) => data.set(key, value));
}
