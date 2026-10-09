# Analytics operation and production handoff

Current policy (9 October 2026): the automatic privacy banner has been removed. After a successful saved-preference lookup, visitors without a saved choice get Google Analytics enabled and advertising disabled. Saved choices and browser Global Privacy Control / Do Not Track signals take precedence. Failed lookups keep optional tracking off. Visitors can change choices in the footer’s Privacy preferences dialog; choices continue to use the existing Netlify Database storage. Google Ads and Meta still require advertising permission. This policy supersedes the historical consent/default notes below.


The subsequent [Meta implementation guide](meta-analytics.md) documents the expanded Pixel events, consent controls, independent CAPI ledger, and additional purchase-verification requirements. Its Meta-specific details supersede the earlier baseline notes below.

## Audit (6 October 2026)

The previous report that production had no tags is no longer accurate. A real Chromium visit to https://colorcocktailfactory.com exposed `gtag`, `dataLayer`, `fbq`, and `sa_event`. GA4 returned HTTP 204 from `analytics.google.com/g/collect`; Google Ads and Meta requests returned HTTP 200. The same initial page produced two GA4 page_view requests and two Meta PageView requests. Google Ads also received FCP and TTFB events. No JavaScript exceptions were observed in this visit.

The Netlify production site and published deployment were checked through the API. The existing three public tag variables matched the IDs in the task/documentation, were populated in the `all` context, and included build scope. No environment changes were necessary and no values are reproduced here. GA4 account ownership, stream enhanced-measurement settings, Ads conversion actions, and Meta Events Manager were not accessible.

Simple Analytics already worked through Netlify's injected `/proxy.js` and `/simple/simple.gif` (HTTP 202). The platform owns this implementation; adding another application script would duplicate it. Existing Simple Analytics enable/proxy settings were retained.

The live homepage returned HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy, but no CSP despite the declaration in netlify.toml. Next.js now also declares that CSP. Existing directives are preserved; only specific analytics connection origins are added, plus the existing YouTube embed origin in frame-src so enforcing the previously ineffective policy does not break studio videos. A local real-library test caught the Google consent-mode endpoint `pagead2.googlesyndication.com`, which is explicitly allowed.

## Implemented event contract

All browser events use the central allowlisted analytics module, include `page_path` and city where available, and target GA4 explicitly rather than every Google destination. Debug logging occurs only in development. Prices are displayed prices, not reported revenue.

| Event | Additional parameters / behavior |
| --- | --- |
| page_view | Sanitized page_location retaining UTM parameters and gclid, sanitized page_referrer. One manual event per pathname transition. Filter-only query changes do not count as another page. |
| view_item_list | city, class_name, class_id, appointment_type_id, class_category, card_position (1-based), item_list_name, batch_number, displayed_price when known, mode, items[]. Fires at 25% actual visibility, once per mounted card/city cycle. |
| select_item | Same card context and items[], plus click_target (image, title, card, choose_date). One bubbling card handler; booking click has one selection and one checkout. |
| begin_checkout | class_name, class_id, city, booking_provider, sanitized link_url, class_category, items[], currency; appointment_type_id from known metadata/URL; homepage also adds position, list, displayed price, mode, batch, click target. |
| homepage_show_more | city, previous_visible_count, new_visible_count, batch_number, total_available_classes. |
| city_selected | city, previous_city, placement, selection_source (homepage_toggle, url_parameter, saved_preference). Restores are distinguished from deliberate clicks. |
| generate_lead | form_name, lead_type, city; placement and controlled activity when available; coarse group_size_range for private-party forms and predefined birthday ranges. Fires after accepted responses only. Ask CCF duplicates do not create another lead. |
| sign_up | method=newsletter, placement=newsletter_section. Fires after accepted response only. |
| ask_ccf_open / ask_ccf_new_conversation | page_path, inferred city. No chat text. |
| ask_ccf_recommendation_click | class_name, class_id, city, placement=ask_ccf, booking_provider; also one begin_checkout. |
| ask_ccf_inquiry_submit | city, page_path, duplicate indicator. Lead event only on a newly received inquiry. |
| scroll_depth | scroll_depth at 25, 50, 75, 90; city, page_path, no repeated milestones per mounted page. |
| LCP / CLS / INP / FCP / TTFB | metric_value, metric_id, metric_rating, city, page_path, device_type, connection_type. No monetary value, no Ads routing. CLS is its raw score; other metrics are milliseconds. |
| private_party_cta_click / cta_click / section_view | Existing engagement helpers retained with contextual placement/section/CTA parameters. |
| ab_test_exposure / ab_test_conversion | Existing optional experiment events retained. |
| purchase | Server only, opt-in: transaction_id, actual amount paid as value, USD currency, city, class_name, class_id, appointment_type_id, booking_provider, items[]. No browser purchase helper is exposed. |

