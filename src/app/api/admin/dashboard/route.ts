import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ success: false, message: "Admin login required" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: false, message: "Database is not configured" }, { status: 503 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS archived_at timestamptz`;
    await sql`CREATE TABLE IF NOT EXISTS order_deliveries (
      id bigserial PRIMARY KEY,
      order_id bigint NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
      provider text NOT NULL DEFAULT 'In-house delivery',
      assigned_to text, assigned_phone text,
      status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','assigned','dispatched','in_transit','delivered','failed','returned')),
      tracking_reference text,
      delivery_fee numeric(12,2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
      notes text, dispatched_at timestamptz, delivered_at timestamptz,
      updated_at timestamptz NOT NULL DEFAULT NOW(), created_at timestamptz NOT NULL DEFAULT NOW()
    )`;

    const [orders, products, customers, deliveries] = await Promise.all([
      sql`SELECT
        COUNT(*)::integer AS total_orders,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('day', NOW()))::integer AS today_orders,
        COALESCE(SUM(total) FILTER (
          WHERE LOWER(COALESCE(payment_status, '')) = 'paid'
            AND created_at >= date_trunc('day', NOW())
        ), 0) AS today_paid_revenue,
        COUNT(*) FILTER (WHERE LOWER(COALESCE(status, '')) IN ('pending','confirmed','processing'))::integer AS active_orders,
        COUNT(*) FILTER (WHERE LOWER(COALESCE(payment_status, '')) = 'pending')::integer AS pending_payments
        FROM orders WHERE archived_at IS NULL`,
      sql`SELECT
        COUNT(*) FILTER (WHERE is_active = true)::integer AS active_products,
        COUNT(*) FILTER (WHERE is_active = true AND stock <= 5)::integer AS low_stock_products
        FROM products`,
      sql`SELECT COUNT(*)::integer AS total_customers FROM customers`,
      sql`SELECT
        COUNT(*) FILTER (WHERE LOWER(status) IN ('assigned','dispatched','in_transit'))::integer AS active_deliveries,
        COUNT(*) FILTER (WHERE LOWER(status) = 'pending')::integer AS pending_deliveries
        FROM order_deliveries`,
    ]);

    const order = orders[0] ?? {};
    const product = products[0] ?? {};
    const customer = customers[0] ?? {};
    const delivery = deliveries[0] ?? {};

    return NextResponse.json({
      success: true,
      databaseConnected: true,
      generatedAt: new Date().toISOString(),
      metrics: {
        totalOrders: Number(order.total_orders ?? 0),
        todayOrders: Number(order.today_orders ?? 0),
        todayPaidRevenue: Number(order.today_paid_revenue ?? 0),
        activeOrders: Number(order.active_orders ?? 0),
        pendingPayments: Number(order.pending_payments ?? 0),
        activeProducts: Number(product.active_products ?? 0),
        lowStockProducts: Number(product.low_stock_products ?? 0),
        totalCustomers: Number(customer.total_customers ?? 0),
        activeDeliveries: Number(delivery.active_deliveries ?? 0),
        pendingDeliveries: Number(delivery.pending_deliveries ?? 0),
      },
    }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
  } catch (error) {
    console.error("Admin dashboard metrics failed:", error);
    return NextResponse.json(
      { success: false, message: "Dashboard metrics could not be loaded." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
