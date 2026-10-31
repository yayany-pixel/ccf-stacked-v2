import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { blogPosts, getIndexableBlogPosts } from "../lib/blogPosts";
import { getWorkshopGuideBySlug } from "../lib/workshopGuides";
import { getLocalFeatureBySlug } from "../lib/localFeatures";
import { localFeatureWordCount } from "../lib/localFeatures/types";
import { getLocalDiscoveryGuideBySlug } from "../lib/localDiscovery";

function words(parts: string[]) {
  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

function sourceFor(directory: string, slug: string) {
  const source = readdirSync(directory)
    .filter((name) => name.endsWith(".ts") && !["index.ts", "types.ts", "author.ts"].includes(name))
    .map((name) => path.posix.join(directory, name))
    .find((file) => readFileSync(file, "utf8").includes(`"${slug}"`));
  if (!source) throw new Error(`No editorial source found for ${slug}`);
  return source;
}

function find(node: ts.Node, predicate: (node: ts.Node) => boolean): ts.Node | undefined {
  return predicate(node) ? node : ts.forEachChild(node, (child) => find(child, predicate));
}

/** Follow dedicated handwritten article components without hardcoding each slug. */
function handwrittenSource(slug: string) {
  if (slug === "art-classes-near-me") return "app/blog/art-classes-near-me/page.tsx";
  const source = "app/blog/[slug]/page.tsx";
  const file = ts.createSourceFile(source, readFileSync(source, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const branch = find(file, (node) => ts.isIfStatement(node) && ts.isBinaryExpression(node.expression)
    && ts.isIdentifier(node.expression.left) && node.expression.left.text === "slug"
    && ts.isStringLiteral(node.expression.right) && node.expression.right.text === slug);
  const returned = branch && find(branch, (node) => ts.isReturnStatement(node)
    && !!node.expression && ts.isJsxSelfClosingElement(node.expression));
  if (returned && ts.isReturnStatement(returned) && returned.expression && ts.isJsxSelfClosingElement(returned.expression)) {
    const name = returned.expression.tagName.getText(file);
    const imported = file.statements.find((node): node is ts.ImportDeclaration => ts.isImportDeclaration(node)
      && node.importClause?.name?.text === name);
    if (imported && ts.isStringLiteral(imported.moduleSpecifier) && imported.moduleSpecifier.text.startsWith("@/")) {
      return `${imported.moduleSpecifier.text.slice(2)}.tsx`;
    }
  }
  return source;
}

/** Count authored body copy, excluding metadata and imported UI components. */
function handwrittenWords(source: string, slug: string) {
  const file = ts.createSourceFile(source, readFileSync(source, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const branch = source.includes("[slug]")
    ? find(file, (node) => ts.isIfStatement(node) && ts.isBinaryExpression(node.expression)
      && ts.isIdentifier(node.expression.left) && node.expression.left.text === "slug"
      && ts.isStringLiteral(node.expression.right) && node.expression.right.text === slug)
    : file;
  if (!branch) throw new Error(`No handwritten article branch for ${slug}`);
  const body = find(branch, (node) => ts.isJsxElement(node)
    && (node.openingElement.tagName.getText(file) === "article" || node.openingElement.attributes.properties.some((attribute) => ts.isJsxAttribute(attribute)
      && attribute.name.getText(file) === "className" && attribute.initializer
      && ts.isStringLiteral(attribute.initializer) && attribute.initializer.text.includes("mt-12 space-y-8"))));
  if (!body) throw new Error(`No editorial body found for ${slug}`);
  const parts: string[] = [];
  function collect(node: ts.Node) {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(file) === "header") return;
    if (ts.isJsxText(node)) parts.push(node.text);
    else if (ts.isJsxExpression(node) && node.expression && ts.isStringLiteral(node.expression)) parts.push(node.expression.text);
    else ts.forEachChild(node, collect);
  }
  collect(body);
  return words(parts);
}

const rows = getIndexableBlogPosts().map((post) => {
  const workshop = getWorkshopGuideBySlug(post.slug);
  const feature = getLocalFeatureBySlug(post.slug);
  const discovery = getLocalDiscoveryGuideBySlug(post.slug);
  let source: string;
  let count: number;
  if (workshop) {
    source = sourceFor("lib/workshopGuides", post.slug);
    count = words([...workshop.intro, ...workshop.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.tips ?? [])]), ...workshop.faqs.flatMap((f) => [f.question, f.answer])]);
  } else if (feature) {
    source = sourceFor("lib/localFeatures", post.slug);
    count = localFeatureWordCount(feature);
  } else if (discovery) {
    source = sourceFor("lib/localDiscovery", post.slug);
    count = words([...discovery.intro, ...discovery.sections.flatMap((s) => [s.heading, ...s.paragraphs,
      ...(s.picks ?? []).flatMap((p) => [p.title, p.description]), ...(s.tips ?? [])]), ...discovery.faqs.flatMap((f) => [f.question, f.answer])]);
  } else {
    source = handwrittenSource(post.slug);
    count = handwrittenWords(source, post.slug);
  }
  return { slug: post.slug, source, count };
}).sort((a, b) => a.count - b.count || a.slug.localeCompare(b.slug));

console.log("# Indexable blog inventory\n");
console.log(`Registry before: **${blogPosts.length}** posts. Indexable after: **${rows.length}**. Noindexed after: **${blogPosts.length - rows.length}**.\n`);
console.log("Word counts cover editorial intros, section headings, body paragraphs, lists, image captions and FAQs. They exclude page titles, metadata, site navigation, footers, author cards and generated related links. Structured guide counts exclude shared booking components; handwritten counts include any booking copy authored inline in the article body. Sources identify the rendered editorial content (registry entries are assembled in lib/blogPosts.ts).\n");
console.log(`**${rows.filter((row) => row.count < 600).length} posts are under 600 words.** They remain indexable as requested; the threshold is an editorial review flag, not an automatic indexing rule.\n`);
console.log("Reproduce: `node --import tsx scripts/blog-indexing-audit.ts`.\n");
console.log("| Slug | Source file | Words | Review |\n| --- | --- | ---: | --- |");
for (const row of rows) console.log(`| ${row.slug} | \`${row.source}\` | ${row.count} | ${row.count < 600 ? "**Under 600**" : "—"} |`);
console.log("\nThe existing redirect from `/blog/pottery-classes-chicago-guide` to `/blog/chicago-pottery-classes-beginners-guide` is unchanged. Both existing registry entries remain in this inventory; no redirects are added by this change.");
