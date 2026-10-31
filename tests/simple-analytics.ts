import assert from "node:assert/strict";
import { publicPath, simpleMetadata, trackSimpleEvent, flushSimpleEvents, resetSimpleAnalytics, trackSimplePage } from "../lib/simpleAnalytics";

const calls: any[] = [];
const views: any[] = [];
const win = { location: new URL("https://colorcocktailfactory.com/?email=secret@example.com"),
  ccfPrivacyPreferences: { analytics: false, marketing: false },
  sa_event: undefined as any, sa_pageview: (path: string, meta: unknown) => views.push({path, meta}) };
Object.assign(globalThis, { window: win, document: { referrer: "" }, localStorage: { getItem: () => "chicago" } });
assert.equal(trackSimpleEvent("select_item", {class_name:"Pottery"}), false);
win.ccfPrivacyPreferences.analytics = true;
trackSimpleEvent("select_item", {class_name:"Pottery", email:"secret@example.com", message:"private message", link_url:"https://example.com/?token=secret"});
win.sa_event = (name: string, meta: unknown) => calls.push({name, meta});
flushSimpleEvents();
assert.equal(calls.length, 1);
assert.equal(calls[0].name, "class_card_click");
assert.deepEqual(calls[0].meta, {page_path:"/",city:"chicago",class_name:"Pottery"});
assert.equal(trackSimpleEvent("arbitrary_private_event", {}), false);
assert.equal(publicPath("/activities/bonsai?email=secret@example.com#token"), "/activities/bonsai");
assert.equal(publicPath(""), "", "A missing referrer is not the homepage");
for (const path of ["/admin", "/api/booking", "/teach/instructors/dashboard", "/person%40example.com", "https://example.com/path"])
  assert.equal(publicPath(path), "");
assert.deepEqual(simpleMetadata({cta_text:"email secret@example.com",button_name:"Call 555-123-4567",name:"Customer",phone:"5551234567",items:[{}],card_position:3}), {card_position:3});
trackSimplePage(); trackSimplePage();
assert.equal(views.length, 1, "Page views deduplicate");
win.location = new URL("https://colorcocktailfactory.com/activities/bonsai?customer=secret");
trackSimplePage();
assert.equal(calls.filter(c=>c.name==="homepage_next_page").length, 1);
assert.equal(views[1].meta.previous_page, "/");
assert.equal(views[1].meta.entry_page, "/");
win.location = new URL("https://colorcocktailfactory.com/blog"); trackSimplePage();
assert.equal(views[2].meta.previous_page,"/activities/bonsai");
assert.equal(views[2].meta.after_homepage,true);
win.ccfPrivacyPreferences.analytics = false; resetSimpleAnalytics();
const before = calls.length; trackSimpleEvent("button_click", {button_name:"Book"}); flushSimpleEvents();
assert.equal(calls.length,before);
win.ccfPrivacyPreferences.analytics = true; win.sa_event = undefined;
trackSimpleEvent("button_click", {button_name:"Queued"}); resetSimpleAnalytics();
win.sa_event = (name: string) => calls.push({name}); flushSimpleEvents(); assert.equal(calls.length,before,"Revocation clears queued events");
win.location = new URL("https://preview.example.test/");
assert.equal(trackSimpleEvent("button_click", {button_name:"Book"}), false);
assert.doesNotMatch(JSON.stringify({calls,views}), /secret|private message|customer=/);
console.log("Simple Analytics metadata, event queue, consent, production gating and homepage paths passed.");
