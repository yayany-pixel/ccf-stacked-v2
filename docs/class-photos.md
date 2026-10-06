# Class photos

The 50 approved WebP photos come from the [shared Drive folder](https://drive.google.com/drive/folders/17HDWG2QYM_POUbF61Gm_mk0OSn5Y9kxL). They are versioned site assets under `public/images/classes/`, deployed to Netlify with the application. This fixed editorial library uses Netlify's static asset hosting and Image CDN; it does not need a runtime database or upload endpoint. Drive is the import source, not a visitor-facing image host.

`lib/homepage/manifest.ts` records the original filenames, Drive IDs, dimensions, alt text, focal points, and reviewed appointment assignments. Exact appointment IDs share those assignments with public events and assistant recommendations. Classes without an approved assignment do not receive a guessed photo.

`lib/classImageLoader.ts` requests responsive widths from Netlify Image CDN at quality 75, capped at 1200 pixels. Format negotiation and transformation caching are handled by Netlify. The homepage also caps requests at each original image's width, reserves layout space, prioritizes the first card, and lazily loads subsequent images. Each source filename includes the first 12 characters of its SHA-256 hash to give replacements a fresh cache URL.

To replace a photo, download the approved WebP, validate its dimensions, append its content hash to its filename, and update its manifest path and descriptive fields. Keep appointment assignments explicit. Run `npm run test:homepage` to check the inventory and class mappings. Verify image CDN responses on the deployed preview; plain Next.js development does not emulate that service.
