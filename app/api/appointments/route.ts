import { NextRequest, NextResponse } from "next/server";
import { appointmentRequestSchema } from "@/lib/validations/appointmentSchema";
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi";

function mapRecord(record: {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  whatsapp: string | null;
  telegram: string | null;
  city: string | null;
  serviceInterest: string;
  preferredContactMethod: string;
  preferredDate: Date | null;
  preferredTimeSlot: string | null;
  message: string | null;
  consentAccepted: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...record,
    preferredDate: record.preferredDate?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = appointmentRequestSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = typeof issue.path?.[0] === "string" ? issue.path[0] : "form";
      if (!errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json(
      {
        success: false,
        message: "Please correct the highlighted fields.",
        errors,
      },
      { status: 400 },
    );
  }

  const { getPrisma } = await import("@/lib/prisma");
  try {
    const prisma = getPrisma();
    const created = await prisma.appointmentRequest.create({
      data: {
        ...parsed.data,
        preferredDate: parsed.data.preferredDate ? new Date(`${parsed.data.preferredDate}T00:00:00.000Z`) : null,
      },
    });
    return NextResponse.json({ success: true, request: mapRecord(created) }, { status: 201 });
  } catch (error) {
    console.error("APPOINTMENT_REQUEST_CREATE_ERROR", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit your appointment request. Please check details and try again.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const denied = await unauthorizedIfNoAdminSession();
  if (denied) return denied;

  const { getPrisma } = await import("@/lib/prisma");
  try {
    const prisma = getPrisma();
    const rows = await prisma.appointmentRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ success: true, requests: rows.map(mapRecord) });
  } catch (error) {
    console.error("APPOINTMENT_REQUESTS_GET_ERROR", error);
    return NextResponse.json({ success: false, message: "Unable to load appointment requests." }, { status: 500 });
  }
}
