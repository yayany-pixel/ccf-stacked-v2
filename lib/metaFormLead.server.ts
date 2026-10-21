import { parseMetaMatch, validEventId } from "./metaEvents";
import type { VerifiedMetaConversion } from "./metaCapi.server";
const FORM_IDS: Record<string, string> = {
  "private-party": "692cbf5dc836c30008e87c35",
  "birthday-party": "69a50e767120ed0008557c97",
};
/** Only pass the payload of Netlify's signed submission-created platform event.
 * Form identity comes from platform metadata, never a customer-supplied field.
 */
export function acceptedFormLead(payload: unknown, now = Math.floor(Date.now()/1000)): VerifiedMetaConversion | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, any>;
  if (typeof p.form_name !== "string" || FORM_IDS[p.form_name] !== p.form_id ||
      !/^[a-f0-9]{24}$/.test(p.id || "") || p.spam === true) return null;
  const data = p.data;
  if (!data || typeof data !== "object" || data.meta_form_name !== p.form_name ||
      data["bot-field"] || !validEventId(data.meta_event_id)) return null;
  const time = typeof p.created_at === "string" ? Date.parse(p.created_at)/1000 : NaN;
  if (!Number.isFinite(time) || time > now+60 || time < now-7*86400) return null;
  let match;
  try { match = parseMetaMatch(JSON.parse(data.meta_context || "null")); }
  catch { return null; }
  if (!match?.client_user_agent) return null;
  const city = typeof data.city === "string" ? data.city.toLowerCase() : "";
  if (city !== "chicago" && city !== "eugene") return null;
  return {
    name: "Lead", eventId: data.meta_event_id, eventTime: Math.floor(time),
    sourceUrl: "https://colorcocktailfactory.com/", match,
    data: {
      content_name: p.form_name === "birthday-party" ? "Birthday Party Inquiry" : "Private Party Inquiry",
      content_category: "private_event", lead_type: p.form_name === "birthday-party" ? "birthday" : "private_party",
      city, placement: p.form_name,
    },
  };
}
/** Temporary, explicitly marked operator tests never alter ordinary events. */
export function formLeadEnvironment(env: (key:string)=>string|undefined,eventId:string) {
  const isTest = eventId.startsWith("ccf_test_") && !!env("META_CAPI_TEST_EVENT_CODE");
  return (key:string) => {
    if (key === "META_CAPI_TEST_EVENT_CODE") return isTest ? env(key) : undefined;
    if (key === "META_CAPI_ENABLED" && isTest) return "true";
    return env(key);
  };
}
