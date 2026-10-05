
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Feedback API is ready",
    feedback: [],
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
      typeof body.message !== "string" ||
      !body.message.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "Feedback message is required" },
        { status: 400 }
      );
    }

    const allowedTypes = ["general", "complaint", "suggestion", "delivery"];

    if (
      body.type !== undefined &&
      (typeof body.type !== "string" || !allowedTypes.includes(body.type))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid feedback type" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback received for testing",
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