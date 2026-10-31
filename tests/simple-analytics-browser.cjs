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
    async function scenario({ saved = null, signal = null, host = 'colorcocktailfactory.com' } = {}) {
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
          events.push({ url: url.href, body: route.request().postData() });
          return route.fulfill({ status: 200, body: '{}', headers: { 'access-control-allow-origin': '*' } });
        }
        if (url.hostname === 'scripts.simpleanalyticscdn.com') {
          scripts++;
          const body = process.env.SA_SCRIPT_FILE ? fs.readFileSync(process.env.SA_SCRIPT_FILE, 'utf8') :
            'window.sa_pageview = path => fetch("https://queue.simpleanalyticscdn.com/simple", {method:"POST",body:JSON.stringify({path})});';
          return route.fulfill({ contentType: 'application/javascript', body });
        }
        if (url.hostname !== host) return route.abort();
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
      await page.goto(`https://${host}/blog`, { waitUntil: 'networkidle' });
      return { context, page, events, violations, scripts: () => scripts };
    }

    const test = await scenario();
    assert.equal(test.scripts(), 0, 'No script before a saved choice');
    await test.page.getByRole('button', { name: 'Reject optional', exact: true }).click();
    assert.equal(test.scripts(), 0, 'Reject must not load analytics');
    await test.page.getByRole('button', { name: 'Privacy preferences', exact: true }).click();
    await test.page.getByRole('checkbox', { name: /^Analytics/ }).check();
    await test.page.getByRole('button', { name: 'Save choices', exact: true }).click();
    await test.page.waitForFunction(() => typeof window.sa_pageview === 'function');
    await test.page.waitForTimeout(300);
    assert.equal(test.events.length, 1, 'Accept sends exactly one page view');
    assert.equal(test.scripts(), 1);
    await test.page.evaluate(() => window.dispatchEvent(new Event('ccf-privacy-consent')));
    await test.page.waitForTimeout(100);
    assert.equal(test.events.length, 1, 'Repeated consent does not double count');
    await test.page.evaluate(() => history.pushState(null, '', '/blog/halloween-pottery-clay-fortune-telling'));
    await test.page.waitForTimeout(300);
    assert.equal(test.events.length, 2, 'Client navigation sends one new view');
    await test.page.getByRole('button', { name: 'Privacy preferences', exact: true }).click();
    await test.page.getByRole('button', { name: 'Reject optional', exact: true }).click();
    await test.page.evaluate(() => {
      history.pushState(null, '', '/activities');
      window.dispatchEvent(new Event('pagehide'));
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await test.page.waitForTimeout(300);
    assert.equal(test.events.length, 2, 'Revocation stops views and background collection');
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
      assert.equal(test.events.length, allowed ? 1 : 0, JSON.stringify(options));
      assert.equal(test.scripts(), allowed ? 1 : 0);
      await test.context.close();
    }
    console.log('Simple Analytics: consent, saved choices, SPA navigation, deduplication, revocation, DNT/GPC, preview exclusion and CSP passed.');
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
