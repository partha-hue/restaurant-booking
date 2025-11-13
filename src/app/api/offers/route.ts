import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("foodhub");
    const offers = await db.collection("offers").find({}).toArray();

    return NextResponse.json(offers);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { restaurantId, restaurantName, offerTitle, offerDescription, offerImage, validUntil } = body;

    if (!restaurantId || !restaurantName || !offerTitle || !offerDescription || !offerImage || !validUntil) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("foodhub");
    const newOffer = {
      restaurantId,
      restaurantName,
      offerTitle,
      offerDescription,
      offerImage,
      validUntil,
      createdAt: new Date()
    };

    await db.collection("offers").insertOne(newOffer);

    return NextResponse.json({ message: "Offer added successfully", offer: newOffer });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add offer" }, { status: 500 });
  }
}
