"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../components/AdminLayout";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";

interface RestaurantForm {
        name: string;
        location: string;
        rating: string;
        details: string;
        image: string;
        cuisine: string;
        priceRange: string;
        phone: string;
        website: string;
        openingHours: string;
}

export default function EditRestaurantPage() {
        const params = useParams();
        const router = useRouter();
        const restaurantId = params.id as string;

        const [loading, setLoading] = useState(false);
        const [fetching, setFetching] = useState(true);
        const [formData, setFormData] = useState<RestaurantForm>({
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

        useEffect(() => {
                if (restaurantId) {
                        void fetchRestaurant();
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [restaurantId]);

        const fetchRestaurant = async () => {
                try {
                        const res = await fetch(`/api/admin/restaurants/${restaurantId}`, { cache: "no-store" });
                        if (!res.ok) {
                                throw new Error("Failed to fetch restaurant");
                        }

                        const data = await res.json();
                        setFormData({
                                name: data.name || "",
                                location: data.location || "",
                                rating: String(data.rating ?? ""),
                                details: data.details || "",
                                image: data.image || "",
                                cuisine: data.cuisine || "",
                                priceRange: data.priceRange || "",
                                phone: data.phone || "",
                                website: data.website || "",
                                openingHours: data.openingHours || "",
                        });
                } catch (error) {
                        console.error(error);
                        toast.error("Failed to load restaurant details");
                        router.push("/admin/restaurants");
                } finally {
                        setFetching(false);
                }
        };

        const handleChange = (
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
        ) => {
                setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        };

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                setLoading(true);

                try {
                        const payload = {
                                ...formData,
                                rating: Number(formData.rating) || 0,
                        };

                        const res = await fetch(`/api/admin/restaurants/${restaurantId}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(payload),
                        });

                        const data = await res.json();
                        if (!res.ok) {
                                throw new Error(data.error || "Failed to update restaurant");
                        }

                        toast.success("Restaurant updated successfully");
                        router.push("/admin/restaurants");
                } catch (error: any) {
                        toast.error(error.message || "Failed to update restaurant");
                } finally {
                        setLoading(false);
                }
        };

        if (fetching) {
                return (
                        <AdminLayout>
                                <div className="flex items-center justify-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                                </div>
                        </AdminLayout>
                );
        }

        return (
                <AdminLayout>
                        <Toaster position="top-right" />
                        <div className="px-4 py-8 sm:px-6 lg:px-8">
                                <div className="mb-8 flex items-center justify-between">
                                        <button
                                                onClick={() => router.push("/admin/restaurants")}
                                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                                <ArrowLeft className="h-4 w-4 mr-2" />
                                                Back
                                        </button>
                                        <h1 className="text-2xl font-bold text-gray-900">Edit Restaurant</h1>
                                </div>

                                <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Restaurant name"
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                                <input
                                                        name="location"
                                                        value={formData.location}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Location"
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                                <input
                                                        name="rating"
                                                        type="number"
                                                        min="0"
                                                        max="5"
                                                        step="0.1"
                                                        value={formData.rating}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Rating"
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                                <input
                                                        name="cuisine"
                                                        value={formData.cuisine}
                                                        onChange={handleChange}
                                                        placeholder="Cuisine"
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                                <input
                                                        name="priceRange"
                                                        value={formData.priceRange}
                                                        onChange={handleChange}
                                                        placeholder="Price range"
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                                <input
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="Phone"
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                                <input
                                                        name="website"
                                                        value={formData.website}
                                                        onChange={handleChange}
                                                        placeholder="Website"
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                                <input
                                                        name="openingHours"
                                                        value={formData.openingHours}
                                                        onChange={handleChange}
                                                        placeholder="Opening hours"
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                        </div>

                                        <input
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                placeholder="Image URL"
                                                className="w-full border border-gray-300 rounded-md p-2"
                                        />

                                        <textarea
                                                name="details"
                                                value={formData.details}
                                                onChange={handleChange}
                                                rows={4}
                                                required
                                                placeholder="Details"
                                                className="w-full border border-gray-300 rounded-md p-2"
                                        />

                                        <div className="flex justify-end">
                                                <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                                >
                                                        <Save className="h-4 w-4 mr-2" />
                                                        {loading ? "Saving..." : "Save Changes"}
                                                </button>
                                        </div>
                                </form>
                        </div>
                </AdminLayout>
        );
}
