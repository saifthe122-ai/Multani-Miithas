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
| `SITE_URL` | Canonical HTTPS domain used for metadata, robots and sitemap |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public WhatsApp business number in international digits-only format |
| `NEXT_PUBLIC_BUSINESS_PHONE` | Public customer-service phone number |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Public customer-service email address |
| `DATABASE_URL` | PostgreSQL / Neon database connection string |
| `ADMIN_PASSWORD` | Secret admin login password |
| `ADMIN_SESSION_SECRET` | Random HMAC key, minimum 32 characters |
| `BLOB_READ_WRITE_TOKEN` | Current Vercel Blob media upload/delete token |
| `BLOB_STORE_ID` | Optional store identifier used by the current media replacement validation |
| `MEDIA_STORAGE_DRIVER` | Set to `local` on a self-hosted Node.js host; defaults to `vercel_blob` |
| `MEDIA_STORAGE_DIRECTORY` | Optional absolute persistent directory for local uploads; defaults to `~/.multani-mithas/uploads` outside versioned releases |

See `.env.example` for placeholders. Never put real values in GitHub, source code, screenshots, or customer-facing JavaScript. Never use a `NEXT_PUBLIC_` prefix for secrets.

## Host connection health check

After deploying the app and setting `DATABASE_URL`, open `https://your-domain.example/api/health`. A healthy response is `{ "status": "ok", "database": "connected" }`. An unavailable response returns HTTP 503 without exposing credentials or database error details. This endpoint performs only a read-only `SELECT 1` check.

## Database and customer data safety

- The current app uses PostgreSQL through `DATABASE_URL`; the production database is separate from the web host.
- Keep the existing production database and its data intact when changing hosts.
- Before any database migration or host switch, take a verified database backup and record the current schema/version.
- First Hostinger deployment should connect to the existing database using a secure server-side connection string. This avoids copying customer orders just to change web hosting.
- Do not point a test deployment at the live database and do not run destructive schema resets.
- If the database is moved later, use a tested PostgreSQL dump/restore procedure and verify products, customers, orders, payment history, stock, and media URLs before changing DNS.

## Hostinger compatibility requirements

This project is a Next.js application with server-side API routes, PostgreSQL access, secure admin cookies, and file-upload endpoints. It is **not** a static HTML website.

Hostinger's current support documentation lists **Business Web Hosting** and **Cloud Startup / Cloud Professional / Cloud Enterprise / Cloud Enterprise Plus** as plans that support Node.js web applications. The project uses Next.js server-side API routes, so do not buy a plan that only supports static/PHP websites.

Before purchasing, confirm the exact plan supports:
- Node.js 20, 22 or another currently supported version compatible with the app.
- Next.js server-side rendering and API routes (not just static export).
- Build/start commands and server-side environment variables.
- Persistent home-directory storage for local media uploads, plus backups.
- Outbound TLS connections to the existing PostgreSQL database.
- Enough memory/process capacity for the expected traffic.

Official Hostinger references:
- [Node.js web app deployment and supported plans](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)
- [Node.js hosting options](https://www.hostinger.com/support/node-js-hosting-options-at-hostinger/)
- [Node.js plan limits](https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/)

A VPS is another option but requires more server administration. Confirm current plan features and renewal pricing before buying.

## Media storage portability — known work still required

The admin media uploader supports two modes. The default `vercel_blob` mode keeps the current Vercel Blob behavior. On a self-hosted Node.js host, set `MEDIA_STORAGE_DRIVER=local`; new uploads, listing and deletion use `~/.multani-mithas/uploads` by default, outside the versioned application release. The public `/api/media/...` route serves those files without exposing the filesystem path. If the host requires a different location, set `MEDIA_STORAGE_DIRECTORY` to an absolute persistent directory. Back up that directory. Existing Vercel Blob image URLs continue to load and are not bulk rewritten. Do not use local mode on an ephemeral filesystem.

For the planned Hostinger move, use `MEDIA_STORAGE_DRIVER=local` only after confirming the chosen Node.js plan has persistent writable disk and that the `public/uploads/multani-mithas` directory is included in backups. If the plan uses an ephemeral filesystem, do not enable local mode; keep a supported remote object-storage provider instead. Existing Vercel Blob image URLs are not migrated or rewritten by this setting.

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
- [ ] Set `SITE_URL` to the final HTTPS domain and verify DNS/SSL before launch.
- [ ] Set the WhatsApp number, business phone and support email to verified business contact details.
- [ ] Domain, contact information, privacy/returns/delivery policies are correct.

A GitHub green check is a code-quality gate, not proof that the live business is ready to accept orders.
