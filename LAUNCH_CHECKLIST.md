# Multani Mithas — Final Launch Checklist

This checklist is for a Production-first release. GitHub Actions and Vercel build checks are safety validation only; the business owner is not required to use or test a Preview website. Never run stock-changing or payment tests against live customer data.

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

- [x] GitHub Actions lint passes on current branch head (`efe461ca679a5e7a5b27911af03b385f6a933e70`).
- [x] GitHub Actions production build passes on current branch head (`efe461ca679a5e7a5b27911af03b385f6a933e70`).
- [x] Vercel generated a Ready preview deployment for this branch: https://multani-miithas-git-final-launch-hardening-2026-11-03-webgen3.vercel.app.
- [ ] Manually inspect preview browser console, mobile/desktop layouts, protected routes, and all real database-backed workflows.

## Production verification (read-only first; no test orders or stock changes)

1. Open the live Production storefront on desktop and a mobile phone; verify page load, navigation and responsive layout.
2. Confirm product cards show database products only; inactive products are not visible.
3. Review stock and Add to Cart / Buy Now behavior through code checks or a separate approved test fixture; do not change real Production stock just to test.
4. Verify stock reservation logic through automated tests or an isolated test fixture; do not place a synthetic order against live inventory.
5. Verify insufficient-stock rejection through automated tests or an isolated test fixture.
6. Verify idempotency with automated tests or an isolated test fixture; do not create duplicate Production orders.
7. Verify per-kg and fixed-price pricing, custom weights, discounts, per-weight packaging/delivery, free-delivery threshold, and tax calculations using deterministic test cases.
8. Confirm only approved, configured payment methods appear in Production checkout; do not activate personal/test wallets.
9. Confirm gateway-only payment methods are not offered until a real provider integration is configured and tested.
10. Never mark a manual payment Paid until funds are actually visible in the business wallet/bank account; then enter its transaction reference and verify audit history.
11. Archive an order and deactivate a product; confirm records remain in the database.
12. Confirm admin routes redirect to login when unauthenticated.
13. Confirm product API responses to a public request do not contain `cost_price`.
14. Check browser console and network requests for failed assets, API errors, or broken links.
15. Confirm homepage shows no more than four regular products and three gift boxes, and category links open their own pages.
16. Verify category pages are driven by active database products; only add actual sale inventory and verified product information before launch.

## Known items that still need a separate implementation or provider setup

- The generic `/api/payments` endpoint remains testing-only. No live card/payment gateway is connected. Manual bank/wallet transfer and COD are separate from automatic gateway processing.
- Coupon, referral, customer-profile and standalone feedback modules are out of scope and removed from this branch.
- Product reviews now have database persistence, delivered-order/product/phone verification, one review per product per order, and admin approve/reject moderation. Public listing shows approved reviews only. Verify this against the production database before launch.
- Delivery now persists order assignments, provider, rider contact, tracking reference, notes and parcel status in the database, and synchronizes delivery progress to the order status. It does not provide live GPS tracking or a third-party courier API integration; those require a selected provider/staff tracking app.
- Admin Delivery is an in-house/manual dispatch register. Verify real order assignment and status transitions against the production database before launch.
- Payment verification history records status changes and references; it is not a provider settlement/reconciliation feed.
- Login rate limiting and session revocation need a dedicated production security review.
- Actual production database behavior and real payment account verification must be tested before launch. No live database or payment credentials are included in this repository checklist.


## Confirmed product-business scope
- Guest checkout only; collect contact/address data per order, with no customer registration, profile or saved-address accounts.
- No coupon-code or referral programme.
- No separate customer feedback module; retain product reviews and ratings.
- Delivery remains in scope because physical products must be dispatched to customers.
- No generic service bookings or complaint-ticketing system; order-specific cancellation/refund/support remains in scope.


## Additional review and delivery end-to-end checks
17. Submit a review for a delivered order using its exact order number, order phone and a product included in that order; verify it is saved as pending.
18. Attempt a review for a non-delivered order, wrong phone, or product not in the order; verify it is rejected.
19. Approve a review in Admin → Reviews; verify it appears on the public Reviews page. Reject it and verify it is no longer public.
20. In Admin → Delivery, assign a provider/rider and update a real order through assigned → dispatched → in transit → delivered; verify values persist after refresh and order status synchronizes.
21. Verify archived orders cannot be assigned for delivery and no delivery status is incorrectly represented as live GPS tracking.


## Expanded catalogue and future branch/payment requirements

- [ ] Admin product form offers Sweets, Gift Boxes, Desi Ghee, Pure Honey, Dry Fruits, Bakery, Cakes, Namkeen and Seasonal & Special, and permits a new category name.
- [ ] Add one test product in each collection on Preview; verify the category directory automatically lists each active collection and category pages show the correct products.
- [ ] Verify products in existing categories retain their current category names and links.
- [ ] Verify pack sizes, stock, discounts, packaging type/fee and delivery/tax breakdown separately for honey jars, ghee jars, dry-fruit packs, gift boxes and per-weight sweets.
- [ ] Design and implement persistent payment-account management separately from payment methods, with account ownership, branch assignment, active/test status, primary selection and audit history.
- [ ] Keep the initial family wallet account test-only; do not expose it to customers or activate it for live collection.
- [ ] Add Easypaisa, Raast and at least two bank accounts only after the business confirms the final account details and authorises activation.
- [ ] Implement branch-aware payment account assignment before opening additional branches; snapshot the selected account in every order/payment record.
- [ ] Verify account changes do not alter payment details on historic orders.
- [ ] Verify public payment APIs never return inactive, test-only or unassigned account details.
- [ ] Confirm COD is marked Paid only after cash collection; manual wallet/bank payments only after actual funds are verified.
- [ ] Official JazzCash/Easypaisa gateway integration remains blocked until merchant approval and secure provider credentials are obtained.


## Production-first hardening update — 2026-11-04

- [x] PR #6 merged: product admin accepts suggested and custom category names.
- [x] PR #7 merged: public payment-options API filters out personal accounts and requires an active merchant-owned account matching an enabled manual payment method.
- [ ] PR #8: server-side checkout applies the configured global sales-tax rate when a product weight option does not specify a rate, and applies the free-delivery threshold to the order delivery total. Merge only after GitHub Actions and Vercel checks succeed.
- [ ] Confirm the official customer domain and Production deployment are Ready.
- [ ] Confirm real business payment account ownership and merchant status before enabling manual wallet/bank collection.
- [ ] Add real inventory, correct prices, weight options, product photos, packaging type and packaging fees before accepting paid orders.
- [ ] Verify order totals, stock, payment status and historical account snapshots without creating test orders or changing live stock.
- [ ] Keep COD available only if the business can fulfil and collect cash on delivery.
- [ ] Do not advertise JazzCash/Easypaisa automatic payment until merchant gateway approval and signed server-side provider verification are complete.
- [ ] Confirm admin authentication, secret rotation and rate limiting before public launch.
