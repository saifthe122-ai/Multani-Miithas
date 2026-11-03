import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// This endpoint is deliberately unusable on Production.
export async function POST(request: Request) {
  if (process.env.VERCEL_ENV !== "preview" || process.env.PREVIEW_SEED_ENABLED !== "true") {
    return NextResponse.json(
      { success: false, message: "Preview seed is disabled outside an explicitly enabled Preview deployment." },
      { status: 404 }
    );
  }

  if (!(await isAdminRequest(request))) {
    return NextResponse.json(
      { success: false, message: "Admin login required" },
      { status: 401 }
    );
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

    const sql = neon(databaseUrl);
    const seedProducts = [
      { name: "Sohan Halwa — Preview Test", price: 1200, category: "Sweets", stock: 25, discount: 0, weight: "1 kg", image: "🍯", description: "Preview-only sample product. Confirm actual selling price before launch.", ingredients: "Preview sample" },
      { name: "Premium Barfi — Preview Test", price: 900, category: "Sweets", stock: 18, discount: 5, weight: "1 kg", image: "🍬", description: "Preview-only sample product. Confirm actual selling price before launch.", ingredients: "Preview sample" },
      { name: "Gulab Jamun — Preview Test", price: 700, category: "Sweets", stock: 12, discount: 0, weight: "1 kg", image: "🍮", description: "Preview-only sample product. Confirm actual selling price before launch.", ingredients: "Preview sample" },
      { name: "Besan Ladoo — Preview Test", price: 850, category: "Sweets", stock: 32, discount: 10, weight: "1 kg", image: "🟠", description: "Preview-only sample product. Confirm actual selling price before launch.", ingredients: "Preview sample" },
      { name: "Patisa — Preview Test", price: 950, category: "Sweets", stock: 14, discount: 0, weight: "1 kg", image: "✨", description: "Preview-only sample product. Confirm actual selling price before launch.", ingredients: "Preview sample" },
      { name: "Premium Gift Box — Preview Test", price: 2500, category: "Gift Boxes", stock: 8, discount: 15, weight: "1 box", image: "🎁", description: "Preview-only sample product. Confirm actual selling price before launch.", ingredients: "Preview sample" }
    ];

    const inserted = await sql`
      WITH seed_lock AS MATERIALIZED (
        SELECT pg_advisory_xact_lock(741903112)
      ),
      seed_rows AS (
        SELECT *
        FROM jsonb_to_recordset(${JSON.stringify(seedProducts)}::jsonb) AS p(
          name text, price numeric, category text, stock integer,
          discount numeric, weight text, image text, description text, ingredients text
        )
      ),
      added AS (
        INSERT INTO products (
          name, price, price_type, cost_price, category, stock, discount,
          weight, weight_options, image_icon, image_url, description,
          long_description, ingredients, rating, is_active
        )
        SELECT
          p.name, p.price, 'per_kg', 0, p.category, p.stock, p.discount,
          p.weight, '[]'::jsonb, p.image, '', p.description, '', p.ingredients, 5, true
        FROM seed_rows p
        CROSS JOIN seed_lock
        WHERE NOT EXISTS (
          SELECT 1 FROM products existing WHERE existing.name = p.name
        )
        RETURNING id, name
      )
      SELECT id, name FROM added ORDER BY id
    `;

    const totals = await sql`
      SELECT COUNT(*)::integer AS total
      FROM products
      WHERE name LIKE '%— Preview Test'
    `;

    return NextResponse.json({
      success: true,
      inserted: inserted.length,
      previewTestProducts: Number(totals[0]?.total ?? 0),
      message: inserted.length
        ? "Preview test catalogue is ready. These prices and stock values are samples, not approved live business values."
        : "Preview test catalogue was already seeded; no duplicate products were created.",
      products: inserted
    });
  } catch (error) {
    console.error("Preview product seed failed:", error);
    return NextResponse.json(
      { success: false, message: "Preview seed failed. Check database schema and deployment logs." },
      { status: 500 }
    );
  }
}
