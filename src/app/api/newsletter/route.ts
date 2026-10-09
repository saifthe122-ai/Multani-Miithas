
import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Newsletter API is ready",
    mode: "demo",
    subscriptions: [],
    total: 0,
    databaseConnected: false,
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid subscription data" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    if (
      typeof data.email !== "string" ||
      !emailPattern.test(data.email.trim())
    ) {
      return NextResponse.json(
        { success: false, message: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (
      data.name !== undefined &&
      (typeof data.name !== "string" || data.name.trim().length > 120)
    ) {
      return NextResponse.json(
        { success: false, message: "Name must be 120 characters or fewer" },
        { status: 400 }
      );
    }

    const subscription = {
      email: data.email.trim().toLowerCase(),
      ...(typeof data.name === "string" && data.name.trim()
        ? { name: data.name.trim() }
        : {}),
    };

    return NextResponse.json(
      {
        success: true,
        message:
          "Newsletter signup validated for testing. It was not saved because the database is not connected.",
        mode: "demo",
        saved: false,
        databaseConnected: false,
        subscription,
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