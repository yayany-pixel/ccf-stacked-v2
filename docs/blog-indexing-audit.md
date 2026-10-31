# Indexable blog inventory

Registry before: **284** posts. Indexable after: **79**. Noindexed after: **205**.

Word counts cover editorial intros, section headings, body paragraphs, lists, image captions and FAQs. They exclude page titles, metadata, site navigation, footers, author cards and generated related links. Structured guide counts exclude shared booking components; handwritten counts include any booking copy authored inline in the article body. Sources identify the rendered editorial content (registry entries are assembled in lib/blogPosts.ts).

**57 posts are under 600 words.** They remain indexable as requested; the threshold is an editorial review flag, not an automatic indexing rule.

Reproduce: `node --import tsx scripts/blog-indexing-audit.ts`.

| Slug | Source file | Words | Review |
| --- | --- | ---: | --- |
| pottery-101-beginners-guide | `app/blog/[slug]/page.tsx` | 350 | **Under 600** |
| japanese-warrior-cedar-bonsai | `components/blog/CedarBonsaiArticle.tsx` | 355 | **Under 600** |
| wheel-vs-handbuilding-mushroom-ceramics | `lib/workshopGuides/mushroom.ts` | 400 | **Under 600** |
| chicago-date-night-ideas | `app/blog/[slug]/page.tsx` | 420 | **Under 600** |
| rainy-day-activities-eugene-wine-glass-painting | `lib/workshopGuides/wineGlass.ts` | 424 | **Under 600** |
| cottagecore-pottery-mushroom-bowls | `lib/workshopGuides/mushroom.ts` | 427 | **Under 600** |
| creative-things-to-do-pilsen-mosaic-art | `lib/workshopGuides/mosaic.ts` | 427 | **Under 600** |
| mushroom-pottery-classes-chicago-eugene | `lib/workshopGuides/mushroom.ts` | 429 | **Under 600** |
| adults-only-pottery-classes-chicago | `lib/workshopGuides/dildos.ts` | 430 | **Under 600** |
| mosaic-making-group-parties-chicago | `lib/workshopGuides/mosaic.ts` | 432 | **Under 600** |
| cute-pottery-classes-chicago-cat-vase | `lib/workshopGuides/catVase.ts` | 435 | **Under 600** |
| cat-themed-pottery-ideas | `lib/workshopGuides/catVase.ts` | 445 | **Under 600** |
| handmade-gifts-for-wine-lovers | `lib/workshopGuides/wineGlass.ts` | 448 | **Under 600** |
| wine-glass-painting-date-night-chicago | `lib/workshopGuides/wineGlass.ts` | 448 | **Under 600** |
| dildos-and-bottles-pottery-chicago | `lib/workshopGuides/dildos.ts` | 454 | **Under 600** |
| handmade-gifts-for-cat-lovers | `lib/workshopGuides/catVase.ts` | 458 | **Under 600** |
| how-to-make-mushroom-bowl | `lib/workshopGuides/mushroom.ts` | 459 | **Under 600** |
| mosaic-pattern-ideas-for-beginners | `lib/workshopGuides/mosaic.ts` | 462 | **Under 600** |
| creative-bachelorette-sculpture-workshops | `lib/workshopGuides/pussy.ts` | 465 | **Under 600** |
| cups-mugs-tumblers-wheel-throwing | `lib/workshopGuides/cup.ts` | 466 | **Under 600** |
| glass-ceramic-stone-mosaic-tiles | `lib/workshopGuides/mosaic.ts` | 468 | **Under 600** |
| sculpt-human-form-in-clay | `lib/workshopGuides/dildos.ts` | 468 | **Under 600** |
| pottery-wheel-classes-chicago-eugene-first-cup | `lib/workshopGuides/cup.ts` | 472 | **Under 600** |
| unusual-bachelorette-party-ideas-chicago | `lib/workshopGuides/dildos.ts` | 475 | **Under 600** |
| sculpt-organic-forms-clay | `lib/workshopGuides/pussy.ts` | 476 | **Under 600** |
| what-is-pussy-pottery | `lib/workshopGuides/pussy.ts` | 476 | **Under 600** |
| body-positive-art-workshops-chicago | `lib/workshopGuides/pussy.ts` | 477 | **Under 600** |
| handmade-ceramic-cup-food-safe | `lib/workshopGuides/cup.ts` | 479 | **Under 600** |
| playful-pottery-parties-chicago | `lib/workshopGuides/dildos.ts` | 479 | **Under 600** |
| employee-appreciation-day-ideas-chicago | `lib/localFeatures/privateEvents.ts` | 481 | **Under 600** |
| how-to-make-ceramic-vase-waterproof | `lib/workshopGuides/catVase.ts` | 486 | **Under 600** |
| mushroom-pottery-ideas | `lib/workshopGuides/mushroom.ts` | 488 | **Under 600** |
| wine-glass-painting-ideas-for-beginners | `lib/workshopGuides/wineGlass.ts` | 489 | **Under 600** |
| mosaic-art-for-beginners | `lib/workshopGuides/mosaic.ts` | 492 | **Under 600** |
| springfield-to-eugene-creative-half-day | `lib/localFeatures/eugene.ts` | 493 | **Under 600** |
| adult-birthday-party-ideas-eugene-groups | `lib/localFeatures/eugene.ts` | 496 | **Under 600** |
| chinatown-pilsen-food-art-itinerary | `lib/localFeatures/chicagoNeighborhoods.ts` | 507 | **Under 600** |
| family-reunion-art-workshops-chicago-eugene | `lib/localFeatures/eugene.ts` | 507 | **Under 600** |
| how-hard-is-making-a-cup-pottery-wheel | `lib/workshopGuides/cup.ts` | 508 | **Under 600** |
| human-body-in-ceramic-art | `lib/workshopGuides/pussy.ts` | 511 | **Under 600** |
| chicago-pink-line-art-food-creative-stops | `lib/localFeatures/chicagoNeighborhoods.ts` | 521 | **Under 600** |
| creative-bridal-shower-ideas-chicago | `lib/localFeatures/privateEvents.ts` | 523 | **Under 600** |
| how-to-paint-wine-glasses | `lib/workshopGuides/wineGlass.ts` | 523 | **Under 600** |
| how-to-make-a-ceramic-cup-on-wheel | `lib/workshopGuides/cup.ts` | 524 | **Under 600** |
| chicago-things-to-do-visiting-parents | `lib/localFeatures/chicagoSocial.ts` | 531 | **Under 600** |
| eugene-uo-student-family-weekend-things-to-do | `lib/localFeatures/eugene.ts` | 532 | **Under 600** |
| bridgeport-to-pilsen-art-culture-afternoon | `lib/localFeatures/chicagoNeighborhoods.ts` | 536 | **Under 600** |
| how-to-make-friends-adult-chicago-creative-activities | `lib/localFeatures/chicagoSocial.ts` | 538 | **Under 600** |
| chicago-baby-shower-creative-activities | `lib/localFeatures/privateEvents.ts` | 542 | **Under 600** |
| things-to-do-near-uic-creative-guide | `lib/localFeatures/chicagoNeighborhoods.ts` | 543 | **Under 600** |
| creative-chicago-introverts-low-pressure-outings | `lib/localFeatures/chicagoSocial.ts` | 548 | **Under 600** |
| how-to-make-a-cat-vase | `lib/workshopGuides/catVase.ts` | 549 | **Under 600** |
| eugene-family-school-break-activities | `lib/localFeatures/eugene.ts` | 564 | **Under 600** |
| indoor-things-to-do-chicago-bad-weather | `lib/localFeatures/seasonalBuyer.ts` | 570 | **Under 600** |
| holiday-gift-exchange-experiences-not-clutter | `lib/localFeatures/seasonalBuyer.ts` | 583 | **Under 600** |
| winter-date-night-ideas-chicago-cozy-experiences | `lib/localFeatures/seasonalBuyer.ts` | 586 | **Under 600** |
| one-day-art-classes-vs-pottery-firing-comparison | `lib/localFeatures/seasonalBuyer.ts` | 598 | **Under 600** |
| west-loop-to-pilsen-creative-date-itinerary | `lib/localFeatures/chicagoNeighborhoods.ts` | 628 | — |
| what-is-colonoware-american-pottery-history | `components/blog/ColonowareArticle.tsx` | 631 | — |
| what-do-creative-workshops-cost-comparison | `lib/localFeatures/seasonalBuyer.ts` | 654 | — |
| double-date-ideas-chicago-15-activities | `lib/localFeatures/chicagoSocial.ts` | 664 | — |
| small-company-holiday-party-ideas-chicago | `lib/localFeatures/privateEvents.ts` | 711 | — |
| eugene-date-ideas-beyond-coffee-15-experiences | `lib/localFeatures/eugene.ts` | 743 | — |
| byob-activities-chicago-guide | `lib/localDiscovery/chicagoOne.ts` | 778 | — |
| eugene-date-night-ideas | `lib/localDiscovery/legacyEugene.ts` | 782 | — |
| chicago-winter-date-nights-indoors | `lib/localDiscovery/chicagoTwo.ts` | 808 | — |
| chicago-team-building-cost-10-20-50 | `lib/localDiscovery/chicagoTwo.ts` | 881 | — |
| chicago-paint-and-sip-alternatives | `lib/localDiscovery/chicagoOne.ts` | 889 | — |
| chicago-without-alcohol-sober-night-out-ideas | `lib/localFeatures/chicagoSocial.ts` | 900 | — |
| chicago-date-nights-under-100 | `lib/localDiscovery/chicagoTwo.ts` | 908 | — |
| eugene-bachelorette-party-ideas-8-to-20 | `lib/localDiscovery/eugene.ts` | 915 | — |
| pilsen-restaurants-before-after-pottery | `lib/localDiscovery/chicagoOne.ts` | 922 | — |
| pottery-classes-chicago-guide | `app/blog/[slug]/page.tsx` | 974 | — |
| rainy-day-things-to-do-eugene-oregon | `lib/localDiscovery/eugene.ts` | 998 | — |
| university-of-oregon-visiting-student-eugene-weekend | `lib/localDiscovery/eugene.ts` | 1031 | — |
| holiday-party-ideas-chicago-eugene-2026 | `lib/localDiscovery/holiday.ts` | 1173 | — |
| art-classes-near-me | `app/blog/art-classes-near-me/page.tsx` | 1225 | — |
| pilsen-student-guide | `app/blog/[slug]/page.tsx` | 1935 | — |
| chicago-pottery-classes-beginners-guide | `app/blog/[slug]/page.tsx` | 2374 | — |

The existing redirect from `/blog/pottery-classes-chicago-guide` to `/blog/chicago-pottery-classes-beginners-guide` is unchanged. Both existing registry entries remain in this inventory; no redirects are added by this change.
