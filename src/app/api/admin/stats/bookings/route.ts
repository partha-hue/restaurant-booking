import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

function isAdmin(email?: string | null) {
      const list = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@foodhub.com")
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
      return !!email && list.includes(email.toLowerCase());
}

async function requireAdmin() {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email || !isAdmin(session.user.email)) {
            const err = new Error("Unauthorized");
            // @ts-ignore
            err.name = "Unauthorized";
            throw err;
      }
}

export async function GET() {
      try {
            await requireAdmin();
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
            const status = err?.name === "Unauthorized" ? 403 : 500;
            return NextResponse.json({ error: err?.message || "Failed to fetch booking stats" }, { status });
      }
}