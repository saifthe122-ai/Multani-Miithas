# Preview database setup — Multani Mithas

This procedure is for the Vercel **Preview** environment only. Never copy the Preview connection string into Production and never copy Production data into Preview without explicit approval.

## What the seed does

The authenticated endpoint `POST /api/admin/preview-seed` inserts six clearly labelled sample products ending in `— Preview Test`. It is idempotent: running it again does not duplicate those names. It does not delete or overwrite existing products.

Sample prices and stock are test values. Confirm real prices, weights, ingredients, stock and product photography with the business before Production launch.

## Enable it for one Preview deployment

1. In Vercel, open the project Settings → Environment Variables.
2. Add `PREVIEW_SEED_ENABLED` with value `true`, selecting **Preview only** (not Production or Development).
3. Confirm `DATABASE_URL` is the Neon **preview branch** connection string under Preview only. Do not paste or share the value in chat.
4. Redeploy the Preview deployment so it receives the updated environment.
5. Sign in to the Preview admin, then send an authenticated POST request to `/api/admin/preview-seed` from that same Preview origin. Do not call this endpoint on Production.

The route itself refuses all requests unless `VERCEL_ENV=preview`, `PREVIEW_SEED_ENABLED=true`, and a valid admin session are all present.

## Verification

- Open `/api/products` on Preview: response should show `databaseConnected: true` and the six sample records (unless some already existed).
- Admin product management should show the same records.
- After confirming the sample products, disable `PREVIEW_SEED_ENABLED` in Vercel Preview settings and redeploy. The seeded records remain in Preview; the seed endpoint becomes unavailable.
- Test checkout and stock only on Preview. Do not create test orders on Production.

## Safety limitations

This endpoint depends on the existing `products` table and columns used by the product API. If it returns a database/schema error, stop and inspect the Preview schema rather than applying guessed migrations. The endpoint never creates tables or changes Production.
