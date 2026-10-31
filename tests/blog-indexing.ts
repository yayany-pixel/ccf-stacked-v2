import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sitemap from "../app/sitemap";
import { generateMetadata, generateStaticParams } from "../app/blog/[slug]/page";
import { generateMetadata as artClassesMetadata } from "../app/blog/art-classes-near-me/page";
import BlogPage from "../app/blog/page";
import RelatedArticles from "../components/blog/RelatedArticles";
import WorkshopGuidePage from "../components/blog/WorkshopGuidePage";
import {
  blogPosts, getAllBlogPosts, getBlogPostBySlug, getBlogPostsByAuthor,
  getIndexableBlogPosts, getRelatedPosts, isIndexable,
} from "../lib/blogPosts";
import { workshopGuides, getWorkshopGuideBySlug } from "../lib/workshopGuides";
import { expandedWorkshopGuides, expandedEditorialSeries } from "../lib/workshopGuides/expanded";
import { localFeaturePosts } from "../lib/localFeatures";
import { localDiscoveryBlogPosts } from "../lib/localDiscovery";

// Next handles the JSX runtime in production; standalone tsx tests use React.
Object.assign(globalThis, { React });

async function main() {
  const expandedSlugs = new Set(expandedWorkshopGuides.map((post) => post.slug));
  const flagged = blogPosts.filter((post) => !isIndexable(post));
  const indexable = getIndexableBlogPosts();
  const urls = new Set((await sitemap()).map((entry) => entry.url));
  const blogUrl = (slug: string) => `https://colorcocktailfactory.com/blog/${slug}`;

  assert.equal(expandedEditorialSeries.length, 41);
  assert.equal(expandedSlugs.size, 205);
  assert.equal(new Set(blogPosts.map((post) => post.slug)).size, blogPosts.length);
  assert.equal(indexable.length, getAllBlogPosts().length - flagged.length);
  assert.ok(isIndexable({ ...blogPosts[0], indexable: undefined }), "missing flag defaults to indexable");
  assert.ok(!isIndexable(undefined), "unknown posts cannot become navigation links");

  for (const slug of expandedSlugs) {
    assert.equal(getBlogPostBySlug(slug)?.indexable, false, slug);
    assert.ok(!urls.has(blogUrl(slug)), `${slug} must not appear in sitemap`);
  }
  for (const post of blogPosts.filter((post) => post.relatedActivitySlugs.includes("glass-blowing"))) {
    assert.equal(post.indexable, false, post.slug);
    assert.ok(!urls.has(blogUrl(post.slug)), post.slug);
  }
  for (const post of indexable) assert.ok(urls.has(blogUrl(post.slug)), post.slug);
  assert.equal([...urls].filter((url) => url.includes("/blog/")).length, indexable.length);

  const staticSlugs = new Set((await generateStaticParams()).map(({ slug }) => slug));
  for (const post of flagged) {
    assert.ok(staticSlugs.has(post.slug), `${post.slug} must still be built`);
    const metadata = await generateMetadata({ params: { slug: post.slug } });
    assert.deepEqual(metadata.robots, { index: false, follow: true }, post.slug);
    assert.equal(metadata.alternates?.canonical, blogUrl(post.slug), "canonical remains self-referencing");
  }
  for (const slug of ["what-is-colonoware-american-pottery-history", "japanese-warrior-cedar-bonsai"]) {
    assert.ok(isIndexable(getBlogPostBySlug(slug)), "new handwritten articles stay indexable");
    assert.equal((await generateMetadata({ params: { slug } })).robots, undefined);
  }
  const original = "how-to-make-a-cat-vase";
  assert.equal((await generateMetadata({ params: { slug: original } })).robots, undefined);
  assert.equal(artClassesMetadata().robots, undefined, "dedicated static blog route stays indexable");
  const originals = workshopGuides.filter((guide) => !expandedSlugs.has(guide.slug));
  assert.equal(originals.length, 35);
  for (const post of [...originals, ...localFeaturePosts, ...localDiscoveryBlogPosts]) {
    assert.ok(isIndexable(getBlogPostBySlug(post.slug)), post.slug);
  }
  for (const post of blogPosts) {
    for (const slug of post.relatedPostSlugs) assert.ok(isIndexable(getBlogPostBySlug(slug)), slug);
    assert.ok(getRelatedPosts(post).every(isIndexable));
    assert.ok(getBlogPostsByAuthor(post.authorSlug).every(isIndexable));
  }

  // Exercise rendering, not just the helpers: all pagination/filter variants
  // must exclude flagged links and empty workshop topics.
  const flaggedSlugs = new Set(flagged.map((post) => post.slug));
  function assertCleanLinks(html: string) {
    for (const match of html.matchAll(/href="\/blog\/([^"?#]+)[^"]*"/g)) {
      assert.ok(!flaggedSlugs.has(match[1]), `No internal link to ${match[1]}`);
    }
  }
  const listedSlugs = new Set<string>();
  for (let page = 1; page <= Math.ceil(indexable.length / 24); page++) {
    const html = renderToStaticMarkup(React.createElement(BlogPage, { searchParams: { page: String(page) } }));
    assertCleanLinks(html);
    assert.doesNotMatch(html, /<option value="(?:ghost|glass-blowing|gift-cards)"/);
    for (const match of html.matchAll(/href="\/blog\/([^"?#]+)"/g)) listedSlugs.add(match[1]);
  }
  assert.deepEqual([...listedSlugs].sort(), indexable.map((post) => post.slug).sort());
  for (const activity of new Set(workshopGuides.map((guide) => guide.activitySlug))) {
    assertCleanLinks(renderToStaticMarkup(React.createElement(BlogPage, { searchParams: { activity } })));
  }
  assert.equal(renderToStaticMarkup(React.createElement(RelatedArticles, { slugs: [...flaggedSlugs, "unknown-post"] })), "");
  const mixed = renderToStaticMarkup(React.createElement(RelatedArticles, { slugs: [original, ...flaggedSlugs] }));
  assert.match(mixed, /href="\/blog\/how-to-make-a-cat-vase"/);
  assertCleanLinks(mixed);

  const ghost = getWorkshopGuideBySlug("halloween-ghost-clay-class-chicago")!;
  const rendered = renderToStaticMarkup(React.createElement(WorkshopGuidePage, { guide: ghost, post: getBlogPostBySlug(ghost.slug)! }));
  assert.match(rendered, /See current dates and prices on the <a[^>]+href="\/activities\/ghost"/);
  assertCleanLinks(rendered);
  const guideText = (activity: string) => JSON.stringify(expandedWorkshopGuides.filter((guide) => guide.activitySlug === activity));
  assert.match(guideText("glass-blowing"), /coming soon; visit the .*waitlist updates/);
  for (const activity of ["candle-making", "date-night-candle", "oogie-boogie"]) {
    assert.match(guideText(activity), /never leave a lit candle unattended/);
  }
  assert.match(guideText("soap"), /lye and requires specialized safeguards/);
  assert.match(guideText("terrarium"), /Glass containers can overheat/);
  assert.match(guideText("matcha-bowl"), /properly fired glaze intended for food contact/);
  for (const activity of ["pipe-and-ashtray", "boobs-mug"]) assert.match(guideText(activity), /21 and over/);
  assert.doesNotMatch(JSON.stringify(expandedWorkshopGuides), /Not from this article|Does sending a request reserve a date|Can I assume a gift card covers every extra fee|No schedule should be assumed/);

  console.log(`Blog indexing passed: ${blogPosts.length} total, ${indexable.length} indexable, ${flagged.length} noindexed; URLs, metadata, navigation and safety copy verified.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
