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

            // Count active offers (not expired)
            const now = new Date();
            const total = await db.collection("offers").countDocuments({
                  validUntil: { $gte: now.toISOString() }
            });

            return NextResponse.json({ total });
      } catch (err: any) {
            const status = err?.name === "Unauthorized" ? 403 : 500;
            return NextResponse.json({ error: err?.message || "Failed to fetch offer stats" }, { status });
      }
}