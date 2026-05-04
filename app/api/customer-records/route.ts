import { NextResponse } from "next/server";
import { withTimeout } from "@/lib/withTimeout";
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi";

const DB_MS = 12_000;

export async function GET() {
  const denied = await unauthorizedIfNoAdminSession();
  if (denied) return denied;

  const { getPrisma } = await import("@/lib/prisma");
  let prisma;
  try {
    prisma = getPrisma();
  } catch (error) {
    console.error("CUSTOMER_RECORDS_GET_ERROR", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { success: false, message: "Unable to fetch customer records" },
      { status: 500 },
    );
  }

  try {
    const records = await withTimeout(
      prisma.customerRecord.findMany({
        orderBy: { updatedAt: "desc" },
      }),
      DB_MS,
      "Database query timed out",
    );
    const safeRecords = records.map((record) => ({
      ...record,
      insuranceLoanAmount: record.insuranceLoanAmount?.toString() ?? null,
      premiumEmi: record.premiumEmi?.toString() ?? null,
      coverFinalPayout: record.coverFinalPayout?.toString() ?? null,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      dateOfBirth: record.dateOfBirth?.toISOString() ?? null,
      serviceCommencedDate: record.serviceCommencedDate?.toISOString() ?? null,
      expiryDate: record.expiryDate?.toISOString() ?? null,
    }));
    return NextResponse.json({ success: true, records: safeRecords });
  } catch (error) {
    console.error("CUSTOMER_RECORDS_GET_ERROR", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
    });
    const message = error instanceof Error ? error.message : "";
    if (message.includes("timed out")) {
      return NextResponse.json({ success: false, error: "Database timeout" }, { status: 504 });
    }
    return NextResponse.json(
      { success: false, message: "Unable to fetch customer records" },
      { status: 500 },
    );
  }
}
