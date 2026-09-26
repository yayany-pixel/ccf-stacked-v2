# CCF Acuity MCP

The connector exposes 36 tools: 23 read/validation tools and 13 mutation tools.
Server metadata version: `1.2.0`.

The endpoint is `/api/acuity-mcp/[token]/mcp`. The token is a credential; do not
publish the full URL. Netlify Functions require `CCF_MCP_TOKEN`, `ACUITY_USER_ID`,
and `ACUITY_API_KEY` as production secrets. No credential belongs in this repository.

## Original tools retained

Read: `acuity_status`, `acuity_list_calendars`, `acuity_list_appointment_types`,
`acuity_list_classes`, `acuity_list_appointments`, `acuity_get_appointment`,
`acuity_search_clients`, `acuity_get_payments`.

Write: `acuity_create_appointment`, `acuity_update_appointment`,
`acuity_reschedule_appointment`, `acuity_cancel_appointment`,
`acuity_create_calendar_block`, `acuity_delete_calendar_block`.

## Additional read and validation tools

| Tool | Public API request | Main inputs |
| --- | --- | --- |
| `acuity_list_available_dates` | GET `/availability/dates` | `month`, `appointmentTypeID`; optional calendar, timezone, add-on IDs |
| `acuity_list_available_times` | GET `/availability/times` | `date`, `appointmentTypeID`; optional calendar, timezone, add-on and ignored appointment IDs |
| `acuity_check_available_times` | POST `/availability/check-times` | `slots` array of `{datetime, appointmentTypeID, calendarID?}` |
| `acuity_list_calendar_blocks` | GET `/blocks` | Optional `minDate`, `maxDate`, `calendarID`, `max` |
| `acuity_list_certificates` | GET `/certificates` | Optional string `productID`, `orderID`, `appointmentTypeID`, `email` |
| `acuity_check_certificate` | GET `/certificates/check` | `certificate`, `appointmentTypeID`; optional `email` |
| `acuity_list_forms` | GET `/forms` | None |
| `acuity_list_appointment_addons` | GET `/appointment-addons` | None |
| `acuity_list_labels` | GET `/labels` | None |
| `acuity_list_products` | GET `/products` | Optional `deleted` boolean |
| `acuity_list_orders` | GET `/orders` | Optional `max` |
| `acuity_get_order` | GET `/orders/{id}` | `id` |
| `acuity_list_webhooks` | GET `/webhooks` | None |
| `acuity_get_account` | GET `/me` | None |
| `acuity_get_service_metadata` | GET `/meta` | None |

Availability checking uses POST but does not create a booking or reserve a slot.
All 23 reads advertise `readOnlyHint: true`. All tools advertise external API
access with `openWorldHint: true`.

## Additional writes

| Tool | Public API request | Main inputs |
| --- | --- | --- |
| `acuity_create_client` | POST `/clients` | `firstName`, `lastName`; optional `phone`, `email`, `notes` |
| `acuity_update_client` | PUT `/clients` | `match` containing existing name/optional phone; `updates` containing replacement name/optional contact details and notes |
| `acuity_delete_client` | DELETE `/clients` | Existing `firstName`, `lastName`; optional `phone` |
| `acuity_create_certificate` | POST `/certificates` | Exactly one of `productID` or `couponID`; optional `certificate`, `email` |
| `acuity_delete_certificate` | DELETE `/certificates/{id}` | Exact record `id` from the certificate list/create response |
| `acuity_create_webhook` | POST `/webhooks` | `event`, `target` |
| `acuity_delete_webhook` | DELETE `/webhooks/{id}` | `id` |

Writes require user authorization for the actual operation. Enabling a tool is
not authorization to modify a record. Client update identity is transmitted in
query parameters; replacements go in the JSON body. Delete calls have no body.
Client deletion matches name and optional phone, so use client search to confirm
the intended record. Updating a client's name can change the identity needed for
later updates; do not assume repeating the original update is idempotent.

Certificate creation grants a code for an existing package or coupon. It does
not create package/coupon definitions or collect payment. The delete reference
does not constrain certificate ID type, so this connector accepts integer or
opaque string IDs, encoding string path segments safely.

Webhook creation immediately enables ongoing notifications to an external
destination. Use only an explicitly authorized receiver. Supported events are
`appointment.scheduled`, `appointment.rescheduled`, `appointment.canceled`,
`appointment.changed`, and `order.completed`. Acuity allows 25 webhooks per
account and target ports 80/443. Full target URLs are redacted in responses;
origins, event names, status, and subscription IDs remain available. Account
responses omit authentication IDs and credentials.

## Limits and verification

- Use bounded dates for class/block queries; an unrestricted production class
  query previously timed out. Availability checks do not reserve inventory.
- Bulk slot validation considers shared-resource/global limits per calendar;
  it does not guarantee a collection of bookings can all be created together.
- Block/order lists default to 100 results when `max` is absent. The documentation
  does not promise pagination beyond the documented filters and `max`.
- Appointment-type/class-definition creation, package/product-definition
  creation, and payment charging/refunds are not exposed here. Those operations
  were not found in the standard public API documentation reviewed for this work.
- Acuity does not document a mutation dry-run mode. Tests mock successful API
  writes and verify that invalid production write inputs are rejected locally.
  No successful live mutation is needed to verify deployment or tool discovery.
- Run `npm test` for the offline API contract and validation tests. Tests use
  dummy credentials and mocked fetch; they never contact Acuity.

## Official request references

- [Available dates](https://developers.acuityscheduling.com/reference/get-availability-dates), [times](https://developers.acuityscheduling.com/reference/get-availability-times), [slot validation](https://developers.acuityscheduling.com/reference/availability-check-times)
- [Calendar blocks](https://developers.acuityscheduling.com/reference/blocks)
- [Create client](https://developers.acuityscheduling.com/reference/post-clients), [update client](https://developers.acuityscheduling.com/reference/put-clients), [delete client](https://developers.acuityscheduling.com/reference/delete-clients)
- [List certificates](https://developers.acuityscheduling.com/reference/get-certificates), [check certificate](https://developers.acuityscheduling.com/reference/get-certificates-check), [create certificate](https://developers.acuityscheduling.com/reference/post-certificates), [delete certificate](https://developers.acuityscheduling.com/reference/delete-certificates-id)
- [Forms](https://developers.acuityscheduling.com/reference/forms), [add-ons](https://developers.acuityscheduling.com/reference/appointments-addons), [labels](https://developers.acuityscheduling.com/reference/labels)
- [Products](https://developers.acuityscheduling.com/reference/get-products), [orders](https://developers.acuityscheduling.com/reference/get-orders), [order details](https://developers.acuityscheduling.com/reference/ordersid)
- [Dynamic webhooks](https://developers.acuityscheduling.com/page/webhooks-webhooks-webhooks), [account](https://developers.acuityscheduling.com/reference/get-me), [service metadata](https://developers.acuityscheduling.com/reference/meta)
