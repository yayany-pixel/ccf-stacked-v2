const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const base = process.env.CCF_BASE_URL || "http://localhost:8889";
(async () => {
  const browser = await chromium.launch();
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    await context.route("**/*", (r) => {
      const u = new URL(r.request().url());
      if (u.origin !== new URL(base).origin || u.pathname === "/proxy.js")
        return r.fulfill({ status: 200, body: "" });
      if (
        r.request().method() === "POST" &&
        u.pathname === "/netlify-forms.html"
      )
        return r.fulfill({ status: 503, body: "Test isolated" });
      return r.continue();
    });
    await context.addInitScript(() => {
      window.__meta = [];
      window.fbq = (...args) => window.__meta.push(args);
      window.gtag = () => {};
    });
    const page = await context.newPage();
    await page.route("**/api/privacy", route => route.fulfill({ json: { preferences: { analytics: true, marketing: true } } }));
    await page.goto(base);
    await page.waitForSelector("script#meta-pixel-library", {
      state: "attached",
    });
    const events = async (name) =>
      page.evaluate((n) => window.__meta.filter((x) => x[1] === n), name);
    assert.equal((await events("PageView")).length, 1);
    await page
      .locator('a[href="/activities/date-night-wheel"]')
      .first()
      .evaluate((el) => el.click());
    await page.waitForURL("**/activities/date-night-wheel");
    await page.waitForTimeout(700);
    assert.equal((await events("PageView")).length, 2);
    const detail = (await events("ViewContent")).filter(
      (x) => x[2].placement === "activity_page",
    );
    assert.equal(detail.length, 1);
    assert.deepEqual(detail[0][2].content_ids, ["activity:date-night-wheel"]);
    assert.equal(detail[0][2].value, undefined);
    await page.goBack();
    await page.waitForURL(base + "/");
    await page.waitForTimeout(500);
    assert.equal((await events("PageView")).length, 3);
    await page.goForward();
    await page.waitForURL("**/activities/date-night-wheel");
    await page.waitForTimeout(500);
    assert.equal((await events("PageView")).length, 4);
    assert.equal(
      await page.evaluate(
        () => window.__meta.filter((x) => x[0] === "init").length,
      ),
      1,
    );
    await page.evaluate(() => window.scrollTo(0, 700));
    await page
      .getByRole("link", { name: "Request a private party", exact: true })
      .click({ force: true });
    await page.waitForURL("**/private-events");
    const privateClicks = await events("CCF_PrivatePartyCTA");
    assert.equal(privateClicks.length, 1);
    assert.equal(privateClicks[0][2].placement, "sticky");
    // Mock both assistant responses and accepted lead; never call AI or submit data.
    await page.route("**/api/ask-ccf/chat", (r) =>
      r.fulfill({
        json: {
          state: "ok",
          reply: "Test recommendation",
          cards: [
            {
              id: "79006071",
              title: "Date Night Pottery",
              location: "chicago",
              locationLabel: "Chicago",
              craft: "pottery",
              priceUsd: 80,
              priceUnit: "per_couple",
              ticketCovers: 2,
              pricingSummary: "$80",
              durationMinutes: 90,
              nextLocaleTime: null,
              imageUrl: null,
              bookingUrl:
                "https://colorcocktailfactory.as.me/?appointmentType=79006071",
            },
          ],
          draft: {
            name: "Test Person",
            email: "private@example.invalid",
            phone: null,
            city: "chicago",
            preferredDate: "2026-12-01",
            groupSize: "12",
            activity: "Pottery",
            budget: null,
            notes: "Private test notes",
          },
        },
      }),
    );
    await page.route("**/api/ask-ccf/inquiry", (r) =>
      r.fulfill({
        json: {
          status: "received",
          persisted: true,
          metaEventId: "askccf:lead:test-123",
        },
      }),
    );
    await page
      .getByRole("button", { name: "Open studio help, the CCF AI assistant" })
      .click();
    assert.equal((await events("CCF_AskCCFOpen")).length, 1);
    await page
      .locator("#ask-ccf-input")
      .fill("A test prompt that must not reach Meta");
    await page.locator("#ask-ccf-input").press("Enter");
    await page.getByRole("link", { name: "Check dates & book" }).waitFor();
    await page.evaluate(() =>
      document.addEventListener("click", (e) => {
        if (e.target.closest("#ask-ccf-panel a")) e.preventDefault();
      }),
    );
    await page.getByRole("link", { name: "Check dates & book" }).click();
    const checkout = await events("InitiateCheckout");
    assert.equal(checkout.length, 1);
    assert.equal(checkout[0][2].placement, "ask_ccf");
    assert.deepEqual(checkout[0][2].content_ids, ["79006071"]);
    await page.getByRole("button", { name: "Send to the team" }).click();
    await page.waitForTimeout(300);
    const leads = await events("Lead");
    assert.equal(leads.length, 1);
    assert.equal(leads[0][3].eventID, "askccf:lead:test-123");
    assert.equal(leads[0][2].lead_type, "ask_ccf_private_party");
    const text = JSON.stringify(await page.evaluate(() => window.__meta));
    for (const pii of [
      "private@example.invalid",
      "Test Person",
      "Private test notes",
      "A test prompt",
    ])
      assert(!text.includes(pii));
    await page.evaluate(() => window.ccfSetMetaConsent("denied"));
    const before = (await events("Contact")).length;
    await page.locator('#ask-ccf-panel a[href^="mailto:"]').last().click();
    assert.equal((await events("Contact")).length, before);
    await context.close();
    console.log(`Meta navigation and Ask CCF passed at ${width}px.`);
  }
  const denied = await browser.newContext();
  await denied.route("**/*", (r) =>
    new URL(r.request().url()).origin === new URL(base).origin &&
    new URL(r.request().url()).pathname !== "/proxy.js"
      ? r.continue()
      : r.fulfill({ status: 200, body: "" }),
  );
  await denied.addInitScript(() => {
    window.ccfMetaConsent = "denied";
    window.__meta = [];
    window.fbq = (...args) => window.__meta.push(args);
    window.gtag = () => {};
  });
  const page = await denied.newPage();
  await page.route("**/api/privacy", route => route.fulfill({ json: { preferences: null } }));
  await page.goto(base);
  await page.waitForSelector("[data-activity]");
  await page.waitForTimeout(400);
  assert.equal(await page.locator("script#meta-pixel-library").count(), 0);
  assert.equal(
    await page.evaluate(
      () => window.__meta.filter((x) => x[0] === "track").length,
    ),
    0,
  );
  await page.evaluate(() => window.ccfSetMetaConsent("granted"));
  await page.waitForSelector("script#meta-pixel-library", {
    state: "attached",
  });
  await page.waitForTimeout(300);
  assert.equal(
    await page.evaluate(
      () => window.__meta.filter((x) => x[1] === "PageView").length,
    ),
    1,
  );
  assert(
    (await page.evaluate(
      () => window.__meta.filter((x) => x[1] === "ViewContent").length,
    )) > 0,
  );
  await page.evaluate(() => window.ccfSetMetaConsent("granted"));
  assert.equal(
    await page.evaluate(
      () => window.__meta.filter((x) => x[1] === "PageView").length,
    ),
    1,
  );
  await denied.close();
  console.log("Meta initial denial and subsequent grant passed.");
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
