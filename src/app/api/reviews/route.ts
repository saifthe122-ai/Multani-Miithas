
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Reviews API is ready",
    reviews: [],
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
      typeof body.productId !== "string" ||
      !body.productId.trim() ||
      !Number.isInteger(body.rating) ||
      body.rating < 1 ||
      body.rating > 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A product ID and rating from 1 to 5 are required",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review received for testing",
      approved: false,
      databaseConnected: false,
    }, { status: 202 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON data" },
      { status: 400 }
    );
  }
}