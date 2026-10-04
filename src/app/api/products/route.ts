
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Products API is ready",
    databaseConnected: false,
    products: [],
  });
}