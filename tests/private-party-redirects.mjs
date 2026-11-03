import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { parse } from "node:url";
import config from "../next.config.mjs";

const require = createRequire(import.meta.url);
const { getPathMatch } = require("next/dist/shared/lib/router/utils/path-match");
const { prepareDestination } = require("next/dist/shared/lib/router/utils/prepare-destination");
const { getRedirectStatus } = require("next/dist/lib/redirect-status");
const redirects = await config.redirects();

for (const [incoming, expectedCity] of [
  ["/activities/private-parties?city=eugene&utm_source=qa&tag=one&tag=two", "eugene"],
  ["/activities/private-parties?city=chicago&utm_source=qa&tag=one&tag=two", "chicago"],
  ["/chicago/private-parties?city=eugene&utm_source=qa&tag=one&tag=two", "chicago"],
  ["/eugene/private-parties?city=chicago&utm_source=qa&tag=one&tag=two", "eugene"],
  ["/chicago/private-parties?utm_source=qa&tag=one&tag=two", "chicago"],
  ["/eugene/private-parties?utm_source=qa&tag=one&tag=two", "eugene"],
]) {
  const { pathname, query } = parse(incoming, true);
  const route = redirects.find(candidate => getPathMatch(candidate.source)(pathname));
  assert.ok(route, `Redirect must match ${incoming}`);
  assert.equal(route.statusCode, 301);
  assert.equal(route.permanent, undefined, "Explicit HTTP 301 must not use Next's default 308");
  assert.equal(getRedirectStatus(route), 301);
  const { parsedDestination } = prepareDestination({
    appendParamsToQuery: false,
    destination: route.destination,
    params: getPathMatch(route.source)(pathname),
    query,
  });
  assert.equal(parsedDestination.pathname, "/private-events");
  assert.equal(parsedDestination.query.city, expectedCity);
  assert.equal(parsedDestination.query.utm_source, "qa");
  assert.deepEqual(parsedDestination.query.tag, ["one", "two"]);
}

console.log("All three private-party routes resolve as HTTP 301; queries survive and path city wins conflicts.");
