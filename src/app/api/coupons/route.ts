
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Coupons API is ready",
    coupons: [],
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
      typeof body.code !== "string" ||
      !body.code.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "A coupon code is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coupon request received for testing",
      couponCode: body.code.trim(),
      validated: false,
      databaseConnected: false,
    }, { status: 202 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON data" },
      { status: 400 }
    );
  }
}