# Meta measurement and operating guide

## Production audit and deployment status

On 6 October 2026, real Chromium visits to https://colorcocktailfactory.com at mobile and desktop widths found `window.fbq`, the library from connect.facebook.net, and the documented Pixel. The previous missing-Pixel finding was not reproducible. Both visits observed two initial PageView requests, including the old noscript image request. The production Netlify variable NEXT_PUBLIC_META_PIXEL_ID already matched the documented ID, was populated in the all context, and included build scope. No value was changed or copied into source. Account ownership and Events Manager settings were not accessible. No CAPI credentials or consent settings were present in the project environment audit.

The working-tree implementation removes the duplicate base paths, initializes one Pixel once per document, explicitly owns App Router PageViews, and shares conversion triggers with GA4. It has not yet been published and checked on the production domain in this session. The enclosing workflow owns build/publication; this environment prohibits build commands and creating commits. Rebuilding the old production revision would not publish these files, so no misleading rebuild was triggered. No environment change was necessary to restore the public ID.

## Event map

| Event | Trigger | Important parameters | Advertising use |
| --- | --- | --- | --- |
| PageView | Initial load and each pathname transition, including client back/forward | Normal Meta URL/referrer context | Traffic / audiences |
| ViewContent | Homepage card reaches 25% actual visibility; once per class/city/page cycle | content_name, content_ids, content_type, content_category, reliable displayed value, USD currency, city, card_position, placement=homepage_card, class_mode, appointment_type_id | Class interest |
| ViewContent | Actual activity/city detail or concrete event page mounts | Same content identity; placement=activity_page; price only on verified event data | Detail interest |
| InitiateCheckout | Actual booking click through the shared booking helper | content_name, content_ids, content_type, content_category, value when known, currency, num_items, city, booking_provider, card_position, placement, appointment_type_id | Booking intent, not revenue |
| Lead | Accepted private-party or birthday form response | content_name, content_category=private_event, city, lead_type, group_size_range, placement; unique eventID | Lead optimization |
| Lead | Newly accepted Ask CCF inquiry after persistence and notification handoff | lead_type=ask_ccf_private_party, placement=ask_ccf, city; browser eventID equals server event_id | Lead optimization / deduplicated CAPI |
| CompleteRegistration | Accepted newsletter response | content_name=Newsletter, status=completed, placement | Newsletter registration |
| Contact | Click on an actual tel: or mailto: link | contact_method, city, placement; no destination address or phone number | Contact intent, separate from Lead |
| Purchase | Signed Acuity webhook, followed by API verification of a fully paid, non-cancelled appointment | actual amountPaid, USD, content_ids, content_name, content_category, content_type=product, num_items=1, city, provider, appointment type; stable server event_id | Revenue optimization; CAPI only, opt-in |
| CCF_ShowMore | Show Me More click | city, previous_visible_count, new_visible_count, total_classes, batch_number | Engagement, not a conversion |
| CCF_CitySelected | Deliberate switch to a different city | city, previous_city, placement | City interest; never an automatic restore |
| CCF_AskCCFOpen | Visitor opens studio help | city, placement=ask_ccf, page_path | Assistant engagement |
| CCF_PrivatePartyCTA | Explicit private-party CTA or link | city, placement, page_path | Private-party interest; not Lead |
| CCF_ClassSelected | Non-booking card image/title/card interaction | content IDs/name, category, city, placement, card_position, click_target | Class selection; not a conversion |

A booking click produces InitiateCheckout rather than a redundant custom booking event. Ask CCF booking recommendations use the same helper and include placement=ask_ccf and the reliable catalog price. Its GA4 recommendation event remains intact. No Search event is emitted because no appropriate non-sensitive full-text class search was found; Ask CCF text is never treated as a Meta search. No hover, generic scroll, menu-open, or mouse movement events were added. Existing GA4 engagement events remain independent.

## Content identity and value rules

Exact Acuity appointment type IDs are the canonical product IDs on homepage cards, recommendations, session URLs, and verified purchases. The shared identity resolver understands appointmentType, appointmentTypeIds[], and Acuity's /appointment/{id}/ path. It uses the same canonical ID for GA4 checkout items. Eventbrite booking links use a provider-prefixed event ID when it can be resolved reliably.

