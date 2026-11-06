# Merchandise storefront

Shopify remains the single merchandise catalog and checkout. The website reads product images, prices and availability; it creates no products or orders.

Keep NEXT_PUBLIC_MERCHANDISE_ENABLED unset until production artwork, public checkout, prices and shipping/returns policies are verified. Set it to true and rebuild after verification. Failure to validate live product data shows an unavailable message.

Verify mobile and desktop layouts, variant availability, correct artwork, policy links and checkout progression before promotion. Class booking flows remain unchanged. Add the optional post-class copy only to the existing Acuity follow-up template after launch prerequisites pass.

Validation: tests/merchandise.ts, TypeScript checking and optimized production build passed.
