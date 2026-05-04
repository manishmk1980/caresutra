import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerActivitySchema } from "@/lib/validations/customerActivitySchema";

export async function GET() {
    try {
        const activities = await prisma.customerActivity.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(activities);
    } catch (error) {
        console.error("Failed to fetch activities:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validated = customerActivitySchema.parse(body);

        const activity = await prisma.customerActivity.create({
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
        });

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error("Failed to create activity:", error);
        return NextResponse.json(
            { error: "Invalid data or server error" },
            { status: 400 }
        );
    }
}