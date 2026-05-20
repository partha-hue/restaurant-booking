import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconection";
import Order from "@/models/order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
        try {
                const session = await getServerSession(authOptions as any);
                const s = session as any;
                const body = await req.json();
                const { items, total } = body;
                if (!items || !Array.isArray(items) || items.length === 0) {
                        return NextResponse.json({ error: 'No items provided' }, { status: 400 });
                }

                await dbConnect();

                const order = new Order({
                        items: items.map((i: any) => ({ itemId: i.id, name: i.name, price: i.price, qty: i.qty, meta: i.meta })),
                        total,
                        userId: s?.user?.id,
                });
                const saved = await order.save();

                return NextResponse.json({ success: true, id: saved._id });
        } catch (error) {
                console.error('Create order error:', error);
                return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }
}

export async function GET(req: Request) {
        try {
                const url = new URL(req.url);
                const mine = url.searchParams.get("mine");
                await dbConnect();

                if (mine === "true") {
                        const session = await getServerSession(authOptions as any);
                        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                        const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(100);
                        return NextResponse.json(orders);
                }

                const orders = await Order.find({}).sort({ createdAt: -1 }).limit(50);
                return NextResponse.json(orders);
        } catch (error) {
                console.error('Fetch orders error:', error);
                return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
        }
}
