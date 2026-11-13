import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { receiveOpenAIBooking } from "../lib/openaiConversions.server";
import { openBookingReference, sealBookingReference, resolveBookingReference } from "../lib/bookingReference.server";
import { openAIAttribution } from "../lib/openaiEvents";

const now = Date.now(), secret = "fixture-only", field = "19375784";
const reference = { clientId: "", sessionId: "", preferenceId: "a".repeat(64),
  marketing: true, issuedAt: Math.floor(now / 1000) - 120,
  openai: { oppref: "original-click-reference", obref: "original-browser-reference" } };
const token = sealBookingReference(reference, secret);
const signed = (signature = true) => {
  const body = "action=changed&id=123";
  return new Request("https://fixture.invalid/webhook", { method: "POST", body,
    headers: { "x-acuity-signature": signature ? createHmac("sha256", secret).update(body).digest("base64") : "wrong" } });
};
function fixture(options: Record<string, any> = {}) {
  const sent: any[] = [], states = new Map<string, string>(); let reads = 0;
  const env: Record<string,string> = { CONTEXT: "production", OPENAI_CONVERSIONS_ENABLED: "true",
    ACUITY_API_KEY: secret, ACUITY_USER_ID: "fixture", NEXT_PUBLIC_OPENAI_PIXEL_ID: "fixture-pixel",
    OPENAI_CONVERSIONS_API_KEY: "fixture-token", ACUITY_CURRENCY: "USD", ACUITY_GA4_REFERENCE_FIELD_ID: field, ...options.env };
  const deps = {
    env: (k: string) => env[k], now: () => now,
    preferences: async () => options.preferences ?? { analytics: false, marketing: true },
    claim: async (key: string): Promise<"claimed" | "sent" | "busy"> => {
      if (states.get(key) === "sent") return "sent";
      if (states.get(key) === "sending") return "busy";
      states.set(key,"sending"); return "claimed";
    },
    finish: async (key: string, state: "sent" | "retry") => { states.set(key,state); },
    fetch: (async (url: string, init?: RequestInit) => {
      if (url.startsWith("https://bzr.openai.com/")) {
        sent.push(JSON.parse(init!.body as string));
        return new Response(null, { status: options.failOnce && sent.length === 1 ? 503 : 200 });
      }
      reads++;
      if (url.endsWith("/payments")) return Response.json([{ transactionID: "payment-1", amount: options.paymentAmount ?? 55,
        created: new Date(now - (options.age ?? 30) * 1000).toISOString() }]);
      return Response.json({ paid: options.paid ?? "yes", canceled: options.canceled ?? false, amountPaid: 55,
        forms: [{ values: [{ fieldID: Number(field), value: options.token ?? token }] }] });
    }) as typeof fetch,
  };
  return { sent, states, deps, reads: () => reads };
}

async function main() {
  assert.deepEqual(openBookingReference(token, secret, Math.floor(now/1000)),reference);
  assert.equal(openBookingReference(token, "wrong", Math.floor(now/1000)),null);
  const legacy = { ...reference, clientId: "123.456", sessionId: String(Math.floor(now/1000)-120) }; delete (legacy as any).openai;
  assert.deepEqual(openBookingReference(sealBookingReference(legacy,secret),secret,Math.floor(now/1000)),legacy);
  const revoked = await resolveBookingReference(token,secret,Math.floor(now/1000),async()=>({analytics:true,marketing:false}));
  assert.equal(revoked?.openai,undefined);
  assert.equal(openAIAttribution({oppref:"bad\nvalue"}),undefined);
  const valid = fixture();
  assert.equal((await receiveOpenAIBooking(signed(),valid.deps)).status,200);
  const event = valid.sent[0].events[0];
  assert.equal(event.type,"appointment_scheduled"); assert.equal(event.data.amount,5500);
  assert.equal(event.oppref,reference.openai.oppref); assert.equal(event.user.obref,reference.openai.obref);
  assert.equal(event.data.type,"customer_action"); assert.equal(event.opt_out,true);
  assert.equal(event.id,"acuity:appointment:123");
  assert(!JSON.stringify(event).includes("email"));
  assert.equal((await receiveOpenAIBooking(signed(),valid.deps)).status,200); assert.equal(valid.sent.length,1);
  const interrupted = fixture();
  interrupted.states.set("fixture-pixel:appointment_scheduled:acuity:appointment:123", "sending");
  assert.equal((await receiveOpenAIBooking(signed(),interrupted.deps)).status,500);
  assert.equal(interrupted.sent.length,0);
  const retry = fixture({failOnce:true});
  assert.equal((await receiveOpenAIBooking(signed(),retry.deps)).status,500);
  assert.equal((await receiveOpenAIBooking(signed(),retry.deps)).status,200);
  assert.equal(retry.sent[0].events[0].id,retry.sent[1].events[0].id);
  for (const options of [{paid:"no"},{canceled:true},{paymentAmount:25},{age:8*86400},
    {age:3600},{token:"tampered"},{preferences:{analytics:true,marketing:false}},
    {env:{CONTEXT:"deploy-preview"}},{env:{OPENAI_CONVERSIONS_ENABLED:"false"}}]) {
    const f=fixture(options); await receiveOpenAIBooking(signed(),f.deps); assert.equal(f.sent.length,0,JSON.stringify(options));
  }
  const forged=fixture(); assert.equal((await receiveOpenAIBooking(signed(false),forged.deps)).status,401);
  assert.equal(forged.reads(),0); assert.equal(forged.sent.length,0);
  const malformed = signed(false); malformed.headers.set("x-acuity-signature", "é".repeat(44));
  assert.equal((await receiveOpenAIBooking(malformed,forged.deps)).status,401);
  console.log("PASS: confirmed booking, attribution, encrypted references, consent revocation, unpaid/canceled/mismatched/stale payments, signature authentication, duplicate and retry delivery; all providers mocked.");
}
main().catch(error=>{console.error(error);process.exitCode=1;});
