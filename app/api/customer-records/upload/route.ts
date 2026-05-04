import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi";

export const runtime = "nodejs";

const MAX_SIZE = 2 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExt = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function safeFileName(baseName: string): string {
  return baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
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
    if (!allowedTypes.has(file.type) || !allowedExt.has(ext)) {
      return NextResponse.json(
        { error: "Invalid file type. Only jpg, jpeg, png, webp are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max size is 2MB." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "customers");
    await mkdir(uploadDir, { recursive: true });

    const stamp = Date.now();
    const fileName = `${stamp}-${safeFileName(path.basename(file.name))}`;
    const dest = path.join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    await writeFile(dest, Buffer.from(bytes));

    return NextResponse.json({ url: `/uploads/customers/${fileName}` }, { status: 201 });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}
