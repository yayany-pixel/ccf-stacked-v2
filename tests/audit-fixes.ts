import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  currentPrivacyPreferences, googleConsentState, parsePrivacyPreferences,
  DENIED_PREFERENCES,
} from "../lib/privacy";
import { readPrivacyPreferences, savePrivacyPreferences, PRIVACY_COOKIE } from "../lib/privacy.server";
import sitemap from "../app/sitemap";

async function main() {
  assert.equal(parsePrivacyPreferences({ analytics: "yes", marketing: true }), null);
  assert.equal(parsePrivacyPreferences({ analytics: true }), null);
  assert.equal(parsePrivacyPreferences(null), null);
  assert.deepEqual(parsePrivacyPreferences({ analytics: true, marketing: false, email: "ignored" }), { analytics: true, marketing: false });
  assert.deepEqual(currentPrivacyPreferences(), DENIED_PREFERENCES);
  Object.defineProperty(globalThis, "navigator", { value: { globalPrivacyControl: false, doNotTrack: "0" }, configurable: true });
  Object.assign(globalThis, { window: { ccfPrivacyPreferences: { analytics: true, marketing: false } } });
  assert.deepEqual(currentPrivacyPreferences(), { analytics: true, marketing: false });
  Object.defineProperty(globalThis, "navigator", { value: { globalPrivacyControl: true }, configurable: true });
  assert.deepEqual(currentPrivacyPreferences(), DENIED_PREFERENCES);
  assert.deepEqual(googleConsentState({ analytics: true, marketing: false }), {
    analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  });

  let savedId = "";
  let saves = 0;
  let reads = 0;
  const preferences = { analytics: true, marketing: false };
  const store = {
    async read(id: string) { reads += 1; assert.equal(id, savedId); return preferences; },
    async save(id: string, choices: typeof preferences) { saves += 1; savedId = id; assert.deepEqual(choices, preferences); },
  };
  const origin = "https://colorcocktailfactory.com";
  const request = (body: unknown, source = origin, cookie?: string) => new Request(`${origin}/api/privacy`, {
    method: "POST",
    headers: { origin: source, "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body),
  });
  const fresh = await readPrivacyPreferences(new Request(`${origin}/api/privacy`), store);
  assert.deepEqual(await fresh.json(), { preferences: null });
  assert.equal(reads, 0);
  assert.equal((await savePrivacyPreferences(request({ analytics: "yes", marketing: true }), store)).status, 400);
  assert.equal((await savePrivacyPreferences(request(preferences, "https://untrusted.invalid"), store)).status, 403);
  assert.equal(saves, 0);
  const saved = await savePrivacyPreferences(request(preferences), store);
  assert.equal(saved.status, 200);
  assert.deepEqual(await saved.json(), { preferences });
  const cookie = saved.headers.get("set-cookie")!;
  assert.match(cookie, /HttpOnly; SameSite=Lax; Secure/);
  assert.match(cookie, /Max-Age=15552000/);
  assert.equal(saved.headers.get("cache-control"), "private, no-store");
  assert.match(savedId, /^[a-f0-9]{64}$/);
  const restored = await readPrivacyPreferences(new Request(`${origin}/api/privacy`, { headers: { cookie } }), store);
  assert.deepEqual(await restored.json(), { preferences });
  assert.equal(reads, 1);
  const previousId = savedId;
  await savePrivacyPreferences(request(preferences, origin, cookie), store);
  assert.equal(savedId, previousId);
  const unavailable = { read: async () => { throw new Error("private-server-detail"); }, save: async () => { throw new Error("private-server-detail"); } };
  const failed = await savePrivacyPreferences(request(preferences, origin, cookie), unavailable);
  assert.equal(failed.status, 503);
  assert.doesNotMatch(await failed.text(), /private-server-detail/);
  assert.match(failed.headers.get("set-cookie")!, /Max-Age=0/);
  const expired = await readPrivacyPreferences(new Request(`${origin}/api/privacy`, { headers: { cookie: `${PRIVACY_COOKIE}=${savedId}` } }), { ...store, read: async () => null });
  assert.deepEqual(await expired.json(), { preferences: null });


  const config = (await import(pathToFileURL(resolve("next.config.mjs")).href)).default;
  const environment: Record<string, string | undefined> = process.env;
  const previousEnvironment = environment.NODE_ENV;
  environment.NODE_ENV = "production";
  const headers = Object.fromEntries((await config.headers())[0].headers.map((header: { key: string; value: string }) => [header.key, header.value]));
  assert.equal(headers["X-Frame-Options"], "DENY");
  assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.doesNotMatch(String(headers["Content-Security-Policy"]), /unsafe-eval/);
  for (const rule of ["object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'", "form-action 'self'", "https://colorcocktailfactory.as.me"]) assert.ok(String(headers["Content-Security-Policy"]).includes(rule));
  environment.NODE_ENV = "development";
  assert.match((await config.headers())[0].headers[0].value, /unsafe-eval/);
  if (previousEnvironment === undefined) delete environment.NODE_ENV;
  else environment.NODE_ENV = previousEnvironment;
  assert.doesNotMatch(readFileSync("netlify.toml", "utf8"), /\[\[headers\]\]/);
  assert.match(readFileSync("netlify.toml", "utf8"), /ENABLE_SIMPLE_ANALYTICS = "false"/);

  function checkMains(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = `${directory}/${entry.name}`;
      if (entry.isDirectory()) checkMains(file);
      else if (file.endsWith(".tsx")) {
        const source = readFileSync(file, "utf8");
        for (const main of source.matchAll(/<main\b[^>]*>/g)) {
          assert.match(main[0], /id="main-content"/, file);
          assert.match(main[0], /tabIndex=\{-1\}/, file);
        }
      }
    }
  }
  checkMains("app");
  for (const path of ["app/teach/instructors/login/page.tsx", "app/teach/instructors/dashboard/page.tsx", "components/teach/InstructorPortalNotice.tsx"]) {
    assert.doesNotMatch(readFileSync(path, "utf8"), /<form|type="password"|href: "#"|Jan 15, 2026/);
  }
  const entries = await sitemap();
  assert.ok(entries.length > 10);
  assert.ok(entries.filter(entry => entry.lastModified).every(entry => entry.url.includes("/blog/")));
  console.log("Audit regression checks passed: consent validation and persistence handlers, fail-closed errors, CSP, accessible landmarks, safe portal, and sitemap dates.");
}

main();
