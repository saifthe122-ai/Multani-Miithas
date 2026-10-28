
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { success: false, message: "Admin login required" },
      { status: 401 }
    );
  }

  try {
    const orders = await sql`
      SELECT
        o.id,
        o.order_number,
        o.customer_name,
        o.customer_phone,
        o.delivery_address,
        o.status,
        o.payment_method,
        o.payment_status,
        o.subtotal,
        o.delivery_fee,
        o.total,
        o.created_at,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'productName', oi.product_name,
                'quantity', oi.quantity,
                'unitPrice', oi.unit_price,
                'lineTotal', oi.line_total
              )
              ORDER BY oi.id
            )
            FROM order_items oi
            WHERE oi.order_id = o.id
          ),
          '[]'::json
        ) AS items
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT 500
    `;

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Admin orders fetch failed:", error);

    return NextResponse.json(
      { success: false, message: "Could not load orders" },
      { status: 500 }
    );
  }
}
