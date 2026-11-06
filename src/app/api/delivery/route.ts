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

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ success: false, message: "Admin login required" }, { status: 401 });
  try {
    const sql = database();
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
    const result = await sql`
      WITH target_order AS MATERIALIZED (
        SELECT o.id, o.order_number, o.status AS order_status
        FROM orders o
        WHERE upper(o.order_number) = upper(${orderNumber})
          AND o.archived_at IS NULL
          AND lower(o.status) NOT IN ('cancelled','refunded')
          AND (
            ${status} IN ('pending','failed','returned')
            OR (
              ${status} = 'assigned'
              AND lower(o.status) IN ('pending','confirmed','processing')
            )
            OR (
              ${status} IN ('dispatched','in_transit')
              AND lower(o.status) IN ('pending','confirmed','processing','out_for_delivery')
            )
            OR (
              ${status} = 'delivered'
              AND lower(o.status) IN ('pending','confirmed','processing','out_for_delivery','completed')
            )
          )
        FOR UPDATE
      ),
      saved_delivery AS (
        INSERT INTO order_deliveries
          (order_id, provider, assigned_to, assigned_phone, tracking_reference, notes, status, dispatched_at, delivered_at, updated_at)
        SELECT t.id, ${provider}, NULLIF(${assignedTo},''), NULLIF(${assignedPhone},''),
          NULLIF(${trackingReference},''), NULLIF(${notes},''), ${status},
          CASE WHEN ${status} IN ('dispatched','in_transit','delivered') THEN NOW() ELSE NULL END,
          CASE WHEN ${status}='delivered' THEN NOW() ELSE NULL END, NOW()
        FROM target_order t
        ON CONFLICT (order_id) DO UPDATE SET
          provider=EXCLUDED.provider,
          assigned_to=EXCLUDED.assigned_to,
          assigned_phone=EXCLUDED.assigned_phone,
          tracking_reference=EXCLUDED.tracking_reference,
          notes=EXCLUDED.notes,
          status=EXCLUDED.status,
          dispatched_at=CASE
            WHEN EXCLUDED.status IN ('dispatched','in_transit','delivered')
              THEN COALESCE(order_deliveries.dispatched_at,NOW())
            ELSE order_deliveries.dispatched_at
          END,
          delivered_at=CASE
            WHEN EXCLUDED.status='delivered' THEN COALESCE(order_deliveries.delivered_at,NOW())
            ELSE order_deliveries.delivered_at
          END,
          updated_at=NOW()
        WHERE order_deliveries.status = EXCLUDED.status
          OR (
          order_deliveries.status NOT IN ('delivered','returned')
          AND CASE order_deliveries.status
            WHEN 'pending' THEN 0
            WHEN 'assigned' THEN 1
            WHEN 'dispatched' THEN 2
            WHEN 'in_transit' THEN 3
            WHEN 'failed' THEN 4
            WHEN 'returned' THEN 5
            ELSE 6
          END <= CASE EXCLUDED.status
            WHEN 'pending' THEN 0
            WHEN 'assigned' THEN 1
            WHEN 'dispatched' THEN 2
            WHEN 'in_transit' THEN 3
            WHEN 'failed' THEN 4
            WHEN 'returned' THEN 5
            WHEN 'delivered' THEN 6
            ELSE -1
          END
          )
        RETURNING *
      ),
      advanced_order AS (
        UPDATE orders o
        SET status = CASE
          WHEN ${status} = 'delivered' THEN 'completed'
          WHEN ${status} IN ('dispatched','in_transit') THEN 'out_for_delivery'
          ELSE 'processing'
        END
        FROM target_order t, saved_delivery d
        WHERE o.id = t.id
          AND ${status} NOT IN ('pending','failed','returned')
          AND CASE o.status
            WHEN 'pending' THEN 0
            WHEN 'confirmed' THEN 1
            WHEN 'processing' THEN 2
            WHEN 'out_for_delivery' THEN 3
            WHEN 'completed' THEN 4
            ELSE -1
          END <= CASE
            WHEN ${status} = 'delivered' THEN 4
            WHEN ${status} IN ('dispatched','in_transit') THEN 3
            ELSE 2
          END
        RETURNING o.id
      )
      SELECT d.* FROM saved_delivery d
    `;
    if (!result.length) {
      const existing = await sql`
        SELECT d.status AS delivery_status, o.status AS order_status
        FROM orders o
        LEFT JOIN order_deliveries d ON d.order_id = o.id
        WHERE upper(o.order_number) = upper(${orderNumber})
        LIMIT 1
      `;
      if (!existing.length) {
        return NextResponse.json({ success: false, message: "Order number not found" }, { status: 404 });
      }
      if (["cancelled","refunded"].includes(String(existing[0].order_status ?? "").toLowerCase())) {
        return NextResponse.json({ success: false, message: "Cancelled ya refunded order ke liye delivery register nahi ho sakti." }, { status: 409 });
      }
      return NextResponse.json({ success: false, message: "Delivery status peeche nahi le ja sakte ya delivered record locked hai." }, { status: 409 });
    }
    // Pending registration only creates the delivery record; it never advances order status.
    return NextResponse.json({ success: true, saved: true, delivery: result[0] });

  } catch (error) {
    console.error("Delivery POST failed", error);
    return NextResponse.json({ success: false, message: "Delivery details could not be saved" }, { status: 500 });
  }
}
