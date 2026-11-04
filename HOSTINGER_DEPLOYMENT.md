# Multani Mithas — Free Development & Hostinger Migration Guide

## Current deployment decision

- Do not upgrade Vercel to Pro for this project at this stage.
- Keep the source of truth in the GitHub repository and the primary branch.
- Use GitHub Actions for lint and production-build verification. These checks do not require a customer-facing Preview deployment.
- Do not call the business live until a production host, database, admin login, payment flow, and customer order journey have been verified.

## Free development workflow

1. Make changes on a feature branch.
2. Open a pull request to `main`.
3. Wait for the GitHub Actions workflow named **Final launch checks** to pass.
4. Merge only after code review and checks pass.
5. Deploy to the chosen production host when ready.

A free Vercel build limit does not prevent GitHub Actions from checking the code. It does prevent relying on Vercel for a fresh deployment until its quota/limit is available again.

## Environment variables

Set these as server-side environment variables on the eventual host:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL / Neon database connection string |
| `ADMIN_PASSWORD` | Secret admin login password |
| `ADMIN_SESSION_SECRET` | Random HMAC key, minimum 32 characters |
| `BLOB_READ_WRITE_TOKEN` | Current Vercel Blob media upload/delete token |
| `BLOB_STORE_ID` | Optional store identifier used by the current media replacement validation |

See `.env.example` for placeholders. Never put real values in GitHub, source code, screenshots, or customer-facing JavaScript. Never use a `NEXT_PUBLIC_` prefix for secrets.

## Database and customer data safety

- The current app uses PostgreSQL through `DATABASE_URL`; the production database is separate from the web host.
- Keep the existing production database and its data intact when changing hosts.
- Before any database migration or host switch, take a verified database backup and record the current schema/version.
- First Hostinger deployment should connect to the existing database using a secure server-side connection string. This avoids copying customer orders just to change web hosting.
- Do not point a test deployment at the live database and do not run destructive schema resets.
- If the database is moved later, use a tested PostgreSQL dump/restore procedure and verify products, customers, orders, payment history, stock, and media URLs before changing DNS.

## Hostinger compatibility requirements

This project is a Next.js application with server-side API routes, PostgreSQL access, secure admin cookies, and file-upload endpoints. It is **not** a static HTML website.

Before purchasing or connecting a Hostinger plan, confirm that the exact plan supports:
- Node.js 20 or newer (prefer the current supported LTS version compatible with the app).
- Running a Next.js production server / Node.js application with server-side API routes.
- Build and start commands, persistent environment variables, HTTPS, and adequate memory.
- Outbound TLS connections to the PostgreSQL database.

A basic shared hosting plan that only serves PHP/static files is not sufficient for this application. A Hostinger VPS or a plan explicitly supporting Next.js/Node.js may be required. Confirm the plan's current features before buying.

## Media storage portability — known work still required

The current admin media uploader imports `@vercel/blob` and uses Vercel Blob for uploads, listing, replacement, and deletion. Existing public image URLs may continue loading after the website moves, but new uploads/deletes will still depend on the Vercel Blob token until a storage adapter is implemented.

Before moving the admin uploader to Hostinger, replace this provider-specific route with a configurable storage adapter (for example, Hostinger object storage if included in the chosen plan, or another compatible S3-style provider). Preserve existing image URLs and do not bulk rewrite product records without a tested migration.

## Payments and launch gates

- Cash on Delivery can be enabled only with a clear cash-collection process.
- Manual JazzCash/Easypaisa/Raast/bank transfers must show only active merchant-owned accounts.
- A customer-submitted screenshot/reference is not proof of funds. Admin verifies the actual credit before marking a transfer Paid.
- COD becomes Paid only after cash is collected at delivery.
- A normal personal wallet is not a merchant gateway. Do not advertise automatic gateway confirmation until official merchant onboarding and server-side verification are complete.
- Add brother's verified business account details later through the admin UI; do not hard-code them in source.
- The payment-account snapshot on each new order preserves the account details that were shown when that order was placed.

## Final launch verification

- [ ] GitHub Actions lint and production build pass on the final `main` commit.
- [ ] Production host supports this Next.js app and has all environment variables configured.
- [ ] Admin login works over HTTPS and unauthenticated admin APIs return 401.
- [ ] Production database is connected and backup/restore is verified.
- [ ] Public APIs do not expose personal, inactive, or test-only payment accounts.
- [ ] Product categories, weights, stock, prices, packaging and delivery charges are correct.
- [ ] Customer checkout total matches the server-calculated order total.
- [ ] COD and manual transfer status rules are verified without placing a fake live payment.
- [ ] Admin can process an order from Pending through delivery and payment reconciliation.
- [ ] Mobile and desktop customer journeys are checked on the actual production host.
- [ ] Domain, contact information, privacy/returns/delivery policies are correct.

A GitHub green check is a code-quality gate, not proof that the live business is ready to accept orders.
