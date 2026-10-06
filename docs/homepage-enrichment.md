# Homepage content sources

Workshop duration, descriptions, pickup notes, and up to three upcoming sessions come from matched Acuity catalog records and available public slots. Missing or mismatched records do not generate invented details. Turkish lamp options retain exact appointment IDs; the combined card uses the product-group identity until a specific variant is selected. Mixed prices or ticket units do not produce a shared headline price.

Studio addresses come from `lib/locations.ts`. Visiting and private-party guidance uses the existing `lib/askccf/knowledge.ts` records. Parking facilities are not verified, so the page offers directions and recommends contacting staff. Cancellation policies differ by booking and are not generalized. Group sizes are planning guidance, subject to staff confirmation.

The gallery uses approved workshop images from the homepage manifest and their existing alt text. It does not claim a named guest endorsement or guarantee a particular outcome.

Customer reviews belong in `lib/homepage/reviews.ts`. Add only verifiable public reviews or customer-approved quotations, including accurate attribution, city, workshop, source URL, and source label. There were no verified reviews in the repository at implementation time. The owner chose to keep reviews hidden for now. The review section remains hidden while this list is empty; no ratings, counts, or quotes are fabricated.

Filter selection uses the central analytics layer (`homepage_filter_selected`, city, placement, class_category). Standard visibility, selection, and booking events remain active. Variant clicks emit one selection and one checkout with the exact Acuity appointment ID. No description text, review text, or customer form data is added to analytics.

Validation: `npm run test:homepage`, `npx tsc --noEmit --incremental false`, `npm run test:analytics`, and `node tests/homepage-enrichment.cjs` against Netlify dev on port 8889. The browser test uses fixture catalog data and blocks external browser requests.
