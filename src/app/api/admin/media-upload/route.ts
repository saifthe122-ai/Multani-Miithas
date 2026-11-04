import { del, list, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { homedir } from "node:os";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MEDIA_PREFIX = "multani-mithas/media/";
const configuredMediaDirectory = process.env.MEDIA_STORAGE_DIRECTORY;
const LOCAL_MEDIA_DIRECTORY = configuredMediaDirectory && path.isAbsolute(configuredMediaDirectory)
  ? configuredMediaDirectory
  : path.join(homedir(), ".multani-mithas", "uploads");
const LOCAL_MEDIA_URL_PREFIX = "/api/media/";
const STORAGE_DRIVER = process.env.MEDIA_STORAGE_DRIVER === "local" ? "local" : "vercel_blob";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
];

function isSafeLocalMediaPath(pathname: string) {
  if (!pathname.startsWith(LOCAL_MEDIA_URL_PREFIX)) return false;
  const filename = pathname.slice(LOCAL_MEDIA_URL_PREFIX.length);
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,179}$/.test(filename) &&
    filename === path.basename(filename) &&
    !filename.includes("..");
}

function localMediaUrl(request: Request, filename: string) {
  return new URL(`${LOCAL_MEDIA_URL_PREFIX}${encodeURIComponent(filename)}`, request.url).toString();
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (STORAGE_DRIVER === "local") {
      await mkdir(LOCAL_MEDIA_DIRECTORY, { recursive: true });
      const names = await readdir(LOCAL_MEDIA_DIRECTORY);
      const media = await Promise.all(names.map(async (filename) => {
        const filePath = path.join(LOCAL_MEDIA_DIRECTORY, filename);
        const details = await stat(filePath);
        if (!details.isFile()) return null;
        return {
          url: localMediaUrl(request, filename),
          pathname: `multani-mithas/${filename}`,
          uploadedAt: details.mtime.toISOString(),
          size: details.size,
        };
      }));
      return NextResponse.json({ success: true, media: media.filter(Boolean) });
    }

    const result = await list({ prefix: MEDIA_PREFIX, limit: 1000 });
    const media = result.blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      uploadedAt: blob.uploadedAt,
      size: blob.size,
    }));
    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error("Media library load failed:", error);
    return NextResponse.json(
      { error: "Could not load media library from the configured storage provider." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please select an image or video." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Use JPG, PNG, WEBP, GIF, MP4 or WEBM." }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be between 1 byte and 4 MB." }, { status: 400 });
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
    const filename = `${crypto.randomUUID()}-${safeName || `upload.${extension}`}`;

    if (STORAGE_DRIVER === "local") {
      await mkdir(LOCAL_MEDIA_DIRECTORY, { recursive: true });
      await writeFile(path.join(LOCAL_MEDIA_DIRECTORY, filename), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
      return NextResponse.json({
        success: true,
        url: localMediaUrl(request, filename),
        pathname: `multani-mithas/${filename}`,
        type: file.type.startsWith("video/") ? "video" : "image",
      });
    }

    const blob = await put(`${MEDIA_PREFIX}${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      type: file.type.startsWith("video/") ? "video" : "image",
    });
  } catch (error) {
    console.error("Media upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed. Check the configured media storage provider." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();
    const url = body && typeof body === "object" && "url" in body
      ? (body as { url?: unknown }).url
      : null;
    if (typeof url !== "string" || !url) {
      return NextResponse.json({ error: "Media URL is required." }, { status: 400 });
    }

    const parsed = new URL(url);
    if (STORAGE_DRIVER === "local") {
      if (parsed.origin !== new URL(request.url).origin || !isSafeLocalMediaPath(parsed.pathname)) {
        return NextResponse.json({ error: "This media URL is not allowed." }, { status: 400 });
      }
      const filename = parsed.pathname.slice(LOCAL_MEDIA_URL_PREFIX.length);
      await unlink(path.join(LOCAL_MEDIA_DIRECTORY, filename));
      return NextResponse.json({ success: true });
    }

    if (
      parsed.protocol !== "https:" ||
      !parsed.hostname.endsWith(".public.blob.vercel-storage.com") ||
      !parsed.pathname.startsWith(`/${MEDIA_PREFIX}`)
    ) {
      return NextResponse.json({ error: "This media URL is not allowed." }, { status: 400 });
    }
    await del(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media delete failed:", error);
    return NextResponse.json(
      { error: "Delete failed. Check the media URL and configured storage provider." },
      { status: 500 }
    );
  }
}
