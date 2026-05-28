import { NextRequest, NextResponse } from "next/server";
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await unauthorizedIfNoAdminSession();
  if (denied) return denied;

  const { id } = await params;
  const { getPrisma } = await import("@/lib/prisma");

  try {
    const prisma = getPrisma();
    const recordId = parseInt(id, 10);

    if (isNaN(recordId)) {
      return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    }

    const record = await prisma.customerRecord.findUnique({
      where: { id: recordId },
      select: {
        customerPictureUrl: true,
        panDocumentUrl: true,
        aadharFrontUrl: true,
        aadharBackUrl: true,
        otherDocumentUrl: true,
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const documentSummary = {
      customerPhoto: record.customerPictureUrl ? "Uploaded" : "Not Uploaded",
      pan: record.panDocumentUrl ? "Uploaded" : "Not Uploaded",
      aadhaarFront: record.aadharFrontUrl ? "Uploaded" : "Not Uploaded",
      aadhaarBack: record.aadharBackUrl ? "Uploaded" : "Not Uploaded",
      otherDocument: record.otherDocumentUrl ? "Uploaded" : "Not Uploaded",
    };

    return NextResponse.json({ success: true, documentSummary });
  } catch (error) {
    console.error("DOCUMENT_REVIEW_ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch document summary" },
      { status: 500 }
    );
  }
}