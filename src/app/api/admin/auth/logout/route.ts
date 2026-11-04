import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Admin session ended." });
  response.cookies.set({
    name: "mm_admin_session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
