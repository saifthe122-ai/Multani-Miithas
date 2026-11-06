
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const databaseUrl = process.env.DATABASE_URL;

export async function GET() {
  if (!databaseUrl) {
    console.error("DATABASE_URL is not configured.");

    return NextResponse.json(
      {
        success: false,
        message: "Payment service is temporarily unavailable.",
      },
      { status: 500 }
    );
  }

  try {
    const sql = neon(databaseUrl);
    await sql`ALTER TABLE business_payment_accounts ADD COLUMN IF NOT EXISTS show_on_checkout boolean NOT NULL DEFAULT false`;

    const [methods, accounts] = await Promise.all([
      sql`
        SELECT
          id,
          method_key,
          name,
          description,
          payment_type,
          provider,
          instructions,
          display_order
        FROM payment_methods
        WHERE is_enabled = true
          AND payment_type = 'manual'
        ORDER BY display_order ASC, id ASC
      `,

     sql`
        SELECT
          a.id,
          a.account_name,
          a.account_type,
          a.provider,
          a.account_title,
          a.account_number,
          a.iban,
          a.currency,
          a.is_primary,
          a.wallet_owner_type,
          a.show_on_checkout,
          a.qr_image_url,
          a.app_link
        FROM business_payment_accounts AS a
        WHERE a.is_active = true
          AND a.wallet_owner_type = 'merchant'
          AND a.show_on_checkout = true
          AND EXISTS (
            SELECT 1
            FROM payment_methods AS pm
            WHERE pm.is_enabled = true
              AND pm.payment_type = 'manual'
              AND (
                LOWER(COALESCE(pm.provider, '')) = LOWER(COALESCE(a.provider, ''))
                OR (
                  (
                    LOWER(COALESCE(pm.method_key, '')) LIKE '%bank%'
                    OR LOWER(COALESCE(pm.name, '')) LIKE '%bank transfer%'
                  )
                  AND LOWER(COALESCE(a.account_type, '')) = 'bank'
                )
                OR (
                  (
                    LOWER(COALESCE(pm.method_key, '')) LIKE '%raast%'
                    OR LOWER(COALESCE(pm.name, '')) LIKE '%raast%'
                  )
                  AND LOWER(COALESCE(a.account_type, '')) = 'raast'
                )
              )
          )
        ORDER BY a.is_primary DESC, a.id ASC
      `,
    ]);

    return NextResponse.json(
      {
        success: true,
        methods,
        accounts,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Public payment options load failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Payment options abhi load nahi ho sakin.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
