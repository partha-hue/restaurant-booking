"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Activity, Building2, Calendar, Tag, Users } from "lucide-react";

type Stats = {
        users: number;
        restaurants: number;
        bookings: number;
        offers: number;
        revenue: number;
};

export default function AdminAnalyticsPage() {
        const [stats, setStats] = useState<Stats>({ users: 0, restaurants: 0, bookings: 0, offers: 0, revenue: 0 });
        const [loading, setLoading] = useState(true);

        useEffect(() => {
                void loadStats();
        }, []);

        const loadStats = async () => {
                try {
                        const [usersRes, restaurantsRes, bookingsRes, offersRes] = await Promise.all([
                                fetch("/api/admin/stats/users", { cache: "no-store" }),
                                fetch("/api/admin/stats/restaurants", { cache: "no-store" }),
                                fetch("/api/admin/stats/bookings", { cache: "no-store" }),
                                fetch("/api/admin/stats/offers", { cache: "no-store" }),
                        ]);

                        const users = await usersRes.json();
                        const restaurants = await restaurantsRes.json();
                        const bookings = await bookingsRes.json();
                        const offers = await offersRes.json();

                        setStats({
                                users: users.total || 0,
                                restaurants: restaurants.total || 0,
                                bookings: bookings.total || 0,
                                offers: offers.total || 0,
                                revenue: bookings.monthlyRevenue || 0,
                        });
                } finally {
                        setLoading(false);
                }
        };

        const cards = [
                { label: "Users", value: stats.users, icon: Users },
                { label: "Restaurants", value: stats.restaurants, icon: Building2 },
                { label: "Bookings", value: stats.bookings, icon: Calendar },
                { label: "Active Offers", value: stats.offers, icon: Tag },
                { label: "Estimated Monthly Revenue", value: `$${stats.revenue}`, icon: Activity },
        ];

        return (
                <AdminLayout>
                        <div className="px-4 py-8 sm:px-6 lg:px-8">
                                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                                <p className="text-sm text-gray-600 mt-1">Operational KPIs for day-to-day admin decisions.</p>

                                {loading ? (
                                        <div className="mt-8 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
                                        </div>
                                ) : (
                                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                                {cards.map((card) => (
                                                        <div key={card.label} className="bg-white rounded-lg shadow p-5">
                                                                <div className="flex items-center justify-between">
                                                                        <p className="text-sm text-gray-500">{card.label}</p>
                                                                        <card.icon className="h-5 w-5 text-indigo-600" />
                                                                </div>
                                                                <p className="mt-2 text-2xl font-semibold text-gray-900">{card.value}</p>
                                                        </div>
                                                ))}
                                        </div>
                                )}
                        </div>
                </AdminLayout>
        );
}
