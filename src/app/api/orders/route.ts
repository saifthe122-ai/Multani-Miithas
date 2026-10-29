
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

type CartItem = {
  productId: string;
  quantity: number;
};

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
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
        o.customer_id,
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
                'productId', oi.product_id,
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

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Admin orders fetch failed:", error);

    return NextResponse.json(
      { success: false, message: "Could not load orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid order details." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const customerName =
      typeof data.customerName === "string"
        ? data.customerName.trim()
        : "";

    const phone =
      typeof data.phone === "string" ? data.phone.trim() : "";

    const address =
      typeof data.address === "string" ? data.address.trim() : "";

    const submittedPayment =
      typeof data.paymentMethod === "string"
        ? data.paymentMethod.trim()
        : "";

    const paymentMethod = PAYMENT_METHODS.find(
      (method) => method.toLowerCase() === submittedPayment.toLowerCase()
    );

    if (
      !customerName ||
      customerName.length > 150 ||
      !phone ||
      phone.length > 40 ||
      !address ||
      address.length > 2000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, phone aur delivery address sahi enter karein.",
        },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Payment method valid nahi hai." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(data.items) ||
      data.items.length === 0 ||
      data.items.length > 50
    ) {
      return NextResponse.json(
        { success: false, message: "Cart mein valid products nahi hain." },
        { status: 400 }
      );
    }

    const combinedItems = new Map<string, number>();

    for (const item of data.items) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return NextResponse.json(
          { success: false, message: "Cart item valid nahi hai." },
          { status: 400 }
        );
      }

      const cartItem = item as Record<string, unknown>;
      const productId = String(cartItem.productId ?? "");
      const quantity = cartItem.quantity;

      if (
        !/^\d+$/.test(productId) ||
        !Number.isSafeInteger(Number(productId)) ||
        Number(productId) <= 0 ||
        typeof quantity !== "number" ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 100
      ) {
        return NextResponse.json(
          { success: false, message: "Product ID ya quantity valid nahi." },
          { status: 400 }
        );
      }

      const id = String(Number(productId));
      const combinedQuantity = (combinedItems.get(id) ?? 0) + quantity;

      if (combinedQuantity > 100) {
        return NextResponse.json(
          { success: false, message: "Product quantity limit se zyada hai." },
          { status: 400 }
        );
      }

      combinedItems.set(id, combinedQuantity);
    }

    const items: CartItem[] = Array.from(
      combinedItems,
      ([productId, quantity]) => ({ productId, quantity })
    );

    const orderNumber = `MM-${randomUUID()
      .replace(/-/g, "")
      .slice(0, 12)
      .toUpperCase()}`;

    const result = await sql`
      WITH requested_items AS MATERIALIZED (
        SELECT
          (item->>'productId')::bigint AS product_id,
          (item->>'quantity')::integer AS quantity
        FROM jsonb_array_elements(${JSON.stringify(items)}::jsonb)
          AS entry(item)
      ),
      valid_products AS MATERIALIZED (
        SELECT
          p.id AS product_id,
          p.name AS product_name,
          p.price AS unit_price,
          r.quantity,
          p.price * r.quantity AS line_total
        FROM requested_items r
        INNER JOIN products p ON p.id = r.product_id
        WHERE p.is_active = true
      ),
      totals AS (
        SELECT
          (SELECT COUNT(*)::integer FROM requested_items)
            AS requested_count,
          (SELECT COUNT(*)::integer FROM valid_products)
            AS valid_count,
          COALESCE(
            (SELECT SUM(line_total) FROM valid_products),
            0
          ) AS subtotal
      ),
      existing_customer AS (
        SELECT id
        FROM customers
        WHERE phone = ${phone}
        LIMIT 1
      ),
      new_customer AS (
        INSERT INTO customers (name, phone)
        SELECT ${customerName}, ${phone}
        FROM totals t
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
          order_number,
          customer_id,
          customer_name,
          customer_phone,
          delivery_address,
          status,
          payment_method,
          payment_status,
          subtotal,
          delivery_fee,
          total
        )
        SELECT
          ${orderNumber},
          c.id,
          ${customerName},
          ${phone},
          ${address},
          'pending',
          ${paymentMethod},
          'pending',
          t.subtotal,
          0,
          t.subtotal
        FROM resolved_customer c
        CROSS JOIN totals t
        WHERE t.requested_count > 0
          AND t.requested_count = t.valid_count
        RETURNING id, order_number, subtotal, total
      ),
      inserted_items AS (
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          quantity,
          unit_price,
          line_total
        )
        SELECT
          o.id,
          p.product_id,
          p.product_name,
          p.quantity,
          p.unit_price,
          p.line_total
        FROM new_order o
        CROSS JOIN valid_products p
        RETURNING order_id
      )
      SELECT
        o.id AS order_id,
        o.order_number,
        o.subtotal,
        t.requested_count,
        t.valid_count,
        (SELECT COUNT(*) FROM inserted_items) AS saved_item_count
      FROM totals t
      LEFT JOIN new_order o ON true
    `;

    const saved = result[0] as
      | {
          order_id: number | string | null;
          order_number: string | null;
          subtotal: number | string;
          requested_count: number;
          valid_count: number;
          saved_item_count: number;
        }
      | undefined;

    if (
      !saved ||
      saved.order_id == null ||
      Number(saved.requested_count) !== Number(saved.valid_count) ||
      Number(saved.saved_item_count) !== Number(saved.valid_count)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cart ke kuch products available nahi hain. Page refresh karke dobara try karein.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order successfully save ho gaya.",
        order: {
          orderNumber: saved.order_number,
          subtotal: Number(saved.subtotal),
          deliveryFee: 0,
          total: Number(saved.subtotal),
          paymentStatus: "pending",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Customer order save failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Order save nahi ho saka. Dobara try karein.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json(
      { success: false, message: "Admin login required" },
      { status: 401 }
    );
  }

  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;
    const orderNumber =
      typeof data.orderNumber === "string" ? data.orderNumber.trim() : "";

    const hasStatus = typeof data.status === "string";
    const hasPaymentStatus = typeof data.paymentStatus === "string";

    const status = hasStatus
      ? (data.status as string).trim().toLowerCase()
      : "";
    const paymentStatus = hasPaymentStatus
      ? (data.paymentStatus as string).trim().toLowerCase()
      : "";

 
const validStatuses = [
  "pending",
  "confirmed",
  "processing",
  "out_for_delivery",
  "completed",
  "cancelled",
];


    const validPaymentStatuses = [
      "pending",
      "paid",
      "failed",
      "cancelled",
      "refunded",
      "partially refunded",
    ];

    if (
      !orderNumber ||
      (!hasStatus && !hasPaymentStatus) ||
      (hasStatus && !validStatuses.includes(status)) ||
      (hasPaymentStatus && !validPaymentStatuses.includes(paymentStatus))
    ) {
      return NextResponse.json(
        { success: false, message: "Order number ya status valid nahi." },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE orders
      SET
        status = CASE
          WHEN ${hasStatus} THEN ${status}
          ELSE status
        END,
        payment_status = CASE
          WHEN ${hasPaymentStatus} THEN ${paymentStatus}
          ELSE payment_status
        END
      WHERE order_number = ${orderNumber}
      RETURNING order_number, status, payment_status
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order nahi mila." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: result[0],
    });
  } catch (error) {
    console.error("Order status update failed:", error);

    return NextResponse.json(
      { success: false, message: "Status update nahi ho saka." },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json(
      { success: false, message: "Admin login required" },
      { status: 401 }
    );
  }

  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const orderNumber =
      typeof (body as Record<string, unknown>).orderNumber === "string"
        ? ((body as Record<string, unknown>).orderNumber as string).trim()
        : "";

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: "Order number required." },
        { status: 400 }
      );
    }

    const result = await sql.transaction([
      sql`
        DELETE FROM order_items
        WHERE order_id = (
          SELECT id FROM orders WHERE order_number = ${orderNumber}
        )
      `,
      sql`
        DELETE FROM orders
        WHERE order_number = ${orderNumber}
        RETURNING order_number
      `,
    ]);

    const deletedOrders = result[1];

    if (!deletedOrders || deletedOrders.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order nahi mila." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order permanently delete ho gaya.",
      orderNumber,
    });
  } catch (error) {
    console.error("Order delete failed:", error);

    return NextResponse.json(
      { success: false, message: "Order delete nahi ho saka." },
      { status: 500 }
    );
  }
}
