# The Cauldron Factory — review only

Route: `/cauldron`. Existing Netlify project: `teal-concha-819f3e` (59df13dc-1a2e-40e2-8a0c-20901ea6422e). Branch: `cauldron-factory-review`, draft PR #6. Do not merge or swap the homepage without owner approval.

## Revision 02: seamless and clearer
- Removed the card grid, card containers, shadows, framed hero arch, and repeated panel backgrounds.
- One continuous atmospheric canvas. Featured classes use open alternating photo/text spreads; remaining classes use aligned thumbnail/name/price/booking rows.
- Clear headings and preserved order: Cauldron → Date Night Pottery (wheel and hand-building) → Private Parties → Wheel Throwing → All Other Classes.
- Private-party image fades into the surrounding page. Mobile feature photography extends to screen edges; catalog rows remain compact with visible prices and booking links.
- Sticky section navigation, city controls, class search/filter, larger price labels, reduced-motion support and optional fire ambience.
- Existing Acuity catalog, appointment-specific URLs, price units, class images, online/contact links, finishing notes, and location safeguards remain.
- `app/page.tsx`, `app/layout.tsx`, Ask CCF integration, analytics, footer, and private-event backend are unchanged. No new dependencies, secrets, or fabricated class data.

## Validation performed for revision 02
- TypeScript transpilation: zero syntax diagnostics. CSS parsed with PostCSS. All component CSS selectors resolve.
- Offline Chromium layout fixture exercised populated and unavailable-catalog states at 320, 390, 768, 1024, and 1440px. No horizontal document overflow or out-of-bounds headings/prices/booking links; featured/list containers have transparent backgrounds. Desktop and phone fixture layouts were visually inspected.
- Fixture data and local screenshots are NOT committed or published. These checks are not live Acuity, chat, or checkout verification and are not a full React hydration test.
- Netlify build/deploy status must be checked separately. The live preview URL could not be opened by the conversation web/browser network, so online end-to-end verification remains outstanding.

## Remaining audit before production
1. Confirm actual class photography and catalog loading; approve the most mystical owned cauldron image. The existing Acuity-image selection is retained, not independently curated.
2. Approve a genuine private-party/group photograph; current fallback uses the cauldron image when no public private-session image exists.
3. Confirm date-night matches, prices/ticket coverage, location, pickup terms, and complete Acuity booking journeys.
4. Test Ask CCF replies, iOS Safari, keyboard/VoiceOver, audio playback, and interaction with the inherited sticky controls.
5. Do not publish production, merge, modify environments/domains, or replace the homepage without approval.

## Later homepage swap
After explicit approval, reuse the reviewed component in `app/page.tsx`, remove its review ribbon/noindex as appropriate, update the canonical, and retain a rollback in version control. Keep existing root integrations intact.
