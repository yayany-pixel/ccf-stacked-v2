const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { stripTypeScriptTypes } = require('node:module');
const path = require('node:path');
const root = path.join(__dirname, '..');
const now = Math.floor(Date.parse('2026-10-29T01:00:00Z') / 1000);
const Clock = class extends Date { static now() { return now * 1000; } };
const secret = 'fixture-only-not-a-production-key';
const preferenceId = 'a'.repeat(64), fieldId = '19375784';
const original = { clientId: '123456789.1793235000', sessionId: String(now - 300),
  preferenceId, marketing: true, issuedAt: now - 120 };
const strip = source => stripTypeScriptTypes(source.replace(/^import[\s\S]*?;\n/gm, '')
  .replace(/export default async function handler/g, 'async function handler')
  .replace(/^export /gm, ''));
function load(file, names, injected = {}) {
  const context = vm.createContext({ Request, Response, Headers, URL, URLSearchParams, Buffer,
    AbortSignal, Date: Clock, console, ...crypto, ...injected });
  vm.runInContext(strip(fs.readFileSync(path.join(root, file), 'utf8')) +
    '\nglobalThis.exports = {' + names.join(',') + '};', context);
  return context.exports;
}
const helpers = load('lib/bookingReference.server.ts', ['validGoogleIds', 'sealBookingReference',
  'openBookingReference', 'resolveBookingReference', 'appointmentReference', 'purchaseReferenceParams',
  'referencePreferenceId', 'bookingRedirectUrl']);
let count = 0;
async function check(label, fn) { await fn(); count++; console.log('PASS:', label); }
const same = (a, b) => assert.deepEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)));

