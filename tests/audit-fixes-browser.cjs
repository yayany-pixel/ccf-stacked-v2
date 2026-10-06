const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const base = process.env.CCF_BASE_URL || "http://localhost:8889";

(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const fresh = await context.request.get(`${base}/api/privacy`);
      assert.equal(fresh.status(), 200);
      assert.deepEqual(await fresh.json(), { preferences: null });
      const invalid = await context.request.post(`${base}/api/privacy`, {
        headers: { origin: new URL(base).origin },
        data: { analytics: "invalid", marketing: false },
      });
      assert.equal(invalid.status(), 400);
      let preferences = null;
      let failSave = false;
      await context.route("**/*", route => {
        const url = new URL(route.request().url());
        if (url.origin !== new URL(base).origin || url.pathname === "/proxy.js") {
          return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
        }
        if (url.pathname === "/api/privacy") {
          if (route.request().method() === "POST") {
            if (failSave) return route.fulfill({ status: 503, json: { error: "preferences_unavailable" } });
            preferences = route.request().postDataJSON();
          }
          return route.fulfill({ json: { preferences } });
        }
        if (route.request().method() === "POST") return route.fulfill({ status: 503, body: "Test isolated" });
        return route.continue();
      });
      await context.addInitScript(() => {
        window.__google = [];
        window.__meta = [];
        window.gtag = (...args) => window.__google.push(args);
        window.fbq = (...args) => window.__meta.push(args);
      });
      const page = await context.newPage();
      await page.goto(base);
      await page.getByRole("heading", { name: "A little about privacy." }).waitFor();
      assert.equal(await page.locator("script#google-tag, script#meta-pixel-library").count(), 0);
      assert.equal(await page.evaluate(() => window.__google.filter(command => command[0] === "event").length), 0);
      assert.equal(await page.evaluate(() => window.__meta.filter(command => command[0] === "track").length), 0);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.getByRole("button", { name: "Reject optional", exact: true }).first().click();
      await page.getByRole("heading", { name: "A little about privacy." }).waitFor({ state: "hidden" });
      assert.deepEqual(preferences, { analytics: false, marketing: false });
      await page.reload();
      await page.waitForFunction(() => window.ccfPrivacyPreferences?.analytics === false);
      assert.equal(await page.locator("script#google-tag, script#meta-pixel-library").count(), 0);
      await page.getByRole("button", { name: "Privacy preferences", exact: true }).click();
      const dialog = page.getByRole("dialog", { name: "Privacy preferences" });
      await dialog.waitFor();
      await dialog.getByLabel("Analytics").check();
      await dialog.getByRole("button", { name: "Save choices", exact: true }).click();
      await dialog.waitFor({ state: "hidden" });
      assert.deepEqual(preferences, { analytics: true, marketing: false });
      await page.locator("script#google-tag").waitFor({ state: "attached" });
      assert.equal(await page.locator("script#meta-pixel-library").count(), 0);
      await page.getByRole("button", { name: "Privacy preferences", exact: true }).click();
      await dialog.getByLabel("Advertising").check();
      await dialog.getByRole("button", { name: "Save choices", exact: true }).click();
      await dialog.waitFor({ state: "hidden" });
      assert.deepEqual(preferences, { analytics: true, marketing: true });
      await page.locator("script#google-tag").waitFor({ state: "attached" });
      await page.locator("script#meta-pixel-library").waitFor({ state: "attached" });
      assert.ok(await page.evaluate(() => window.__meta.some(command => command[1] === "PageView")));
      await page.getByRole("button", { name: "Privacy preferences", exact: true }).click();
      await dialog.getByRole("button", { name: "Reject optional", exact: true }).click();
      await dialog.waitFor({ state: "hidden" });
      assert.deepEqual(preferences, { analytics: false, marketing: false });
      const eventCounts = await page.evaluate(() => ({ google: window.__google.filter(command => command[0] === "event").length, meta: window.__meta.filter(command => command[0] === "track").length }));
      await page.getByRole("button", { name: "Eugene", exact: true }).click();
      assert.deepEqual(await page.evaluate(() => ({ google: window.__google.filter(command => command[0] === "event").length, meta: window.__meta.filter(command => command[0] === "track").length })), eventCounts);
      await page.reload();
      assert.equal(await page.locator("script#google-tag, script#meta-pixel-library").count(), 0);
      failSave = true;
      await page.getByRole("button", { name: "Privacy preferences", exact: true }).click();
      await dialog.getByLabel("Analytics").check();
      await dialog.getByLabel("Advertising").check();
      await dialog.getByRole("button", { name: "Save choices", exact: true }).click();
      await dialog.getByRole("alert").waitFor();
      assert.equal(await page.locator("script#google-tag, script#meta-pixel-library").count(), 0);
      assert.deepEqual(await page.evaluate(() => window.ccfPrivacyPreferences), { analytics: false, marketing: false });
      await dialog.getByRole("button", { name: "Close", exact: true }).click();
      await page.goto(`${base}/gift-cards`);
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "Skip to main content");
      await page.keyboard.press("Enter");
      assert.equal(await page.evaluate(() => document.activeElement.id), "main-content");
      for (const path of ["/teach/instructors/login", "/teach/instructors/dashboard"]) {
        await page.goto(`${base}${path}`);
        await page.getByRole("heading", { name: "Your portal is coming soon." }).waitFor();
        assert.equal(await page.locator('input[type="password"]').count(), 0);
        assert.equal(await page.getByRole("button", { name: "Sign In", exact: true }).count(), 0);
      }
      await context.close();
      console.log(`Audit browser checks passed at ${width}px: default denial, explicit choices, reload persistence, revocation, save failure, keyboard skip, and safe portal.`);
    }

    const context = await browser.newContext();
    await context.route("**/*", route => {
      const url = new URL(route.request().url());
      if (url.origin !== new URL(base).origin || url.pathname === "/proxy.js") return route.fulfill({ status: 200, body: "" });
      if (url.pathname === "/api/privacy") return route.fulfill({ json: { preferences: { analytics: true, marketing: true } } });
      if (route.request().method() === "POST") return route.fulfill({ status: 503, body: "Test isolated" });
      return route.continue();
    });
    await context.addInitScript(() => Object.defineProperty(navigator, "globalPrivacyControl", { value: true }));
    const page = await context.newPage();
    await page.goto(base);
    await page.waitForFunction(() => window.ccfPrivacyPreferences?.analytics === false);
    await page.getByRole("button", { name: "Privacy preferences", exact: true }).click();
    assert.equal(await page.locator("script#google-tag, script#meta-pixel-library").count(), 0);
    assert.equal(await page.getByRole("dialog").getByLabel("Advertising").isDisabled(), true);
    await context.close();
    console.log("Browser privacy signals override previously saved grants.");
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
