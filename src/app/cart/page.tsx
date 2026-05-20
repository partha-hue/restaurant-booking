"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export default function CartPage() {
        const { items, updateQty, removeItem, clearCart, totalItems, totalPrice } = useCart();
        const router = useRouter();

        const handleCheckout = async () => {
                if (items.length === 0) return;
                try {
                        const res = await fetch("/api/orders", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ items, total: totalPrice }),
                        });
                        if (!res.ok) throw new Error("Checkout failed");
                        const data = await res.json();
                        clearCart();
                        router.push(`/bookings`);
                } catch (err) {
                        console.error(err);
                        alert("Checkout failed. Please try again.");
                }
        };

        return (
                <main className="max-w-4xl mx-auto p-6">
                        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

                        {items.length === 0 ? (
                                <p className="text-gray-600">Your cart is empty.</p>
                        ) : (
                                <div className="space-y-4">
                                        {(() => {
                                                // Group items by restaurantId (fall back to restaurantName)
                                                const groups: Record<string, { name: string; items: any[] }> = {} as any;
                                                items.forEach((it) => {
                                                        const key = it.restaurantId || it.restaurantName || (it.meta && (it.meta.restaurantId || it.meta.restaurantName)) || "_unknown";
                                                        if (!groups[key]) groups[key] = { name: it.restaurantName || it.meta?.restaurantName || "Unknown Restaurant", items: [] as any };
                                                        groups[key].items.push(it);
                                                });

                                                return Object.keys(groups).map((key) => (
                                                        <div key={key} className="space-y-2">
                                                                <h3 className="text-lg font-semibold">{groups[key].name}</h3>
                                                                <div className="space-y-2">
                                                                        {groups[key].items.map((it) => (
                                                                                <div key={it.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded shadow">
                                                                                        <div>
                                                                                                <div className="font-semibold">{it.name}</div>
                                                                                                <div className="text-sm text-gray-500">{it.meta?.description}</div>
                                                                                                <div className="text-sm text-gray-600 mt-1">₹{it.price.toFixed(2)}</div>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-2">
                                                                                                <Button size="icon" variant="outline" onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))} aria-label={`Decrease quantity for ${it.name}`}>
                                                                                                        -
                                                                                                </Button>
                                                                                                <div className="w-8 text-center">{it.qty}</div>
                                                                                                <Button size="icon" variant="outline" onClick={() => updateQty(it.id, it.qty + 1)} aria-label={`Increase quantity for ${it.name}`}>
                                                                                                        +
                                                                                                </Button>
                                                                                                <div className="ml-4 font-semibold">₹{(it.qty * it.price).toFixed(2)}</div>
                                                                                                <Button size="sm" variant="ghost" className="ml-4 text-red-500" onClick={() => removeItem(it.id)} aria-label={`Remove ${it.name}`}>
                                                                                                        Remove
                                                                                                </Button>
                                                                                        </div>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        </div>
                                                ));
                                        })()}

                                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded shadow">
                                                <div>
                                                        <div className="text-sm text-gray-500">Items</div>
                                                        <div className="font-semibold">{totalItems}</div>
                                                </div>
                                                <div className="text-right">
                                                        <div className="text-sm text-gray-500">Total</div>
                                                        <div className="text-xl font-bold">₹{totalPrice.toFixed(2)}</div>
                                                </div>
                                        </div>

                                        <div className="flex gap-3">
                                                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleCheckout}>Checkout</button>
                                                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => clearCart()}>Clear Cart</button>
                                        </div>
                                </div>
                        )}
                </main>
        );
}
