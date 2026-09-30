# Groupon preparation tools

The existing authenticated CCF MCP endpoint now advertises two Groupon
preparation tools. This version does **not** connect to Groupon's merchant API.
It adds no new account access, credentials, storage, or redemption operations.

## Available tools

- `groupon_connection_status`: reports the implementation stage and remaining
  onboarding work. It makes no external request and does not test credentials.
- `groupon_find_acuity_bookings`: searches Acuity appointments for an exact
  voucher code in `certificate`, and optionally selected intake-form field IDs.
  Codes are compared case-sensitively after trimming outer whitespace. Notes,
  arbitrary form fields, substrings, names, and emails are not used as matches.

Example arguments for the matcher:

```json
{
  "voucherCode": "EXAMPLE-ONLY",
  "minDate": "2026-09-30",
  "maxDate": "2026-09-30",
  "formFieldIDs": [12345]
}
```

Replace `12345` with the existing voucher field ID discovered through
`acuity_list_forms`, or omit `formFieldIDs` to search certificates only. Use
`calendarID` or `appointmentTypeID` to narrow results. Date filters use Acuity's
account interpretation of dates; check returned appointment dates and calendar.
The maximum inclusive interval is 31 days. The search includes canceled records
so a code on a canceled registration is not mistaken for an active booking.

Each request retrieves at most 100 appointments. When the cap is reached, the
result explicitly requires a narrower search. Multiple matches, canceled
registrations, no-shows, or unknown attendance flags require review. Even a
single active registration is **not** proof of attendance, Groupon voucher
validity, or redemption. No result means no exact match in the searched records
and selected fields; it does not mean the voucher is invalid.

Results omit the voucher code, email, phone, notes, payment data, and unrelated
form answers. The existing endpoint token remains required. Do not publish its
full URL. Nothing from the Merchant Center browser session is copied to Netlify.

## Remaining Groupon work

1. Obtain merchant approval and credentials for the **Point of Sale Redemptions
   API**. Merchant Center's Google login does not grant this API access.
2. Read the current official voucher lookup/redemption specification and verify
   its authentication, merchant scoping, base URL, schemas, sandbox, and errors.
3. Implement lookup using that verified contract. Add redemption only with a
   fresh lookup, explicit user confirmation, audit records, and documented retry
   behavior to avoid duplicate or uncertain writes.
4. Test the provider integration in an approved environment, configure secrets
   in Netlify, and refresh the connected ChatGPT app's tool definitions.

Do not substitute the Tours and Attractions reservation-redemption API or the
Partner Storefront catalog API for a merchant POS voucher integration. Do not
derive unsupported endpoints from private browser traffic. Financial reports,
refunds, payouts, and deal editing have not been verified as available via API.

## Onboarding observations (2026-09-30)

Merchant Center sign-in succeeded for Color Cocktail Factory. Its Connections
page displayed Booker, Mindbody, and Square integrations, with no visible
self-service API credential control. The separate developer login remained at
a Cloudflare bot-verification screen in the task browser. No account settings
were changed and no API request or support message was submitted.

The official developers page links a Google Drive PDF titled
`GrouponConnect Redemption API.pdf`. Automated access to that PDF was blocked
by approval review because its access status was unverified; its contract has
not been read and is intentionally not guessed in this implementation.

## References and verification

- [Groupon Developers](https://www.groupon.com/developers)
- [Developer signup](https://www.groupon.com/developers/signup)
- [Linked POS API specification](https://drive.google.com/file/d/1k00mVXkHcZqGTQe7AjWSE2u8--nx7NN8/view?usp=sharing)
- [Acuity appointment reads](https://developers.acuityscheduling.com/reference/appointments)

Run `npm test` for existing regressions and the Groupon preparation tests.
Tests use synthetic registrations, dummy credentials, and mocked fetch; they
do not access customer records or perform live redemption.
