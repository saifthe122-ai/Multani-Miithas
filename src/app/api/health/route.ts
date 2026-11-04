import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { status: "unavailable", database: "not_configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`SELECT 1 AS ready`;
    return NextResponse.json(
      { status: "ok", database: "connected" },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Health check database probe failed:", error);
    return NextResponse.json(
      { status: "unavailable", database: "connection_failed" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
