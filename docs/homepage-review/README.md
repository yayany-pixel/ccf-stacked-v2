# Color Cocktail Factory homepage review

The existing homepage was rebuilt around approved photography and direct, city-specific booking decisions. The first content blocks were Cauldron Pottery, Date Night on the Wheel, the working private-party form, and beginner wheel throwing. Ten activity cards appeared initially; each “Show me more” action added up to ten more without replacing the form or resetting the scroll position.

The implementation was reviewed locally through Netlify Dev on port 8889. No production deployment, DNS change, Acuity edit, appointment booking, or live test inquiry was performed. Screenshots show the implemented application, not mockups. Production publication still requires separate owner approval.

## A. Changed files

| Area | Files and purpose |
|---|---|
| Homepage | [app/page.tsx](../../app/page.tsx), [HomePageClient.tsx](../../components/HomePageClient.tsx), and [HomePageClient.module.css](../../components/HomePageClient.module.css) supplied the compact header, city selection, photograph-led feed, progressive disclosure, selected studio information, and responsive styling. |
| Activity data | [manifest.ts](../../lib/homepage/manifest.ts), [types.ts](../../lib/homepage/types.ts), [data.ts](../../lib/homepage/data.ts), and [server.ts](../../lib/homepage/server.ts) supplied the explicit mappings, current pricing, exact-calendar availability, failure handling, and timezone formatting. |
| Cached public endpoint | [app/api/homepage/route.ts](../../app/api/homepage/route.ts) reused the authenticated server catalog and batched class schedule. No credentials reached the browser. |
| Existing catalog | [lib/askccf/catalog.ts](../../lib/askccf/catalog.ts) retained the existing integration and exposed each public appointment's calendar IDs to the homepage adapter. |
| Existing form | [PrivateEventFormCard.tsx](../../components/PrivateEventFormCard.tsx) gained a homepage presentation, compact optional fields, preserved input state, and a city value controlled by the homepage selection. Its form name, required fields, honeypot, POST destination, conversion tracking, error handling, and success redirect stayed intact. |
| Navigation and chat | [PrivatePartyCTA.tsx](../../components/PrivatePartyCTA.tsx) linked homepage party actions to the embedded form and suppressed the overlapping floating party button there. [AskCCFWidget.tsx](../../components/askccf/AskCCFWidget.tsx) moved the homepage launcher into the menu, preserved dialog focus behavior, and preferred an explicit URL city over stored preferences. Other pages retained their existing launcher placement. |
| Shared styling | [app/globals.css](../../app/globals.css) added homepage-only footer styling and narrow-screen reflow corrections. Other page designs were preserved. |
| Approved assets | All 50 supplied photographs were retained under [public/images/classes](../../public/images/classes). Their original filenames, Drive IDs, dimensions, alt text, focal positions, and hosted paths were recorded in the manifest. |
| Tests | [homepage.ts](../../tests/homepage.ts), [homepage-browser.cjs](../../tests/homepage-browser.cjs), and [homepage-booking.cjs](../../tests/homepage-booking.cjs) added data, browser, and real-scheduler verification. [package.json](../../package.json) and [package-lock.json](../../package-lock.json) added the test commands and Playwright development dependency. |
| Review evidence | This report, [catalog-audit.md](catalog-audit.md), [browser-results.json](browser-results.json), [booking-verification.json](booking-verification.json), and the [screenshots](screenshots) recorded the mappings and verification results. |

The existing SEO metadata, valid existing structured data, global analytics scripts, gift-card destination, standalone private-events page, other activity pages, and form submission infrastructure were retained. The Netlify Forms activation script was run. No database migrations were changed.

## B–E. Manifest, image mappings, booking mappings, and city differences

The [complete catalog audit](catalog-audit.md) contains every activity-to-image and activity-to-booking mapping, including all appointment IDs, calendar IDs, source filenames, hosted image paths, Drive IDs, image dimensions, and review holds.

