import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONFIG_PATH = "multani-mithas/site-media.json";
const MAX_CONFIG_SIZE = 100 * 1024;

function isAuthorized(request: Request): boolean {
  return isAdminRequest(request);
}

// Customer website reads the published settings here.
export async function GET() {
  try {
    const result = await list({
      prefix: CONFIG_PATH,
      limit: 10,
    });

    const configBlob = result.blobs.find(
      (blob) => blob.pathname === CONFIG_PATH
    );

    if (!configBlob) {
      return NextResponse.json({
        success: true,
        settings: null,
      });
    }

    const response = await fetch(configBlob.url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Could not read published media settings.");
    }

    const settings = await response.json();

    return NextResponse.json(
      { success: true, settings },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Could not load published media settings." },
      { status: 500 }
    );
  }
}

// Admin publishes settings here.
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Admin login required. Please log in again." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const settings = body?.settings;

    if (
      !settings ||
      typeof settings !== "object" ||
      Array.isArray(settings)
    ) {
      return NextResponse.json(
        { error: "Valid settings are required." },
        { status: 400 }
      );
    }

    const json = JSON.stringify(settings);

    if (new TextEncoder().encode(json).length > MAX_CONFIG_SIZE) {
      return NextResponse.json(
        { error: "Settings are too large." },
        { status: 413 }
      );
    }

    const blob = await put(CONFIG_PATH, json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });

    return NextResponse.json({
      success: true,
      message: "Media settings published.",
      url: blob.url,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not publish settings. Check Vercel Blob." },
      { status: 500 }
    );
  }
}