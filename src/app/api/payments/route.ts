
import { NextResponse } from "next/server";

const paymentMethods = [
  "Cash on Delivery",
  "Bank Transfer",
  "JazzCash",
  "Easypaisa",
  "International Payments",
] as const;

type PaymentMethod = (typeof paymentMethods)[number];

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Payments API is ready",
    paymentGateways: paymentMethods,
    livePaymentsEnabled: false,
    databaseConnected: false,
    note: "Testing mode only. No real payment is processed.",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid payment request" },
        { status: 400 }
      );
    }

    const method = body.method;
    const amount = body.amount;
    const orderId = body.orderId;

    if (
      typeof method !== "string" ||
      !paymentMethods.includes(method as PaymentMethod)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid payment method",
          allowedMethods: paymentMethods,
        },
        { status: 400 }
      );
    }

    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment amount must be greater than zero",
        },
        { status: 400 }
      );
    }

    if (
      typeof orderId !== "string" ||
      orderId.trim().length === 0 ||
      orderId.length > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid order ID is required",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment request received in testing mode",
        payment: {
          orderId: orderId.trim(),
          method,
          amount,
          currency: "PKR",
          paymentStatus: "pending",
        },
        livePaymentsEnabled: false,
        paymentProcessed: false,
        saved: false,
        databaseConnected: false,
        note:
          "No money was collected. A verified payment provider and database are required for live payments.",
      },
      { status: 202 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON data",
      },
      { status: 400 }
    );
  }
}