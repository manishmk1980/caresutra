import { NextRequest, NextResponse } from "next/server";
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi";
import { appointmentStatusSchema } from "@/lib/validations/appointmentSchema";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const denied = await unauthorizedIfNoAdminSession();
  if (denied) return denied;

  const { id } = await context.params;
  const requestId = Number(id);
  if (!Number.isInteger(requestId) || requestId <= 0) {
    return NextResponse.json({ success: false, message: "Invalid appointment id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const statusResult = appointmentStatusSchema.safeParse(
    body && typeof body === "object" && "status" in body ? (body as { status?: unknown }).status : undefined,
  );
  if (!statusResult.success) {
    return NextResponse.json({ success: false, message: "Invalid status value." }, { status: 400 });
  }

  const { getPrisma } = await import("@/lib/prisma");
  try {
    const prisma = getPrisma();
    const updated = await prisma.appointmentRequest.update({
      where: { id: requestId },
      data: { status: statusResult.data },
    });
    return NextResponse.json({
      success: true,
      request: {
        ...updated,
        preferredDate: updated.preferredDate?.toISOString() ?? null,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to update status." }, { status: 500 });
  }
}
