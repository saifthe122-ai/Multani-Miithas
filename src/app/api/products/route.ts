
import { NextResponse } from "next/server";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
};

const demoProducts: Product[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Multani Mithas Products API is ready",
    databaseConnected: false,
    mode: "demo",
    total: demoProducts.length,
    products: demoProducts,
  });
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

    const data = body as Record<string, unknown>;

    if (typeof data.name !== "string" || !data.name.trim()) {
      return NextResponse.json(
        { success: false, message: "Product name is required" },
        { status: 400 }
      );
    }

    if (
      typeof data.price !== "number" ||
      !Number.isFinite(data.price) ||
      data.price < 0
    ) {
      return NextResponse.json(
        { success: false, message: "A valid non-negative price is required" },
        { status: 400 }
      );
    }

    if (typeof data.category !== "string" || !data.category.trim()) {
      return NextResponse.json(
        { success: false, message: "Product category is required" },
        { status: 400 }
      );
    }

    if (
      data.stock !== undefined &&
      (typeof data.stock !== "number" ||
        !Number.isInteger(data.stock) ||
        data.stock < 0)
    ) {
      return NextResponse.json(
        { success: false, message: "Stock must be a non-negative integer" },
        { status: 400 }
      );
    }

    const product: Product = {
      id: `DEMO-${Date.now()}`,
      name: data.name.trim(),
      price: data.price,
      category: data.category.trim(),
      stock: typeof data.stock === "number" ? data.stock : 0,
      description:
        typeof data.description === "string" ? data.description.trim() : "",
    };

    return NextResponse.json(
      {
        success: true,
        message: "Product data validated. Database is not connected, so the product was not saved.",
        databaseConnected: false,
        saved: false,
        product,
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