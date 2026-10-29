import { acceptedFormLead, formLeadEnvironment } from "../../lib/metaFormLead.server";
import { capiDependencies, sendMetaConversion } from "../../lib/metaCapi.server";

// Netlify's supported filename event subscription supplies signed, verified
// submission metadata. Netlify blocks external event-function requests via JWS.
// Use the modern Request runtime so Netlify Database gets its request context.
// The filename-based event envelope is required here: the typed formSubmitted event exposes
// only field data and omits the platform form ID needed for exact acceptance.
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") return new Response("Method not allowed", {status:405});
  let payload: any;
  try { payload = (await request.json()).payload; }
  catch { return new Response("Invalid event", {status:400}); }
  const env = (key: string) => typeof Netlify !== "undefined" ? Netlify.env.get(key) : process.env[key];
  const conversion = acceptedFormLead(payload);
  const operatorTest = typeof payload?.data?.meta_event_id === "string" &&
    payload.data.meta_event_id.startsWith("ccf_test_") && !!env("META_CAPI_TEST_EVENT_CODE");
  if (operatorTest) console.info("[Meta CAPI] Operator form validation", {
    platform_identity_valid: !!conversion, platform_form_id: payload?.form_id,
  });
  if (!conversion) return new Response("No eligible conversion", {status:200});
  const result = await sendMetaConversion(conversion,capiDependencies(formLeadEnvironment(env,conversion.eventId)));
  if (operatorTest || result === "review" || result === "invalid")
    console.info("[Meta CAPI] Accepted form delivery",{status:result,operator_test:!!operatorTest});
  return new Response(result, {status:result === "review"?502:200});
}