- **77 catalog records** were retained in one explicit activity manifest.
- **50 approved source photographs** were inventoried. No stock or newly generated replacement images were used, and no Drive originals were changed.
- **54 distinct offerings** were eligible for the homepage: 37 Chicago in-person classes, 16 Eugene in-person classes, and one clearly labelled Live Online Cauldron class.
- Chicago mode contained **38 cards** and Eugene mode **17 cards**, each including the same distinct online offering at the end. There were no duplicate cards within either feed.
- Chicago's first ten followed the requested priority, using the verified **VIP Date Night Painting** product in the painting position. It was not relabelled Sip & Paint.
- Eugene used its own Cauldron and wheel-date IDs. Cup Creations was the third activity; Matcha Bowl remained a separate later offering. Chicago-only products were omitted.
- City changes updated the activity, photograph, price, ticket unit, session, appointment ID, booking destination, form city, and studio address together. Explicit selection was saved using the existing preference keys and `location` query parameter.
- Chicago and Eugene sessions were formatted with their studio time zones, including daylight-saving transitions. Online Cauldron used the Chicago time zone with an explicit abbreviation.

The Chicago Date Night Pottery photograph was visually confirmed to depict wheel throwing and was assigned to appointment 79006071. Its filename was not used to infer the booking destination. The separate handbuilding date-night product was held for a suitable photograph. The approved terrarium photograph was shared between the distinct Chicago and Eugene terrarium offerings while their booking and pricing records remained separate.

## F. Passed checks

| Check | Result |
|---|---|
| TypeScript | `npx tsc --noEmit --incremental false` passed. |
| Changed-file lint | ESLint passed for all changed TypeScript/TSX files and new browser test scripts. |
| Existing tests | `npm test` passed. The existing self-test logged three database-unavailable messages while exercising its fallback behavior; the command exited successfully. |
| Homepage data tests | `npm run test:homepage` passed: complete image inventory, exact IDs, city isolation, ticket units, calendar filtering, inactive offerings, outages, empty results, timezone formatting, and daylight-saving transitions. |
| Browser verification | 24 recorded test groups passed, covering the required viewport matrix, progressive disclosure, state retention, all rendered booking hrefs, both city-switch directions, failure cases, form behavior, zoom/reflow, enlarged text, and chat city context. |
| Required viewport matrix | Chicago and Eugene were each rendered and checked at 390 × 650, 390 × 568, 375 × 667, 430 × 932, and 1440 × 900. |
| Mobile geometry | The initial activity cards fit the applicable normal-text viewport target, with complete booking buttons, at least 48px booking touch targets, and no horizontal overflow or clipped buttons. |
| Progressive disclosure | Exactly ten cards plus one form initially; subsequent batches added ten or all remaining cards. No duplicate cards, duplicate form, input-state loss, or scroll jump was observed. Hidden batches did not request their photographs on initial load. |
| Booking destinations | **54/54** real public scheduler destinations retained the intended appointment ID, displayed the exact expected appointment-type title, and did not preselect a date/time. This was not an HTTP-status-only check. Calendar assignments were independently confirmed with authenticated Acuity data. |
| Failure states | Provider outage, failed availability, empty bounded availability, missing image, missing booking URL, delayed responses, city switching during loading, and Show me more during loading passed. Known links stayed usable and dates were not invented. |
| Embedded form | Required-field and email validation, error/retry, success redirect, selected city, honeypot, and field retention passed against intercepted requests. No test inquiry reached the business inbox. |
| Accessibility | Narrow 195-CSS-pixel reflow (equivalent to a 200% zoom layout), 200% text enlargement at 390px, natural card growth, labels, keyboard focus, chat focus return, and non-overlapping launcher placement were checked. |

The existing authenticated catalog and batched public schedule were reused. The homepage did not create one Acuity request per card or per city change. Later images were lazy-loaded, and responsive image requests were capped at each source photograph's width.

## G. Failed checks and corrections

An initial data check found that Eugene Water Color for beginners (96478474) had no assigned calendar. That offering was moved to review status and was not advertised as bookable.

Slow-load testing found that city controls could receive a click before hydration completed. A readiness guard corrected that case. City-switch testing also caught the embedded form's city briefly lagging the homepage; its displayed city was bound directly to the homepage selection so both changed in the same render.

The zoom check exposed intrinsic date-field sizing, a minimum-width Show me more button, and footer grid/input overflow. Responsive sizing and wrapping corrected those cases without shrinking the text or hiding content. Chat layering was also checked after moving the launcher: opening the dialog closed the menu, and closing the dialog restored focus to the launcher.

