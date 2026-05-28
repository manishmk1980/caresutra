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
  const recordId = parseInt(id, 10);

  if (isNaN(recordId)) {
    return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
  }

  const { getPrisma } = await import("@/lib/prisma");
  let prisma;
  try {
    prisma = getPrisma();
  } catch (error) {
    console.error("DOCUMENTS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch documents" },
      { status: 500 }
    );
  }

  try {
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

    const summary = {
      customerPhoto: record.customerPictureUrl ? "Uploaded" : "Not Uploaded",
      pan: record.panDocumentUrl ? "Uploaded" : "Not Uploaded",
      aadhaarFront: record.aadharFrontUrl ? "Uploaded" : "Not Uploaded",
      aadhaarBack: record.aadharBackUrl ? "Uploaded" : "Not Uploaded",
      otherDocument: record.otherDocumentUrl ? "Uploaded" : "Not Uploaded",
    };

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error("DOCUMENTS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch documents" },
      { status: 500 }
    );
  }
}