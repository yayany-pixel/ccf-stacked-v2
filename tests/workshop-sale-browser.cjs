const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const root = process.env.CCF_BASE_URL || "http://localhost:8889";

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.route("**/*", route => new URL(route.request().url()).origin === new URL(root).origin ? route.continue() : route.abort());
    await context.addInitScript(initialTime => {
      const key = "ccf:test:workshop-sale-now";
      if (sessionStorage.getItem(key) === null) sessionStorage.setItem(key, String(initialTime));
      Date.now = () => Number(sessionStorage.getItem(key));
    }, Date.now());
    const page = await context.newPage();
    const errors = [];
    let stage = "initial";
    const classify = text => ({ stage, hydration: /Hydration|hydration|did not match|server HTML/.test(text), time: /time|Date|Performance|measure/.test(text), functions: [...text.matchAll(/at ([A-Za-z][A-Za-z0-9_]*)/g)].slice(0, 5).map(match => match[1]) });
    page.on("pageerror", error => errors.push(classify(error.message + "\n" + error.stack)));
    page.on("console", message => {
      if (/hydration|did not match|server HTML/i.test(message.text())) errors.push(classify(message.text()));
    });
    await page.goto(`${root}/?location=chicago`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.getByRole("button", { name: "Eugene", exact: true }).waitFor();
    await page.waitForFunction(() => !document.querySelector('[aria-label="Choose your studio"] button').disabled);
    const timer = page.getByRole("timer");
    const banner = page.locator("main aside").first();
    if (await timer.count() === 0) {
      assert.equal(await banner.getAttribute("aria-label"), "Workshop offers");
      assert.doesNotMatch(await banner.innerText(), /Flash Sale|Sale ends in|active now/);
      await page.reload({ waitUntil: "domcontentloaded" });
      assert.equal(await timer.count(), 0);
      assert.equal(errors.length, 0, "No runtime or hydration errors");
      console.log("Workshop sale neutral fallback and refresh checks passed.");
      return;
    }

    const stored = () => page.evaluate(() => Object.entries(localStorage).find(([key]) => key.startsWith("ccf:workshop-sale:")));
    const advanceTime = (milliseconds, notify = true) => page.evaluate(({ milliseconds, notify }) => {
      sessionStorage.setItem("ccf:test:workshop-sale-now", String(Date.now() + milliseconds));
      if (notify) document.dispatchEvent(new Event("visibilitychange"));
    }, { milliseconds, notify });
    const original = await stored();
    const remaining = () => timer.getAttribute("aria-label").then(label => {
      const parts = label.match(/(\d+) hours, (\d+) minutes, (\d+) seconds/);
      return Number(parts[1]) * 3600 + Number(parts[2]) * 60 + Number(parts[3]);
    });
    const seconds = await remaining();
    assert.equal(await timer.getAttribute("aria-live"), "off");
    assert.match(await banner.innerText(), /HOURS[\s\S]*MINUTES[\s\S]*SECONDS/);
    const desktop = await banner.evaluate(element => {
      const message = element.querySelector("strong").getBoundingClientRect();
      const clock = element.querySelector('[role="timer"]').getBoundingClientRect();
      return { inline: message.top < clock.bottom && message.bottom > clock.top, width: clock.width };
    });
    assert.equal(desktop.inline, true, "Countdown stays inline when space permits");
    await banner.screenshot({ path: "/tmp/ccf-sale-desktop.png" });
    await advanceTime(1000, false);
    await page.waitForFunction(expected => {
      const label = document.querySelector('[role="timer"]')?.getAttribute("aria-label");
      const parts = label?.match(/(\d+) hours, (\d+) minutes, (\d+) seconds/);
      return parts && Number(parts[1]) * 3600 + Number(parts[2]) * 60 + Number(parts[3]) === expected;
    }, seconds - 1);
    assert.equal(await remaining(), seconds - 1);
    assert.equal(await timer.evaluate(element => element.getBoundingClientRect().width), desktop.width, "Digit width remains stable");
    await advanceTime(2 * 3_600_000);
    assert.equal(await remaining(), seconds - 1 - 7200, "Inactive-tab jump uses the absolute deadline");

    stage = "city-switch";
    await page.getByRole("button", { name: "Eugene", exact: true }).click();
    assert.match(page.url(), /location=eugene/);
    assert.equal(await remaining(), seconds - 7201);
    if (original) assert.deepEqual(await stored(), original);
    stage = "refresh";
    await page.reload({ waitUntil: "domcontentloaded" });
    await timer.waitFor();
    assert.equal(await remaining(), seconds - 7201);
    if (original) assert.deepEqual(await stored(), original);
    stage = "navigation";
    await page.goto(`${root}/?location=chicago`, { waitUntil: "domcontentloaded" });
    await timer.waitFor();
    assert.equal(await remaining(), seconds - 7201);
    if (original) assert.deepEqual(await stored(), original);

    for (const width of [375, 320]) {
      await page.setViewportSize({ width, height: 800 });
      const geometry = await banner.evaluate(element => {
        const clock = element.querySelector('[role="timer"]').getBoundingClientRect();
        const message = element.querySelector("strong").getBoundingClientRect();
        const bounds = element.getBoundingClientRect();
        return { overflow: document.documentElement.scrollWidth > innerWidth, contained: clock.left >= bounds.left && clock.right <= bounds.right, below: clock.top >= message.bottom };
      });
      assert.equal(geometry.overflow, false, `No overflow at ${width}px`);
      assert.equal(geometry.contained, true, `Countdown fits at ${width}px`);
      assert.equal(geometry.below, true, `Countdown wraps beneath the message at ${width}px`);
    }
    await banner.screenshot({ path: "/tmp/ccf-sale-mobile.png" });
    await advanceTime((await remaining()) * 1000 + 1000);
    await timer.waitFor({ state: "detached" });
    assert.equal(await banner.getAttribute("aria-label"), "Workshop offers");
    assert.doesNotMatch(await banner.innerText(), /Flash Sale|Sale ends in|active now/);
    await page.waitForTimeout(1100);
    assert.equal(await timer.count(), 0, "Expired countdown does not restart");
    stage = "expired-refresh";
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => !document.querySelector('[aria-label="Choose your studio"] button').disabled);
    assert.equal(await timer.count(), 0, "Expired countdown stays expired after refresh");
    if (original) assert.deepEqual(await stored(), original);
    assert.deepEqual(errors, [], "No runtime or hydration errors");
    console.log("Workshop sale desktop/mobile, ticking, inactive-tab accuracy, refresh/navigation, city switching, expiry persistence, and accessibility checks passed.");
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
