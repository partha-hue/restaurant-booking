import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getAdminErrorStatus, requireAdminSession } from "@/lib/adminAuth";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

export async function GET() {
        try {
                await requireAdminSession();
                const client = await clientPromise;
                const db = client.db(DATABASE_NAME);

                const approvedAdmins = await db
                        .collection("admin_access")
                        .find({ status: "approved" }, { projection: { email: 1 } })
                        .toArray();

                const adminEmailSet = new Set(approvedAdmins.map((item: any) => String(item.email || "").toLowerCase()));

                const users = await db
                        .collection("users")
                        .find({}, { projection: { password: 0 } })
                        .sort({ createdAt: -1 })
                        .toArray();

                const usersWithRoles = users.map((user: any) => {
                        const email = String(user.email || "").toLowerCase();
                        return {
                                ...user,
                                role: adminEmailSet.has(email) ? "admin" : (user.role || "user"),
                        };
                });

                return NextResponse.json(usersWithRoles);
        } catch (err: any) {
                const status = getAdminErrorStatus(err);
                return NextResponse.json({ error: err?.message || "Failed to fetch users" }, { status });
        }
}

export async function PATCH(request: Request) {
        try {
                await requireAdminSession();
                const { userId, action } = await request.json();

                if (!userId || !action) {
                        return NextResponse.json({ error: "User ID and action are required" }, { status: 400 });
                }

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

                const result = await db.collection("users").updateOne(
                        { _id: new ObjectId(userId) },
                        { $set: updateData }
                );

                if (result.matchedCount === 0) {
                        return NextResponse.json({ error: "User not found" }, { status: 404 });
                }

                return NextResponse.json({ success: true });
        } catch (err: any) {
                const status = getAdminErrorStatus(err);
                return NextResponse.json({ error: err?.message || "Failed to update user" }, { status });
        }
}

export async function DELETE(request: Request) {
        try {
                await requireAdminSession();
                const { userId } = await request.json();

                if (!userId) {
                        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
                }

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