Generic legacy booking links use a shared document listener; explicitly instrumented links opt out. Calendar-only links use `class_id=calendar` and `class_name=Workshop calendar` rather than inventing a class. Existing BookingLink and Ask CCF metadata are retained. Workshop categories currently use the existing category when supplied and `workshop` otherwise. Improving a business category taxonomy requires reviewed catalog metadata.

## Consent and storage

Functional localStorage (`preferredCity`, `ccf-city`) and Ask CCF sessionStorage remain intact. The optional `ccf_ab` cookie now includes Secure on HTTPS and SameSite=Lax. Initial live cookies included Google identifiers; the previous implementation had no consent defaults.

Google now starts with Consent Mode v2's four storage/advertising signals denied. A consent manager should import `updateAnalyticsConsent` from lib/analytics.ts and call it with the visitor's explicit choices for analytics_storage, ad_storage, ad_user_data, and ad_personalization, both when a preference is restored and when it changes. No consent UI or consent persistence is added. Until that integration exists, Google uses cookieless measurement; user/session attribution, new-versus-returning analysis, and Ads modeling have corresponding limitations. Meta is not governed by Google Consent Mode and still needs a consent-manager gate/revocation integration before claiming a complete consent solution. Simple Analytics's existing integration remains separate. Review the privacy notice against actual storage/vendors.

Do not send customer names, contact details, street addresses, free-form form fields, or chat text through analytics. Free-form group size is bucketed only when it is a numeric size/range. URL analytics retain only reviewed marketing or booking query keys, without changing actual navigation URLs. Avoid putting personal information in campaign names or public URL paths.

## Verified purchase setup

The old JSON/shared-secret webhook accepted caller-supplied values, lacked durable deduplication, generated random client IDs, and required a separate GA4 measurement variable that was absent from production. It could not establish verified revenue. The endpoint now accepts native signed Acuity webhooks only; previous JSON examples and shared-secret relay scripts are obsolete. Eventbrite/RezClick relays are not implemented and are rejected.

1. Deploy the new migration and function together. Existing applied migrations are untouched. `analytics_purchases` is a Netlify Database delivery ledger containing only transaction ID, status, and timestamp.
2. Confirm the Acuity account actually settles in USD. Set server-only `ACUITY_CURRENCY` to USD only after that check. Verify runtime scopes for `ACUITY_USER_ID`, `ACUITY_API_KEY`, and `GA4_API_SECRET`. `GA4_MEASUREMENT_ID` is an optional server override; otherwise the existing public GA ID is used.
3. Create an Acuity appointment webhook subscription for scheduled and changed events targeting `https://colorcocktailfactory.com/.netlify/functions/ga4-webhook`. Preserve the raw URL-encoded body and `X-Acuity-Signature`; do not use the old JSON adapter. Use the API key that signs this account's webhook.
4. Validate a provider-signed replay in an isolated test property/preview and use Measurement Protocol's validation endpoint before enabling real delivery. Never post fabricated purchases to the production property.
5. Set server-only `GA4_PURCHASES_ENABLED` to true when validated. Until then the endpoint returns 503 and sends nothing. No setting is enabled by this change.
6. The handler verifies the signature, fetches the appointment through authenticated Acuity API, requires paid=yes, a non-cancelled appointment, and a positive numeric amountPaid, and resolves the class/city against reviewed appointment/calendar IDs. Unknown mappings return 422 for review. A purchase represents one paid appointment (quantity 1), not inferred attendee count or ticket units. Zero-value bookings, deposits not fully paid, cancellations, refunds, and later payment adjustments are not reported as new purchases.
7. Confirm that Acuity actually emits a changed webhook for payment completion in this account. If it does not, add a provider-supported payment notification or a reconciliation job that fetches verified paid appointments and uses the same delivery ledger. Scheduled-only notifications can arrive before payment and are insufficient.
8. Monitor ledger entries in sending/review. Atomic transaction-ID insertion prevents concurrent duplicate purchases. Ambiguous network failures remain held instead of automatic resending. Check GA export/transaction reports and provider records before manually clearing an entry for replay; GA transport success does not prove reporting acceptance. Use the same transaction ID on any authorized retry. This conservative policy can delay revenue until reconciliation.
9. Eventbrite requires a separate verified adapter: authenticate a provider-supported webhook/relay, fetch the order via server API, check payment status/currency and actual totals, map event/city/class, and use provider-prefixed order IDs through the durable ledger. Never translate an arbitrary browser payload into a purchase.

The current server purchase identifier is a deterministic booking-derived pseudonym, NOT a visitor's GA client ID. Revenue can be grouped by class/city, but it cannot yet be attributed reliably to a homepage position or campaign. Completing that join requires a consented first-party client/session/selection token securely linked to the provider booking through supported intake fields/native integration, then validated and looked up server-side. Do not append customer data or arbitrary GA identifiers to Acuity URLs. Booking URLs and Acuity behavior are unchanged in this change. Choose exactly one authoritative purchase sender if a native provider GA integration is also enabled.

