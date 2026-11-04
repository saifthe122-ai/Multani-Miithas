import { NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { createAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MINUTES = 15;
const MAX_FAILED_ATTEMPTS = 5;

function getClientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwarded || realIp || "unknown";
}

function hashAddress(address: string) {
  return createHash("sha256").update(address).digest("hex");
}

async function checkLoginLimit(request: Request) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured");
  const sql = neon(connectionString);
  await sql`CREATE TABLE IF NOT EXISTS admin_login_attempts (
    id bigserial PRIMARY KEY,
    address_hash char(64) NOT NULL,
    attempted_at timestamptz NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS admin_login_attempts_address_time_idx
    ON admin_login_attempts (address_hash, attempted_at DESC)`;
  const addressHash = hashAddress(getClientAddress(request));
  const rows = await sql`SELECT COUNT(*)::integer AS attempts
    FROM admin_login_attempts
    WHERE address_hash = ${addressHash}
      AND attempted_at > NOW() - INTERVAL '15 minutes'`;
  return { sql, addressHash, attempts: Number(rows[0]?.attempts ?? 0) };
}

function passwordMatches(submittedPassword: string, expectedPassword: string) {
  const submitted = Buffer.from(submittedPassword, "utf8");
  const expected = Buffer.from(expectedPassword, "utf8");
  return submitted.length === expected.length && timingSafeEqual(submitted, expected);
}

export async function POST(request: Request) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || adminPassword.length < 16) {
      console.error("ADMIN_PASSWORD must be configured with at least 16 characters");
      return NextResponse.json(
        { success: false, message: "Admin login is not securely configured" },
        { status: 500 }
      );
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    const password = (body as Record<string, unknown>).password;
    if (typeof password !== "string" || password.length > 500) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    const limit = await checkLoginLimit(request);
    if (limit.attempts >= MAX_FAILED_ATTEMPTS) {
      return NextResponse.json(
        { success: false, message: "Too many failed attempts. 15 minutes baad dobara try karein." },
        { status: 429, headers: { "Retry-After": String(WINDOW_MINUTES * 60) } }
      );
    }

    if (!passwordMatches(password, adminPassword)) {
      await limit.sql`INSERT INTO admin_login_attempts (address_hash) VALUES (${limit.addressHash})`;
      const recent = await limit.sql`SELECT COUNT(*)::integer AS attempts
        FROM admin_login_attempts
        WHERE address_hash = ${limit.addressHash}
          AND attempted_at > NOW() - INTERVAL '15 minutes'`;
      const attempts = Number(recent[0]?.attempts ?? 0);
      return NextResponse.json(
        {
          success: false,
          message: attempts >= MAX_FAILED_ATTEMPTS
            ? "Too many failed attempts. 15 minutes baad dobara try karein."
            : "Incorrect password",
        },
        attempts >= MAX_FAILED_ATTEMPTS
          ? { status: 429, headers: { "Retry-After": String(WINDOW_MINUTES * 60) } }
          : { status: 401 }
      );
    }

    await limit.sql`DELETE FROM admin_login_attempts WHERE address_hash = ${limit.addressHash}`;
    await limit.sql`DELETE FROM admin_login_attempts WHERE attempted_at < NOW() - INTERVAL '1 day'`;

    const session = createAdminSession();
    const response = NextResponse.json({
      success: true,
      message: "Admin login successful",
    });

    response.cookies.set({
      name: session.cookieName,
      value: session.cookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: session.maxAge,
    });

    return response;
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to log in securely. Please try again later." },
      { status: 503 }
    );
  }
}
