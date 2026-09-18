import assert from "node:assert/strict";
import { POST } from "../app/api/play/classes/route";
import { dateBounds, groupPricing, isMatchKey, parsePlayFilters, resolveMatch } from "../lib/play";

async function main() {
  const base = { location: "chicago", when: "month", groupSize: 2, budget: null, activity: "any" };
  const friday = new Date("2026-09-18T18:00:00Z");
  assert.deepEqual(groupPricing(55, 2, 3), { tickets: 2, total: 110, perPerson: 110 / 3 });
  assert.equal(groupPricing(55, null, 3), null, "unknown ticket coverage cannot establish a group price");
  assert.equal(groupPricing(null, 2, 2), null);
  assert.equal(isMatchKey("__proto__"), false);
  assert.equal(isMatchKey("mosaic"), true);
  assert.equal(resolveMatch(["clay", "playful", "2"]), "wheel");
  assert.equal(resolveMatch(["clay", "slow", "2"]), "handbuilding");
  assert.equal(resolveMatch(["color", "slow", "4"]), "mosaic");
  assert.equal(resolveMatch(["green", "playful", "1"]), "bonsai");
  assert.equal(dateBounds("chicago", new Date("2026-09-19T05:30:00Z")).today, "2026-09-19");
  assert.equal(dateBounds("eugene", new Date("2026-09-19T05:30:00Z")).today, "2026-09-18");
  const weekend = parsePlayFilters({ ...base, when: "weekend" }, friday);
  assert.equal(weekend.dateFrom, "2026-09-18"); assert.equal(weekend.dateTo, "2026-09-20");
  const sunday = parsePlayFilters({ ...base, when: "weekend" }, new Date("2026-09-20T18:00:00Z"));
  assert.equal(sunday.dateFrom, "2026-09-20"); assert.equal(sunday.dateTo, "2026-09-20");
  for (const patch of [
    { location: "__proto__" }, { location: "any" }, { activity: "constructor" },
    { groupSize: 0 }, { groupSize: 9 }, { groupSize: 2.5 }, { groupSize: "2" },
    { budget: "50" }, { budget: -1 }, { budget: NaN }, { when: "forever" },
    { when: "custom", dateFrom: "2026-09-17", dateTo: "2026-09-20" },
    { when: "custom", dateFrom: "2026-09-21", dateTo: "2026-09-20" },
    { when: "custom", dateFrom: "2026-09-31", dateTo: "2026-10-02" },
    { when: "custom", dateFrom: "2026-09-20", dateTo: "2027-09-20" },
  ]) assert.throws(() => parsePlayFilters({ ...base, ...patch }, friday));

  // Endpoint tests use a fake Acuity transport, never real bookings or messages.
  const savedFetch = globalThis.fetch;
  const savedUser = process.env.ACUITY_USER_ID, savedKey = process.env.ACUITY_API_KEY;
  process.env.ACUITY_USER_ID = "test"; process.env.ACUITY_API_KEY = "test";
  let mode: "available" | "empty" | "failure" = "available";
  const future = new Date(Date.now() + 5 * 86_400_000).toISOString();
  globalThis.fetch = async (url) => {
    if (mode === "failure") return new Response("unavailable", { status: 503 });
    if (String(url).endsWith("appointment-types")) return Response.json([
      ...Array.from({ length: 7 }, (_, i) => ({ id: 20 + i, name: `Pottery Wheel ${i}`, active: true, price: "10", calendarIDs: [12216179], description: "Ticket coverage not specified." })),
      { id: 1, name: "Date Night on the Wheel", active: true, price: "55", classSize: 6, calendarIDs: [12216179], description: "One ticket per couple." },
      { id: 2, name: "Private Pottery Wheel", active: true, private: true, price: "1", calendarIDs: [12216179] },
    ]);
    return Response.json(mode === "empty" ? [] : [{ time: future, slots: 6, slotsAvailable: 3 }]);
  };
  const request = (body: unknown, origin = "https://colorcocktailfactory.com") => new Request("https://colorcocktailfactory.com/api/play/classes", { method: "POST", headers: { "content-type": "application/json", origin, "x-nf-client-connection-ip": "play-regression-fixture" }, body: JSON.stringify(body) });
  try {
    const response = await POST(request({ ...base, activity: "wheel", budget: 35 }));
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.deepEqual(result.classes.map((item: { id: string }) => item.id), ["1"], "confirmed pricing must filter before the six-class shortlist");
    assert.equal(result.classes[0].groupPrice.total, 55);
    assert.match(result.classes[0].nextLocaleTime, /2026|2027/);
    const oddGroup = await (await POST(request({ ...base, groupSize: 3, budget: 35 }))).json();
    assert.equal(oddGroup.classes.length, 0, "two couple tickets cost more than $35/person for a group of three");
    assert.equal((await POST(request({ ...base, groupSize: 100 }))).status, 400);
    assert.equal((await POST(request(base, "https://untrusted.example"))).status, 403);
    mode = "empty";
    assert.equal((await (await POST(request(base))).json()).classes.length, 0);
    mode = "failure";
    assert.equal((await POST(request(base))).status, 503, "schedule failure must not invent a class");
  } finally {
    globalThis.fetch = savedFetch;
    if (savedUser === undefined) delete process.env.ACUITY_USER_ID; else process.env.ACUITY_USER_ID = savedUser;
    if (savedKey === undefined) delete process.env.ACUITY_API_KEY; else process.env.ACUITY_API_KEY = savedKey;
  }
  console.log("Curiosity Studio regression checks passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
