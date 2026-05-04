import { NextRequest, NextResponse } from "next/server";
import { customerRecordSchema } from "@/lib/validations/customerRecordSchema";
import { withTimeout } from "@/lib/withTimeout";
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi";

const DB_MS = 12_000;

export async function GET() {
  const denied = await unauthorizedIfNoAdminSession();
  if (denied) return denied;

  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();

  try {
    const records = await withTimeout(
      prisma.customerRecord.findMany({
        orderBy: { createdAt: "desc" },
      }),
      DB_MS,
      "Database query timed out",
    );
    return NextResponse.json(records);
  } catch (error) {
    console.error("Failed to fetch customer records:", error);
    const message = error instanceof Error ? error.message : "";
    if (message.includes("timed out")) {
      return NextResponse.json({ error: "Database timeout" }, { status: 504 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await unauthorizedIfNoAdminSession();
  if (denied) return denied;

  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();

  try {
    const body = await request.json();
    const validated = customerRecordSchema.parse(body);

    const created = await withTimeout(
      prisma.customerRecord.create({
        data: {
          firstName: validated.firstName,
          middleName: validated.middleName || null,
          lastName: validated.lastName,
          email: validated.email || null,
          mobile: validated.mobile,
          alternativeMobile: validated.alternativeMobile || null,
          dateOfBirth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : null,
          pan: validated.pan || null,
          aadhaar: validated.aadhaar || null,
          addressLine: validated.addressLine,
          floor: validated.floor || null,
          street: validated.street,
          city: validated.city,
          state: validated.state,
          pinCode: validated.pinCode,
          customerPictureUrl: validated.customerPictureUrl || null,
          customerStatus: validated.customerStatus,
          customerType: validated.customerType,
          providerCompanyName: validated.providerCompanyName || null,
          serviceCommencedDate: validated.serviceCommencedDate
            ? new Date(validated.serviceCommencedDate)
            : null,
          expiryDate: validated.expiryDate ? new Date(validated.expiryDate) : null,
          insuranceLoanAmount: validated.insuranceLoanAmount ?? null,
          premiumEmi: validated.premiumEmi ?? null,
          coverFinalPayout: validated.coverFinalPayout ?? null,
        },
      }),
      DB_MS,
      "Database query timed out",
    );

    return NextResponse.json({ success: true, record: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create customer record:", error);
    const message = error instanceof Error ? error.message : "";
    if (message.includes("timed out")) {
      return NextResponse.json({ error: "Database timeout" }, { status: 504 });
    }
    return NextResponse.json({ error: "Invalid data or server error" }, { status: 400 });
  }
}
