import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi";

export const runtime = "nodejs";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const allowedExt = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".pdf",
  ".doc",
  ".docx",
]);

function safeFileName(baseName: string): string {
  const ext = path.extname(baseName).toLowerCase();
  const nameWithoutExt = path.basename(baseName, ext);

  const safeBase =
    nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80) || "document";

  return `${safeBase}${ext}`;
}

function getUploadFolder(): string {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return path.join("uploads", "customers", year, month);
}

export async function POST(request: NextRequest) {
  const denied = await unauthorizedIfNoAdminSession();
  if (denied) return denied;

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();

    if (!allowedExt.has(ext)) {
      return NextResponse.json(
        { error: "Invalid file extension. Allowed: jpg, jpeg, png, webp, pdf, doc, docx." },
        { status: 400 },
      );
    }

    /*
      Some mobile browsers or scanners may send an empty MIME type.
      We allow empty MIME type only when extension is safe.
    */
    if (file.type && !allowedTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: images, PDF, DOC, and DOCX." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max size is 10MB." }, { status: 400 });
    }

    const relativeFolder = getUploadFolder();
    const uploadDir = path.join(process.cwd(), "public", relativeFolder);
    await mkdir(uploadDir, { recursive: true });

    const stamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const fileName = `${stamp}-${random}-${safeFileName(file.name)}`;
    const dest = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    await writeFile(dest, Buffer.from(bytes));

    return NextResponse.json(
      {
        success: true,
        url: `/${relativeFolder.replaceAll(path.sep, "/")}/${fileName}`,
        originalName: file.name,
        size: file.size,
        type: file.type || "unknown",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Failed to upload document." }, { status: 500 });
  }
}
