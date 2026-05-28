import { NextRequest, NextResponse } from "next/server";
import { customerRecordSubmitSchema } from "@/lib/validations/customerRecordSchema";
import { withTimeout } from "@/lib/withTimeout";
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi";
import { serializeCustomerRecord } from "@/lib/customerRecordSerialize";
import { submitToPrismaUnchecked } from "@/lib/customerRecordApiMaps";
import { normalizeCustomerRecordBody } from "@/lib/normalizeCustomerRecordBody";

const DB_MS = 12_000;

function extractId(body: unknown): { id?: number; payload: unknown } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { payload: body };
  const src = body as Record<string, unknown>;
  const raw = src.id;
  const id = typeof raw === "number" && Number.isInteger(raw) && raw > 0 ? raw : undefined;
  const { id: _omit, ...rest } = src;
  return { id, payload: rest };
}

export async function POST(request: NextRequest) {
  const denied = await unauthorizedIfNoAdminSession();
  if (denied) return denied;

  const { getPrisma } = await import("@/lib/prisma");
  let prisma;
  try {
    prisma = getPrisma();
  } catch (error) {
    console.error("CUSTOMER_RECORD_SUBMIT_ERROR", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { success: false, message: "Unable to submit customer record." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const { id, payload } = extractId(body);
  const parsed = customerRecordSubmitSchema.safeParse(normalizeCustomerRecordBody(payload));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const prismaData = submitToPrismaUnchecked(parsed.data);

  try {
    if (id) {
      const existing = await prisma.customerRecord.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ success: false, message: "Record not found." }, { status: 404 });
      }
      const updated = await withTimeout(
        prisma.customerRecord.update({
          where: { id },
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
    console.error("CUSTOMER_RECORD_SUBMIT_ERROR", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
    });
    const message = error instanceof Error ? error.message : "";
    if (message.includes("timed out")) {
      return NextResponse.json({ success: false, error: "Database timeout" }, { status: 504 });
    }
    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : "Unable to submit customer record.",
      },
      { status: 500 },
    );
  }
}
