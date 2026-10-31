
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

function jsonError(message: string, status = 400) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

async function requireAdmin(request: Request) {
  return await isAdminRequest(request);
}

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) {
    return jsonError("Admin login required", 401);
  }

  try {
    const [methods, accounts, gateways] = await Promise.all([
      sql`
        SELECT *
        FROM payment_methods
        ORDER BY display_order ASC, id ASC
      `,
      sql`
     SELECT
  id, account_name, account_type, provider,
  account_title, account_number, iban,
  currency, is_primary, is_active,
  wallet_owner_type, qr_image_url, app_link,
  created_at, updated_at
FROM business_payment_accounts
ORDER BY is_primary DESC, id ASC
      `,
      sql`
        SELECT
          id, provider, environment, is_connected,
          public_config, created_at, updated_at
        FROM payment_gateway_configs
        ORDER BY provider ASC
      `,
    ]);

    return NextResponse.json({
      success: true,
      methods,
      accounts,
      gateways,
      databaseConnected: true,
    });
  } catch (error) {
    console.error("Payment settings load failed:", error);
    return jsonError("Payment settings load nahi ho sakin.", 500);
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin(request))) {
    return jsonError("Admin login required", 401);
  }

  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonError("Invalid request body.");
    }

    const data = body as Record<string, unknown>;
    const action = data.action;

    if (action === "create_method") {
      const methodKey =
        typeof data.methodKey === "string"
          ? data.methodKey.trim().toLowerCase()
          : "";

      const name =
        typeof data.name === "string" ? data.name.trim() : "";

      const description =
        typeof data.description === "string"
          ? data.description.trim()
          : "";

      const paymentType =
        typeof data.paymentType === "string"
          ? data.paymentType
          : "manual";

      const provider =
        typeof data.provider === "string"
          ? data.provider.trim()
          : null;

      const instructions =
        typeof data.instructions === "string"
          ? data.instructions.trim()
          : "";

      const displayOrder =
        typeof data.displayOrder === "number" &&
        Number.isSafeInteger(data.displayOrder)
          ? data.displayOrder
          : 0;

      if (!/^[a-z0-9_-]{2,60}$/.test(methodKey)) {
        return jsonError("Method key valid nahi hai.");
      }

      if (!name || name.length > 100) {
        return jsonError("Payment method ka naam required hai.");
      }

      if (!["manual", "gateway", "manual_gateway"].includes(paymentType)) {
        return jsonError("Payment type valid nahi hai.");
      }

      const result = await sql`
        INSERT INTO payment_methods (
          method_key, name, description, payment_type,
          provider, is_enabled, instructions, display_order
        )
        VALUES (
          ${methodKey}, ${name}, ${description}, ${paymentType},
          ${provider}, false, ${instructions}, ${displayOrder}
        )
        RETURNING *
      `;

      return NextResponse.json({
        success: true,
        message: "Payment method add ho gaya.",
        method: result[0],
      });
    }

    if (action === "create_account") {
      const accountName =
        typeof data.accountName === "string"
          ? data.accountName.trim()
          : "";

      const accountType =
        typeof data.accountType === "string"
          ? data.accountType.trim().toLowerCase()
          : "";

      const walletOwnerType =
        typeof data.walletOwnerType === "string"
          ? data.walletOwnerType.trim().toLowerCase()
          : "personal";

      const qrImageUrl =
        typeof data.qrImageUrl === "string"
          ? data.qrImageUrl.trim()
          : "";

      const appLink =
  typeof data.appLink === "string"
    ? data.appLink.trim()
    : "";

if (appLink) {
  try {
    const parsedAppLink = new URL(appLink);

    if (parsedAppLink.protocol !== "https:") {
      return NextResponse.json(
        { error: "Payment app link must use HTTPS." },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Please enter a valid payment app link." },
      { status: 400 }
    );
  }
}
      
      const provider =
        typeof data.provider === "string"
          ? data.provider.trim()
          : null;

      const accountTitle =
        typeof data.accountTitle === "string"
          ? data.accountTitle.trim()
          : "";

      const accountNumber =
        typeof data.accountNumber === "string"
          ? data.accountNumber.trim()
          : "";

      const iban =
        typeof data.iban === "string"
          ? data.iban.trim()
          : "";

      const currency =
        typeof data.currency === "string"
          ? data.currency.trim().toUpperCase()
          : "PKR";

      if (!accountName || accountName.length > 100) {
        return jsonError("Account name required hai.");
      }

      if (!accountTitle || accountTitle.length > 150) {
        return jsonError("Account title required hai.");
      }

      if (!accountNumber && !iban) {
        return jsonError("Account number ya IBAN zaroori hai.");
      }

      if (accountNumber.length > 50 || iban.length > 50) {
        return jsonError("Account details ki length valid nahi hai.");
      }

      if (!["bank", "wallet", "raast", "other"].includes(accountType)) {
        return jsonError("Account type valid nahi hai.");
      }

      if (!["personal", "merchant"].includes(walletOwnerType)) {
        return jsonError("Wallet owner type valid nahi hai.");
      }

      if (qrImageUrl.length > 2000) {
        return jsonError("QR image URL bohat lamba hai.");
      }

      if (!/^[A-Z]{3}$/.test(currency)) {
        return jsonError("Currency code valid nahi hai.");
      }

      const makePrimary = data.isPrimary === true;

      if (makePrimary) {
        await sql`
          UPDATE business_payment_accounts
          SET is_primary = false, updated_at = NOW()
        `;
      }

      const result = await sql`
 INSERT INTO business_payment_accounts (
  account_name, account_type, provider,
  account_title, account_number, iban,
  currency, wallet_owner_type, qr_image_url, app_link,
  is_primary, is_active
)
      VALUES (
  ${accountName}, ${accountType}, ${provider},
  ${accountTitle}, ${accountNumber}, ${iban},
  ${currency}, ${walletOwnerType}, ${qrImageUrl}, ${appLink},
  ${makePrimary}, true
)
        RETURNING *
      `;

      return NextResponse.json({
        success: true,
        message: "Business account add ho gaya.",
        account: result[0],
      });
    }

    return jsonError("Action valid nahi hai.");
  } catch (error) {
    console.error("Payment settings save failed:", error);

    return jsonError(
      "Payment settings save nahi ho sakin. Duplicate method key bhi check karein.",
      500
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin(request))) {
    return jsonError("Admin login required", 401);
  }

  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonError("Invalid request body.");
    }

    const data = body as Record<string, unknown>;
    const action = data.action;

    if (action === "update_method") {
      const id = Number(data.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        return jsonError("Payment method ID valid nahi.");
      }

      const name =
        typeof data.name === "string" ? data.name.trim() : null;

      const description =
        typeof data.description === "string"
          ? data.description.trim()
          : null;

      const instructions =
        typeof data.instructions === "string"
          ? data.instructions.trim()
          : null;

      const isEnabled =
        typeof data.isEnabled === "boolean"
          ? data.isEnabled
          : null;

      const displayOrder =
        typeof data.displayOrder === "number" &&
        Number.isSafeInteger(data.displayOrder)
          ? data.displayOrder
          : null;

      const result = await sql`
        UPDATE payment_methods
        SET
          name = COALESCE(${name}, name),
          description = COALESCE(${description}, description),
          instructions = COALESCE(${instructions}, instructions),
          is_enabled = COALESCE(${isEnabled}, is_enabled),
          display_order = COALESCE(${displayOrder}, display_order),
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      if (!result.length) {
        return jsonError("Payment method nahi mila.", 404);
      }

      return NextResponse.json({
        success: true,
        method: result[0],
      });
    }

    if (action === "update_account") {
      const id = Number(data.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        return jsonError("Account ID valid nahi.");
      }

      const isActive =
        typeof data.isActive === "boolean"
          ? data.isActive
          : null;

      const makePrimary = data.isPrimary === true;

      const appLinkProvided = typeof data.appLink === "string";
const appLink = appLinkProvided ? data.appLink.trim() : null;

if (appLink) {
  try {
    const parsedAppLink = new URL(appLink);

    if (parsedAppLink.protocol !== "https:") {
      return jsonError("Payment app link must use HTTPS.");
    }
  } catch {
    return jsonError("Please enter a valid payment app link.");
  }
}
      
      if (makePrimary) {
        await sql`
          UPDATE business_payment_accounts
          SET is_primary = false, updated_at = NOW()
        `;
      }

      const result = await sql`
        UPDATE business_payment_accounts
       SET
  is_active = COALESCE(${isActive}, is_active),
  is_primary = CASE
    WHEN ${makePrimary} THEN true
    ELSE is_primary
  END,
  app_link = CASE
    WHEN ${appLinkProvided} THEN ${appLink}
    ELSE app_link
  END,
  updated_at = NOW()
  
        WHERE id = ${id}
        RETURNING *
      `;

      if (!result.length) {
        return jsonError("Business account nahi mila.", 404);
      }

      return NextResponse.json({
        success: true,
        account: result[0],
      });
    }

    return jsonError("Action valid nahi hai.");
  } catch (error) {
    console.error("Payment settings update failed:", error);
    return jsonError("Payment settings update nahi ho sakin.", 500);
  }
}
