import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  if (!segments || segments.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Security: prevent directory traversal
  const safeSegments = segments.filter((s) => s !== ".." && s !== ".");
  if (safeSegments.length !== segments.length) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const baseDir = path.resolve(process.cwd(), "public", "uploads");
  const targetPath = path.resolve(baseDir, ...safeSegments);

  // Ensure target path is inside baseDir
  if (!targetPath.startsWith(baseDir)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const stat = await fs.promises.stat(targetPath);
    if (!stat.isFile()) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const fileBuffer = await fs.promises.readFile(targetPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
