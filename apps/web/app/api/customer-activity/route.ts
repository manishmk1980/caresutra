import { NextRequest, NextResponse } from "next/server";
// Import prisma lazily inside route handlers
import { customerActivitySchema } from "@/lib/validations/customerActivitySchema";
import { withTimeout } from "@/lib/withTimeout";
import { unauthorizedIfNoAdminSession } from "@/lib/requireAdminApi";

const DB_MS = 12_000;

export async function GET() {
    const denied = await unauthorizedIfNoAdminSession();
    if (denied) return denied;

    const { getPrisma } = await import("@/lib/prisma");
    const prisma = getPrisma();
    try {
        const activities = await withTimeout(
            prisma.customerActivity.findMany({
                orderBy: { createdAt: "desc" },
            }),
            DB_MS,
            "Database query timed out",
        );
        return NextResponse.json(activities);
    } catch (error) {
        console.error("Failed to fetch activities:", error);
        const message = error instanceof Error ? error.message : "";
        if (message.includes("timed out")) {
            return NextResponse.json({ error: "Database timeout" }, { status: 504 });
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const denied = await unauthorizedIfNoAdminSession();
    if (denied) return denied;

    const { getPrisma } = await import("@/lib/prisma");
    const prisma = getPrisma();
    try {
        const body = await request.json();
        const validated = customerActivitySchema.parse(body);

        const activity = await withTimeout(
            prisma.customerActivity.create({
                data: {
                    customerName: validated.customerName,
                    mobile: validated.mobile,
                    email: validated.email || null,
                    city: validated.city || null,
                    serviceInterest: validated.serviceInterest,
                    customerType: validated.customerType,
                    leadSource: validated.leadSource || null,
                    currentStatus: validated.currentStatus,
                    followUpDate: validated.followUpDate ? new Date(validated.followUpDate) : null,
                    notes: validated.notes || null,
                    assignedTo: validated.assignedTo || null,
                },
            }),
            DB_MS,
            "Database query timed out",
        );

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error("Failed to create activity:", error);
        const message = error instanceof Error ? error.message : "";
        if (message.includes("timed out")) {
            return NextResponse.json({ error: "Database timeout" }, { status: 504 });
        }
        return NextResponse.json(
            { error: "Invalid data or server error" },
            { status: 400 }
        );
    }
}