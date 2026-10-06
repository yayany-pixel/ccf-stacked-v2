const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const base = process.env.CCF_BASE_URL || "http://localhost:8889";
(async () => {
  const browser = await chromium.launch();
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    await context.route("**/*", (route) => {
      const u = new URL(route.request().url());
      if (u.origin !== new URL(base).origin)
        return route.fulfill({
          status: 200,
          contentType: "application/javascript",
          body: "",
        });
      if (u.pathname === "/proxy.js")
        return route.fulfill({ status: 200, body: "" });
      return route.continue();
    });
    await context.addInitScript(() => {
      window.__events = [];
      window.__meta = [];
      window.fbq = (...args) => window.__meta.push(args);
      window.gtag = function () {
        window.__events.push([...arguments]);
      };
    });
    const page = await context.newPage();
    await page.route("**/api/privacy", route => route.fulfill({ json: { preferences: { analytics: true, marketing: true } } }));
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base + "/?location=chicago&utm_source=analytics_test");
    await page.waitForSelector("[data-activity]");
    await page.waitForFunction(
      () => !document.querySelector("button[aria-pressed]").disabled,
    );
    await page.waitForTimeout(700);
    const countMeta = async (name) =>
      page.evaluate(
        (n) => window.__meta.filter((x) => x[1] === n).length,
        name,
      );
    const count = async (name) =>
      page.evaluate(
        (n) =>
          window.__events.filter((x) => x[0] === "event" && x[1] === n).length,
        name,
      );
    assert.equal(await count("page_view"), 1);
    assert.equal(await page.locator("script#google-tag").count(), 1);
    assert.equal(
      await page.evaluate(
        () =>
          window.__meta.filter((x) => x[0] === "track" && x[1] === "PageView")
            .length,
      ),
      1,
    );
    assert.equal(
      await page.evaluate(
        () => window.__meta.filter((x) => x[0] === "init").length,
      ),
      1,
    );
    assert.equal(await page.locator("script#meta-pixel-library").count(), 1);
    assert.equal(await countMeta("CCF_CitySelected"), 0);
    const metaInitial = await countMeta("ViewContent");
    assert(metaInitial > 0 && metaInitial < 10);
    const initialViews = await count("view_item_list");
    assert(initialViews > 0 && initialViews < 10);
    const first = page.locator("[data-activity]").first();
    await first.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const before = await count("view_item_list");
    const metaBefore = await countMeta("ViewContent");
    await page.evaluate(() => window.scrollTo(0, 0));
    await first.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    assert.equal(await count("view_item_list"), before);
    assert.equal(await countMeta("ViewContent"), metaBefore);
    const expectedId = await first.getAttribute("data-appointment-id");
    // Prevent navigation after handlers, while still exercising real click bubbling.
    await page.evaluate(() =>
      document.addEventListener("click", (e) => {
        if (e.target.closest("[data-activity] a")) e.preventDefault();
      }),
    );
    await first.locator("a").click();
    assert.equal(await count("begin_checkout"), 1);
    assert.equal(await countMeta("InitiateCheckout"), 1);
    const metaCheckout = await page.evaluate(
      () => window.__meta.find((x) => x[1] === "InitiateCheckout")[2],
    );
    assert.deepEqual(metaCheckout.content_ids, [expectedId]);
    assert.equal(metaCheckout.city, "chicago");
    assert.equal(metaCheckout.placement, "homepage_card");
    assert.equal(await count("select_item"), 1);
    const checkout = await page.evaluate(
      () => window.__events.find((x) => x[1] === "begin_checkout")[2],
    );
    assert.equal(checkout.class_id, expectedId);
    assert.equal(checkout.city, "chicago");
    assert.equal(checkout.card_position, 1);
    assert.equal(checkout.booking_provider, "acuity");
    assert(checkout.class_name);
    await page
      .getByRole("button", { name: "Show me more", exact: true })
      .click();
    assert.equal(await count("homepage_show_more"), 1);
    assert.equal(await countMeta("CCF_ShowMore"), 1);
    const cities = await count("city_selected");
    await page.getByRole("button", { name: "Eugene", exact: true }).click();
    assert.equal(await count("city_selected"), cities + 1);
    const cityEvent = await page.evaluate(
      () => window.__events.filter((x) => x[1] === "city_selected").at(-1)[2],
    );
    assert.equal(cityEvent.selection_source, "homepage_toggle");
    assert.equal(cityEvent.previous_city, "chicago");
    assert.equal(await countMeta("CCF_CitySelected"), 1);
    await page.evaluate(() =>
      document.addEventListener("click", (e) => {
        if (e.target.closest('footer a[href="/private-events"]'))
          e.preventDefault();
      }),
    );
    await page
      .getByRole("link", { name: "Request a private party quote", exact: true })
      .click();
    assert.equal(await countMeta("CCF_PrivatePartyCTA"), 1);
    const form = page.locator('form[name="private-party"]');
    await form.locator('[name="name"]').fill("Analytics Test");
    await form.locator('[name="email"]').fill("analytics-test@example.invalid");
    await form.locator('[name="groupSize"]').fill("12");
    await form.locator('[name="occasion"]').fill("Test only");
    await page.route("**/netlify-forms.html", (r) =>
      r.fulfill({ status: 500, body: "Mock failure" }),
    );
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(300);
    assert.equal(await count("generate_lead"), 0);
    assert.equal(await countMeta("Lead"), 0);
    await page.unroute("**/netlify-forms.html");
    await page.route("**/netlify-forms.html", (r) =>
      r.fulfill({ status: 200, body: "Mock accepted" }),
    );
    await page.route("**/thanks/private-party", (r) => r.abort());
    const metaLeads = [];
    await page.exposeFunction("captureMetaLead", (args) =>
      metaLeads.push(args),
    );
    await page.evaluate(() => {
      const old = window.fbq;
      window.fbq = (...args) => {
        old(...args);
        if (args[1] === "Lead") window.captureMetaLead(args);
      };
    });
    const leads = [];
    await page.exposeFunction("captureLead", (p) => leads.push(p));
    await page.evaluate(() => {
      const old = window.gtag;
      window.gtag = function (...args) {
        old(...args);
        if (args[1] === "generate_lead") window.captureLead(args[2]);
      };
    });
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    assert.equal(leads.length, 1);
    assert.equal(metaLeads.length, 1);
    assert(metaLeads[0][3].eventID);
    assert.equal(metaLeads[0][2].city, "eugene");
    assert(!JSON.stringify(metaLeads).includes("analytics-test"));
    assert(!JSON.stringify(metaLeads).includes("Test only"));
    assert.equal(leads[0].form_name, "private-party");
    assert(!JSON.stringify(leads).includes("analytics-test"));
    assert(!JSON.stringify(leads).includes("Test only"));
    await page.goto(base);
    const newsletter = page.locator('form[name="newsletter"]').first();
    await newsletter
      .locator('[name="email"]')
      .fill("analytics-test@example.invalid");
    await page.route("**/thanks/newsletter", (r) => r.abort());
    const metaSignups = [];
    await page.exposeFunction("captureMetaSignup", (args) =>
      metaSignups.push(args),
    );
    await page.evaluate(() => {
      const old = window.fbq;
      window.fbq = (...args) => {
        old(...args);
        if (args[1] === "CompleteRegistration") window.captureMetaSignup(args);
      };
    });
    const signups = [];
    await page.exposeFunction("captureSignup", (p) => signups.push(p));
    await page.evaluate(() => {
      const old = window.gtag;
      window.gtag = function (...args) {
        old(...args);
        if (args[1] === "sign_up") window.captureSignup(args[2]);
      };
    });
    await newsletter.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    assert.equal(signups.length, 1);
    assert.equal(metaSignups.length, 1);
    assert.equal(metaSignups[0][2].status, "completed");
    assert(!JSON.stringify(metaSignups).includes("analytics-test"));
    assert.equal(signups[0].method, "newsletter");
    assert(!JSON.stringify(signups).includes("analytics-test"));
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`Analytics browser checks passed at ${width}px.`);
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
