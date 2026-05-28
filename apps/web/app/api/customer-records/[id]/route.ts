import { NextRequest, NextResponse } from "next/server"
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi"

export const runtime = "nodejs"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await unauthorizedIfNoAdminSession()
  if (denied) return denied

  const { id } = await params
  const recordId = Number(id)

  if (!Number.isInteger(recordId) || recordId <= 0) {
    return NextResponse.json({ error: "Invalid record ID" }, { status: 400 })
  }

  const { getPrisma } = await import("@/lib/prisma")

  try {
    const prisma = getPrisma()

    const record = await prisma.customerRecord.findUnique({
      where: { id: recordId },
    })

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    const safeRecord = {
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

    return NextResponse.json({ success: true, record: safeRecord })
  } catch (error) {
    console.error("CUSTOMER_RECORD_DETAIL_ERROR", error)
    return NextResponse.json(
      { error: "Failed to fetch customer record" },
      { status: 500 }
    )
  }
}
