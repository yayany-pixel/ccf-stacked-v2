# The CCF Curiosity Studio

New `/play` experience in the existing Next.js website. Review the Netlify deploy preview before merging to production.

## Features

- Warm ivory, terracotta, graphite and cobalt visual direction with original illustrated clay artwork.
- Live class finder using the existing server-only Acuity catalog and availability integration. Location, date range, group size, budget and craft filters. Availability is cached by the existing catalog for up to two minutes; checkout confirms the final booking.
- Group budgets use whole ticket quantities. Listings with unknown coverage appear only with Any budget and an explicit checkout note. Multi-session courses retain enrollment conditions and are labeled as courses.
- Three-question maker match with native sharing, clipboard fallback, and safe share URLs containing only a predefined match key.
- Illustrated inspiration gallery with expandable captions. These are AI-generated studio daydreams, not student work. Replace with approved real student photographs for a future Museum of Beautiful Mistakes.
- Homepage teaser, city navigation entry, footer link, existing Ask CCF widget. The duplicate floating private-party button is suppressed on `/play`; private events remain linked in the finder and existing footer.
- Scoped responsive styles, keyboard controls, labeled fields, reduced motion, request cancellation when filters change, and honest empty/error states.
- Existing analytics records `play_spin`, `play_match_shown`, `play_quiz_complete`, `play_share`, and `play_booking_click`. Booking clicks do not claim a completed purchase.

## Artwork provenance

Created with the built-in image-generation tool, then compressed to WebP without creative edits. Assets are committed under `public/images/play/`.

Hero prompt: refined mixed-media editorial still life on warm ivory paper, an imperfect fingerprint-textured terracotta vase with cobalt pencil squiggle and pen/colored-pencil meadow flowers, pale yellow bowl, tiny bonsai, clay mushroom and colored pencils. Sophisticated independent ceramics atelier art-book aesthetic; no text or logos.

Gallery prompt: three equally spaced separate clay objects on warm ivory paper: a leaning terracotta star mug, a yellow wavy bowl with cobalt spiral, and a little cluster of clay mushrooms. Tactile clay texture, graphite outlines and colored-pencil shading. No text, borders, labels or cartoon faces.

## Validation

`npm test` includes date/time-zone boundaries, input rejection, quiz routing, odd-group ticket math, unknown pricing, filtered Acuity results, no availability and upstream failure. `npx tsc --noEmit` validates types. Netlify's production build is the deployment gate. Record browser preview checks before review.

No new credentials, database migrations, AI model calls, or customer submissions are required.
