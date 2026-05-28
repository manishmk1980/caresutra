import { getPrisma } from "@/lib/prisma"

export type CustomerRecordTableRow = {
  id: number
  customerName: string
  mobile: string
  serviceType: string
  customerStatus: string
  recordStatus: string
  city: string
  documents: string
  createdAt: string
  createdAtIso: string
  reviewer: string
}

function fullName(record: {
  firstName: string | null
  middleName: string | null
  lastName: string | null
}) {
  return [record.firstName, record.middleName, record.lastName]
    .filter(Boolean)
    .join(" ")
    .trim() || "Unnamed Customer"
}

function documentCount(record: {
  customerPictureUrl: string | null
  panDocumentUrl: string | null
  aadharFrontUrl: string | null
  aadharBackUrl: string | null
  otherDocumentUrl: string | null
}) {
  const uploaded = [
    record.customerPictureUrl,
    record.panDocumentUrl,
    record.aadharFrontUrl,
    record.aadharBackUrl,
    record.otherDocumentUrl,
  ].filter(Boolean).length

  return `${uploaded}/5`
}

export async function getCustomerRecordRows(): Promise<CustomerRecordTableRow[]> {
  const prisma = getPrisma()

  const records = await prisma.customerRecord.findMany({
    orderBy: { updatedAt: "desc" },
  })

  return records.map((record) => ({
    id: record.id,
    customerName: fullName(record),
    mobile: record.mobile ?? "-",
    serviceType: record.customerType ?? "-",
    customerStatus: record.customerStatus,
    recordStatus: record.recordStatus,
    city: record.city ?? "-",
    documents: documentCount(record),
    createdAt: record.createdAt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    createdAtIso: record.createdAt.toISOString().slice(0, 10),
    reviewer: "CareSutra Admin",
  }))
}

