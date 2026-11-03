const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const source = fs.readFileSync(require('node:path').join(__dirname, '../components/kids/KidsInquiryForm.tsx'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText;
async function submit({ok=true, consent=true, honeypot='', birthday=true}={}) {
  const leads=[], posts=[];
  const React={createElement:(type,props,...children)=>({type,props:props||{},children}),useEffect:()=>{},useState:v=>[v,()=>{}],useRef:v=>({current:v})};
  const deps=name=>name==='react'?React:name==='@/lib/partyFormAttribution'?{capturePartyAttribution(){},appendPartyAttribution(data){data.set('source','/chicago/kids?utm_source=facebook&utm_medium=paid_social');data.set('campaign','kids');data.set('utm_source','facebook');data.set('utm_medium','paid_social');}}:name==='@/lib/analytics'?{trackEvent:()=>{},trackPrivatePartyLead:(...v)=>leads.push(v),groupSizeRange:()=> '6-10'}:name==='@/lib/metaPixel'?{newMetaEventId:()=> 'kids-test-id',metaMatchContext:()=>consent?{consent:'granted',client_user_agent:'test'}:null}:name==='@/lib/locations'?{STUDIO_LOCATIONS:{chicago:{label:'Chicago'}}}:name==='@/lib/kids'?{KIDS_SCHEDULE:{chicago:{zone:'Central'}}}:{default:{}};
  const FormData=class extends Map {constructor(){super([['bot-field',honeypot],['groupSize','10'],['budget','$450 with firing — up to 10 children, 10 pieces total max']]);}};
  const exports={};
  new Function('require','exports','React','fetch','FormData','window','requestAnimationFrame',compiled)(deps,exports,React,async(...args)=>{posts.push(args);return {ok}},FormData,{location:{search:'?utm_source=facebook'}},()=>{});
  const tree=exports.default({city:'chicago',birthday});
  await tree.props.onSubmit({preventDefault(){},currentTarget:{}});
  await tree.props.onSubmit({preventDefault(){},currentTarget:{}});
  return {leads,posts,body:new URLSearchParams(posts[0][1].body)};
}
(async()=>{
  const a=await submit();assert.equal(a.posts.length,1);assert.equal(a.leads.length,1);assert.equal(a.leads[0][0].lead_type,'kids_birthday');assert.equal(a.body.get('meta_form_name'),'private-party');assert.equal(a.body.get('meta_event_id'),'kids-test-id');assert.match(a.body.get('budget'),/10 pieces total max/);
  assert.equal(a.body.get('source'),'/chicago/kids?utm_source=facebook&utm_medium=paid_social');assert.equal(a.body.get('utm_source'),'facebook');assert.equal(a.body.get('utm_medium'),'paid_social');assert.equal(a.body.get('campaign'),'kids');
  const denied=await submit({consent:false});assert.equal(denied.body.has('meta_context'),false);assert.equal(denied.body.has('meta_event_id'),false);
  assert.equal((await submit({ok:false})).leads.length,0);
  const spam=await submit({honeypot:'bot'});assert.equal(spam.leads.length,0);assert.equal(spam.body.get('bot-field'),'bot');
  const classes=await submit({birthday:false});assert.equal(classes.leads.length,0);assert.equal(classes.body.has('meta_context'),false);
  console.log('Kids inquiry checks passed: consent, verified Meta handoff, package transport, success, failure, spam and duplicate prevention. No live submissions.');
})().catch(e=>{console.error(e);process.exitCode=1});
