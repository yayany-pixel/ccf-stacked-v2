import assert from "node:assert/strict";
import { acceptedFormLead } from "../lib/metaFormLead.server";
import { sendMetaConversion, type CapiDependencies } from "../lib/metaCapi.server";
const data = {
  "form-name": "private-party", meta_form_name: "private-party", city: "Chicago",
  meta_event_id: "netlify:test:12345678",
  meta_context: JSON.stringify({consent:"granted", fbp:"fb.1.1700000000000.12345", client_user_agent:"UnitTest/1.0"}),
  name: "Private Person", email: "private@example.invalid", details: "Do not transmit",
};
const lead = acceptedFormLead(data)!;
assert.equal(lead.eventId, data.meta_event_id);
assert.equal(lead.data.lead_type, "private_party");
assert(!JSON.stringify(lead).includes("private@example.invalid"));
for (const update of [
  {"form-name":"newsletter"}, {"form-name":""}, {meta_form_name:"birthday-party"},
  {meta_event_id:""}, {meta_context:"{"}, {"bot-field":"spam"},
  {meta_context:JSON.stringify({consent:"denied"})}, {city:"unknown"},
] as Record<string, string>[]) assert.equal(acceptedFormLead({...data,...update}), null);
assert.equal(acceptedFormLead({...data,"form-name":"birthday-party",meta_form_name:"birthday-party"})?.data.lead_type,"birthday");
const keys = new Set(); let calls = 0;
const deps: CapiDependencies = {
 env:k=>({META_CAPI_ENABLED:"true", META_CAPI_VALIDATED_PIXEL_ID:"315271500363564", META_CAPI_ACCESS_TOKEN:"mock", NEXT_PUBLIC_META_PIXEL_ID:"315271500363564", META_GRAPH_API_VERSION:"v26.0"})[k],
 claim:async k=>{if(keys.has(k))return false;keys.add(k);return true}, finish:async()=>{},
 fetch:async(url,opts)=>{calls++;assert(String(url).includes('/315271500363564/events'));const p=JSON.parse(String(opts?.body));assert.equal(p.data[0].event_id,data.meta_event_id);return Response.json({events_received:1})},
};
async function main(){assert.deepEqual((await Promise.all([sendMetaConversion(lead,deps),sendMetaConversion(lead,deps)])).sort(),['duplicate','sent']);assert.equal(calls,1); console.log('Accepted Netlify Lead checks passed: exact form identity, consent, PII exclusion, shared IDs and concurrent deduplication.');}
main();
