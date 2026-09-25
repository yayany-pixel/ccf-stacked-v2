# The Cauldron Factory — review branch

New route: `/cauldron` in the existing `ccf-stacked-v2` Next.js application. Target existing Netlify project: `teal-concha-819f3e` (59df13dc-1a2e-40e2-8a0c-20901ea6422e).

## Implemented
- Cauldron hero → date night (wheel + hand-building) → private parties → wheel throwing → other local public classes → online/contact → practical FAQs.
- Approved name, subtitle, and CCF endorsement; responsive charcoal/plum/copper design; subtle firelight and embers.
- Optional synthesized fireplace ambience, off by default, user gesture required, stopped on hide/unmount. Pause-atmosphere control and reduced-motion support.
- Chicago/Eugene selection; explicit Chicago cauldron label when no Eugene cauldron exists; unknown-location listings are not silently assigned to a studio.
- Server-only use of existing getCatalog() Acuity reader. Current prices, ticket coverage and appointment-specific links; no new secrets or invented data.
- Root layout still supplies AskCCFWidget, footer, analytics and private-event CTA; no duplicate integrations.
- Existing homepage is untouched. Review ribbon and noindex on new page.

## Audit before publishing or swapping homepage
1. Full npm run build, lint and existing tests with project dependencies. Conversation checks were TypeScript transpilation/CSS parsing, not a production build.
2. Confirm Acuity access in preview context. Failure remains visible rather than inventing prices.
3. Visually approve the actual cauldron image returned by Acuity. An artistic comparison of all photos was not completed. public/images currently has no project photography; no stock/AI substitute introduced.
4. Private-party imagery uses an available public private-session image, otherwise the cauldron class image. Replace with an approved group photograph when available.
5. Verify date-night wheel and hand-building matches; ordinary hand-building is labeled as such when a separate couple-priced listing is absent.
6. Verify complete booking journeys, price units, location, finishing and pickup. Booking clicks are not purchase events.
7. Test mobile chat/sticky CTA spacing, keyboard, VoiceOver, iOS Safari, image errors, sound and reduced motion.
8. Do not publish production, merge, replace app/page.tsx, modify environment variables or change domains before owner approval.

## Homepage swap after explicit approval
Reuse the new component in app/page.tsx, remove review ribbon and noindex there, update canonical to /. Keep /cauldron as the campaign landing route with appropriate canonical. Leave root layout unchanged and retain the old homepage in version history.
