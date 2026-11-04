import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const statuses = ["pending","assigned","dispatched","in_transit","delivered","failed","returned"] as const;

function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return neon(process.env.DATABASE_URL);
}

async function ensureDelivery(sql: ReturnType<typeof neon>) {
  await sql`CREATE TABLE IF NOT EXISTS order_deliveries (
    id bigserial PRIMARY KEY,
    order_id bigint NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    provider text NOT NULL DEFAULT 'In-house delivery',
    assigned_to text,
    assigned_phone text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','assigned','dispatched','in_transit','delivered','failed','returned')),
    tracking_reference text,
    delivery_fee numeric(12,2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
    notes text,
    dispatched_at timestamptz,
    delivered_at timestamptz,
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    created_at timestamptz NOT NULL DEFAULT NOW()
  )`;
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ success: false, message: "Admin login required" }, { status: 401 });
  try {
    const sql = database();
    await ensureDelivery(sql);
    const deliveries = await sql`SELECT d.id, o.id AS order_id, o.order_number, o.customer_name,
      o.customer_phone, o.delivery_address, o.total, o.status AS order_status,
      d.provider, d.assigned_to, d.assigned_phone, d.status AS delivery_status,
      d.tracking_reference, d.delivery_fee, d.notes, d.dispatched_at, d.delivered_at,
      d.created_at, d.updated_at
      FROM orders o LEFT JOIN order_deliveries d ON d.order_id=o.id
      WHERE o.archived_at IS NULL ORDER BY o.created_at DESC LIMIT 500`;
    return NextResponse.json({ success: true, deliveries, databaseConnected: true });
  } catch (error) {
    console.error("Delivery GET failed", error);
    return NextResponse.json({ success: false, message: "Delivery records could not be loaded" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ success: false, message: "Admin login required" }, { status: 401 });
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ success: false, message: "Invalid delivery data" }, { status: 400 });
    const data = body as Record<string, unknown>;
    const orderNumber = typeof data.orderNumber === "string" ? data.orderNumber.trim() : "";
    const provider = typeof data.provider === "string" ? data.provider.trim() : "In-house delivery";
    const assignedTo = typeof data.assignedTo === "string" ? data.assignedTo.trim() : "";
    const assignedPhone = typeof data.assignedPhone === "string" ? data.assignedPhone.trim() : "";
    const trackingReference = typeof data.trackingReference === "string" ? data.trackingReference.trim() : "";
    const notes = typeof data.notes === "string" ? data.notes.trim() : "";
    const status = typeof data.status === "string" ? data.status : "pending";
    if (!orderNumber || orderNumber.length > 40 || !provider || provider.length > 100 ||
        assignedTo.length > 120 || assignedPhone.length > 40 || trackingReference.length > 120 ||
        notes.length > 2000 || !statuses.includes(status as typeof statuses[number])) {
      return NextResponse.json({ success: false, message: "Delivery details are invalid" }, { status: 400 });
    }
    const sql = database();
    await ensureDelivery(sql);
    const result = await sql`INSERT INTO order_deliveries
      (order_id, provider, assigned_to, assigned_phone, tracking_reference, notes, status, dispatched_at, delivered_at, updated_at)
      SELECT o.id, ${provider}, NULLIF(${assignedTo},''), NULLIF(${assignedPhone},''),
        NULLIF(${trackingReference},''), NULLIF(${notes},''), ${status},
        CASE WHEN ${status} IN ('dispatched','in_transit','delivered') THEN NOW() ELSE NULL END,
        CASE WHEN ${status}='delivered' THEN NOW() ELSE NULL END, NOW()
      FROM orders o WHERE o.order_number=${orderNumber} AND o.archived_at IS NULL
      ON CONFLICT (order_id) DO UPDATE SET
        provider=EXCLUDED.provider, assigned_to=EXCLUDED.assigned_to,
        assigned_phone=EXCLUDED.assigned_phone, tracking_reference=EXCLUDED.tracking_reference,
        notes=EXCLUDED.notes, status=EXCLUDED.status,
        dispatched_at=CASE WHEN EXCLUDED.status IN ('dispatched','in_transit','delivered') THEN COALESCE(order_deliveries.dispatched_at,NOW()) ELSE order_deliveries.dispatched_at END,
        delivered_at=CASE WHEN EXCLUDED.status='delivered' THEN COALESCE(order_deliveries.delivered_at,NOW()) ELSE NULL END,
        updated_at=NOW()
      RETURNING *`;
    if (!result.length) return NextResponse.json({ success: false, message: "Order number not found" }, { status: 404 });
    const orderStatus = status === "delivered" ? "delivered" : status === "failed" || status === "returned" ? "processing" : status === "dispatched" || status === "in_transit" ? "shipped" : "processing";
    await sql`UPDATE orders SET status=${orderStatus} WHERE order_number=${orderNumber}`;
    return NextResponse.json({ success: true, saved: true, delivery: result[0] });
  } catch (error) {
    console.error("Delivery POST failed", error);
    return NextResponse.json({ success: false, message: "Delivery details could not be saved" }, { status: 500 });
  }
}
