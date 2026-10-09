
import { NextResponse } from "next/server";

const paymentMethods = [
  "Cash on Delivery",
  "JazzCash",
  "Easypaisa",
  "Raast / Bank Transfer",
  "International Gateway",
] as const;

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Orders API is ready",
    mode: "demo",
    databaseConnected: false,
    total: 0,
    orders: [],
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid order data" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    if (
      typeof data.customerName !== "string" ||
      !data.customerName.trim() ||
      data.customerName.trim().length > 120
    ) {
      return NextResponse.json(
        { success: false, message: "A valid customerName is required" },
        { status: 400 }
      );
    }

    if (
      typeof data.phone !== "string" ||
      !data.phone.trim() ||
      data.phone.trim().length > 30
    ) {
      return NextResponse.json(
        { success: false, message: "A valid customer phone is required" },
        { status: 400 }
      );
    }

    if (
      typeof data.address !== "string" ||
      !data.address.trim() ||
      data.address.trim().length > 500
    ) {
      return NextResponse.json(
        { success: false, message: "A valid delivery address is required" },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(data.items) ||
      data.items.length === 0 ||
      data.items.length > 100
    ) {
      return NextResponse.json(
        { success: false, message: "Order must contain 1 to 100 items" },
        { status: 400 }
      );
    }

    const items: OrderItem[] = [];

    for (const rawItem of data.items) {
      if (
        !rawItem ||
        typeof rawItem !== "object" ||
        Array.isArray(rawItem)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid order item" },
          { status: 400 }
        );
      }

      const item = rawItem as Record<string, unknown>;

      if (
        typeof item.productId !== "string" ||
        !item.productId.trim() ||
        typeof item.name !== "string" ||
        !item.name.trim() ||
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 10000 ||
        typeof item.price !== "number" ||
        !Number.isFinite(item.price) ||
        item.price < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Each item requires productId, name, a positive integer quantity and a valid price",
          },
          { status: 400 }
        );
      }

      items.push({
        productId: item.productId.trim(),
        name: item.name.trim(),
        quantity: item.quantity,
        price: item.price,
      });
    }

    if (
      data.email !== undefined &&
      (typeof data.email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid customer email" },
        { status: 400 }
      );
    }

    if (
      data.paymentMethod !== undefined &&
      (typeof data.paymentMethod !== "string" ||
        !paymentMethods.includes(
          data.paymentMethod as (typeof paymentMethods)[number]
        ))
    ) {
      return NextResponse.json(
        { success: false, message: "Unsupported payment method" },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    if (!Number.isFinite(subtotal)) {
      return NextResponse.json(
        { success: false, message: "Order total is invalid" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Order validated for testing only. It was not saved and payment was not processed.",
        mode: "demo",
        databaseConnected: false,
        saved: false,
        paymentProcessed: false,
        order: {
          customerName: data.customerName.trim(),
          phone: data.phone.trim(),
          address: data.address.trim(),
          ...(typeof data.email === "string"
            ? { email: data.email.trim().toLowerCase() }
            : {}),
          items,
          subtotal,
          currency: "PKR",
          paymentMethod:
            typeof data.paymentMethod === "string"
              ? data.paymentMethod
              : "Cash on Delivery",
          paymentStatus: "pending",
          orderStatus: "pending",
        },
      },
      { status: 202 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON data" },
      { status: 400 }
    );
  }
}