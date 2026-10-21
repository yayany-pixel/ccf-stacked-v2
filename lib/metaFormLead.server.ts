import { parseMetaMatch, validEventId } from "./metaEvents";
import type { VerifiedMetaConversion } from "./metaCapi.server";

/** Called only from Netlify's authenticated formSubmitted platform event.
 * Never accept an arbitrary public HTTP body as proof of form acceptance.
 */
export function acceptedFormLead(
  data: Record<string, string>,
  now = Math.floor(Date.now() / 1000),
): VerifiedMetaConversion | null {
  const form = data["form-name"];
  // Require the platform-delivered form identity as well as our registered field.
  // If Netlify omits it, skip delivery until its accepted payload is validated.
  if (form !== data.meta_form_name) return null;
  if (form !== "private-party" && form !== "birthday-party") return null;
  if (data["bot-field"] || !validEventId(data.meta_event_id)) return null;
  let match;
  try { match = parseMetaMatch(JSON.parse(data.meta_context || "null")); }
  catch { return null; }
  if (!match?.client_user_agent) return null;
  const city = data.city?.toLowerCase();
  if (city !== "chicago" && city !== "eugene") return null;
  return {
    name: "Lead",
    eventId: data.meta_event_id,
    eventTime: now,
    sourceUrl: "https://colorcocktailfactory.com/",
    match,
    data: {
      content_name: form === "birthday-party" ? "Birthday Party Inquiry" : "Private Party Inquiry",
      content_category: "private_event",
      lead_type: form === "birthday-party" ? "birthday" : "private_party",
      city,
      placement: form,
    },
  };
}

/** Explicitly marked operator tests can run while live CAPI remains off.
 * The temporary Test Events code is never applied to ordinary submissions.
 * Removing the code disables this test path completely.
 */
export function formLeadEnvironment(
  env: (key: string) => string | undefined,
  eventId: string,
) {
  const isTest = eventId.startsWith("ccf_test_") && !!env("META_CAPI_TEST_EVENT_CODE");
  return (key: string) => {
    if (key === "META_CAPI_TEST_EVENT_CODE") return isTest ? env(key) : undefined;
    if (key === "META_CAPI_ENABLED" && isTest) return "true";
    return env(key);
  };
}
