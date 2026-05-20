import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconection";
import Cart from "@/models/cart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
        try {
                const session = await getServerSession(authOptions as any);
                if (!session?.user?.id) return NextResponse.json({ items: [] });

                await dbConnect();
                const existing = await Cart.findOne({ userId: session.user.id });
                return NextResponse.json({ items: existing?.items || [] });
        } catch (error) {
                console.error("GET cart error:", error);
                return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
        }
}

export async function PUT(req: Request) {
        try {
                const session = await getServerSession(authOptions as any);
                if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

                const body = await req.json();
                const { items } = body;
                if (!Array.isArray(items)) return NextResponse.json({ error: "Invalid items" }, { status: 400 });

                await dbConnect();
                const updated = await Cart.findOneAndUpdate(
                        { userId: session.user.id },
                        { items, updatedAt: new Date() },
                        { upsert: true, new: true }
                );

                return NextResponse.json({ success: true, items: updated.items });
        } catch (error) {
                console.error("PUT cart error:", error);
                return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
        }
}

export async function DELETE(req: Request) {
        try {
                const session = await getServerSession(authOptions as any);
                if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

                await dbConnect();
                await Cart.deleteOne({ userId: session.user.id });
                return NextResponse.json({ success: true });
        } catch (error) {
                console.error("DELETE cart error:", error);
                return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
        }
}
