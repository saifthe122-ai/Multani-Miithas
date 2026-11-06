
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminRequest } from "@/lib/admin-auth";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

type CartItem = {
  productId: string;
  weight: number;
  quantity: number;
};

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json(
      { success: false, message: "Admin login required" },
      { status: 401 }
    );
  }

  try {
    const previousOrdersView = new URL(request.url).searchParams.get("view") === "previous";
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS archived_at timestamptz`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference text`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_account_id bigint`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_account_snapshot jsonb`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS packaging_fee numeric(12,2) NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS delivery_fee numeric(12,2) NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS packaging_fee numeric(12,2) NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS tax_amount numeric(12,2) NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS sales_tax_rate numeric(6,3) NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS packaging_type text NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS sales_tax_base text NOT NULL DEFAULT 'product'`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS stock_restocked_at timestamptz`;
    const orders = await sql`
      SELECT
        o.id,
        o.order_number,
        o.customer_id,
        o.customer_name,
        o.customer_phone,
        o.delivery_address,
        o.status,
        o.payment_method,
        o.payment_status,
        o.payment_reference,
        o.payment_account_id,
        o.payment_account_snapshot,
        o.subtotal,
        o.delivery_fee,
        o.tax_amount,
        o.packaging_fee,
        o.total,
        o.created_at,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'productId', oi.product_id,
                'productName', oi.product_name,
                'quantity', oi.quantity,
                'weight', oi.weight,
                'unitPrice', oi.unit_price,
                'deliveryFee', oi.delivery_fee,
                'packagingFee', oi.packaging_fee,
                'taxAmount', oi.tax_amount,
                'salesTaxRate', oi.sales_tax_rate,
                'packagingType', oi.packaging_type,
                'salesTaxBase', oi.sales_tax_base,
                'lineTotal', oi.line_total
              )
              ORDER BY oi.id
            )
            FROM order_items oi
            WHERE oi.order_id = o.id
          ),
          '[]'::json
        ) AS items
      FROM orders o
      WHERE (
        (${previousOrdersView} = true AND o.archived_at IS NOT NULL)
        OR (${previousOrdersView} = false AND o.archived_at IS NULL)
      )
      ORDER BY o.created_at DESC
      LIMIT 500
    `;

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Admin orders fetch failed:", error);

    return NextResponse.json(
      { success: false, message: "Could not load orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid order details." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const customerName =
      typeof data.customerName === "string"
        ? data.customerName.trim()
        : "";

    const email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

    const phone =
      typeof data.phone === "string" ? data.phone.trim() : "";

    const address =
      typeof data.address === "string" ? data.address.trim() : "";

    const submittedPayment =
      typeof data.paymentMethod === "string"
        ? data.paymentMethod.trim()
        : "";

    const enabledPaymentMethods = await sql`
      SELECT name, provider, method_key
      FROM payment_methods
      WHERE is_enabled = true
        AND payment_type = 'manual'
    `;
    const selectedPaymentMethod = enabledPaymentMethods.find(
      (row) => String(row.name ?? "").toLowerCase() === submittedPayment.toLowerCase()
    );
    const paymentMethod = selectedPaymentMethod
      ? String(selectedPaymentMethod.name)
      : undefined;

    if (
      !customerName ||
      customerName.length > 150 ||
      !phone ||
      phone.length > 40 ||
      !address ||
      address.length > 2000 ||
      (email !== "" && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254))
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, phone aur delivery address sahi enter karein.",
        },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Payment method valid nahi hai." },
        { status: 400 }
      );
    }

    const isCashOnDelivery = /cash on delivery|\bcod\b/i.test(paymentMethod);
    let selectedPaymentAccount: Record<string, unknown> | null = null;
    if (!isCashOnDelivery) {
      const provider = String(selectedPaymentMethod?.provider ?? "").trim();
      if (!provider) {
        return NextResponse.json(
          { success: false, message: "Is payment method ka business account abhi configure nahi hai. Cash on Delivery select karein." },
          { status: 409 }
        );
      }

      const configuredAccounts = await sql`
        SELECT
          id, account_name, account_type, provider,
          account_title, account_number, iban, currency,
          is_primary, wallet_owner_type, qr_image_url, app_link
        FROM business_payment_accounts
        WHERE is_active = true
          AND wallet_owner_type = 'merchant'
          AND show_on_checkout = true
          AND (
            LOWER(COALESCE(provider, '')) = LOWER(${provider})
            OR (
              (
                LOWER(COALESCE(${String(selectedPaymentMethod?.method_key ?? '')}, '')) LIKE '%bank%'
                OR LOWER(COALESCE(${paymentMethod}, '')) LIKE '%bank transfer%'
              )
              AND LOWER(COALESCE(account_type, '')) = 'bank'
            )
            OR (
              (
                LOWER(COALESCE(${String(selectedPaymentMethod?.method_key ?? '')}, '')) LIKE '%raast%'
                OR LOWER(COALESCE(${paymentMethod}, '')) LIKE '%raast%'
              )
              AND LOWER(COALESCE(account_type, '')) = 'raast'
            )
          )
        ORDER BY is_primary DESC, id ASC
      `;

      if (!configuredAccounts.length) {
        return NextResponse.json(
          { success: false, message: "Is payment method ka verified business account abhi available nahi hai. Cash on Delivery select karein." },
          { status: 409 }
        );
      }

      const requestedAccountId = data.paymentAccountId == null
        ? ""
        : String(data.paymentAccountId).trim();
      if (requestedAccountId && !/^\d+$/.test(requestedAccountId)) {
        return NextResponse.json(
          { success: false, message: "Selected payment account valid nahi." },
          { status: 400 }
        );
      }

      selectedPaymentAccount = requestedAccountId
        ? configuredAccounts.find((account) => String(account.id) === requestedAccountId) ?? null
        : configuredAccounts.length === 1
          ? configuredAccounts[0]
          : null;

      if (!selectedPaymentAccount) {
        return NextResponse.json(
          { success: false, message: "Payment ke liye available business account select karein." },
          { status: 400 }
        );
      }
    }

    if (
      !Array.isArray(data.items) ||
      data.items.length === 0 ||
      data.items.length > 50
    ) {
      return NextResponse.json(
        { success: false, message: "Cart mein valid products nahi hain." },
        { status: 400 }
      );
    }

    const combinedItems = new Map<string, CartItem>();

    for (const item of data.items) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return NextResponse.json(
          { success: false, message: "Cart item valid nahi hai." },
          { status: 400 }
        );
      }

      const cartItem = item as Record<string, unknown>;

      const productId = String(cartItem.productId ?? "");
      const quantity = cartItem.quantity;
      const weight = cartItem.weight;

      if (
        !/^\d+$/.test(productId) ||
        !Number.isSafeInteger(Number(productId)) ||
        Number(productId) <= 0 ||
        typeof quantity !== "number" ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 100 ||
        typeof weight !== "number" ||
        !Number.isFinite(weight) ||
        weight <= 0 ||
        weight > 100
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Product ID, weight ya quantity valid nahi.",
          },
          { status: 400 }
        );
      }

      const id = String(Number(productId));
      const key = `${id}:${weight}`;

      const combinedQuantity =
        (combinedItems.get(key)?.quantity ?? 0) + quantity;

      if (combinedQuantity > 100) {
        return NextResponse.json(
          {
            success: false,
            message: "Product quantity limit se zyada hai.",
          },
          { status: 400 }
        );
      }

      combinedItems.set(key, {
        productId: id,
        weight,
        quantity: combinedQuantity,
      });
    }

    const items = Array.from(combinedItems.values());

    const orderNumber = `MM-${randomUUID()
      .replace(/-/g, "")
      .slice(0, 12)
      .toUpperCase()}`;

    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS packaging_fee numeric(12,2) NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_account_id bigint`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_account_snapshot jsonb`;
    await sql`ALTER TABLE customers ADD COLUMN IF NOT EXISTS email text`;
    await sql`ALTER TABLE customers ADD COLUMN IF NOT EXISTS address text`;
    await sql`ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT NOW()`;

    await sql`
      CREATE TABLE IF NOT EXISTS checkout_settings (
        id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        delivery_fee numeric(12,2) NOT NULL DEFAULT 0
          CHECK (delivery_fee >= 0),
        free_delivery_minimum numeric(12,2) NOT NULL DEFAULT 0
          CHECK (free_delivery_minimum >= 0),
        packaging_fee numeric(12,2) NOT NULL DEFAULT 0
          CHECK (packaging_fee >= 0),
        sales_tax_enabled boolean NOT NULL DEFAULT false,
        sales_tax_rate numeric(6,3) NOT NULL DEFAULT 0
          CHECK (sales_tax_rate >= 0 AND sales_tax_rate <= 100),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await sql`ALTER TABLE checkout_settings ADD COLUMN IF NOT EXISTS packaging_fee numeric(12,2) NOT NULL DEFAULT 0`;

    await sql`
      INSERT INTO checkout_settings (id)
      VALUES (1)
      ON CONFLICT (id) DO NOTHING
    `;

    const requestKey = request.headers.get("Idempotency-Key")?.trim() || randomUUID();
    if (!/^[a-zA-Z0-9_-]{16,100}$/.test(requestKey)) {
      return NextResponse.json(
        { success: false, message: "Order request key valid nahi hai." },
        { status: 400 }
      );
    }

    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS idempotency_key text`;
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS orders_idempotency_key_unique
      ON orders (idempotency_key)
      WHERE idempotency_key IS NOT NULL
    `;

    const result = await sql`
      WITH requested_items AS MATERIALIZED (
        SELECT
          (item->>'productId')::bigint AS product_id,
          (item->>'weight')::numeric AS weight,
          (item->>'quantity')::integer AS quantity
        FROM jsonb_array_elements(
          ${JSON.stringify(items)}::jsonb
        ) AS entry(item)
      ),

      checkout_rules AS MATERIALIZED (
        SELECT
          delivery_fee,
          free_delivery_minimum,
          packaging_fee,
          sales_tax_enabled,
          sales_tax_rate
        FROM checkout_settings
        WHERE id = 1
      ),

      product_prices AS MATERIALIZED (
        SELECT
          p.id AS product_id,
          p.name AS product_name,
          COALESCE(p.price_type, 'per_kg') AS price_type,
          p.price,
          p.stock,
          COALESCE(p.discount, 0) AS discount,
          p.weight_options,
          r.weight,
          r.quantity,
          COALESCE(NULLIF(selected_weight_option.option->>'deliveryFee', '')::numeric, 0) AS unit_delivery_fee,
          COALESCE(NULLIF(selected_weight_option.option->>'packagingFee', '')::numeric, checkout_rules.packaging_fee, 0) AS unit_packaging_fee,
          COALESCE(
            NULLIF(selected_weight_option.option->>'salesTaxRate', '')::numeric,
            CASE WHEN checkout_rules.sales_tax_enabled THEN checkout_rules.sales_tax_rate ELSE 0 END,
            0
          ) AS unit_sales_tax_rate,
          COALESCE(NULLIF(selected_weight_option.option->>'salesTaxBase', ''), 'product') AS unit_sales_tax_base,
          COALESCE(NULLIF(selected_weight_option.option->>'packagingType', ''), '') AS unit_packaging_type,

          selected_weight_option.option AS selected_weight_option

        FROM requested_items r
        CROSS JOIN checkout_rules
        INNER JOIN products p
          ON p.id = r.product_id
        LEFT JOIN LATERAL (
          SELECT option_item.option
          FROM jsonb_array_elements(
            CASE WHEN jsonb_typeof(p.weight_options) = 'array' THEN p.weight_options ELSE '[]'::jsonb END
          ) AS option_item(option)
          CROSS JOIN LATERAL (
            SELECT regexp_replace(lower(trim(option_item.option->>'weight')), '\\s+', '', 'g') AS normalized_weight
          ) normalized
          WHERE CASE
            WHEN normalized.normalized_weight ~ '^[0-9]+(\\.[0-9]+)?$' THEN normalized.normalized_weight::numeric
            WHEN normalized.normalized_weight ~ '^[0-9]+(\\.[0-9]+)?kg$' THEN regexp_replace(normalized.normalized_weight, 'kg$', '')::numeric
            WHEN normalized.normalized_weight ~ '^[0-9]+(\\.[0-9]+)?g$' THEN regexp_replace(normalized.normalized_weight, 'g$', '')::numeric / 1000
            ELSE NULL
          END = r.weight
          AND (option_item.option->>'price') ~ '^[0-9]+(\\.[0-9]+)?$'
          LIMIT 1
        ) selected_weight_option ON true
        WHERE p.is_active = true
        FOR UPDATE OF p
      ),

      valid_products AS MATERIALIZED (
        SELECT
          product_id,
          product_name,
          weight,
          quantity,

          ROUND((CASE WHEN price_type = 'fixed' THEN (selected_weight_option->>'price')::numeric ELSE price * weight END) * (1 - discount / 100), 2) AS unit_price,
          unit_delivery_fee,
          unit_packaging_fee,
          unit_sales_tax_rate,
          unit_sales_tax_base,
          unit_packaging_type,
          ROUND((CASE WHEN unit_sales_tax_base = 'all_charges' THEN (ROUND((CASE WHEN price_type = 'fixed' THEN (selected_weight_option->>'price')::numeric ELSE price * weight END) * (1 - discount / 100), 2) + unit_delivery_fee + unit_packaging_fee) ELSE ROUND((CASE WHEN price_type = 'fixed' THEN (selected_weight_option->>'price')::numeric ELSE price * weight END) * (1 - discount / 100), 2) END) * unit_sales_tax_rate / 100, 2) AS unit_tax_amount,
          ROUND((ROUND((CASE WHEN price_type = 'fixed' THEN (selected_weight_option->>'price')::numeric ELSE price * weight END) * (1 - discount / 100), 2) + unit_delivery_fee + unit_packaging_fee + ROUND((CASE WHEN unit_sales_tax_base = 'all_charges' THEN (ROUND((CASE WHEN price_type = 'fixed' THEN (selected_weight_option->>'price')::numeric ELSE price * weight END) * (1 - discount / 100), 2) + unit_delivery_fee + unit_packaging_fee) ELSE ROUND((CASE WHEN price_type = 'fixed' THEN (selected_weight_option->>'price')::numeric ELSE price * weight END) * (1 - discount / 100), 2) END) * unit_sales_tax_rate / 100, 2)) * quantity, 2) AS line_total

        FROM product_prices
        WHERE
          price >= 0
          AND discount >= 0
          AND discount <= 100
          AND (
            price_type <> 'fixed'
            OR (selected_weight_option->>'price')::numeric IS NOT NULL
          )
          AND (
            price_type = 'fixed'
            OR price_type = 'per_kg'
          )
          AND stock >= (
            SELECT COALESCE(SUM(requested.quantity), 0)
            FROM requested_items requested
            WHERE requested.product_id = product_prices.product_id
          )
      ),

      totals AS (
        SELECT
          (SELECT COUNT(*)::integer FROM requested_items) AS requested_count,
          (SELECT COUNT(*)::integer FROM valid_products) AS valid_count,
          COALESCE((SELECT SUM(unit_price * quantity) FROM valid_products), 0) AS subtotal,
          COALESCE((SELECT SUM(unit_delivery_fee * quantity) FROM valid_products), 0) AS delivery_fee,
          COALESCE((SELECT SUM(unit_packaging_fee * quantity) FROM valid_products), 0) AS packaging_fee,
          COALESCE((SELECT SUM(unit_tax_amount * quantity) FROM valid_products), 0) AS tax_amount
      ),

      calculated AS (
        SELECT
          totals.*,
          CASE
            WHEN checkout_rules.free_delivery_minimum > 0
              AND totals.subtotal >= checkout_rules.free_delivery_minimum
            THEN 0
            WHEN totals.delivery_fee > 0 THEN totals.delivery_fee
            ELSE checkout_rules.delivery_fee
          END AS final_delivery_fee,
          totals.packaging_fee AS final_packaging_fee
        FROM totals
        CROSS JOIN checkout_rules
      ),

      matching_customer AS MATERIALIZED (
        SELECT id
        FROM customers
        WHERE phone = ${phone}
        ORDER BY id
        LIMIT 1
      ),

      existing_customer AS (
        UPDATE customers customer
        SET name = ${customerName},
            email = COALESCE(NULLIF(${email}, ''), email),
            address = ${address},
            updated_at = NOW()
        FROM matching_customer matched
        WHERE customer.id = matched.id
        RETURNING customer.id AS id
      ),

      new_customer AS (
        INSERT INTO customers (name, email, phone, address, updated_at)
        SELECT ${customerName}, NULLIF(${email}, ''), ${phone}, ${address}, NOW()
        FROM calculated t
        WHERE
          t.requested_count > 0
          AND t.requested_count = t.valid_count
          AND NOT EXISTS (
            SELECT 1 FROM existing_customer
          )
        RETURNING id
      ),

      resolved_customer AS (
        SELECT id FROM existing_customer

        UNION ALL

        SELECT id FROM new_customer

        LIMIT 1
      ),

      new_order AS (
        INSERT INTO orders (
          order_number,
          idempotency_key,
          customer_id,
          customer_name,
          customer_phone,
          delivery_address,
          status,
          payment_method,
          payment_status,
          payment_account_id,
          payment_account_snapshot,
          subtotal,
          delivery_fee,
          tax_amount,
          packaging_fee,
          total
        )

        SELECT
          ${orderNumber},
          ${requestKey},
          c.id,
          ${customerName},
          ${phone},
          ${address},
          'pending',
          ${paymentMethod},
          'pending',
          ${selectedPaymentAccount ? Number(selectedPaymentAccount.id) : null},
          ${selectedPaymentAccount ? JSON.stringify({
            id: selectedPaymentAccount.id,
            accountName: selectedPaymentAccount.account_name,
            accountType: selectedPaymentAccount.account_type,
            provider: selectedPaymentAccount.provider,
            accountTitle: selectedPaymentAccount.account_title,
            accountNumber: selectedPaymentAccount.account_number,
            iban: selectedPaymentAccount.iban,
            currency: selectedPaymentAccount.currency,
            qrImageUrl: selectedPaymentAccount.qr_image_url,
            appLink: selectedPaymentAccount.app_link,
          }) : null}::jsonb,
          t.subtotal,
          t.final_delivery_fee,
          t.tax_amount,
          t.final_packaging_fee,
          t.subtotal + t.final_delivery_fee + t.final_packaging_fee + t.tax_amount

        FROM resolved_customer c
        CROSS JOIN calculated t

        WHERE
          t.requested_count > 0
          AND t.requested_count = t.valid_count
          AND NOT EXISTS (
            SELECT 1 FROM orders existing
            WHERE existing.idempotency_key = ${requestKey}
          )

        ON CONFLICT (idempotency_key) WHERE idempotency_key IS NOT NULL
        DO NOTHING

        RETURNING
          id,
          order_number,
          subtotal,
          delivery_fee,
          tax_amount,
          total
      ),

      reserved_products AS MATERIALIZED (
        UPDATE products product
        SET stock = product.stock - reservation.quantity,
            updated_at = NOW()
        FROM (
          SELECT product_id, SUM(quantity)::integer AS quantity
          FROM valid_products
          GROUP BY product_id
        ) reservation
        WHERE product.id = reservation.product_id
          AND EXISTS (SELECT 1 FROM new_order)
        RETURNING product.id
      ),

      inserted_items AS (
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          quantity,
          weight,
          unit_price,
          line_total,
          delivery_fee,
          packaging_fee,
          tax_amount,
          sales_tax_rate,
          packaging_type,
          sales_tax_base
        )

        SELECT
          o.id,
          p.product_id,
          p.product_name,
          p.quantity,
          p.weight,
          p.unit_price,
          p.line_total,
          p.unit_delivery_fee * p.quantity,
          p.unit_packaging_fee * p.quantity,
          p.unit_tax_amount * p.quantity,
          p.unit_sales_tax_rate,
          p.unit_packaging_type,
          p.unit_sales_tax_base

        FROM new_order o
        CROSS JOIN valid_products p
        WHERE (SELECT COUNT(*) FROM reserved_products) = (
          SELECT COUNT(DISTINCT product_id) FROM valid_products
        )

        RETURNING order_id
      )

      SELECT
        o.id AS order_id,
        o.order_number,
        o.subtotal,
        o.delivery_fee,
        o.tax_amount,
        o.packaging_fee,
        o.total,
        t.requested_count,
        t.valid_count,
        (SELECT COUNT(*) FROM inserted_items) AS saved_item_count,
        (SELECT COUNT(*) FROM reserved_products) AS reserved_product_count

      FROM calculated t
      LEFT JOIN new_order o ON true
    `;

    const saved = result[0] as
      | {
          order_id: number | string | null;
          order_number: string | null;
          subtotal: number | string;
          delivery_fee: number | string;
          tax_amount: number | string;
          packaging_fee: number | string;
          total: number | string;
          requested_count: number;
          valid_count: number;
          saved_item_count: number;
          reserved_product_count: number;
        }
      | undefined;

    if (saved?.order_id == null) {
      const existing = await sql`
        SELECT order_number, subtotal, delivery_fee, tax_amount, packaging_fee, total,
               payment_status, payment_reference
        FROM orders
        WHERE idempotency_key = ${requestKey}
        LIMIT 1
      `;
      if (existing.length) {
        const previous = existing[0] as Record<string, unknown>;
        const existingOrder = {
          orderNumber: String(previous.order_number),
          subtotal: Number(previous.subtotal),
          deliveryFee: Number(previous.delivery_fee),
          taxAmount: Number(previous.tax_amount),
          packagingFee: Number(previous.packaging_fee),
          total: Number(previous.total),
          paymentStatus: String(previous.payment_status ?? "pending"),
          paymentReference: previous.payment_reference
            ? String(previous.payment_reference)
            : null,
        };
        return NextResponse.json({
          success: true,
          message: "Order pehle hi receive ho chuka hai.",
          order: existingOrder,
          ...existingOrder,
          duplicate: true,
        });
      }
    }

    if (
      !saved ||
      saved.order_id == null ||
      Number(saved.requested_count) !== Number(saved.valid_count) ||
      Number(saved.saved_item_count) !== Number(saved.valid_count) ||
      Number(saved.reserved_product_count) !== new Set(items.map((item) => item.productId)).size
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cart ke kuch products ya selected weight options available nahi hain. Page refresh karke dobara try karein.",
        },
        { status: 400 }
      );
    }

    const order = {
      orderNumber: saved.order_number,
      subtotal: Number(saved.subtotal),
      deliveryFee: Number(saved.delivery_fee),
      taxAmount: Number(saved.tax_amount),
      packagingFee: Number(saved.packaging_fee),
      total: Number(saved.total),
      paymentStatus: "pending",
    };

    return NextResponse.json(
      {
        success: true,
        message: "Order successfully save ho gaya.",

        // Nested response for existing integrations.
        order,

        // Top-level fields for customer checkout compatibility.
        ...order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Customer order save failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Order save nahi ho saka. Dobara try karein.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json(
      { success: false, message: "Admin login required" },
      { status: 401 }
    );
  }

  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const orderNumber =
      typeof data.orderNumber === "string"
        ? data.orderNumber.trim()
        : "";

    const hasStatus = typeof data.status === "string";
    const hasPaymentStatus =
      typeof data.paymentStatus === "string";

    const status = hasStatus
      ? (data.status as string).trim().toLowerCase()
      : "";

    const paymentStatus = hasPaymentStatus
      ? (data.paymentStatus as string).trim().toLowerCase()
      : "";

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "out_for_delivery",
      "completed",
      "cancelled",
    ];

    const validPaymentStatuses = [
      "pending",
      "paid",
      "failed",
      "cancelled",
      "refunded",
      "partially refunded",
      "partially_refunded",
    ];

    if (
      !orderNumber ||
      (!hasStatus && !hasPaymentStatus) ||
      (hasStatus && !validStatuses.includes(status)) ||
      (hasPaymentStatus &&
        !validPaymentStatuses.includes(paymentStatus))
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Order number ya status valid nahi.",
        },
        { status: 400 }
      );
    }

    const normalizedPaymentStatus =
      paymentStatus === "partially refunded"
        ? "partially_refunded"
        : paymentStatus;

    const paymentReference =
      typeof data.paymentReference === "string"
        ? data.paymentReference.trim()
        : "";

    if (hasStatus && status !== "cancelled") {
      const currentOrder = await sql`
        SELECT status
        FROM orders
        WHERE order_number = ${orderNumber}
        LIMIT 1
      `;
      if (String(currentOrder[0]?.status ?? "").toLowerCase() === "cancelled") {
        return NextResponse.json(
          { success: false, message: "Cancelled order ko dobara active karne se pehle naya stock reservation process zaroori hai." },
          { status: 409 }
        );
      }
    }

    if (paymentReference.length > 120) {
      return NextResponse.json(
        { success: false, message: "Payment reference 120 characters se kam rakhein." },
        { status: 400 }
      );
    }

    if (
      hasPaymentStatus &&
      ["refunded", "partially_refunded"].includes(normalizedPaymentStatus)
    ) {
      return NextResponse.json(
        { success: false, message: "Refund status sirf Admin Refund Requests workflow se update karein, jahan approved amount aur actual transfer reference audit hota hai." },
        { status: 409 }
      );
    }

    if (hasPaymentStatus && normalizedPaymentStatus === "paid") {
      const [currentPaymentOrder] = await sql`
        SELECT payment_method, status
        FROM orders
        WHERE order_number = ${orderNumber}
        LIMIT 1
      `;

      if (!currentPaymentOrder) {
        return NextResponse.json(
          { success: false, message: "Order nahi mila." },
          { status: 404 }
        );
      }

      const isCodOrder = /cash on delivery|\bcod\b/i.test(String(currentPaymentOrder.payment_method ?? ""));
      if (isCodOrder && String(currentPaymentOrder.status ?? "").toLowerCase() !== "completed") {
        return NextResponse.json(
          { success: false, message: "COD payment sirf delivery complete hone aur cash receive karne ke baad Paid mark karein." },
          { status: 409 }
        );
      }

      if (!isCodOrder && !paymentReference) {
        return NextResponse.json(
          { success: false, message: "Manual transfer ko Paid mark karne ke liye verified transaction reference required hai." },
          { status: 400 }
        );
      }
    }

    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference text`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_verified_at timestamptz`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS stock_restocked_at timestamptz`;
    await sql`
      CREATE TABLE IF NOT EXISTS payment_status_events (
        id bigserial PRIMARY KEY,
        order_number text NOT NULL,
        previous_status text,
        new_status text NOT NULL,
        payment_reference text,
        changed_by text NOT NULL DEFAULT 'admin',
        created_at timestamptz NOT NULL DEFAULT NOW()
      )
    `;

    const result = await sql`
      WITH prior_order AS MATERIALIZED (
        SELECT id, payment_status, status, payment_method, stock_restocked_at
        FROM orders
        WHERE order_number = ${orderNumber}
        FOR UPDATE
      ),
      updated_order AS (
        UPDATE orders current_order
        SET
          status = CASE
            WHEN ${hasStatus} THEN ${status}
            ELSE current_order.status
          END,
          stock_restocked_at = CASE
            WHEN ${hasStatus}
              AND ${status} = 'cancelled'
              AND previous.status <> 'cancelled'
              AND previous.stock_restocked_at IS NULL
            THEN NOW()
            ELSE current_order.stock_restocked_at
          END,
          payment_status = CASE
            WHEN ${hasPaymentStatus} THEN ${normalizedPaymentStatus}
            ELSE current_order.payment_status
          END,
          payment_reference = CASE
            WHEN ${hasPaymentStatus} AND ${paymentReference} <> ''
            THEN ${paymentReference}
            ELSE current_order.payment_reference
          END,
          payment_verified_at = CASE
            WHEN ${hasPaymentStatus} AND ${normalizedPaymentStatus} = 'paid'
            THEN NOW()
            WHEN ${hasPaymentStatus}
            THEN NULL
            ELSE current_order.payment_verified_at
          END
        FROM prior_order previous
        WHERE current_order.id = previous.id
          AND (
            NOT ${hasPaymentStatus}
            OR ${normalizedPaymentStatus} <> 'paid'
            OR (
              (
                regexp_replace(
                  lower(COALESCE(previous.payment_method, '')),
                  '[^a-z0-9]',
                  '',
                  'g'
                ) IN ('cashondelivery', 'cod')
                AND previous.status = 'completed'
              )
              OR (
                regexp_replace(
                  lower(COALESCE(previous.payment_method, '')),
                  '[^a-z0-9]',
                  '',
                  'g'
                ) NOT IN ('cashondelivery', 'cod')
                AND ${paymentReference} <> ''
              )
            )
          )
        RETURNING
          current_order.order_number,
          current_order.status,
          current_order.payment_status,
          current_order.payment_reference,
          previous.payment_status AS previous_payment_status,
          previous.status AS previous_order_status,
          previous.stock_restocked_at AS previous_stock_restocked_at
      ),
      restocked_products AS (
        UPDATE products product
        SET stock = product.stock + restock.quantity,
            updated_at = NOW()
        FROM (
          SELECT
            item.product_id,
            SUM(item.quantity)::integer AS quantity
          FROM order_items item
          INNER JOIN updated_order changed
            ON changed.order_number = ${orderNumber}
          WHERE changed.status = 'cancelled'
            AND changed.previous_order_status <> 'cancelled'
            AND changed.previous_stock_restocked_at IS NULL
          GROUP BY item.product_id
        ) restock
        WHERE product.id = restock.product_id
        RETURNING product.id
      ),
      payment_audit AS (
        INSERT INTO payment_status_events (
          order_number, previous_status, new_status, payment_reference
        )
        SELECT
          order_number,
          previous_payment_status,
          payment_status,
          payment_reference
        FROM updated_order
        WHERE ${hasPaymentStatus}
          AND previous_payment_status IS DISTINCT FROM payment_status
        RETURNING id
      )
      SELECT
        order_number, status, payment_status, payment_reference,
        (SELECT COUNT(*) FROM restocked_products) AS restocked_product_count
      FROM updated_order
    `;

    if (result.length === 0) {
      const currentOrder = await sql`
        SELECT status, payment_method
        FROM orders
        WHERE order_number = ${orderNumber}
        LIMIT 1
      `;

      if (!currentOrder.length) {
        return NextResponse.json(
          { success: false, message: "Order nahi mila." },
          { status: 404 }
        );
      }

      if (hasPaymentStatus && normalizedPaymentStatus === "paid") {
        const method = String(currentOrder[0].payment_method ?? "")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        const isCashOnDelivery =
          method === "cashondelivery" || method === "cod";

        if (isCashOnDelivery && String(currentOrder[0].status).toLowerCase() !== "completed") {
          return NextResponse.json(
            { success: false, message: "COD payment ko Paid sirf delivery complete hone ke baad mark kar sakte hain." },
            { status: 409 }
          );
        }

        if (!isCashOnDelivery && !paymentReference) {
          return NextResponse.json(
            { success: false, message: "Paid mark karne se pehle verified bank/wallet transaction reference zaroori hai." },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { success: false, message: "Order update nahi ho saka. Refresh karke dobara try karein." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      order: result[0],
    });
  } catch (error) {
    console.error("Order status update failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Status update nahi ho saka.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json(
      { success: false, message: "Admin login required" },
      { status: 401 }
    );
  }

  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const deleteData = body as Record<string, unknown>;
    const orderNumber =
      typeof deleteData.orderNumber === "string"
        ? deleteData.orderNumber.trim()
        : "";
    const action = deleteData.action === "permanent_delete"
      ? "permanent_delete"
      : "archive";

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: "Order number required." },
        { status: 400 }
      );
    }

    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS archived_at timestamptz`;

    if (action === "permanent_delete") {
      const [target] = await sql`
        SELECT id, archived_at, payment_status
        FROM orders
        WHERE order_number = ${orderNumber}
        LIMIT 1
        FOR UPDATE
      `;

      if (!target) {
        return NextResponse.json(
          { success: false, message: "Order nahi mila." },
          { status: 404 }
        );
      }

      if (!target.archived_at) {
        return NextResponse.json(
          { success: false, message: "Pehle order ko Previous Orders mein archive karein." },
          { status: 409 }
        );
      }

      const paymentStatus = String(target.payment_status ?? "").toLowerCase();
      if (["paid", "refunded", "partially_refunded"].includes(paymentStatus)) {
        return NextResponse.json(
          { success: false, message: "Paid, refunded ya partially refunded order ko accounting record ki hifazat ke liye permanently delete nahi kar sakte." },
          { status: 409 }
        );
      }

      await sql`DELETE FROM payment_status_events WHERE order_number = ${orderNumber}`;
      await sql`DELETE FROM order_items WHERE order_id = ${target.id}`;
      const removed = await sql`
        DELETE FROM orders
        WHERE id = ${target.id} AND archived_at IS NOT NULL
        RETURNING order_number
      `;

      if (!removed.length) {
        return NextResponse.json(
          { success: false, message: "Order delete nahi ho saka." },
          { status: 409 }
        );
      }

      return NextResponse.json({
        success: true,
        permanentlyDeleted: true,
        message: "Archived unpaid order permanently delete ho gaya.",
        orderNumber,
      });
    }

    const result = await sql`
      UPDATE orders
      SET archived_at = NOW()
      WHERE order_number = ${orderNumber}
        AND archived_at IS NULL
      RETURNING order_number
    `;

    if (!result.length) {
      return NextResponse.json(
        { success: false, message: "Order nahi mila ya pehle hi archive ho chuka hai." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order archive ho gaya. Record history mein محفوظ rahega.",
      orderNumber,
    });
  } catch (error) {
    console.error("Order delete failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Order delete nahi ho saka.",
      },
      { status: 500 }
    );
  }
}