Generic activity pages and /book/{city}/{activity} links represent activity groups, not necessarily a single current appointment type. They use content_type=product_group and `activity:{slug}`. For example, `activity:date-night-wheel` is the city-filtered activity family, whereas a numeric appointment type identifies one bookable offering. The maintained group-to-offering selection is the existing ACTIVITY_PATTERNS/catalogBookingUrl mapping in lib/booking.ts against the current Acuity catalog. No arbitrary numeric ID or one-to-one mapping is invented for a multi-class page. Calendar-only links remain groups. Build audiences using the group ID OR its reviewed current appointment IDs when spanning both surfaces.

Categories use a small consistent taxonomy (pottery, glass, plants, candles, painting, workshop) when no existing category is supplied. Homepage/card prices come from current displayed catalog data; Ask CCF uses its validated catalog price; generic static activity pages omit value. Purchase uses verified amount paid, not displayed price. A purchase counts one appointment, not inferred attendee count. Discounts, deposits, refunds, cancellations, zero-value bookings, and later adjustments are not guessed or converted into additional purchases. Refund reporting requires a separate verified design.

## Consent and privacy behavior

There is still no consent-management UI. To preserve the existing browser behavior, the Pixel starts immediately when consent is unknown, except when Global Privacy Control or Do Not Track requests suppression. **This legacy default is not a claim that applicable consent requirements are satisfied.** The CMP/privacy rollout remains necessary before treating this as a complete consent solution.

A CMP can set `window.ccfMetaConsent = 'denied'` before hydration to prevent the library request entirely. After initialization it can call `window.ccfSetMetaConsent('granted' | 'denied')`; the module export updateMetaConsent does the same. The existing updateAnalyticsConsent helper also maps Google advertising consent choices to Meta grant/revoke. Restore stored choices before hydration and persist/revoke them through the CMP, not a separate ad hoc cookie banner. This change does not add consent cookies or change functional preferredCity, ccf-city, or Ask CCF sessionStorage.

Known denial suppresses all explicit Meta events, including Lead and checkout, and sends Meta's revoke command if the library was already loaded. A later grant records the current page and currently visible cards, without replaying earlier denied interactions. Back/forward and repeated grant calls do not duplicate PageViews. GPC/DNT take precedence over an explicit grant in this implementation. Test Events should test both grant and denial.

CAPI is stricter: it requires an explicit granted match context and valid existing _fbp or _fbc data. Website CAPI delivery also requires the actual browser user agent: Ask CCF reads the request header; purchase delivery requires the consented provider handoff. The server does not fabricate a user agent or substitute its own IP. Unknown consent never authorizes server matching. No identifier is fabricated from a URL; no new fingerprint, plaintext customer data, hashed email, or hashed phone is sent. Native browser URL/referrer context still applies, so do not put personal information into page URLs or campaign names.

The Pixel init does not pass advanced-matching user data. Automatic configuration is disabled through fbq so reviewed explicit events own measurement. Audit Events Manager's automatic events and Automatic Advanced Matching settings and disable any account-side extraction not covered by the privacy policy and consent implementation. Consent withdrawal must also invalidate any retained provider attribution fields before subsequent server delivery.

## CAPI implementation and required configuration

Server code lives in lib/metaCapi.server.ts and is imported only by server handlers. There is deliberately no public endpoint accepting arbitrary browser conversion names or values. Tokens are sent only in the server Authorization header, never in browser code, query logs, public variables, or diagnostic output.

Existing/new environment names (no private values):

