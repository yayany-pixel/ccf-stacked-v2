# Workshop sale banner

The shared Chicago/Eugene homepage banner displays a live countdown timer for active flash sales.

## Timing and cycle schedule

By default, the sale banner follows the recurring offer cycle synchronized with `/countdown.html`:
- Time zone: `America/Chicago`
- Anchor date: `October 11, 2026`
- Cycle length: `3 days` (resets at 12:00 AM Central time)

When the remaining time is 24 hours or more, the banner displays days, hours, minutes, and seconds:
`[ 02 ] DAYS : [ 09 ] HOURS : [ 26 ] MINUTES : [ 31 ] SECONDS`

When the remaining time is under 24 hours, the banner displays hours, minutes, and seconds:
`[ 07 ] HOURS : [ 42 ] MINUTES : [ 18 ] SECONDS`

## Configurable campaign deadline

To set an explicit deadline for a specific campaign instead of using the recurring cycle:
- `NEXT_PUBLIC_WORKSHOP_SALE_MODE`: `campaign`
- `NEXT_PUBLIC_WORKSHOP_SALE_DEADLINE`: ISO 8601 deadline with timezone, e.g. `2026-12-01T23:59:59-06:00`.

If no campaign deadline is provided or if `NEXT_PUBLIC_WORKSHOP_SALE_MODE` is left unset, it automatically operates on the shared 3-day recurring cycle.

## Optional visitor-specific offer

- `NEXT_PUBLIC_WORKSHOP_SALE_MODE`: `random-start`
- `NEXT_PUBLIC_WORKSHOP_SALE_VISITOR_SPECIFIC`: `true`
- `NEXT_PUBLIC_WORKSHOP_SALE_OFFER_ID`: stable offer identifier
- `NEXT_PUBLIC_WORKSHOP_SALE_MIN_HOURS`: default `3`
- `NEXT_PUBLIC_WORKSHOP_SALE_MAX_HOURS`: default `12`

## Validation

Run `node --import tsx tests/workshop-sale.ts` for deadline calculations, countdown units formatting, cycle behavior, and persistence checks.
