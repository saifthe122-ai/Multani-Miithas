
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Delivery API is ready",
    deliveryProviders: [],
    trackingEnabled: false,
    databaseConnected: false,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      typeof body.orderId !== "string" ||
      !body.orderId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid orderId is required",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Delivery request received for testing",
        databaseConnected: false,
        trackingEnabled: false,
        orderId: body.orderId,
        deliveryStatus: "pending",
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