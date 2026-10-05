
import { NextResponse } from "next/server";

const allowedSources = [
  "facebook",
  "instagram",
  "youtube",
  "tiktok",
  "linkedin",
  "twitter",
  "whatsapp",
  "direct",
  "other",
];

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Social Tracking API is ready",
    sources: allowedSources,
    analyticsEnabled: false,
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
      typeof body.source !== "string" ||
      !allowedSources.includes(body.source.toLowerCase())
    ) {
      return NextResponse.json(
        { success: false, message: "A valid traffic source is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Traffic source received for testing",
      recorded: false,
      analyticsEnabled: false,
      databaseConnected: false,
    }, { status: 202 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON data" },
      { status: 400 }
    );
  }
}