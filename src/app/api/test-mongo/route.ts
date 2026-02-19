import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({ 
      message: "Connected to MongoDB!", 
      collections 
    });
  } catch (error: any) {
    console.error("MongoDB test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
