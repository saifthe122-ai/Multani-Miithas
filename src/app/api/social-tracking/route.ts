
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
] as const;

type TrafficSource = (typeof allowedSources)[number];

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Social Tracking API is ready",
    sources: allowedSources,
    analyticsEnabled: false,
    databaseConnected: false,
    trackingMode: "testing",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid tracking request",
        },
        { status: 400 }
      );
    }

    const source =
      typeof body.source === "string"
        ? body.source.trim().toLowerCase()
        : "";

    if (
      !allowedSources.includes(source as TrafficSource)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid traffic source is required",
          allowedSources,
        },
        { status: 400 }
      );
    }

    const campaign =
      typeof body.campaign === "string"
        ? body.campaign.trim()
        : "";

    const page =
      typeof body.page === "string"
        ? body.page.trim()
        : "";

    if (campaign.length > 150 || page.length > 500) {
      return NextResponse.json(
        {
          success: false,
          message: "Campaign or page value is too long",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Traffic source received in testing mode",
        trackingEvent: {
          source,
          campaign: campaign || null,
          page: page || null,
          receivedAt: new Date().toISOString(),
        },
        recorded: false,
        analyticsEnabled: false,
        databaseConnected: false,
        note:
          "This event is not stored. Persistent analytics require a database or analytics provider.",
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