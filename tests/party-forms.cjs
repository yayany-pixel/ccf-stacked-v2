const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const compile = file => ts.transpileModule(read(file), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText;

function attribution(window) {
  const exports = {};
  new Function('exports', 'window', compile('lib/partyFormAttribution.ts'))(exports, window);
  return exports;
}

const storage = new Map();
const window = { location: { pathname: '/team-building', search: '?utm_source=google&utm_medium=cpc&utm_campaign=team%20party' }, sessionStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) } };
const first = attribution(window);
assert.deepEqual(first.capturePartyAttribution(), { source: '/team-building?utm_source=google&utm_medium=cpc', utm_source: 'google', utm_medium: 'cpc', campaign: 'team party' });
window.location = { pathname: '/private-events', search: '?utm_source=second&utm_campaign=later' };
const nextPage = attribution(window);
const data = new URLSearchParams();
nextPage.appendPartyAttribution(data);
assert.equal(data.get('source'), '/private-events?utm_source=google&utm_medium=cpc');
assert.equal(data.get('utm_source'), 'google');
assert.equal(data.get('utm_medium'), 'cpc');
assert.equal(data.get('campaign'), 'team party');
const noStorage = attribution({ location: { pathname: '/birthday-parties', search: '' }, sessionStorage: { getItem() { throw Error('disabled'); }, setItem() { throw Error('disabled'); } } });
assert.deepEqual(noStorage.capturePartyAttribution(), { source: '/birthday-parties', utm_source: '', utm_medium: '', campaign: '' });
assert.equal(attribution(undefined).capturePartyAttribution().source, '');

async function adult({ ok = true, honeypot = '', variant = 'default' } = {}) {
  const events = [], posts = [];
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    useState: initial => [typeof initial === 'function' ? initial() : initial, () => {}],
    useEffect: () => {},
  };
  const deps = name => name === 'react' ? React : name === '@/lib/analytics'
    ? { trackPrivatePartyLead: (...args) => events.push(args), groupSizeRange: () => '6-10' }
    : name === '@/lib/partyFormAttribution' ? nextPage
    : { metaMatchContext: () => null, newMetaEventId: () => 'test-only-event' };
  const FormData = class extends Map { constructor() { super([['form-name', 'private-party'], ['bot-field', honeypot], ['phone', '555-0100'], ['alternateDate', '2027-01-03'], ['preferredTime', '18:30'], ['preferredProject', 'Candle making'], ['budget', '$45–60']]); } };
  const exports = {};
  new Function('require', 'exports', 'React', 'fetch', 'FormData', 'window', compile('components/PrivateEventFormCard.tsx'))(deps, exports, React, async (...args) => { posts.push(args); return { ok }; }, FormData, { location: { href: '' } });
  const tree = exports.default({ city: { label: 'Chicago' }, timeWindows: [], variant });
  const find = node => !node || typeof node !== 'object' ? undefined : node.type === 'form' ? node : (node.children || []).flat(Infinity).map(find).find(Boolean);
  await find(tree).props.onSubmit({ preventDefault() {}, currentTarget: {} });
  return { events, body: new URLSearchParams(posts[0][1].body) };
}

(async () => {
  const result = await adult();
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0][0].lead_type, 'private_party');
  assert.equal(result.body.get('phone'), '555-0100');
  assert.equal(result.body.get('alternateDate'), '2027-01-03');
  assert.equal(result.body.get('preferredTime'), '18:30');
  assert.equal(result.body.get('budget'), '$45–60');
  assert.equal(result.body.get('source'), '/private-events?utm_source=google&utm_medium=cpc');
  window.location = { pathname: '/chicago/kids', search: '?utm_source=later' };
  assert.equal(nextPage.capturePartyAttribution().source, '/chicago/kids?utm_source=google&utm_medium=cpc');
  window.location = { pathname: '/birthday-parties', search: '' };
  assert.equal(nextPage.capturePartyAttribution().source, '/birthday-parties?utm_source=google&utm_medium=cpc');
  assert.equal((await adult({ ok: false })).events.length, 0);
  assert.equal((await adult({ honeypot: 'bot' })).events.length, 0);
  assert.equal((await adult({ honeypot: 'bot' })).body.get('bot-field'), 'bot');
  assert.equal((await adult({ variant: 'homepage' })).events[0][0].placement, 'homepage');
  const registration = read('public/netlify-forms.html');
  for (const form of ['private-party', 'birthday-party', 'kids-class-interest']) {
    const markup = registration.match(new RegExp(`<form name="${form}"[\\s\\S]*?</form>`))[0];
    for (const field of ['source', 'campaign', 'utm_source', 'utm_medium', 'bot-field']) assert.ok(markup.includes(`name="${field}"`), `${form}: ${field}`);
  }
  console.log('Party form checks passed: first-touch persistence, denied storage, SSR, attribution transport, adult success/failure/spam, homepage variant, and Netlify registration. No external submissions.');
})().catch(error => { console.error(error); process.exitCode = 1; });
