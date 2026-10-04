
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Orders API is ready",
    databaseConnected: false,
    orders: [],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid order data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order received for testing",
        databaseConnected: false,
        order: body,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON data" },
      { status: 400 }
    );
  }
}