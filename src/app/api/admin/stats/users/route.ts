import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAdminErrorStatus, requireAdminSession } from "@/lib/adminAuth";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

export async function GET() {
      try {
            await requireAdminSession();
            const client = await clientPromise;
            const db = client.db(DATABASE_NAME);

            const total = await db.collection("users").countDocuments();

            // Get recent users (last 10)
            const recent = await db.collection("users")
                  .find({})
                  .sort({ createdAt: -1 })
                  .limit(10)
                  .toArray();

            return NextResponse.json({ total, recent });
      } catch (err: any) {
            const status = getAdminErrorStatus(err);
            return NextResponse.json({ error: err?.message || "Failed to fetch user stats" }, { status });
      }
}