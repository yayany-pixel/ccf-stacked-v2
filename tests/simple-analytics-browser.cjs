// Run after npm run build. Optional SA_SCRIPT_FILE exercises the vendor script
// with every collector request intercepted, so tests never pollute analytics.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');

(async () => {
  const port = 3157;
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
  let browser;
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Server startup timeout')), 30000);
      server.stdout.on('data', data => { if (String(data).includes('Ready')) { clearTimeout(timer); resolve(); } });
      server.on('exit', code => { clearTimeout(timer); reject(new Error(`Server exited: ${code}`)); });
    });
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
    async function scenario({ saved = null, signal = null, host = 'colorcocktailfactory.com', path = '/blog' } = {}) {
      const context = await browser.newContext();
      if (signal) await context.addInitScript(signal => {
        Object.defineProperty(navigator, signal, { get: () => signal === 'doNotTrack' ? '1' : true });
      }, signal);
      let preferences = saved;
      let scripts = 0;
      const events = [];
      await context.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.hostname === 'queue.simpleanalyticscdn.com') {
          const payload = route.request().postData() ? JSON.parse(route.request().postData()) : Object.fromEntries(url.searchParams);
          const metadata = typeof payload.metadata === 'string' ? JSON.parse(payload.metadata || '{}') : payload.metadata || {};
          events.push({ ...payload, metadata });
          return route.fulfill({ status: 200, body: '{}', headers: { 'access-control-allow-origin': '*' } });
        }
        if (url.hostname === 'scripts.simpleanalyticscdn.com') {
          scripts++;
          const body = process.env.SA_SCRIPT_FILE ? fs.readFileSync(process.env.SA_SCRIPT_FILE, 'utf8') :
            'const send = payload => fetch("https://queue.simpleanalyticscdn.com/simple", {method:"POST",body:JSON.stringify(payload)}); window.sa_pageview = (path,metadata) => send({type:"pageview",path,metadata}); window.sa_event = (event,metadata) => send({type:"event",event,metadata});';
          return route.fulfill({ contentType: 'application/javascript', body });
        }
        if (url.hostname !== host) return route.abort();
        if (route.request().method() !== 'GET' && url.pathname !== '/api/privacy') return route.fulfill({status:503, body:'No real submissions in tests'});
        if (url.pathname === '/api/privacy') {
          if (route.request().method() === 'POST') preferences = route.request().postDataJSON();
          return route.fulfill({ json: { preferences } });
        }
        const response = await route.fetch({ url: `http://127.0.0.1:${port}${url.pathname}${url.search}` });
        return route.fulfill({ response });
      });
      const page = await context.newPage();
      const violations = [];
      await page.exposeFunction('reportCSP', uri => violations.push(uri));
      await page.addInitScript(() => document.addEventListener('securitypolicyviolation', e => window.reportCSP(e.blockedURI)));
      await page.goto(`https://${host}${path}`, { waitUntil: 'networkidle' });
      return { context, page, events, violations, scripts: () => scripts, views: () => events.filter(e=>e.type==='pageview'), named: name=>events.filter(e=>e.event===name) };
    }

    const test = await scenario();
    assert.equal(test.scripts(), 0, 'No script before a saved choice');
    await test.page.getByRole('button', { name: 'Reject optional', exact: true }).click();
    assert.equal(test.scripts(), 0, 'Reject must not load analytics');
    await test.page.getByRole('button', { name: 'Cookie settings', exact: true }).click();
    await test.page.getByRole('checkbox', { name: /^Analytics/ }).check();
    await test.page.getByRole('button', { name: 'Save choices', exact: true }).click();
    await test.page.waitForFunction(() => typeof window.sa_pageview === 'function');
    await test.page.waitForTimeout(300);
    assert.equal(test.views().length, 1, 'Accept sends exactly one page view');
    assert.equal(test.scripts(), 1);
    await test.page.evaluate(() => window.dispatchEvent(new Event('ccf-privacy-consent')));
    await test.page.waitForTimeout(100);
    assert.equal(test.views().length, 1, 'Repeated consent does not double count');
    await test.page.evaluate(() => history.pushState(null, '', '/blog/halloween-pottery-clay-fortune-telling'));
    await test.page.waitForTimeout(300);
    assert.equal(test.views().length, 2, 'Client navigation sends one new view');
    assert.equal(test.named('page_transition').length, 1, JSON.stringify(test.named('page_transition')));
    await test.page.getByRole('button', { name: 'Cookie settings', exact: true }).click();
    await test.page.getByRole('button', { name: 'Reject optional', exact: true }).click();
    const beforeRevokedNavigation = test.events.length;
    await test.page.evaluate(() => {
      history.pushState(null, '', '/activities');
      window.dispatchEvent(new Event('pagehide'));
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await test.page.waitForTimeout(300);
    assert.equal(test.events.length, beforeRevokedNavigation, 'Revocation stops views and background collection');
    assert.equal(test.violations.filter(uri => /simpleanalytics/.test(uri)).length, 0, 'CSP allows tracker and collector');
    await test.context.close();

    for (const options of [
      { saved: { analytics: true, marketing: false } },
      { saved: { analytics: true, marketing: false }, signal: 'doNotTrack' },
      { saved: { analytics: true, marketing: false }, signal: 'globalPrivacyControl' },
      { saved: { analytics: true, marketing: false }, host: 'preview.example.test' },
    ]) {
      const test = await scenario(options);
      const allowed = !options.signal && !options.host;
      assert.equal(test.views().length, allowed ? 1 : 0, JSON.stringify(options));
      if (!allowed) assert.equal(test.events.length, 0);
      assert.equal(test.scripts(), allowed ? 1 : 0);
      await test.context.close();
    }

    const home = await scenario({ saved: {analytics:true,marketing:false}, path:'/?location=chicago' });
    await home.page.locator('[data-activity]').first().waitFor();
    const card = home.page.locator('[data-activity]').first();
    await card.scrollIntoViewIfNeeded();
    await home.page.waitForTimeout(400);
    assert.ok(home.named('class_card_view').length > 0, 'Card impressions work without GA configured');
    const clicksBefore = home.named('class_card_click').length;
    await card.getByRole('link', {name:/Explore class & dates/i}).click();
    await home.page.waitForURL('**/activities/**');
    await home.page.waitForTimeout(500);
    assert.equal(home.named('class_card_click').length - clicksBefore, 1, 'Card CTA counts once, not twice');
    assert.equal(home.named('booking_start').length, 0, 'Opening detail page is not a checkout');
    const next = home.named('homepage_next_page');
    assert.equal(next.length, 1, 'Actual navigation after homepage is recorded');
    assert.equal(next[0].metadata.previous_page, '/');
    assert.ok(next[0].metadata.destination_page.startsWith('/activities/'));
    assert.ok(home.named('link_click').some(e=>e.metadata.destination_page === next[0].metadata.destination_page));
    await home.page.goto('https://colorcocktailfactory.com/?location=chicago', {waitUntil:'networkidle'});
    await home.page.getByRole('button',{name:'Eugene',exact:true}).click();
    await home.page.waitForTimeout(300);
    assert.ok(home.named('city_selected').some(e=>e.metadata.city==='eugene'));
    assert.ok(home.named('button_click').some(e=>e.metadata.button_name==='Eugene'));
    await home.page.getByRole('button',{name:'Chicago',exact:true}).click();
    while (await home.page.getByRole('button',{name:'Show me more',exact:true}).isVisible())
      await home.page.getByRole('button',{name:'Show me more',exact:true}).click();
    const summary = home.page.locator('[data-activity]').filter({has:home.page.locator('[data-variant-booking]')}).first();
    await summary.locator('summary').click();
    const bookingsBefore = home.named('booking_start').length;
    await summary.locator('[data-variant-booking]').first().click({modifiers:['Control']});
    await home.page.waitForTimeout(300);
    assert.equal(home.named('booking_start').length - bookingsBefore, 1, 'Variant booking counts once');
    await home.page.locator('form[name="newsletter"] input[type="email"]').fill('private-not-an-email');
    await home.page.locator('form[name="newsletter"] button[type="submit"]').click();
    await home.page.waitForTimeout(300);
    assert.ok(home.named('form_start').some(e=>e.metadata.form_name==='newsletter'));
    assert.ok(home.named('form_error').some(e=>e.metadata.form_name==='newsletter'));
    await home.page.evaluate(() => window.scrollTo(0,document.documentElement.scrollHeight));
    await home.page.waitForTimeout(400);
    assert.ok(home.named('scroll_depth').some(e=>e.metadata.scroll_depth===90));
    await home.page.waitForTimeout(16000);
    assert.ok(home.named('page_engagement').some(e=>e.metadata.engaged_seconds===15));
    assert.doesNotMatch(JSON.stringify(home.events), /private-not-an-email/);
    assert.equal(home.violations.filter(uri=>/simpleanalytics/.test(uri)).length,0);
    await home.context.close();
    console.log('Simple Analytics: consent, card/button clicks, booking deduplication, homepage paths, forms without values, scroll, engagement, DNT/GPC, previews and CSP passed.');
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
