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
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const offers = await db.collection("offers").find({}).toArray();

    return NextResponse.json(offers);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { restaurantId, restaurantName, offerTitle, offerDescription, offerImage, validUntil } = body;

    if (!restaurantId || !restaurantName || !offerTitle || !offerDescription || !offerImage || !validUntil) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const newOffer = {
      restaurantId,
      restaurantName,
      offerTitle,
      offerDescription,
      offerImage,
      validUntil,
      createdAt: new Date(),
    };

    await db.collection("offers").insertOne(newOffer);

    return NextResponse.json({ message: "Offer added successfully", offer: newOffer });
  } catch (err: any) {
    const status = err?.name === "Unauthorized" ? 403 : 500;
    return NextResponse.json({ error: err?.message || "Failed to add offer" }, { status });
  }
}

