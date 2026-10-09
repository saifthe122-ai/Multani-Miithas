
import { NextResponse } from "next/server";

type Coupon = {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  active: boolean;
};

const demoCoupons: Coupon[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Coupons API is ready",
    mode: "demo",
    databaseConnected: false,
    total: demoCoupons.length,
    coupons: demoCoupons,
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon data" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    if (typeof data.code !== "string" || !data.code.trim()) {
      return NextResponse.json(
        { success: false, message: "A coupon code is required" },
        { status: 400 }
      );
    }

    const discountType = data.discountType;
    const discountValue = data.discountValue;

    if (discountType !== "percentage" && discountType !== "fixed") {
      return NextResponse.json(
        {
          success: false,
          message: "Discount type must be percentage or fixed",
        },
        { status: 400 }
      );
    }

    if (
      typeof discountValue !== "number" ||
      !Number.isFinite(discountValue) ||
      discountValue <= 0 ||
      (discountType === "percentage" && discountValue > 100)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter a valid discount value. Percentage must be between 1 and 100.",
        },
        { status: 400 }
      );
    }

    const coupon: Coupon = {
      code: data.code.trim().toUpperCase(),
      discountType,
      discountValue,
      active: data.active === true,
    };

    return NextResponse.json(
      {
        success: true,
        message:
          "Coupon data validated for testing. It was not saved because the database is not connected.",
        databaseConnected: false,
        saved: false,
        validated: false,
        coupon,
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