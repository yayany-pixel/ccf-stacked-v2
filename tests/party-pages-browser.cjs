const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.CCF_BASE_URL || 'http://127.0.0.1:3000';

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const submissions = [], gaEvents = [];
    let localGaEnvironmentFixtures = 0;
    await context.exposeBinding('__capturePartyGtag', (_source, args) => gaEvents.push(args));
    await context.addInitScript(() => {
      window.ccfPrivacyPreferences = { analytics: true, marketing: false };
      window.gtag = (...args) => window.__capturePartyGtag(args);
    });
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin !== new URL(base).origin) return route.fulfill({ body: '' });
      if (url.pathname === '/api/privacy') return route.fulfill({ json: { preferences: { analytics: true, marketing: false } } });
      if (url.pathname.startsWith('/api/')) return route.fulfill({ status: 503, body: 'Isolated test' });
      if (url.pathname === '/netlify-forms.html' && request.method() === 'POST') {
        submissions.push(new URLSearchParams(request.postData()));
        return route.fulfill({ status: 200, body: 'Local test only' });
      }
      if (request.method() === 'POST') return route.fulfill({ status: 503, body: 'Isolated test' });
      if (url.pathname.startsWith('/_next/static/') && url.pathname.endsWith('.js')) {
        const response = await route.fetch();
        const original = await response.text();
        // Credential-free builds retain this environment lookup. Supply only the
        // public test ID in intercepted responses; production tracking stays untouched.
        const body = original.replace(/\b[A-Za-z_$][\w$]*\.env\.NEXT_PUBLIC_GA_ID_1\b/g, () => {
          localGaEnvironmentFixtures += 1;
          return '"G-PARTY-LOCAL-TEST"';
        });
        return route.fulfill({ response, body });
      }
      return route.continue();
    });
    let page = await context.newPage();
    async function attachConsentedLeadSpy() {
      await page.waitForFunction(() => window.ccfPrivacyPreferences?.analytics === true);
      // The document's inline gtag bootstrap replaces an init-script spy.
      // Reattach after initialization, before exercising the real form handler.
      await page.evaluate(() => {
        window.gtag = (...args) => window.__capturePartyGtag(args);
      });
    }
    for (const route of ['/private-events', '/birthday-parties', '/team-building', '/bachelorette-parties', '/group-pricing']) {
      await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForFunction(() => {
        const image = document.querySelector('main img');
        return image && getComputedStyle(image.parentElement).position === 'relative';
      });
      const audit = await page.evaluate(() => {
        const main = document.querySelector('main');
        const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].map(script => JSON.parse(script.textContent));
        const faq = schemas.find(schema => schema['@type'] === 'FAQPage');
        const normalize = text => text.replace(/\s+/g, ' ').trim();
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          heroes: main.querySelectorAll('img[fetchpriority="high"]').length,
          styled: getComputedStyle(main.querySelector('img').parentElement).position === 'relative',
          photos: [...main.querySelectorAll('img')].map(image => ({ alt: image.alt, sizes: image.sizes, src: image.getAttribute('src') })),
          formTop: main.querySelector('form')?.getBoundingClientRect().top,
          faq: faq?.mainEntity.map(question => {
            const heading = [...main.querySelectorAll('h3, summary')].find(element => normalize(element.textContent).includes(question.name));
            const container = heading?.closest('details') || heading?.parentElement;
            return { expected: question.acceptedAnswer.text, actual: container?.querySelector('p')?.textContent };
          }),
        };
      });
      assert.equal(audit.overflow, false, `${route}: mobile overflow`);
      assert.equal(audit.styled, true, `${route}: utility stylesheet loaded`);
      assert.equal(audit.heroes, 1, `${route}: one priority hero`);
      assert.ok(audit.photos.every(photo => photo.alt && photo.sizes && decodeURIComponent(photo.src).includes('approved-')), route);
      if (['/private-events', '/birthday-parties'].includes(route)) assert.ok(audit.formTop < 844 * 2, `${route}: inquiry in first two screens (${audit.formTop})`);
      if (route === '/private-events') assert.equal(audit.photos.length, 9);
      for (const answer of audit.faq || []) assert.equal(answer.actual?.replace(/\s+/g, ' ').trim(), answer.expected.replace(/\s+/g, ' ').trim(), `${route}: visible FAQ/schema parity`);
      if (process.env.CCF_PARTY_SCREENSHOTS && ['/private-events', '/birthday-parties'].includes(route)) {
        fs.mkdirSync(process.env.CCF_PARTY_SCREENSHOTS, { recursive: true });
        await page.screenshot({ path: `${process.env.CCF_PARTY_SCREENSHOTS}/${route.slice(1)}-mobile-after.png` });
      }
      console.log(`Party browser audit passed: ${route}, mobile layout, approved photos, hero, FAQ parity${audit.formTop ? `, form top ${Math.round(audit.formTop)}px` : ''}.`);
    }

    await page.close();
    page = await context.newPage();
    await page.goto(base + '/activities?utm_source=google&utm_medium=cpc&utm_campaign=first-party', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => sessionStorage.getItem('ccf-party-first-touch'));
    await page.goto(base + '/private-events?city=eugene&occasion=Bachelorette&project=Turkish%20lamp&utm_source=later#inquiry-form', { waitUntil: 'domcontentloaded' });
    const form = page.locator('form[name="private-party"]');
    await page.waitForFunction(() => document.querySelector('[name="occasion"]').value === 'Bachelorette');
    await attachConsentedLeadSpy();
    assert.equal(await form.locator('[name="city"]').inputValue(), 'Eugene');
    await form.locator('[name="name"]').fill('TEST – ignore');
    await form.locator('[name="email"]').fill('local@example.invalid');
    await form.locator('[name="groupSize"]').fill('10');
    assert.equal(await form.locator('[name="phone"]').evaluate(element => Boolean(element.closest('details'))), false);
    await form.locator('[name="phone"]').fill('555-0100');
    await form.locator('summary').click();
    assert.equal(await form.locator('[name="preferredProject"]').inputValue(), 'Turkish lamp');
    await form.locator('[name="alternateDate"]').fill('2027-01-03');
    await form.locator('[name="preferredTime"]').fill('18:30');
    await form.locator('[name="budget"]').selectOption('$45–60');
    for (const name of ['date', 'alternateDate', 'preferredTime']) {
      assert.ok(await form.locator(`[name="${name}"]`).evaluate(element => element.getBoundingClientRect().right <= innerWidth), `${name}: fits mobile width`);
    }
    await form.locator('[type="submit"]').click();
    await page.waitForURL('**/thanks/private-party');
    const adult = submissions.at(-1);
    for (const [key, value] of Object.entries({ city: 'Eugene', occasion: 'Bachelorette', preferredProject: 'Turkish lamp', phone: '555-0100', alternateDate: '2027-01-03', preferredTime: '18:30', budget: '$45–60', source: '/private-events?utm_source=google&utm_medium=cpc', utm_source: 'google', utm_medium: 'cpc', campaign: 'first-party' })) assert.equal(adult.get(key), value, key);
    await page.goto(base + '/birthday-parties?utm_source=later&utm_campaign=second-party', { waitUntil: 'domcontentloaded' });
    const birthday = page.locator('form[name="birthday-party"]');
    await attachConsentedLeadSpy();
    for (const [name, value] of Object.entries({ yourName: 'TEST – ignore', email: 'local@example.invalid', preferredDate: '2027-01-03' })) await birthday.locator(`[name="${name}"]`).fill(value);
    assert.equal(await birthday.locator('[name="phone"]').evaluate(element => Boolean(element.closest('details'))), false);
    await birthday.locator('[name="city"]').selectOption('Chicago');
    await birthday.locator('[name="guestCount"]').selectOption('6-10');
    assert.ok(await birthday.locator('[name="preferredDate"]').evaluate(element => element.getBoundingClientRect().right <= innerWidth));
    await birthday.locator('[type="submit"]').click();
    await page.getByText('Your inquiry is in!').waitFor();
    const birthdayData = submissions.at(-1);
    assert.equal(birthdayData.get('source'), '/birthday-parties?utm_source=google&utm_medium=cpc');
    assert.equal(birthdayData.get('utm_source'), 'google');
    assert.equal(birthdayData.get('utm_medium'), 'cpc');
    assert.equal(birthdayData.get('campaign'), 'first-party');
    await page.goto(base + '/chicago/kids-birthday-parties?utm_source=later', { waitUntil: 'domcontentloaded' });
    const kids = page.locator('form[name="private-party"]');
    await attachConsentedLeadSpy();
    for (const [name, value] of Object.entries({ name: 'TEST – ignore', email: 'local@example.invalid', date: '2027-01-03', groupSize: '10', adultCount: '2', ageRange: '9–13' })) await kids.locator(`[name="${name}"]`).fill(value);
    await kids.locator('[name="preferredProject"]').selectOption('Kids pottery wheel');
    await kids.locator('[name="budget"]').selectOption({ index: 1 });
    await kids.locator('[type="submit"]').click();
    await page.getByText('Thanks for your birthday request.').waitFor();
    const kidsData = submissions.at(-1);
    assert.equal(kidsData.get('source'), '/chicago/kids-birthday-parties?utm_source=google&utm_medium=cpc');
    assert.equal(kidsData.get('campaign'), 'first-party');
    for (const type of ['private_party', 'birthday', 'kids_birthday']) {
      assert.equal(gaEvents.filter(args => args[0] === 'event' && args[1] === 'private_party_lead_submit' && args[2].lead_type === type).length, 1, `${type}: one local GA4 gtag spy event (environment fixtures: ${localGaEnvironmentFixtures}; captured: ${JSON.stringify(gaEvents.map(args => [args[0], args[1], args[2]?.lead_type]))})`);
    }
    for (const width of [320, 375, 390, 430, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 667 });
      for (const route of ['/private-events', '/birthday-parties', '/team-building', '/bachelorette-parties', '/group-pricing']) {
        await page.goto(base + route, { waitUntil: 'domcontentloaded' });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route}: ${width}px overflow`);
        if (!['/private-events', '/birthday-parties'].includes(route)) continue;
        const form = page.locator('main form').first();
        if (width === 375) assert.ok((await form.boundingBox()).y <= 2 * 667, `${route}: inquiry in two 667px screens`);
        await form.locator('summary').click();
        const inputs = await form.locator('input[type="date"], input[type="time"]').evaluateAll(elements => elements.map(element => ({ name: element.name, left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right })));
        for (const input of inputs) assert.ok(input.left >= 0 && input.right <= width, `${route} ${input.name} fits at ${width}px`);
      }
    }
    console.log(`Party browser transport passed: landing-page UTMs, current-page source for adult/birthday/kids, city/occasion/project prefill, phone in core form, mobile dates at 320/375/390/430/768/1280/1440, and one private_party_lead_submit per form via consented local GA4 gtag spy${localGaEnvironmentFixtures ? ' with a local public-ID environment fixture' : ''}. All POSTs intercepted locally; no external verification.`);
    await context.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
