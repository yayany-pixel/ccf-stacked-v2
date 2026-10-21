import { acceptedFormLead, formLeadEnvironment } from "../../lib/metaFormLead.server";
import { capiDependencies, sendMetaConversion } from "../../lib/metaCapi.server";

// Netlify's supported filename event subscription supplies signed, verified
// submission metadata. Netlify blocks external event-function requests via JWS.
// The legacy envelope is required here: the typed formSubmitted event exposes
// only field data and omits the platform form ID needed for exact acceptance.
export async function handler(event: { httpMethod: string; body: string | null }) {
  if (event.httpMethod !== "POST") return {statusCode:405,body:"Method not allowed"};
  let payload: any;
  try { payload = JSON.parse(event.body || "{}").payload; }
  catch { return {statusCode:400,body:"Invalid event"}; }
  const env = (key: string) => typeof Netlify !== "undefined" ? Netlify.env.get(key) : process.env[key];
  const conversion = acceptedFormLead(payload);
  const operatorTest = typeof payload?.data?.meta_event_id === "string" &&
    payload.data.meta_event_id.startsWith("ccf_test_") && !!env("META_CAPI_TEST_EVENT_CODE");
  if (operatorTest) console.info("[Meta CAPI] Operator form validation", {
    platform_identity_valid: !!conversion, platform_form_id: payload?.form_id,
  });
  if (!conversion) return {statusCode:200,body:"No eligible conversion"};
  const result = await sendMetaConversion(conversion,capiDependencies(formLeadEnvironment(env,conversion.eventId)));
  if (operatorTest || result === "review" || result === "invalid")
    console.info("[Meta CAPI] Accepted form delivery",{status:result,operator_test:!!operatorTest});
  return {statusCode:result === "review"?502:200,body:result};
}
