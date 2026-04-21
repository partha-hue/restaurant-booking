import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAdminErrorStatus, requireAdminSession } from "@/lib/adminAuth";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

export async function GET() {
      try {
            await requireAdminSession();
            const client = await clientPromise;
            const db = client.db(DATABASE_NAME);

            const total = await db.collection("bookings").countDocuments();

            // Get recent bookings (last 10)
            const recent = await db.collection("bookings")
                  .find({})
                  .sort({ createdAt: -1 })
                  .limit(10)
                  .toArray();

            // Calculate monthly revenue (simplified - assuming $50 per booking)
            const currentMonth = new Date();
            currentMonth.setDate(1);
            currentMonth.setHours(0, 0, 0, 0);

            const monthlyBookings = await db.collection("bookings")
                  .countDocuments({ createdAt: { $gte: currentMonth } });

            const monthlyRevenue = monthlyBookings * 50; // Simplified pricing

            return NextResponse.json({ total, recent, monthlyRevenue });
      } catch (err: any) {
            const status = getAdminErrorStatus(err);
            return NextResponse.json({ error: err?.message || "Failed to fetch booking stats" }, { status });
      }
}