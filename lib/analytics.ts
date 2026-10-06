import { contentIdentity, classCategory } from "./analyticsIdentity";
import {
  trackMetaViewContent,
  trackMetaInitiateCheckout,
  trackMetaLead,
  trackMetaCompleteRegistration,
  trackMetaCustom,
  updateMetaConsent,
} from "./metaPixel";
import type { MetaParameters } from "./metaEvents";
import { currentPrivacyPreferences } from "./privacy";
/** Central, PII-free analytics. Never pass form or chat objects to this module. */
export type BookingProvider = "rezclick" | "eventbrite" | "acuity" | "unknown";
const allowed = new Set(
  "city previous_city placement selection_source class_category class_name class_id appointment_type_id booking_provider link_url card_position item_list_name displayed_price mode batch_number click_target previous_visible_count new_visible_count total_available_classes page_path page_location page_referrer page_title currency items item_id item_name item_category index price quantity form_name lead_type activity group_size_range method scroll_depth metric_value metric_id metric_rating device_type connection_type non_interaction event_category section_name cta_location cta_text cta_type test_name variant duplicate".split(
    " ",
  ),
);
export function safeUrl(value: string, marketing = false): string {
  if (!value) return "";
  try {
    const url = new URL(
      value,
      typeof location === "undefined"
        ? "https://colorcocktailfactory.com"
        : location.origin,
    );
    const query = new URLSearchParams();
    for (const key of marketing
      ? [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_content",
          "utm_term",
          "gclid",
          "location",
        ]
      : ["appointmentType", "calendarID", "owner"]) {
      const v = url.searchParams.get(key);
      if (v && !/@|%40/i.test(v)) query.set(key, v.slice(0, 150));
    }
    return url.origin + url.pathname + (query.size ? "?" + query : "");
  } catch {
    return "";
  }
}
export function sanitize(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params)
      .filter(
        ([k, v]) =>
          allowed.has(k) &&
          v !== undefined &&
          v !== null &&
          (k === "items" || ["string", "number", "boolean"].includes(typeof v)),
      )
      .map(([k, v]) => [
        k,
        k === "city" || k === "previous_city"
          ? ["chicago", "eugene", "online", "unknown", "global"].includes(
              String(v).toLowerCase(),
            )
            ? String(v).toLowerCase()
            : "unknown"
          : k === "items"
            ? Array.isArray(v)
              ? v.map(sanitize)
              : []
            : /^(link_url|page_location|page_referrer)$/.test(k)
              ? safeUrl(String(v), k === "page_location")
              : k === "page_path"
                ? String(v).split(/[?#]/)[0]
                : typeof v === "string"
                  ? v.replace(/[^\s@]+@[^\s@]+/g, "[redacted]").slice(0, 150)
                  : v,
      ]),
  );
}
export function currentCity(): string {
  if (typeof window === "undefined") return "unknown";
  const city =
    window.location.pathname.match(/^\/(chicago|eugene)/)?.[1] ||
    new URLSearchParams(window.location.search).get("location");
  if (city === "chicago" || city === "eugene") return city;
  try {
    return (
      localStorage.getItem("preferredCity") ||
      localStorage.getItem("ccf-city") ||
      "unknown"
    );
  } catch {
    return "unknown";
  }
}
export function isGtagAvailable() {
  return typeof window !== "undefined" && typeof window.gtag === "function" && currentPrivacyPreferences().analytics;
}
export function trackEvent(
  name: string,
  params: Record<string, any> = {},
): void {
  const clean = sanitize({
    page_path: typeof location === "undefined" ? "" : location.pathname,
    city: currentCity(),
    ...params,
  });
  if (name === "ask_ccf_open")
    trackMetaCustom("CCF_AskCCFOpen", {
      city: clean.city,
      placement: "ask_ccf",
      page_path: clean.page_path,
    });
  if (name === "private_party_cta_click")
    trackMetaCustom("CCF_PrivatePartyCTA", {
      city: clean.city,
      placement: clean.placement,
      page_path: clean.page_path,
    });
  if (process.env.NODE_ENV === "development")
    console.debug("[Analytics]", name, clean);
  if (!isGtagAvailable() || !process.env.NEXT_PUBLIC_GA_ID_1) return;
  try {
    window.gtag!("event", name, {
      ...clean,
      ...(process.env.NEXT_PUBLIC_GA_ID_1
        ? { send_to: process.env.NEXT_PUBLIC_GA_ID_1 }
        : {}),
    });
  } catch {
    /* Analytics must never interrupt booking. */
  }
}
let lastPage = "";
export function trackPageView(path: string) {
  const clean = safeUrl(path, true);
  const cycle = clean.split("?")[0];
  if (!isGtagAvailable() || lastPage === cycle) return;
  lastPage = cycle;
  trackEvent("page_view", {
    page_location: clean,
    page_path: path,
    page_referrer: safeUrl(document.referrer),
  });
}
export function detectBookingProvider(url: string): BookingProvider {
  try {
    const u = new URL(url, "https://colorcocktailfactory.com");
    if (
      u.hostname.endsWith(".acuityscheduling.com") ||
      u.hostname === "acuityscheduling.com" ||
      u.hostname === "colorcocktailfactory.as.me" ||
      u.pathname.startsWith("/book/")
    )
      return "acuity";
    if (/(^|\.)eventbrite\.com$/.test(u.hostname)) return "eventbrite";
    if (/(^|\.)rezclick\.com$/.test(u.hostname)) return "rezclick";
  } catch {}
  return "unknown";
}
export interface CardTrackingParams {
  city: string;
  class_name: string;
  class_id: string;
  class_category?: string;
  appointment_type_id?: string;
  card_position?: number;
  item_list_name?: string;
  displayed_price?: number;
  mode?: string;
  batch_number?: number;
  click_target?: string;
  placement?: string;
}
export interface BookingTrackingParams extends CardTrackingParams {
  link_url: string;
  booking_provider?: BookingProvider;
}
function item(p: CardTrackingParams) {
  return {
    item_id: p.appointment_type_id || p.class_id,
    item_name: p.class_name,
    item_category: p.class_category || "workshop",
    item_list_name: p.item_list_name,
    index: p.card_position,
    price: p.displayed_price,
    quantity: 1,
    city: p.city,
  };
}
export function metaContent(
  p: CardTrackingParams,
  url?: string,
): MetaParameters {
  const identity = contentIdentity(p.appointment_type_id || p.class_id, url);
  return {
    content_name: p.class_name,
    content_ids: [identity.id],
    content_type: identity.type,
    content_category:
      p.class_category && p.class_category !== "workshop"
        ? p.class_category
        : classCategory(p.class_name),
    value: p.displayed_price,
    currency: "USD",
    city: p.mode === "online" ? "online" : p.city,
    card_position: p.card_position,
    placement:
      p.placement || (p.card_position ? "homepage_card" : "booking_cta"),
    class_mode: p.mode,
    appointment_type_id: identity.appointmentTypeId,
  };
}
export function trackCardView(p: CardTrackingParams) {
  trackMetaViewContent(metaContent(p));
  trackEvent("view_item_list", { ...p, items: [item(p)] });
}
export function trackCardSelect(p: CardTrackingParams) {
  // Booking actions already have InitiateCheckout; count other card interest only.
  if (p.click_target !== "choose_date")
    trackMetaCustom("CCF_ClassSelected", {
      ...metaContent(p),
      click_target: p.click_target,
    });
  trackEvent("select_item", { ...p, items: [item(p)] });
}
export function trackBeginCheckout(p: BookingTrackingParams) {
  const identity = contentIdentity(
    p.appointment_type_id || p.class_id,
    p.link_url,
  );
  const id = identity.appointmentTypeId;
  trackMetaInitiateCheckout({
    ...metaContent(p, p.link_url),
    booking_provider: p.booking_provider || detectBookingProvider(p.link_url),
  });
  trackEvent("begin_checkout", {
    ...p,
    class_id: identity.id,
    appointment_type_id: id,
    booking_provider: p.booking_provider || detectBookingProvider(p.link_url),
    currency: "USD",
    items: [item({ ...p, class_id: identity.id, appointment_type_id: id })],
  });
}
export function trackLead(
  p: {
    city?: string;
    form_name: string;
    lead_type: string;
    placement?: string;
    activity?: string;
    group_size_range?: string;
  },
  eventId?: string,
) {
  trackMetaLead(
    {
      content_name:
        p.lead_type === "birthday"
          ? "Birthday Party Inquiry"
          : "Private Party Inquiry",
      content_category: "private_event",
      city: p.city,
      lead_type:
        p.placement === "ask_ccf" ? "ask_ccf_private_party" : p.lead_type,
      group_size_range: p.group_size_range,
      placement: p.placement || p.form_name,
    },
    eventId,
  );
  trackEvent("generate_lead", p);
}
export function trackSignup(placement: string) {
  trackMetaCompleteRegistration({ placement, city: currentCity() });
  trackEvent("sign_up", { method: "newsletter", placement });
}
export function trackShowMore(p: {
  city: string;
  previous_visible_count: number;
  new_visible_count: number;
  batch_number: number;
  total_available_classes: number;
}) {
  trackMetaCustom("CCF_ShowMore", {
    city: p.city,
    previous_visible_count: p.previous_visible_count,
    new_visible_count: p.new_visible_count,
    total_classes: p.total_available_classes,
    batch_number: p.batch_number,
  });
  trackEvent("homepage_show_more", p);
}
export function trackCitySelection(p: {
  city: string;
  previous_city?: string;
  placement: string;
  selection_source: string;
}) {
  if (
    ["homepage_toggle", "city_toggle"].includes(p.selection_source) &&
    p.city !== p.previous_city
  )
    trackMetaCustom("CCF_CitySelected", p);
  trackEvent("city_selected", p);
}
export function trackOutboundLink(url: string) {
  trackEvent("click", { link_url: url });
}
export function trackFormSubmit(form_name: string) {
  trackEvent("form_submit", { form_name });
}
export function trackSearch(_term: string) {
  trackEvent("search");
}
export function trackVideo(action: string, _title: string, _url?: string) {
  trackEvent("video_" + action);
}
export function setUserProperties(_properties: Record<string, any>) {
  /* No arbitrary user data sent. */
}
export function reportWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  rating?: string;
}) {
  if (!["LCP", "CLS", "INP", "FCP", "TTFB"].includes(metric.name)) return;
  trackEvent(metric.name, {
    metric_value: metric.value,
    metric_id: metric.id,
    metric_rating: metric.rating,
    device_type: /Mobi|Android/i.test(navigator.userAgent)
      ? "mobile"
      : /iPad|Tablet/i.test(navigator.userAgent)
        ? "tablet"
        : "desktop",
    connection_type: (navigator as any).connection?.effectiveType || "unknown",
    non_interaction: true,
  });
}
export type ConsentState = Record<
  "analytics_storage" | "ad_storage" | "ad_user_data" | "ad_personalization",
  "granted" | "denied"
>;
export function updateAnalyticsConsent(state: ConsentState) {
  if (typeof window !== "undefined") {
    window.gtag?.("consent", "update", state);
    updateMetaConsent(
      state.ad_storage === "granted" &&
        state.ad_user_data === "granted" &&
        state.ad_personalization === "granted"
        ? "granted"
        : "denied",
    );
  }
}

/** Coarse ranges only; free-form group-size text never leaves the form. */
export function groupSizeRange(input: string): string | undefined {
  if (!/^\d{1,3}(?:\s*[-–]\s*\d{1,3})?$/.test(input.trim())) return undefined;
  const n = Number(input.trim().split(/[-–]/).at(-1));
  return n <= 10
    ? "1-10"
    : n <= 20
      ? "11-20"
      : n <= 35
        ? "21-35"
        : n <= 60
          ? "36-60"
          : "61+";
}
