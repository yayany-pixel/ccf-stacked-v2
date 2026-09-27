import assert from "node:assert/strict";
import { getAllEvents, eventCategory, eventLocationSchema } from "../lib/eventsAPI";
import { getCatalog } from "../lib/askccf/catalog";
import { catalogBookingUrl } from "../lib/booking";
import { eventTimeZone } from "../lib/locations";

async function main() {
  process.env.ACUITY_USER_ID = "test";
  process.env.ACUITY_API_KEY = "test";
  const future = new Date(Date.now() + 86400000).toISOString();
  const types = [
    { id: 1, name: "Eugene Date Night On The Wheel", active: true, category: "Eugene Classes", description: "Located at 1162 Lorella Ave Eugene OR 97401", price: "50", duration: 90 },
    { id: 2, name: "Make a Clay Cauldron — Live Online", active: true, category: "Online Class Series", description: "Hand-build a decorative cauldron. No wheel needed.", price: "29" },
    { id: 3, name: "Alex’s Garden Of Life Party", active: true, category: "Chicago Classes" },
    { id: 4, name: "Private Event Pottery", active: true, category: "Chicago Classes" },
    { id: 5, name: "Chicago Mosaic Creations", active: true, category: "Chicago Classes", price: "30" },
    { id: 6, name: "Chicago Wheel Throwing", active: false, category: "Chicago Classes" },
  ];
  const slot = (id: number) => ({ appointmentTypeID: id, calendarID: id === 1 ? 13582962 : 12216179, time: future, duration: 90, slotsAvailable: 5 });
  let calls = 0;
  globalThis.fetch = (async input => {
    calls++;
    const url = String(input);
    if (url.includes("appointment-types")) return new Response(JSON.stringify(types));
    assert.ok(url.includes("availability/classes?"));
    const params = new URL(url).searchParams;
    assert.equal(params.get("includePrivate"), "false");
    assert.equal(params.get("includeUnavailable"), "false");
    assert.ok(params.has("maxDate"), "schedule spans the requested date range");
    return new Response(JSON.stringify([slot(1), slot(1), slot(2), slot(3), slot(4), { ...slot(5), slotsAvailable: 0 }, slot(6)]));
  }) as typeof fetch;
  const events = await getAllEvents(60);
  assert.equal(calls, 2, "all events require only catalog and schedule requests");
  assert.equal(events.length, 2, "private, inactive, sold-out, and duplicate sessions stay out of the feed");
  const eugene = events.find(event => event.city === "Eugene")!;
  assert.equal(eugene.streetAddress, "3295 Cross Street");
  assert.equal(eugene.postalCode, "97402");
  assert.doesNotMatch(eugene.description, /Lorella|97401/);
  assert.equal(eventTimeZone(eugene.city), "America/Los_Angeles");
  const url = new URL(eugene.bookingUrl);
  assert.equal(url.searchParams.get("appointmentTypeIds[]"), "1");
  assert.equal(url.searchParams.get("calendarIds"), "13582962");
  assert.equal(decodeURIComponent(url.pathname.split("/datetime/")[1]), future);
  assert.ok(url.pathname.includes("/appointment/1/calendar/13582962/"));
  const online = events.find(event => event.city === "Virtual")!;
  assert.equal(online.streetAddress, "");
  assert.equal(online.category, "Handbuilding");
  assert.equal(eventLocationSchema(online)["@type"], "VirtualLocation");
  assert.equal(eventCategory("Paint Pottery - Chicago"), "Pottery Painting");
  assert.equal(eventCategory("Eugene Duck Soap holder"), "Handbuilding");
  const catalog = await getCatalog();
  const booking = new URL(catalogBookingUrl(catalog, "eugene", "date-night-wheel"));
  assert.equal(booking.searchParams.get("appointmentType"), "1");
  assert.ok(!booking.toString().includes("appointmentType=3"));
  console.log("Website repair checks passed: public events, local addresses, categories, and exact Acuity links.");
}
main();
