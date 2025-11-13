import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
      try {
            const body = await request.json();
            const client = await clientPromise;
            const db = client.db();
            const result = await db.collection("restaurants").insertOne(body);
            return NextResponse.json({ success: true, id: result.insertedId });
      } catch (error) {
            return NextResponse.json({ error: "Failed to add restaurant" }, { status: 500 });
      }
}

export async function GET() {
      try {
            const client = await clientPromise;
            const db = client.db();
            const restaurants = await db.collection("restaurants").find({}).toArray();
            return NextResponse.json(restaurants);
      } catch (error: any) {
            console.error("API /api/restaurants error:", error);
            return NextResponse.json({ error: "Failed to fetch restaurants", details: error?.message || String(error) }, { status: 500 });
      }
}
