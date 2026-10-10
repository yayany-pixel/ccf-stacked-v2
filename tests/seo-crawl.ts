import assert from 'node:assert/strict';
import routes from '../lib/legacy-city-routes.json';
import { sections } from '../lib/config';
import { cities } from '../lib/links';
import { chicagoSections } from '../lib/chicago-config';
import { eugeneSections } from '../lib/eugene-config';
import { buildActivityMetadata, summarizeSearchDescription } from '../lib/seo';
const valid = new Set(sections.map(s => s.slug));
for (const [city, configured] of Object.entries({ chicago: chicagoSections, eugene: eugeneSections })) {
  for (const section of configured) for (const child of section.subClasses || []) {
    const source = `/${city}/${child.slug}`;
    const target = (routes as Record<string, string>)[source] || source;
    assert.equal(target.split('/')[1], city, `Cross-city target: ${source}`);
    assert.ok(valid.has(target.split('/')[2]), `Missing destination: ${target}`);
    assert.ok(!(target in routes), `Redirect chain: ${source}`);
  }
}
for (const city of cities) for (const section of sections) {
  const m = buildActivityMetadata(city, section);
  assert.equal(m.alternates?.canonical, `https://colorcocktailfactory.com/${city.param}/${section.slug}`);
  assert.ok(m.description?.includes(city.label));
  assert.ok(m.description!.length <= 160);
}
assert.equal(summarizeSearchDescription('', 'Specific class details.'), 'Specific class details.');
assert.equal(summarizeSearchDescription('   ', 'Specific class details.'), 'Specific class details.');
assert.ok(summarizeSearchDescription('A useful sentence. '.repeat(30), 'Fallback').length <= 160);
console.log('SEO crawl checks passed: every configured city sub-class resolves without cross-city redirects or chains; canonicals and blank event descriptions covered.');
