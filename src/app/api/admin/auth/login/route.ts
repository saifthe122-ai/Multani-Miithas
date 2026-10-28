
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD is not configured");

      return NextResponse.json(
        { success: false, message: "Admin login is not configured" },
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

    const submitted = Buffer.from(password, "utf8");
    const expected = Buffer.from(adminPassword, "utf8");

    const passwordMatches =
      submitted.length === expected.length &&
      timingSafeEqual(submitted, expected);

    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

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
      { success: false, message: "Unable to log in" },
      { status: 500 }
    );
  }
}
