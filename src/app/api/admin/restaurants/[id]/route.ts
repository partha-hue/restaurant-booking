import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getAdminErrorStatus, requireAdminSession } from "@/lib/adminAuth";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

export async function GET(
        _request: NextRequest,
        { params }: { params: { id: string } }
) {
        try {
                await requireAdminSession();
                const restaurantId = params.id;

                if (!ObjectId.isValid(restaurantId)) {
                        return NextResponse.json({ error: "Invalid restaurant ID" }, { status: 400 });
                }

                const client = await clientPromise;
                const db = client.db(DATABASE_NAME);
                const restaurant = await db
                        .collection("restaurants")
                        .findOne({ _id: new ObjectId(restaurantId) });

                if (!restaurant) {
                        return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
                }

                return NextResponse.json(restaurant);
        } catch (err: any) {
                const status = getAdminErrorStatus(err);
                return NextResponse.json({ error: err?.message || "Failed to fetch restaurant" }, { status });
        }
}

export async function PUT(
        request: NextRequest,
        { params }: { params: { id: string } }
) {
        try {
                await requireAdminSession();
                const restaurantId = params.id;

                if (!ObjectId.isValid(restaurantId)) {
                        return NextResponse.json({ error: "Invalid restaurant ID" }, { status: 400 });
                }

                const body = await request.json();
                const payload = {
                        ...body,
                        rating: Number(body.rating) || 0,
                        updatedAt: new Date(),
                };

                const client = await clientPromise;
                const db = client.db(DATABASE_NAME);
                const result = await db
                        .collection("restaurants")
                        .updateOne({ _id: new ObjectId(restaurantId) }, { $set: payload });

                if (result.matchedCount === 0) {
                        return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
                }

                return NextResponse.json({ success: true });
        } catch (err: any) {
                const status = getAdminErrorStatus(err);
                return NextResponse.json({ error: err?.message || "Failed to update restaurant" }, { status });
        }
}

export async function DELETE(
        _request: NextRequest,
        { params }: { params: { id: string } }
) {
        try {
                await requireAdminSession();
                const restaurantId = params.id;

                if (!ObjectId.isValid(restaurantId)) {
                        return NextResponse.json({ error: "Invalid restaurant ID" }, { status: 400 });
                }

                const client = await clientPromise;
                const db = client.db(DATABASE_NAME);
                const result = await db
                        .collection("restaurants")
                        .deleteOne({ _id: new ObjectId(restaurantId) });

                if (result.deletedCount === 0) {
                        return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
                }

                return NextResponse.json({ success: true });
        } catch (err: any) {
                const status = getAdminErrorStatus(err);
                return NextResponse.json({ error: err?.message || "Failed to delete restaurant" }, { status });
        }
}
