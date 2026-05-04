import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
    params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        // Validate ID is a number
        const activityId = parseInt(id, 10);
        if (isNaN(activityId)) {
            return NextResponse.json(
                { error: "Invalid activity ID" },
                { status: 400 }
            );
        }

        // Check if activity exists
        const existingActivity = await prisma.customerActivity.findUnique({
            where: { id: activityId },
        });

        if (!existingActivity) {
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 }
            );
        }

        // Delete the activity
        await prisma.customerActivity.delete({
            where: { id: activityId },
        });

        return NextResponse.json(
            { message: "Activity deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to delete activity:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Optional: Add GET handler to fetch single activity by ID
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        // Validate ID is a number
        const activityId = parseInt(id, 10);
        if (isNaN(activityId)) {
            return NextResponse.json(
                { error: "Invalid activity ID" },
                { status: 400 }
            );
        }

        const activity = await prisma.customerActivity.findUnique({
            where: { id: activityId },
        });

        if (!activity) {
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(activity);
    } catch (error) {
        console.error("Failed to fetch activity:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}