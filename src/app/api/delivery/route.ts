
import { NextResponse } from "next/server";

const allowedStatuses = [
  "pending",
  "processing",
  "dispatched",
  "in_transit",
  "delivered",
  "failed",
] as const;

type DeliveryStatus = (typeof allowedStatuses)[number];

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Delivery API is ready",
    mode: "demo",
    deliveryProviders: [],
    deliveries: [],
    trackingEnabled: false,
    databaseConnected: false,
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid delivery data" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    if (
      typeof data.orderId !== "string" ||
      !data.orderId.trim() ||
      data.orderId.trim().length > 100
    ) {
      return NextResponse.json(
        { success: false, message: "A valid orderId is required" },
        { status: 400 }
      );
    }

    if (
      data.provider !== undefined &&
      (typeof data.provider !== "string" ||
        !data.provider.trim() ||
        data.provider.trim().length > 100)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid delivery provider" },
        { status: 400 }
      );
    }

    let deliveryStatus: DeliveryStatus = "pending";

    if (data.deliveryStatus !== undefined) {
      if (
        typeof data.deliveryStatus !== "string" ||
        !allowedStatuses.includes(data.deliveryStatus as DeliveryStatus)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid delivery status",
            allowedStatuses,
          },
          { status: 400 }
        );
      }

      deliveryStatus = data.deliveryStatus as DeliveryStatus;
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Delivery request validated for testing. It was not saved and no courier was contacted.",
        databaseConnected: false,
        trackingEnabled: false,
        saved: false,
        orderId: data.orderId.trim(),
        provider:
          typeof data.provider === "string" ? data.provider.trim() : null,
        deliveryStatus,
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