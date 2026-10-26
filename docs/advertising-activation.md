# Advertising integration activation — 23 October 2026

## Delivery status

Code is prepared for review. This change does not claim that live credentials, dataset event-write permission, Acuity subscriptions, database migrations, Google Ads imports, or production event receipt have been verified. No real bookings, inquiries, or ad campaigns are created by these tests.

The browser and CAPI share `resolveMetaDatasetId`: absent/blank configuration defaults to **315271500363564**. An explicit configured ID wins, so the existing legacy production variable MUST be changed during activation; a source-code default does not override it. `components/MetaPixel.tsx` consumes the same browser ID. CAPI still requires an explicitly matching validated ID, its own token, an explicit Graph version, and activation flags. Do not assert validation by merely setting a flag.

## Netlify variables

Set production values in Site configuration → Environment variables. Rebuild after changes. Never place private credentials in NEXT_PUBLIC variables, source, command arguments, or logs.

| Variable | Value / purpose | Required scope |
| --- | --- | --- |
| NEXT_PUBLIC_META_PIXEL_ID | `315271500363564` | Builds AND Functions |
| META_CAPI_VALIDATED_PIXEL_ID | `315271500363564`, only after dataset event-write validation | Functions |
| META_GRAPH_API_VERSION | `v26.0` | Functions |
| META_CAPI_ACCESS_TOKEN | Secret dataset event-write token | Functions |
| META_CAPI_ENABLED | `true` after isolated Lead validation | Functions |
| META_CAPI_PURCHASES_ENABLED | `true` only after signed purchase, consent handoff, and receipt validation | Functions |
| META_CAPI_TEST_EVENT_CODE | Temporary isolated test code; remove from production after validation | Functions |
| META_ACCESS_TOKEN | Separate secret reporting token with `ads_read` and access to the ad account | Functions |
| META_AD_ACCOUNT_ID | `950834718873487` (or `act_950834718873487`); confirm intended account in Meta | Functions |
| META_REPORTING_API_VERSION | `v26.0` (also the code default) | Functions |
| ANALYTICS_REPORT_PASSWORD | New strong secret; analytics HTTP Basic username is `admin` | Builds AND Functions; available to middleware |
| ACUITY_USER_ID, ACUITY_API_KEY | Secret Acuity API credentials; key verifies the native webhook signature | Functions |
| ACUITY_CURRENCY | `USD`, after confirming actual account settlement currency | Functions |
| GA4_MEASUREMENT_ID | Actual GA4 stream ID; falls back to NEXT_PUBLIC_GA_ID_1 | Functions |
| GA4_API_SECRET | Secret Measurement Protocol credential for that stream | Functions |
| GA4_PURCHASES_ENABLED | `true` after isolated Measurement Protocol validation | Functions |
| ACUITY_META_CONSENT_FIELD_ID | Verified intake field carrying explicit advertising consent | Functions |
| ACUITY_META_FBP_FIELD_ID, ACUITY_META_FBC_FIELD_ID | Reviewed existing consented cookie context; at least one valid matching identifier | Functions |
| ACUITY_META_USER_AGENT_FIELD_ID | Actual consented browser user agent field | Functions |
| NETLIFY_DB_URL | Platform-managed database connection; do not manually copy into code | Functions |
| NEXT_PUBLIC_GA_ID_1, NEXT_PUBLIC_GOOGLE_ADS_ID | Existing public Google identifiers; preserve verified values | Builds |

Existing Netlify keys retain their scopes when updated through the connector. Confirm scopes in the UI rather than assuming an upsert changes them. Use separate preview credentials and a Test Events code for nonproduction CAPI.

## Reporting

`/analytics` renders a server-side Meta section. Middleware protects `/analytics` and `/api/analytics/*` with HTTP Basic authentication; without a password configuration it fails closed with 503. Use HTTPS. Credentials are never serialized into page props. API reads use Authorization headers, no-store caching, bounded pagination, trusted URL reconstruction, and sanitized error categories. Missing configuration, denied ads_read, provider/network failure, and verified zero spend are distinct states. Unavailable values are not displayed as zero.

Four CCF blueprints appear as recommendations at $3–$4/day, including audience geography, ages, interests, and optimization goals. They are not claimed to be active ads. Verify workshop availability and prices before launching. Reporting never creates campaigns or spends money.

Last-30-day KPIs use weighted CPC and CTR. Primary conversions count leads for lead objectives and purchases for other objectives, selecting one action alias rather than adding overlapping aliases. InitiateCheckout is not a purchase. Campaign totals cannot prove an ad set has exited Meta learning; the UI explicitly describes this limitation instead of claiming that 50 aggregate actions mean a trained algorithm.

