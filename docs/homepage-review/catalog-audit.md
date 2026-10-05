# Activity, image, and booking audit

The public Acuity catalog and approved Google Drive folder were inspected on 2026-10-05. This document is a review snapshot; the homepage reads prices and upcoming sessions from the authenticated server integration at runtime. It does not use the figures below as fallback prices or dates.

The manifest retained 77 offerings and all 50 approved image records. There were 54 distinct eligible offerings: 37 Chicago in-person offerings, 16 Eugene in-person offerings, and one Live Online Cauldron offering. The online offering appeared at the end of both city feeds, giving 38 Chicago-mode cards and 17 Eugene-mode cards.

## Booking mappings

Destinations in held records were retained for review only, and were not rendered as homepage booking buttons. All 54 displayed destinations were opened in a real browser; each retained its appointment ID, displayed the exact expected Acuity title, and did not preselect a date or time. Calendar IDs below came from authenticated Acuity appointment-type data.

| Key / public title | Exact Acuity title | Appointment / calendar IDs | Activity-specific destination | Homepage state |
|---|---|---|---|---|
| chicago-cauldron<br>Cauldron Pottery | Spin A Spell- Make your Own Clay Cauldron | 95588506<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=95588506) | ready |
| eugene-cauldron<br>Cauldron Pottery | Spin A Spell- Make your Own Clay Cauldron | 96657402<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=96657402) | ready |
| chicago-date-night-wheel<br>Date Night Pottery on the Wheel | Date Night on the Pottery Wheel - Chicago | 79006071<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79006071) | ready |
| eugene-date-night-wheel<br>Date Night Pottery on the Wheel | Eugene Date Night On The Wheel | 91935746<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=91935746) | ready |
| chicago-beginner-wheel<br>Wheel Throwing for Beginners | Wheel Throwing for Beginners - Chicago | 79006616<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79006616) | ready |
| eugene-cup-creations<br>Beginner Wheel: Cup Creations | Eugene Wheel Throwing for Beginners: Cup creations | 93539343<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=93539343) | ready |
| chicago-turkish-lamp<br>Turkish Mosaic Lamp | Turkish Mosaic Lamp - Chicago | 95416771<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=95416771) | ready |
| chicago-mug-and-bowl<br>Ceramic Mug and a Bowl | Ceramic Mug and a Bowl - Chicago | 79186725<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79186725) | ready |
| eugene-mug-and-bowl<br>Ceramic Mug and a Bowl | Eugene: Ceramic Mug and a Bowl | 90210750<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=90210750) | ready |
| chicago-terrarium<br>Terrarium Workshop | Terrarium Workshop - Chicago | 79189013<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79189013) | ready |
| eugene-date-night-terrarium<br>Date Night Terrarium | Eugene 🌿 Date Night Terrarium Workshop | 89290193<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=89290193) | ready |
| chicago-mosaic<br>Mosaic Creations | Mosaic Creations - Chicago | 79182319<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79182319) | ready |
| chicago-candle<br>Candle Making | Candle Making - Chicago | 79185767<br>12216179, 13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79185767) | ready |
| chicago-vip-paint-night<br>VIP Date Night Painting | VIP DATE NIGHT PAINT NIGHT | 97020385<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=97020385) | ready |
| eugene-vip-paint-night<br>VIP Date Night Painting | VIP Date Night Paint Night | 94058109<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=94058109) | ready |
| chicago-cat-vase<br>Cat Vase Making | Cat Vase Making - Chicago | 79181599<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79181599) | ready |
| chicago-clay-pumpkin<br>Clay Pumpkin Lantern | Halloween Pottery: Carve Your Own Clay Pumpkin | 96889121<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=96889121) | ready |
| chicago-glass-fusion<br>Glass Fusion | Glass Fusion - Chicago | 79183146<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79183146) | needs-photo |
| chicago-bonsai<br>Bonsai for Beginners | Bonsai for Beginners: Hands-On Workshop - Chicago | 79188910<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79188910) | ready |
| chicago-date-night-on-fire<br>Date Night on Fire | Date Night On Fire - VIP EXPERIENCE | 95023345<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=95023345) | ready |
| chicago-paint-pottery<br>Paint Your Own Pottery | Paint Pottery - Chicago | 79183668<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79183668) | ready |
| chicago-wine-glass-painting<br>Wine Glass Painting | Wine Glass Painting - Chicago | 79374003<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79374003) | ready |
| eugene-wine-glass-painting<br>Wine Glass Painting | Wine Glass Painting | 95909935<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=95909935) | ready |
| chicago-mushroom<br>Mushroom Pottery | Mushroom Pottery - Chicago | 79188019<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79188019) | ready |
| eugene-mushroom<br>Mushroom Pottery | Eugene Mushroom Pottery | 90532757<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=90532757) | ready |
| chicago-watercolor<br>Watercolor for Beginners | Water Color For Beginners | 95947521<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=95947521) | ready |
| eugene-watercolor<br>Watercolor for Beginners | Water Color for beginners | 96478474<br>Unassigned | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=96478474) | needs-review |
| chicago-matcha-bowl<br>Matcha Bowl on the Wheel | Wheel Throwing for Beginners -Make Your Own Matcha Bowl | 94782793<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=94782793) | ready |
| eugene-matcha-bowl<br>Beginner Wheel: Matcha Bowl | Eugene Wheel Throwing for Beginners: Matcha Bowl | 89287658<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=89287658) | ready |
| chicago-date-night-candle<br>Date Night Candle Making | Date Night Candle Making | 95415406<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=95415406) | ready |
| chicago-ghost<br>Ghost Pottery | Halloween Ghost Pottey! | 98180179<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=98180179) | ready |
| chicago-oogie-boogie<br>Oogie Boogie Candle Holder | OOGIE BOOGIE INSPIRED CANDLE HOLDER \| HALLOWEEN POTTERY | 97524789<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=97524789) | ready |
| eugene-oogie-boogie<br>Oogie Boogie Candle Holder | OOGIE BOOGIE INSPIRED CANDLE HOLDER \| HALLOWEEN POTTERY | 98908868<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=98908868) | ready |
| chicago-monster-lantern<br>Monster Lantern Pottery | MONSTER POTTERY! HALLOWEEN LANTERN CLASS | 97573448<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=97573448) | ready |
| chicago-hanging-turkish-lamp<br>Hanging Turkish Mosaic Lamp | Hanging Turkish Mosaic Lamp - Chicago | 79374537<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79374537) | ready |
| chicago-date-night-handbuilding<br>Date Night Handbuilding | Chicago Date Night Pottery | 94930972<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=94930972) | needs-photo |
| chicago-charcuterie-board<br>Make & Paint a Charcuterie Board | Charcuterie Board Make And Paint | 96649100<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=96649100) | ready |
| eugene-charcuterie-board<br>Make Your Own Charcuterie Board | Eugene : Make Your Own Charcuterie Board | 98845998<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=98845998) | ready |
| chicago-handbuilt-vase<br>Handbuilt Vase Making | Handbuilding For Beginners - Vase Making | 96491249<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=96491249) | ready |
| chicago-soap<br>Soap Making | Soap Making - Chicago | 79274876<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79274876) | ready |
| eugene-duck-soap-holder<br>Duck Soap Holder | Eugene Duck Soap holder | 98334198<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=98334198) | ready |
| chicago-open-studio<br>Open Studio Wheel Throwing | Open Studio Wheel throwing | 95911163<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=95911163) | ready |
| chicago-cup-creations<br>Cup Creations on the Wheel | Wheel Throwing for Beginners -Cup Creations | 94782668<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=94782668) | ready |
| chicago-wheel-pumpkin<br>Pumpkin on the Wheel | Throw A Pumpkin On The Wheel | 98548612<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=98548612) | ready |
| eugene-ceramic-chess<br>Date Night Ceramic Chess | Date Night: Make Your Own Ceramic Chess Set ♟️ | 97861588<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=97861588) | ready |
| chicago-date-night-watercolor<br>Date Night Watercolor for Two | Date Night Watercolor Painting for Two - Chicago | 94935292<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=94935292) | ready |
| eugene-date-night-watercolor<br>Date Night Watercolor for Two | Date Night Watercolor Painting for Two - Eugene | 94932997<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=94932997) | ready |
| eugene-date-night-bonsai<br>VIP Date Night Bonsai | Date Night Bonsai VIP | 94058299<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=94058299) | ready |
| chicago-wheel-vase<br>Vase Making on the Wheel | Wheel Throwing for Beginners -Vase Making | 94782880<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=94782880) | ready |
| chicago-date-night-turkish-lamp<br>Date Night Turkish Mosaic Lamp | Date Night Turkish Mosaic Lamp - Chicago | 95894050<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=95894050) | ready |
| chicago-make-and-paint-wheel<br>Make & Paint on the Wheel | Make And Paint - Wheel throwing | 95806344<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=95806344) | ready |
| chicago-flash-sale-wheel<br>Flash Sale Beginner Wheel | FLASH SALE BEGINNERS WHEEL THROWING | 96113161<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=96113161) | promotion-unconfirmed |
| chicago-acuity-79186489<br>Ceramic Bunny Cup - Chicago | Ceramic Bunny Cup - Chicago | 79186489<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79186489) | needs-photo |
| chicago-acuity-94782610<br>Wheel Throwing for Beginners -Make Your Own Plate Set | Wheel Throwing for Beginners -Make Your Own Plate Set | 94782610<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=94782610) | needs-photo |
| chicago-acuity-96474464<br>Wheel Throwing for Beginners - Fat Belly Mugs | Wheel Throwing for Beginners - Fat Belly Mugs | 96474464<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=96474464) | needs-photo |
| chicago-acuity-97799262<br>Touch-n-Clay PlayDay | Touch-n-Clay PlayDay | 97799262<br>Unassigned | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=97799262) | needs-photo |
| chicago-acuity-97804677<br>Date night Art Session | Date night Art Session | 97804677<br>Unassigned | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=97804677) | needs-photo |
| chicago-acuity-97904101<br>Date Night Chix | Date Night Chix | 97904101<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=97904101) | needs-photo |
| chicago-acuity-97929620<br>Private Date Night Experience | Private Date Night Experience | 97929620<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=97929620) | needs-photo |
| chicago-acuity-98139196<br>Make a Jar! — Wheel Throwing + Lid Workshop. | Make a Jar! — Wheel Throwing + Lid Workshop. | 98139196<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=98139196) | needs-photo |
| chicago-acuity-98323116<br>MAKE YOUR PET  IN CLAY | MAKE YOUR PET  IN CLAY | 98323116<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=98323116) | needs-photo |
| eugene-acuity-89288998<br>Eugene Date Night by Candlelight: Mosaic Experience | Eugene Date Night by Candlelight: Mosaic Experience | 89288998<br>Unassigned | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=89288998) | needs-photo |
| eugene-acuity-91154739<br>Eugene Make Your Own Matcha Bowl | Eugene Make Your Own Matcha Bowl | 91154739<br>Unassigned | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=91154739) | needs-photo |
| eugene-acuity-92719840<br>Mothers Day Wheel Share | Mothers Day Wheel Share | 92719840<br>Unassigned | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=92719840) | needs-photo |
| eugene-acuity-92719951<br>Mothers Day Wheel Throwing for Beginners | Mothers Day Wheel Throwing for Beginners | 92719951<br>Unassigned | Unresolved; no button | needs-review |
| eugene-acuity-92720069<br>Eugene: Mothers Day Pottery Hand-building | Eugene: Mothers Day Pottery Hand-building | 92720069<br>Unassigned | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=92720069) | needs-photo |
| unknown-acuity-79003717<br>Private Appointment for Couples (Pottery on Wheel) | Private Appointment for Couples (Pottery on Wheel) | 79003717<br>Unassigned | Unresolved; no button | needs-review |
| unknown-acuity-79003968<br>Private Appointment for One (Pottery Wheel) | Private Appointment for One (Pottery Wheel) | 79003968<br>Unassigned | Unresolved; no button | needs-review |
| chicago-pipe-and-ashtray<br>Pipe & Ashtray Making | Pipe and Ashtray Making Class - Chicago | 79188421<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79188421) | ready |
| eugene-pipe-and-ashtray<br>Pipe & Ashtray Making | Eugene Pipe and Ashtray Making Class | 90211026<br>13582962 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=90211026) | ready |
| chicago-boobs-mug<br>Boobs Coffee Mug | Boobs Coffee Mug - Chicago | 79187550<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79187550) | ready |
| chicago-dildos-and-bottles<br>Dildos and Bottles | Dildos and Bottles - Chicago | 79186927<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79186927) | ready |
| chicago-pussy-pottery<br>Pussy Pottery | Pussy Pottery - Chicago | 79188691<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=79188691) | ready |
| chicago-acuity-96857633<br>The Royal Mold Dildo Making Workshop | The Royal Mold Dildo Making Workshop | 96857633<br>Unassigned | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=96857633) | needs-photo |
| online-online-cauldron<br>Live Online Cauldron Pottery | Make a Clay Cauldron — Live Online Halloween Workshop | 98770334<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=98770334) | ready |
| online-online-pottery<br>Live Online Pottery Course | 6-Week Live Online Pottery Course + Wheel Kit | 97904203<br>12216179 | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=97904203) | needs-photo |
| online-online-watercolor<br>Live Online Watercolor | Live Online Watercolor Class for All Levels with Feerozeh | 97904869<br>Unassigned | [Scheduler](https://colorcocktailfactory.as.me/?appointmentType=97904869) | needs-photo |

## Approved image inventory and assignments

The originals in Drive were not renamed, moved, modified, or deleted. All 50 files were copied into public/images/classes. The image CDN supplies bounded responsive sizes without requesting widths larger than the source. Each card uses one source photograph. Focal positions were selected after visual inspection of the complete folder.

The Chicago Date Night Pottery photograph visibly shows a couple working on a pottery wheel. It was therefore assigned to the Chicago wheel-date activity (79006071), whose booking destination was verified independently. The distinct handbuilding date-night activity (94930972) was held for a suitable photograph. The approved terrarium-workshop photograph was shared across the distinct Chicago standard and Eugene date-night products; their titles, prices, units, calendars, and appointment IDs remained separate.

| Approved filename | Hosted asset | Google Drive file ID | Source dimensions / focal position | Assigned activity keys |
|---|---|---|---|---|
| Bonsai for Beginners: Hands-On Workshop - Chicago.webp | [Image](../../public/images/classes/approved-01-HsW-Hv.webp) | 1313Zo8PU-B93TPrRK2BtgSa1PoHsW-Hv | 1200 × 900<br>50% 42% | chicago-bonsai |
| Boobs Coffee Mug - Chicago.webp | [Image](../../public/images/classes/approved-02-OxXCRA.webp) | 1doXJBmxsZonqysNYO4wPZdV8lFOxXCRA | 1080 × 810<br>55% 45% | chicago-boobs-mug |
| Candle Making - Chicago.webp | [Image](../../public/images/classes/approved-03-3xOd0G.webp) | 1ItqqGer2N5dAJOOwWlhejDm0Ew3xOd0G | 1200 × 900<br>48% 45% | chicago-candle |
| Cat Vase Making - Chicago.webp | [Image](../../public/images/classes/approved-04-bvze7K.webp) | 1nmmfhUOfn-Xg7N37pWpo1coU7Nbvze7K | 1200 × 900<br>50% 40% | chicago-cat-vase |
| Ceramic Mug and a Bowl - Chicago.webp | [Image](../../public/images/classes/approved-05-9-c5wW.webp) | 1WtKmP1ivyyj2SBnF1N1FlXOfKB9-c5wW | 1084 × 813<br>60% 50% | chicago-mug-and-bowl |
| Charcuterie Board Make And Paint.webp | [Image](../../public/images/classes/approved-06-Jv3ZHw.webp) | 1v0FlW6PrKA5r_dok6WSSXmLVyUJv3ZHw | 984 × 738<br>50% 55% | chicago-charcuterie-board |
| Chicago Date Night Pottery.webp | [Image](../../public/images/classes/approved-07-Go6xn9.webp) | 194clPBzrJEB4A7mrJkYSNlPfzmGo6xn9 | 680 × 510<br>48% 55% | chicago-date-night-wheel |
| Date Night Bonsai VIP.webp | [Image](../../public/images/classes/approved-08-jaP3Wk.webp) | 1ipWUtg4iAI2BYOHlTPv-ozBkePjaP3Wk | 1200 × 900<br>50% 42% | eugene-date-night-bonsai |
| Date Night Candle Making.webp | [Image](../../public/images/classes/approved-09-pGZ8Xc.webp) | 1RmziT-exXIMkDpnckW4ByH2RtfpGZ8Xc | 1200 × 900<br>50% 40% | chicago-date-night-candle |
| Date Night On Fire - VIP EXPERIENCE.webp | [Image](../../public/images/classes/approved-10-0WVDdt.webp) | 1r7cdx8xM97TKHY7yrmIM4W3bRM0WVDdt | 1200 × 900<br>52% 65% | chicago-date-night-on-fire |
| Date Night Watercolor Painting for Two - Chicago.webp | [Image](../../public/images/classes/approved-11-PKrRG-.webp) | 1pG8c-BNS5LsGxlAILx-fZZgM4rPKrRG- | 940 × 705<br>50% 50% | chicago-date-night-watercolor |
| Date Night Watercolor Painting for Two - Eugene.webp | [Image](../../public/images/classes/approved-12-FB2XmA.webp) | 1JPYwvGbQTLtgs53G-8xmIxa-tcFB2XmA | 940 × 705<br>50% 50% | eugene-date-night-watercolor |
| Date Night: Make Your Own Ceramic Chess Set ♟️.webp | [Image](../../public/images/classes/approved-13-zfKHQr.webp) | 1tH32y2VynWe1KrhuygbBMcARm7zfKHQr | 1200 × 900<br>50% 50% | eugene-ceramic-chess |
| Dildos and Bottles - Chicago.webp | [Image](../../public/images/classes/approved-14-O6jPqj.webp) | 1A0z3iSQIrVgzc0GDYG9UurcYUaO6jPqj | 1200 × 900<br>50% 43% | chicago-dildos-and-bottles |
| Eugene : Make Your Own Charcuterie Board.webp | [Image](../../public/images/classes/approved-15-GUmXbp.webp) | 1n4kaRbWpiTajJmNi1f-vK3KYFfGUmXbp | 984 × 738<br>50% 50% | eugene-charcuterie-board |
| Eugene 🌿 Date Night Terrarium Workshop.webp | [Image](../../public/images/classes/approved-16-be3SrC.webp) | 1-TTFdz3-dOIFw7_KSVjMP6mfxSbe3SrC | 1200 × 900<br>48% 50% | chicago-terrarium<br>eugene-date-night-terrarium |
| Eugene Date Night On The Wheel.webp | [Image](../../public/images/classes/approved-17-h_HdFG.webp) | 1iQ4dV0SfOR30yj6_-5IUKkfq8ih_HdFG | 1200 × 900<br>50% 58% | eugene-date-night-wheel |
| Eugene Duck Soap holder.webp | [Image](../../public/images/classes/approved-18-iHzJZB.webp) | 1F6_m5BS08ufMK-lkDrUvOPMCU7iHzJZB | 1200 × 900<br>50% 50% | eugene-duck-soap-holder |
| Eugene Mushroom Pottery.webp | [Image](../../public/images/classes/approved-19-LiMP2x.webp) | 1_05XYf1Ttn-mFsrVPOozD6GhnxLiMP2x | 1200 × 900<br>50% 50% | eugene-mushroom |
| Eugene Pipe and Ashtray Making Class.webp | [Image](../../public/images/classes/approved-20-bxE6AT.webp) | 1A_Uc_Pcuvzlit2-czndlYINfa5bxE6AT | 1200 × 900<br>50% 45% | eugene-pipe-and-ashtray |
| Eugene Wheel Throwing for Beginners: Cup creations.webp | [Image](../../public/images/classes/approved-21-e-GdkT.webp) | 1GPlEk3mPWnLxi_mUfgrXocT4eNe-GdkT | 1200 × 900<br>50% 42% | eugene-cup-creations |
| Eugene Wheel Throwing for Beginners: Matcha Bowl.webp | [Image](../../public/images/classes/approved-22-jhPcfu.webp) | 1X5DfJL0Sy3ohFrMsh5YpXMv6s8jhPcfu | 1152 × 864<br>50% 50% | eugene-matcha-bowl |
| Eugene: Ceramic Mug and a Bowl.webp | [Image](../../public/images/classes/approved-23-oFSphW.webp) | 1SPxv3rAsMNN-AQPI_PHvkIauuPoFSphW | 1084 × 813<br>60% 50% | eugene-mug-and-bowl |
| FLASH SALE BEGINNERS WHEEL THROWING.webp | [Image](../../public/images/classes/approved-24-1Xe4O7.webp) | 1us6KmXl90xq-GVC7Ik5dWGjA511Xe4O7 | 1124 × 843<br>50% 62% | chicago-flash-sale-wheel |
| Halloween Ghost Pottey!.webp | [Image](../../public/images/classes/approved-25-Xp8VJh.webp) | 1YMDM6UHHdSUwyX-x1plX-S3jWFXp8VJh | 1200 × 900<br>50% 48% | chicago-ghost |
| Halloween Pottery: Carve Your Own Clay Pumpkin.webp | [Image](../../public/images/classes/approved-26-limpFo.webp) | 10AJ_Mn1-NZrWPUDPixT_VsunIflimpFo | 1084 × 813<br>55% 53% | chicago-clay-pumpkin |
| Handbuilding For Beginners - Vase Making.webp | [Image](../../public/images/classes/approved-27-Od_yaM.webp) | 1bIBAAXJhbKNQdOGTT48BtbybBvOd_yaM | 1120 × 840<br>50% 45% | chicago-handbuilt-vase |
| Hanging Turkish Mosaic Lamp - Chicago.webp | [Image](../../public/images/classes/approved-28-k53Mrx.webp) | 1B5ASopfJkDaFOKzxCzNnTrGsp6k53Mrx | 1200 × 900<br>50% 50% | chicago-hanging-turkish-lamp |
| Make a Clay Cauldron — Live Online Halloween Workshop.webp | [Image](../../public/images/classes/approved-29-mzv-ST.webp) | 1GrTH8xrgkUTKM98nw0XjfIn6TBmzv-ST | 1200 × 900<br>50% 50% | online-online-cauldron |
| Make And Paint - Wheel throwing.webp | [Image](../../public/images/classes/approved-30-MWLugH.webp) | 1ZmRBxXpBVYiOVsHyJy-k2T4DDoMWLugH | 1044 × 783<br>50% 60% | chicago-make-and-paint-wheel |
| MONSTER POTTERY! HALLOWEEN LANTERN CLASS.webp | [Image](../../public/images/classes/approved-31--C-m2D.webp) | 1m8h0_RuVEIusnYBoRCVjTLVdSu-C-m2D | 1120 × 840<br>52% 55% | chicago-monster-lantern |
| Mosaic Creations - Chicago.webp | [Image](../../public/images/classes/approved-32-rW3n0V.webp) | 1Ie2yRdR3PyUJq5UYwFI9adlehgrW3n0V | 1200 × 900<br>50% 45% | chicago-mosaic |
| Mushroom Pottery - Chicago.webp | [Image](../../public/images/classes/approved-33-cnT_gx.webp) | 1ASVnYO-DEJjWKu2IV5_54cuI6TcnT_gx | 1200 × 900<br>50% 50% | chicago-mushroom |
| OOGIE BOOGIE INSPIRED CANDLE HOLDER \| HALLOWEEN POTTERY.webp | [Image](../../public/images/classes/approved-34-B1jIP2.webp) | 1Dk1vbnkzI5CVqE5sqrNzI28vJFB1jIP2 | 1080 × 810<br>50% 50% | chicago-oogie-boogie<br>eugene-oogie-boogie |
| Open Studio Wheel throwing.webp | [Image](../../public/images/classes/approved-35-a5mSV-.webp) | 1aMKNGVj2QaG3s8qol35P5JcEUoa5mSV- | 1120 × 840<br>55% 60% | chicago-open-studio |
| Paint Pottery - Chicago.webp | [Image](../../public/images/classes/approved-36-hnfruv.webp) | 1N4Smjtmki9ib-oTL2xL8ipQCL4hnfruv | 816 × 612<br>50% 52% | chicago-paint-pottery |
| Pipe and Ashtray Making Class - Chicago.webp | [Image](../../public/images/classes/approved-37-ZmbGc9.webp) | 1Gf3pMDTNEgJgY20r4Twg1MvYODZmbGc9 | 1200 × 900<br>50% 45% | chicago-pipe-and-ashtray |
| Pussy Pottery - Chicago.webp | [Image](../../public/images/classes/approved-38-qZICjD.webp) | 1EubdimRySRYd_IYvDKPlbPZXE9qZICjD | 1200 × 900<br>50% 50% | chicago-pussy-pottery |
| Soap Making - Chicago.webp | [Image](../../public/images/classes/approved-39-6pd03D.webp) | 1WgojxuIVC4kZfpAQoHeHda08iU6pd03D | 1180 × 885<br>50% 50% | chicago-soap |
| Spin A Spell- Make your Own Clay Cauldron.webp | [Image](../../public/images/classes/approved-40-mk2QuD.webp) | 1TQ1ahWNZted7uwQrvDmiM8IcFZmk2QuD | 1200 × 900<br>50% 58% | chicago-cauldron<br>eugene-cauldron |
| Throw A Pumpkin On The Wheel.webp | [Image](../../public/images/classes/approved-41-Z5t289.webp) | 1QcgtqkhqZ-bmRZLel8UTmDdU40Z5t289 | 1200 × 900<br>50% 50% | chicago-wheel-pumpkin |
| Turkish Mosaic Lamp - Chicago.webp | [Image](../../public/images/classes/approved-42-9vzaFl.webp) | 1WFd8fUpeTML-DZSu8gQ4-ViDpW9vzaFl | 1200 × 900<br>50% 50% | chicago-turkish-lamp<br>chicago-date-night-turkish-lamp |
| VIP DATE NIGHT PAINT NIGHT.webp | [Image](../../public/images/classes/approved-43-68dhl8.webp) | 1Dd_VIg9xcKuRc17_F0kHIT1Gq068dhl8 | 1200 × 900<br>50% 50% | chicago-vip-paint-night<br>eugene-vip-paint-night |
| Water Color For Beginners.webp | [Image](../../public/images/classes/approved-44--Yj9yC.webp) | 1GujlQ9QUHvUdMFJJoh_ajjyWdg-Yj9yC | 940 × 705<br>50% 50% | chicago-watercolor<br>eugene-watercolor |
| Wheel Throwing for Beginners - Chicago.webp | [Image](../../public/images/classes/approved-45-e58mRd.webp) | 1rUWLJ1sUh8iFBVU5xwI0CCmlO5e58mRd | 1124 × 843<br>50% 62% | chicago-beginner-wheel |
| Wheel Throwing for Beginners -Cup Creations.webp | [Image](../../public/images/classes/approved-46-ZzjDrH.webp) | 1jqsoqPsiLbjt0OKDsiEHxlArlXZzjDrH | 1200 × 900<br>50% 42% | chicago-cup-creations |
| Wheel Throwing for Beginners -Make Your Own Matcha Bowl.webp | [Image](../../public/images/classes/approved-47-ljxCA2.webp) | 1eK1meuDixOc_lZWYmGh78TTphwljxCA2 | 1152 × 864<br>50% 50% | chicago-matcha-bowl |
| Wheel Throwing for Beginners -Vase Making.webp | [Image](../../public/images/classes/approved-48-fzOd_M.webp) | 1ZxDIPV80lLYE8-YVvJ-rRNkPK7fzOd_M | 1200 × 900<br>50% 60% | chicago-wheel-vase |
| Wine Glass Painting - Chicago.webp | [Image](../../public/images/classes/approved-49-ltrBKB.webp) | 1GxySoZHJuUstkXWjY6Z8t2DE9hltrBKB | 1200 × 900<br>50% 50% | chicago-wine-glass-painting |
| Wine Glass Painting.webp | [Image](../../public/images/classes/approved-50-DEuF4h.webp) | 1n0pbgfFdzGJsshozmSmAUZKedDDEuF4h | 1200 × 900<br>50% 50% | eugene-wine-glass-painting |

## Live price and availability verification

Snapshot time: 2026-10-05T22:23:01.034Z. The availability lookup covered the next 30 days, filtered for the exact appointment and its assigned calendar. The website formats sessions in America/Chicago or America/Los_Angeles, including daylight-saving changes. Online cauldron times use the Chicago studio time zone and explicitly display its abbreviation. An empty bounded lookup does not mean a class has no future dates; the customer-facing fallback is “View upcoming dates.”

All 54 displayed offerings had a verified current price and an upcoming session in this snapshot. Some later live requests timed out during testing; the corresponding cards correctly kept their verified links and showed the fallback instead of inventing a date. No comparison prices were supplied or fabricated.

| Activity key | Current price / verified unit | Coverage evidence | Next session (source timestamp) | Availability / offering state |
|---|---|---|---|---|
| chicago-cauldron | $45 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-07T19:30:00-0500 | available / active |
| eugene-cauldron | $45 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T20:15:00-0500 | available / active |
| chicago-date-night-wheel | $55 for two | This reservation now will include two seats per ticket | 2026-10-05T19:30:00-0500 | available / active |
| eugene-date-night-wheel | $50 for two | One ticket per couple Will share a wheel Located at 3295 Cross Street Eugene OR | 2026-10-05T21:00:00-0500 | available / active |
| chicago-beginner-wheel | $25 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-06T19:30:00-0500 | available / active |
| eugene-cup-creations | $25 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-06T21:00:00-0500 | available / active |
| chicago-turkish-lamp | $70 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T19:10:00-0500 | available / active |
| chicago-mug-and-bowl | $35 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T18:30:00-0500 | available / active |
| eugene-mug-and-bowl | $35 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T20:00:00-0500 | available / active |
| chicago-terrarium | $35 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-06T17:45:00-0500 | available / active |
| eugene-date-night-terrarium | $50 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T20:15:00-0500 | available / active |
| chicago-mosaic | $30 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T19:00:00-0500 | available / active |
| chicago-candle | $35 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T20:30:00-0500 | available / active |
| chicago-vip-paint-night | $100 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T20:15:00-0500 | available / active |
| eugene-vip-paint-night | $100 for two | Only one couple per time slot One ticket is good for two people If you would like to bring other couples with you email us at support@colorcocktailfactory.com and we will open up the class | 2026-10-05T19:30:00-0500 | available / active |
| chicago-cat-vase | $25 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T18:30:00-0500 | available / active |
| chicago-clay-pumpkin | $35 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-06T17:00:00-0500 | available / active |
| chicago-glass-fusion | $50 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-06T17:05:00-0500 | available / active |
| chicago-bonsai | $65 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T19:00:00-0500 | available / active |
| chicago-date-night-on-fire | $200 for two | One Ticket covers a couple Note: This session focuses on learning. | 2026-10-07T17:30:00-0500 | available / active |
| chicago-paint-pottery | $39 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-07T17:10:00-0500 | available / active |
| chicago-wine-glass-painting | $40 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-06T18:00:00-0500 | available / active |
| eugene-wine-glass-painting | $35 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T19:45:00-0500 | available / active |
| chicago-mushroom | $25 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-07T18:20:00-0500 | available / active |
| eugene-mushroom | $25 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T20:20:00-0500 | available / active |
| chicago-watercolor | $50 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T19:05:00-0500 | available / active |
| eugene-watercolor | $40 per ticket | Participant count was not explicitly established; do not call this per person. | No next session verified in this lookup | empty-window / active |
| chicago-matcha-bowl | $30 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T19:30:00-0500 | available / active |
| eugene-matcha-bowl | $25 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T21:00:00-0500 | available / active |
| chicago-date-night-candle | $50 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T19:15:00-0500 | available / active |
| chicago-ghost | $20 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T18:50:00-0500 | available / active |
| chicago-oogie-boogie | $25 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T19:00:00-0500 | available / active |
| eugene-oogie-boogie | $25 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T20:15:00-0500 | available / active |
| chicago-monster-lantern | $50 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T18:45:00-0500 | available / active |
| chicago-hanging-turkish-lamp | $45 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-06T18:10:00-0500 | available / active |
| chicago-date-night-handbuilding | $55 for two | ONE TICKET PER COUPLE Bring your ideas so we can help you bring them to life. | 2026-10-05T19:15:00-0500 | available / active |
| chicago-charcuterie-board | $55 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T18:35:00-0500 | available / active |
| eugene-charcuterie-board | $55 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T20:35:00-0500 | available / active |
| chicago-handbuilt-vase | $55 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T19:00:00-0500 | available / active |
| chicago-soap | $35 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T18:30:00-0500 | available / active |
| eugene-duck-soap-holder | $30 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-09T17:45:00-0500 | available / active |
| chicago-open-studio | $25 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T18:30:00-0500 | available / active |
| chicago-cup-creations | $25 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-08T19:30:00-0500 | available / active |
| chicago-wheel-pumpkin | $60 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T19:30:00-0500 | available / active |
| eugene-ceramic-chess | $85 for two | one ticket per couple No pottery experience needed! | 2026-10-09T20:45:00-0500 | available / active |
| chicago-date-night-watercolor | $75 for two | Date Night Watercolor Painting for Two - Chicago | 2026-10-09T17:00:00-0500 | available / active |
| eugene-date-night-watercolor | $75 for two | Date Night Watercolor Painting for Two - Eugene | 2026-10-05T19:00:00-0500 | available / active |
| eugene-date-night-bonsai | $120 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T21:20:00-0500 | available / active |
| chicago-wheel-vase | $25 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-07T19:30:00-0500 | available / active |
| chicago-date-night-turkish-lamp | $90 for two | 🪬 All tools and materials included 💡 One lamp for two people 🎨 Choose from a wide variety of colors and pattern guides 🍷 BYOB — bring your favorite drink and vibe out 🌙 Perfect for date nights, mother-daughter bonding, or solo creative time Step into a glowing world of color, pattern, and tradition in this one-of-a-kind Turkish Lamp Mosaic Workshop. | 2026-10-05T19:10:00-0500 | available / active |
| chicago-make-and-paint-wheel | $65 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-09T17:30:00-0500 | available / active |
| chicago-flash-sale-wheel | $15 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-07T17:30:00-0500 | available / active |
| chicago-acuity-79186489 | $35 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-07T17:45:00-0500 | available / active |
| chicago-acuity-94782610 | $30 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-11T10:30:00-0500 | available / active |
| chicago-acuity-96474464 | $45 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-07T19:30:00-0500 | available / active |
| chicago-acuity-97799262 | $55 per ticket | Participant count was not explicitly established; do not call this per person. | No next session verified in this lookup | empty-window / active |
| chicago-acuity-97804677 | $150 for two | One ticket is good for two people! | No next session verified in this lookup | empty-window / active |
| chicago-acuity-97904101 | $50 for two | One ticket is good for two people. | 2026-10-05T18:45:00-0500 | available / active |
| chicago-acuity-97929620 | $200 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-09T10:00:00-0500 | available / active |
| chicago-acuity-98139196 | $80 per ticket | Participant count was not explicitly established; do not call this per person. | No next session verified in this lookup | empty-window / active |
| chicago-acuity-98323116 | $25 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-18T14:00:00-0500 | available / active |
| eugene-acuity-89288998 | $90 per ticket | Participant count was not explicitly established; do not call this per person. | No next session verified in this lookup | empty-window / active |
| eugene-acuity-91154739 | $45 per ticket | Participant count was not explicitly established; do not call this per person. | No next session verified in this lookup | empty-window / active |
| eugene-acuity-92719840 | $45 per ticket | Participant count was not explicitly established; do not call this per person. | No next session verified in this lookup | empty-window / active |
| eugene-acuity-92719951 | $25 per ticket | Participant count was not explicitly established; do not call this per person. | No next session verified in this lookup | empty-window / active |
| eugene-acuity-92720069 | $50 per ticket | Participant count was not explicitly established; do not call this per person. | No next session verified in this lookup | empty-window / active |
| unknown-acuity-79003717 | $150 per ticket | Participant count was not explicitly established; do not call this per person. | No next session verified in this lookup | empty-window / active |
| unknown-acuity-79003968 | $90 per ticket | Participant count was not explicitly established; do not call this per person. | No next session verified in this lookup | empty-window / active |
| chicago-pipe-and-ashtray | $45 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T18:45:00-0500 | available / active |
| eugene-pipe-and-ashtray | $45 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T20:10:00-0500 | available / active |
| chicago-boobs-mug | $35 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-07T20:00:00-0500 | available / active |
| chicago-dildos-and-bottles | $30 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-06T18:10:00-0500 | available / active |
| chicago-pussy-pottery | $45 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-05T20:00:00-0500 | available / active |
| chicago-acuity-96857633 | $35 per ticket | Participant count was not explicitly established; do not call this per person. | No next session verified in this lookup | empty-window / active |
| online-online-cauldron | $29 per ticket | Participant count was not explicitly established; do not call this per person. | 2026-10-11T16:30:00-0500 | available / active |
| online-online-pottery | $150 per person | One registration includes one student and kit. | No next session verified in this lookup | empty-window / active |
| online-online-watercolor | $15 per ticket | Participant count was not explicitly established; do not call this per person. | No next session verified in this lookup | empty-window / active |

## Missing photographs and held offerings

Twenty-one catalog entries lacked a suitable approved photograph, including private/mapping holds. They remained in the manifest instead of receiving substitute imagery. Two further photographed records were held: Eugene Water Color for beginners had no assigned calendar, and the flash-sale wheel class required confirmation that the promotion was intended.

| Activity | Appointment | Reason |
|---|---|---|
| chicago: Glass Fusion - Chicago | 79183146 | No suitable activity-specific approved photograph was available in the supplied folder. |
| eugene: Water Color for beginners | 96478474 | The public appointment type has no assigned calendar. Verify scheduling before showing a booking card. |
| chicago: Chicago Date Night Pottery | 94930972 | The filename Chicago Date Night Pottery depicts a wheel session; this handbuilding product needs a suitable photograph. |
| chicago: FLASH SALE BEGINNERS WHEEL THROWING | 96113161 | Owner confirmation is needed before advertising this promotion. |
| chicago: Ceramic Bunny Cup - Chicago | 79186489 | No suitable activity-specific approved photograph was available in the supplied folder. |
| chicago: Wheel Throwing for Beginners -Make Your Own Plate Set | 94782610 | No suitable activity-specific approved photograph was available in the supplied folder. |
| chicago: Wheel Throwing for Beginners - Fat Belly Mugs | 96474464 | No suitable activity-specific approved photograph was available in the supplied folder. |
| chicago: Touch-n-Clay PlayDay | 97799262 | No suitable activity-specific approved photograph was available in the supplied folder. |
| chicago: Date night Art Session | 97804677 | No suitable activity-specific approved photograph was available in the supplied folder. |
| chicago: Date Night Chix | 97904101 | No suitable activity-specific approved photograph was available in the supplied folder. |
| chicago: Private Date Night Experience | 97929620 | No suitable activity-specific approved photograph was available in the supplied folder. |
| chicago: Make a Jar! — Wheel Throwing + Lid Workshop. | 98139196 | No suitable activity-specific approved photograph was available in the supplied folder. |
| chicago: MAKE YOUR PET  IN CLAY | 98323116 | No suitable activity-specific approved photograph was available in the supplied folder. |
| eugene: Eugene Date Night by Candlelight: Mosaic Experience | 89288998 | No suitable activity-specific approved photograph was available in the supplied folder. |
| eugene: Eugene Make Your Own Matcha Bowl | 91154739 | No suitable activity-specific approved photograph was available in the supplied folder. |
| eugene: Mothers Day Wheel Share | 92719840 | No suitable activity-specific approved photograph was available in the supplied folder. |
| eugene: Mothers Day Wheel Throwing for Beginners | 92719951 | Booking state or studio mapping requires review; no active homepage button. No suitable approved photograph was available either. |
| eugene: Eugene: Mothers Day Pottery Hand-building | 92720069 | No suitable activity-specific approved photograph was available in the supplied folder. |
| unknown: Private Appointment for Couples (Pottery on Wheel) | 79003717 | Booking state or studio mapping requires review; no active homepage button. No suitable approved photograph was available either. |
| unknown: Private Appointment for One (Pottery Wheel) | 79003968 | Booking state or studio mapping requires review; no active homepage button. No suitable approved photograph was available either. |
| chicago: The Royal Mold Dildo Making Workshop | 96857633 | No suitable activity-specific approved photograph was available in the supplied folder. |
| online: 6-Week Live Online Pottery Course + Wheel Kit | 97904203 | No suitable activity-specific approved photograph was available in the supplied folder. |
| online: Live Online Watercolor Class for All Levels with Feerozeh | 97904869 | No suitable activity-specific approved photograph was available in the supplied folder. |

## Resolved mappings and owner review

Boobs Coffee Mug — Chicago was verified as 79187550; Make And Paint — Wheel throwing as 95806344; and Chicago Date Night Watercolor for Two as 94935292. Each passed the public scheduler title/ID check. No generic Sip & Paint appointment was found in the authenticated public catalog; the painting cards retained their VIP Date Night identity.

The online pottery course was identified as 97904203 and online watercolor as 97904869. Neither received a homepage card because the supplied folder did not contain a suitable photograph; online watercolor also had no assigned calendar. The old Eugene ID 92719951 appeared as a Mother’s Day product with no assigned calendar and was not used. Eugene Cup Creations (93539343) and Matcha Bowl (89287658) remained distinct.

Acuity explicitly supported two-person coverage for eight displayed offerings. The other 46 displayed prices used “per ticket,” because neither title nor description established per-person coverage. The owner should confirm those units rather than assuming a date-night title always means a two-person ticket. Adult-themed offerings were grouped near the end and labelled without inventing an 18+ or 21+ restriction; numeric age policies still need owner confirmation.

The Eugene Date Night Terrarium listing (89290193) also described ages 5–12. The homepage retained the confirmed product identity and did not infer ticket coverage or a numeric restriction from that conflicting copy. Audience and ticket coverage should be reviewed before launch.

Eugene Oogie Boogie (98908868) was verified against calendar 13582962. Its Acuity description still contained Chicago wording; the homepage used Eugene-specific routing and neutral project copy. No Acuity records were modified.

