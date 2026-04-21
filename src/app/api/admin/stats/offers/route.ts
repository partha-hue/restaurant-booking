import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAdminErrorStatus, requireAdminSession } from "@/lib/adminAuth";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

export async function GET() {
      try {
            await requireAdminSession();
            const client = await clientPromise;
            const db = client.db(DATABASE_NAME);

            const now = new Date();
            const total = await db.collection("offers").countDocuments({
                  isActive: true,
                  endDate: { $gte: now }
            });

            return NextResponse.json({ total });
      } catch (err: any) {
            const status = getAdminErrorStatus(err);
            return NextResponse.json({ error: err?.message || "Failed to fetch offer stats" }, { status });
      }
}