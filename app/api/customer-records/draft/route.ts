import { NextRequest, NextResponse } from "next/server";
import { customerRecordDraftSchema } from "@/lib/validations/customerRecordSchema";
import { withTimeout } from "@/lib/withTimeout";
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi";
import { serializeCustomerRecord } from "@/lib/customerRecordSerialize";
import { draftToPrismaUnchecked } from "@/lib/customerRecordApiMaps";
import { normalizeCustomerRecordBody } from "@/lib/normalizeCustomerRecordBody";

const DB_MS = 12_000;

export async function POST(request: NextRequest) {
  const denied = await unauthorizedIfNoAdminSession();
  if (denied) return denied;

  const { getPrisma } = await import("@/lib/prisma");
  let prisma;
  try {
    prisma = getPrisma();
  } catch (error) {
    console.error("CUSTOMER_RECORD_DRAFT_ERROR", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { success: false, message: "Unable to save draft" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = customerRecordDraftSchema.safeParse(normalizeCustomerRecordBody(body));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const prismaData = draftToPrismaUnchecked(data);

  try {
    if (data.id) {
      const existing = await prisma.customerRecord.findUnique({
        where: { id: data.id },
      });
      if (!existing) {
        return NextResponse.json({ success: false, message: "Draft not found." }, { status: 404 });
      }
      if (existing.recordStatus !== "DRAFT") {
        return NextResponse.json(
          { success: false, message: "Only draft records can be updated with Save Draft." },
          { status: 400 },
        );
      }
      const updated = await withTimeout(
        prisma.customerRecord.update({
          where: { id: data.id },
          data: prismaData,
        }),
        DB_MS,
        "Database query timed out",
      );
      return NextResponse.json({ success: true, record: serializeCustomerRecord(updated) }, { status: 200 });
    }

    const created = await withTimeout(
      prisma.customerRecord.create({
        data: prismaData,
      }),
      DB_MS,
      "Database query timed out",
    );
    return NextResponse.json({ success: true, record: serializeCustomerRecord(created) }, { status: 201 });
  } catch (error) {
    console.error("CUSTOMER_RECORD_DRAFT_ERROR", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
    });
    const message = error instanceof Error ? error.message : "";
    if (message.includes("timed out")) {
      return NextResponse.json({ success: false, error: "Database timeout" }, { status: 504 });
    }
    return NextResponse.json({ success: false, message: "Unable to save draft. Please try again." }, { status: 500 });
  }
}