## GA4 / Ads / Meta setup

In GA4 Web stream Enhanced Measurement > Page views > advanced settings, turn OFF page changes based on browser history events; this app owns SPA page_view events. Review automatic form interactions so automatic form_submit is never mistaken for generate_lead. Check unwanted referrals and cross-domain configuration only for provider domains that support the same property/tag and linker; GA4 does not automatically bridge an uninstrumented Acuity checkout.

Register these event-scoped custom dimensions (use a display name such as "Workshop city" for `city` to distinguish it from Google's geographic City):

- city
- class_name
- class_id
- class_category
- booking_provider
- card_position
- click_target
- placement
- lead_type
- appointment_type_id
- form_name

Use GA4's built-in ecommerce Item list name (`item_list_name` in items[]) and Item ID/Item name dimensions. Only register an additional event-scoped `item_list_name` if a non-ecommerce exploration specifically needs it. Optionally register selection_source and group_size_range when those reports are needed; do not register transaction IDs or individual booking URLs as high-cardinality custom dimensions.

Mark generate_lead, sign_up, and verified purchase as key events. Mark begin_checkout as an intent key event if useful, but keep it a secondary Google Ads action unless bidding intentionally optimizes for booking clicks. Import GA4 conversions into Ads once; do not also fire duplicate direct Ads conversions. No Ads conversion label is invented. Keep scroll, impressions, selections, and Web Vitals out of conversions. Check Meta Events Manager for PageView/Lead/InitiateCheckout and consent behavior; no fake Meta Purchase events are added.

Build ecommerce explorations by class, position, selected city, device category, source/medium/campaign, and new/returning users where consent allows. Compare viewed items -> selected items -> checkouts. Revenue and position/source-based ROI remain dependent on verified purchases plus the attribution join above. Enable BigQuery export if session-level funnel joins and revenue per 1,000 homepage visitors are required; native aggregate event counts alone do not establish causal attribution.

## Verification and deployment boundary

Local tests: `npm run test:analytics`, `npm run test:analytics:browser` (Netlify dev on 8889), `npm run test:homepage`, `npm test`, and TypeScript checking. Browser tests intercept analytics endpoints and mock form acceptance/rejection. They do not submit real customer inquiries, newsletter subscriptions, or paid bookings. Existing tests passed, with expected warnings from unavailable test rate-limit persistence.

Production was audited before changes; the changed code has NOT been deployed and verified in this session. This build environment explicitly prohibits running build commands and delegates build validation/publication to its enclosing workflow; it also prohibits creating commits. Rebuilding the currently published main revision would not deploy these working-tree changes. No such misleading rebuild was triggered, and no public tag environment values needed changing.

After the workflow publishes this revision, repeat desktop/mobile checks on the production hostname: correct configured IDs, gtag/dataLayer/fbq, one app-authored Google loader, one GA4 and Meta page view per navigation, zero CSP violations, one card select/checkout with metadata, visibility deduplication, city/show-more events, and mocked form success/failure. Google can dynamically load destination-specific code for Ads; distinguish that from a second application-authored loader. Confirm Simple Analytics still has only its platform script. Verify DebugView/Realtime with account access, then validate real organic form submissions against Netlify delivery rather than manufacturing inquiries. Netlify Forms listing returned 401 to the available token; real lead delivery and newsletter delivery were not independently confirmed.

## Environment variable inventory (names only)

| Variables | Scope / role |
| --- | --- |
| NEXT_PUBLIC_GA_ID_1, NEXT_PUBLIC_GOOGLE_ADS_ID, NEXT_PUBLIC_META_PIXEL_ID | Existing public identifiers, available at build time; already matched documented configuration. These are not private credentials. |
| GA4_MEASUREMENT_ID | Optional server-only Measurement Protocol destination override. |
| GA4_API_SECRET | Private runtime Measurement Protocol credential; never expose to the browser. |
| ACUITY_USER_ID, ACUITY_API_KEY | Existing private runtime provider credentials used for signature and appointment verification. |
| GA4_PURCHASES_ENABLED, ACUITY_CURRENCY | New runtime purchase activation and verified currency configuration; not configured by this change. |
| NETLIFY_DB_URL | Platform-managed private runtime database connection. |
| ENABLE_SIMPLE_ANALYTICS, SIMPLE_ANALYTICS_PROXY_ENABLED, SIMPLE_ANALYTICS_EVENT_DATA_EXTENSIONS | Existing platform Simple Analytics settings; preserved. |
| WEBHOOK_SECRET | Audited legacy relay credential; no longer accepted by the new Acuity-native endpoint, not deleted from Netlify. |

No private environment value was added to a public variable or written into the repository.
