# Workshop sale banner

The shared Chicago/Eugene homepage banner appears only for a verified promotion on an active offering in the selected city's live catalog.

## Verification and deadline

`lib/promotions.ts` is the only source of promotion windows and verified regular prices. A promotion is displayed only when:

- The current time is inside `PROMOTION_START_ISO` / `PROMOTION_END_ISO`.
- Acuity returned a valid current price equal to the configured `promoPrice`.
- The configured `regularPrice` is strictly greater than that live price.

The current price is never replaced by a promotion or a fallback. Missing live prices show "See price at checkout" without a sale or crossed-out price. The banner counts down to `PROMOTION_END_ISO` and disappears at expiry.

When the remaining time is 24 hours or more, the banner displays days, hours, minutes, and seconds:
`[ 02 ] DAYS : [ 09 ] HOURS : [ 26 ] MINUTES : [ 31 ] SECONDS`

When the remaining time is under 24 hours, the banner displays hours, minutes, and seconds:
`[ 07 ] HOURS : [ 42 ] MINUTES : [ 18 ] SECONDS`

There is no recurring cycle, random deadline, visitor-specific persistence or environment-variable deadline override. The former standalone countdown page has been removed.

## Validation

Run `node --import tsx tests/workshop-sale.ts` for live-price verification, the fixed promotion deadline, expiry, equal-price rejection and countdown formatting. `npm run test:audit` also runs these checks.
