
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Reviews API is ready",
    reviews: [],
    databaseConnected: false,
    moderationEnabled: false,
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
          message: "Invalid review request",
        },
        { status: 400 }
      );
    }

    const productId =
      typeof body.productId === "string"
        ? body.productId.trim()
        : "";

    const rating = body.rating;

    const reviewText =
      typeof body.reviewText === "string"
        ? body.reviewText.trim()
        : "";

    const customerName =
      typeof body.customerName === "string"
        ? body.customerName.trim()
        : "";

    if (!productId || productId.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid product ID is required",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be a whole number from 1 to 5",
        },
        { status: 400 }
      );
    }

    if (reviewText.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message: "Review text must not exceed 2000 characters",
        },
        { status: 400 }
      );
    }

    if (customerName.length > 120) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer name must not exceed 120 characters",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Review received in testing mode",
        review: {
          productId,
          rating,
          reviewText: reviewText || null,
          customerName: customerName || "Anonymous",
          status: "pending",
          approved: false,
        },
        saved: false,
        databaseConnected: false,
        note:
          "This review has not been saved. Database storage and admin moderation must be connected before reviews can appear publicly.",
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