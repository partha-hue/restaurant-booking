import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getAdminErrorStatus, requireAdminSession } from "@/lib/adminAuth";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

export async function GET(request: NextRequest) {
        try {
                await requireAdminSession();

                const search = request.nextUrl.searchParams.get("search")?.trim() || "";
                const status = request.nextUrl.searchParams.get("status") || "all";

                const filter: Record<string, unknown> = {};

                if (search) {
                        filter.$or = [
                                { restaurantName: { $regex: search, $options: "i" } },
                                { name: { $regex: search, $options: "i" } },
                                { phone: { $regex: search, $options: "i" } },
                        ];
                }

                const nowIso = new Date().toISOString();
                if (status === "upcoming") {
                        filter.date = { $gte: nowIso };
                } else if (status === "past") {
                        filter.date = { $lt: nowIso };
                }

                const client = await clientPromise;
                const db = client.db(DATABASE_NAME);

                const bookings = await db
                        .collection("bookings")
                        .find(filter)
                        .sort({ createdAt: -1 })
                        .toArray();

                return NextResponse.json(bookings);
        } catch (err: any) {
                const status = getAdminErrorStatus(err);
                return NextResponse.json({ error: err?.message || "Failed to fetch bookings" }, { status });
        }
}

export async function DELETE(request: Request) {
        try {
                await requireAdminSession();
                const body = await request.json();
                const ids = body?.ids as string[];

                if (!Array.isArray(ids) || ids.length === 0) {
                        return NextResponse.json({ error: "Invalid booking IDs" }, { status: 400 });
                }

                const objectIds = ids
                        .filter((id) => ObjectId.isValid(id))
                        .map((id) => new ObjectId(id));

                if (objectIds.length === 0) {
                        return NextResponse.json({ error: "No valid booking IDs provided" }, { status: 400 });
                }

                const client = await clientPromise;
                const db = client.db(DATABASE_NAME);

                const result = await db.collection("bookings").deleteMany({ _id: { $in: objectIds } });

                return NextResponse.json({ success: true, deletedCount: result.deletedCount });
        } catch (err: any) {
                const status = getAdminErrorStatus(err);
                return NextResponse.json({ error: err?.message || "Failed to delete bookings" }, { status });
        }
}
