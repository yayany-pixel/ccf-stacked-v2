import assert from "node:assert/strict";

const origin = process.argv[2] || "http://127.0.0.1:3000";
for (const city of ["chicago", "eugene"]) {
  for (const suffix of ["", "/beginner-wheel", "/gift-cards", "/kids-birthday-parties", "/kids-pottery-classes"]) {
    const url = new URL(`/${city}${suffix}`, origin);
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(60000) });
    assert.equal(response.status, 200, `${url.pathname} must remain reachable without a redirect`);
    const html = await response.text();
    assert.match(response.headers.get("content-type") || "", /text\/html/);
    assert.match(html, /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/, `${url.pathname} must render its page`);
    assert.doesNotMatch(html, /<title>404:|This page could not be found|NEXT_NOT_FOUND/,
      `${url.pathname} must not be a soft 404`);
    console.log(`200 ${url.pathname}`);
  }
}
console.log("Both city homepages and all eight nested activity/gift/kids routes passed HTTP smoke checks.");
