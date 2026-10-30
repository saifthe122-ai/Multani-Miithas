
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProductInput = {
  id?: unknown;
  name?: unknown;
  price?: unknown;
  price_type?: unknown;
  cost_price?: unknown;
  category?: unknown;
  stock?: unknown;
  discount?: unknown;
  weight?: unknown;
  image?: unknown;
  image_url?: unknown;
  description?: unknown;
  long_description?: unknown;
  ingredients?: unknown;
  rating?: unknown;
  status?: unknown;
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

  if (
    data.price_type !== undefined &&
    data.price_type !== "per_kg" &&
    data.price_type !== "fixed"
  ) {
    return "Invalid product price type";
  }

  if (
    data.cost_price !== undefined &&
    (typeof data.cost_price !== "number" ||
      !Number.isFinite(data.cost_price) ||
      data.cost_price < 0)
  ) {
    return "A valid non-negative cost price is required";
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
    data.discount !== undefined &&
    (typeof data.discount !== "number" ||
      !Number.isFinite(data.discount) ||
      data.discount < 0 ||
      data.discount > 100)
  ) {
    return "Discount must be between 0 and 100";
  }

  if (
    data.rating !== undefined &&
    (typeof data.rating !== "number" ||
      !Number.isFinite(data.rating) ||
      data.rating < 0 ||
      data.rating > 5)
  ) {
    return "Rating must be between 0 and 5";
  }

  for (const field of [
    "description",
    "long_description",
    "weight",
    "ingredients",
    "image",
    "image_url",
  ] as const) {
    if (data[field] !== undefined && typeof data[field] !== "string") {
      return `${field} must be text`;
    }
  }

  if (
    data.status !== undefined &&
    data.status !== "Active" &&
    data.status !== "Inactive"
  ) {
    return "Invalid product status";
  }

  return null;
}

function formatProduct(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    price: Number(row.price ?? 0),
    price_type: String(row.price_type ?? "per_kg"),
    cost_price: Number(row.cost_price ?? 0),
    category: String(row.category ?? "Sweets"),
    stock: Number(row.stock ?? 0),
    discount: Number(row.discount ?? 0),
    weight: String(row.weight ?? ""),
    image: String(row.image_icon ?? "🍬"),
    image_url: String(row.image_url ?? ""),
    description: String(row.description ?? ""),
    long_description: String(row.long_description ?? ""),
    ingredients: String(row.ingredients ?? ""),
    rating: Number(row.rating ?? 5),
    status: row.is_active === false ? "Inactive" : "Active",
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

const PRODUCT_COLUMNS = `
  id, name, price, price_type, cost_price, category, stock,
  discount, weight, image_icon, image_url, description,
  long_description, ingredients, rating, is_active,
  created_at, updated_at
`;

export async function GET() {
  try {
    const sql = getDatabase();

    const rows = await sql`
      SELECT id, name, price, price_type, cost_price,
             category, stock, discount, weight, image_icon,
             image_url, description, long_description,
             ingredients, rating, is_active, created_at, updated_at
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
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { success: false, message: "Admin login required" },
        { status: 401 }
      );
    }

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
      INSERT INTO products (
        name, price, price_type, cost_price, category,
        stock, discount, weight, image_icon, image_url,
        description, long_description, ingredients,
        rating, is_active
      )
      VALUES (
        ${String(data.name).trim()},
        ${data.price as number},
        ${data.price_type === "fixed" ? "fixed" : "per_kg"},
        ${typeof data.cost_price === "number" ? data.cost_price : 0},
        ${String(data.category).trim()},
        ${typeof data.stock === "number" ? data.stock : 0},
        ${typeof data.discount === "number" ? data.discount : 0},
        ${typeof data.weight === "string" ? data.weight.trim() : ""},
        ${typeof data.image === "string" ? data.image : "🍬"},
        ${typeof data.image_url === "string" ? data.image_url : ""},
        ${typeof data.description === "string" ? data.description.trim() : ""},
        ${typeof data.long_description === "string" ? data.long_description.trim() : ""},
        ${typeof data.ingredients === "string" ? data.ingredients.trim() : ""},
        ${typeof data.rating === "number" ? data.rating : 5},
        ${data.status !== "Inactive"}
      )
      RETURNING ${sql.unsafe(PRODUCT_COLUMNS)}
    `;

    return NextResponse.json(
      {
        success: true,
        saved: true,
        product: formatProduct(rows[0] as Record<string, unknown>),
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
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { success: false, message: "Admin login required" },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid product data" },
        { status: 400 }
      );
    }

    const data = body as ProductInput;

    if (
      (typeof data.id !== "string" && typeof data.id !== "number") ||
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
      UPDATE products SET
        name = ${String(data.name).trim()},
        price = ${data.price as number},
        price_type = COALESCE(
          ${data.price_type === "fixed" || data.price_type === "per_kg"
            ? data.price_type
            : null},
          price_type
        ),
        cost_price = COALESCE(
          ${typeof data.cost_price === "number" ? data.cost_price : null},
          cost_price
        ),
        category = ${String(data.category).trim()},
        stock = ${typeof data.stock === "number" ? data.stock : 0},
        discount = ${typeof data.discount === "number" ? data.discount : 0},
        weight = ${typeof data.weight === "string" ? data.weight.trim() : ""},
        image_icon = ${typeof data.image === "string" ? data.image : "🍬"},
        image_url = ${typeof data.image_url === "string" ? data.image_url : ""},
        description = ${typeof data.description === "string" ? data.description.trim() : ""},
        long_description = COALESCE(
          ${typeof data.long_description === "string"
            ? data.long_description.trim()
            : null},
          long_description
        ),
        ingredients = ${typeof data.ingredients === "string" ? data.ingredients.trim() : ""},
        rating = ${typeof data.rating === "number" ? data.rating : 5},
        is_active = ${data.status !== "Inactive"},
        updated_at = NOW()
      WHERE id = ${String(data.id)}
      RETURNING ${sql.unsafe(PRODUCT_COLUMNS)}
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
      product: formatProduct(rows[0] as Record<string, unknown>),
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
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { success: false, message: "Admin login required" },
        { status: 401 }
      );
    }

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
