import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAdminErrorStatus, requireAdminSession } from "@/lib/adminAuth";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const offers = await db.collection("offers").find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(offers);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdminSession();

    const body = await req.json();
    const {
      title,
      description,
      discountType,
      discountValue,
      minimumOrder,
      maximumDiscount,
      startDate,
      endDate,
      applicableTo,
      restaurantIds,
      usageLimit,
      usagePerUser,
      isActive
    } = body;

    // Validation
    if (!title || !description || !discountType || !discountValue || !startDate || !endDate) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json({ error: "Percentage discount must be between 0 and 100" }, { status: 400 });
    }

    if (discountType === 'fixed' && discountValue < 0) {
      return NextResponse.json({ error: "Fixed discount must be positive" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);

    const newOffer = {
      title,
      description,
      discountType,
      discountValue: Number(discountValue),
      minimumOrder: Number(minimumOrder) || 0,
      maximumDiscount: Number(maximumDiscount) || 0,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      applicableTo: applicableTo || 'all',
      restaurantIds: restaurantIds || [],
      usageLimit: Number(usageLimit) || 0,
      usagePerUser: Number(usagePerUser) || 1,
      usageCount: 0,
      isActive: isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("offers").insertOne(newOffer);

    return NextResponse.json({
      message: "Offer created successfully",
      offer: { ...newOffer, _id: result.insertedId }
    });
  } catch (err: any) {
    const status = getAdminErrorStatus(err);
    return NextResponse.json({ error: err?.message || "Failed to create offer" }, { status });
  }
}

