const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const { ACTIVITY_MANIFEST } = require("../lib/homepage/manifest.ts");
const { normalize } = require("../lib/askccf/catalog.ts");
const { buildHomepageData, activitiesForCity, priceLabel } = require("../lib/homepage/data.ts");

const base = process.env.CCF_BASE_URL || "http://127.0.0.1:3000";
const catalog = ACTIVITY_MANIFEST.map(activity => normalize({
  id: activity.appointmentTypeId,
  name: activity.appointmentTypeId === 79189013 ? "Terrarium renamed in Acuity" : activity.acuityTitle,
  active: true,
  calendarIDs: activity.calendarIds,
  category: activity.city === "online" ? "Online" : `${activity.city} Classes`,
  price: String(20.13 + activity.appointmentTypeId % 23),
  description: activity.key.includes("date-night-wheel") ? "One ticket covers two people." : "",
}));
const data = buildHomepageData(catalog, [], new Date("2026-11-03T12:00:00Z"));

(async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    await context.route("**/*", route => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin !== new URL(base).origin) return route.abort();
      if (url.pathname === "/api/homepage") return route.fulfill({ json: data });
      if (url.pathname === "/api/privacy") return route.fulfill({ json: { preferences: { analytics: false, marketing: false } } });
      return route.continue();
    });
    const page = await context.newPage();
    for (const city of ["chicago", "eugene"]) {
      await page.goto(`${base}/${city}`, { waitUntil: "domcontentloaded" });
      const cards = activitiesForCity(data.activities, city);
      await page.getByText(priceLabel(cards[0]), { exact: true }).first().waitFor();
      const more = page.getByRole("button", { name: "Show me more" });
      while (await more.count()) await more.click();
      for (const card of cards) {
        const article = page.locator(`[data-activity="${card.key}"]`);
        assert.equal(await article.count(), 1, `${city}: ${card.key} must remain visible after Acuity renames`);
        assert.equal(await article.getByText(priceLabel(card), { exact: true }).count(), 1, `${card.key}: rendered price equals live catalog`);
        assert.equal(await article.locator("del").count(), 0, `${card.key}: no unverified crossed-out price`);
      }
      assert.equal(await page.locator('del[aria-label="Original price"]').count(), 0);
      assert.equal(await page.getByText(/Limited-Time Sale|Special workshop discount pricing active now/).count(), 0);
      assert.equal(await page.locator('a[href*="rezclick"]').count(), 0);
      for (const key of ["date-night-wheel", city === "chicago" ? "beginner-wheel" : "cup-creations"]) {
        const giftClass = cards.find(card => card.key === `${city}-${key}`);
        assert.ok(giftClass);
        assert.ok(await page.locator("#homepage-gift-cards").getByText(`${priceLabel(giftClass)} · ${city === "chicago" ? "Chicago" : "Eugene"}`, { exact: true }).count());
      }
    }
    console.log("Rendered homepage prices match catalog, renamed offerings stay visible, and unverified sales/RezClick links are absent.");
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
