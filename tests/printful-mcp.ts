import assert from 'node:assert/strict';
import {runPrintfulTool} from '../lib/printful-mcp';
const requests: {url:URL, init?:RequestInit}[] = [];
process.env.PRINTFUL_API_TOKEN = 'test-secret';
globalThis.fetch = (async (url:any, init?:RequestInit) => {requests.push({url:new URL(url),init});return Response.json({code:200,result:[]});}) as typeof fetch;
async function main() {
 await runPrintfulTool('printful_list_products',{store_id:42,limit:10,offset:20});
 assert.equal(requests[0].url.pathname,'/store/products');
 assert.equal(requests[0].url.searchParams.get('offset'),'20');
 assert.equal((requests[0].init?.headers as any)['X-PF-Store-Id'],'42');
 await runPrintfulTool('printful_create_draft_order',{payload:{recipient:{name:'Test'},items:[]}});
 assert.equal(requests[1].url.searchParams.get('confirm'),'0');
 assert.equal(requests[1].init?.method,'POST');
 for (const args of [{id:1},{id:1,approved:false},{id:'../stores',approved:true}]) await assert.rejects(()=>runPrintfulTool('printful_confirm_order',args));
 await assert.rejects(()=>runPrintfulTool('printful_create_draft_order',{payload:{confirm:true}}));
 assert.equal(requests.length,2);
 await runPrintfulTool('printful_confirm_order',{id:12,approved:true});
 assert.equal(requests[2].url.pathname,'/orders/12/confirm');
 assert.equal(requests[2].init?.method,'POST');
 console.log('Printful routing and fulfillment safeguards passed');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
