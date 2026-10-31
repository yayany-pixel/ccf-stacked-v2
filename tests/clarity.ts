import assert from "node:assert/strict";
import { clarityPageAllowed, createClarityController, CLARITY_PROJECT_ID } from "../lib/clarity";

const tags: any[] = [];
const fakeWindow = {
  location: { hostname: "colorcocktailfactory.com", pathname: "/" },
  ccfPrivacyPreferences: { analytics: false, marketing: false },
  clarity: undefined as any,
};
Object.defineProperty(globalThis, "window", { value: fakeWindow, configurable: true });
Object.defineProperty(globalThis, "navigator", { value: { globalPrivacyControl: false, doNotTrack: "0" }, configurable: true });
Object.defineProperty(globalThis, "document", { value: {
  createElement: () => ({}), head: { appendChild: (tag: unknown) => tags.push(tag) },
}, configurable: true });

const sync = createClarityController();
sync();
assert.equal(tags.length, 0, "No tracker before consent");
fakeWindow.ccfPrivacyPreferences.analytics = true;
sync();
assert.equal(tags.length, 1);
assert.equal(tags[0].src, `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`);
assert.deepEqual(fakeWindow.clarity.q, [["consentv2", { analytics_Storage: "granted", ad_Storage: "denied" }]]);
sync();
assert.equal(tags.length, 1, "No duplicate tag on repeated updates");
assert.equal(fakeWindow.clarity.q.length, 1);

// Revocation before the remote script resolves must queue denial AND stop.
fakeWindow.ccfPrivacyPreferences.analytics = false;
sync();
assert.deepEqual(fakeWindow.clarity.q.slice(-2), [
  ["consentv2", { analytics_Storage: "denied", ad_Storage: "denied" }], ["stop"],
]);

// Simulate the loaded API; reconsent resumes, and SPA navigation still gates it.
const calls: unknown[][] = [];
fakeWindow.clarity = (...args: unknown[]) => calls.push(args);
fakeWindow.ccfPrivacyPreferences = { analytics: true, marketing: false };
sync();
assert.deepEqual(calls[0], ["start"]);
assert.equal(tags.length, 1);
fakeWindow.ccfPrivacyPreferences.marketing = true;
sync();
assert.deepEqual(calls.at(-1), ["consentv2", { analytics_Storage: "granted", ad_Storage: "granted" }]);
fakeWindow.location.pathname = "/teach/instructors/dashboard";
sync();
assert.deepEqual(calls.at(-1), ["stop"]);
fakeWindow.location.pathname = "/activities/turkish-lamp";
sync();
assert.deepEqual(calls.at(-2), ["start"]);
Object.defineProperty(globalThis, "navigator", { value: { globalPrivacyControl: true }, configurable: true });
sync();
assert.deepEqual(calls.at(-1), ["stop"], "Browser privacy signals override saved consent");

for (const path of ["/analytics", "/api/privacy", "/thanks/private-party", "/book/chicago/mosaic", "/teach/apply"]) {
  assert.equal(clarityPageAllowed("colorcocktailfactory.com", path), false);
}
for (const host of ["localhost", "deploy-preview-1--ccfstackedv2.netlify.app", "colorcocktailfactory.com.example.com"]) {
  assert.equal(clarityPageAllowed(host, "/"), false);
}
assert.equal(clarityPageAllowed("www.colorcocktailfactory.com", "/activities/turkish-lamp"), true);
console.log("Clarity: consent gating, queued revocation, resumption, single injection, route exclusions, and privacy signals passed.");
