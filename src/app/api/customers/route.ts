import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured");
  return neon(connectionString);
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json(
      { success: false, message: "Admin login required" },
      { status: 401 }
    );
  }

  try {
    const sql = getDatabase();
    await sql\`ALTER TABLE customers ADD COLUMN IF NOT EXISTS email text\`;
    await sql\`ALTER TABLE customers ADD COLUMN IF NOT EXISTS address text\`;
    await sql\`ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT NOW()\`;

    const customers = await sql\`
      SELECT
        c.id, c.name, c.email, c.phone, c.address, c.created_at,
        COUNT(o.id)::integer AS order_count,
        COALESCE(
          SUM(CASE WHEN lower(COALESCE(o.payment_status, '')) = 'paid'
                   THEN o.total ELSE 0 END), 0
        ) AS total_paid,
        MAX(o.created_at) AS last_order_at
      FROM customers c
      LEFT JOIN orders o ON o.customer_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC NULLS LAST, c.id DESC
      LIMIT 500
    \`;

    return NextResponse.json(
      { success: true, mode: "database", databaseConnected: true,
        total: customers.length, customers },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate", Pragma: "no-cache" } }
    );
  } catch (error) {
    console.error("Admin customers fetch failed:", error);
    return NextResponse.json(
      { success: false, message: "Customers database se load nahi ho sake." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: "Invalid customer data" }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const phone = typeof data.phone === "string" ? data.phone.trim() : "";
    const address = typeof data.address === "string" ? data.address.trim() : "";

    if (!name || name.length > 150) {
      return NextResponse.json({ success: false, message: "Valid customer name required hai." }, { status: 400 });
    }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ success: false, message: "Valid email address required hai." }, { status: 400 });
    }
    if (phone.length > 40 || address.length > 2000) {
      return NextResponse.json({ success: false, message: "Phone ya address ki length valid nahi." }, { status: 400 });
    }

    const sql = getDatabase();
    await sql\`ALTER TABLE customers ADD COLUMN IF NOT EXISTS email text\`;
    await sql\`ALTER TABLE customers ADD COLUMN IF NOT EXISTS address text\`;
    await sql\`ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT NOW()\`;

    const saved = await sql\`
      WITH matching_customer AS MATERIALIZED (
        SELECT id FROM customers
        WHERE lower(COALESCE(email, '')) = \${email}
           OR (\${phone} <> '' AND phone = \${phone})
        ORDER BY id
        LIMIT 1
      ),
      updated_customer AS (
        UPDATE customers c
        SET name = \${name}, email = \${email},
            phone = NULLIF(\${phone}, ''),
            address = NULLIF(\${address}, ''),
            updated_at = NOW()
        FROM matching_customer m
        WHERE c.id = m.id
        RETURNING c.id, c.name, c.email, c.phone, c.address, c.created_at
      ),
      inserted_customer AS (
        INSERT INTO customers (name, email, phone, address, created_at, updated_at)
        SELECT \${name}, \${email}, NULLIF(\${phone}, ''),
               NULLIF(\${address}, ''), NOW(), NOW()
        WHERE NOT EXISTS (SELECT 1 FROM updated_customer)
        RETURNING id, name, email, phone, address, created_at
      )
      SELECT *, (SELECT COUNT(*) FROM updated_customer) > 0 AS existing
      FROM updated_customer
      UNION ALL
      SELECT *, false AS existing FROM inserted_customer
      LIMIT 1
    \`;

    if (!saved.length) {
      return NextResponse.json({ success: false, message: "Customer save nahi ho saka." }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        saved: true,
        message: saved[0].existing ? "Customer profile update ho gaya." : "Customer database mein save ho gaya.",
        customer: saved[0],
      },
      { status: saved[0].existing ? 200 : 201 }
    );
  } catch (error) {
    console.error("Customer save failed:", error);
    return NextResponse.json(
      { success: false, message: "Customer database mein save nahi ho saka." },
      { status: 500 }
    );
  }
}
