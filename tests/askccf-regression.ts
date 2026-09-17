import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { derivePricing, normalize, searchClasses, toCardShape, matchesActivity, matchingTimes, requestedActivity } from "../lib/askccf/catalog";
import { correctScheduleWeekdays, formatClassTime, validDate } from "../lib/askccf/schedule";
import { MAX_BODY_BYTES, formOrigin, readPayload } from "../lib/askccf/security";
import { reserveDailyRequest } from "../lib/askccf/store";
import { runTool, toolDefinitions } from "../lib/askccf/tools";
import ReplyText from "../components/askccf/ReplyText";

async function main() {
  assert.equal(validDate("2026-02-30"), undefined);
  assert.equal(validDate("2026-09-20"), "2026-09-20");
  const sunday = "2026-09-20T12:30:00-05:00";
  assert.match(formatClassTime(sunday, "chicago"), /Sunday.*September 20.*12:30 PM CDT/);
  assert.match(formatClassTime(sunday, "eugene"), /10:30 AM PDT/);
  assert.equal(correctScheduleWeekdays("Sat, Sept 20 at 12:30pm", [{startISO:sunday, location:"chicago"}]), "Sunday, Sept 20 at 12:30pm");
  assert.equal(correctScheduleWeekdays("Sat, Sept 21 at noon", [{startISO:sunday, location:"chicago"}]), "Sat, Sept 21 at noon", "unverified dates are not rewritten");

  const wheel = normalize({id:1,name:"Date Night on the Wheel",active:true,price:"55",classSize:4,calendarIDs:[12216179],description:"One ticket covers a couple."});
  const hand = normalize({id:2,name:"Date Night Chix",active:true,price:"50",calendarIDs:[12216179],description:"Handbuilding. Visit our wheel pottery classes too. One ticket per couple."});
  assert.equal(requestedActivity("date night wheel pottery"), "wheel");
  assert.equal(matchesActivity(hand, "wheel"), false, "description cross-selling must not satisfy a wheel constraint");
  assert.equal(matchesActivity(wheel, "wheel"), true);
  assert.doesNotMatch(derivePricing("Unknown", "Coverage not given.", "50").summary, /one ticket per participant/);
  assert.equal(normalize({id:3,name:"Eugene Pottery",active:true}).address, null);
  assert.equal(normalize({id:3,name:"Eugene Pottery",active:true,description:"Location: 3295 Cross Street, Eugene."}).address, "3295 Cross Street");
  const series = normalize({id:4,name:"6-Week Live Online Pottery Course",active:true,type:"series",category:"Online",duration:540,description:"Register by Sept 12 for kit delivery. Late enrollment begins after kit arrival."});
  assert.equal(toCardShape(series).isSeries, true);
  assert.equal(toCardShape(series).enrollmentNotes.length, 2);

  const slots = [{startISO:"2099-09-19T19:00:00-05:00",localeTime:"fixture",seatsAvailable:4,seatsTotal:4}];
  assert.equal(matchingTimes(wheel, slots, {groupSize:8,dateFrom:"2099-09-19",dateTo:"2099-09-19",startAfter:"18:00"}).length,1);
  assert.equal(matchingTimes(wheel, slots, {groupSize:9}).length,0);
  assert.equal(matchingTimes(wheel, slots, {dateFrom:"2099-09-20"}).length,0);
  assert.equal(matchingTimes(wheel, slots.map(s=>({...s,seatsAvailable:0})), {}).length,0);

  const originalFetch = globalThis.fetch;
  const oldUser = process.env.ACUITY_USER_ID, oldKey = process.env.ACUITY_API_KEY;
  process.env.ACUITY_USER_ID="test"; process.env.ACUITY_API_KEY="test";
  let noAvailability = false;
  globalThis.fetch = async (url) => {
    const path = String(url);
    assert.match(path, /^https:\/\/acuityscheduling.com\/api\/v1\//);
    if (path.endsWith("appointment-types")) return Response.json([
      {id:1,name:"Date Night on the Wheel",active:true,price:"55",classSize:4,calendarIDs:[12216179],description:"One ticket per couple."},
      {id:2,name:"Date Night Chix",active:true,price:"50",calendarIDs:[12216179],description:"Handbuilding and wheel inspiration."},
      {id:5,name:"Private Wheel Lesson",active:true,private:true,price:"1",calendarIDs:[12216179]},
    ]);
    return Response.json(noAvailability ? [] : [{time:slots[0].startISO,slots:4,slotsAvailable:4}]);
  };
  try {
    const results = await searchClasses({location:"chicago",interests:"date night wheel",requiredActivity:"wheel",maxPricePerPerson:30,groupSize:8,dateFrom:"2099-09-19",dateTo:"2099-09-19",startAfter:"18:00"});
    assert.deepEqual(results.map(c=>c.id), ["1"]);
    noAvailability = true;
    assert.equal((await searchClasses({location:"chicago",interests:"wheel"})).length, 0, "do not recommend unscheduled classes");
  } finally {
    globalThis.fetch = originalFetch;
    if (oldUser === undefined) delete process.env.ACUITY_USER_ID; else process.env.ACUITY_USER_ID=oldUser;
    if (oldKey === undefined) delete process.env.ACUITY_API_KEY; else process.env.ACUITY_API_KEY=oldKey;
  }

  const req = (body: string, headers: Record<string,string> = {}) => new Request("https://colorcocktailfactory.com/api/ask-ccf/chat", {method:"POST",headers:{"content-type":"application/json",...headers},body});
  assert.deepEqual(await readPayload(req('{"message":"hi"}')), {message:"hi"});
  await assert.rejects(readPayload(req("[]")), /invalid_json/);
  await assert.rejects(readPayload(req("{}",{origin:"https://untrusted.example"})), /forbidden_origin/);
  await assert.rejects(readPayload(req(JSON.stringify({message:"x".repeat(MAX_BODY_BYTES)}))), /body_too_large/);
  const origin = formOrigin(req("{}", {"x-forwarded-host":"untrusted.example"}));
  assert.notEqual(origin, "https://untrusted.example");
  const oldDeployOrigin = process.env.CCF_DEPLOY_ORIGIN;
  process.env.CCF_DEPLOY_ORIGIN = "https://deploy-preview-4--teal-concha-819f3e.netlify.app";
  try {
    const internalRequest = (origin: string) => new Request("http://localhost:3000/api/ask-ccf/chat", {
      method: "POST", headers: { "content-type": "application/json", origin, "x-forwarded-host": "untrusted.example" }, body: "{}",
    });
    assert.deepEqual(await readPayload(internalRequest(process.env.CCF_DEPLOY_ORIGIN)), {}, "Netlify's internal URL must accept the baked public preview origin");
    await assert.rejects(readPayload(internalRequest("https://untrusted.example")), /forbidden_origin/);
    assert.equal(formOrigin(internalRequest(process.env.CCF_DEPLOY_ORIGIN)), process.env.CCF_DEPLOY_ORIGIN);
  } finally {
    if (oldDeployOrigin === undefined) delete process.env.CCF_DEPLOY_ORIGIN; else process.env.CCF_DEPLOY_ORIGIN = oldDeployOrigin;
  }
  assert.equal(toolDefinitions.some(t=>t.function.name === "lookup_pottery_pickup"), false);
  const pickup = await runTool("lookup_pottery_pickup", {email:"audit@example.com",last_name:"Test"}, {sessionId:"test_session",siteCity:"chicago"});
  assert.equal((pickup.result as any).reason, "staff_verification_required");
  assert.deepEqual((pickup.result as any).records, []);
  if (!process.env.NETLIFY_DB_URL && !process.env.DATABASE_URL && !process.env.NETLIFY_DATABASE_URL && !process.env.NETLIFY_DATABASE_URL_UNPOOLED) {
    assert.equal(await reserveDailyRequest(10), "unavailable", "cost protection must fail closed without its durable store");
  }

  const html = renderToStaticMarkup(React.createElement(ReplyText, {text:"Email support@colorcocktailfactory.com. **Book** https://colorcocktailfactory.as.me/onlinewheelthrowing. <script>alert(1)</script> https://evil.example/"}));
  assert.match(html, /href="mailto:support@colorcocktailfactory.com"/);
  assert.match(html, /<strong>Book<\/strong>/);
  assert.doesNotMatch(html, /<script>|href="https:\/\/evil/);
  console.log("Ask CCF regression checks passed.");
}

main().catch(error => { console.error(error); process.exitCode=1; });
