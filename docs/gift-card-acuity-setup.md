# Acuity gift catalog operations

The public gift storefront is a read-only view of **GET
https://acuityscheduling.com/api/v1/products**. It uses `ACUITY_USER_ID` and
`ACUITY_API_KEY` on the server only. Never expose those credentials in client
code, logs, or this guide.

## Publishing or updating gifts

An authorized administrator manages products manually in Acuity Admin:

1. Review the current appointment types, studio calendars, prices, and redemption
   rules in Acuity. Do not copy historical prices or appointment IDs from old
   website setup panels.
2. Create or edit the intended gift certificate, package, or other catalog product.
   Set its name, customer description, purchase price, eligible appointment types,
   redemption value/count, expiration, and terms in Acuity.
3. Use a category containing **Chicago**, **Eugene**, or **Online** to organize
   experience products. Dollar-value products with a Gift Card/dollar-value name
   or category appear under **Dollar-value gift cards**. Uncategorized products
   remain visible under **More gifts**, rather than being silently omitted.
4. Make the product active and not hidden only when it is ready for sale.
5. Reload `/gift-cards`, `/chicago/gift-cards`, and `/eugene/gift-cards`.
   Check that its current name, description, price, category, and purchase link
   match Acuity. City pages prioritize that city but do not hide other products.
6. Confirm the purchase link opens the intended existing product:
   `https://app.acuityscheduling.com/catalog.php?owner=35932879&action=addCart&clear=1&id=<PRODUCT_ID>`.
   Do not submit a purchase or modify Acuity data during a read-only audit.

For date-night or beginner-class certificates, explicitly configure the eligible
appointment types and explain the number of guests/reservations in Acuity's
description. For dollar-value gifts, verify eligible locations and balance rules.
The website does not infer class coverage from a certificate price or appointment
ID and does not invent products for missing studio offerings.

## Unavailable catalogs

There is no checked-in product or price fallback. Missing credentials, an API
failure, invalid data, or no available products leaves one **View gift catalog**
link to Acuity and no product purchase cards. Hidden and inactive products never
receive storefront purchase links. Invalid IDs or prices cannot create cards.
The API request is uncached so a previous successful response cannot revive a
removed product after an outage.

The former public setup panels and disabled “pending setup” offerings have been
removed. Admin instructions belong here, not on customer-facing pages. This
application must not create products, update eligibility, or test certificate
redemption via Acuity write endpoints.
