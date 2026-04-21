import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getAdminErrorStatus, requireAdminSession } from "@/lib/adminAuth";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

export async function PATCH(
        request: NextRequest,
        { params }: { params: { id: string } }
) {
        try {
                await requireAdminSession();
                const { action } = await request.json();
                const userId = params.id;

                if (!ObjectId.isValid(userId)) {
                        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
                }

                let updateData: Record<string, unknown>;
                if (action === "activate") {
                        updateData = { isActive: true, updatedAt: new Date() };
                } else if (action === "deactivate") {
                        updateData = { isActive: false, updatedAt: new Date() };
                } else {
                        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
                }

                const client = await clientPromise;
                const db = client.db(DATABASE_NAME);
                const result = await db
                        .collection("users")
                        .updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

                if (result.matchedCount === 0) {
                        return NextResponse.json({ error: "User not found" }, { status: 404 });
                }

                return NextResponse.json({ success: true });
        } catch (err: any) {
                const status = getAdminErrorStatus(err);
                return NextResponse.json({ error: err?.message || "Failed to update user" }, { status });
        }
}

export async function DELETE(
        _request: NextRequest,
        { params }: { params: { id: string } }
) {
        try {
                await requireAdminSession();
                const userId = params.id;

                if (!ObjectId.isValid(userId)) {
                        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
                }

                const client = await clientPromise;
                const db = client.db(DATABASE_NAME);
                const result = await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

                if (result.deletedCount === 0) {
                        return NextResponse.json({ error: "User not found" }, { status: 404 });
                }

                return NextResponse.json({ success: true });
        } catch (err: any) {
                const status = getAdminErrorStatus(err);
                return NextResponse.json({ error: err?.message || "Failed to delete user" }, { status });
        }
}
