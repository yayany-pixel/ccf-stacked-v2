# Workshop sale banner

The shared Chicago/Eugene homepage banner uses an absolute deadline. It defaults to neutral **Workshop offers** wording because no campaign deadline is supplied in the repository. The countdown and Flash Sale claim disappear at expiry; prices, booking destinations, and checkout rules are unchanged.

## Campaign deadline (production default)

Set `NEXT_PUBLIC_WORKSHOP_SALE_MODE` to `campaign` (or leave it unset) and set `NEXT_PUBLIC_WORKSHOP_SALE_DEADLINE` to the actual campaign's ISO 8601 deadline with an explicit timezone, such as `2026-12-01T23:59:59-06:00`. This date is only a format example, not an enabled campaign. Missing, invalid, timezone-less, or expired deadlines show neutral wording. These public configuration settings are compiled into the client; redeploy after changing them.

## Optional visitor-specific offer

Only use `random-start` for an offer that genuinely expires for that visitor and whose eligibility is enforced separately. This banner does not implement or change eligibility or discounts. Do not enable this mode for a general campaign or merely to create urgency.

- `NEXT_PUBLIC_WORKSHOP_SALE_MODE`: `random-start`.
- `NEXT_PUBLIC_WORKSHOP_SALE_VISITOR_SPECIFIC`: explicitly `true`; otherwise random-start is disabled and the actual campaign deadline is used if configured.
- `NEXT_PUBLIC_WORKSHOP_SALE_OFFER_ID`: a nonempty, stable identifier for the offer, shared across cities. Change it only for a genuinely new offer, not to reset an expired offer.
- `NEXT_PUBLIC_WORKSHOP_SALE_MIN_HOURS`: positive number; defaults to `3`.
- `NEXT_PUBLIC_WORKSHOP_SALE_MAX_HOURS`: number at least as large as the minimum; defaults to `12`.

The browser chooses and saves one absolute deadline per offer in localStorage, as required for browser-local persistence. Refreshes, navigation, city switching, and later visits reuse it, including after expiry. Changing duration bounds does not replace an existing deadline. Unavailable storage, corrupt saved deadlines, or invalid settings fail closed to neutral wording, rather than creating an unpersisted timer. Clearing browser data or using another browser creates a new browser identity; this UI is not an eligibility enforcement mechanism. No server-side records or database migrations are needed.

## Validation

Run `node --import tsx tests/workshop-sale.ts` for deadline configuration and persistence checks. Run `node tests/workshop-sale-browser.cjs` against the local Netlify development server on port 8889 for responsive layout, refresh/navigation persistence, city switching, timer accuracy, expiry, and accessibility checks. For active browser checks, configure a test-only visitor-specific offer with random-start enabled before starting that server. Without a configured deadline, the browser test checks the neutral fallback.
