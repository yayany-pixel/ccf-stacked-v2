import assert from "node:assert/strict";
import { runEventbriteTool, eventbriteTools } from "../lib/eventbrite-mcp";
const calls: any[] = [];
const realFetch = global.fetch;
process.env.EVENTBRITE_PRIVATE_TOKEN = 'test-only-not-a-real-credential';
process.env.EVENTBRITE_ORGANIZATION_ID = 'test-org';
const deps = { acuityGet: async () => [] };
function mock(pages: number, failAt?: number) {
  calls.length = 0;
  global.fetch = async (url, options) => {
    calls.push({url: new URL(String(url)), options});
    if (calls.length === failAt) return new Response('{}', {status: 503});
    const n = calls.length;
    return new Response(JSON.stringify({
      events: [{id: String(n)}],
      pagination: {page_number: n, page_count: pages, has_more_items: n < pages, continuation: 'cursor-'+(n+1)}
    }), {status: 200});
  };
}
(async () => {
  mock(42);
  let r: any = await runEventbriteTool('eventbrite_list_events', {allPages:true,status:'all',timeFilter:'current_future',pageSize:50},deps);
  assert.equal(r.data.events.length,42);
  assert.equal(r.data.retrieval.completeListing,true);
  assert.equal(r.data.listingMode,'occurrences');
  for (const c of calls) {
    assert.equal(c.options.method,'GET');
    assert.equal(c.url.searchParams.get('status'),'all');
    assert.equal(c.url.searchParams.get('time_filter'),'current_future');
    assert.equal(c.url.searchParams.get('show_series_parent'),'false');
    assert.equal(c.url.searchParams.get('page_size'),'50');
  }
  assert.equal(calls[1].url.searchParams.get('continuation'),'cursor-2');
  assert.equal(calls[1].url.searchParams.has('page'),false);
  mock(42);
  r = await runEventbriteTool('eventbrite_list_events',{allPages:true,maxPages:2},deps);
  assert.equal(calls.length,2);
  assert.equal(r.data.retrieval.completeListing,false);
  assert.equal(r.data.retrieval.limitReached,true);
  mock(1);
  r = await runEventbriteTool('eventbrite_list_events',{showSeriesParent:true},deps);
  assert.equal(r.data.listingMode,'series_parents');
  assert.equal(calls[0].url.searchParams.get('show_series_parent'),'true');
  mock(1);
  r = await runEventbriteTool('eventbrite_list_events',{continuation:'previous-cursor'},deps);
  assert.equal(r.data.retrieval.startedAtBeginning,false);
  assert.equal(r.data.retrieval.completeListing,false);
  for (const args of [{page:0},{pageSize:0},{maxPages:0},{maxPages:1001},{page:2,continuation:'abc'},{allPages:'yes'}]) {
    mock(1);
    await assert.rejects(() => runEventbriteTool('eventbrite_list_events',args,deps));
    assert.equal(calls.length,0);
  }
  mock(42,2);
  await assert.rejects(() => runEventbriteTool('eventbrite_list_events',{allPages:true},deps), /503/);
  const sync = {minDate:'2026-09-28',maxDate:'2027-09-27',organizerID:'o',chicagoVenueID:'c',eugeneVenueID:'e'};
  mock(25);
  r = await runEventbriteTool('eventbrite_sync_acuity_classes',sync,deps);
  assert.equal(calls.length,25);
  assert.equal(r.data.created.length,0);
  assert.equal(calls.every(c => c.options.method === 'GET'),true);
  mock(1001);
  await assert.rejects(() => runEventbriteTool('eventbrite_sync_acuity_classes',sync,deps), /duplicate inventory is incomplete/);
  assert.equal(calls.length,1000);
  assert.equal(calls.every(c => c.options.method === 'GET'),true);
  const schema: any = eventbriteTools.find(t => t.name === 'eventbrite_list_events')!.inputSchema.properties;
  assert.equal(schema.allPages.default,false);
  assert.ok(schema.continuation && schema.page && schema.showSeriesParent);
  console.log('PASS: 14 connector integration scenarios (all network requests mocked)');
})().catch(e=>{ console.error(e); process.exitCode=1; }).finally(()=>{ global.fetch=realFetch; });
