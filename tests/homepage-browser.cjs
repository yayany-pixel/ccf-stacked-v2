require('tsx/cjs');
const path = require('node:path');
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const root = process.env.CCF_BASE_URL || 'http://localhost:8889';
const output = path.join(__dirname, '../docs/homepage-review/screenshots');
const resultsPath = path.join(output, '../browser-results.json');
const { ACTIVITY_MANIFEST: manifest } = require('../lib/homepage/manifest.ts');
fs.mkdirSync(output, { recursive: true });
const results = process.env.CCF_BROWSER_SKIP_VIEWPORTS
  ? JSON.parse(fs.readFileSync(resultsPath, 'utf8')).completed.filter(result => result.check === 'viewport')
  : [];

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const liveData = await (await fetch(root + '/api/homepage')).json();
  async function contextFor(viewport, intercept) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== new URL(root).origin) return route.abort();
      if (route.request().method() === 'POST' && url.pathname === '/netlify-forms.html') return route.fulfill({ status: 503, body: 'Isolated test destination' });
      if (intercept && await intercept(route, url)) return;
      return route.continue();
    });
    return context;
  }
  async function ready(page, city) {
    await page.goto(`${root}/?location=${city}`, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForFunction(() => document.querySelectorAll('[data-activity]').length === 10);
    await page.waitForFunction(() => {
      const image = document.querySelector('[data-activity] img');
      return image && image.complete && image.naturalWidth > 0;
    });
  }
  function expected(city) {
    return liveData.activities.filter(activity => (activity.city === city || activity.city === 'online') && activity.eligibility === 'ready' && activity.image && activity.bookingUrl && activity.offeringState !== 'inactive').sort((left, right) => left.priority - right.priority || left.key.localeCompare(right.key));
  }
  if (!process.env.CCF_BROWSER_SKIP_VIEWPORTS) {
  for (const city of ['chicago', 'eugene']) {
    for (const [width, height] of [[390,650],[390,568],[375,667],[430,932],[1440,900]]) {
      const context = await contextFor({ width, height });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const photos = new Set();
      page.on('request', request => {
        const url = new URL(request.url());
        if (url.pathname === '/.netlify/images') photos.add(url.searchParams.get('url'));
      });
      await ready(page, city);
      const geometry = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        header: document.querySelector('.studio-home header').getBoundingClientRect().height,
        cards: [...document.querySelectorAll('[data-activity]')].map(card => {
          const rect = card.getBoundingClientRect();
          const button = card.querySelector('a').getBoundingClientRect();
          return { key: card.dataset.activity, height: rect.height, buttonHeight: button.height, clipped: button.bottom > rect.bottom + 1 || button.right > rect.right + 1 };
        }),
        opening: [...document.querySelector('#classes').children].slice(0,4).map(element => element.dataset.activity || element.id),
      }));
      assert.equal(geometry.overflow, false, `${city} ${width} overflow`);
      assert.ok(geometry.cards.every(card => !card.clipped && card.buttonHeight >= 48), 'Complete touch targets');
      if (width < 900) assert.ok(geometry.cards.every(card => card.height <= height - geometry.header + 2), `${city} ${width}x${height} compact cards: ${JSON.stringify(geometry.cards)}`);
      assert.deepEqual(geometry.opening, [expected(city)[0].key, expected(city)[1].key, 'private-party', expected(city)[2].key]);
      assert.equal(await page.locator('form[name="private-party"]').count(), 1);
      const initialPhotos = new Set(expected(city).slice(0,10).map(activity => activity.image.path));
      assert.ok([...photos].every(photo => initialPhotos.has(photo)), 'Only rendered activity images downloaded');
      assert.deepEqual(errors, [], 'No browser runtime errors');
      await page.screenshot({ path: `${output}/${city}-${width}x${height}.png` });
      if (city === 'chicago' && width === 390 && height === 650) {
        await page.locator('[data-activity]').nth(1).screenshot({ path: `${output}/complete-mobile-card.png` });
        for (const card of await page.locator('[data-activity]').all()) {
          await card.scrollIntoViewIfNeeded();
          await card.locator('img').evaluate(image => image.decode());
        }
        await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0,0); });
        await page.screenshot({ path: `${output}/chicago-first-ten-full.png`, fullPage: true });
      }
      results.push({ check: 'viewport', city, width, height, passed: true, geometry });
      console.log(`PASS viewport ${city} ${width}x${height}`);
      await context.close();
    }
  }

  }
  const context = await contextFor({ width: 390, height: 650 });
  const page = await context.newPage();
  await ready(page, 'chicago');
  const form = page.locator('#private-party form');
  await form.locator('[name="name"]').fill('Owner preview');
  await form.locator('[name="email"]').fill('owner-preview@example.invalid');
  await form.locator('[name="groupSize"]').fill('12');
  await form.locator('[name="occasion"]').fill('Owner review only');
  await form.locator('summary').click();
  await form.locator('[name="details"]').fill('Local browser test. Do not submit live.');
  for (const city of ['chicago', 'eugene', 'chicago']) {
    if (city !== 'chicago' || await page.getByRole('button', { name: 'Eugene', exact: true }).getAttribute('aria-pressed') === 'true') await page.getByRole('button', { name: city === 'chicago' ? 'Chicago' : 'Eugene', exact: true }).click();
    assert.equal(await form.locator('[name="city"]').inputValue(), city === 'chicago' ? 'Chicago' : 'Eugene');
    assert.equal(await form.locator('[name="name"]').inputValue(), 'Owner preview');
    assert.equal(await form.locator('[name="details"]').inputValue(), 'Local browser test. Do not submit live.');
    assert.equal(await page.locator('[data-activity]').count(), 10);
    while (await page.getByRole('button', { name: 'Show me more', exact: true }).count()) {
      const button = page.getByRole('button', { name: 'Show me more', exact: true });
      await button.scrollIntoViewIfNeeded();
      await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
      const before = await page.evaluate(() => window.scrollY);
      const count = await page.locator('[data-activity]').count();
      await button.click();
      await page.waitForFunction(expectedCount => document.querySelectorAll('[data-activity]').length === expectedCount, Math.min(count + 10, expected(city).length));
      const after = await page.evaluate(() => window.scrollY);
      assert.ok(Math.abs(after - before) < 3, `No scroll jump: ${before} -> ${after}`);
      assert.equal(await page.locator('form[name="private-party"]').count(), 1);
      assert.equal(await form.locator('[name="name"]').inputValue(), 'Owner preview');
    }
    const rendered = await page.locator('[data-activity]').evaluateAll(cards => cards.map(card => ({ key: card.dataset.activity, href: card.querySelector('a').href, image: card.querySelector('img')?.getAttribute('alt') })));
    assert.equal(new Set(rendered.map(card => card.key)).size, rendered.length);
    assert.deepEqual(rendered.map(card => card.key), expected(city).map(activity => activity.key));
    for (const card of rendered) assert.equal(card.href, manifest.find(activity => activity.key === card.key).bookingUrl);
    results.push({ check: 'all batches and city switching', city, cards: rendered.length, passed: true });
  }
  await page.getByRole('button', { name: 'Eugene', exact: true }).click();
  await page.goto(root, { waitUntil: 'networkidle' });
  assert.equal(await page.getByRole('button', { name: 'Eugene', exact: true }).getAttribute('aria-pressed'), 'true');
  await ready(page, 'chicago');
  assert.equal(await page.getByRole('button', { name: 'Chicago', exact: true }).getAttribute('aria-pressed'), 'true');
  await page.locator('summary[aria-label="Open navigation menu"]').click();
  await page.getByRole('button', { name: 'Open studio help, the CCF AI assistant' }).click();
  await page.getByRole('dialog', { name: 'Studio help — CCF AI assistant' }).waitFor();
  assert.equal(await page.locator('summary[aria-label="Open navigation menu"]').evaluate(element => element.parentElement.open), false);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog', { name: 'Studio help — CCF AI assistant' }).count(), 0);
  assert.equal(await page.locator('summary[aria-label="Open navigation menu"]').evaluate(element => element.parentElement.open), true);
  await page.locator('summary[aria-label="Open navigation menu"]').click();
  results.push({ check: 'city preference, URL precedence, and existing chat', passed: true });
  await ready(page, 'eugene');
  await page.evaluate(() => localStorage.setItem('preferredCity', 'chicago'));
  let chatCity;
  await context.route('**/api/ask-ccf/chat', async route => {
    chatCity = route.request().postDataJSON().city;
    await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Isolated chat test' }) });
  });
  await page.locator('summary[aria-label="Open navigation menu"]').click();
  await page.getByRole('button', { name: 'Open studio help, the CCF AI assistant' }).click();
  const chat = page.getByRole('dialog', { name: 'Studio help — CCF AI assistant' });
  await chat.locator('textarea').fill('Show me a pottery class.');
  await Promise.all([page.waitForResponse('**/api/ask-ccf/chat'), chat.locator('button[type="submit"]').click()]);
  assert.equal(chatCity, 'eugene');
  results.push({ check: 'chat uses explicit URL city ahead of a stale saved preference; mocked request only', passed: true });
  await context.close();

  for (const failure of ['outage','empty','missing-image','missing-url','slow-switch'].filter(name => !results.some(result => result.check === name && result.passed))) {
    let requests = 0;
    const altered = structuredClone(liveData);
    if (failure === 'empty') altered.activities = altered.activities.map(activity => ({ ...activity, nextAvailability: null, availabilityState: 'empty-window' }));
    if (failure === 'missing-url') altered.activities.find(activity => activity.appointmentTypeId === 95588506).bookingUrl = null;
    const context = await contextFor({ width: 390, height: 650 }, async (route, url) => {
      if (failure === 'missing-image' && url.pathname === '/.netlify/images' && url.searchParams.get('url') === expected('chicago')[0].image.path) { await route.abort(); return true; }
      if (url.pathname === '/api/homepage') {
        requests++;
        if (failure === 'outage') await route.fulfill({ status: 503, body: 'Mock outage' });
        else {
          if (failure === 'slow-switch') await new Promise(resolve => setTimeout(resolve, 2000));
          await route.fulfill({ contentType: 'application/json', body: JSON.stringify(altered) });
        }
        return true;
      }
      return false;
    });
    const page = await context.newPage();
    await page.goto(`${root}/?location=chicago`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.locator('[data-activity]').first().waitFor();
    if (failure === 'slow-switch') {
      await page.getByRole('button', { name: 'Eugene', exact: true }).click();
      await page.getByRole('button', { name: 'Show me more', exact: true }).click();
    }
    await page.waitForTimeout(2500);
    if (failure === 'outage') {
      assert.match(await page.locator('[data-activity]').first().innerText(), /See price at checkout[\s\S]*View upcoming dates/);
      assert.equal(await page.locator('[data-activity]').first().locator('a').getAttribute('href'), expected('chicago')[0].bookingUrl);
    }
    if (failure === 'empty') {
      assert.match(await page.locator('[data-activity]').first().innerText(), /View upcoming dates/);
      assert.ok(!/sold out|No upcoming dates/i.test(await page.locator('#classes').innerText()));
    }
    if (failure === 'missing-image') {
      assert.match(await page.locator('[data-activity]').first().innerText(), /photograph is temporarily unavailable/);
      assert.equal(await page.locator('[data-activity]').first().locator('a').getAttribute('href'), expected('chicago')[0].bookingUrl);
    }
    if (failure === 'missing-url') assert.equal(await page.locator('[data-appointment-id="95588506"]').count(), 0);
    if (failure === 'slow-switch') {
      assert.equal(await page.locator('[data-activity]').first().getAttribute('data-activity'), 'eugene-cup-creations');
      assert.equal(await page.locator('[data-activity]').first().locator('a').getAttribute('href'), expected('eugene')[0].bookingUrl);
      assert.equal(await page.locator('[data-activity]').count(), expected('eugene').length);
    }
    assert.ok(requests >= 1 && requests <= 2, 'At most two development Strict Mode requests, never one per card');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    results.push({ check: failure, passed: true });
    console.log(`PASS ${failure}`);
    await context.close();
  }

  const formContext = await contextFor({ width: 390, height: 650 });
  const formPage = await formContext.newPage();
  let submissions = [];
  let succeed = false;
  await formContext.route('**/netlify-forms.html', async route => {
    if (route.request().method() !== 'POST') return route.continue();
    submissions.push(Object.fromEntries(new URLSearchParams(route.request().postData())));
    return route.fulfill({ status: succeed ? 200 : 503, body: 'Isolated form test' });
  });
  await ready(formPage, 'eugene');
  const testForm = formPage.locator('#private-party form');
  const submit = testForm.getByRole('button', { name: 'Request My Private Event Quote' });
  await submit.click();
  assert.equal(submissions.length, 0);
  assert.equal(await testForm.locator('[name="name"]').evaluate(input => input.validity.valueMissing), true);
  await testForm.locator('[name="name"]').fill('Owner preview');
  await testForm.locator('[name="email"]').fill('invalid-email');
  await submit.click();
  assert.equal(submissions.length, 0);
  await testForm.locator('[name="email"]').fill('owner-preview@example.invalid');
  await testForm.locator('[name="groupSize"]').fill('12');
  await testForm.locator('[name="occasion"]').fill('Isolated browser test');
  await submit.click();
  await testForm.getByRole('alert').waitFor();
  assert.equal(submissions.length, 1);
  assert.equal(submissions[0].city, 'Eugene');
  assert.equal(submissions[0]['form-name'], 'private-party');
  assert.equal(submissions[0]['bot-field'], '');
  assert.equal(await testForm.locator('[name="name"]').inputValue(), 'Owner preview');
  succeed = true;
  await submit.click();
  await formPage.waitForURL('**/thanks/private-party', { timeout: 30000 });
  assert.equal(submissions.length, 2);
  results.push({ check: 'isolated form validation, error, retry, honeypot, selected city, success redirect', passed: true });
  await formContext.close();

  const evidenceContext = await contextFor({ width: 390, height: 650 });
  const evidencePage = await evidenceContext.newPage();
  await ready(evidencePage, 'chicago');
  const openingBottom = await evidencePage.locator('#private-party').evaluate(element => element.getBoundingClientRect().bottom + window.scrollY);
  await evidencePage.setViewportSize({ width: 390, height: Math.ceil(openingBottom + 16) });
  for (const image of await evidencePage.locator('[data-activity] img').all()) {
    if ((await image.boundingBox()).y < openingBottom) await image.evaluate(element => element.decode());
  }
  await evidencePage.screenshot({ path: `${output}/opening-and-private-party.png` });
  await evidenceContext.close();

  const zoomContext = await contextFor({ width: 195, height: 325 });
  const zoomPage = await zoomContext.newPage();
  await ready(zoomPage, 'chicago');
  assert.equal(await zoomPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await zoomPage.screenshot({ path: `${output}/200-percent-reflow.png`, fullPage: true });
  results.push({ check: '200 percent zoom equivalent, 195 CSS pixel reflow', passed: true });
  await zoomContext.close();
  const textContext = await contextFor({ width: 390, height: 650 });
  const textPage = await textContext.newPage();
  await ready(textPage, 'chicago');
  await textPage.evaluate(() => {
    const sizes = [...document.querySelectorAll('body *')].filter(element => element instanceof HTMLElement).map(element => ({ element, font: parseFloat(getComputedStyle(element).fontSize), line: parseFloat(getComputedStyle(element).lineHeight) }));
    for (const { element, font, line } of sizes) {
      element.style.fontSize = `${font * 2}px`;
      if (Number.isFinite(line)) element.style.lineHeight = `${line * 2}px`;
    }
  });
  assert.equal(await textPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.ok((await textPage.locator('[data-activity]').first().boundingBox()).height > 650, 'Large text can increase card height');
  await textPage.screenshot({ path: `${output}/200-percent-text.png`, fullPage: true });
  results.push({ check: '200 percent text enlargement: readable reflow and natural card growth', passed: true });
  await textContext.close();
  const atomicContext = await contextFor({ width: 390, height: 650 }, async (route, url) => {
    if (url.pathname !== '/api/homepage') return false;
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(liveData) });
    return true;
  });
  const atomicPage = await atomicContext.newPage();
  await ready(atomicPage, 'chicago');
  for (const city of ['chicago', 'eugene', 'chicago']) {
    await atomicPage.getByRole('button', { name: city === 'chicago' ? 'Chicago' : 'Eugene', exact: true }).click();
    while (await atomicPage.getByRole('button', { name: 'Show me more', exact: true }).count()) await atomicPage.getByRole('button', { name: 'Show me more', exact: true }).click();
    for (const activity of expected(city)) {
      const card = atomicPage.locator(`[data-activity="${activity.key}"]`);
      const text = await card.innerText();
      assert.equal(await card.getAttribute('data-appointment-id'), String(activity.appointmentTypeId));
      assert.equal(await card.locator('a').getAttribute('href'), activity.bookingUrl);
      assert.equal(new URL(await card.locator('img').getAttribute('src'), root).searchParams.get('url'), activity.image.path);
      if (activity.currentPrice !== null) assert.ok(text.includes(`$${activity.currentPrice} ${activity.priceUnit}`), activity.key + ' price and ticket unit');
      if (activity.nextAvailability && new Date(activity.nextAvailability) > new Date()) {
        const zone = activity.city === 'eugene' ? 'America/Los_Angeles' : 'America/Chicago';
        const date = new Date(activity.nextAvailability);
        const time = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(date);
        assert.ok(text.includes(time), activity.key + ' timezone-aware next time');
      }
    }
    assert.match(await atomicPage.getByRole('region', { name: 'Selected studio' }).innerText(), city === 'chicago' ? /1142 W. 18th Street/ : /3295 Cross Street/);
    assert.equal(await atomicPage.locator('#private-party [name="city"]').inputValue(), city === 'chicago' ? 'Chicago' : 'Eugene');
  }
  results.push({ check: 'every card: image, price, ticket unit, local time, appointment, booking URL and studio update atomically across both city directions', passed: true });
  await atomicContext.close();
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  await browser.close();
  console.log(`PASS ${results.length} browser test groups`);
})().catch(error => {
  fs.writeFileSync(resultsPath, JSON.stringify({ completed: results, failure: error.message }, null, 2));
  console.error(error.stack);
  process.exit(1);
});
