const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {stripTypeScriptTypes}=require('node:module');
let preferences={analytics:false,marketing:false};
const stored=new Map();
let cookieReads=0;
const document={get cookie(){cookieReads++;return '__obref=browser-fixture';}};
const scope=vm.createContext({URLSearchParams,Date,JSON,document,
 process:{env:{NEXT_PUBLIC_OPENAI_PIXEL_ID:'fixture',NODE_ENV:'production'}},
 currentPrivacyPreferences:()=>preferences,
 window:{location:{hostname:'colorcocktailfactory.com',pathname:'/activities/date-night-wheel',search:'?oppref=click-fixture'}},
 sessionStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v),removeItem:k=>stored.delete(k)},
});
const source=['lib/openaiEvents.ts','lib/openaiPixel.ts'].map(file=>fs.readFileSync(file,'utf8').replace(/^import .*;\n/gm,'').replace(/^export /gm,'')).join('\n');
vm.runInContext(stripTypeScriptTypes(source)+'\nglobalThis.api={syncOpenAIConsent,browserOpenAIAttribution,trackOpenAIPage};',scope);
assert.equal(scope.api.syncOpenAIConsent(),false);assert.equal(scope.window.oaiq,undefined);
assert.equal(scope.api.browserOpenAIAttribution(),undefined);assert.equal(cookieReads,0);assert.equal(stored.size,0);
preferences={analytics:false,marketing:true};assert.equal(scope.api.syncOpenAIConsent(),true);
const match=scope.api.browserOpenAIAttribution();assert.equal(match.oppref,'click-fixture');assert.equal(match.obref,'browser-fixture');
scope.api.trackOpenAIPage();assert.equal(scope.window.oaiq.q.filter(x=>x[0]==='measure').length,1);
assert.equal(scope.window.oaiq.q.find(x=>x[0]==='measure')[1],'page_viewed');
scope.window.location.search='';assert.equal(scope.api.browserOpenAIAttribution().oppref,'click-fixture');
preferences={analytics:true,marketing:false};scope.api.syncOpenAIConsent();assert.equal(stored.size,0);
assert.equal(scope.window.oaiq.q.filter(x=>x[0]==='measure').length,0);assert.equal(scope.api.browserOpenAIAttribution(),undefined);
preferences={analytics:true,marketing:true};scope.window.location.hostname='deploy-preview-99--fixture.netlify.app';assert.equal(scope.api.syncOpenAIConsent(),false);
console.log('PASS: no pixel or identifier access before consent; marketing-only permission; original click/browser references; page views only; revoke clears pending events/storage; previews blocked.');
