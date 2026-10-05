
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Referrals API is ready",
    referrals: [],
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
      typeof body.referralCode !== "string" ||
      !body.referralCode.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "A referral code is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Referral request received for testing",
      recorded: false,
      databaseConnected: false,
    }, { status: 202 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON data" },
      { status: 400 }
    );
  }
}