import { NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const configuredMediaDirectory = process.env.MEDIA_STORAGE_DIRECTORY;
const MEDIA_DIRECTORY = configuredMediaDirectory && path.isAbsolute(configuredMediaDirectory)
  ? configuredMediaDirectory
  : path.join(homedir(), ".multani-mithas", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    if (
      typeof filename !== "string" ||
      !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,179}$/.test(filename) ||
      filename !== path.basename(filename) ||
      filename.includes("..")
    ) {
      return NextResponse.json({ success: false, message: "Media not found." }, { status: 404 });
    }

    const contentType = CONTENT_TYPES[path.extname(filename).toLowerCase()];
    if (!contentType) {
      return NextResponse.json({ success: false, message: "Media type not allowed." }, { status: 404 });
    }

    const filePath = path.join(MEDIA_DIRECTORY, filename);
    const details = await stat(filePath);
    if (!details.isFile() || details.size > 4 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "Media not found." }, { status: 404 });
    }

    const file = await readFile(filePath);
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(file.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Media not found." },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }
}
