import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

async function ensureSchema(sql: ReturnType<typeof neon<false, false>>) {
  await sql`
    CREATE TABLE IF NOT EXISTS order_service_requests (
      id bigserial PRIMARY KEY,
      request_reference text NOT NULL UNIQUE,
      request_type text NOT NULL CHECK (request_type IN ('cancellation','refund')),
      order_number text NOT NULL,
      customer_name text NOT NULL,
      customer_phone text NOT NULL,
      reason text NOT NULL,
      details text NOT NULL DEFAULT '',
      requested_amount numeric(12,2),
      approved_amount numeric(12,2),
      status text NOT NULL DEFAULT 'requested',
      admin_note text NOT NULL DEFAULT '',
      refund_transfer_reference text NOT NULL DEFAULT '',
      refund_processed_at timestamptz,
      reviewed_by text,
      created_at timestamptz NOT NULL DEFAULT NOW(),
      updated_at timestamptz NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS order_service_requests_created_idx ON order_service_requests (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS order_service_requests_order_idx ON order_service_requests (order_number)`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference text`;
  await sql`
    CREATE TABLE IF NOT EXISTS payment_status_events (
      id bigserial PRIMARY KEY,
      order_number text NOT NULL,
      previous_status text,
      new_status text NOT NULL,
      payment_reference text,
      changed_by text NOT NULL DEFAULT 'admin',
      created_at timestamptz NOT NULL DEFAULT NOW()
    )
  `;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: "Request details valid nahi." }, { status: 400 });
    }
    const data = body as Record<string, unknown>;
    const requestType = String(data.requestType ?? "").trim().toLowerCase();
    const orderNumber = String(data.orderNumber ?? "").trim().toUpperCase();
    const customerName = String(data.customerName ?? "").trim();
    const phone = String(data.phone ?? "").trim();
    const digits = phone.replace(/\D/g, "");
    const reason = String(data.reason ?? "").trim();
    const details = String(data.details ?? "").trim();
    const requestedAmount = data.requestedAmount === "" || data.requestedAmount == null ? null : Number(data.requestedAmount);

    if (!["cancellation", "refund"].includes(requestType) || !orderNumber || orderNumber.length > 40 ||
      !customerName || customerName.length > 150 || digits.length < 7 || digits.length > 20 ||
      !reason || reason.length > 300 || details.length > 2000 ||
      (requestedAmount !== null && (!Number.isFinite(requestedAmount) || requestedAmount <= 0 || requestedAmount > 100000000))) {
      return NextResponse.json({ success: false, message: "Order number, naam, phone aur request details sahi enter karein." }, { status: 400 });
    }

    const sql = database();
    await ensureSchema(sql);
    const orders = await sql`
      SELECT id, order_number, customer_name, customer_phone, status, payment_status,
             payment_method, total
      FROM orders
      WHERE upper(order_number) = ${orderNumber}
      LIMIT 1
    `;
    if (!orders.length) return NextResponse.json({ success: false, message: "Is order number ka record nahi mila." }, { status: 404 });

    const order = orders[0];
    const orderDigits = String(order.customer_phone ?? "").replace(/\D/g, "");
    if (!orderDigits || orderDigits.slice(-10) !== digits.slice(-10)) {
      return NextResponse.json({ success: false, message: "Order number aur phone number match nahi karte." }, { status: 403 });
    }

    const currentStatus = String(order.status ?? "").toLowerCase();
    const paymentStatus = String(order.payment_status ?? "").toLowerCase();
    const method = String(order.payment_method ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const isCod = method === "cod" || method === "cashondelivery";
    if (requestType === "cancellation" && !["pending", "confirmed"].includes(currentStatus)) {
      return NextResponse.json({ success: false, message: "Is order ki preparation/dispatch stage par online cancellation request available nahi. Help ke liye contact karein." }, { status: 409 });
    }
    if (requestType === "refund") {
      const eligible = ["completed", "delivered", "cancelled"].includes(currentStatus);
      if (!eligible) return NextResponse.json({ success: false, message: "Refund request delivery ya approved cancellation ke baad submit karein. Damage/incorrect item complaint ke liye Contact Us use karein." }, { status: 409 });
      if (isCod || !["paid", "partially_refunded"].includes(paymentStatus)) {
        return NextResponse.json({ success: false, message: "Refund request ke liye prepaid order ka verified Paid status zaroori hai." }, { status: 409 });
      }
    }
    const amount = requestedAmount === null ? Number(order.total) : requestedAmount;
    if (requestType === "refund" && (!Number.isFinite(amount) || amount <= 0 || amount > Number(order.total))) {
      return NextResponse.json({ success: false, message: "Refund amount order total se zyada nahi ho sakta." }, { status: 400 });
    }

    const duplicate = await sql`
      SELECT request_reference FROM order_service_requests
      WHERE order_number = ${orderNumber}
        AND request_type = ${requestType}
        AND status NOT IN ('rejected','refunded')
      ORDER BY created_at DESC LIMIT 1
    `;
    if (duplicate.length) return NextResponse.json({ success: false, message: "Is order ki isi type ki request pehle se maujood hai.", requestReference: duplicate[0].request_reference }, { status: 409 });

    const reference = `MM-${requestType === "refund" ? "REF" : "CAN"}-${randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
    const saved = await sql`
      INSERT INTO order_service_requests
        (request_reference, request_type, order_number, customer_name, customer_phone, reason, details, requested_amount)
      VALUES
        (${reference}, ${requestType}, ${orderNumber}, ${customerName}, ${phone}, ${reason}, ${details}, ${requestType === "refund" ? amount : null})
      RETURNING request_reference, request_type, order_number, status, created_at
    `;
    return NextResponse.json({ success: true, request: saved[0], message: "Request submit ho gayi. Team review karke contact karegi." }, { status: 201 });
  } catch (error) {
    console.error("Customer order service request failed:", error);
    return NextResponse.json({ success: false, message: "Request save nahi ho saki. Thori dair baad dobara try karein." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ success: false, message: "Admin login required" }, { status: 401 });
  try {
    const sql = database();
    await ensureSchema(sql);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const rows = type === "cancellation" || type === "refund"
      ? await sql`SELECT * FROM order_service_requests WHERE request_type = ${type} ORDER BY created_at DESC LIMIT 500`
      : await sql`SELECT * FROM order_service_requests ORDER BY created_at DESC LIMIT 500`;
    return NextResponse.json({ success: true, requests: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin order service requests fetch failed:", error);
    return NextResponse.json({ success: false, message: "Requests load nahi ho sakin." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ success: false, message: "Admin login required" }, { status: 401 });
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
    const data = body as Record<string, unknown>;
    const reference = String(data.requestReference ?? "").trim();
    const status = String(data.status ?? "").trim().toLowerCase();
    const note = String(data.adminNote ?? "").trim();
    const transferReference = String(data.refundTransferReference ?? "").trim();
    const approvedAmount = data.approvedAmount == null || data.approvedAmount === "" ? null : Number(data.approvedAmount);
    const allowed = ["under_review", "approved", "rejected", "processing", "refunded"];
    if (!reference || !allowed.includes(status) || note.length > 1500 || transferReference.length > 120 ||
      (approvedAmount !== null && (!Number.isFinite(approvedAmount) || approvedAmount <= 0))) {
      return NextResponse.json({ success: false, message: "Status, amount ya reference valid nahi." }, { status: 400 });
    }
    if (status === "refunded" && !transferReference) {
      return NextResponse.json({ success: false, message: "Refunded mark karne se pehle actual bank/wallet transfer reference enter karein." }, { status: 400 });
    }
    const sql = database();
    await ensureSchema(sql);
    const current = await sql`SELECT * FROM order_service_requests WHERE request_reference = ${reference} LIMIT 1`;
    if (!current.length) return NextResponse.json({ success: false, message: "Request nahi mili." }, { status: 404 });
    const row = current[0];
    const amount = approvedAmount ?? (row.approved_amount == null ? Number(row.requested_amount ?? 0) : Number(row.approved_amount));
    if (row.request_type === "refund" && ["approved", "processing", "refunded"].includes(status) && (!amount || amount > Number(row.requested_amount))) {
      return NextResponse.json({ success: false, message: "Approved refund amount requested amount se zyada ya zero nahi ho sakta." }, { status: 400 });
    }
    if (row.request_type === "cancellation" && status === "refunded") return NextResponse.json({ success: false, message: "Cancellation request refund workflow nahi hai." }, { status: 400 });
    if (row.status === "refunded" && status !== "refunded") {
      return NextResponse.json({ success: false, message: "Completed refund record ko dobara change nahi kiya ja sakta." }, { status: 409 });
    }
    if (row.request_type === "refund" && status === "refunded") {
      if (!["approved", "processing"].includes(String(row.status ?? "").toLowerCase())) {
        return NextResponse.json({ success: false, message: "Refund transfer record karne se pehle request ko Approved ya Processing mark karein." }, { status: 409 });
      }
      const completed = await sql`
        WITH request_row AS MATERIALIZED (
          SELECT id, order_number FROM order_service_requests
          WHERE request_reference = ${reference} AND request_type = 'refund'
          FOR UPDATE
        ),
        order_row AS MATERIALIZED (
          SELECT o.id, o.order_number, o.total, o.payment_status
          FROM orders o JOIN request_row r ON r.order_number = o.order_number
          FOR UPDATE OF o
        ),
        prior_refunds AS MATERIALIZED (
          SELECT COALESCE(SUM(r.approved_amount), 0)::numeric AS amount
          FROM order_service_requests r
          JOIN request_row target ON target.order_number = r.order_number
          WHERE r.request_type = 'refund' AND r.status = 'refunded' AND r.id <> target.id
        ),
        saved_request AS (
          UPDATE order_service_requests r
          SET status = 'refunded',
              approved_amount = ${amount},
              admin_note = ${note},
              refund_transfer_reference = ${transferReference},
              refund_processed_at = NOW(),
              reviewed_by = 'admin',
              updated_at = NOW()
          FROM request_row rr, order_row o, prior_refunds previous
          WHERE r.id = rr.id
            AND r.status IN ('approved','processing')
            AND o.payment_status IN ('paid','partially_refunded')
            AND ${amount} + previous.amount <= o.total
          RETURNING r.*
        ),
        saved_order AS (
          UPDATE orders o
          SET payment_status = CASE
            WHEN s.approved_amount + previous.amount >= o.total THEN 'refunded'
            ELSE 'partially_refunded'
          END,
              payment_reference = ${transferReference}
          FROM saved_request s, prior_refunds previous
          WHERE o.order_number = s.order_number
          RETURNING o.order_number, o.payment_status
        ),
        payment_audit AS (
          INSERT INTO payment_status_events (
            order_number, previous_status, new_status, payment_reference
          )
          SELECT
            saved_order.order_number,
            order_row.payment_status,
            saved_order.payment_status,
            ${transferReference}
          FROM saved_order
          CROSS JOIN order_row
          RETURNING id
        )
        SELECT s.*, saved_order.payment_status AS order_payment_status
        FROM saved_request s CROSS JOIN saved_order
      `;
      if (!completed.length) {
        return NextResponse.json({ success: false, message: "Refund amount order ke remaining refundable balance se zyada hai, ya order record missing hai. Pehle existing refunds check karein." }, { status: 409 });
      }
      return NextResponse.json({ success: true, request: completed[0], message: "Actual transfer reference recorded and order payment status updated. Transfer was not initiated by this system." });
    }
    if (row.request_type === "refund" && status === "approved") {
      // Approval records the decision only; it never claims money was transferred.
    }
    if (row.request_type === "cancellation" && status === "approved") {
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS stock_restocked_at timestamptz`;
      const cancelled = await sql`
        WITH request_row AS MATERIALIZED (
          SELECT id, order_number FROM order_service_requests
          WHERE request_reference = ${reference} AND request_type = 'cancellation'
          FOR UPDATE
        ),
        prior_order AS MATERIALIZED (
          SELECT o.id, o.order_number, o.status, o.stock_restocked_at
          FROM orders o JOIN request_row r ON r.order_number = o.order_number
          FOR UPDATE OF o
        ),
        changed_order AS (
          UPDATE orders o
          SET status = 'cancelled',
              stock_restocked_at = CASE WHEN p.stock_restocked_at IS NULL THEN NOW() ELSE p.stock_restocked_at END
          FROM prior_order p
          WHERE o.id = p.id AND lower(p.status) IN ('pending','confirmed')
          RETURNING o.id, o.order_number, p.stock_restocked_at AS was_restocked
        ),
        restocked AS (
          UPDATE products p
          SET stock = p.stock + quantities.quantity, updated_at = NOW()
          FROM (
            SELECT oi.product_id, SUM(oi.quantity)::integer AS quantity
            FROM order_items oi JOIN changed_order co ON co.id = oi.order_id
            WHERE co.was_restocked IS NULL
            GROUP BY oi.product_id
          ) quantities
          WHERE p.id = quantities.product_id
          RETURNING p.id
        ),
        request_update AS (
          UPDATE order_service_requests r
          SET status = 'approved', admin_note = ${note}, reviewed_by = 'admin', updated_at = NOW()
          FROM request_row rr JOIN changed_order co ON co.order_number = rr.order_number
          WHERE r.id = rr.id
          RETURNING r.*
        )
        SELECT * FROM request_update
      `;
      if (!cancelled.length) return NextResponse.json({ success: false, message: "Order ab cancellation ke liye eligible nahi. Order status check karein." }, { status: 409 });
      return NextResponse.json({ success: true, request: cancelled[0], message: "Order cancelled and stock restored exactly once." });
    }
    const updated = await sql`
      UPDATE order_service_requests
      SET status = ${status},
          approved_amount = CASE WHEN ${row.request_type === "refund"} THEN ${amount || null} ELSE approved_amount END,
          admin_note = ${note},
          refund_transfer_reference = CASE WHEN ${status} = 'refunded' THEN ${transferReference} ELSE refund_transfer_reference END,
          refund_processed_at = CASE WHEN ${status} = 'refunded' THEN NOW() ELSE refund_processed_at END,
          reviewed_by = 'admin',
          updated_at = NOW()
      WHERE request_reference = ${reference}
      RETURNING *
    `;
    return NextResponse.json({ success: true, request: updated[0], message: status === "refunded" ? "Refund record complete. Transfer reference saved; payment itself must be verified externally." : "Request status update ho gaya." });
  } catch (error) {
    console.error("Admin order service request update failed:", error);
    return NextResponse.json({ success: false, message: "Request update nahi ho saki." }, { status: 500 });
  }
}
