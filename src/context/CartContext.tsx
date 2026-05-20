"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export interface CartItem {
        id: string;
        name: string;
        price: number;
        qty: number;
        restaurantId?: string;
        restaurantName?: string;
        meta?: Record<string, any>;
}

interface CartContextValue {
        items: CartItem[];
        addItem: (item: CartItem, qty?: number) => void;
        removeItem: (id: string) => void;
        updateQty: (id: string, qty: number) => void;
        clearCart: () => void;
        totalItems: number;
        totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "foodhub_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
        const { data: session } = useSession();
        const [synced, setSynced] = useState(false);

        // Initialize items synchronously from localStorage so they appear immediately after refresh
        const [items, setItems] = useState<CartItem[]>(() => {
                try {
                        const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
                        return raw ? JSON.parse(raw) : [];
                } catch (e) {
                        return [];
                }
        });

        // On session available, fetch server cart and merge once (use localStorage snapshot to avoid stale closure)
        useEffect(() => {
                let mounted = true;
                async function syncFromServer() {
                        if (!session?.user?.id || synced) return;
                        try {
                                const res = await fetch('/api/cart');
                                if (!res.ok) return;
                                const data = await res.json();
                                const serverItems: CartItem[] = data.items || [];
                                if (!mounted) return;

                                // read latest local items from localStorage to avoid stale `items` capture
                                let localItems: CartItem[] = [];
                                try {
                                        const raw = localStorage.getItem(STORAGE_KEY);
                                        if (raw) localItems = JSON.parse(raw);
                                } catch (e) {
                                        localItems = [];
                                }

                                // merge local and server (sum quantities)
                                const map = new Map<string, CartItem>();
                                [...localItems, ...serverItems].forEach((it) => {
                                        const existing = map.get(it.id);
                                        if (existing) existing.qty = existing.qty + it.qty;
                                        else map.set(it.id, { ...it });
                                });
                                const merged = Array.from(map.values());
                                setItems(merged);
                                // save merged to server
                                await fetch('/api/cart', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: merged }) });
                                setSynced(true);
                        } catch (e) {
                                // ignore
                        }
                }
                syncFromServer();
                return () => { mounted = false; };
        }, [session, synced]);

        useEffect(() => {
                try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
                } catch (e) {
                        // ignore
                }
        }, [items]);

        // save to server when user is signed in (debounced)
        useEffect(() => {
                if (!session?.user?.id) return;
                const t = setTimeout(() => {
                        fetch('/api/cart', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) }).catch(() => { });
                }, 700);
                return () => clearTimeout(t);
        }, [items, session]);

        const addItem = (item: CartItem, qty = 1) => {
                setItems((prev) => {
                        const idx = prev.findIndex((p) => p.id === item.id);
                        if (idx >= 0) {
                                const copy = [...prev];
                                copy[idx].qty = Math.max(1, copy[idx].qty + qty);
                                return copy;
                        }
                        return [...prev, { ...item, qty }];
                });
        };

        const removeItem = (id: string) => {
                setItems((prev) => prev.filter((i) => i.id !== id));
        };

        const updateQty = (id: string, qty: number) => {
                setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
        };

        const clearCart = () => setItems([]);

        const totalItems = items.reduce((s, i) => s + i.qty, 0);
        const totalPrice = items.reduce((s, i) => s + i.qty * i.price, 0);

        return (
                <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
                        {children}
                </CartContext.Provider>
        );
}

export function useCart() {
        const ctx = useContext(CartContext);
        if (!ctx) throw new Error("useCart must be used within CartProvider");
        return ctx;
}

export default CartContext;
