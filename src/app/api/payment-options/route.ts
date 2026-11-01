
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
        ORDER BY display_order ASC, id ASC
      `,

     sql`
  SELECT
    id,
    account_name,
    account_type,
    provider,
    account_title,
    account_number,
    iban,
    currency,
    is_primary,
    wallet_owner_type,
    qr_image_url,
    app_link
  FROM business_payment_accounts
  WHERE is_active = true
  ORDER BY is_primary DESC, id ASC
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
