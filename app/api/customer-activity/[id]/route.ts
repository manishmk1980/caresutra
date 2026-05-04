import { NextRequest, NextResponse } from "next/server";
import { withTimeout } from "@/lib/withTimeout";
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi";

const DB_MS = 12_000;

// No need for schema validation in delete/get operations

/**
 * DELETE /api/customer-activity/[id]
 * Deletes a customer activity by ID.
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await unauthorizedIfNoAdminSession();
    if (denied) return denied;

    const { id } = await params;
    const activityId = parseInt(id, 10);
    if (isNaN(activityId)) {
      return NextResponse.json({ error: "Invalid activity ID" }, { status: 400 });
    }

    const { getPrisma } = await import("@/lib/prisma");
    const prisma = getPrisma();

    const existing = await withTimeout(
      prisma.customerActivity.findUnique({
        where: { id: activityId },
      }),
      DB_MS,
      "Database query timed out",
    );
    if (!existing) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    await withTimeout(
      prisma.customerActivity.delete({
        where: { id: activityId },
      }),
      DB_MS,
      "Database query timed out",
    );

    return NextResponse.json({ message: "Activity deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete activity:", error);
    const message = error instanceof Error ? error.message : "";
    if (message.includes("timed out")) {
      return NextResponse.json({ error: "Database timeout" }, { status: 504 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/customer-activity/[id]
 * Retrieves a single customer activity by ID.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await unauthorizedIfNoAdminSession();
    if (denied) return denied;

    const { id } = await params;
    const activityId = parseInt(id, 10);
    if (isNaN(activityId)) {
      return NextResponse.json({ error: "Invalid activity ID" }, { status: 400 });
    }

    const { getPrisma } = await import("@/lib/prisma");
    const prisma = getPrisma();

    const activity = await withTimeout(
      prisma.customerActivity.findUnique({
        where: { id: activityId },
      }),
      DB_MS,
      "Database query timed out",
    );
    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Failed to fetch activity:", error);
    const message = error instanceof Error ? error.message : "";
    if (message.includes("timed out")) {
      return NextResponse.json({ error: "Database timeout" }, { status: 504 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}