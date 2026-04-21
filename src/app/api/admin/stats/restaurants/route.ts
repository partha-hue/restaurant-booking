import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAdminErrorStatus, requireAdminSession } from "@/lib/adminAuth";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

export async function GET() {
      try {
            await requireAdminSession();
            const client = await clientPromise;
            const db = client.db(DATABASE_NAME);

            const total = await db.collection("restaurants").countDocuments();

            // Calculate average rating
            const restaurants = await db.collection("restaurants").find({}).toArray();
            const averageRating = restaurants.length > 0
                  ? restaurants.reduce((sum, r) => sum + (parseFloat(r.rating) || 0), 0) / restaurants.length
                  : 0;

            return NextResponse.json({
                  total,
                  averageRating: Math.round(averageRating * 10) / 10
            });
      } catch (err: any) {
            const status = getAdminErrorStatus(err);
            return NextResponse.json({ error: err?.message || "Failed to fetch restaurant stats" }, { status });
      }
}