import { del, list, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MEDIA_PREFIX = "multani-mithas/media/";
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
];

function isAuthorized(request: Request) {
  return isAdminRequest(request);
}


// Admin media library: reload stored files after a page refresh.
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await list({ prefix: MEDIA_PREFIX, limit: 1000 });
    const media = result.blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      uploadedAt: blob.uploadedAt,
      size: blob.size,
    }));
    return NextResponse.json({ success: true, media });
  } catch {
    return NextResponse.json(
      { error: "Could not load media from Vercel Blob." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const oldUrl = formData.get("oldUrl");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please select an image or video." },
        { status: 400 }
      );
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Use JPG, PNG, WEBP, GIF, MP4 or WEBM." },
        { status: 400 }
      );
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be between 1 byte and 4 MB." },
        { status: 400 }
      );
    }

    const extension =
      file.type === "image/jpeg" ? "jpg" :
      file.type === "image/png" ? "png" :
      file.type === "image/webp" ? "webp" :
      file.type === "image/gif" ? "gif" :
      file.type === "video/mp4" ? "mp4" : "webm";
    const safeName = file.name
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^[-.]+|[-.]+$/g, "")
      .slice(-100);
    const originalName = safeName || `upload.${extension}`;
    const blob = await put(
      `${MEDIA_PREFIX}${crypto.randomUUID()}-${originalName}`,
      file,
      {
        access: "public",
        addRandomSuffix: false,
        contentType: file.type,
      }
    );

    if (typeof oldUrl === "string" && oldUrl) {
      let isOurBlob = false;
      try {
        const old = new URL(oldUrl);
        isOurBlob =
          old.protocol === "https:" &&
          old.hostname.endsWith(".public.blob.vercel-storage.com") &&
          old.pathname.startsWith(`/${MEDIA_PREFIX}`);
      } catch {
        isOurBlob = false;
      }

      if (!isOurBlob || !process.env.BLOB_STORE_ID) {
        await del(blob.url);
        return NextResponse.json(
          { error: "Old media URL is not valid for replacement." },
          { status: 400 }
        );
      }

      try {
        await del(oldUrl);
      } catch {
        return NextResponse.json({
          success: true,
          url: blob.url,
          pathname: blob.pathname,
          type: file.type.startsWith("video/") ? "video" : "image",
          warning: "New file uploaded, but old file could not be removed.",
        });
      }
    }

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      type: file.type.startsWith("video/") ? "video" : "image",
    });
  } catch {
    return NextResponse.json(
      { error: "Upload failed. Check Vercel configuration." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();
    const url =
      body && typeof body === "object" && "url" in body
        ? (body as { url?: unknown }).url
        : null;

    if (typeof url !== "string" || !url) {
      return NextResponse.json(
        { error: "Media URL is required." },
        { status: 400 }
      );
    }

    const parsed = new URL(url);
    if (
      parsed.protocol !== "https:" ||
      !parsed.hostname.endsWith(".public.blob.vercel-storage.com") ||
      !parsed.pathname.startsWith(`/${MEDIA_PREFIX}`)
    ) {
      return NextResponse.json(
        { error: "This media URL is not allowed." },
        { status: 400 }
      );
    }

    await del(url);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Delete failed. Check the media URL and storage." },
      { status: 500 }
    );
  }
}
