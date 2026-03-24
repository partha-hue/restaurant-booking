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

            const users = await db.collection("users")
                  .find({})
                  .sort({ createdAt: -1 })
                  .toArray();

            return NextResponse.json(users);
      } catch (err: any) {
            const status = err?.name === "Unauthorized" ? 403 : 500;
            return NextResponse.json({ error: err?.message || "Failed to fetch users" }, { status });
      }
}

export async function PATCH(request: Request) {
      try {
            await requireAdmin();
            const { userId, action } = await request.json();

            if (!userId || !action) {
                  return NextResponse.json({ error: "User ID and action are required" }, { status: 400 });
            }

            const client = await clientPromise;
            const db = client.db(DATABASE_NAME);

            let updateData;
            if (action === 'activate') {
                  updateData = { isActive: true };
            } else if (action === 'deactivate') {
                  updateData = { isActive: false };
            } else {
                  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
            }

            const result = await db.collection("users").updateOne(
                  { _id: userId },
                  { $set: updateData }
            );

            if (result.matchedCount === 0) {
                  return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            return NextResponse.json({ success: true });
      } catch (err: any) {
            const status = err?.name === "Unauthorized" ? 403 : 500;
            return NextResponse.json({ error: err?.message || "Failed to update user" }, { status });
      }
}

export async function DELETE(request: Request) {
      try {
            await requireAdmin();
            const { userId } = await request.json();

            if (!userId) {
                  return NextResponse.json({ error: "User ID is required" }, { status: 400 });
            }

            const client = await clientPromise;
            const db = client.db(DATABASE_NAME);

            const result = await db.collection("users").deleteOne({ _id: userId });

            if (result.deletedCount === 0) {
                  return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            return NextResponse.json({ success: true });
      } catch (err: any) {
            const status = err?.name === "Unauthorized" ? 403 : 500;
            return NextResponse.json({ error: err?.message || "Failed to delete user" }, { status });
      }
}