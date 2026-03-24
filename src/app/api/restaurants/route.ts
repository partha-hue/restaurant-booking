import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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

export async function POST(request: NextRequest) {
      try {
            await requireAdmin();
            const body = await request.json();
            const client = await clientPromise;
            const db = client.db(DATABASE_NAME);
            const result = await db.collection("restaurants").insertOne(body);
            return NextResponse.json({ success: true, id: result.insertedId });
      } catch (error: any) {
            console.error("API /api/restaurants POST error:", error);
            const status = error?.name === "Unauthorized" ? 403 : 500;
            return NextResponse.json({ error: "Failed to add restaurant", details: error?.message || String(error) }, { status });
      }
}

export async function GET() {
      try {
            const client = await clientPromise;
            const db = client.db(DATABASE_NAME);
            const restaurants = await db.collection("restaurants").find({}).toArray();
            return NextResponse.json(restaurants);
      } catch (error: any) {
            console.error("API /api/restaurants GET error:", error);
            return NextResponse.json({ error: "Failed to fetch restaurants", details: error?.message || String(error) }, { status: 500 });
      }
}

