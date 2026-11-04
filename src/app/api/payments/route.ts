import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// This legacy endpoint never processed or persisted money. Real checkout orders
// are created through /api/orders and payment status is reconciled by admins.
function unavailable() {
  return NextResponse.json(
    {
      success: false,
      livePaymentsEnabled: false,
      paymentProcessed: false,
      saved: false,
      message: "This legacy payment endpoint is disabled. Place an order through the secure checkout; manual transfers remain pending until an admin verifies funds.",
    },
    {
      status: 410,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

export async function GET() {
  return unavailable();
}

export async function POST() {
  return unavailable();
}
