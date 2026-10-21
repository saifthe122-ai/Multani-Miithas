
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";

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
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number];

type SubmittedItem = {
  productId: string;
  quantity: number;
};

type DatabaseProduct = {
  id: string | number;
  name: string;
  price: string | number;
  category: string;
  stock: number;
  is_active: boolean;
};

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Orders API is connected",
    databaseConnected: true,
    paymentMethods: PAYMENT_METHODS,
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid order data" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const customerName =
      typeof data.customerName === "string"
        ? data.customerName.trim()
        : "";

    const phone =
      typeof data.phone === "string"
        ? data.phone.trim()
        : "";

    const address =
      typeof data.address === "string"
        ? data.address.trim()
        : "";

    const paymentMethod = data.paymentMethod;

    if (!customerName || customerName.length > 120) {
      return NextResponse.json(
        { success: false, message: "Enter a valid customer name" },
        { status: 400 }
      );
    }

    if (!phone || phone.length > 30) {
      return NextResponse.json(
        { success: false, message: "Enter a valid phone number" },
        { status: 400 }
      );
    }

    if (!address || address.length > 500) {
      return NextResponse.json(
        { success: false, message: "Enter a valid delivery address" },
        { status: 400 }
      );
    }

    if (
      typeof paymentMethod !== "string" ||
      !PAYMENT_METHODS.includes(paymentMethod as PaymentMethod)
    ) {
      return NextResponse.json(
        { success: false, message: "Select a valid payment method" },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(data.items) ||
      data.items.length === 0 ||
      data.items.length > 100
    ) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty or invalid" },
        { status: 400 }
      );
    }

    const submittedItems: SubmittedItem[] = [];

    for (const raw of data.items) {
      if (
        !raw ||
        typeof raw !== "object" ||
        Array.isArray(raw)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid cart item" },
          { status: 400 }
        );
      }

      const item = raw as Record<string, unknown>;
      const productId = String(item.productId ?? item.id ?? "");
      const quantity = item.quantity;

      if (
        !/^[1-9]\d*$/.test(productId) ||
        !Number.isSafeInteger(Number(productId)) ||
        typeof quantity !== "number" ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 10000
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid product or quantity" },
          { status: 400 }
        );
      }

      submittedItems.push({ productId, quantity });
    }

    const uniqueIds = [
      ...new Set(submittedItems.map((item) => item.productId)),
    ];

    const products = (await sql`
      SELECT id, name, price, category, stock, is_active
      FROM products
      WHERE id = ANY(${uniqueIds}::bigint[])
    `) as DatabaseProduct[];

    const productMap = new Map(
      products.map((product) => [String(product.id), product])
    );

    const orderItems = [];

    for (const item of submittedItems) {
      const product = productMap.get(item.productId);

      if (!product || !product.is_active) {
        return NextResponse.json(
          {
            success: false,
            message: "A product in your cart is unavailable",
          },
          { status: 400 }
        );
      }

      if (item.quantity > product.stock) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for ${product.name}`,
          },
          { status: 400 }
        );
      }

      const price = Number(product.price);

      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json(
          { success: false, message: "Invalid product price" },
          { status: 500 }
        );
      }

      orderItems.push({
        product_id: item.productId,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: price,
        line_total: Number((price * item.quantity).toFixed(2)),
      });
    }

    const subtotal = Number(
      orderItems
        .reduce((sum, item) => sum + item.line_total, 0)
        .toFixed(2)
    );

    const deliveryFee =
      data.deliveryFee === undefined ? 0 : Number(data.deliveryFee);

    if (
      !Number.isFinite(deliveryFee) ||
      deliveryFee < 0 ||
      deliveryFee > 1000000
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid delivery fee" },
        { status: 400 }
      );
    }

    const total = Number((subtotal + deliveryFee).toFixed(2));
    const orderNumber = `MM-${Date.now()}-${randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;

    const result = await sql`
      WITH new_order AS (
        INSERT INTO orders (
          order_number,
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
        VALUES (
          ${orderNumber},
          ${customerName},
          ${phone},
          ${address},
          'pending',
          ${paymentMethod},
          'pending',
          ${subtotal},
          ${deliveryFee},
          ${total}
        )
        RETURNING id, order_number, total, created_at
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
          new_order.id,
          item.product_id,
          item.product_name,
          item.quantity,
          item.unit_price,
          item.line_total
        FROM new_order
        CROSS JOIN LATERAL jsonb_to_recordset(
          ${JSON.stringify(orderItems)}::jsonb
        ) AS item(
          product_id bigint,
          product_name text,
          quantity integer,
          unit_price numeric,
          line_total numeric
        )
        RETURNING id
      )
      SELECT
        new_order.id,
        new_order.order_number,
        new_order.total,
        new_order.created_at,
        (SELECT COUNT(*) FROM inserted_items) AS items_saved
      FROM new_order
    `;

    const saved = result[0];

    if (!saved) {
      throw new Error("Order was not returned after saving");
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Order saved successfully. Payment is awaiting verification.",
        saved: true,
        paymentProcessed: false,
        order: {
          id: saved.id,
          orderNumber: saved.order_number,
          customerName,
          phone,
          address,
          items: orderItems,
          subtotal,
          deliveryFee,
          total,
          currency: "PKR",
          paymentMethod,
          paymentStatus: "pending",
          orderStatus: "pending",
          createdAt: saved.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Order could not be saved. Please try again or contact the business.",
      },
      { status: 500 }
    );
  }
}
