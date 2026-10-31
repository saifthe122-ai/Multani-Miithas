
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
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
          is_primary
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
        headers: {
          "Cache-Control": "no-store",
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
      { status: 500 }
    );
  }
}
