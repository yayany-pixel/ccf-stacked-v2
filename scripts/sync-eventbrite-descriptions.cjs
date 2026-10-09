#!/usr/bin/env node
/**
 * Script to batch-update Eventbrite descriptions with:
 * 1. "Avoid ticket fees by booking directly on Acuity" callout
 * 2. Studio address
 * 3. Cross-promotional links to diverse popular workshops on Acuity
 * 4. Link to workshop collections
 *
 * Usage: node scripts/sync-eventbrite-descriptions.cjs
 */

const token = process.env.EVENTBRITE_TOKEN || process.env.EVENTBRITE_PRIVATE_TOKEN;
const orgId = process.env.EVENTBRITE_ORG_ID || process.env.EVENTBRITE_ORGANIZATION_ID;

if (!token || !orgId) {
  console.error("Missing EVENTBRITE_TOKEN or EVENTBRITE_ORG_ID");
  process.exit(1);
}

const POPULAR_RECS = [
  { title: "Date Night Pottery on the Wheel", category: "Pottery", acuityUrl: "https://colorcocktailfactory.as.me/Datenight", price: "$50" },
  { title: "Turkish Mosaic Lamp Workshop", category: "Glass Art", acuityUrl: "https://colorcocktailfactory.as.me/schedule/a8dfb300/appointment/95416771/calendar/12216179", price: "$65" },
  { title: "Wheel Throwing for Beginners: Matcha Bowl", category: "Pottery", acuityUrl: "https://colorcocktailfactory.as.me/eugenewheelthrowing", price: "$25" },
  { title: "Bonsai for Beginners: Hands-On Workshop", category: "Botanical", acuityUrl: "https://colorcocktailfactory.as.me/schedule/a8dfb300/appointment/79188910/calendar/12216179", price: "$75" },
  { title: "Terrarium Workshop & Living Garden", category: "Botanical", acuityUrl: "https://colorcocktailfactory.as.me/terrarium", price: "$35" },
  { title: "Organic Candle Making Workshop", category: "Aroma", acuityUrl: "https://colorcocktailfactory.as.me/candle", price: "$35" },
  { title: "Wine Glass Painting", category: "Painting", acuityUrl: "https://colorcocktailfactory.as.me/schedule/a8dfb300/appointment/79374003/calendar/12216179", price: "$35" },
];

function buildEnhancedDescription(existingText, title, isChicago) {
  // If already updated, skip
  if (existingText && existingText.includes("AVOID TICKET FEES")) {
    return null;
  }

  const city = isChicago ? "Chicago" : "Eugene";
  const address = isChicago 
    ? "1142 W. 18th Street, Chicago, IL 60608 (Pilsen)"
    : "3295 Cross Street, Eugene, OR 97402";

  const recs = POPULAR_RECS
    .filter(r => !title.toLowerCase().includes(r.title.toLowerCase()))
    .slice(0, 4)
    .map(r => `<li><a href="${r.acuityUrl}"><strong>${r.title}</strong></a> (${r.category} · ${r.price}) — <a href="${r.acuityUrl}">Book on Acuity</a></li>`)
    .join("\n");

  const cleanExisting = (existingText || "").trim();

  return `
${cleanExisting}

<hr />

<p><strong>🎟️ AVOID TICKET FEES — BOOK DIRECT ON ACUITY:</strong><br />
Third-party platforms charge added booking fees. To avoid extra fees and get instant studio confirmation, book directly through our official reservation calendar at <a href="https://colorcocktailfactory.as.me/"><strong>colorcocktailfactory.as.me</strong></a>!</p>

<p><strong>📍 Studio Address:</strong> ${address}<br />
<strong>🥂 BYOB:</strong> Feel free to bring your favorite drinks & snacks to enjoy while crafting!</p>

<hr />

<p><strong>✨ EXPLORE MORE CLASSES AT COLOR COCKTAIL FACTORY:</strong><br />
Planning your next creative night out? Discover more of our favorite classes and book directly on Acuity:</p>
<ul>
${recs}
</ul>
<p>👉 <a href="https://colorcocktailfactory.com/collections">Browse all class collections</a> (Beginners, Date Nights, Pottery, Glass & Mosaics, and Online Classes).</p>
`.trim();
}

async function updateEvents() {
  console.log("Checking Eventbrite organization events...");
  let page = 1;
  const eventsToUpdate = [];

  while (page <= 25) {
    const res = await fetch(`https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?page=${page}&page_size=100`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.events || data.events.length === 0) break;

    for (const e of data.events) {
      eventsToUpdate.push(e);
    }
    if (page >= data.pagination.page_count) break;
    page++;
  }

  console.log(`Found ${eventsToUpdate.length} events to inspect.`);
  let updatedCount = 0;
  let skippedCount = 0;

  for (const event of eventsToUpdate) {
    const isChicago = !event.name.text.toLowerCase().includes("eugene");
    const existingDesc = event.description?.html || event.description?.text || "";
    const newDesc = buildEnhancedDescription(existingDesc, event.name.text, isChicago);

    if (!newDesc) {
      skippedCount++;
      continue;
    }

    try {
      const updateRes = await fetch(`https://www.eventbriteapi.com/v3/events/${event.id}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          event: {
            description: { html: newDesc }
          }
        })
      });

      if (updateRes.ok) {
        console.log(`✓ Updated [${event.id}] "${event.name.text}"`);
        updatedCount++;
      } else {
        const err = await updateRes.json();
        console.error(`Failed to update [${event.id}]:`, err.error || err);
      }
    } catch (err) {
      console.error(`Error updating [${event.id}]:`, err);
    }
  }

  console.log(`Finished: ${updatedCount} updated, ${skippedCount} skipped.`);
}

updateEvents().catch(console.error);