| Name | Purpose |
| --- | --- |
| NEXT_PUBLIC_META_PIXEL_ID | Existing public dataset/Pixel ID; already correct and build-scoped |
| META_CAPI_ACCESS_TOKEN | Private runtime dataset token; currently unavailable |
| META_CAPI_ENABLED | Explicit runtime activation flag; leave disabled until validated |
| META_GRAPH_API_VERSION | Explicit currently supported Graph API version selected from Meta's account/docs during setup; none invented or silently defaulted |
| META_CAPI_TEST_EVENT_CODE | Optional temporary private runtime Test Events code; remove after isolated validation |
| ACUITY_API_KEY, ACUITY_USER_ID | Existing private API credentials and native webhook verification |
| ACUITY_CURRENCY | Existing verified-currency prerequisite for the payment handler |
| ACUITY_META_CONSENT_FIELD_ID | Optional reviewed Acuity intake field ID carrying explicit advertising consent |
| ACUITY_META_FBP_FIELD_ID, ACUITY_META_FBC_FIELD_ID | Optional reviewed intake field IDs for already consented browser matching context |
| ACUITY_META_USER_AGENT_FIELD_ID | Optional reviewed intake field carrying the actual consented browser user agent |
| NETLIFY_DB_URL | Platform-managed private database connection |
| GA4_PURCHASES_ENABLED, GA4_MEASUREMENT_ID, GA4_API_SECRET | Existing independent GA4 purchase configuration; retained |

Configure the CAPI token, activation, and API version only in intended runtime deployment contexts. Keep production credentials out of previews unless using a deliberately isolated test dataset/Test Events setup. The implementation returns disabled without the required configuration.

**Ask CCF Lead:** The existing inquiry API validates, rate-limits, persists, and confirms notification handoff first. Only then does it call CAPI with a server-created `askccf:lead:{record-id}` event ID and optional consented cookie context. The response returns that same ID for browser Lead. Duplicates/failed submissions do not create a fresh Lead. A missing token or match context does not block the inquiry. When enabled, the network attempt has a five-second limit and failures cannot turn a successful inquiry into a failure. Event Match Quality depends on the available consented matching data and cannot be guaranteed by code.

**Ordinary private-party/birthday forms:** Browser Lead is implemented and carries a unique eventID. Server delivery for these Netlify Forms remains a prepared follow-up: add an authenticated platform submission event/verified accepted-submission adapter, propagate the identical opaque event ID and explicitly consented matching context through reviewed hidden fields, and invoke sendMetaConversion only after confirmed acceptance. Never treat a new browser endpoint or button click as proof of acceptance. Do not enable dual reporting with unrelated IDs. Form actions, field registration, and notifications were not changed here.

**Purchase:** The existing ga4-webhook endpoint now independently attempts Meta delivery after native Acuity signature verification and a fresh authenticated appointment lookup. It requires paid=yes, a non-cancelled appointment, positive numeric amountPaid, the confirmed USD account setting, and a reviewed appointment/calendar mapping. It also retrieves authenticated /appointments/{id}/payments data, requires processor transactions to corroborate amountPaid, and uses the final actual payment timestamp. Unknown timestamps, unmatched totals, nonpositive/refunded payment records, duplicate processor IDs, and events outside Meta's seven-day window are not reported. This prevents an old paid appointment edit from appearing as new revenue. See [Acuity payment fields](https://developers.acuityscheduling.com/reference/get-appointments-id-payments). Meta runs before the independent GA4 ledger check, so an already-recorded GA4 transaction does not suppress a new Meta delivery. A Meta failure does not suppress GA4. The same appointment always uses `purchase:acuity:{appointment-id}`; no browser Purchase is fired.

To finish purchase activation:

1. Deploy the new additive meta_event_deliveries migration and server code. All previously applied migrations remain unchanged.
2. Obtain the dataset token and choose a supported API version in Meta Events Manager. Review domain verification, privacy notice, automatic events/advanced matching, and event permissions.
3. Validate the Acuity signed scheduled/changed webhook configuration already documented in analytics-operations.md. Confirm payment completion actually generates the necessary notification; add verified reconciliation if scheduled events arrive before payment.
4. Establish a provider-supported consented attribution handoff. The reader is ready for configured intake field IDs containing the granted consent signal and existing matching cookies and actual browser user agent. These fields/values are not currently configured, and booking URLs/intake behavior were not modified. Do not ask customers to type cookie IDs. A reviewed automation or native supported integration must carry the context and honor withdrawal. Prefer a securely resolved opaque reference if the provider cannot safely accept those fields. Without a valid context, CAPI deliberately skips delivery.
5. Validate provider-signed replay with a separate dataset or approved Test Events setup and inspect Events Manager receipt/deduplication. Do not create fake production purchases or a paid booking merely to test tracking.
6. Enable only after validation; monitor dataset diagnostics and the delivery ledger.

