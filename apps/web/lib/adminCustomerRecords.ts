import { existsSync } from "node:fs"
import path from "node:path"

import { getPrisma } from "@/lib/prisma"

export type CustomerRecordTableRow = {
  id: number
  customerName: string
  initials: string
  email: string
  mobile: string
  serviceType: string
  customerStatus: string
  recordStatus: string
  city: string
  documents: string
  uploadedDocumentCount: number
  totalDocumentCount: number
  createdAt: string
  createdAtIso: string
  customerPictureUrl: string | null
  panDocumentUrl: string | null
  aadharFrontUrl: string | null
  aadharBackUrl: string | null
  otherDocumentUrl: string | null
  reviewer: string
}

function fullName(record: {
  firstName: string | null
  middleName: string | null
  lastName: string | null
}) {
  return (
    [record.firstName, record.middleName, record.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unnamed Customer"
  )
}

function documentCount(record: {
  customerPictureUrl: string | null
  panDocumentUrl: string | null
  aadharFrontUrl: string | null
  aadharBackUrl: string | null
  otherDocumentUrl: string | null
}) {
  return [
    record.customerPictureUrl,
    record.panDocumentUrl,
    record.aadharFrontUrl,
    record.aadharBackUrl,
    record.otherDocumentUrl,
  ].filter(Boolean).length
}

function visibleUploadUrl(url: string | null) {
  if (!url) return null

  if (!url.startsWith("/uploads/customers/")) {
    return url
  }

  const cleanUrl = url.split("?")[0]?.replaceAll("\\", "/") ?? ""
  const publicDir = path.join(process.cwd(), "public")
  const targetPath = path.join(publicDir, cleanUrl)
  const relative = path.relative(publicDir, targetPath)

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null
  }

  return existsSync(targetPath) ? url : null
}

function initials(name: string) {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)

  return (parts.length > 1
    ? `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`
    : parts[0]?.slice(0, 2) || "CS"
  ).toUpperCase()
}

export async function getCustomerRecordRows(): Promise<CustomerRecordTableRow[]> {
  const prisma = getPrisma()

  const records = await prisma.customerRecord.findMany({
    orderBy: { updatedAt: "desc" },
  })

  return records.map((record) => {
    const customerName = fullName(record)
    const documents = {
      customerPictureUrl: visibleUploadUrl(record.customerPictureUrl),
      panDocumentUrl: visibleUploadUrl(record.panDocumentUrl),
      aadharFrontUrl: visibleUploadUrl(record.aadharFrontUrl),
      aadharBackUrl: visibleUploadUrl(record.aadharBackUrl),
      otherDocumentUrl: visibleUploadUrl(record.otherDocumentUrl),
    }
    const uploadedDocumentCount = documentCount(documents)

    return {
      id: record.id,
      customerName,
      initials: initials(customerName),
      email: record.email ?? "-",
      mobile: record.mobile ?? "-",
      serviceType: record.customerType ?? "-",
      customerStatus: record.customerStatus,
      recordStatus: record.recordStatus,
      city: record.city ?? "-",
      documents: `${uploadedDocumentCount} Documents`,
      uploadedDocumentCount,
      totalDocumentCount: 5,
      createdAt: record.createdAt.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      createdAtIso: record.createdAt.toISOString().slice(0, 10),
      customerPictureUrl: documents.customerPictureUrl,
      panDocumentUrl: documents.panDocumentUrl,
      aadharFrontUrl: documents.aadharFrontUrl,
      aadharBackUrl: documents.aadharBackUrl,
      otherDocumentUrl: documents.otherDocumentUrl,
      reviewer: "CareSutra Admin",
    }
  })
}

export async function getCustomerRecordById(id: number) {
  const prisma = getPrisma()

  const record = await prisma.customerRecord.findUnique({
    where: { id },
  })

  if (!record) return null

  return {
    ...record,
    insuranceLoanAmount: record.insuranceLoanAmount?.toString() ?? null,
    premiumEmi: record.premiumEmi?.toString() ?? null,
    coverFinalPayout: record.coverFinalPayout?.toString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    dateOfBirth: record.dateOfBirth?.toISOString() ?? null,
    serviceCommencedDate: record.serviceCommencedDate?.toISOString() ?? null,
    expiryDate: record.expiryDate?.toISOString() ?? null,
  }
}
