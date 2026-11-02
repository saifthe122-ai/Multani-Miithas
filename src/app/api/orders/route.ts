import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminRequest } from "@/lib/admin-auth";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

const PAYMENT_METHODS = [
  "JazzCash",
  "Easypaisa",
  "Raast ID",
  "Payoneer",
  "Bank Transfer",
  "Cash on Delivery",
];

// Product prices are stored per kg; gift boxes use weight 1 as a fixed-price unit.
const ALLOWED_WEIGHTS = [0.5, 1, 1.5, 2, 5];

type CartItem = { productId: string; weight: number; quantity: number };

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ success: false, message: "Admin login required" }, { status: 401 });
  }
  try {
    const orders = await sql`
      SELECT o.id, o.order_number, o.customer_id, o.customer_name, o.customer_phone,
        o.delivery_address, o.status, o.payment_method, o.payment_status,
        o.subtotal, o.delivery_fee, o.total, o.created_at,
        COALESCE((SELECT json_agg(json_build_object(
          'productId', oi.product_id, 'productName', oi.product_name,
          'quantity', oi.quantity, 'weight', oi.weight,
          'unitPrice', oi.unit_price, 'lineTotal', oi.line_total
        ) ORDER BY oi.id) FROM order_items oi WHERE oi.order_id = o.id), '[]'::json) AS items
      FROM orders o ORDER BY o.created_at DESC LIMIT 500
    `;
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Admin orders fetch failed:", error);
    return NextResponse.json({ success: false, message: "Could not load orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: "Invalid order details." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    const customerName = typeof data.customerName === "string" ? data.customerName.trim() : "";
    const phone = typeof data.phone === "string" ? data.phone.trim() : "";
    const address = typeof data.address === "string" ? data.address.trim() : "";
    const submittedPayment = typeof data.paymentMethod === "string" ? data.paymentMethod.trim() : "";
    const paymentMethod = PAYMENT_METHODS.find(
      (method) => method.toLowerCase() === submittedPayment.toLowerCase()
    );

    if (!customerName || customerName.length > 150 || !phone || phone.length > 40 || !address || address.length > 2000) {
      return NextResponse.json({ success: false, message: "Name, phone aur delivery address sahi enter karein." }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ success: false, message: "Payment method valid nahi hai." }, { status: 400 });
    }

    if (!Array.isArray(data.items) || data.items.length === 0 || data.items.length > 50) {
      return NextResponse.json({ success: false, message: "Cart mein valid products nahi hain." }, { status: 400 });
    }

    const combinedItems = new Map<string, CartItem>();

    for (const item of data.items) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return NextResponse.json({ success: false, message: "Cart item valid nahi hai." }, { status: 400 });
      }

      const cartItem = item as Record<string, unknown>;
      const productId = String(cartItem.productId ?? "");
      const quantity = cartItem.quantity;
      const weight = cartItem.weight;

      if (
        !/^\d+$/.test(productId) ||
        !Number.isSafeInteger(Number(productId)) ||
        Number(productId) <= 0 ||
        typeof quantity !== "number" ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 100 ||
        typeof weight !== "number" ||
        !ALLOWED_WEIGHTS.includes(weight)
      ) {
        return NextResponse.json({ success: false, message: "Product ID, weight ya quantity valid nahi." }, { status: 400 });
      }

      const id = String(Number(productId));
      const key = `${id}:${weight}`;
      const combinedQuantity = (combinedItems.get(key)?.quantity ?? 0) + quantity;

      if (combinedQuantity > 100) {
        return NextResponse.json({ success: false, message: "Product quantity limit se zyada hai." }, { status: 400 });
      }

      combinedItems.set(key, { productId: id, weight, quantity: combinedQuantity });
    }

    const items = Array.from(combinedItems.values());
    const orderNumber = `MM-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;

    // Ensure checkout settings exist before calculating the order.
    await sql`
      CREATE TABLE IF NOT EXISTS checkout_settings (
        id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        delivery_fee numeric(12,2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
        free_delivery_minimum numeric(12,2) NOT NULL DEFAULT 0 CHECK (free_delivery_minimum >= 0),
        sales_tax_enabled boolean NOT NULL DEFAULT false,
        sales_tax_rate numeric(6,3) NOT NULL DEFAULT 0 CHECK (sales_tax_rate >= 0 AND sales_tax_rate <= 100),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await sql`
      INSERT INTO checkout_settings (id)
      VALUES (1)
      ON CONFLICT (id) DO NOTHING
    `;

    const result = await sql`
      WITH requested_items AS MATERIALIZED (
        SELECT
          (item->>'productId')::bigint AS product_id,
          (item->>'weight')::numeric AS weight,
          (item->>'quantity')::integer AS quantity
        FROM jsonb_array_elements(${JSON.stringify(items)}::jsonb) AS entry(item)
      ),
      valid_products AS MATERIALIZED (
        SELECT
          p.id AS product_id,
          p.name AS product_name,
          p.price * r.weight AS unit_price,
          r.weight,
          r.quantity,
          p.price * r.weight * r.quantity AS line_total
        FROM requested_items r
        INNER JOIN products p ON p.id = r.product_id
        WHERE p.is_active = true
      ),
      settings AS MATERIALIZED (
        SELECT delivery_fee, free_delivery_minimum, sales_tax_enabled, sales_tax_rate
        FROM checkout_settings
        WHERE id = 1
      ),
      totals AS (
        SELECT
          (SELECT COUNT(*)::integer FROM requested_items) AS requested_count,
          (SELECT COUNT(*)::integer FROM valid_products) AS valid_count,
          COALESCE((SELECT SUM(line_total) FROM valid_products), 0) AS subtotal,
          s.delivery_fee,
          s.free_delivery_minimum,
          s.sales_tax_enabled,
          s.sales_tax_rate
        FROM settings s
      ),
      calculated AS (
        SELECT
          *,
          CASE
            WHEN free_delivery_minimum > 0 AND subtotal >= free_delivery_minimum THEN 0
            ELSE delivery_fee
          END AS final_delivery_fee,
          CASE
            WHEN sales_tax_enabled THEN ROUND(subtotal * sales_tax_rate / 100, 2)
            ELSE 0
          END AS tax_amount
        FROM totals
      ),
      existing_customer AS (
        SELECT id FROM customers WHERE phone = ${phone} LIMIT 1
      ),
      new_customer AS (
        INSERT INTO customers (name, phone)
        SELECT ${customerName}, ${phone}
        FROM calculated t
        WHERE t.requested_count > 0
          AND t.requested_count = t.valid_count
          AND NOT EXISTS (SELECT 1 FROM existing_customer)
        RETURNING id
      ),
      resolved_customer AS (
        SELECT id FROM existing_customer
        UNION ALL
        SELECT id FROM new_customer
        LIMIT 1
      ),
      new_order AS (
        INSERT INTO orders (
          order_number, customer_id, customer_name, customer_phone,
          delivery_address, status, payment_method, payment_status,
          subtotal, delivery_fee, tax_amount, total
        )
        SELECT
          ${orderNumber}, c.id, ${customerName}, ${phone},
          ${address}, 'pending', ${paymentMethod}, 'pending',
          t.subtotal, t.final_delivery_fee, t.tax_amount,
          t.subtotal + t.final_delivery_fee + t.tax_amount
        FROM resolved_customer c
        CROSS JOIN calculated t
        WHERE t.requested_count > 0
          AND t.requested_count = t.valid_count
        RETURNING id, order_number, subtotal, delivery_fee, tax_amount, total
      ),
      inserted_items AS (
        INSERT INTO order_items (
          order_id, product_id, product_name, quantity,
          weight, unit_price, line_total
        )
        SELECT
          o.id, p.product_id, p.product_name, p.quantity,
          p.weight, p.unit_price, p.line_total
        FROM new_order o
        CROSS JOIN valid_products p
        RETURNING order_id
      )
      SELECT
        o.id AS order_id,
        o.order_number,
        o.subtotal,
        o.delivery_fee,
        o.tax_amount,
        o.total,
        t.requested_count,
        t.valid_count,
        (SELECT COUNT(*) FROM inserted_items) AS saved_item_count
      FROM calculated t
      LEFT JOIN new_order o ON true
    `;

    const saved = result[0] as {
      order_id: number | string | null;
      order_number: string | null;
      subtotal: number | string;
      delivery_fee: number | string;
      tax_amount: number | string;
      total: number | string;
      requested_count: number;
      valid_count: number;
      saved_item_count: number;
    } | undefined;

    if (
      !saved ||
      saved.order_id == null ||
      Number(saved.requested_count) !== Number(saved.valid_count) ||
      Number(saved.saved_item_count) !== Number(saved.valid_count)
    ) {
      return NextResponse.json({
        success: false,
        message: "Cart ke kuch products available nahi hain. Page refresh karke dobara try karein."
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Order successfully save ho gaya.",
      order: {
        orderNumber: saved.order_number,
        subtotal: Number(saved.subtotal),
        deliveryFee: Number(saved.delivery_fee),
        taxAmount: Number(saved.tax_amount),
        total: Number(saved.total),
        paymentStatus: "pending"
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Customer order save failed:", error);
    return NextResponse.json({
      success: false,
      message: "Order save nahi ho saka. Dobara try karein."
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ success: false, message: "Admin login required" }, { status: 401 });
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
    const data = body as Record<string, unknown>;
    const orderNumber = typeof data.orderNumber === "string" ? data.orderNumber.trim() : "";
    const hasStatus = typeof data.status === "string";
    const hasPaymentStatus = typeof data.paymentStatus === "string";
    const status = hasStatus ? (data.status as string).trim().toLowerCase() : "";
    const paymentStatus = hasPaymentStatus ? (data.paymentStatus as string).trim().toLowerCase() : "";
    const validStatuses = ["pending", "confirmed", "processing", "out_for_delivery", "completed", "cancelled"];
    const validPaymentStatuses = ["pending", "paid", "failed", "cancelled", "refunded", "partially refunded", "partially_refunded"];
    if (!orderNumber || (!hasStatus && !hasPaymentStatus) || (hasStatus && !validStatuses.includes(status)) || (hasPaymentStatus && !validPaymentStatuses.includes(paymentStatus))) {
      return NextResponse.json({ success: false, message: "Order number ya status valid nahi." }, { status: 400 });
    }
    const result = await sql`
      UPDATE orders SET
        status = CASE WHEN ${hasStatus} THEN ${status} ELSE status END,
        payment_status = CASE WHEN ${hasPaymentStatus} THEN ${paymentStatus} ELSE payment_status END
      WHERE order_number = ${orderNumber}
      RETURNING order_number, status, payment_status
    `;
    if (result.length === 0) return NextResponse.json({ success: false, message: "Order nahi mila." }, { status: 404 });
    return NextResponse.json({ success: true, order: result[0] });
  } catch (error) {
    console.error("Order status update failed:", error);
    return NextResponse.json({ success: false, message: "Status update nahi ho saka." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ success: false, message: "Admin login required" }, { status: 401 });
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
    const orderNumber = typeof (body as Record<string, unknown>).orderNumber === "string" ? ((body as Record<string, unknown>).orderNumber as string).trim() : "";
    if (!orderNumber) return NextResponse.json({ success: false, message: "Order number required." }, { status: 400 });
    const result = await sql.transaction([
      sql`DELETE FROM order_items WHERE order_id = (SELECT id FROM orders WHERE order_number = ${orderNumber})`,
      sql`DELETE FROM orders WHERE order_number = ${orderNumber} RETURNING order_number`,
    ]);
    const deletedOrders = result[1];
    if (!deletedOrders || deletedOrders.length === 0) return NextResponse.json({ success: false, message: "Order nahi mila." }, { status: 404 });
    return NextResponse.json({ success: true, message: "Order permanently delete ho gaya.", orderNumber });
  } catch (error) {
    console.error("Order delete failed:", error);
    return NextResponse.json({ success: false, message: "Order delete nahi ho saka." }, { status: 500 });
  }
}
