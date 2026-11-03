const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const source = fs.readFileSync(require('node:path').join(__dirname, '../components/BirthdayFormCard.tsx'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText;

async function submit({ ok = true, honeypot = '' } = {}) {
  const events = [], posts = [], states = [];
  let stateIndex = 0;
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    useEffect: () => {},
    useState: (initial) => {
      const index = stateIndex++;
      states[index] = index === 0 ? { ...initial, city: 'Chicago', guestCount: '6-10', experience: 'Pottery Wheel Night' } : initial;
      return [states[index], value => { states[index] = value; }];
    },
  };
  const exports = {};
  const deps = name => name === 'react' ? React : name === '@/lib/analytics'
    ? { trackPrivatePartyLead: (...args) => events.push(args) }
    : name === '@/lib/partyFormAttribution' ? { capturePartyAttribution() {}, appendPartyAttribution(data) { data.set('source', '/birthday-parties?utm_source=facebook&utm_medium=paid_social'); data.set('campaign', 'birthday'); data.set('utm_source', 'facebook'); data.set('utm_medium', 'paid_social'); } }
    : { metaMatchContext: () => null, newMetaEventId: () => 'test-only-event' };
  const fetch = async (...args) => { posts.push(args); return { ok }; };
  const FormData = class { get() { return honeypot; } };
  new Function('require', 'exports', 'React', 'fetch', 'FormData', compiled)(deps, exports, React, fetch, FormData);
  const tree = exports.default({});
  assert.equal(tree.type, 'form');
  await tree.props.onSubmit({ preventDefault() {}, currentTarget: {} });
  return { events, posts, states };
}

(async () => {
  const success = await submit();
  assert.equal(success.events.length, 1, 'one successful birthday inquiry reaches the Google Ads party goal');
  assert.equal(success.events[0][0].lead_type, 'birthday');
  assert.equal(success.events[0][0].city, 'chicago');
  assert.equal(success.states[1], 'success');
  const body = new URLSearchParams(success.posts[0][1].body);
  assert.equal(body.get('source'), '/birthday-parties?utm_source=facebook&utm_medium=paid_social');
  assert.equal(body.get('campaign'), 'birthday');
  assert.equal(body.get('utm_source'), 'facebook');
  assert.equal(body.get('utm_medium'), 'paid_social');
  assert.equal((await submit({ ok: false })).events.length, 0, 'failed submissions do not count');
  const spam = await submit({ honeypot: 'bot' });
  assert.equal(spam.events.length, 0, 'honeypot submissions do not count');
  assert.equal(new URLSearchParams(spam.posts[0][1].body).get('bot-field'), 'bot', 'Netlify receives the spam signal');
  console.log('Birthday form checks passed: successful inquiry, failed request, honeypot suppression and transport. No live forms submitted.');
})().catch(error => { console.error(error); process.exitCode = 1; });
