"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface OrderItem {
        itemId: string;
        name: string;
        price: number;
        qty: number;
}

export default function OrdersPage() {
        const { data: session } = useSession();
        const [orders, setOrders] = useState<any[]>([]);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
                if (!session?.user) return;
                setLoading(true);
                fetch('/api/orders?mine=true')
                        .then((r) => r.json())
                        .then((data) => setOrders(Array.isArray(data) ? data : []))
                        .catch(() => setOrders([]))
                        .finally(() => setLoading(false));
        }, [session]);

        if (!session) return <div className="p-6">Please login to see your orders.</div>;

        return (
                <main className="max-w-4xl mx-auto p-6">
                        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
                        {loading ? (
                                <p>Loading...</p>
                        ) : orders.length === 0 ? (
                                <p className="text-gray-600">You have no orders yet.</p>
                        ) : (
                                <div className="space-y-4">
                                        {orders.map((o) => (
                                                <div key={o._id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <div className="font-semibold">Order #{o._id}</div>
                                                                        <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                                                                </div>
                                                                <div className="font-bold">₹{o.total?.toFixed?.(2) ?? o.total}</div>
                                                        </div>
                                                        <div className="mt-3">
                                                                {o.items.map((it: OrderItem) => (
                                                                        <div key={it.itemId} className="flex justify-between text-sm">
                                                                                <div>{it.name} x {it.qty}</div>
                                                                                <div>₹{(it.price * it.qty).toFixed(2)}</div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        )}
                </main>
        );
}
