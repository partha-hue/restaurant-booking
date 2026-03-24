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
            const status = err?.name === "Unauthorized" ? 403 : 500;
            return NextResponse.json({ error: err?.message || "Failed to fetch restaurant stats" }, { status });
      }
}