const {chromium}=require('playwright');const assert=require('node:assert/strict');
const base=process.env.CCF_BASE_URL||'http://localhost:8889';
(async()=>{const b=await chromium.launch();try{for(const width of [390,1440])for(const mode of ['denied','missing','failed']){
 const c=await b.newContext({viewport:{width,height:900}});const calls=[];
 await c.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin!==new URL(base).origin){if(u.hostname==='connect.facebook.net')calls.push('library');return r.fulfill({body:''})}if(u.pathname==='/api/privacy')return new Promise(resolve=>setTimeout(async()=>{await r.fulfill(mode==='failed'?{status:503,body:''}:{json:{preferences:mode==='missing'?null:{analytics:true,marketing:false}}});resolve()},500));if(r.request().method()==='POST')return r.fulfill({status:503,body:'Isolated'});return r.continue()});
 await c.addInitScript(()=>{window.__meta=[];window.fbq=(...x)=>window.__meta.push(x)});
 const p=await c.newPage();await p.goto(base+'/?fbclid=consent-test');await p.waitForTimeout(1000);
 assert.equal(await p.locator('script#meta-pixel-library').count(),0);assert.equal(calls.length,0);assert.equal(await p.evaluate(()=>window.__meta.filter(x=>x[0]==='track'||x[0]==='trackCustom').length),0);
 console.log(`Consent fail-closed check passed: ${width}px, ${mode}, paid-ad arrival.`);await c.close();
}}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
