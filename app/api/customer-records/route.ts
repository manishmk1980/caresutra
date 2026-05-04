import { NextRequest, NextResponse } from "next/server";
import { customerRecordSchema } from "@/lib/validations/customerRecordSchema";
import { withTimeout } from "@/lib/withTimeout";
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi";
import { serializeCustomerRecord } from "@/lib/customerRecordSerialize";
import { nullableDate, nullableDecimal } from "@/lib/customerRecordNormalize";

const DB_MS = 12_000;

function normalizeCustomerRecordBody(body: unknown): unknown {
  if (!body || typeof body !== "object" || Array.isArray(body)) return body;
  const o = { ...(body as Record<string, unknown>) };
  if (typeof o.customerStatus === "string") {
    o.customerStatus = o.customerStatus.trim().toUpperCase();
  }
  if (typeof o.customerType === "string") {
    o.customerType = o.customerType.trim().toUpperCase();
  }
  return o;
}

export async function GET() {
  const denied = await unauthorizedIfNoAdminSession();
  if (denied) return denied;

  const { getPrisma } = await import("@/lib/prisma");
  let prisma;
  try {
    prisma = getPrisma();
  } catch (e) {
    console.error("CUSTOMER_RECORDS_GET_ERROR", e);
    return NextResponse.json(
      { success: false, message: "Unable to fetch customer records" },
      { status: 500 },
    );
  }

  try {
    const records = await withTimeout(
      prisma.customerRecord.findMany({
        orderBy: { createdAt: "desc" },
      }),
      DB_MS,
      "Database query timed out",
    );
    return NextResponse.json(records.map(serializeCustomerRecord));
  } catch (error) {
    console.error("CUSTOMER_RECORDS_GET_ERROR", error);
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

export async function POST(request: NextRequest) {
  const denied = await unauthorizedIfNoAdminSession();
  if (denied) return denied;

  const { getPrisma } = await import("@/lib/prisma");
  let prisma;
  try {
    prisma = getPrisma();
  } catch (e) {
    console.error("CUSTOMER_RECORDS_POST_ERROR", e);
    return NextResponse.json(
      { success: false, message: "Unable to save customer record" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = customerRecordSchema.safeParse(normalizeCustomerRecordBody(body));
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const created = await withTimeout(
      prisma.customerRecord.create({
        data: {
          firstName: data.firstName.trim(),
          middleName: data.middleName?.trim() || null,
          lastName: data.lastName.trim(),
          email: data.email?.trim() || null,
          mobile: data.mobile.trim(),
          alternativeMobile: data.alternativeMobile?.trim() || null,
          dateOfBirth: nullableDate(data.dateOfBirth),
          pan: data.pan?.trim() || null,
          aadhaar: data.aadhaar?.trim() || null,
          addressLine: data.addressLine.trim(),
          floor: data.floor?.trim() || null,
          street: data.street.trim(),
          city: data.city.trim(),
          state: data.state.trim(),
          pinCode: data.pinCode.trim(),
          customerPictureUrl: data.customerPictureUrl?.trim() || null,
          customerStatus: data.customerStatus,
          customerType: data.customerType,
          providerCompanyName: data.providerCompanyName?.trim() || null,
          serviceCommencedDate: nullableDate(data.serviceCommencedDate),
          expiryDate: nullableDate(data.expiryDate),
          insuranceLoanAmount: nullableDecimal(data.insuranceLoanAmount),
          premiumEmi: nullableDecimal(data.premiumEmi),
          coverFinalPayout: nullableDecimal(data.coverFinalPayout),
        },
      }),
      DB_MS,
      "Database query timed out",
    );

    return NextResponse.json(
      { success: true, record: serializeCustomerRecord(created) },
      { status: 201 },
    );
  } catch (error) {
    console.error("CUSTOMER_RECORDS_POST_ERROR", error);
    const message = error instanceof Error ? error.message : "";
    if (message.includes("timed out")) {
      return NextResponse.json({ success: false, error: "Database timeout" }, { status: 504 });
    }
    return NextResponse.json(
      { success: false, message: "Unable to save customer record" },
      { status: 500 },
    );
  }
}
