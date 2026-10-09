
import { NextResponse } from "next/server";

type CustomerInput = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Customers API is ready",
    mode: "demo",
    total: 0,
    customers: [],
    databaseConnected: false,
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid customer data" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    if (
      typeof data.name !== "string" ||
      !data.name.trim() ||
      typeof data.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
    ) {
      return NextResponse.json(
        { success: false, message: "Valid name and email are required" },
        { status: 400 }
      );
    }

    if (
      data.phone !== undefined &&
      (typeof data.phone !== "string" || data.phone.trim().length > 30)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    if (
      data.address !== undefined &&
      (typeof data.address !== "string" || data.address.trim().length > 500)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid address" },
        { status: 400 }
      );
    }

    const customer: CustomerInput = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      ...(typeof data.phone === "string" && data.phone.trim()
        ? { phone: data.phone.trim() }
        : {}),
      ...(typeof data.address === "string" && data.address.trim()
        ? { address: data.address.trim() }
        : {}),
    };

    return NextResponse.json(
      {
        success: true,
        message:
          "Customer data validated for testing. Database is not connected, so the customer was not saved.",
        databaseConnected: false,
        saved: false,
        customer,
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