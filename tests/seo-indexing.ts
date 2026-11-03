import assert from "node:assert/strict";
import fs from "node:fs";
import sitemap from "../app/sitemap";
import { blogPosts } from "../lib/blogPosts";
import { boilerplateLocalGuideSlugs, isBlogPostIndexable } from "../lib/blogIndexing";
import { expandedWorkshopGuides } from "../lib/workshopGuides/expanded";
import { localFeatures } from "../lib/localFeatures";
import { localDiscoveryGuides } from "../lib/localDiscovery";
import { cities } from "../lib/links";
import { buildCityMetadata } from "../lib/seo";
import { localBusinessJsonLd } from "../lib/structuredData";
import { STUDIO_LOCATIONS } from "../lib/locations";

async function main() {
  const entries = await sitemap();
  const paths = entries.map(entry => new URL(entry.url).pathname);
  assert.equal(new Set(paths).size, paths.length, "Sitemap URLs must be unique");
  assert.equal(expandedWorkshopGuides.length, 205);
  for (const post of expandedWorkshopGuides) {
    assert.equal(isBlogPostIndexable(post.slug), false);
    assert.ok(!paths.includes(`/blog/${post.slug}`));
  }
  assert.equal(boilerplateLocalGuideSlugs.length, 13);
  const reviewedLocalGuides = [...localFeatures, ...localDiscoveryGuides];
  assert.equal(reviewedLocalGuides.length, 35);
  assert.equal(reviewedLocalGuides.filter(post => isBlogPostIndexable(post.slug)).length, 22);
  for (const post of reviewedLocalGuides) {
    assert.equal(paths.includes(`/blog/${post.slug}`), isBlogPostIndexable(post.slug));
  }
  assert.ok(blogPosts.some(post => isBlogPostIndexable(post.slug)));
  assert.ok(!paths.includes("/activities/private-parties"));
  for (const entry of entries) {
    const path = new URL(entry.url).pathname;
    if (!path.startsWith("/blog/")) assert.equal(entry.lastModified, undefined);
    if (/^\/(chicago|eugene)\//.test(path)) {
      assert.match(path, /^\/(chicago|eugene)\/kids-(birthday-parties|pottery-classes)$/);
    }
  }
  const titles = new Set();
  const descriptions = new Set();
  for (const city of cities) {
    const meta = buildCityMetadata(city);
    assert.equal(meta.alternates?.canonical, `https://colorcocktailfactory.com/${city.param}`);
    titles.add(JSON.stringify(meta.title));
    descriptions.add(meta.description);
    const schema = localBusinessJsonLd(city);
    assert.equal(schema.address.streetAddress, STUDIO_LOCATIONS[city.param].streetAddress);
    assert.equal(schema.url, `https://colorcocktailfactory.com/${city.param}`);
    assert.ok(paths.includes(`/${city.param}`));
  }
  assert.equal(titles.size, 2);
  assert.equal(descriptions.size, 2);
  const blogRoute = fs.readFileSync("app/blog/[slug]/page.tsx", "utf8");
  assert.ok(blogRoute.includes("robots: { index: isBlogPostIndexable(post.slug), follow: true }"));
  const cityRoute = fs.readFileSync("app/[city]/page.tsx", "utf8");
  assert.ok(cityRoute.includes("<HomePageClient initialData={data} initialCity={city} />"));
  const cityLayout = fs.readFileSync("app/[city]/layout.tsx", "utf8");
  assert.doesNotMatch(cityLayout, /export\s+(?:const\s+dynamicParams|(?:async\s+)?function\s+generateStaticParams)/,
    "Homepage parameter constraints must not move to the shared layout and restrict nested routes");
  const cityActivityRoute = fs.readFileSync("app/[city]/[slug]/page.tsx", "utf8");
  assert.ok(cityActivityRoute.includes("cities.flatMap"));
  assert.ok(cityActivityRoute.includes("sections.map"));
  for (const slug of ["kids-birthday-parties", "kids-pottery-classes"]) {
    const route = fs.readFileSync(`app/[city]/${slug}/page.tsx`, "utf8");
    assert.ok(route.includes("generateStaticParams"));
    assert.ok(route.includes('{ city: "chicago" }'));
    assert.ok(route.includes('{ city: "eugene" }'));
  }
  const config = fs.readFileSync("next.config.mjs", "utf8");
  assert.doesNotMatch(config, /source: ['"]\/(?:chicago|eugene)['"], destination: ['"]\/\?city=/);
  assert.ok(config.includes("source: '/activities/private-parties', destination: '/private-events', statusCode: 301"));
  for (const city of ["chicago", "eugene"]) {
    assert.ok(config.includes(`source: '/${city}/private-parties', destination: '/private-events?city=${city}', statusCode: 301`));
  }
  console.log("SEO indexing, sitemap, city metadata/schema and redirect regressions passed.");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