## Consent and conversion delivery

Google Consent Mode v2 defaults and the database-backed privacy-preference flow are preserved. Marketing defaults denied, saved choices are restored before advertising, and GPC/DNT take precedence. CAPI requires explicit granted matching context and actual browser user agent; no email, phone, or customer names are added.

Acuity uses `netlify/functions/ga4-webhook.mts` (not .ts). Native webhook HMAC-SHA256 verification covers the raw body. Appointment actions are allowlisted and the authenticated appointment ID must match. Delivery requires `paid=yes`, non-cancelled status, positive amountPaid, verified USD, and a canonical appointment/calendar mapping. Meta also corroborates payment totals and original payment timestamps using authenticated payment records. GA and Meta use the same canonical class category.

GA and Meta have separate primary-key ledgers (`analytics_purchases` and `meta_event_deliveries`). Meta runs before GA's duplicate check; its failure does not prevent GA delivery. GA failure does not undo Meta delivery. Ambiguous delivery remains in sending/review for reconciliation. Existing migrations/schema are sufficient; verify those migrations were applied to the target database before activation.

Netlify `submission-created.ts` already validates signed platform form metadata, registered form IDs, spam status, consented context, and shared browser/server event IDs. Existing exact-adapter/concurrency tests remain intact.

**Remaining attribution dependency:** configured intake field IDs alone do not create an Acuity handoff. Establish a supported consented handoff and withdrawal invalidation before enabling Meta purchases. The existing GA booking-derived pseudonym is not a browser client/session ID and cannot establish campaign ROI by itself. Do not claim source-to-purchase attribution until that join is validated. No fabricated identifiers or production payments are created to fill this gap.

## Activation and acceptance

1. Configure the dashboard password, public dataset ID, and isolated runtime credentials. Confirm database ledger tables exist.
2. In Meta Events Manager, validate the actual token's event-write access to the target dataset and matching browser/server Lead event IDs in Test Events. Validate real Netlify form metadata. Preserve legacy pixel/audience history.
3. Confirm USD in Acuity, implement/verify consented attribution handoff and withdrawal, and subscribe native scheduled/changed appointment notifications to `https://colorcocktailfactory.com/.netlify/functions/ga4-webhook`. Acuity warns that overlapping subscriptions may duplicate deliveries; the ledgers are designed for that. Confirm payment completion actually generates a notification. Use provider-approved isolated fixtures, not manufactured production purchases.
4. Validate GA Measurement Protocol payloads against its debug endpoint in an isolated property. Verify actual reporting receipt; HTTP 204 alone is insufficient.
5. Enable each destination independently only after its acceptance checks. Remove temporary production test configuration, rebuild, and confirm genuine consented receipts and ledger status.
6. In GA4/Google Ads, link the intended accounts and import verified purchase/generate_lead key events once. Keep begin_checkout secondary unless deliberately optimizing for intent. Do not add duplicate direct Ads purchase events; this code does not change account-level Ads conversion settings.

## Validation commands

- `npx tsc --noEmit`
- `npm run test:meta` (includes reporting fallback/pagination/aliases/default tests)
- `npm run test:analytics` (includes signed webhook, paid-state, canonical IDs, independent-destination and duplicate-delivery tests)
- `npm test`
- `npm run build`

Tests mock conversion transport and database writes; passing them is not evidence of production event receipt. Existing visitor tests intentionally exercise unavailable-database fallbacks without production credentials.

Official references: https://developers.acuityscheduling.com/docs/webhooks ; https://developers.acuityscheduling.com/reference/get-appointments-id-payments ; https://developers.facebook.com/docs/marketing-api/insights/ ; https://developers.google.com/analytics/devguides/collection/protocol/ga4/validating-events

### Results for this change

- TypeScript, Meta suite, analytics suite, and production build pass (403 generated pages).
- Full `npm test` needs `NEXT_PUBLIC_GA_ID_1=G-TESTONLY` for the existing deduplication fixture. With that test-only identifier, all 18 comprehensive QA checks pass; the final live-pricing check is blocked by missing local Acuity credentials.
- Production-server HTTP smoke check: anonymous analytics returns 401; authenticated analytics returns 200 with the Meta section, all four fallback blueprints, and the new dataset display (no legacy ID).
- Playwright browser execution is unavailable: the Chromium download returned an invalid/truncated archive. No visual/browser pass is claimed.
- Netlify environment inventory was rejected by automatic approval review because the connector's bulk operation could reveal unrelated secrets. No environment changes were made and no live credential state is claimed.
