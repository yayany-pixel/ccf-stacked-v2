const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
const { createHmac, timingSafeEqual } = require('node:crypto');

const source = fs.readFileSync(__dirname + '/../netlify/functions/ga4-webhook.mts', 'utf8');
const meta = fs.readFileSync(__dirname + '/../lib/metaCapi.server.ts', 'utf8');
const paymentVerifier = meta.match(/export function verifiedPaymentTime\([\s\S]*?\n\}/)[0];
const body = source.replace(/^import[\s\S]*?;\n/gm, '').replace('export default async function handler', 'async function handler');
const compiled = stripTypeScriptTypes(body + '\n' + paymentVerifier.replace('export function', 'function'));
const now = Date.parse('2026-10-29T00:00:00Z');

function fixture({ paid = 'yes', canceled = false, amount = 55, paymentAmount = 55, paymentAge = 60, paymentCreated, mapped = true, paymentStatus = 200 } = {}) {
  const sent = [];
  const ledger = new Set();
  const env = { GA4_PURCHASES_ENABLED: 'true', NEXT_PUBLIC_GA_ID_1: 'G-TEST', GA4_API_SECRET: 'fixture-only', ACUITY_CURRENCY: 'USD', ACUITY_USER_ID: 'fixture', ACUITY_API_KEY: 'fixture-key' };
  const context = {
    Request, Response, URLSearchParams, Buffer, AbortSignal, createHmac, timingSafeEqual,
    Date: class extends Date { static now() { return now; } },
    Netlify: { env: { get: key => env[key] } },
    ACTIVITY_MANIFEST: [{ appointmentTypeId: 79006071, calendarIds: [12216179], city: 'chicago', title: 'Date Night for Two' }],
    acuityMetaMatch: () => null, console,
    resolveBookingReference: async () => null, appointmentReference: () => null,
    purchaseReferenceParams: () => ({}), privacyStore: { read: async () => null },
    sql: (strings, ...values) => ({ strings: strings.join('?'), values }),
    getDb: () => ({ execute: async query => {
      if (query.strings.startsWith('insert')) {
        const id = query.values[0];
        if (ledger.has(id)) return { rows: [] };
        ledger.add(id); return { rows: [{ transaction_id: id }] };
      }
      return { rows: [] };
    } }),
    fetch: async (url, options) => {
      if (url.includes('/mp/collect')) { sent.push(JSON.parse(options.body)); return new Response(null, { status: 204 }); }
      if (url.endsWith('/payments')) return Response.json([{ transactionID: 'fixture-payment', amount: paymentAmount, created: paymentCreated ?? new Date(now - paymentAge * 1000).toISOString() }], { status: paymentStatus });
      return Response.json({ paid, canceled, amountPaid: amount, appointmentTypeID: mapped ? 79006071 : 999, calendarID: 12216179 });
    },
  };
  vm.createContext(context);
  vm.runInContext(compiled + '\nglobalThis.testHandler = handler;', context);
  return { sent, request: async (signed = true) => {
    const raw = 'action=changed&id=123&value=9999';
    return context.testHandler(new Request('https://fixture.invalid/webhook', { method: 'POST', body: raw, headers: signed ? { 'x-acuity-signature': createHmac('sha256', env.ACUITY_API_KEY).update(raw).digest('base64') } : {} }));
  } };
}

(async () => {
  for (const [label, options, expected] of [
    ['unpaid booking', { paid: 'no' }, 202],
    ['cancelled booking', { canceled: true }, 202],
    ['zero amount', { amount: 0 }, 202],
    ['payment mismatch', { paymentAmount: 5 }, 202],
    ['missing payment time', { paymentCreated: '' }, 202],
    ['old paid booking edit', { paymentAge: 73 * 3600 }, 202],
    ['future payment', { paymentAge: -600 }, 202],
    ['unknown class', { mapped: false }, 422],
    ['payment API failure', { paymentStatus: 503 }, 502],
  ]) {
    const f = fixture(options); const r = await f.request();
    assert.equal(r.status, expected, label); assert.equal(f.sent.length, 0, label);
  }
  const invalid = fixture(); assert.equal((await invalid.request(false)).status, 401); assert.equal(invalid.sent.length, 0);
  const valid = fixture(); assert.equal((await valid.request()).status, 200); assert.equal(valid.sent.length, 1);
  const payload = valid.sent[0], event = payload.events[0];
  assert.equal(payload.timestamp_micros, (now / 1000 - 60) * 1000000);
  assert.equal(event.name, 'purchase'); assert.equal(event.params.value, 55); assert.equal(event.params.currency, 'USD');
  assert.equal(event.params.transaction_id, 'acuity:123'); assert.equal(event.params.items[0].quantity, 1);
  assert.equal((await valid.request()).status, 200); assert.equal(valid.sent.length, 1, 'duplicate notification must not send again');
  console.log('PASS: 12 payment, authentication, timestamp and duplicate-delivery scenarios; no live requests.');
})().catch(error => { console.error(error); process.exitCode = 1; });

