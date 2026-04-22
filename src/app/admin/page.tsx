"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminLayout from "./components/AdminLayout";
import {
      Users,
      Building2,
      Calendar,
      Tag,
      ShieldCheck,
      TrendingUp,
      DollarSign,
      Activity,
      Star
} from "lucide-react";

interface DashboardStats {
      totalUsers: number;
      totalRestaurants: number;
      totalBookings: number;
      totalOffers: number;
      recentBookings: any[];
      recentUsers: any[];
      monthlyRevenue: number;
      averageRating: number;
}

export default function AdminDashboard() {
      const router = useRouter();
      const { data: session, status } = useSession();
      const [stats, setStats] = useState<DashboardStats | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            if (status === "unauthenticated") {
                  router.replace("/login");
            }
      }, [status, router]);

      useEffect(() => {
            if (status === "authenticated") {
                  fetchDashboardStats();
            }
      }, [status]);

      const fetchDashboardStats = async () => {
            try {
                  const [usersRes, restaurantsRes, bookingsRes, offersRes] = await Promise.all([
                        fetch("/api/admin/stats/users"),
                        fetch("/api/admin/stats/restaurants"),
                        fetch("/api/admin/stats/bookings"),
                        fetch("/api/admin/stats/offers"),
                  ]);

                  const users = await usersRes.json();
                  const restaurants = await restaurantsRes.json();
                  const bookings = await bookingsRes.json();
                  const offers = await offersRes.json();

                  setStats({
                        totalUsers: users.total || 0,
                        totalRestaurants: restaurants.total || 0,
                        totalBookings: bookings.total || 0,
                        totalOffers: offers.total || 0,
                        recentBookings: bookings.recent || [],
                        recentUsers: users.recent || [],
                        monthlyRevenue: bookings.monthlyRevenue || 0,
                        averageRating: restaurants.averageRating || 0,
                  });
            } catch (error) {
                  console.error("Failed to fetch dashboard stats:", error);
            } finally {
                  setLoading(false);
            }
      };

      if (status === "loading" || loading) {
            return (
                  <div className="min-h-screen flex items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
                  </div>
            );
      }

      if (!session) {
            return (
                  <div className="min-h-screen flex items-center justify-center">
                        <div className="p-6 bg-white rounded-xl shadow">
                              <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
                              <p className="text-gray-600">You don't have permission to access the admin panel.</p>
                        </div>
                  </div>
            );
      }

      const statCards = [
            {
                  name: "Total Users",
                  value: stats?.totalUsers || 0,
                  icon: Users,
                  color: "bg-blue-500",
            },
            {
                  name: "Total Restaurants",
                  value: stats?.totalRestaurants || 0,
                  icon: Building2,
                  color: "bg-green-500",
            },
            {
                  name: "Total Bookings",
                  value: stats?.totalBookings || 0,
                  icon: Calendar,
                  color: "bg-purple-500",
            },
            {
                  name: "Active Offers",
                  value: stats?.totalOffers || 0,
                  icon: Tag,
                  color: "bg-yellow-500",
            },
            {
                  name: "Monthly Revenue",
                  value: `$${stats?.monthlyRevenue || 0}`,
                  icon: DollarSign,
                  color: "bg-indigo-500",
            },
            {
                  name: "Average Rating",
                  value: `${stats?.averageRating?.toFixed(1) || 0} ⭐`,
                  icon: Star,
                  color: "bg-pink-500",
            },
      ];

      return (
            <AdminLayout>
                  <div className="px-4 py-8 sm:px-6 lg:px-8">
                        <div className="mb-8">
                              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                              <p className="mt-1 text-sm text-gray-600">
                                    Welcome back, {session.user?.name}! Here's what's happening with your platform.
                              </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                              {statCards.map((stat) => (
                                    <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                                          <div className="p-5">
                                                <div className="flex items-center">
                                                      <div className="flex-shrink-0">
                                                            <div className={`p-3 rounded-md ${stat.color}`}>
                                                                  <stat.icon className="h-6 w-6 text-white" />
                                                            </div>
                                                      </div>
                                                      <div className="ml-5 w-0 flex-1">
                                                            <dl>
                                                                  <dt className="text-sm font-medium text-gray-500 truncate">
                                                                        {stat.name}
                                                                  </dt>
                                                                  <dd className="text-lg font-medium text-gray-900">
                                                                        {stat.value}
                                                                  </dd>
                                                            </dl>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              ))}
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                              {/* Recent Bookings */}
                              <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                                Recent Bookings
                                          </h3>
                                          <div className="space-y-4">
                                                {stats?.recentBookings?.slice(0, 5).map((booking: any) => (
                                                      <div key={booking._id} className="flex items-center space-x-3">
                                                            <div className="flex-shrink-0">
                                                                  <Calendar className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                  <p className="text-sm font-medium text-gray-900 truncate">
                                                                        {booking.restaurantName}
                                                                  </p>
                                                                  <p className="text-sm text-gray-500 truncate">
                                                                        {booking.name} • {booking.date}
                                                                  </p>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                        Confirmed
                                                                  </span>
                                                            </div>
                                                      </div>
                                                )) || (
                                                            <p className="text-sm text-gray-500">No recent bookings</p>
                                                      )}
                                          </div>
                                    </div>
                              </div>

                              {/* Recent Users */}
                              <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                                Recent Users
                                          </h3>
                                          <div className="space-y-4">
                                                {stats?.recentUsers?.slice(0, 5).map((user: any) => (
                                                      <div key={user._id} className="flex items-center space-x-3">
                                                            <div className="flex-shrink-0">
                                                                  <Users className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                  <p className="text-sm font-medium text-gray-900 truncate">
                                                                        {user.name}
                                                                  </p>
                                                                  <p className="text-sm text-gray-500 truncate">
                                                                        {user.email}
                                                                  </p>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                        Active
                                                                  </span>
                                                            </div>
                                                      </div>
                                                )) || (
                                                            <p className="text-sm text-gray-500">No recent users</p>
                                                      )}
                                          </div>
                                    </div>
                              </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-8">
                              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h2>
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <button
                                          onClick={() => router.push('/admin/restaurants/new')}
                                          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                                    >
                                          <Building2 className="h-8 w-8 text-green-600 mb-2" />
                                          <h3 className="text-sm font-medium text-gray-900">Add Restaurant</h3>
                                          <p className="text-sm text-gray-500">Create a new restaurant listing</p>
                                    </button>
                                    <button
                                          onClick={() => router.push('/admin/offers/new')}
                                          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                                    >
                                          <Tag className="h-8 w-8 text-yellow-600 mb-2" />
                                          <h3 className="text-sm font-medium text-gray-900">Create Offer</h3>
                                          <p className="text-sm text-gray-500">Add a new promotional offer</p>
                                    </button>
                                    <button
                                          onClick={() => router.push('/admin/requests')}
                                          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                                    >
                                          <ShieldCheck className="h-8 w-8 text-emerald-600 mb-2" />
                                          <h3 className="text-sm font-medium text-gray-900">Review Requests</h3>
                                          <p className="text-sm text-gray-500">Approve or reject admin access requests</p>
                                    </button>
                                    <button
                                          onClick={() => router.push('/admin/analytics')}
                                          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                                    >
                                          <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                                          <h3 className="text-sm font-medium text-gray-900">View Analytics</h3>
                                          <p className="text-sm text-gray-500">Detailed platform insights</p>
                                    </button>
                                    <button
                                          onClick={() => router.push('/admin/settings')}
                                          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                                    >
                                          <Activity className="h-8 w-8 text-purple-600 mb-2" />
                                          <h3 className="text-sm font-medium text-gray-900">System Settings</h3>
                                          <p className="text-sm text-gray-500">Configure platform settings</p>
                                    </button>
                              </div>
                        </div>
                  </div>
            </AdminLayout>
      );
}