Eventbrite CAPI is not implemented: a provider-authenticated webhook plus server order lookup, payment/currency/total verification, city/class mapping, consented attribution, and stable provider-prefixed order IDs are still required. No Eventbrite revenue is inferred from checkout clicks.

## Deduplication and reconciliation

Browser page/event deduplication uses transient page state, while server delivery uses Netlify Database. meta_event_deliveries has a unique key containing dataset, event name, and event ID; atomic insert protects concurrent requests and webhook redelivery. Google retains its separate analytics_purchases ledger. Meta response acceptance requires a successful HTTP response and events_received=1, not HTTP status alone.

Rows enter sending, then sent or review. Network ambiguity remains held rather than automatically retrying and inflating revenue. Inspect sending/review entries against Meta receipt and provider records before authorizing a replay. Never delete/replay a sent row simply to improve counts. If a replay is justified, preserve the same event name/ID and original event time and respect Meta's deduplication/acceptance windows. No automatic retry worker or response-payload storage is introduced. Match cookies/customer data are not stored in this ledger.

CAPI improves resilience where consented matching context is available; it does not bypass opt-outs, guarantee attribution under blockers, or recover identifiers that were never collected. The full ad-to-revenue funnel remains dependent on provider attribution and actual validated purchase delivery.

## Recommended conversions and audiences

Prioritize Purchase, then Lead, then InitiateCheckout only when stronger events have insufficient volume. Do not mark Show More, City Selected, PageView, or card selection as advertising conversions.

Start with a small set of custom conversions:

| Conversion | Rule |
| --- | --- |
| Chicago Lead / Eugene Lead | Lead plus city |
| Chicago Purchase / Eugene Purchase | Purchase plus city |
| Pottery Purchase | Purchase plus content_category=pottery |
| Date Night Purchase | Purchase plus a reviewed set of date-night content_ids |
| Private Party Lead | Lead plus content_category=private_event (optionally restrict lead_type) |

The event data supports site visitors; ViewContent excluding InitiateCheckout; InitiateCheckout excluding Purchase; private-party CTA interest excluding Lead; Chicago/Eugene interest; date-night and wheel-throwing viewers by IDs/groups; purchasers; and purchaser exclusion audiences. Use appropriate retention windows and consent rules. No campaigns, audiences, custom conversions, or account settings were created automatically. Browser activity groups and concrete appointment IDs must both be included where relevant.

## Validation

Commands: npm run test:meta; npm run test:meta:browser; npm run test:analytics; npm test; TypeScript no-emit checking. Unit tests mock transport and persistence. Browser tests mock all Meta requests, form acceptance/failure, and Ask CCF APIs. They cover initialization, view visibility/deduplication, shared booking triggers, successful/failed leads, newsletter success, PII exclusion, route/back/forward navigation, Ask CCF IDs, and consent denial/grant. CAPI tests cover the browser/server event-ID match and concurrent purchase deduplication without calling Meta.

A local real-library run, with collection endpoints intercepted, showed one Meta library, one initial PageView, a ViewContent for the actually visible card, no JavaScript errors, and no CSP violations. Existing CSP already permits the required Meta origins; no broad wildcard or browser Graph API access was added. Production was audited read-only; no fake leads, newsletter subscriptions, or paid bookings were created. Meta Test Events / Pixel Helper account access was unavailable.

After the enclosing workflow publishes this revision, verify the live hostname at desktop/mobile widths: one initializer/library, correct configured ID, one PageView per route visit, visible-card ViewContent with IDs, one booking InitiateCheckout, Show More/City Selected/private CTA events, and consent suppression. Use network inspection with collection intercepted for synthetic interactions, then inspect genuine organic conversions in Events Manager. Do not declare full revenue reporting or production completion before that check and provider/CAPI activation.
