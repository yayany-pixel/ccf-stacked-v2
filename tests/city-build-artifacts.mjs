import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const buildDir = ".next";
const failures = [];
for (const filename of ["BUILD_ID", "prerender-manifest.json", "routes-manifest.json"]) {
  if (!fs.existsSync(path.join(buildDir, filename))) failures.push(`Missing production artifact: ${filename}`);
}

const manifestPath = path.join(buildDir, "server/app-paths-manifest.json");
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};

for (const route of [
  "/[city]/page",
  "/[city]/[slug]/page",
  "/[city]/kids-birthday-parties/page",
  "/[city]/kids-pottery-classes/page",
]) {
  const modulePath = manifest[route];
  if (!modulePath) failures.push(`Missing city route in production manifest: ${route}`);
  else if (!fs.existsSync(path.join(buildDir, "server", modulePath))) {
    failures.push(`Manifest references missing module: ${modulePath}`);
  }
}

assert.deepEqual(failures, [], `Incomplete production build; do not start/deploy:\n${failures.join("\n")}`);
console.log("Production city homepage, nested activity/gift and both kids route modules are present.");
