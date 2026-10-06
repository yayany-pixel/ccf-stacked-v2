import {
  sanitizeMeta,
  parseMetaMatch,
  type MetaParameters,
  type MetaConsent,
  type MetaMatchContext,
  validEventId,
} from "./metaEvents";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
type Pixel = ((
  command: string,
  event: string,
  params?: MetaParameters | Record<string, unknown> | boolean,
  options?: { eventID: string } | string,
) => void) & {
  queue?: IArguments[];
  callMethod?: Function;
  push?: Pixel;
  loaded?: boolean;
  version?: string;
};
declare global {
  interface Window {
    fbq?: Pixel;
    _fbq?: Pixel;
    ccfMetaConsent?: MetaConsent;
    ccfSetMetaConsent?: (choice: MetaConsent) => void;
    ccfMetaInitialized?: boolean;
  }
}
export function metaConsent(): MetaConsent {
  if (typeof window === "undefined") return "denied";
  if (
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl ||
    navigator.doNotTrack === "1"
  )
    return "denied";
  return window.ccfMetaConsent || "denied";
}
export function isPixelAvailable() {
  return (
    typeof window !== "undefined" &&
    typeof window.fbq === "function" &&
    metaConsent() === "granted"
  );
}
export function initializeMetaPixel() {
  if (
    typeof window === "undefined" ||
    !META_PIXEL_ID ||
    !/^\d+$/.test(META_PIXEL_ID)
  )
    return;
  if (!window.fbq) {
    const pixel: Pixel = function () {
      if (pixel.callMethod) pixel.callMethod.apply(pixel, arguments);
      else pixel.queue!.push(arguments);
    };
    pixel.queue = [];
    pixel.push = pixel;
    pixel.loaded = true;
    pixel.version = "2.0";
    window.fbq = pixel;
    window._fbq = pixel;
  }
  if (!window.ccfMetaInitialized) {
    window.ccfMetaInitialized = true;
    if (metaConsent() !== "unknown")
      window.fbq("consent", metaConsent() === "denied" ? "revoke" : "grant");
    // Disable automatic button/form collection; only reviewed explicit events.
    window.fbq("set", "autoConfig", false, META_PIXEL_ID);
    window.fbq("init", META_PIXEL_ID);
  }
  window.ccfSetMetaConsent = updateMetaConsent;
}
export function updateMetaConsent(choice: MetaConsent) {
  if (typeof window === "undefined" || !["granted", "denied"].includes(choice))
    return;
  window.ccfMetaConsent = choice;
  window.fbq?.("consent", metaConsent() === "denied" ? "revoke" : "grant");
  window.dispatchEvent(new Event("ccf-meta-consent"));
}
export function newMetaEventId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : undefined;
}
export function metaMatchContext(): MetaMatchContext | null {
  if (typeof document === "undefined" || metaConsent() !== "granted")
    return null;
  try {
    const cookies = Object.fromEntries(
      document.cookie.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, v.join("=")];
      }),
    );
    return parseMetaMatch({
      consent: "granted",
      fbp: cookies._fbp,
      fbc: cookies._fbc,
    });
  } catch {
    return null;
  }
}
function send(
  name: string,
  params: MetaParameters = {},
  eventId?: string,
  custom = false,
) {
  if (!isPixelAvailable()) return false;
  const clean = sanitizeMeta(params);
  if (process.env.NODE_ENV === "development")
    console.debug("[Meta]", name, clean);
  try {
    window.fbq!(
      custom ? "trackCustom" : "track",
      name,
      clean,
      eventId && validEventId(eventId) ? { eventID: eventId } : undefined,
    );
    return true;
  } catch {
    return false;
  }
}
let lastPage = "";
let viewPath = "";
const views = new Set<string>();
export function trackMetaPageView() {
  if (typeof location === "undefined" || lastPage === location.pathname) return;
  if (send("PageView")) {
    lastPage = location.pathname;
    if (viewPath !== lastPage) {
      viewPath = lastPage;
      views.clear();
    }
  }
}
export function trackMetaViewContent(params: MetaParameters) {
  if (typeof location === "undefined") return;
  if (viewPath !== location.pathname) {
    viewPath = location.pathname;
    views.clear();
  }
  const key = JSON.stringify([
    params.placement,
    params.city,
    params.content_ids,
  ]);
  if (!views.has(key) && send("ViewContent", params)) views.add(key);
}
export function trackMetaInitiateCheckout(p: MetaParameters) {
  send(
    "InitiateCheckout",
    {
      content_type: "product",
      num_items: p.content_type === "product_group" ? undefined : 1,
      ...p,
    },
    newMetaEventId(),
  );
}
export function trackMetaLead(p: MetaParameters, eventId = newMetaEventId()) {
  send("Lead", p, eventId);
}
export function trackMetaCompleteRegistration(
  p: MetaParameters,
  eventId = newMetaEventId(),
) {
  send(
    "CompleteRegistration",
    { content_name: "Newsletter", status: "completed", ...p },
    eventId,
  );
}
export function trackMetaContact(p: MetaParameters) {
  send("Contact", p);
}
export function trackMetaCustom(
  name:
    | "CCF_CitySelected"
    | "CCF_ShowMore"
    | "CCF_AskCCFOpen"
    | "CCF_PrivatePartyCTA"
    | "CCF_ClassSelected",
  p: MetaParameters,
) {
  send(name, p, undefined, true);
}
// No browser Purchase helper: only verified provider data can create revenue.
// No Search helper: the site's free-form search is Ask CCF and may contain PII.
