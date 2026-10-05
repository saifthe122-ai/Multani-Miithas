
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Payments API is ready",
    paymentGateways: [
      "Cash on Delivery",
      "Bank Transfer",
      "JazzCash",
      "Easypaisa",
      "International Payments",
    ],
    livePaymentsEnabled: false,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      typeof body.method !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid payment request" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment request received for testing",
        livePaymentsEnabled: false,
        method: body.method,
        paymentStatus: "pending",
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