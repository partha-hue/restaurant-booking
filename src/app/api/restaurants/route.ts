import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

export async function POST(request: NextRequest) {
      try {
            const body = await request.json();
            const client = await clientPromise;
            const db = client.db(DATABASE_NAME);
            const result = await db.collection("restaurants").insertOne(body);
            return NextResponse.json({ success: true, id: result.insertedId });
      } catch (error: any) {
            console.error("API /api/restaurants POST error:", error);
            return NextResponse.json({ error: "Failed to add restaurant", details: error?.message || String(error) }, { status: 500 });
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
