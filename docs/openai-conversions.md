# ChatGPT booking conversion measurement

The existing Ads Manager conversion **Class Booking Completed** uses `appointment_scheduled`. The clicks campaign can report this event without changing its objective or budget.

## Live path

1. `OpenAIPixel` loads only on the production domain after Advertising consent. It sends page views, never booking or purchase events. Development tests use mocked provider endpoints; deploy previews never send pixel events.
2. The original `oppref` and Pixel `__obref` are carried inside the existing encrypted Acuity reference field (`19375784`), not exposed as raw identifiers in booking links. Google matching remains independent; an OpenAI reference can be issued when Google identifiers are unavailable.
3. Acuity sends `appointment.changed` to `https://colorcocktailfactory.com/.netlify/functions/openai-booking-webhook`. The receiver checks HMAC-SHA256, fetches the appointment and its payments, requires paid=yes, non-cancelled and corroborated positive payment amount/time, and rechecks the saved advertising preference.
4. The receiver sends `appointment_scheduled` through CAPI, with the same stable ID on retries. The independent `openai_event_deliveries` ledger suppresses accepted duplicates. Temporary delivery failures return 500 for Acuity retries. No customer names, email, telephone, IP address, or payment-card data are sent. Optional future personalization is opted out.

## Configuration

- `NEXT_PUBLIC_OPENAI_PIXEL_ID`: existing Ads Manager pixel; production Builds and Functions.
- `OPENAI_CONVERSIONS_API_KEY`: Ads Manager **Conversions API key**, secret, production Functions only. This is not a model/API-platform key.
- `OPENAI_CONVERSIONS_ENABLED=true`: production Functions.
- Existing `ACUITY_USER_ID`, `ACUITY_API_KEY`, `ACUITY_CURRENCY=USD`, and `ACUITY_GA4_REFERENCE_FIELD_ID` are reused.
- The new table migration is applied by Netlify on deploy.

## Validation and limits

Run `node --import tsx tests/openai-conversions.ts`, `node scripts/test-booking-reference.cjs`, the browser consent checks, and the Next.js build. Validate CAPI credentials using `validate_only: true`; do not save synthetic booking conversions. Inspect a newly completed, consented booking in the Event Stream to verify live receipt. Receipt alone is not proof of ad attribution. Unpaid, canceled, historical, revoked-consent, or missing-reference appointments do not send events. Direct Acuity visits without a website advertising reference are not attributed by this integration.

All booking IDs are used only for verification and deduplication. Payment values use USD cents and provider payment timestamps. No historical backfill or campaign bidding migration is included.
