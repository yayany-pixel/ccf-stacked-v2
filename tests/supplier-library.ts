import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { GET } from '../app/team/suppliers/route';
import { supplierAccessAllowed, supplierJson } from '../lib/supplier-library';

const password = 'test-only-credential-not-used-in-production';
const hash = createHash('sha256').update(password).digest('hex');
const auth = 'Basic ' + Buffer.from('ccf:' + password).toString('base64');
const previous = process.env.CCF_SUPPLIER_PASSWORD_SHA256;
async function main() {
  try {
    delete process.env.CCF_SUPPLIER_PASSWORD_SHA256;
    assert.equal((await GET(new Request('https://example.com/team/suppliers'))).status, 503);
    process.env.CCF_SUPPLIER_PASSWORD_SHA256 = hash;
    assert.equal(supplierAccessAllowed(auth, hash), true);
    assert.equal(supplierAccessAllowed(auth, ''), false);
    assert.equal(supplierAccessAllowed('Basic ' + Buffer.from('other:' + password).toString('base64'), hash), false);
    for (const suffix of ['', '?format=json', '?format=csv', '?_rsc=testing']) {
      for (const authorization of ['', 'Basic !!!', 'Basic ' + Buffer.from('ccf:wrong').toString('base64')]) {
        const response = await GET(new Request('https://example.com/team/suppliers' + suffix, {headers:{authorization,'x-middleware-subrequest':'middleware:middleware:middleware'}}));
        assert.equal(response.status,401);
        assert.match(response.headers.get('cache-control')!, /no-store/);
        assert.ok(response.headers.get('www-authenticate'));
        assert.doesNotMatch(await response.text(), /Buy4Store|Wissmach|supplier-directory/);
      }
    }
    for (const format of ['', '?format=json', '?format=csv']) {
      const response = await GET(new Request('https://example.com/team/suppliers' + format,{headers:{authorization:auth}}));
      assert.equal(response.status,200);
      assert.match(response.headers.get('cache-control')!,/private, no-store/);
      assert.match(response.headers.get('x-robots-tag')!,/noindex/);
      assert.match(await response.text(), /Buy4Store/);
    }
    const data=JSON.parse(supplierJson());
    assert.equal(new Set(data.entries.map((e:{id:string})=>e.id)).size,data.entries.length);
    for(const e of data.entries) {
      assert.ok(e.price && e.pack && e.checked && e.links.length);
      for(const url of e.links) assert.equal(new URL(url).protocol,'https:');
    }
    const dataKey = process.env.CCF_SUPPLIER_DATA_KEY;
    for (const invalidKey of [undefined, '0'.repeat(64)]) {
      if (invalidKey === undefined) delete process.env.CCF_SUPPLIER_DATA_KEY;
      else process.env.CCF_SUPPLIER_DATA_KEY = invalidKey;
      const failed = await GET(new Request('https://example.com/team/suppliers?format=json',{headers:{authorization:auth}}));
      assert.equal(failed.status,503);
      assert.doesNotMatch(await failed.text(), /Buy4Store|ciphertext|Error/);
    }
    process.env.CCF_SUPPLIER_DATA_KEY = dataKey;
    console.log(`Supplier access and export checks passed (${data.entries.length} resources).`);
  } finally {
    if(previous===undefined) delete process.env.CCF_SUPPLIER_PASSWORD_SHA256;
    else process.env.CCF_SUPPLIER_PASSWORD_SHA256=previous;
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
