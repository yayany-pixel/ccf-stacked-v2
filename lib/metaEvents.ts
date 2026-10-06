/** Shared browser/server event schema. Customer fields are deliberately absent. */
export type MetaConsent = "granted" | "denied" | "unknown";
export interface MetaParameters {
  content_name?: string;
  content_ids?: string[];
  content_type?: "product" | "product_group";
  content_category?: string;
  value?: number;
  currency?: "USD";
  num_items?: number;
  city?: string;
  previous_city?: string;
  card_position?: number;
  placement?: string;
  class_mode?: string;
  booking_provider?: string;
  appointment_type_id?: string;
  lead_type?: string;
  group_size_range?: string;
  status?: "completed";
  page_path?: string;
  previous_visible_count?: number;
  new_visible_count?: number;
  total_classes?: number;
  batch_number?: number;
  click_target?: string;
  contact_method?: "email" | "phone";
}
const strings = new Set([
  "content_name",
  "content_type",
  "content_category",
  "currency",
  "city",
  "previous_city",
  "placement",
  "class_mode",
  "booking_provider",
  "appointment_type_id",
  "lead_type",
  "group_size_range",
  "status",
  "page_path",
  "click_target",
  "contact_method",
]);
const numbers = new Set([
  "value",
  "num_items",
  "card_position",
  "previous_visible_count",
  "new_visible_count",
  "total_classes",
  "batch_number",
]);
export function sanitizeMeta(input: MetaParameters): MetaParameters {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key === "content_ids" && Array.isArray(value))
      clean[key] = value
        .filter(
          (v) => typeof v === "string" && /^[a-zA-Z0-9:_-]{1,100}$/.test(v),
        )
        .slice(0, 30);
    else if (
      numbers.has(key) &&
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0
    )
      clean[key] = value;
    else if (
      strings.has(key) &&
      typeof value === "string" &&
      !/@|%40|\+?\d[\d ()-]{8,}\d/.test(
        key === "appointment_type_id" ? "" : value,
      )
    ) {
      if (key === "city" || key === "previous_city") {
        const city = value.toLowerCase();
        if (["chicago", "eugene", "online"].includes(city)) clean[key] = city;
      } else
        clean[key] = (
          key === "page_path" ? value.split(/[?#]/)[0] : value
        ).slice(0, 150);
    }
  }
  if (clean.value !== undefined) clean.currency = "USD";
  return clean as MetaParameters;
}
export const validEventId = (id: unknown): id is string =>
  typeof id === "string" && /^[a-zA-Z0-9:_-]{8,100}$/.test(id);
export interface MetaMatchContext {
  consent: "granted";
  fbp?: string;
  fbc?: string;
  client_user_agent?: string;
}
export function parseMetaMatch(value: unknown): MetaMatchContext | null {
  if (!value || typeof value !== "object") return null;
  const p = value as Record<string, unknown>;
  if (p.consent !== "granted") return null;
  const valid = (v: unknown) =>
    typeof v === "string" &&
    /^fb\.\d\.\d{10,13}\.[A-Za-z0-9_-]{1,300}$/.test(v);
  const fbp = valid(p.fbp) ? String(p.fbp) : undefined;
  const fbc = valid(p.fbc) ? String(p.fbc) : undefined;
  const client_user_agent =
    typeof p.client_user_agent === "string" &&
    p.client_user_agent.length > 0 &&
    p.client_user_agent.length <= 512 &&
    !/[\r\n@]/.test(p.client_user_agent)
      ? p.client_user_agent
      : undefined;
  return fbp || fbc
    ? { consent: "granted", fbp, fbc, client_user_agent }
    : null;
}
