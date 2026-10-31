import { currentPrivacyPreferences } from "./privacy";

export type SimpleMetadata = Record<string, string | number | boolean>;
declare global {
  interface Window {
    sa_event?: (name: string, metadata?: SimpleMetadata, callback?: () => void, keepalive?: boolean) => void;
    sa_pageview?: (path?: string, metadata?: SimpleMetadata) => void;
  }
}

const events: Record<string, string> = {
  view_item_list: "class_card_view", select_item: "class_card_click",
  begin_checkout: "booking_start", generate_lead: "inquiry_success",
  sign_up: "newsletter_signup", city_selected: "city_selected",
  homepage_show_more: "homepage_show_more", homepage_filter_selected: "homepage_filter_selected",
  private_party_cta_click: "private_party_cta_click", cta_click: "cta_click",
  ask_ccf_open: "studio_help_open", ask_ccf_recommendation_click: "studio_help_class_click",
  button_click: "button_click", link_click: "link_click", section_view: "section_view",
  scroll_depth: "scroll_depth", page_engagement: "page_engagement",
  form_start: "form_start", form_submit_attempt: "form_submit_attempt", form_error: "form_error",
  page_transition: "page_transition", homepage_next_page: "homepage_next_page",
};
const textKeys = new Set("city previous_city class_name class_id class_category appointment_type_id item_list_name mode click_target placement booking_provider form_name lead_type method selection_source cta_location cta_text cta_type section_name button_name destination_host destination_kind element_type action".split(" "));
const numberKeys = new Set("card_position displayed_price batch_number previous_visible_count new_visible_count total_available_classes scroll_depth engaged_seconds".split(" "));
const pathKeys = new Set(["page_path", "previous_page", "entry_page", "destination_page"]);
const homePaths = new Set(["/", "/chicago", "/eugene"]);

/** Public paths only; never retain queries, fragments, account or admin routes. */
export function publicPath(value: string): string {
  if (!value.trim()) return "";
  try {
    const url = new URL(value, "https://colorcocktailfactory.com");
    if (!/^(www\.)?colorcocktailfactory\.com$/.test(url.hostname)) return "";
    const path = url.pathname.replace(/\/$/, "") || "/";
    if (!/^\/[a-z0-9/_-]*$/i.test(path) || path.length > 200 ||
      /^\/(api|admin|analytics|account|checkout|teach\/instructors)(\/|$)/i.test(path)) return "";
    return path;
  } catch { return ""; }
}

export function simpleAnalyticsAllowed(): boolean {
  return typeof window !== "undefined" &&
    /^(www\.)?colorcocktailfactory\.com$/.test(window.location.hostname) &&
    Boolean(publicPath(window.location.pathname)) && currentPrivacyPreferences().analytics;
}

export function simpleMetadata(input: Record<string, unknown>): SimpleMetadata {
  const result: SimpleMetadata = {};
  for (const [key, value] of Object.entries(input)) {
    if (pathKeys.has(key) && typeof value === "string") {
      const path = publicPath(value); if (path) result[key] = path;
    } else if (numberKeys.has(key) && typeof value === "number" && Number.isFinite(value) && value >= 0) {
      result[key] = Math.min(value, 100000);
    } else if (textKeys.has(key) && typeof value === "string" &&
      !/@|%40|https?:|\b\d[\d ()+.-]{8,}\d\b/i.test(value)) {
      result[key] = value.replace(/[\r\n\t]+/g, " ").trim().slice(0, 120);
    } else if (key === "after_homepage" && typeof value === "boolean") result[key] = value;
  }
  return result;
}

let queue: { name: string; metadata: SimpleMetadata; created: number }[] = [];
let lastPage = "";
let entryPage = "";
let sawHome = false;

export function resetSimpleAnalytics() {
  queue = [];
  lastPage = entryPage = "";
  sawHome = false;
}

function city(): string {
  const url = new URL(window.location.href);
  let value = url.pathname.match(/^\/(chicago|eugene)(?:\/|$)/)?.[1] || url.searchParams.get("city") || url.searchParams.get("location");
  try { value ||= localStorage.getItem("preferredCity") || localStorage.getItem("ccf-city"); } catch { /* Storage may be blocked. */ }
  return value === "chicago" || value === "eugene" ? value : "unknown";
}

export function trackSimpleEvent(name: string, input: Record<string, unknown> = {}): boolean {
  if (!events[name] || !simpleAnalyticsAllowed()) return false;
  const metadata = simpleMetadata({ page_path: window.location.pathname, city: city(), ...input });
  try {
    if (window.sa_event) window.sa_event(events[name], metadata, undefined, true);
    else {
      queue = queue.filter(item => Date.now() - item.created < 30000).slice(-99);
      queue.push({ name: events[name], metadata, created: Date.now() });
    }
    return true;
  } catch { return false; } // Measurement must never interrupt a booking.
}

export function flushSimpleEvents() {
  if (!simpleAnalyticsAllowed()) { resetSimpleAnalytics(); return; }
  if (!window.sa_event) return;
  const pending = queue; queue = [];
  for (const item of pending) {
    if (Date.now() - item.created < 30000) {
      try { window.sa_event(item.name, item.metadata, undefined, true); } catch { /* Best effort. */ }
    }
  }
}

export function trackSimplePage() {
  if (!simpleAnalyticsAllowed() || !window.sa_pageview) return;
  const page = publicPath(window.location.pathname);
  if (lastPage === page) return;
  const previous = lastPage || publicPath(document.referrer);
  if (!entryPage) entryPage = homePaths.has(previous) ? previous : page;
  sawHome = sawHome || homePaths.has(previous) || homePaths.has(page);
  const metadata = { entry_page: entryPage, previous_page: previous, after_homepage: sawHome };
  try { window.sa_pageview(page, simpleMetadata(metadata)); } catch { return; }
  lastPage = page;
  if (previous && previous !== page) {
    trackSimpleEvent("page_transition", { ...metadata, destination_page: page });
    if (homePaths.has(previous) && !homePaths.has(page))
      trackSimpleEvent("homepage_next_page", { ...metadata, destination_page: page });
  }
  flushSimpleEvents();
}
