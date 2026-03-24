import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ObjectId } from "mongodb";

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

export async function GET(
      req: NextRequest,
      { params }: { params: { id: string } }
) {
      try {
            const client = await clientPromise;
            const db = client.db(DATABASE_NAME);

            const offer = await db.collection("offers").findOne({
                  _id: new ObjectId(params.id)
            });

            if (!offer) {
                  return NextResponse.json({ error: "Offer not found" }, { status: 404 });
            }

            return NextResponse.json(offer);
      } catch (err) {
            return NextResponse.json({ error: "Failed to fetch offer" }, { status: 500 });
      }
}

export async function PUT(
      req: NextRequest,
      { params }: { params: { id: string } }
) {
      try {
            await requireAdmin();

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

            const updateData = {
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
                  isActive: isActive !== false,
                  updatedAt: new Date(),
            };

            const result = await db.collection("offers").updateOne(
                  { _id: new ObjectId(params.id) },
                  { $set: updateData }
            );

            if (result.matchedCount === 0) {
                  return NextResponse.json({ error: "Offer not found" }, { status: 404 });
            }

            return NextResponse.json({
                  message: "Offer updated successfully",
                  offer: { ...updateData, _id: params.id }
            });
      } catch (err: any) {
            const status = err?.name === "Unauthorized" ? 403 : 500;
            return NextResponse.json({ error: err?.message || "Failed to update offer" }, { status });
      }
}

export async function DELETE(
      req: NextRequest,
      { params }: { params: { id: string } }
) {
      try {
            await requireAdmin();

            const client = await clientPromise;
            const db = client.db(DATABASE_NAME);

            const result = await db.collection("offers").deleteOne({
                  _id: new ObjectId(params.id)
            });

            if (result.deletedCount === 0) {
                  return NextResponse.json({ error: "Offer not found" }, { status: 404 });
            }

            return NextResponse.json({ message: "Offer deleted successfully" });
      } catch (err: any) {
            const status = err?.name === "Unauthorized" ? 403 : 500;
            return NextResponse.json({ error: err?.message || "Failed to delete offer" }, { status });
      }
}