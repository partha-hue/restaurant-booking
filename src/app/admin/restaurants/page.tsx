"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import {
      Building2,
      Plus,
      Edit,
      Trash2,
      Search,
      Star,
      MapPin,
      Eye
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Restaurant {
      _id: string;
      name?: string;
      location?: string;
      rating: number;
      details: string;
      image?: string;
      createdAt?: string;
}

export default function AdminRestaurants() {
      const router = useRouter();
      const { data: session, status } = useSession();
      const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
      const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
      const [loading, setLoading] = useState(true);
      const [searchTerm, setSearchTerm] = useState("");
      const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

      useEffect(() => {
            if (status === "unauthenticated") {
                  router.replace("/login");
            }
      }, [status, router]);

      useEffect(() => {
            if (status === "authenticated") {
                  fetchRestaurants();
            }
      }, [status]);

      useEffect(() => {
            const normalizedSearch = searchTerm.toLowerCase();
            const filtered = restaurants.filter((restaurant) => {
                  const name = (restaurant.name || "").toLowerCase();
                  const location = (restaurant.location || "").toLowerCase();
                  return name.includes(normalizedSearch) || location.includes(normalizedSearch);
            });
            setFilteredRestaurants(filtered);
      }, [restaurants, searchTerm]);

      const fetchRestaurants = async () => {
            try {
                  const res = await fetch("/api/restaurants");
                  if (!res.ok) throw new Error("Failed to fetch restaurants");
                  const data = await res.json();
                  setRestaurants(data);
            } catch (error) {
                  console.error("Failed to fetch restaurants:", error);
                  toast.error("Failed to load restaurants");
            } finally {
                  setLoading(false);
            }
      };

      const handleDelete = async (id: string) => {
            if (!confirm("Are you sure you want to delete this restaurant?")) return;

            setDeleteLoading(id);
            try {
                  const res = await fetch(`/api/admin/restaurants/${id}`, {
                        method: "DELETE",
                  });

                  if (!res.ok) throw new Error("Failed to delete restaurant");

                  setRestaurants(prev => prev.filter(r => r._id !== id));
                  toast.success("Restaurant deleted successfully");
            } catch (error) {
                  console.error("Failed to delete restaurant:", error);
                  toast.error("Failed to delete restaurant");
            } finally {
                  setDeleteLoading(null);
            }
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
                                    <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
                                    <p className="mt-1 text-sm text-gray-600">
                                          Manage your restaurant listings and information.
                                    </p>
                              </div>
                              <div className="mt-4 sm:mt-0">
                                    <button
                                          onClick={() => router.push('/admin/restaurants/new')}
                                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                          <Plus className="h-5 w-5 mr-2" />
                                          Add Restaurant
                                    </button>
                              </div>
                        </div>

                        {/* Search */}
                        <div className="mb-6">
                              <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                          <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                          type="text"
                                          placeholder="Search restaurants..."
                                          value={searchTerm}
                                          onChange={(e) => setSearchTerm(e.target.value)}
                                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                              </div>
                        </div>

                        {/* Restaurants Grid */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                              {filteredRestaurants.map((restaurant) => (
                                    <div key={restaurant._id} className="bg-white overflow-hidden shadow rounded-lg">
                                          <div className="relative">
                                                <img
                                                      src={restaurant.image || '/layer1.jpg'}
                                                      alt={restaurant.name || 'Restaurant image'}
                                                      className="w-full h-48 object-cover"
                                                />
                                                <div className="absolute top-2 right-2">
                                                      <div className="flex items-center bg-white rounded-full px-2 py-1 shadow">
                                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                            <span className="ml-1 text-sm font-medium text-gray-900">
                                                                  {restaurant.rating}
                                                            </span>
                                                      </div>
                                                </div>
                                          </div>

                                          <div className="p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                      <h3 className="text-lg font-medium text-gray-900 truncate">
                                                            {restaurant.name || 'Unnamed Restaurant'}
                                                      </h3>
                                                </div>

                                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                                      <MapPin className="h-4 w-4 mr-1" />
                                                      {restaurant.location || 'Location not provided'}
                                                </div>

                                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                                      {restaurant.details}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                      <button
                                                            onClick={() => router.push(`/restaurants/${restaurant._id}`)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                      >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View
                                                      </button>

                                                      <div className="flex space-x-2">
                                                            <button
                                                                  onClick={() => router.push(`/admin/restaurants/${restaurant._id}/edit`)}
                                                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            >
                                                                  <Edit className="h-4 w-4 mr-1" />
                                                                  Edit
                                                            </button>

                                                            <button
                                                                  onClick={() => handleDelete(restaurant._id)}
                                                                  disabled={deleteLoading === restaurant._id}
                                                                  className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                            >
                                                                  <Trash2 className="h-4 w-4 mr-1" />
                                                                  {deleteLoading === restaurant._id ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              ))}
                        </div>

                        {filteredRestaurants.length === 0 && !loading && (
                              <div className="text-center py-12">
                                    <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No restaurants found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                          {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new restaurant.'}
                                    </p>
                                    {!searchTerm && (
                                          <div className="mt-6">
                                                <button
                                                      onClick={() => router.push('/admin/restaurants/new')}
                                                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                      <Plus className="h-5 w-5 mr-2" />
                                                      Add Restaurant
                                                </button>
                                          </div>
                                    )}
                              </div>
                        )}
                  </div>
            </AdminLayout>
      );
}