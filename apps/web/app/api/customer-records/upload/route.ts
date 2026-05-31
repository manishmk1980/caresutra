import { mkdir, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import crypto from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi"

export const runtime = "nodejs"

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

const allowedExt = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".pdf",
  ".doc",
  ".docx",
])

const allowedDocumentTypes = new Set([
  "customer-picture",
  "pan-document",
  "aadhaar-front",
  "aadhaar-back",
  "other-document",
])

function safeSlug(value: string, fallback: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80) || fallback
  )
}

function getTimestamp() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const dd = String(now.getDate()).padStart(2, "0")
  const hh = String(now.getHours()).padStart(2, "0")
  const min = String(now.getMinutes()).padStart(2, "0")
  const ss = String(now.getSeconds()).padStart(2, "0")
  return `${yyyy}${mm}${dd}-${hh}${min}${ss}`
}

function getUploadFolder(customerId: string) {
  return path.join("uploads", "customers", customerId)
}

function resolveSafeUploadPath(url: string) {
  const cleanUrl = url.split("?")[0] ?? ""
  const normalizedUrl = cleanUrl.replaceAll("\\", "/")

  if (!normalizedUrl.startsWith("/uploads/customers/")) {
    return null
  }

  const publicDir = path.join(process.cwd(), "public")
  const targetPath = path.join(publicDir, normalizedUrl)

  const relative = path.relative(publicDir, targetPath)

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null
  }

  return targetPath
}

export async function POST(request: NextRequest) {
  const denied = await unauthorizedIfNoAdminSession()
  if (denied) return denied

  try {
    const form = await request.formData()
    const file = form.get("file")
    const rawCustomerId = String(form.get("customerId") || "draft").trim()
    const rawDocumentType = String(form.get("documentType") || "other-document").trim()

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 })
    }

    const customerId = safeSlug(rawCustomerId, "draft")
    const documentType = safeSlug(rawDocumentType, "other-document")

    if (!allowedDocumentTypes.has(documentType)) {
      return NextResponse.json({ error: "Invalid document type." }, { status: 400 })
    }

    const ext = path.extname(file.name).toLowerCase()

    if (!allowedExt.has(ext)) {
      return NextResponse.json(
        {
          error:
            "Invalid file extension. Allowed: jpg, jpeg, png, webp, pdf, doc, docx.",
        },
        { status: 400 }
      )
    }

    if (file.type && !allowedTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: images, PDF, DOC, and DOCX." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max size is 10MB." },
        { status: 400 }
      )
    }

    const relativeFolder = getUploadFolder(customerId)
    const uploadDir = path.join(process.cwd(), "public", relativeFolder)
    await mkdir(uploadDir, { recursive: true })

    const random = crypto.randomBytes(4).toString("hex")
    const fileName = `customer-${customerId}-${documentType}-${getTimestamp()}-${random}${ext}`
    const dest = path.join(uploadDir, fileName)

    const bytes = await file.arrayBuffer()
    await writeFile(dest, Buffer.from(bytes))

    return NextResponse.json(
      {
        success: true,
        url: `/${relativeFolder.replaceAll(path.sep, "/")}/${fileName}`,
        originalName: file.name,
        size: file.size,
        type: file.type || "unknown",
        documentType,
        customerId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("CUSTOMER_DOCUMENT_UPLOAD_ERROR", error)
    return NextResponse.json(
      { error: "Failed to upload document." },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await unauthorizedIfNoAdminSession()
  if (denied) return denied

  try {
    const body = (await request.json().catch(() => null)) as {
      url?: string
    } | null

    const url = body?.url?.trim()

    if (!url) {
      return NextResponse.json({ error: "File URL is required." }, { status: 400 })
    }

    const safePath = resolveSafeUploadPath(url)

    if (!safePath) {
      return NextResponse.json({ error: "Invalid upload path." }, { status: 400 })
    }

    try {
      await unlink(safePath)
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException

      if (nodeError.code !== "ENOENT") {
        throw error
      }
    }

    return NextResponse.json({
      success: true,
      message: "Uploaded file deleted successfully.",
    })
  } catch (error) {
    console.error("CUSTOMER_DOCUMENT_DELETE_ERROR", error)
    return NextResponse.json(
      { error: "Failed to delete uploaded file." },
      { status: 500 }
    )
  }
}

