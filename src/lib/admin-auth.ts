import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "mm_admin_session";
const SESSION_MAX_AGE = 8 * 60 * 60;

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to at least 32 characters"
    );
  }

  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret())
    .update(value)
    .digest("hex");
}

export function createAdminSession(): {
  cookieName: string;
  cookieValue: string;
  maxAge: number;
} {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const cookieValue = `${timestamp}.${sign(timestamp)}`;

  return {
    cookieName: COOKIE_NAME,
    cookieValue,
    maxAge: SESSION_MAX_AGE,
  };
}

export function isAdminRequest(request: Request): boolean {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";

    const cookie = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${COOKIE_NAME}=`));

    if (!cookie) return false;

    const value = decodeURIComponent(
      cookie.slice(COOKIE_NAME.length + 1)
    );

    const separator = value.indexOf(".");

    if (separator < 1) return false;

    const timestamp = value.slice(0, separator);
    const suppliedSignature = value.slice(separator + 1);

    if (!/^\d{10}$/.test(timestamp)) return false;
    if (!/^[a-f0-9]{64}$/.test(suppliedSignature)) return false;

    const issuedAt = Number(timestamp);
    const now = Math.floor(Date.now() / 1000);

    if (
      issuedAt > now + 60 ||
      now - issuedAt > SESSION_MAX_AGE
    ) {
      return false;
    }

    const expectedSignature = sign(timestamp);

    return timingSafeEqual(
      Buffer.from(suppliedSignature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
}