The **full-project lint command still failed with 161 existing errors and one warning in unchanged files**, including existing unescaped text and conditional hooks in GoogleAnalytics. Those unrelated files were not refactored. Changed-file lint passed.

A production build was **not run**, because this project's execution rules prohibited build commands and reserved that validation for the platform. The implementation was compiled and rendered through Netlify Dev; production-build validation remains outstanding.

## H–J. Unresolved items, missing images, and availability

The three specifically unresolved mappings were resolved through authenticated Acuity data and passed public scheduler verification:

| Offering | Confirmed appointment ID |
|---|---|
| Boobs Coffee Mug — Chicago | 79187550 |
| Make And Paint — Wheel throwing | 95806344 |
| Date Night Watercolor for Two — Chicago | 94935292 |

No genuine generic Sip & Paint offering was found in the authenticated public catalog. The existing VIP painting products were kept distinct. The old Eugene ID 92719951 was not used; it appeared as a Mother’s Day product without an assigned calendar.

Twenty-one catalog records lacked a suitable approved photograph, including private/mapping holds. Two additional photographed offerings were held: Eugene generic watercolor needed a calendar/scheduling review, and the flash-sale wheel product needed confirmation that its promotion was intended. The [audit's held-offerings table](catalog-audit.md#missing-photographs-and-held-offerings) lists each record and reason. None was silently assigned another class's photograph or booking button.

The online pottery course (97904203) and online watercolor (97904869) were identified, but lacked suitable approved photos; online watercolor also had no calendar assignment. Only the approved, verified Live Online Cauldron appeared in the feed.

All 54 displayed offerings had a verified current price and next session in the captured live-data audit. The audit includes the complete availability state for all 77 records. Intermittent later availability timeouts were observed and exercised the “View upcoming dates” fallback. The homepage did not equate an empty 30-day lookup with having no future dates.

Eight displayed offerings had explicit two-person ticket coverage. The other 46 used **per ticket**, without assuming per-person pricing. No former prices, discounts, scarcity, ratings, or reviews were invented.

## K. Rendered screenshots

| Requested evidence | Screenshot |
|---|---|
| First 390 × 650 viewport | [Chicago mobile](screenshots/chicago-390x650.png) |
| One complete mobile activity card | [Date Night on the Wheel](screenshots/complete-mobile-card.png) |
| First two cards followed by the actual private-party form | [Opening sequence and form](screenshots/opening-and-private-party.png) |
| Full mobile page with the initial ten activities | [Chicago first ten](screenshots/chicago-first-ten-full.png) |
| Eugene mobile version | [Eugene 390 × 650](screenshots/eugene-390x650.png) |
| Desktop version | [Chicago 1440 × 900](screenshots/chicago-1440x900.png) |

Additional evidence includes [Eugene desktop](screenshots/eugene-1440x900.png), both cities at every other required viewport in the screenshots directory, [200% reflow](screenshots/200-percent-reflow.png), [200% enlarged text](screenshots/200-percent-text.png), and the [existing chat dialog](screenshots/chat-dialog.png).

Some captures show the honest availability fallback from a timed-out live lookup; others show the retrieved session. The screenshot data was not replaced with invented dates or prices.

## L. Owner review before launch

Review the image assignments, particularly the wheel photograph's misleading original filename and the shared terrarium photograph. Supply appropriate photos for held offerings that should join the feed. Confirm whether the flash-sale class should be advertised.

Confirm ticket coverage where Acuity does not specify it, numeric age policies for adult-themed classes, and the Eugene Date Night Terrarium audience: its current description also mentions ages 5–12. These ambiguities were documented instead of being resolved by guessing or editing Acuity.

Review the rendered screenshots, complete the platform's production-build validation, and give separate approval before production publication.

### Repeating the checks

With dependencies installed, start the existing application using `netlify dev --port 8889`. The browser tests default to that local address and intercept form/chat test submissions. They block unrelated external browser traffic so mocked conversions and inquiries do not reach live services.

```sh
npx playwright install chromium
npm run test:homepage
npm run test:homepage:browser
npm run test:homepage:booking
```

The booking test makes read-only public scheduler requests. The browser tests regenerate the screenshot and test-result artifacts in this review directory. Future offerings should be added to the manifest only after separately verifying the product, city, appointment/calendar IDs, ticket coverage, and approved photograph.
