import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const databaseUrl = process.env.DATABASE_URL;

async function ensureSettingsTable() {
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  const sql = neon(databaseUrl);
  await sql`CREATE TABLE IF NOT EXISTS checkout_settings (
    id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    delivery_fee numeric(12,2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
    free_delivery_minimum numeric(12,2) NOT NULL DEFAULT 0 CHECK (free_delivery_minimum >= 0),
    sales_tax_enabled boolean NOT NULL DEFAULT false,
    sales_tax_rate numeric(6,3) NOT NULL DEFAULT 0 CHECK (sales_tax_rate >= 0 AND sales_tax_rate <= 100),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`INSERT INTO checkout_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`;
  return sql;
}

function present(row: Record<string, unknown>) {
  return {
    deliveryFee: Number(row.delivery_fee) || 0,
    freeDeliveryMinimum: Number(row.free_delivery_minimum) || 0,
    salesTaxEnabled: Boolean(row.sales_tax_enabled),
    salesTaxRate: Number(row.sales_tax_rate) || 0,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: Request) {
  try {
    const sql = await ensureSettingsTable();
    const [row] = await sql`SELECT delivery_fee, free_delivery_minimum, sales_tax_enabled, sales_tax_rate, updated_at FROM checkout_settings WHERE id = 1`;
    if (!row) throw new Error("Checkout settings row missing");
    return NextResponse.json({ success: true, settings: present(row as Record<string, unknown>) }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (error) {
    console.error("Checkout settings read failed:", error);
    return NextResponse.json({ success: false, message: "Checkout settings load nahi ho sakin." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ success: false, message: "Admin login required" }, { status: 401 });
  }
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: "Invalid settings." }, { status: 400 });
    }
    const data = body as Record<string, unknown>;
    const deliveryFee = Number(data.deliveryFee);
    const freeDeliveryMinimum = Number(data.freeDeliveryMinimum);
    const salesTaxRate = Number(data.salesTaxRate);
    const salesTaxEnabled = data.salesTaxEnabled;
    if (!Number.isFinite(deliveryFee) || deliveryFee < 0 || deliveryFee > 1000000 ||
        !Number.isFinite(freeDeliveryMinimum) || freeDeliveryMinimum < 0 || freeDeliveryMinimum > 100000000 ||
        !Number.isFinite(salesTaxRate) || salesTaxRate < 0 || salesTaxRate > 100 ||
        typeof salesTaxEnabled !== "boolean") {
      return NextResponse.json({ success: false, message: "Charges aur tax rate ki values valid enter karein." }, { status: 400 });
    }
    const sql = await ensureSettingsTable();
    const [row] = await sql`
      UPDATE checkout_settings SET
        delivery_fee = ${deliveryFee},
        free_delivery_minimum = ${freeDeliveryMinimum},
        sales_tax_enabled = ${salesTaxEnabled},
        sales_tax_rate = ${salesTaxRate},
        updated_at = now()
      WHERE id = 1
      RETURNING delivery_fee, free_delivery_minimum, sales_tax_enabled, sales_tax_rate, updated_at
    `;
    return NextResponse.json({ success: true, message: "Checkout settings save ho gayi.", settings: present(row as Record<string, unknown>) });
  } catch (error) {
    console.error("Checkout settings save failed:", error);
    return NextResponse.json({ success: false, message: "Settings save nahi ho sakin." }, { status: 500 });
  }
}
