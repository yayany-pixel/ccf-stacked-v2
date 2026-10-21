# Controlled Meta dataset migration — 21 October 2026

Status: PREPARED, NOT ACTIVATED. This audit supersedes conflicting historical status claims in meta-analytics.md. Do not merge/deploy as a completed tracking migration.

## Verified live state

- Site teal-concha-819f3e / 59df13dc-1a2e-40e2-8a0c-20901ea6422e, colorcocktailfactory.com.
- Published deploy 6ad91dbaf837dc8f0b08a5ff, commit 43224d2f980b8b8f88ab265110d4554704a52e62.
- Live browser initializes legacy pixel 1554498828184467. It requests the library and queues events before saved advertising denial loads. This branch fixes that race and removes advertising-click/default marketing consent.
- Ad account act_950834718873487 is Naughty Things. HYPD Info account lists Conversion Pixel 315271500363564, owned by Color Cocktail Factory business 2086421151454754.
- Existing development CAPI token read both the target dataset and ad account successfully through v26.0. Production token is masked; its event-write authorization has NOT been verified. No test event or production conversion was submitted.
- Netlify META_AD_ACCOUNT_ID is corrected; NEXT_PUBLIC_META_PIXEL_ID remains legacy; META_CAPI_ENABLED=true but META_GRAPH_API_VERSION absent. CAPI is disabled by required configuration.
- Production has no submission-created function. Registered form IDs: private-party 692cbf5dc836c30008e87c35; birthday-party 69a50e767120ed0008557c97.
- Acuity webhooks currently target other integrations only. None points to this site's ga4-webhook. ACUITY_CURRENCY, GA4_PURCHASES_ENABLED and all ACUITY_META_* attribution field settings are absent.
- Website HTML has no facebook-domain-verification tag. DNS/account verification status, automatic events, advanced matching, permissions and Test Events need authenticated Meta review.

## Prepared changes

- Advertising starts denied while saved preferences load; a new visitor defaults to advertising off, including paid-ad arrivals. Saved explicit grants and GPC/DNT precedence remain supported.
- Private-party and birthday accepted browser Leads share an opaque event ID with registered form fields. Matching context includes the actual browser user agent and consented existing _fbp/_fbc cookies. Customer names, messages, email and phone are excluded from Meta.
- submission-created uses Netlify's signed modern formSubmitted event, not a public fetch handler. It requires exact platform form-name and matching registered meta_form_name, consent, valid cookie context, user agent, city and event ID. Missing platform identity fails closed. **Validate the real platform event shape in staging: if form-name is omitted from event.data, this implementation intentionally skips server delivery. Do not relax it to trust an arbitrary client field. Add a platform-metadata/verified submission lookup adapter instead.**
- Existing atomic dataset:event:event-ID ledger prevents concurrent server delivery. No ledger schema mutation performed.
- CAPI additionally requires META_CAPI_VALIDATED_PIXEL_ID to match NEXT_PUBLIC_META_PIXEL_ID. Purchase requires its own META_CAPI_PURCHASES_ENABLED=true. Nonproduction contexts require a Test Events code. Existing production variables do not activate this prepared code.
- Acuity retains signature validation, authenticated paid-appointment/payment reads, matching totals, actual payment timestamp and stable purchase:acuity:{id}. No browser Purchase, fake payment, order assumption or Eventbrite Purchase is added.
- Read-only reporting uses v26.0 and separate ads_read credentials. Lead/Purchase CPA are separate; overlapping funnel stages do not become one conversion count or a learning-status claim. Reporting errors do not claim CAPI works.

## Activation sequence

1. Sign in securely to Meta Events Manager for 315271500363564. Inspect domain verification, connected account, dataset event permissions, automatic collection and advanced matching. Obtain an isolated Test Events code and validate the actual production CAPI credential's dataset event-write access. Keep all secrets out of chat, source and diagnostic logs.
2. Stage with NEXT_PUBLIC_META_PIXEL_ID=315271500363564 (build scope), a verified dataset token (secret, functions scope only), META_GRAPH_API_VERSION=v26.0, META_CAPI_VALIDATED_PIXEL_ID=315271500363564, META_CAPI_ENABLED=true and temporary META_CAPI_TEST_EVENT_CODE (secret, functions scope). Test accepted/rejected forms, actual platform event shape, one browser/server Lead pair with identical IDs, receipt and deduplication. Do not reuse live production credentials in unrelated previews. No test code is configured by this branch.
3. Establish a provider-supported consented Acuity attribution handoff that honors withdrawal. Verify currency from Acuity, configure exact field IDs, verify required database ledger exists and validate native signed webhooks/payment notifications on staging. Do not create paid bookings to test. Genuine verified payments or provider-approved isolated fixtures must establish correctness before META_CAPI_PURCHASES_ENABLED=true.
4. After validation, set matching production browser/server ID and runtime credential/config together and build atomically. Keep Purchases disabled until their own checks pass. Remove Test Events configuration, confirm the live production domain and genuine consented events, and inspect Events Manager diagnostics. Do not send to both pixels or delete legacy pixel/audiences.
5. Fix forward if necessary: revert the migration commit/config and build a fresh deploy. Preserve old pixel/audience history; never restore or publish an old Netlify deploy through rollback APIs.

Blocked: secure Meta sign-in/Test Events, production token validation, real platform form event validation, provider attribution/currency/webhook setup, and real conversion receipt. No claim of live new-dataset events or paid revenue tracking is justified yet.

## Validation completed

Production build and TypeScript no-emit check pass using package-lock.json dependencies. Meta unit tests, exact form adapter/concurrent deduplication tests, analytics unit/component checks and fabricated-purchase rejection checks pass. Desktop/mobile Meta navigation and denial/grant tests pass. New consent tests cover saved denial, missing preferences and lookup failure on paid-ad arrivals at both widths. Form browser tests intercept all submissions and external collection; no real customer inquiry or booking is created.

The older general analytics browser suite is not a passing check: its gtag stub is overwritten by the existing layout bootstrap, and its card link selector also predates the current two-link card. The broad audit browser suite requires Netlify's /api/privacy function and returns 404 under plain Next.js. These limitations are not represented as passing production checks.
