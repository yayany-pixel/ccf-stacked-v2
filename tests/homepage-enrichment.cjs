require('tsx/cjs');
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { buildHomepageData } = require('../lib/homepage/data.ts');
const { ACTIVITY_MANIFEST } = require('../lib/homepage/manifest.ts');
const { normalize } = require('../lib/askccf/catalog.ts');
const base = process.env.CCF_BASE_URL || 'http://localhost:8889';
const fixture = buildHomepageData(ACTIVITY_MANIFEST.map(a => normalize({id:a.appointmentTypeId, name:a.acuityTitle, calendarIDs:a.calendarIds, category:a.city === 'online' ? 'Online' : a.city === 'eugene' ? 'Eugene Classes' : 'Chicago Classes', active:true, price:a.key.includes('date-night') ? '110' : '55', duration:90, description:a.key.includes('date-night') ? 'One ticket covers two people.' : 'Materials included. No experience required.'})), []);
(async () => {
  const browser = await chromium.launch({args:['--no-sandbox']});
  try {
    for (const width of [390,1440]) {
      const context = await browser.newContext({viewport:{width,height:900}});
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.origin !== new URL(base).origin || /proxy|simpleanalytics/.test(url.pathname)) return route.abort();
        if (url.pathname === '/api/homepage') return route.fulfill({json:fixture});
        return route.continue();
      });
      await context.addInitScript(() => { window.__events=[]; window.gtag=(...args)=>window.__events.push(args); });
      const page = await context.newPage();
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      await page.goto(base+'/?location=chicago',{timeout:90000});
      await page.waitForFunction(()=>!document.querySelector('button[aria-pressed]').disabled);
      await page.getByRole('button',{name:'Glass & lamps',exact:true}).click();
      const lamp=page.locator('[data-activity="chicago-turkish-lamp"]');
      await lamp.locator('summary').click();
      assert.equal(await lamp.locator('[data-variant-booking]').count(),3);
      assert.ok((await lamp.innerText()).includes('90 minutes'));
      const variants=await lamp.locator('[data-variant-booking]').evaluateAll(links=>links.map(link=>link.href));
      assert.deepEqual(variants.map(url=>new URL(url).searchParams.get('appointmentType')),['95416771','79374537','95894050']);
      await lamp.locator('[data-variant-booking]').first().evaluate(link=>link.addEventListener('click',event=>event.preventDefault()));
      await page.evaluate(()=>window.__events=[]);
      await lamp.locator('[data-variant-booking]').first().click();
      const events=await page.evaluate(()=>window.__events);
      assert.equal(events.filter(event=>event[1]==='begin_checkout').length,1);
      assert.equal(events.filter(event=>event[1]==='select_item').length,1);
      assert.equal(events.find(event=>event[1]==='begin_checkout')[2].class_id,'95416771');
      await page.getByRole('button',{name:'Online',exact:true}).click();
      assert.ok((await page.locator('[data-activity]').allTextContents()).every(text=>text.includes('Live Online')));
      await page.getByRole('button',{name:'Eugene',exact:true}).click();
      assert.equal(await page.getByRole('button',{name:'All workshops',exact:true}).getAttribute('aria-pressed'),'true');
      await page.getByText('Where do I go, and where can I park?',{exact:true}).click();
      assert.ok((await page.locator('main').innerText()).includes('3295 Cross Street'));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      assert.deepEqual(errors,[]);
      await context.close();
    }
    console.log('Enrichment browser checks passed: mobile/desktop filters, lamp variants, exact-once checkout, city reset, FAQ, and overflow.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
