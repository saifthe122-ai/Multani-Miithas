# Multani Mithas — Final Launch Checklist

This checklist is for the final pre-production review. Do not merge or promote this branch until the preview build and the manual checks below pass.

## Code changes in this round

- Public product API omits `cost_price`; authenticated admin product requests retain it.
- Public product API only returns active products.
- Storefront does not silently show demo products when the database is empty or unavailable.
- Storefront checks stock before Add to Cart / Buy Now and shows configured weight options and discounted prices.
- Order API reads enabled manual payment methods from the database.
- Checkout sends an idempotency key; the order API stores a unique key to make retries safe.
- Order API locks product rows, validates available stock, and deducts inventory in the same SQL statement as order creation.
- Orders are archived, not permanently deleted; products are deactivated, not permanently deleted.
- Admin payment status changes store a verified payment reference and an audit event.
- Guest checkout captures only order fulfilment details (name, phone, optional email and delivery address); no customer account/profile is required.
- Admin Orders displays customer contact and delivery details attached to each order; there is no separate customer-profile module.
- Canonical metadata, robots sitemap URL, and sitemap use https://multani-mithas.vercel.app.
- Broken fallback media paths are replaced with existing product image fallbacks; an unpublished brand film shows a coming-soon placeholder.
- GitHub Actions workflow added for lint and production build.

## Storefront polish completed after the initial audit

- Removed the duplicate fixed About Us heading so the admin-managed heading is shown once.
- Removed the duplicate About Us footer link.
- Preserved the existing customer-provided product imagery and current storefront media references.
- Homepage product display is capped to four regular products and three gift boxes, with links to the full category directory.
- Added `/shop` category directory and database-driven `/shop/[slug]` pages; active products are grouped automatically by their saved category.

## Required automated checks

- [ ] GitHub Actions lint passes.
- [ ] GitHub Actions production build passes.
- [ ] Vercel preview deployment succeeds.
- [ ] No TypeScript, ESLint, or runtime errors in preview.

## Required manual checks on preview

1. Open the storefront on desktop and a mobile phone.
2. Confirm product cards show database products only; inactive products are not visible.
3. Set one product stock to zero in admin; confirm Add to Cart and Buy Now are disabled.
4. Set a small stock quantity; place an order up to that quantity; confirm stock decreases exactly by the ordered quantity.
5. Try ordering more than available stock; confirm the order is rejected and stock is unchanged.
6. Submit an order and retry the same request after a network interruption; confirm only one order exists.
7. Verify per-kg and fixed-price products, custom weights, discounts, delivery fee, free-delivery threshold, and tax totals.
8. Enable a manual payment method in admin; confirm it appears in checkout and the order saves.
9. Confirm gateway-only payment methods are not offered until a real provider integration is configured and tested.
10. Mark a manual payment Paid only after verifying the funds in the business wallet/bank account; enter the transaction reference and confirm it appears in the payment dashboard and history.
11. Archive an order and deactivate a product; confirm records remain in the database.
12. Confirm admin routes redirect to login when unauthenticated.
13. Confirm product API responses to a public request do not contain `cost_price`.
14. Check browser console and network requests for failed assets, API errors, or broken links.
15. Confirm homepage shows no more than four regular products and three gift boxes, and category links open their own pages.
16. Add a new active product in admin under an existing category; confirm it appears on that category page without expanding the homepage. Add an inactive product and confirm it remains hidden publicly.

## Known items that still need a separate implementation or provider setup

- The generic `/api/payments` endpoint remains testing-only. No live card/payment gateway is connected. Manual bank/wallet transfer and COD are separate from automatic gateway processing.
- Coupon, referral, customer-profile and standalone feedback modules are out of scope and removed from this branch. Reviews and delivery still require live end-to-end validation; delivery provider/location features must not be described as live until configured and tested.
- Payment verification history records status changes and references; it is not a provider settlement/reconciliation feed.
- Login rate limiting and session revocation need a dedicated production security review.
- Actual production database behavior and real payment account verification must be tested before launch. No live database or payment credentials are included in this repository checklist.


## Confirmed product-business scope
- Guest checkout only; collect contact/address data per order, with no customer registration, profile or saved-address accounts.
- No coupon-code or referral programme.
- No separate customer feedback module; retain product reviews and ratings.
- Delivery remains in scope because physical products must be dispatched to customers.
- No generic service bookings or complaint-ticketing system; order-specific cancellation/refund/support remains in scope.
