import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return neon(process.env.DATABASE_URL);
}

async function ensureReviews(sql: ReturnType<typeof neon>) {
  await sql`CREATE TABLE IF NOT EXISTS product_reviews (
    id bigserial PRIMARY KEY,
    order_id bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id bigint NOT NULL REFERENCES products(id),
    customer_name text NOT NULL,
    rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text text NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    admin_reply text,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    UNIQUE(order_id, product_id)
  )`;
}

export async function GET(request: Request) {
  try {
    const sql = database();
    await ensureReviews(sql);
    const admin = await isAdminRequest(request);
    const reviews = admin
      ? await sql`SELECT r.id, r.order_id, o.order_number, r.product_id, p.name AS product_name,
          r.customer_name, r.rating, r.review_text, r.status, r.admin_reply, r.created_at
        FROM product_reviews r JOIN orders o ON o.id=r.order_id
        JOIN products p ON p.id=r.product_id ORDER BY r.created_at DESC LIMIT 500`
      : await sql`SELECT r.id, r.product_id, p.name AS product_name, r.customer_name,
          r.rating, r.review_text, r.admin_reply, r.created_at
        FROM product_reviews r JOIN products p ON p.id=r.product_id
        WHERE r.status='approved' ORDER BY r.created_at DESC LIMIT 100`;
    return NextResponse.json({ success: true, reviews, databaseConnected: true });
  } catch (error) {
    console.error("Reviews GET failed", error);
    return NextResponse.json({ success: false, message: "Reviews database is unavailable" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: "Invalid review data" }, { status: 400 });
    }
    const data = body as Record<string, unknown>;
    const productId = Number(data.productId);
    const orderNumber = typeof data.orderNumber === "string" ? data.orderNumber.trim() : "";
    const phone = typeof data.phone === "string" ? data.phone.trim() : "";
    const customerName = typeof data.customerName === "string" ? data.customerName.trim() : "";
    const reviewText = typeof data.reviewText === "string" ? data.reviewText.trim() : "";
    const rating = data.rating;
    if (!Number.isSafeInteger(productId) || productId <= 0 || !orderNumber || orderNumber.length > 40 ||
        !phone || phone.length > 40 || !customerName || customerName.length > 120 ||
        typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5 ||
        reviewText.length > 2000) {
      return NextResponse.json({ success: false, message: "Order number, phone, name and a 1–5 rating are required." }, { status: 400 });
    }
    const sql = database();
    await ensureReviews(sql);
    const order = await sql`SELECT o.id, o.status FROM orders o
      JOIN order_items oi ON oi.order_id=o.id
      WHERE o.order_number=${orderNumber} AND o.customer_phone=${phone}
        AND oi.product_id=${productId} AND lower(o.status) IN ('delivered','completed')
      LIMIT 1`;
    if (!order.length) {
      return NextResponse.json({ success: false, message: "Review sirf delivered order ke matching product ke liye submit ho sakta hai." }, { status: 403 });
    }
    const saved = await sql`INSERT INTO product_reviews
      (order_id, product_id, customer_name, rating, review_text, status)
      VALUES (${order[0].id}, ${productId}, ${customerName}, ${rating}, ${reviewText}, 'pending')
      ON CONFLICT (order_id, product_id) DO UPDATE SET
        customer_name=EXCLUDED.customer_name, rating=EXCLUDED.rating,
        review_text=EXCLUDED.review_text, status='pending', updated_at=NOW()
      RETURNING id, status`;
    return NextResponse.json({ success: true, saved: true, review: saved[0], message: "Review submit ho gaya; admin approval ke baad website par show hoga." }, { status: 201 });
  } catch (error) {
    console.error("Reviews POST failed", error);
    return NextResponse.json({ success: false, message: "Review save nahi ho saka." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ success: false, message: "Admin login required" }, { status: 401 });
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ success: false, message: "Invalid review update" }, { status: 400 });
    const data = body as Record<string, unknown>;
    const id = Number(data.id);
    const status = data.status;
    const reply = typeof data.adminReply === "string" ? data.adminReply.trim() : null;
    if (!Number.isSafeInteger(id) || id <= 0 || (status !== undefined && !["pending","approved","rejected"].includes(String(status))) || (reply !== null && reply.length > 2000)) {
      return NextResponse.json({ success: false, message: "Review update values are invalid" }, { status: 400 });
    }
    const sql = database();
    await ensureReviews(sql);
    const rows = await sql`UPDATE product_reviews SET
      status=COALESCE(${typeof status === "string" ? status : null}, status),
      admin_reply=CASE WHEN ${reply !== null} THEN ${reply} ELSE admin_reply END,
      updated_at=NOW() WHERE id=${id} RETURNING id, status, admin_reply`;
    if (!rows.length) return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    return NextResponse.json({ success: true, review: rows[0] });
  } catch (error) {
    console.error("Reviews PATCH failed", error);
    return NextResponse.json({ success: false, message: "Review update failed" }, { status: 500 });
  }
}
