import type { FormSubmittedEvent } from "@netlify/functions";
import { acceptedFormLead, formLeadEnvironment } from "../../lib/metaFormLead.server";
import { capiDependencies, sendMetaConversion } from "../../lib/metaCapi.server";

// Modern platform events are signature-verified by Netlify before invocation.
// No fetch handler: external callers cannot submit arbitrary conversion payloads.
export default {
  async formSubmitted(event: FormSubmittedEvent) {
    const env = (key: string) => Netlify.env.get(key);
    const isOperatorTest = event.data.meta_event_id?.startsWith("ccf_test_") && !!env("META_CAPI_TEST_EVENT_CODE");
    const conversion = acceptedFormLead(event.data);
    if (isOperatorTest) console.info("[Meta CAPI] Operator form validation", {
      field_names: Object.keys(event.data), accepted_identity: !!conversion,
    });
    if (!conversion) return;
    const result = await sendMetaConversion(conversion, capiDependencies(formLeadEnvironment(env, conversion.eventId)));
    if (isOperatorTest || result === "review" || result === "invalid")
      console.info("[Meta CAPI] Accepted form delivery", { status: result, operator_test: !!isOperatorTest });
  },
};
