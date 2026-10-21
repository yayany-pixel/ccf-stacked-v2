import type { FormSubmittedEvent } from "@netlify/functions";
import { acceptedFormLead } from "../../lib/metaFormLead.server";
import { capiDependencies, sendMetaConversion } from "../../lib/metaCapi.server";

// Modern platform events are signature-verified by Netlify before invocation.
// No fetch handler: external callers cannot submit arbitrary conversion payloads.
export default {
  async formSubmitted(event: FormSubmittedEvent) {
    const conversion = acceptedFormLead(event.data);
    if (!conversion) return;
    const result = await sendMetaConversion(conversion, capiDependencies(key => Netlify.env.get(key)));
    if (result === "review" || result === "invalid")
      console.warn("[Meta CAPI] Accepted form delivery requires review", { status: result });
  },
};
