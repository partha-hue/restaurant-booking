"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  Building2,
  Eye,
  AlertCircle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Offer {
  _id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder: number;
  maximumDiscount: number;
  startDate: string;
  endDate: string;
  applicableTo: 'all' | 'specific_restaurants';
  restaurantIds: string[];
  usageLimit: number;
  usagePerUser: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminOffers() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
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
      fetchOffers();
    }
  }, [status]);

  useEffect(() => {
    let filtered = offers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(offer => {
        const endDate = new Date(offer.endDate);
        if (statusFilter === "active") return offer.isActive && endDate > now;
        if (statusFilter === "expired") return endDate < now;
        if (statusFilter === "inactive") return !offer.isActive;
        return true;
      });
    }

    setFilteredOffers(filtered);
  }, [offers, searchTerm, statusFilter]);

  const fetchOffers = async () => {
    try {
      const res = await fetch("/api/offers");
      if (!res.ok) throw new Error("Failed to fetch offers");
      const data = await res.json();
      setOffers(data);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/offers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete offer");

      setOffers(prev => prev.filter(o => o._id !== id));
      toast.success("Offer deleted successfully");
    } catch (error) {
      console.error("Failed to delete offer:", error);
      toast.error("Failed to delete offer");
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusBadge = (offer: Offer) => {
    const now = new Date();
    const endDate = new Date(offer.endDate);

    if (!offer.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Inactive
        </span>
      );
    } else if (endDate > now) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Expired
        </span>
      );
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
            <h1 className="text-3xl font-bold tracking-tight">Offers Management</h1>
            <p className="text-muted-foreground">
              Manage promotional offers and discounts
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => router.push('/admin/offers/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Offer
            </button>
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
                placeholder="Search offers..."
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
              <option value="all">All Offers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map((offer) => (
            <div key={offer._id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="relative">
                <img
                  src="/layer1.jpg"
                  alt={offer.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(offer)}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {offer.title}
                  </h3>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Tag className="h-4 w-4 mr-1" />
                  {offer.discountType === 'percentage'
                    ? `${offer.discountValue}% off`
                    : `$${offer.discountValue} off`
                  }
                  {offer.minimumOrder > 0 && (
                    <span className="ml-2">• Min. order: ${offer.minimumOrder}</span>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {offer.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  Valid: {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  Usage: {offer.usageCount || 0}
                  {offer.usageLimit > 0 && ` / ${offer.usageLimit}`}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Created: {new Date(offer.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/admin/offers/${offer._id}/edit`)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(offer._id)}
                      disabled={deleteLoading === offer._id}
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {deleteLoading === offer._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No offers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first promotional offer.'}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <div className="mt-6">
                <button
                  onClick={() => router.push('/admin/offers/new')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Offer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Tag className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Offers
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {offers.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Offers
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {offers.filter(o => o.isActive && new Date(o.endDate) > new Date()).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-red-400"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Expired Offers
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {offers.filter(o => new Date(o.endDate) < new Date()).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