(async () => {
  const token = helpers.sealBookingReference(original, secret);
  await check('authenticated encryption round trip, random nonce and no readable identifiers', () => {
    same(helpers.openBookingReference(token, secret, now), original);
    assert.notEqual(token, helpers.sealBookingReference(original, secret));
    assert(!token.includes(original.clientId)); assert(!token.includes(preferenceId));
  });
  await check('tampered, wrong-key, expired and future references fail closed', () => {
    const index = 25;
    assert.equal(helpers.openBookingReference(token.slice(0,index) + (token[index] === 'A' ? 'B' : 'A') + token.slice(index+1), secret, now), null);
    assert.equal(helpers.openBookingReference(token, 'wrong-key', now), null);
    assert.equal(helpers.openBookingReference(token, secret, now + 7*86400 + 1), null);
    assert.equal(helpers.openBookingReference(helpers.sealBookingReference({...original, issuedAt: now + 61}, secret), secret, now), null);
    assert.equal(helpers.validGoogleIds('email@example.com', original.sessionId, now), false);
  });
  await check('current consent revocation and storage failure prevent a visitor match', async () => {
    assert.equal(await helpers.resolveBookingReference(token, secret, now, async () => ({analytics:false,marketing:true})), null);
    assert.equal(await helpers.resolveBookingReference(token, secret, now, async () => null), null);
    assert.equal(await helpers.resolveBookingReference(token, secret, now, async () => {throw Error('offline');}), null);
    const result = await helpers.resolveBookingReference(token, secret, now, async () => ({analytics:true,marketing:false}));
    assert.equal(result.clientId, original.clientId); assert.equal(result.marketing, false);
  });
  await check('only one exact configured internal Acuity field is accepted', () => {
    const form = value => ({ forms: [{values: value}] });
    assert.equal(helpers.appointmentReference(form([{fieldID: Number(fieldId),value:token}]), fieldId), token);
    assert.equal(helpers.appointmentReference(form([{fieldID:1,value:token}]), fieldId), null);
    assert.equal(helpers.appointmentReference(form([{fieldID:fieldId,value:token},{fieldID:fieldId,value:token}]), fieldId), null);
  });
  await check('internal booking redirects preserve booking choices and require live consent', async () => {
    const request = new Request('https://fixture.invalid/book/chicago/date-night-wheel?ccf_booking_ref='+token);
    const target = 'https://colorcocktailfactory.as.me/?appointmentType=79006071&calendarID=12216179';
    const url = new URL(await helpers.bookingRedirectUrl(request,target,secret,fieldId,async()=>({analytics:true,marketing:true})));
    assert.equal(url.searchParams.get('field:'+fieldId),token); assert.equal(url.searchParams.get('calendarID'),'12216179');
    assert.equal(await helpers.bookingRedirectUrl(request,target,secret,fieldId,async()=>({analytics:false,marketing:false})),target);
    assert.equal(await helpers.bookingRedirectUrl(request,'https://other.as.me/',secret,fieldId,async()=>({analytics:true,marketing:true})),'https://other.as.me/');
  });
  await check('recent payment uses the real session; delayed payment does not invent a session', () => {
    assert.equal(helpers.purchaseReferenceParams(original,now-60,now).session_id,Number(original.sessionId));
    same(helpers.purchaseReferenceParams(original,now+3600,now+3600),{});
    same(helpers.purchaseReferenceParams(null,now,now),{});
  });

  let preferences = {analytics:true, marketing:true};
  const api = load('netlify/functions/booking-reference.mts', ['handler'], {
    Netlify: {env:{get: key => ({ACUITY_API_KEY:secret,ACUITY_GA4_REFERENCE_FIELD_ID:fieldId})[key]}},
    ...helpers, privacyStore:{read:async()=>preferences},
    readPayload: async req => req.json(), payloadError:()=>({reason:'invalid_json',status:400}),
  });
  const request = (body, headers = {}, cookie = true) => new Request('https://fixture.invalid/.netlify/functions/booking-reference', {
    method:'POST',headers:{origin:'https://fixture.invalid','content-type':'application/json',
      ...(cookie?{cookie:'ccf_privacy='+preferenceId}:{}),...headers},body:JSON.stringify(body),
  });
  const ids = {clientId:original.clientId,sessionId:original.sessionId,marketing:true};
  await check('reference issuer requires same origin, existing privacy choice and valid Google IDs', async () => {
    assert.equal((await api.handler(request(ids,{origin:'https://evil.invalid'}))).status,403);
    assert.equal((await api.handler(request(ids,{'sec-fetch-site':'cross-site'}))).status,403);
    assert.equal((await (await api.handler(request(ids,{},false))).json()).reference,null);
    assert.equal((await api.handler(request({...ids,clientId:'not-a-client-id'}))).status,400);
    preferences = {analytics:false,marketing:false};
    assert.equal((await (await api.handler(request(ids))).json()).reference,null);
    preferences = {analytics:true,marketing:false};
    const response = await api.handler(request(ids)); const data = await response.json();
    assert.equal(response.headers.get('cache-control'),'private, no-store'); assert.equal(data.fieldId,fieldId);
    assert.equal(helpers.openBookingReference(data.reference,secret,now).marketing,false);
  });

  let browserPrefs = {analytics:false,marketing:false}, fetches = 0, googleReads = 0;
  const client = load('lib/bookingReference.ts', ['decorateBookingUrl','bookingReferenceHref','refreshBookingReference'], {
    currentPrivacyPreferences:()=>browserPrefs, PRIVACY_EVENT:'fixture-consent',
    process:{env:{NEXT_PUBLIC_GA_ID_1:'G-TEST'}}, clearTimeout, setTimeout,
    window:{location:{origin:'https://fixture.invalid'},setTimeout,gtag:(_cmd,_id,field,cb)=>{
      googleReads++; cb(field==='client_id'?original.clientId:original.sessionId);
    }},
    fetch:async()=>{fetches++;return Response.json({reference:token,fieldId,refreshAt:(now+1200)*1000});},
  });
  await check('browser reads no Google identifiers and issues no reference without analytics permission', async () => {
    await client.refreshBookingReference(); assert.equal(googleReads,0); assert.equal(fetches,0);
    assert.equal(client.bookingReferenceHref('https://colorcocktailfactory.as.me/'),'https://colorcocktailfactory.as.me/');
  });
  await check('consented browser links carry only the encrypted reference and preserve appointment/date choices', async () => {
    browserPrefs = {analytics:true,marketing:true}; await client.refreshBookingReference();
    assert.equal(googleReads,2); assert.equal(fetches,1);
    const href = client.bookingReferenceHref('https://colorcocktailfactory.as.me/?appointmentType=79006071&datetime=2026-11-01T18%3A00');
    const url = new URL(href); assert.equal(url.searchParams.get('field:'+fieldId),token);
    assert.equal(url.searchParams.get('appointmentType'),'79006071'); assert.equal(url.searchParams.get('datetime'),'2026-11-01T18:00');
    assert.equal(new URL(client.bookingReferenceHref('/book/chicago/date-night-wheel'), 'https://fixture.invalid').searchParams.get('ccf_booking_ref'),token);
    assert.equal(client.bookingReferenceHref('https://other.as.me/'),'https://other.as.me/');
    browserPrefs = {analytics:false,marketing:false}; assert.equal(new URL(client.bookingReferenceHref(href)).searchParams.has('field:'+fieldId),false);
  });

  function webhook({paid='yes',marketing=true,analytics=true,reference=token,paymentAge=60}={}) {
    const sent=[],ledger=new Set();
    const meta = fs.readFileSync(path.join(root,'lib/metaCapi.server.ts'),'utf8');
    const verifier = meta.match(/export function verifiedPaymentTime\([\s\S]*?\n\}/)[0].replace('export ','');
    const context = { ...helpers, privacyStore:{read:async()=>({analytics,marketing})},
      Netlify:{env:{get:key=>({GA4_PURCHASES_ENABLED:'true',NEXT_PUBLIC_GA_ID_1:'G-TEST',GA4_API_SECRET:'fixture',
        ACUITY_CURRENCY:'USD',ACUITY_USER_ID:'fixture',ACUITY_API_KEY:secret,ACUITY_GA4_REFERENCE_FIELD_ID:fieldId})[key]}},
      ACTIVITY_MANIFEST:[{appointmentTypeId:79006071,calendarIds:[12216179],city:'chicago',title:'Date Night'}],
      acuityMetaMatch:()=>null,
      sql:(strings,...values)=>({strings:strings.join('?'),values}), getDb:()=>({execute:async query=>{
        if(!query.strings.startsWith('insert')) return {rows:[]};
        const id=query.values[0]; if(ledger.has(id))return {rows:[]}; ledger.add(id);return {rows:[{transaction_id:id}]};
      }}),
      fetch:async(url,options)=>{
        if(url.includes('/mp/collect')) {sent.push(JSON.parse(options.body));return new Response(null,{status:204});}
        if(url.endsWith('/payments'))return Response.json([{transactionID:'fixture-payment',amount:55,created:new Date((now-paymentAge)*1000).toISOString()}]);
        return Response.json({paid,canceled:false,amountPaid:55,appointmentTypeID:79006071,calendarID:12216179,
          forms:[{values:[{fieldID:Number(fieldId),value:reference}]}]});
      },
    };
    const scope=vm.createContext({Request,Response,URLSearchParams,Buffer,AbortSignal,Date:Clock,console,...crypto,...context});
    vm.runInContext(strip(fs.readFileSync(path.join(root,'netlify/functions/ga4-webhook.mts'),'utf8'))+'\n'+stripTypeScriptTypes(verifier)+'\nglobalThis.handler=handler;',scope);
    return {sent,request:async()=>{const raw='action=changed&id=123';return scope.handler(new Request('https://fixture.invalid/webhook',{
      method:'POST',body:raw,headers:{'x-acuity-signature':crypto.createHmac('sha256',secret).update(raw).digest('base64')},
    }));}};
  }
  await check('verified paid appointment matches real client/session and sends one purchase only',async()=>{
    const f=webhook();assert.equal((await f.request()).status,200);assert.equal(f.sent.length,1);
    const payload=f.sent[0];assert.equal(payload.client_id,original.clientId);assert.equal(payload.events[0].params.session_id,Number(original.sessionId));
    assert.equal(payload.events[0].name,'purchase');assert.equal(payload.events[0].params.value,55);
    assert.equal(payload.consent.ad_user_data,'GRANTED');assert.equal((await f.request()).status,200);assert.equal(f.sent.length,1);
  });
  await check('revoked analytics and invalid references never match; revoked advertising never grants ad consent',async()=>{
    for(const options of [{analytics:false},{reference:'invalid'}]){
      const f=webhook(options);await f.request();assert.notEqual(f.sent[0].client_id,original.clientId);assert.equal(f.sent[0].consent.ad_user_data,'DENIED');
      assert.equal(f.sent[0].events[0].params.session_id,undefined);
    }
    const f=webhook({marketing:false});await f.request();assert.equal(f.sent[0].client_id,original.clientId);assert.equal(f.sent[0].consent.ad_user_data,'DENIED');
  });
  await check('unpaid appointment sends nothing; a payment preceding the reference cannot use it',async()=>{
    const unpaid=webhook({paid:'no'});assert.equal((await unpaid.request()).status,202);assert.equal(unpaid.sent.length,0);
    const historical=webhook({paymentAge:3600});await historical.request();assert.notEqual(historical.sent[0].client_id,original.clientId);
  });
  console.log(`PASS: ${count} booking-reference scenarios; all Google and Acuity calls mocked, no live conversions.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
