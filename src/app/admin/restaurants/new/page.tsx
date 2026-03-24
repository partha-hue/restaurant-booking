"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";
import { ArrowLeft, Save, Upload } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@foodhub.com")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

export default function NewRestaurant() {
      const router = useRouter();
      const { data: session, status } = useSession();
      const [isAdmin, setIsAdmin] = useState(false);
      const [loading, setLoading] = useState(false);
      const [formData, setFormData] = useState({
            name: "",
            location: "",
            rating: "",
            details: "",
            image: "",
            cuisine: "",
            priceRange: "",
            phone: "",
            website: "",
            openingHours: "",
      });

      React.useEffect(() => {
            if (status === "authenticated") {
                  const email = session?.user?.email?.toLowerCase() || "";
                  setIsAdmin(ADMIN_EMAILS.includes(email));
            }
            if (status === "unauthenticated") {
                  router.replace("/login");
            }
      }, [status, session, router]);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);

            try {
                  // Validate required fields
                  if (!formData.name || !formData.location || !formData.rating || !formData.details) {
                        toast.error("Please fill in all required fields");
                        return;
                  }

                  const restaurantData = {
                        ...formData,
                        rating: parseFloat(formData.rating),
                        createdAt: new Date().toISOString(),
                  };

                  const res = await fetch("/api/restaurants", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(restaurantData),
                  });

                  const data = await res.json();

                  if (res.ok) {
                        toast.success("Restaurant added successfully!");
                        router.push("/admin/restaurants");
                  } else {
                        toast.error(data.error || "Failed to add restaurant");
                  }
            } catch (error) {
                  console.error("Failed to add restaurant:", error);
                  toast.error("Failed to add restaurant");
            } finally {
                  setLoading(false);
            }
      };

      if (status === "loading") {
            return (
                  <AdminLayout>
                        <div className="flex items-center justify-center h-64">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                  </AdminLayout>
            );
      }

      if (!session || !isAdmin) {
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
                        <div className="mb-8">
                              <button
                                    onClick={() => router.back()}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Restaurants
                              </button>
                        </div>

                        <div className="md:grid md:grid-cols-3 md:gap-6">
                              <div className="md:col-span-1">
                                    <div className="px-4 sm:px-0">
                                          <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Restaurant</h3>
                                          <p className="mt-1 text-sm text-gray-600">
                                                Fill in the details below to add a new restaurant to your platform.
                                          </p>
                                    </div>
                              </div>

                              <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form onSubmit={handleSubmit}>
                                          <div className="shadow sm:rounded-md sm:overflow-hidden">
                                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                                      {/* Basic Information */}
                                                      <div>
                                                            <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                                                            <div className="grid grid-cols-6 gap-6">
                                                                  <div className="col-span-6 sm:col-span-4">
                                                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                                              Restaurant Name *
                                                                        </label>
                                                                        <input
                                                                              type="text"
                                                                              name="name"
                                                                              id="name"
                                                                              value={formData.name}
                                                                              onChange={handleChange}
                                                                              required
                                                                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        />
                                                                  </div>

                                                                  <div className="col-span-6 sm:col-span-2">
                                                                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                                                              Rating *
                                                                        </label>
                                                                        <input
                                                                              type="number"
                                                                              name="rating"
                                                                              id="rating"
                                                                              min="0"
                                                                              max="5"
                                                                              step="0.1"
                                                                              value={formData.rating}
                                                                              onChange={handleChange}
                                                                              required
                                                                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        />
                                                                  </div>

                                                                  <div className="col-span-6">
                                                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                                                              Location *
                                                                        </label>
                                                                        <input
                                                                              type="text"
                                                                              name="location"
                                                                              id="location"
                                                                              value={formData.location}
                                                                              onChange={handleChange}
                                                                              required
                                                                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        />
                                                                  </div>

                                                                  <div className="col-span-6 sm:col-span-3">
                                                                        <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">
                                                                              Cuisine Type
                                                                        </label>
                                                                        <input
                                                                              type="text"
                                                                              name="cuisine"
                                                                              id="cuisine"
                                                                              value={formData.cuisine}
                                                                              onChange={handleChange}
                                                                              placeholder="e.g., Italian, Chinese, Indian"
                                                                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        />
                                                                  </div>

                                                                  <div className="col-span-6 sm:col-span-3">
                                                                        <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">
                                                                              Price Range
                                                                        </label>
                                                                        <select
                                                                              name="priceRange"
                                                                              id="priceRange"
                                                                              value={formData.priceRange}
                                                                              onChange={handleChange}
                                                                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                        >
                                                                              <option value="">Select price range</option>
                                                                              <option value="$">$ - Budget friendly</option>
                                                                              <option value="$$">$$ - Moderate</option>
                                                                              <option value="$$$">$$$ - Expensive</option>
                                                                              <option value="$$$$">$$$$ - Very expensive</option>
                                                                        </select>
                                                                  </div>

                                                                  <div className="col-span-6">
                                                                        <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                                                                              Description *
                                                                        </label>
                                                                        <textarea
                                                                              name="details"
                                                                              id="details"
                                                                              rows={4}
                                                                              value={formData.details}
                                                                              onChange={handleChange}
                                                                              required
                                                                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                              placeholder="Describe the restaurant, ambiance, specialties, etc."
                                                                        />
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      {/* Contact Information */}
                                                      <div>
                                                            <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
                                                            <div className="grid grid-cols-6 gap-6">
                                                                  <div className="col-span-6 sm:col-span-3">
                                                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                                              Phone Number
                                                                        </label>
                                                                        <input
                                                                              type="tel"
                                                                              name="phone"
                                                                              id="phone"
                                                                              value={formData.phone}
                                                                              onChange={handleChange}
                                                                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        />
                                                                  </div>

                                                                  <div className="col-span-6 sm:col-span-3">
                                                                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                                                                              Website
                                                                        </label>
                                                                        <input
                                                                              type="url"
                                                                              name="website"
                                                                              id="website"
                                                                              value={formData.website}
                                                                              onChange={handleChange}
                                                                              placeholder="https://..."
                                                                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        />
                                                                  </div>

                                                                  <div className="col-span-6">
                                                                        <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700">
                                                                              Opening Hours
                                                                        </label>
                                                                        <input
                                                                              type="text"
                                                                              name="openingHours"
                                                                              id="openingHours"
                                                                              value={formData.openingHours}
                                                                              onChange={handleChange}
                                                                              placeholder="e.g., Mon-Sun: 11AM-11PM"
                                                                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        />
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      {/* Image */}
                                                      <div>
                                                            <h4 className="text-md font-medium text-gray-900 mb-4">Restaurant Image</h4>
                                                            <div className="grid grid-cols-6 gap-6">
                                                                  <div className="col-span-6">
                                                                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                                                              Image URL
                                                                        </label>
                                                                        <div className="mt-1 flex rounded-md shadow-sm">
                                                                              <input
                                                                                    type="url"
                                                                                    name="image"
                                                                                    id="image"
                                                                                    value={formData.image}
                                                                                    onChange={handleChange}
                                                                                    placeholder="https://example.com/image.jpg"
                                                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-l-md sm:text-sm border-gray-300"
                                                                              />
                                                                              <button
                                                                                    type="button"
                                                                                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                                              >
                                                                                    <Upload className="h-4 w-4" />
                                                                              </button>
                                                                        </div>
                                                                        <p className="mt-2 text-sm text-gray-500">
                                                                              Provide a URL to the restaurant's image. Leave empty to use default image.
                                                                        </p>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </div>

                                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                                      <button
                                                            type="button"
                                                            onClick={() => router.back()}
                                                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                                                      >
                                                            Cancel
                                                      </button>
                                                      <button
                                                            type="submit"
                                                            disabled={loading}
                                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                                      >
                                                            <Save className="h-4 w-4 mr-2" />
                                                            {loading ? 'Creating...' : 'Create Restaurant'}
                                                      </button>
                                                </div>
                                          </div>
                                    </form>
                              </div>
                        </div>
                  </div>
            </AdminLayout>
      );
}