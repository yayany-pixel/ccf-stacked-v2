const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
const source = fs.readFileSync(require('node:path').join(__dirname, '../netlify/functions/daily-digest.mts'), 'utf8');
const code = stripTypeScriptTypes(source.replace(/^import[^\n]*\n/gm, '')
  .replace('export default async function handler', 'async function handler')
  .replace('export const config', 'const config')) + '\nglobalThis.test={handler,config};';

async function run(time, fail = false) {
  const sent = []; let reads = 0;
  const Clock = class extends Date { constructor(...args) { super(...(args.length ? args : [time])); } };
  const scope = vm.createContext({ Date: Clock, Intl, Response, process: { env: {} },
    console: { log() {}, error() {} }, DIGEST_SEND_TIMES: ['08:00','13:30','17:00'],
    getAcuityDigestItems: async () => { reads++; if(fail) throw Error('mock outage'); return [{id:'booking'}]; },
    getEventbriteDigestItems: async () => { reads++; return []; },
    formatDigestSubject: () => 'mock subject', formatDigestBody: () => 'mock body',
    sendEmail: async message => { sent.push(message); },
  });
  vm.runInContext(code, scope);
  const response = await scope.test.handler();
  assert(response instanceof Response);
  assert.equal(scope.test.config.schedule, '*/15 * * * *');
  return { response, body: await response.json(), reads, sent };
}

(async () => {
  const skipped = await run('2026-11-13T14:01:00Z');
  assert.equal(skipped.response.status,200); assert.equal(skipped.reads,0); assert.equal(skipped.sent.length,0);
  const scheduled = await run('2026-11-13T14:00:00Z');
  assert.equal(scheduled.response.status,200); assert.equal(scheduled.reads,2); assert.equal(scheduled.sent.length,1);
  assert.equal(scheduled.sent[0].to,'support@colorcocktailfactory.com'); assert.equal(scheduled.body.itemCount,1);
  const failure = await run('2026-11-13T14:00:00Z',true);
  assert.equal(failure.response.status,500); assert.equal(failure.sent.length,0);
  console.log('PASS: modern scheduled handler preserves schedule, local-time gate, recipient, success and failure responses; all booking reads and email delivery mocked.');
})().catch(error=>{console.error(error);process.exitCode=1;});
