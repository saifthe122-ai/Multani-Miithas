
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Newsletter API is ready",
    subscriptions: [],
    databaseConnected: false,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      body && typeof body === "object" && !Array.isArray(body)
        ? body.email
        : undefined;

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return NextResponse.json(
        { success: false, message: "A valid email address is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Newsletter signup received for testing",
      saved: false,
      databaseConnected: false,
    }, { status: 202 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON data" },
      { status: 400 }
    );
  }
}