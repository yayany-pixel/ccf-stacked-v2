# Groupon MCP integration draft

The existing authenticated CCF MCP endpoint now advertises two Groupon
preparation tools. This version does **not** connect to Groupon's merchant API.
The documented POS API adapter is implemented and covered by mocked tests, but
is deliberately not imported by the MCP route. There is no production signer,
new credential, or live Groupon redemption tool in this draft.

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

## Verified POS contract and implemented adapter

The official eight-page `GrouponConnect Redemption API` PDF was downloaded and
reviewed on 2026-10-01 UTC with the account owner's approval. Its PDF creation
date is 2025-09-25; no API revision identifier is stated. The following contract
comes from that document, not the separate appointments/tours API:

| Operation | Documented contract |
| --- | --- |
| Lookup | `GET https://offer-api.groupon.com/partners/{partner}/v1/units` with comma-delimited `redemptionCodes` (maximum 10) and optional `show=deal_info,option_info` |
| Status | `available`, `redeemed`, `cancelled`, `refunded`, or `expired` |
| Money | Integer minor units and a three-letter uppercase currency code |
| Redeem | `PATCH` to the same units endpoint; `data` entries containing `redemptionCode`, `status: "redeemed"`, and RFC3339 `updatedAt` |
| Headers | `Content-Type: application/json`, `X-Request-ID`, `X-Client-ID`, and a signed `Authorization` value |
| Update response | Per-voucher `data` and/or `errors`; documented examples include HTTP 200, 207, and 400 |

`lib/groupon-api.ts` implements this request/response contract with an injected
signer. It has no default signer and no runtime MCP wiring. The signer input is
the exact method, URL, headers, and serialized body. Authentication must be
implemented from Groupon's separate signing guide before this adapter is used.

The adapter enforces a server-configured deal allowlist, exact returned-code
matching, known statuses, fixed HTTPS host, a request timeout, disabled caching,
and no redirects or automatic retries. Only documented response fields survive
parsing. Missing deal information or an unexpected deal fails closed. The
allowlist is an application safeguard; Groupon must still confirm credential
scoping to Color Cocktail Factory. Lookup is conservatively limited to codes
of 1–98 characters, matching the document's update limit, with commas rejected.

Its internal single-voucher redemption method requires explicit attendance and
redemption approval bound to a unit ID, redemption code, and approved deal ID.
It checks a fresh lookup for exactly one matching `available` unit, sends one
PATCH, checks the specific returned status and errors, and performs another
lookup before reporting `verified_redeemed`. HTTP 200/207 alone is insufficient.
Failures after a possible update return `unconfirmed` and prohibit automatic
retry; the operator must reconcile the current Groupon state. Expired vouchers
require a separate merchant decision and are not redeemed by this method.

The PDF contains inconsistent examples (`grouponCode` vs. required
`redemptionCode`, and a `cancelled` result under a nominal success response).
The adapter uses the returned canonical `redemptionCode` and checks actual
per-voucher status. `X-Request-ID` is a correlation identifier, not a documented
idempotency guarantee. Fresh reads cannot eliminate concurrent updates or prove
that this particular request caused a redeemed status.

## Remaining work before activation

1. Obtain merchant approval for the **Point of Sale Redemptions API**, partner
   and client IDs, scoped signing credentials, and the separate **GrouponConnect
   Security / Request Signing** guide. The PDF references this guide but does
   not specify an algorithm, canonical request format, or authorization syntax.
   Merchant Center's Google login does not grant server API access.
2. Confirm CCF's approved deal IDs, credential scope, test environment, test
   vouchers, certification process, and provider guidance on concurrent updates
   and uncertain-result reconciliation. These details are absent from the PDF.
3. Implement the verified signer. Before exposing redemption through MCP, add
   durable, expiring approval records bound to the exact voucher/action, one-use
   approval consumption, and a durable audit/reconciliation record. The internal
   method's boolean approval parameters do not provide those protections.
4. Complete provider-approved testing and certification. Only then configure
   secrets in Netlify, wire and advertise live tools, deploy, and refresh the
   connected ChatGPT app's tool definitions. No live request has been tested.

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

The owner subsequently authorized downloading the linked POS PDF, and it was
successfully read. The public appointments/tours OpenAPI download also omits
the POS request-signing details. No browser session cookies are used as API
credentials. No support message or access application has been submitted.

### Prepared API access request (not sent)

Color Cocktail Factory would like to integrate the GrouponConnect Point of Sale
Redemptions API with its existing booking tools for voucher lookup and explicitly
approved redemption. The merchant account email is
`info@colorcocktailfactory.com`. Please provide the POS onboarding/approval
process, partner and client IDs, securely provisioned merchant-scoped signing
credentials, and the GrouponConnect Security / Request Signing guide referenced
in the redemption PDF. Please also confirm our approved deal IDs, test environment
and vouchers, certification requirements, and how to reconcile a timed-out
redemption without risking a duplicate update. We have reviewed the linked POS
specification and are ready to implement and certify its authentication.

## References and verification

- [Groupon Developers](https://www.groupon.com/developers)
- [Developer signup](https://www.groupon.com/developers/signup)
- [Linked POS API specification](https://drive.google.com/file/d/1k00mVXkHcZqGTQe7AjWSE2u8--nx7NN8/view?usp=sharing)
- [Acuity appointment reads](https://developers.acuityscheduling.com/reference/appointments)

Run `npm test` for existing regressions and the Groupon preparation tests.
Adapter tests cover code bounds, signing-header validation, deal scope, exact
request bodies, approval requirements, ineligible statuses, ambiguous matches,
partial failures, post-update verification, and no automatic retries. All tests
use synthetic registrations, dummy signatures, and mocked fetch; they do not
test live authentication, access customer records, or perform live redemption.
