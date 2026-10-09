
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Referrals API is ready",
    referrals: [],
    databaseConnected: false,
    referralTrackingEnabled: false,
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
          message: "Invalid referral request",
        },
        { status: 400 }
      );
    }

    const referralCode =
      typeof body.referralCode === "string"
        ? body.referralCode.trim()
        : "";

    const customerName =
      typeof body.customerName === "string"
        ? body.customerName.trim()
        : "";

    const customerEmail =
      typeof body.customerEmail === "string"
        ? body.customerEmail.trim().toLowerCase()
        : "";

    if (!referralCode) {
      return NextResponse.json(
        {
          success: false,
          message: "A referral code is required",
        },
        { status: 400 }
      );
    }

    if (
      referralCode.length > 50 ||
      !/^[a-zA-Z0-9_-]+$/.test(referralCode)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Referral code format is invalid",
        },
        { status: 400 }
      );
    }

    if (customerName.length > 120) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer name is too long",
        },
        { status: 400 }
      );
    }

    if (
      customerEmail &&
      (
        customerEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Referral request received in testing mode",
        referral: {
          referralCode,
          customerName: customerName || null,
          customerEmail: customerEmail || null,
          status: "pending",
        },
        recorded: false,
        referralTrackingEnabled: false,
        databaseConnected: false,
        note:
          "The referral has not been saved or verified. Database storage and referral-code verification are not enabled.",
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