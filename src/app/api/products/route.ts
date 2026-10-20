
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProductInput = {
  name?: unknown;
  price?: unknown;
  category?: unknown;
  stock?: unknown;
  description?: unknown;
};

function getDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  return neon(connectionString);
}

function validateProduct(data: ProductInput) {
  if (typeof data.name !== "string" || !data.name.trim()) {
    return "Product name is required";
  }

  if (
    typeof data.price !== "number" ||
    !Number.isFinite(data.price) ||
    data.price < 0
  ) {
    return "A valid non-negative price is required";
  }

  if (typeof data.category !== "string" || !data.category.trim()) {
    return "Product category is required";
  }

  if (
    data.stock !== undefined &&
    (typeof data.stock !== "number" ||
      !Number.isInteger(data.stock) ||
      data.stock < 0)
  ) {
    return "Stock must be a non-negative integer";
  }

  if (
    data.description !== undefined &&
    typeof data.description !== "string"
  ) {
    return "Description must be text";
  }

  return null;
}

function formatProduct(row: Record<string, unknown>) {
  return {
    ...row,
    id: String(row.id),
    price: Number(row.price),
    stock: Number(row.stock),
  };
}

export async function GET() {
  try {
    const sql = getDatabase();

    const rows = await sql`
      SELECT id, name, price, category, stock, description,
             image_url, is_active, created_at, updated_at
      FROM products
      ORDER BY id DESC
    `;

    const products = rows.map((row) =>
      formatProduct(row as Record<string, unknown>)
    );

    return NextResponse.json({
      success: true,
      databaseConnected: true,
      mode: "database",
      total: products.length,
      products,
    });
  } catch (error) {
    console.error("Products GET failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Could not load products from the database",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid product data" },
        { status: 400 }
      );
    }

    const data = body as ProductInput;
    const validationError = validateProduct(data);

    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const sql = getDatabase();

    const rows = await sql`
      INSERT INTO products
        (name, price, category, stock, description)
      VALUES (
        ${String(data.name).trim()},
        ${data.price as number},
        ${String(data.category).trim()},
        ${data.stock === undefined ? 0 : data.stock as number},
        ${typeof data.description === "string"
          ? data.description.trim()
          : ""}
      )
      RETURNING id, name, price, category, stock, description,
                image_url, is_active, created_at, updated_at
    `;

    return NextResponse.json(
      {
        success: true,
        saved: true,
        product: formatProduct(
          rows[0] as Record<string, unknown>
        ),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Products POST failed:", error);

    return NextResponse.json(
      { success: false, message: "Could not save the product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid product data" },
        { status: 400 }
      );
    }

    const data = body as ProductInput & { id?: unknown };

    if (
      (typeof data.id !== "string" && typeof data.id !== "number") ||
      !String(data.id).trim() ||
      !/^\d+$/.test(String(data.id))
    ) {
      return NextResponse.json(
        { success: false, message: "A valid product ID is required" },
        { status: 400 }
      );
    }

    const validationError = validateProduct(data);

    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const sql = getDatabase();

    const rows = await sql`
      UPDATE products
      SET name = ${String(data.name).trim()},
          price = ${data.price as number},
          category = ${String(data.category).trim()},
          stock = ${data.stock === undefined ? 0 : data.stock as number},
          description = ${typeof data.description === "string"
            ? data.description.trim()
            : ""},
          updated_at = NOW()
      WHERE id = ${String(data.id)}
      RETURNING id, name, price, category, stock, description,
                image_url, is_active, created_at, updated_at
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      saved: true,
      product: formatProduct(
        rows[0] as Record<string, unknown>
      ),
    });
  } catch (error) {
    console.error("Products PUT failed:", error);

    return NextResponse.json(
      { success: false, message: "Could not update the product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "A valid product ID is required" },
        { status: 400 }
      );
    }

    const sql = getDatabase();

    const rows = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: true,
      id: String(rows[0].id),
    });
  } catch (error) {
    console.error("Products DELETE failed:", error);

    return NextResponse.json(
      { success: false, message: "Could not delete the product" },
      { status: 500 }
    );
  }
}
