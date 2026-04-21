"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import {
      Calendar,
      Search,
      Filter,
      Eye,
      Trash2,
      Phone,
      Mail,
      User,
      MapPin
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Booking {
      _id: string;
      restaurantId: string;
      restaurantName: string;
      name: string;
      phone: string;
      date: string;
      guests: number;
      payment: string;
      createdAt: string;
}

export default function AdminBookings() {
      const router = useRouter();
      const { data: session, status } = useSession();
      const [bookings, setBookings] = useState<Booking[]>([]);
      const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
      const [loading, setLoading] = useState(true);
      const [searchTerm, setSearchTerm] = useState("");
      const [statusFilter, setStatusFilter] = useState("all");
      const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

      useEffect(() => {
            if (status === "unauthenticated") {
                  router.replace("/login");
            }
      }, [status, router]);

      useEffect(() => {
            if (status === "authenticated") {
                  fetchBookings();
            }
      }, [status]);

      useEffect(() => {
            let filtered = bookings;

            // Apply search filter
            if (searchTerm) {
                  filtered = filtered.filter(booking =>
                        booking.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        booking.phone.includes(searchTerm)
                  );
            }

            // Apply status filter (simplified - could be expanded with actual status field)
            if (statusFilter !== "all") {
                  const now = new Date();
                  const bookingDate = new Date();
                  filtered = filtered.filter(booking => {
                        const bookingDateTime = new Date(booking.date);
                        if (statusFilter === "upcoming") return bookingDateTime > now;
                        if (statusFilter === "past") return bookingDateTime < now;
                        return true;
                  });
            }

            setFilteredBookings(filtered);
      }, [bookings, searchTerm, statusFilter]);

      const fetchBookings = async () => {
            try {
                  const res = await fetch("/api/admin/bookings", { cache: "no-store" });
                  if (!res.ok) throw new Error("Failed to fetch bookings");
                  const data = await res.json();
                  setBookings(data);
            } catch (error) {
                  console.error("Failed to fetch bookings:", error);
                  toast.error("Failed to load bookings");
            } finally {
                  setLoading(false);
            }
      };

      const handleDelete = async (ids: string[]) => {
            if (!confirm(`Are you sure you want to delete ${ids.length} booking(s)?`)) return;

            setDeleteLoading(ids[0]);
            try {
                  const res = await fetch("/api/admin/bookings", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ids }),
                  });

                  if (!res.ok) throw new Error("Failed to delete bookings");

                  setBookings(prev => prev.filter(b => !ids.includes(b._id)));
                  toast.success(`${ids.length} booking(s) deleted successfully`);
            } catch (error) {
                  console.error("Failed to delete bookings:", error);
                  toast.error("Failed to delete bookings");
            } finally {
                  setDeleteLoading(null);
            }
      };

      const getStatusBadge = (booking: Booking) => {
            const now = new Date();
            const bookingDate = new Date(booking.date);

            if (bookingDate > now) {
                  return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Upcoming
                        </span>
                  );
            } else {
                  return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Completed
                        </span>
                  );
            }
      };

      const getPaymentBadge = (payment: string) => {
            const colors = {
                  offline: "bg-blue-100 text-blue-800",
                  gpay: "bg-green-100 text-green-800",
                  phonepe: "bg-purple-100 text-purple-800",
                  paytm: "bg-blue-100 text-blue-800",
                  bank: "bg-gray-100 text-gray-800",
            };

            return (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[payment as keyof typeof colors] || colors.bank}`}>
                        {payment.charAt(0).toUpperCase() + payment.slice(1)}
                  </span>
            );
      };

      if (status === "loading" || loading) {
            return (
                  <AdminLayout>
                        <div className="flex items-center justify-center h-64">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                  </AdminLayout>
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

      return (
            <AdminLayout>
                  <Toaster position="top-right" />
                  <div className="px-4 py-8 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center sm:justify-between mb-8">
                              <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                                    <p className="mt-1 text-sm text-gray-600">
                                          Manage and monitor all restaurant bookings.
                                    </p>
                              </div>
                        </div>

                        {/* Filters */}
                        <div className="mb-6 flex flex-col sm:flex-row gap-4">
                              <div className="flex-1">
                                    <div className="relative">
                                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-5 w-5 text-gray-400" />
                                          </div>
                                          <input
                                                type="text"
                                                placeholder="Search bookings..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                          />
                                    </div>
                              </div>

                              <div className="sm:w-48">
                                    <select
                                          value={statusFilter}
                                          onChange={(e) => setStatusFilter(e.target.value)}
                                          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                          <option value="all">All Bookings</option>
                                          <option value="upcoming">Upcoming</option>
                                          <option value="past">Past</option>
                                    </select>
                              </div>
                        </div>

                        {/* Bookings Table */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                              <ul className="divide-y divide-gray-200">
                                    {filteredBookings.map((booking) => (
                                          <li key={booking._id}>
                                                <div className="px-4 py-4 sm:px-6">
                                                      <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                  <div className="flex-shrink-0">
                                                                        <Calendar className="h-8 w-8 text-gray-400" />
                                                                  </div>
                                                                  <div className="ml-4">
                                                                        <div className="flex items-center">
                                                                              <h4 className="text-sm font-medium text-gray-900">
                                                                                    {booking.restaurantName}
                                                                              </h4>
                                                                              <div className="ml-2 flex space-x-2">
                                                                                    {getStatusBadge(booking)}
                                                                                    {getPaymentBadge(booking.payment)}
                                                                              </div>
                                                                        </div>
                                                                        <div className="mt-1 flex items-center text-sm text-gray-600">
                                                                              <User className="flex-shrink-0 mr-1 h-4 w-4" />
                                                                              {booking.name}
                                                                              <Phone className="flex-shrink-0 ml-4 mr-1 h-4 w-4" />
                                                                              {booking.phone}
                                                                        </div>
                                                                        <div className="mt-1 flex items-center text-sm text-gray-500">
                                                                              <Calendar className="flex-shrink-0 mr-1 h-4 w-4" />
                                                                              {new Date(booking.date).toLocaleDateString()} • {booking.guests} guests
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                  <button
                                                                        onClick={() => {/* View booking details */ }}
                                                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                  >
                                                                        <Eye className="h-4 w-4 mr-1" />
                                                                        View
                                                                  </button>
                                                                  <button
                                                                        onClick={() => handleDelete([booking._id])}
                                                                        disabled={deleteLoading === booking._id}
                                                                        className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                                  >
                                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                                        {deleteLoading === booking._id ? 'Deleting...' : 'Delete'}
                                                                  </button>
                                                            </div>
                                                      </div>
                                                      <div className="mt-2 text-xs text-gray-500">
                                                            Booked on {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString()}
                                                      </div>
                                                </div>
                                          </li>
                                    ))}
                              </ul>

                              {filteredBookings.length === 0 && (
                                    <div className="text-center py-12">
                                          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                                          <p className="mt-1 text-sm text-gray-500">
                                                {searchTerm || statusFilter !== "all"
                                                      ? 'Try adjusting your search or filter criteria.'
                                                      : 'No bookings have been made yet.'}
                                          </p>
                                    </div>
                              )}
                        </div>

                        {/* Bulk Actions */}
                        {filteredBookings.length > 0 && (
                              <div className="mt-6 flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                          Showing {filteredBookings.length} of {bookings.length} bookings
                                    </div>
                                    <div className="flex space-x-3">
                                          <button
                                                onClick={() => {
                                                      const selectedIds = filteredBookings.slice(0, 10).map(b => b._id); // Example: first 10
                                                      if (selectedIds.length > 0) {
                                                            handleDelete(selectedIds);
                                                      }
                                                }}
                                                className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                          >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete All Filtered
                                          </button>
                                    </div>
                              </div>
                        )}
                  </div>
            </AdminLayout>
      );
}