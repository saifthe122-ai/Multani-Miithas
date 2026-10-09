
import { NextResponse } from "next/server";

const allowedTypes = [
  "general",
  "complaint",
  "suggestion",
  "delivery",
] as const;

type FeedbackType = (typeof allowedTypes)[number];

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Feedback API is ready",
    mode: "demo",
    feedback: [],
    total: 0,
    databaseConnected: false,
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid feedback data" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    if (
      typeof data.message !== "string" ||
      !data.message.trim() ||
      data.message.trim().length > 3000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback message is required and must be under 3000 characters",
        },
        { status: 400 }
      );
    }

    let type: FeedbackType = "general";

    if (data.type !== undefined) {
      if (
        typeof data.type !== "string" ||
        !allowedTypes.includes(data.type as FeedbackType)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid feedback type", allowedTypes },
          { status: 400 }
        );
      }

      type = data.type as FeedbackType;
    }

    if (
      data.name !== undefined &&
      (typeof data.name !== "string" || data.name.trim().length > 120)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid customer name" },
        { status: 400 }
      );
    }

    if (
      data.email !== undefined &&
      (typeof data.email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    ) {
      return NextResponse.json(
        { success: false, message: "A valid email address is required" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Feedback validated for testing. It was not saved because the database is not connected.",
        mode: "demo",
        saved: false,
        databaseConnected: false,
        feedback: {
          type,
          message: data.message.trim(),
          ...(typeof data.name === "string" && data.name.trim()
            ? { name: data.name.trim() }
            : {}),
          ...(typeof data.email === "string"
            ? { email: data.email.trim().toLowerCase() }
            : {}),
        },
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