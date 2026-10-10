# Color Cocktail Factory crawl investigation — October 10, 2026

## Production identity

The authenticated Netlify project record identifies `teal-concha-819f3e` (`59df13dc-1a2e-40e2-8a0c-20901ea6422e`) as the project serving https://colorcocktailfactory.com.
Its published deploy `6aca8ec145b5530b48b41ba1` is ready, production, branch `main`, commit `c8d13f4ab8dfeec7fcf94ae8c2531217a7a5ab87` in https://github.com/yayany-pixel/ccf-stacked-v2.
Published October 10 at 19:17:24 UTC (12:17 Pacific), after the 08:00 UTC Moz email.
A separate `ccfstackedv2` project serves the same commit at its Netlify domain; it is not the custom-domain project.

## Evidence and scope

The support mailbox message `1a124d3c7fdaaf20` confirms 107 new issues, 199 total issues and 221 crawled URLs. The breakdown is 43 long titles, 25 long descriptions, 15 duplicate-content issues, 14 short descriptions, eight 4xx and two missing descriptions. These are issue counts, not necessarily distinct affected pages.

Moz's detailed report requires login and was not retrieved. The independent HTTP GET crawl started at approximately 20:02 UTC. It checked all 106 sitemap entries plus 113 distinct same-host links discovered from those pages. It is a one-hop, server-HTML crawl, not a full JavaScript-rendered or historical Moz crawl. Do not equate its counts with Moz's.

Results: 219 requested URLs; 182 final HTTP 200 responses (156 on the website and 26 external booking destinations), 36 HTTP 404s, and one HTTP 308 response (`/corporate`, an existing redirect). The inventory preserves requested and final URLs, metadata and response statuses. Root URL spellings with and without the trailing slash are separate inventory rows, not separate pages.

## Confirmed failures, in priority order

### Broken internal links

All 36 404s originate in sub-class chips on `/chicago` or `/eugene`. The chip slugs do not exist in the base section list used by the city detail route's static parameters. See `broken-links.csv` for each source, affected URL and replacement.

The patch updates those internal links to their existing same-city parent category and adds explicit permanent redirects for previously shared broken URLs. It does not invent new class pages, claim current availability, redirect visitors across cities, or change booking destinations. A future dedicated class page should replace its corresponding legacy mapping when introduced.

### Duplicate city detail content

The 16 base activity slugs each produced identical visible main text between Chicago and Eugene: private-parties, date-night-wheel, beginner-wheel, handbuilding, mosaic, turkish-lamp, glass-fusion, glass-blowing, bonsai, terrarium, candle-making, wine-glass-painting, paper-pigment, painting, parent-and-me, gift-cards.

Their self-canonicals already correctly identify separate city URLs. Retain them: the cities have distinct booking intent. The patch adds city to each main heading and displays the existing confirmed studio address and local calendar time zone. This removes exact-text identity and helps users confirm location, but does not guarantee that Moz will stop flagging near-duplicates. Most activity copy remains shared; further city-specific copy should use verified local details, not invented differentiation.

External Acuity destination pages and redirect-only pages must not be treated as duplicated internal landing-page content. The empty-main hash is excluded from the duplicate finding.

### Missing event descriptions

The live HTML lacked descriptions on:

- `/events/acuity-79187550-2026-10-11-1905`
- `/events/acuity-79188019-2026-10-11-1915`

The patch supplies a class-specific fallback when feed descriptions are blank or whitespace and summarizes long event descriptions without changing the visible event copy, structured data or booking links. These two examples are independently found, not confirmed matches to Moz's two rows.

### Metadata recommendations

Among 156 internal HTTP 200 inventory rows, 44 titles exceed 60 characters, 83 descriptions exceed 160, and 30 descriptions are nonempty but shorter than 70. These are audit heuristics, not Google's hard limits or Moz's verified thresholds. Many rows are date-specific event pages.

Changes shorten city, activity, blog, collection and audience metadata; add useful context to brief activity descriptions; remove duplicated author/course branding; and avoid unsupported promotional claims in the site default. Visible activity copy, prices, schedules, booking handlers, analytics components and consent logic are unchanged except for location clarification and corrected sub-class navigation.

Google states that meta descriptions have no fixed length limit; snippets are truncated to fit device width. Duplicate content is not automatically a spam violation. Treat these as relevance and presentation work after real broken navigation.

- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/crawling-indexing/canonicalization

## Validation and release

TypeScript and the focused SEO routing checks pass. Existing homepage and audit regression checks pass. A local production build succeeds; collection rendering logs expected `acuity_not_configured` messages because this checkout has no production credentials. This build does not validate live session inventory or checkout.

The new routing test checks every configured city sub-class, city preservation, real destination slugs, no redirect chains, retained city canonicals and empty event description handling. Production release must use the existing project's deployment path; do not manually upload a credential-free local build over production.

## Remaining Moz data required

Export the October 10 crawl issue rows for all six categories (or the entire crawl) with: exact URL including query string, issue type, crawl time, response code, redirect destination, referring/source URLs, current title/description and measured length, canonical URL, robots/noindex status, and duplicate-group IDs plus every paired URL. Include previous crawl date/status if available. This is needed to reconcile the original eight 4xx and 15 duplicate groups and distinguish already-fixed, expired-event and remaining issues. A fresh Moz crawl after deployment is required to confirm its issue totals.
